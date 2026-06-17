---
title: NVIDIA GPU 配置
created: 2026-06-01
updated: 2026-06-01
type: concept
tags: [linux]
sources: []
confidence: high
---

## 定义

NVIDIA GPU 在 Linux 下需要特殊的驱动和配置。在 NixOS 上，NVIDIA 驱动可以声明式地配置，包括闭源驱动、Wayland 兼容、CUDA 支持和容器集成。

---

## 驱动选择

### 闭源 vs 开源驱动

| 驱动 | 性能 | Wayland | CUDA | 推荐场景 |
|------|------|---------|------|----------|
| **闭源（nvidia）** | 最佳 | 需配置 | ✅ | 游戏、ML、专业应用 |
| **开源（nouveau）** | 差 | 原生 | ❌ | 仅桌面办公 |
| **开源（nvidia-open）** | 好 | 较好 | ✅ | 实验性，新卡 |

**推荐**：对于 RTX 4060，使用闭源驱动（稳定、性能最佳）。

---

## NixOS 基础配置

### 1. 启用 NVIDIA 驱动

```nix
# hosts/desktop/default.nix

# 指定视频驱动
services.xserver.videoDrivers = [ "nvidia" ];

# NVIDIA 配置
hardware.nvidia = {
  # 启用 modesetting（必需）
  modesetting.enable = true;
  
  # 使用闭源驱动（false）或开源驱动（true）
  open = false;
  
  # 启用 NVIDIA 设置工具
  nvidiaSettings = true;
  
  # 启用电源管理（笔记本必需）
  powerManagement.enable = true;
  
  # 使用稳定版驱动
  package = config.boot.kernelPackages.nvidiaPackages.stable;
};
```

### 2. 图形加速

```nix
# 启用硬件加速
hardware.graphics = {
  enable = true;
  enable32Bit = true;  # 32 位应用支持（游戏、Wine）
  
  extraPackages = with pkgs; [
    nvidia-vaapi-driver  # VA-API 视频加速
  ];
};
```

### 3. Wayland 环境变量

```nix
# 设置 Wayland 和 NVIDIA 兼容的环境变量
environment.sessionVariables = {
  # VA-API 驱动
  LIBVA_DRIVER_NAME = "nvidia";
  
  # GLX 供应商
  __GLX_VENDOR_LIBRARY_NAME = "nvidia";
  
  # GBM 后端
  GBM_BACKEND = "nvidia-drm";
  
  # Electron 应用使用 Wayland（而非 Xwayland）
  NIXOS_OZONE_WL = "1";
};
```

### 4. 内核参数

```nix
# 启用 NVIDIA DRM framebuffer
boot.kernelParams = [
  "nvidia-drm.fbdev=1"
];
```

---

## 完整配置示例

```nix
# hosts/desktop/default.nix
{ config, pkgs, lib, ... }:
{
  # ── NVIDIA GPU ──
  services.xserver.videoDrivers = [ "nvidia" ];

  hardware.nvidia = {
    modesetting.enable = true;
    open = false;
    nvidiaSettings = true;
    powerManagement.enable = true;
    package = config.boot.kernelPackages.nvidiaPackages.stable;
  };

  hardware.graphics = {
    enable = true;
    enable32Bit = true;
    extraPackages = with pkgs; [
      nvidia-vaapi-driver
    ];
  };

  environment.sessionVariables = {
    LIBVA_DRIVER_NAME = "nvidia";
    __GLX_VENDOR_LIBRARY_NAME = "nvidia";
    GBM_BACKEND = "nvidia-drm";
    NIXOS_OZONE_WL = "1";
  };

  boot.kernelParams = [
    "nvidia-drm.fbdev=1"
  ];

  # ── 允许非自由软件 ──
  nixpkgs.config.allowUnfree = true;
}
```

---

## CUDA 支持

### 启用 CUDA

```nix
# 启用 NVIDIA 容器工具包（Docker + CUDA）
hardware.nvidia-container-toolkit.enable = true;

# 安装 CUDA 工具
environment.systemPackages = with pkgs; [
  cudaPackages.cudatoolkit
  cudaPackages.cudnn
];
```

### PyTorch with CUDA

```nix
# 使用 uv 或 venv 安装 PyTorch
# 不推荐在 Nix 中直接安装 PyTorch（编译时间长）

# 推荐方式：使用 pip/uv
home.packages = with pkgs; [
  python312
  uv
];
```

```bash
# 在 Python 虚拟环境中安装
uv venv
source .venv/bin/activate
uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

### Docker + CUDA

```nix
# NixOS 配置
virtualisation.docker.enable = true;
hardware.nvidia-container-toolkit.enable = true;

