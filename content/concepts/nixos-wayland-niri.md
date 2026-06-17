---
title: Wayland 与 Niri 合成器
created: 2026-06-01
updated: 2026-06-01
type: concept
tags: [linux]
sources: []
confidence: high
---

## 定义

**Wayland** 是 Linux 的现代显示服务器协议，替代老旧的 X11。它提供更安全、更高效的图形系统。

**Niri** 是一个基于 Wayland 的平铺窗口管理器（compositor），采用独特的"滚动平铺"布局，窗口以列形式排列，可水平滚动。

---

## Wayland vs X11

### X11 的问题

1. **安全性差**：任何应用可以读取其他应用的窗口内容
2. **架构过时**：30 年前的设计，难以扩展
3. **效率低**：不必要的往返通信
4. **撕裂问题**：垂直同步难以实现

### Wayland 的优势

1. **安全隔离**：应用无法访问其他窗口
2. **简化架构**：合成器直接管理渲染
3. **无撕裂**：内置垂直同步
4. **现代协议**：支持高 DPI、多显示器

### 架构对比

```
X11 架构：
┌─────────┐     ┌──────────┐     ┌─────────┐
│ 应用 A  │────▶│ X Server │────▶│ 显示设备 │
│ 应用 B  │────▶│          │     │         │
└─────────┘     └──────────┘     └─────────┘
                 ▲
                 │ 复杂的往返通信

Wayland 架构：
┌─────────┐     ┌────────────┐     ┌─────────┐
│ 应用 A  │────▶│ 合成器     │────▶│ 显示设备 │
│ 应用 B  │────▶│ (Compositor│     │         │
└─────────┘     └────────────┘     └─────────┘
                 直接渲染，无中间层
```

---

## Niri 合成器

### 核心理念

Niri 采用**滚动平铺**（scrolling tiling）布局：
- 窗口以**列**形式垂直堆叠
- 列可以水平排列
- 超出屏幕的列可以滚动查看

```
┌─────────────────────────────────────┐
│  列 1      列 2      列 3  (滚动)   │
│ ┌─────┐   ┌─────┐   ┌─────┐        │
│ │     │   │     │   │     │        │
│ │ Win │   │ Win │   │ Win │  →     │
│ │  A  │   │  B  │   │  C  │        │
│ │     │   │     │   │     │        │
│ └─────┘   └─────┘   └─────┘        │
│ ┌─────┐   ┌─────┐                   │
│ │ Win │   │ Win │                   │
│ │  D  │   │  E  │                   │
│ └─────┘   └─────┘                   │
└─────────────────────────────────────┘
```

### 与其他 WM 对比

| 特性 | Niri | Sway | Hyprland | i3 |
|------|------|------|----------|-----|
| 协议 | Wayland | Wayland | Wayland | X11 |
| 布局 | 滚动平铺 | 传统平铺 | 动态平铺 | 传统平铺 |
| 配置语言 | KDL | i3 config | Hyprlang | i3 config |
| 动画 | 内置 | 无 | 丰富 | 无 |
| 学习曲线 | 中等 | 低 | 高 | 低 |

---

## Niri 配置

### 配置文件位置

```
~/.config/niri/config.kdl
```

### 配置语法（KDL）

KDL（KDL Document Language）是一种简洁的配置语言：

```kdl
// 注释
节点名 "参数" {
    子节点 值
    另一个子节点 "字符串"
}
```

### 完整配置示例

