# GitHub Actions 访问 Private Vault 的 PAT 配置

## 问题

GitHub Actions 的默认 `GITHUB_TOKEN` 只能访问当前 repository，无法 checkout 其他 private repository。如果 vault 是 private，需要 Personal Access Token (PAT)。

## 错误示例

```yaml
# ❌ 错误：使用 GITHUB_TOKEN
- name: Checkout Obsidian Vault
  uses: actions/checkout@v4
  with:
    repository: viryoke/obsidian-vault
    token: ${{ secrets.GITHUB_TOKEN }}  # 无法访问 private repo
    path: ../ObsidianVault              # 路径在 workspace 外
```

**错误信息**：
```
Error: Repository path '/home/runner/work/knowledge-base/ObsidianVault' is not under '/home/runner/work/knowledge-base/knowledge-base'
```

或者：
```
Error: Not Found - https://docs.github.com/rest/repos/repos#get-a-repository
```

## 正确配置

### 1. 生成 PAT

```bash
# 使用 gh CLI 获取当前 token（需要 repo scope）
gh auth token
```

或者手动创建：
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` scope（完整仓库访问权限）
4. 复制生成的 token

### 2. 添加 PAT 到 Quartz repo secrets

```bash
# 将 PAT 添加到 Quartz repository 的 secrets
gh secret set VAULT_PAT --repo your-username/knowledge-base
# 粘贴 token 后回车
```

### 3. 更新 workflow

```yaml
# ✅ 正确：使用 PAT + workspace 内路径
- name: Checkout Obsidian Vault
  uses: actions/checkout@v4
  with:
    repository: viryoke/obsidian-vault
    token: ${{ secrets.VAULT_PAT }}  # 使用 PAT
    path: vault                      # 必须在 workspace 内

- name: Sync content from vault
  run: VAULT_DIR=vault bash sync-content.sh  # 环境变量覆盖
```

## 关键要求

1. **必须使用 PAT**：`GITHUB_TOKEN` 无法访问其他 private repository
2. **path 必须在 workspace 内**：使用相对路径如 `vault`，不能是 `../vault`
3. **使用环境变量覆盖**：`VAULT_DIR=vault` 让 `sync-content.sh` 知道 vault 位置

## sync-content.sh 支持环境变量

```bash
#!/bin/bash
# 支持环境变量覆盖（CI 环境需要）
VAULT_DIR="${VAULT_DIR:-../ObsidianVault}"
CONTENT_DIR="content"

echo "Syncing vault content from $VAULT_DIR to $CONTENT_DIR..."

# ... 其余脚本内容
```

## 验证

部署成功后，检查 GitHub Actions 日志：

```
✓ Checkout Quartz
✓ Checkout Obsidian Vault
  Syncing vault content from vault to content...
    Copying concepts/
    Copying entities/
    ...
  Sync complete!
  Content summary:
    Markdown files: 166
    Non-markdown files: 58
    Directories: 43
✓ Sync content from vault
✓ Build Quartz
```

如果看到 "Not Found" 或 "Repository path is not under workspace"，检查：
- PAT 是否有 `repo` scope
- PAT 是否已添加到 Quartz repo secrets
- `path` 是否是 workspace 内的相对路径
