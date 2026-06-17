---
title: nix-config 审查与优化建议
created: 2026-06-01
updated: 2026-06-01
type: concept
tags: [linux, engineering]
sources: []
confidence: high
---

## 概述

对 [viryoke/nix-config](https://github.com/viryoke/nix-config) 的系统审查。
配置结构：Flakes + Home Manager + Niri + NVIDIA，目标机器为 14900KF/RTX 4060/64GB 台式机。

**整体评价**：结构清晰，8 文件精简设计符合你的偏好。以下是按优先级排列的改进建议。

---

## 现有结构

```
nix-config/
├── flake.nix                          # 入口（4 inputs）
├── flake.lock                         # 锁定依赖
├── hosts/desktop/
│   ├── default.nix                    # 系统配置（201 行）
│   └── hardware-configuration.nix     # 硬件配置（占位符）
└── home/
    ├── default.nix                    # 用户配置（203 行）
    ├── niri.nix                       # Niri 配置（193 行）
    └── dev.nix                        # 开发备注（27 行，基本为空）
```

---

## 🔴 高优先级（应修复）

### 1. greetd 配置问题：tuigreet 的 $HOME 展开

```nix
# 当前：
command = "${pkgs.tuigreet}/bin/tuigreet --time --cmd $HOME/.wayland-session";

# 问题：tuigreet 运行时 $HOME 指向 greetd 用户（_greeter），不是 viryoke
# .wayland-session 在 /home/viryoke/ 下，tuigreet 找不到它
```

**修复方案**：使用绝对路径

```nix
services.greetd = {
  enable = true;
  settings = {
    default_session = {
      user = username;  # 用你的用户运行 greetd
      command = "${pkgs.tuigreet}/bin/tuigreet --time --cmd /home/${username}/.wayland-session";
    };
  };
};
```

或者更可靠的方式——直接使用 niri-session：

```nix
services.greetd = {
  enable = true;
  settings = {
    default_session = {
      user = username;
      command = "${pkgs.tuigreet}/bin/tuigreet --time --cmd niri-session";
    };
  };
};
```

### 2. Hermes 安装脚本错误

```nix
# 当前：
home.activation.installHermes = lib.hm.dag.entryAfter ["writeBoundary"] ''
  $DRY_RUN_CMD npm install -g @anthropic-ai/hermes-agent 2>/dev/null || true
'';
```

**问题**：
- 包名 `@anthropic-ai/hermes-agent` 不存在（应该是 `@anthropic-ai/claude-code` 或实际的 hermes 包名）
- `npm install -g` 在 NixOS 中不推荐——违反声明式原则
- `2>/dev/null || true` 静默失败，出问题时无法诊断

**修复方案**：

```nix
# 方案 A：直接用 nixpkgs 安装（如果有）
home.packages = with pkgs; [
  hermes-agent  # 如果 nixpkgs 中有
];

# 方案 B：使用 npm 全局目录（当前方式但修正）
home.activation.installHermes = lib.hm.dag.entryAfter ["writeBoundary"] ''
  if ! command -v hermes &>/dev/null; then
    $DRY_RUN_CMD ${pkgs.nodejs_22}/bin/npm install -g @anthropic-ai/claude-code 2>&1 || echo "Hermes install failed"
  fi
'';
```

### 3. dev.nix 是空文件

```nix
# 当前 dev.nix 只有注释，没有实际配置
{ ... }:
{
  # All dev packages are in home/default.nix home.packages
  # This file is for additional dev-specific configuration
}
```

**建议**：要么填充实际内容（ML 开发环境、Python 环境配置），要么删除它并从 `home/default.nix` 的 imports 中移除。空文件 + 空 imports 违反你的精简原则。

---

## 🟡 中优先级（推荐改进）

### 4. 缺少 Swap 配置

```nix
# hardware-configuration.nix 中：
swapDevices = [ ];
```

**64GB 内存是否需要 swap？** 对于 ML 训练场景：

```nix
# 使用 swap 文件（比分区更灵活）
swapDevices = [
  {
    device = "/var/lib/swapfile";
    size = 16384;  # 16GB swap file
  }
];
```

或者使用 zram（内存压缩，不需要磁盘）：

```nix
zramSwap = {
  enable = true;
  algorithm = "zstd";
  memoryPercent = 25;  # 25% of RAM = 16GB
};
```

### 5. 缺少 Secrets 管理

当前 Git 邮箱和用户名硬编码在配置中：

```nix
programs.git = {
  userName = "viryoke";
  userEmail = "viryoke@gmail.com";
};
```

这对公开仓库没问题。但如果以后需要存储 API key、SSH 私钥等，建议引入 sops-nix：

```nix
# flake.nix inputs
sops-nix.url = "github:Mic92/sops-nix";

# hosts/desktop/default.nix
sops = {
  defaultSopsFile = ./secrets.yaml;
  secrets = {
    "github_token".owner = username;
  };
};
```

### 6. greetd 和 GDM 冲突风险

```nix
# 同时启用了 greetd 和 GDM
services.greetd.enable = true;

services.xserver = {
  enable = true;
  desktopManager.gnome.enable = true;
  displayManager.gdm.enable = true;  # GDM
};
```

**问题**：两个 display manager 同时启用可能导致冲突。

**建议**：选择其一。如果主要用 Niri，用 greetd；如果需要 GNOME 回退，用 GDM：

```nix
# 方案 A：只用 greetd（推荐）
services.greetd.enable = true;
services.xserver.displayManager.gdm.enable = false;

# 方案 B：只用 GDM
services.greetd.enable = false;
services.xserver.displayManager.gdm.enable = true;
```

### 7. 缺少 fzf 集成

fzf 已安装但缺少 shell 集成：

```nix
programs.fzf = {
  enable = true;
  enableZshIntegration = true;
  catppuccin.enable = true;
};
```

### 8. 缺少 zoxide 集成

```nix
programs.zoxide = {
  enable = true;
  enableZshIntegration = true;
};
```

### 9. 缺少 eza 别名

eza 已安装但没有 shell 别名替代 `ls`：

```nix
# home/default.nix shellAliases 中添加
shellAliases = {
  # 现有...
  ls = "eza";
  ll = "eza -la";
  la = "eza -a";
  lt = "eza --tree -L 2";
};
```

---

## 🟢 低优先级（可选优化）

### 10. NVIDIA open 驱动考量

```nix
# 当前使用闭源驱动
hardware.nvidia.open = false;
```

RTX 4060 是 Ada Lovelace 架构（2023+），NVIDIA 开源驱动已对此架构有良好支持。如果追求更好的 Wayland 兼容性，可以尝试：

```nix
hardware.nvidia.open = true;
```

但闭源驱动仍然是更稳定的选择，特别是 ML 工作负载。

### 11. 镜像源顺序

```nix
# 当前顺序：USTC → TUNA → cache.nixos.org
substituters = [
  "https://mirrors.ustc.edu.cn/nix-channels/store"
  "https://mirrors.tuna.tsinghua.edu.cn/nix-channels/store"
  "https://cache.nixos.org"
];
```

建议将 `cache.nixos.org` 放在第一个（作为 fallback 签名验证），国内镜像放后面：

```nix
substituters = [
  "https://cache.nixos.org"
  "https://mirrors.ustc.edu.cn/nix-channels/store"
  "https://mirrors.tuna.tsinghua.edu.cn/nix-channels/store"
];
```

### 12. 缺少 trusted-public-keys

使用国内镜像时建议添加公钥验证：

```nix
nix.settings = {
  substituters = [ ... ];
  trusted-public-keys = [
    "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="
  ];
};
```

### 13. Niri 配置可以考虑从 KDL 字符串迁移到 niri-flake 模块

当前 Niri 配置是内嵌 KDL 字符串（`xdg.configFile."niri/config.kdl".text`）。niri-flake 提供了 Nix 原生配置选项，但 KDL 字符串方式更灵活且文档更丰富。当前方式没有明显问题，保持即可。

---

## 结构评估

| 维度 | 评分 | 说明 |
|------|------|------|
| 精简度 | ⭐⭐⭐⭐⭐ | 8 文件，完美符合你的偏好 |
| 结构清晰度 | ⭐⭐⭐⭐ | 分层合理，hosts/home 分离 |
| NVIDIA 配置 | ⭐⭐⭐⭐ | 完整，Wayland 环境变量齐全 |
| 安全性 | ⭐⭐⭐ | SSH 配置合理，缺 secrets 管理 |
| 可维护性 | ⭐⭐⭐⭐ | Flakes + 模块化，清晰 |
| 完整性 | ⭐⭐⭐ | 缺 swap、fzf/zoxide/eza 集成 |

---

## 建议的改进后结构

```
nix-config/
├── flake.nix
├── hosts/desktop/
│   ├── default.nix         # 系统配置
│   └── hardware-configuration.nix
├── home/
│   ├── default.nix         # 用户配置（合并 dev.nix）
│   ├── niri.nix            # Niri 配置
│   ├── shell.nix           # Shell 配置（从 default.nix 分离）
│   └── dev.nix             # ML 开发环境（填充实际内容）
└── secrets/                # 未来：sops-nix secrets
    └── secrets.yaml
```

**核心变更**：
1. 删除空的 dev.nix 或填充内容
2. 从 default.nix 中分离 shell 配置到 shell.nix（当 default.nix 超 200 行时）
3. 添加 secrets/ 目录（按需）

---

## 行动清单

### 立即可做（5 分钟）
1. 修复 greetd 的 $HOME 路径
2. 修正 Hermes 安装脚本
3. 添加 fzf/zoxide/eza 的 Home Manager 模块

### 安装 NixOS 后做（30 分钟）
4. 运行 `nixos-generate-config --show-hardware-config` 替换占位符
5. 配置 swap（zram 推荐）
6. 决定 greetd vs GDM

### 未来做（按需）
7. 引入 sops-nix 管理 secrets
8. 考虑分离 shell.nix
9. 填充 dev.nix 的 ML 开发环境配置

---

## 相关概念

- [[nixos-overview]] — NixOS 核心理念与架构
- [[nixos-flakes]] — Flakes 机制详解
- [[nixos-home-manager]] — Home Manager 用户配置
- [[nixos-wayland-niri]] — Wayland 与 Niri 合成器
- [[nixos-nvidia]] — NVIDIA GPU 配置
