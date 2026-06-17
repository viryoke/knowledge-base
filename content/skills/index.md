---
title: Skills 索引
created: 2026-06-10
updated: 2026-06-17
type: summary
tags: [engineering]
sources: []
---

# Skills 索引

本目录存放 AI Agent 在交互过程中提炼的**可复用操作流程**。

每个 skill 代表一种经过验证的工作模式，遵循 [Agent Skills 开放标准](https://agentskills.io)，下次遇到类问题时可直接调用，无需从头推导。

## 存储架构

文件实体存放在本目录（`ObsidianVault/skills/`），同时作为 Hermes Agent 的运行时 skill 使用。

`~/.hermes/skills/` 中通过 symlink 指向本目录，实现双写：
- **知识库侧**：可版本控制、可浏览、可审查
- **Hermes 侧**：运行时正常加载，功能不受影响

## 目录结构

每个 skill 以独立目录存放：

```
skills/
├── index.md                  # 本文件
└── {skill-name}/             # 小写连字符命名
    ├── SKILL.md              # 必需：元数据 + 指令
    ├── scripts/              # 可选：可执行脚本
    ├── references/           # 可选：参考文档
    └── templates/            # 可选：模板文件
```

## 当前 Skills（9 个）

### DevOps 运维（4 个）

| Skill | 触发场景 | 说明 |
|-------|----------|------|
| [[clash-verge-rev]] | 配置/排障 Clash Verge Rev | TUN 模式、规则模板、IPv6、代理规则分层 |
| [[quartz-obsidian-wiki]] | 部署 Obsidian Vault 为静态网站 | Quartz 5 + GitHub Pages，含 Midnight Scholar 主题、图表美化、CI/CD |
| [[hermes-backup-migration]] | 备份/迁移 Hermes Agent 资产 | Git 仓库备份、跨机器恢复 |
| [[hermes-config-backup]] | 备份 Hermes 配置 | config/skills/memory/sessions/cron |

### 开发环境（2 个）

| Skill | 触发场景 | 说明 |
|-------|----------|------|
| [[hermes-python-package-installation]] | 为 Hermes 安装 Python 包 | 正确 venv 路径、避免 PEP 668 |
| [[ai-dev-environment-setup]] | 搭建 AI/ML Python 开发环境 | PyTorch+CUDA 版本兼容、uv、Ollama |

### 系统配置（1 个）

| Skill | 触发场景 | 说明 |
|-------|----------|------|
| [[nixos-setup]] | 配置 NixOS 系统 | GPU 驱动、镜像源、输入法、桌面环境 |

### 内容创作（2 个）

| Skill | 触发场景 | 说明 |
|-------|----------|------|
| [[presentation-workflow]] | 生成演示文稿/PPT/幻灯片 | HTML→PDF 为主，PPTX 为备选 |
| [[youtube-content]] | 获取 YouTube 字幕/转录 | fetch_transcript.py + yt-dlp 备选 |

## Skill 提炼来源

- Agent 在任务执行中识别提炼信号（用户纠正、复杂任务成功、非平凡方案）
- 用户将个人经验显式沉淀为可执行流程
- 成功解决方案的标准化提炼