```kdl
// ~/.config/niri/config.kdl

// ── 输入设备 ──
input {
    keyboard {
        xkb {
            // 从系统设置继承
        }
    }
    touchpad {
        natural-scroll
        tap-to-click
    }
    mouse {
        natural-scroll
    }
}

// ── 布局 ──
layout {
    gaps 8
    
    focus-ring {
        width 4
        active-color "#89b4fa"
        inactive-color "#45475a"
    }
    
    border {
        off
    }
    
    preset-column-widths {
        proportion 0.333333
        proportion 0.500000
        proportion 0.666667
    }
    
    default-column-width { proportion 0.5; }
}

// ── 光标 ──
cursor {
    xcursor-theme "default"
    xcursor-size 24
}

// ── 动画 ──
animations {
    // slowdown 2.0
}

// ── 窗口规则 ──
window-rule {
    geometry-corner-radius 12
    clip-to-geometry true
}

// ── 快捷键 ──
binds {
    // 终端
    Mod+Return { spawn "ghostty"; }
    
    // 应用启动器
    Mod+D { spawn "fuzzel"; }
    
    // 浏览器
    Mod+B { spawn "google-chrome"; }
    
    // 文件管理器
    Mod+E { spawn "ghostty" "-e" "yazi"; }
    
    // 锁屏
    Ctrl+Alt+L { spawn "swaylock" "-f" "-c" "1e1e2e"; }
    
    // 关闭窗口
    Mod+Q { close-window; }
    Ctrl+Alt+Delete { quit; }
    
    // 焦点导航（Vim 风格）
    Mod+H { focus-column-left; }
    Mod+J { focus-window-down; }
    Mod+K { focus-window-up; }
    Mod+L { focus-column-right; }
    
    // 移动窗口
    Mod+Ctrl+H { move-column-left; }
    Mod+Ctrl+J { move-window-down; }
    Mod+Ctrl+K { move-window-up; }
    Mod+Ctrl+L { move-column-right; }
    
    // 工作区
    Mod+1 { focus-workspace 1; }
    Mod+2 { focus-workspace 2; }
    Mod+3 { focus-workspace 3; }
    Mod+Ctrl+1 { move-column-to-workspace 1; }
    Mod+Ctrl+2 { move-column-to-workspace 2; }
    Mod+Ctrl+3 { move-column-to-workspace 3; }
    
    // 窗口大小
    Mod+R { switch-preset-column-width; }
    Mod+F { maximize-column; }
    Mod+Shift+F { fullscreen-window; }
    Mod+V { toggle-window-floating; }
    
    // 截图
    Print { spawn-sh "grim -g \"$(slurp)\" - | wl-copy"; }
    Ctrl+Print { screenshot-screen; }
    
    // 媒体键
    XF86AudioRaiseVolume allow-when-locked=true { 
        spawn-sh "wpctl set-volume @DEFAULT_AUDIO_SINK@ 0.05+ --limit 1.0"; 
    }
    XF86AudioLowerVolume allow-when-locked=true { 
        spawn-sh "wpctl set-volume @DEFAULT_AUDIO_SINK@ 0.05-"; 
    }
    XF86AudioMute allow-when-locked=true { 
        spawn-sh "wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle"; 
    }
}
```

---

## 常用快捷键

### 启动应用

| 快捷键 | 动作 |
|--------|------|
| `Mod+Enter` | 打开终端（Ghostty） |
| `Mod+D` | 应用启动器（fuzzel） |
| `Mod+B` | 打开浏览器（Chrome） |
| `Mod+E` | 文件管理器（Yazi） |
| `Ctrl+Alt+L` | 锁屏 |

### 窗口导航

| 快捷键 | 动作 |
|--------|------|
| `Mod+H/J/K/L` | 左/下/上/右焦点 |
| `Mod+Ctrl+H/J/K/L` | 移动窗口 |
| `Mod+Shift+H/J/K/L` | 切换显示器 |
| `Mod+1~9` | 切换工作区 |
| `Mod+Ctrl+1~9` | 移动窗口到工作区 |

### 窗口布局

| 快捷键 | 动作 |
|--------|------|
| `Mod+R` | 循环列宽（1/3, 1/2, 2/3） |
| `Mod+F` | 最大化列 |
| `Mod+Shift+F` | 全屏 |
| `Mod+V` | 切换浮动 |
| `Mod+C` | 居中列 |
| `Mod+Q` | 关闭窗口 |

### 截图

| 快捷键 | 动作 |
|--------|------|
| `Print` | 区域截图（slurp + satty） |
| `Ctrl+Print` | 全屏截图 |
| `Alt+Print` | 窗口截图 |

---

## 配套工具

### 应用启动器：fuzzel

```nix
programs.fuzzel = {
  enable = true;
  settings = {
    main = {
      font = "JetBrainsMono Nerd Font:size=12";
      dpi-aware = "yes";
      terminal = "ghostty";
    };
    colors = {
      background = "1e1e2eff";
      text = "cdd6f4ff";
      match = "89b4faff";
      selection = "585b70ff";
      selection-text = "cdd6f4ff";
    };
  };
};
```

### 锁屏：swaylock

```nix
programs.swaylock = {
  enable = true;
  settings = {
    color = "1e1e2e";
    font = "JetBrainsMono Nerd Font";
    font-size = 24;
    indicator-radius = 100;
    indicator-thickness = 7;
    line-color = "1e1e2e";
    ring-color = "89b4fa";
    inside-color = "1e1e2e";
    key-hl-color = "f5c2e7";
  };
};
```

### 截图工具

```nix
# grim：截图
# slurp：区域选择
# satty：标注工具
# wl-clipboard：剪贴板

home.packages = with pkgs; [
  grim
  slurp
  satty
  wl-clipboard
];
```

### 状态栏：waybar

