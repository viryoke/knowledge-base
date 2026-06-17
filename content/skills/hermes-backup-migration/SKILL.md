---
name: hermes-backup-migration
description: "将 Hermes Agent 的配置、技能、会话、记忆等关键资产备份到 Git 仓库，并跨机器迁移恢复"
version: 1.0.0
author: agent
metadata:
  hermes:
    tags: [hermes, backup, migration, git, sqlite]
---

# Hermes Backup & Migration

将 `~/.hermes/` 中的使用积累资产（配置、技能、会话、记忆、定时任务等）同步到私有 Git 仓库，方便跨机器迁移。

## 触发条件

- 用户要求备份 Hermes 配置/数据到 GitHub 或其他 Git 服务
- 用户要在新机器上恢复 Hermes 环境
- 用户询问如何迁移 Hermes 到另一台电脑

## 备份范围

### 应备份（使用积累的关键资产）

| 文件/目录 | 说明 |
|-----------|------|
| `config.yaml` | 用户配置 |
| `.env` | API 密钥（仓库必须 private） |
| `auth.json` | OAuth 令牌 |
| `SOUL.md` | 自定义人格 |
| `personas/` | 用户定义的 persona |
| `memories/` | 记忆文件（MEMORY.md + USER.md） |
| `state.db` → `state.sql.gz` | 会话数据库（**必须用 SQL dump**） |
| `kanban.db` | 看板数据 |
| `cron/` | 定时任务配置和历史输出 |
| `skills/` | 所有技能（SKILL.md 文件） |
| `pairing/` | 平台授权记录（如 feishu-approved.json） |

### 不应备份（安装产物 / 运行时临时文件）

| 文件/目录 | 原因 |
|-----------|------|
| `hermes-agent/` | 源码，新机器重新安装即可（~1GB） |
| `bin/` | 二进制工具，随安装生成 |
| `logs/` | 日志，无持久价值 |
| `cache/` | 缓存，可重建 |
| `pastes/` | 临时粘贴板 |
| `sessions/*.json` | 运行时请求转储 |
| `config.yaml.bak.*` | 配置备份，已有 git 历史 |
| `*.lock` | 运行时锁文件 |
| `*.shm` / `*.wal` | SQLite WAL 辅助文件 |
| `*.pid` | 进程 ID 文件 |
| `.install_method` | 安装元数据 |
| `.update_check` | 更新检查缓存 |
| `.skills_prompt_snapshot.json` | 技能快照缓存 |
| `.hermes_history` | shell 历史 |
| `skills/.hub/` | Hub 索引缓存 |
| `skills/.bundled_manifest` | 内置技能清单（随安装生成） |
| `skills/.curator_state` | curator 运行时状态 |
| `models_dev_cache.json` | 模型缓存 |
| `ollama_cloud_models_cache.json` | Ollama 模型缓存 |
| `channel_directory.json` | 频道目录缓存 |
| `gateway_state.json` | 网关运行时状态 |
| `feishu_seen_message_ids.json` | 飞书已读消息 ID |
| `processes.json` | 进程状态 |
| `pairing/_rate_limits.json` | 速率限制运行时状态 |

## 关键陷阱：state.db 跨平台迁移

**绝对不要**直接把 `state.db` 二进制文件通过 git 同步。原因：
- Git 可能对二进制 SQLite 文件做行尾转换，导致数据库损坏
- 即使设置了 `core.autocrlf=false`，不同 SQLite 版本或 WAL 模式也可能产生不兼容
- `hermes doctor` 会报 `database disk image is malformed`

**正确做法**：用 SQL dump 替代二进制文件

```bash
# 导出（在原机器上）
sqlite3 ~/.hermes/state.db ".dump" | gzip -9 > state.sql.gz

# 恢复（在新机器上，必须先停止 Hermes）
hermes gateway stop  # 如果跑了 gateway
gunzip -k state.sql.gz
rm -f state.db state.db-shm state.db-wal  # 清理所有旧文件
sqlite3 state.db < state.sql
rm -f state.sql
chmod 600 state.db
```

## 备份流程

### 1. 创建私有仓库

```bash
gh repo create <user>/hermes-config --private --description "Hermes Agent config backup"
```

### 2. 准备目录

```bash
mkdir -p /tmp/hermes-sync && cd /tmp/hermes-sync
rsync -a ~/.hermes/ . --exclude='hermes-agent/.git'

# 生成 SQL dump 替代 state.db
sqlite3 state.db ".dump" | gzip -9 > state.sql.gz
rm -f state.db state.db-shm state.db-wal
```

### 3. 清理不需要的文件

```bash
# 删除安装产物和运行时文件
rm -rf hermes-agent/ bin/ logs/ cache/ pastes/
rm -f config.yaml.bak.* *.lock *.shm *.wal *.pid
rm -f .install_method .update_check .hermes_history
rm -f skills/.bundled_manifest skills/.curator_state
rm -rf skills/.hub/
rm -f models_dev_cache.json ollama_cloud_models_cache.json
rm -f channel_directory.json gateway_state.json
rm -f feishu_seen_message_ids.json processes.json
rm -f pairing/_rate_limits.json
```

### 4. 添加恢复脚本

将 `scripts/restore-state.sh` 复制到仓库根目录。

### 5. 提交并推送

```bash
git init && git checkout -b main
git add -A
git commit -m "Hermes backup: config, skills, memory, sessions, cron"
git remote add origin https://github.com/<user>/hermes-config.git
git push -u origin main
```

## 恢复流程（新机器）

### 1. 安装 Hermes

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

### 2. 克隆配置

```bash
cd ~/.hermes
git init
git remote add origin https://github.com/<user>/hermes-config.git
git fetch origin main
git checkout -b main origin/main
```

### 3. 恢复 state.db

```bash
# 先停止所有 Hermes 进程
hermes gateway stop

# 运行恢复脚本
./restore-state.sh

# 或手动执行
gunzip -k state.sql.gz
rm -f state.db state.db-shm state.db-wal
sqlite3 state.db < state.sql
rm -f state.sql
chmod 600 state.db
```

### 4. 重新认证

```bash
# OAuth 令牌可能需要重新认证（设备绑定）
hermes auth
hermes doctor
```

## 定期更新

在 `~/.hermes/` 中直接操作 git 仓库，定期提交变更：

```bash
cd ~/.hermes
# 更新 SQL dump（如果会话数据有变化）
sqlite3 state.db ".dump" | gzip -9 > state.sql.gz

# 提交其他变更
git add -A
git commit -m "Update config/skills/memory"
git push origin main
```

注意：`.gitignore` 应该排除安装产物和运行时文件，避免误提交。

## 支持文件

- `scripts/restore-state.sh` — 自动恢复 state.db 的脚本，包含清理 WAL/SHM、验证完整性等步骤
