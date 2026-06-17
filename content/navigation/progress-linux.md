---
title: Linux/NixOS 学习进度
created: 2026-06-01
updated: 2026-06-01
type: summary
tags: [linux]
sources: []
confidence: high
---

# Linux/NixOS 学习进度

> 目标：系统掌握 NixOS，能独立配置、维护、优化一套声明式桌面/开发环境。

---

## Phase 1: NixOS 基础（1-2 周）

### Step 1: 核心理念
- [x] [[nixos-overview|NixOS 核心理念与架构]]：声明式、不可变、可复现
- [x] [[nix-language|Nix 表达式语言]]：语法、类型、函数、模块
> 依然还有很多概念没看懂,在实操阶段逐步理解清楚吧

### Step 2: Flakes 机制
- [ ] [[nixos-flakes|Flakes 详解]]：inputs/outputs、lock 文件、多主机管理

### Step 3: Home Manager
- [ ] [[nixos-home-manager|Home Manager]]：用户级声明式配置、模块体系

---

## Phase 2: 桌面环境（1-2 周）

### Step 4: Wayland + Niri
- [ ] [[nixos-wayland-niri|Wayland 与 Niri 合成器]]：Wayland 协议、Niri 配置、KDL 语法

### Step 5: NVIDIA 驱动
- [ ] [[nixos-nvidia|NVIDIA GPU 配置]]：闭源驱动、Wayland 兼容、CUDA/容器

---

## Phase 3: 实战优化（持续）

### Step 6: 我的配置审查
- [ ] [[nixos-config-review|nix-config 审查与优化建议]]：结构、安全、性能、最佳实践

### Step 7: 进阶话题（按需）
- [ ] NixOS 模块系统深入（module system, options, types）
- [ ] Nix overlays 与包定制
- [ ] Secrets 管理（sops-nix / agenix）
- [ ] 远程构建与 CI/CD（nix build, nix-daemon）
- [ ] 多主机同步与部署（deploy-rs, colmena）

---

## 总进度

| Phase | 主题 | 已学/总数 | 进度 |
|-------|------|-----------|------|
| 1 | NixOS 基础 | 0/4 | 0% |
| 2 | 桌面环境 | 0/2 | 0% |
| 3 | 实战优化 | 0/6 | 0% |
| **总计** | | **0/12** | **0%** |

---

## 学习资源

- 官方手册：[NixOS Manual](https://nixos.org/manual/nixos/stable/) / [Nixpkgs Manual](https://nixos.org/manual/nixpkgs/stable/)
- Nix Pills：[nix-pills](https://nixos.org/guides/nix-pills/) — Nix 语言入门
- Home Manager：[home-manager manual](https://nix-community.github.io/home-manager/)
- Niri Wiki：[niri wiki](https://github.com/YaLTeR/niri/wiki)
- 社区配置参考：
  - [Misterio77/nix-starter-configs](https://github.com/Misterio77/nix-starter-configs) — 极简模板
  - [ryan4yin/nix-config](https://github.com/ryan4yin/nix-config) — 详尽参考（但过于复杂）
  - [NixOS-CN](https://github.com/nixos-cn/flakes) — 中文社区