```nix
programs.waybar = {
  enable = true;
  settings = {
    mainBar = {
      layer = "top";
      position = "top";
      height = 30;
      modules-left = [ "niri/workspaces" "niri/window" ];
      modules-center = [ "clock" ];
      modules-right = [ "pulseaudio" "network" "battery" ];
    };
  };
};
```

---

## Wayland 兼容性问题

### 1. X11 应用（通过 Xwayland）

大多数 X11 应用可以通过 Xwayland 运行：

```nix
# NixOS 配置
services.xserver = {
  enable = true;
  displayManager.gdm.enable = true;
};

# 启用 Xwayland
programs.niri.enable = true;
```

### 2. 屏幕共享

Wayland 下屏幕共享需要 XDG Desktop Portal：

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

**测试屏幕共享**：
- Chrome/Edge：WebRTC API
- Firefox：需要设置 `media.webrtc.capture.allow_file_access = true`
- OBS：使用 PipeWire 源

### 3. NVIDIA GPU

NVIDIA 在 Wayland 下有特殊配置：

```nix
# NixOS 配置
hardware.nvidia = {
  modesetting.enable = true;
  open = false;  # 或 true（开源驱动）
  nvidiaSettings = true;
};

environment.sessionVariables = {
  LIBVA_DRIVER_NAME = "nvidia";
  __GLX_VENDOR_LIBRARY_NAME = "nvidia";
  GBM_BACKEND = "nvidia-drm";
  NIXOS_OZONE_WL = "1";  # Electron 应用使用 Wayland
};

boot.kernelParams = [
  "nvidia-drm.fbdev=1"
];
```

### 4. 输入法（fcitx5）

```nix
i18n.inputMethod = {
  enable = true;
  type = "fcitx5";
  fcitx5.waylandFrontend = true;
  fcitx5.addons = with pkgs; [
    fcitx5-rime
    fcitx5-gtk
    fcitx5-configtool
  ];
};
```

---

## 调试技巧

### 1. 查看 Wayland 会话

```bash
# 查看当前会话类型
echo $XDG_SESSION_TYPE
# 输出: wayland

# 查看 Wayland 合成器
echo $WAYLAND_DISPLAY
# 输出: wayland-0

# 查看运行中的应用
pgrep -a niri
pgrep -a wayland
```

### 2. 查看日志

```bash
# Niri 日志
journalctl --user -u niri.service

# 系统日志
journalctl -b | grep -i niri
journalctl -b | grep -i wayland

# 实时查看
journalctl -f
```

### 3. 测试应用

```bash
# 强制使用 Wayland
WAYLAND_DISPLAY=wayland-0 firefox

# 强制使用 X11（Xwayland）
WAYLAND_DISPLAY= firefox

# 检查应用使用的协议
loginctl show-session $(loginctl | grep $USER | awk '{print $1}') -p Type
```

### 4. 重置配置

```bash
# 备份当前配置
mv ~/.config/niri/config.kdl ~/.config/niri/config.kdl.bak

# 使用默认配置
niri validate

# 重新加载配置（无需重启）
niri action do-reload-config
```

---

## 常见问题

### 1. 应用无法启动

```bash
# 错误：找不到 Wayland display
# 解决：确保在 Wayland 会话中
echo $WAYLAND_DISPLAY
# 应为: wayland-0 或类似

# 如果是 X11 会话，切换到 Niri
```

### 2. 屏幕闪烁

```nix
# 尝试禁用自适应同步
layout {
    # 添加
    struts {
        left 0
        right 0
    }
}

# 或尝试不同的刷新率
```

### 3. 多显示器问题

```kdl
// 配置显示器
output "DP-1" {
    mode "2560x1440@144"
    position 0 0
    scale 1.0
}

output "HDMI-A-1" {
    mode "1920x1080@60"
    position 2560 0
    scale 1.0
}
```

```bash
# 查看显示器信息
niri msg action do-list-outputs
wlr-randr
```

---

## 相关概念

- [[nixos-overview]] — NixOS 核心理念与架构
- [[nixos-nvidia]] — NVIDIA GPU 配置
- [[nixos-config-review]] — 我的 nix-config 审查

---

## 参考资源

- [Niri Wiki](https://github.com/YaLTeR/niri/wiki)
- [Niri 配置文档](https://github.com/YaLTeR/niri/wiki/Configuration:-Overview)
- [Wayland 官方文档](https://wayland.freedesktop.org/docs/html/)
- [Wayland 应用兼容性](https://wayland.freedesktop.org/docs/html/ch04.html)
- [Are We Wayland Yet?](https://arewewaylandyet.com/)