# 用户加入 docker 组
users.users.viryoke.extraGroups = [ "docker" ];
```

```bash
# 测试 CUDA
docker run --rm --gpus all nvidia/cuda:12.1.0-base-ubuntu22.04 nvidia-smi
```

---

## Wayland 兼容性

### 1. Xwayland

大多数 X11 应用通过 Xwayland 运行：

```nix
# 自动启用（NixOS 默认）
services.xserver = {
  enable = true;
  displayManager.gdm.enable = true;
};
```

### 2. 屏幕共享

```nix
xdg.portal = {
  enable = true;
  xdgOpenUsePortal = true;
  extraPortals = with pkgs; [
    xdg-desktop-portal-gtk
    xdg-desktop-portal-gnome
  ];
};
```

### 3. Electron 应用

```nix
# 环境变量已设置 NIXOS_OZONE_WL=1
# Chrome、VSCode、Telegram 等会自动使用 Wayland

# 如果某些应用仍有问题，可以手动指定：
programs.google-chrome = {
  enable = true;
  extraOpts = {
    "--enable-features" = "UseOzonePlatform";
    "--ozone-platform" = "wayland";
  };
};
```

---

## 性能优化

### 1. 电源管理

```nix
hardware.nvidia = {
  # 启用电源管理（笔记本必需）
  powerManagement.enable = true;
  
  # 精细控制
  powerManagement.finegrained = false;  # 仅笔记本
};
```

### 2. 使用最新驱动

```nix
hardware.nvidia = {
  # 使用最新驱动（可能不稳定）
  package = config.boot.kernelPackages.nvidiaPackages.latest;
};
```

### 3. 内核模块

```nix
# 确保加载必要的内核模块
boot.initrd.kernelModules = [ "nvidia" "nvidia_modeset" "nvidia_uvm" "nvidia_drm" ];
boot.kernelModules = [ "nvidia" "nvidia_modeset" "nvidia_uvm" "nvidia_drm" ];
```

---

## 常见问题与解决

### 1. Wayland 下黑屏

```nix
# 问题：登录后黑屏
# 解决：确保设置了 DRM 参数

boot.kernelParams = [
  "nvidia-drm.fbdev=1"
];

# 或尝试禁用 framebuffer
boot.kernelParams = [
  "nvidia-drm.modeset=1"
];
```

### 2. 屏幕撕裂

```nix
# 问题：视频播放时撕裂
# 解决：启用自适应同步

hardware.nvidia = {
  modesetting.enable = true;
};

# 或在 Niri 配置中
layout {
  # 尝试不同的刷新率设置
}
```

### 3. 睡眠/休眠问题

```nix
# 问题：睡眠后无法唤醒
# 解决：启用电源管理

hardware.nvidia = {
  powerManagement.enable = true;
};

# 或禁用睡眠
systemd.targets.sleep.enable = false;
systemd.targets.hibernate.enable = false;
```

### 4. 驱动版本问题

```bash
# 查看当前驱动版本
nvidia-smi

# 查看可用版本
nix search nixpkgs nvidia

# 切换版本
hardware.nvidia.package = config.boot.kernelPackages.nvidiaPackages.stable;
# 或
hardware.nvidia.package = config.boot.kernelPackages.nvidiaPackages.production;
```

### 5. CUDA 不可用

```bash
# 检查 CUDA
nvidia-smi
# 应显示 CUDA Version: 12.x

# 检查 PyTorch
python -c "import torch; print(torch.cuda.is_available())"
# 应输出: True
```

---

## 监控工具

### nvidia-smi

```bash
# 基本信息
nvidia-smi

# 持续监控
watch -n 1 nvidia-smi

# 详细信息
nvidia-smi -q

# 查看 GPU 利用率
nvidia-smi dmon -s u
```

### nvtop

```nix
environment.systemPackages = with pkgs; [
  nvtop  # NVIDIA GPU 监控
];
```

```bash
# 启动 nvtop
nvtop
```

---

## 最佳实践

### 1. 使用稳定驱动

```nix
# 推荐：稳定版
hardware.nvidia.package = config.boot.kernelPackages.nvidiaPackages.stable;

# 避免：最新版（可能有 bug）
# hardware.nvidia.package = config.boot.kernelPackages.nvidiaPackages.latest;
```

### 2. 启用垃圾回收

```nix
# 定期清理旧的驱动版本
nix.gc = {
  automatic = true;
  dates = "weekly";
  options = "--delete-older-than 7d";
};
```

### 3. 测试配置

```bash
# 测试配置（不持久化）
sudo nixos-rebuild test --flake .#desktop

# 确认无误后再切换
sudo nixos-rebuild switch --flake .#desktop
```

### 4. 备份配置

```bash
# 备份当前配置
cp /etc/nixos/configuration.nix /etc/nixos/configuration.nix.bak

# 或使用 Git
cd ~/nix-config
git add -A
git commit -m "Before NVIDIA changes"
```

---

## 相关概念

- [[nixos-overview]] — NixOS 核心理念与架构
- [[nixos-wayland-niri]] — Wayland 与 Niri 合成器
- [[nixos-config-review]] — 我的 nix-config 审查

---

## 参考资源

- [NixOS NVIDIA 文档](https://nixos.wiki/wiki/Nvidia)
- [NVIDIA 驱动文档](https://docs.nvidia.com/datacenter/tesla/)
- [Wayland + NVIDIA](https://github.com/NVIDIA/open-gpu-kernel-modules)
- [NixOS 硬件配置](https://github.com/NixOS/nixos-hardware)
