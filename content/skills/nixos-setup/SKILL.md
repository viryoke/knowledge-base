---
name: nixos-setup
description: Configure NixOS systems — GPU, mirrors, input methods, desktop environment. Default mode and flakes.
tags: [nixos, linux, system-config, gpu, nvidia, input-method]
---

# NixOS System Configuration

## When to Use
- User is setting up or configuring NixOS
- Adding hardware drivers (GPU, WiFi)
- Configuring mirrors, input methods, desktop environment
- Troubleshooting NixOS rebuild failures

## Core Concepts

**Two modes:**
- **Default mode**: `/etc/nixos/configuration.nix` → `sudo nixos-rebuild switch`
- **Flakes mode**: `flake.nix` + `configuration.nix` → `sudo nixos-rebuild switch --flake .#hostname`

Default mode is simpler. Only introduce flakes when user explicitly asks or has multiple machines.

**Workflow:**
```
Edit configuration.nix → sudo nixos-rebuild switch → Verify
```

Rollback: `sudo nixos-rebuild switch --rollback`

## User Interaction Rules

1. **Ask first, don't assume.** Before jumping into config, ask:
   - Current state (fresh install? running system?)
   - Default mode or flakes?
   - What specific components to configure?

2. **Give snippets, not full files.** User pastes into their existing config. Don't overwrite unless asked.

3. **Step-by-step.** One component at a time. Don't dump 200 lines of config.

4. **Beginner-friendly explanations.** Assume user is new to NixOS unless demonstrated otherwise. Explain what each block does.

## Common Configuration Blocks

### Mirror Sources (China)

**Pitfall**: `nix.settings.substituters` in configuration.nix may not take effect immediately. Write directly to `/etc/nix/nix.conf` first for instant effect, then consolidate into configuration.nix later.

```bash
# Immediate effect
sudo mkdir -p /etc/nix
sudo tee /etc/nix/nix.conf << 'EOF'
experimental-features = nix-command flakes
substituters = https://mirrors.tuna.tsinghua.edu.cn/nix-channels/store https://mirrors.ustc.edu.cn/nix-channels/store https://cache.nixos.org
EOF
```

Verify: `nix show-config | grep substituters`

### NVIDIA GPU (Closed-Source Driver)

```nix
nixpkgs.config.allowUnfree = true;

services.xserver.videoDrivers = [ "nvidia" ];

hardware.nvidia = {
  modesetting.enable = true;
  open = false;           # Closed-source for RTX 30/40 series
  nvidiaSettings = true;
  package = config.boot.kernelPackages.nvidiaPackages.stable;
};

hardware.graphics.enable = true;
```

For Wayland compositors (Niri, Sway, etc.), add:
```nix
boot.kernelParams = [ "nvidia-drm.modeset=1" ];
environment.sessionVariables = {
  WLR_NO_HARDWARE_CURSORS = "1";
};
```

For ML workloads, add CUDA:
```nix
hardware.nvidia-container-toolkit.enable = true;
```

Verify: `nvidia-smi`

### Chinese Input Method (fcitx5)

**Requires GUI** — skip if user hasn't installed a desktop environment yet.

```nix
i18n.inputMethod = {
  enable = true;
  type = "fcitx5";
  fcitx5.waylandFrontend = true;
  fcitx5.addons = with pkgs; [
    fcitx5-rime                  # Rime engine (customizable)
    fcitx5-chinese-addons        # Built-in pinyin (simpler)
    fcitx5-gtk                   # GTK support
    qt6Packages.fcitx5-configtool # GUI config tool
  ];
};
```

Two paths:
- **Simple pinyin**: `fcitx5-chinese-addons` (like Sogou, out-of-box)
- **Customizable**: `fcitx5-rime` (Xiaohe, Wubi, etc., needs scheme files)

See `references/fcitx5-ryan4yin.md` for a real-world Rime config example.

### WiFi (NetworkManager)

```nix
networking.networkmanager.enable = true;
```

Connect: `nmcli device wifi connect "SSID" password "密码"`

## Flake Template Migration (nix-starter-configs)

When user clones `nix-starter-configs/standard` and wants to migrate from simple `/etc/nixos/configuration.nix`:

### Directory Structure
```
nix-config/
├── flake.nix              # Main entry, inputs, outputs
├── flake.lock             # Pinned versions
├── nixos/
│   ├── configuration.nix  # Host-specific system config (this machine)
│   └── hardware-configuration.nix  # Copy from /etc/nixos/
├── home-manager/
│   └── home.nix           # User-level config
├── modules/
│   ├── nixos/             # Reusable NixOS modules (empty is fine for single machine)
│   └── home-manager/      # Reusable home-manager modules (empty is fine)
├── overlays/              # Custom nixpkgs overlays
└── pkgs/                  # Custom packages
```

**Key distinction**: `nixos/configuration.nix` = host-specific (bootloader, GPU, DE, timezone). `modules/nixos/` = reusable modules you'd export to other machines. For a single machine, modules dirs stay empty.

### Migration Steps
1. Copy `hardware-configuration.nix` from `/etc/nixos/` to `nixos/`
2. Merge ALL real config into `nixos/configuration.nix` (template is bare — missing bootloader, GPU, locale, input method, etc.)
3. Add `home.stateVersion` to `home-manager/home.nix`
4. Build: `sudo nixos-rebuild switch --flake .#hostname`

### Two Deployment Modes
- **Integrated** (recommended): Add home-manager as NixOS module in flake.nix, single `nixos-rebuild switch` deploys everything. Delete `homeConfigurations` from flake.nix to avoid conflicts.
- **Standalone** (template default): `nixos-rebuild switch` for system, `home-manager switch` for user config. Two separate commands.

### Pitfall: GitHub API Rate Limiting
Flakes fetching `github:` inputs hit 403 errors due to unauthenticated rate limits (60 req/hr).

**Fix**: Add token to Nix config (NOT via `GITHUB_TOKEN` env var — it doesn't work reliably with `sudo --preserve-env`):
```nix
nix.extraOptions = ''
  extra-access-tokens = github.com=***
'';
```

## Config File Generation Rules

When generating Nix config files for the user:

1. **Preserve all comments** — including commented-out code from the original config. User explicitly requested this.
2. **Translate comments to Chinese** — all explanatory comments in Chinese.
3. **Use plain `# Section` format** — no `--- Section ---` separators. Match standard Nix comment conventions.
4. **Output to file** for long configs — terminal scroll buffer is limited. Write to a file and let user scp/copy.

## Hardware-Agnostic Design (options.myConfig pattern)

### Why Hardware-Agnostic?
Config works on any NixOS machine. Only `hardware-configuration.nix` varies per machine (GPU, GUI, arch).

### The Pattern

**In `hosts/<hostname>/default.nix`:**
```nix
{ config, pkgs, lib, username, ... }:
{
  options.myConfig = {
    hasNvidia = lib.mkOption { type = lib.types.bool; default = false; };
    hasGUI = lib.mkOption { type = lib.types.bool; default = true; };
  };

  config = {
    services.xserver.videoDrivers = lib.mkIf config.myConfig.hasNvidia [ "nvidia" ];
    hardware.nvidia = lib.mkIf config.myConfig.hasNvidia { ... };
    programs.niri.enable = config.myConfig.hasGUI;
    services.greetd = lib.mkIf config.myConfig.hasGUI { ... };
  };
}
```

**In `hosts/<hostname>/hardware-configuration.nix`:**
```nix
{
  myConfig.hasNvidia = true;   # Set once per machine
  myConfig.hasGUI = true;      # Set once per machine
  # Rest is auto-generated by nixos-generate-config
}
```

### Passing Values: specialArgs vs extraSpecialArgs
- `specialArgs` → NixOS modules (hosts/*/default.nix)
- `extraSpecialArgs` → Home Manager modules (home/default.nix)

```nix
# In hosts/desktop/default.nix
home-manager.extraSpecialArgs = { hasGUI = config.myConfig.hasGUI; };
```

### Conditional Patterns Reference

| Scenario | Pattern |
|----------|---------|
| Conditional service | `services.foo = lib.mkIf condition { enable = true; ... };` |
| Conditional attribute | `foo = lib.mkIf condition value;` |
| Conditional package list | `packages = [ always ] ++ (lib.optionals condition [ gui-apps ]);` |
| Conditional attrset merge | `vars = { always } // (lib.optionalAttrs condition { gui-vars });` |
| Conditional import | `imports = (lib.optionals condition [ ./gui.nix ]) ++ [ ./always.nix ];` |

### Architecture Flexibility (x86_64/aarch64)
```nix
# flake.nix — pass system as parameter
mkSystem = hostname: system: nixpkgs.lib.nixosSystem {
  inherit system;
  specialArgs = { inherit username; };
  modules = [ ./hosts/${hostname} ];
};

nixosConfigurations = {
  desktop = mkSystem "desktop" "x86_64-linux";
  vm = mkSystem "vm" "aarch64-linux";
};
```

See `references/hardware-agnostic-pattern.md`, `references/orbstack-pattern.md`, `references/validated-configs.md` for full implementations.

## Minimalism Principle: Start Small

User explicitly rejects heavy templates (ryan4yin/nix-config, 100+ files). Core rules:
1. **8 files maximum**, not 50+
2. **Flat structure**: `flake.nix`, `hosts/`, `home/` — that's it
3. **No abstractions** unless they solve real problems (one machine = no multi-host infra)
4. **Inline configs** over imported modules — split only when section >50 lines AND reused

### Anti-patterns
- ❌ Copying 100+ file templates as-is
- ❌ `modules/nixos/base/networking/firewall.nix` when one `networking` section suffices
- ❌ haumea, disko, preservation, nixpaks, bwraps, hardening profiles for a single machine

### Good Minimal Structure
```
flake.nix
hosts/desktop/
  default.nix                 # System config
  hardware-configuration.nix  # Generated
home/
  default.nix                 # User packages + shell
  niri.nix                    # Compositor (if using Niri)
```

See `references/nixos-minimal-config.md` for a complete 8-file example.

## Package Renames & API Changes (2025-2026)

### nixpkgs Package Renames
```nix
# WRONG (renamed/removed):
fcitx5-configtool          # → qt6Packages.fcitx5-configtool
noto-fonts-emoji           # → noto-fonts-color-emoji
nixfmt-rfc-style           # → nixfmt (merged)
source-han-sans-simplified-chinese  # → source-han-sans

# CORRECT:
pkgs.qt6Packages.fcitx5-configtool
noto-fonts-color-emoji
nixfmt
source-han-sans
```

### Catppuccin API Changes (2026)
```nix
# WRONG (deprecated):
catppuccin.homeManagerModules.catppuccin
programs.bat.catppuccin.enable = true;

# CORRECT (new API):
catppuccin.homeModules.catppuccin
catppuccin.enable = true;          # global toggle auto-enrolls ports
programs.bat.config.theme = "Catppuccin Mocha";
```

### Zsh & Git API Changes
```nix
# WRONG (deprecated):
programs.zsh.initExtra = '' ... '';
programs.git.userName = "user";

# CORRECT:
programs.zsh.initContent = '' ... '';
programs.git.settings.user.name = "user";
```

### Architecture-Specific Options
```nix
# WRONG: enable32Bit fails on aarch64
hardware.graphics.enable32Bit = true;

# CORRECT: Conditional on architecture
hardware.graphics.enable32Bit = pkgs.stdenv.hostPlatform.isx86_64;
```

## Common Desktop Stack (User Preferences)

- **Compositor**: Niri (scrollable tiling, Wayland-native)
- **Terminal**: Ghostty (GPU-accelerated, Catppuccin theme)
- **Shell**: Zsh + starship prompt
- **File manager**: Yazi
- **Editor**: Neovim + LazyVim
- **Browser**: Chrome + Firefox
- **Input**: fcitx5 + Rime (小鹤音形)
- **Theme**: Catppuccin Mocha (via catppuccin/nix flake)
- **Audio**: PipeWire
- **Display manager**: GDM (with GNOME as fallback session)

### GNOME Fallback
```nix
services.xserver = {
  enable = true;
  desktopManager.gnome.enable = true;
  displayManager.gdm.enable = true;
};
```
Login screen (GDM) offers both Niri and GNOME sessions.

## Nix devenv (Development Environments via Nix)

devenv is a Nix-based tool for creating reproducible dev environments. Works on macOS and Linux.

### Installation

```bash
# Via nix profile (requires GitHub API access — see rate limit pitfall below)
nix profile install nixpkgs#devenv

# Or via cachix
cachix use devenv
nix-env -if https://github.com/cachix/devenv/latest/download.tar.gz
```

### Basic devenv.nix for Python ML

```nix
{ pkgs, config, ... }:

{
  languages.python = {
    enable = true;
    version = "3.11";
    venv.enable = true;
    venv.requirements = ''
      torch>=2.0.0
      torchvision
      d2l==0.17.6
      jupyter
    '';
  };

  packages = [ pkgs.git ];

  enterShell = ''
    echo "🐍 ML dev environment ready"
  '';
}
```

### Flake-Based Usage (No Global Install)

When GitHub API rate limits block global install, use devenv as a flake input:

```nix
# flake.nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    devenv.url = "github:cachix/devenv";
  };

  outputs = { self, nixpkgs, devenv, ... }:
    let
      system = "aarch64-darwin";  # or x86_64-linux
      pkgs = import nixpkgs { inherit system; };
    in {
      devShells.${system}.default = devenv.lib.mkShell {
        inherit inputs pkgs;
        modules = [ ./devenv.nix ];
      };
    };
}
```

Then: `nix develop` to enter the shell.

### GitHub Rate Limit for Nix Flakes

**Symptom**: `nix profile install nixpkgs#xxx` or `nix flake update` fails with:
```
HTTP error 403
API rate limit exceeded for <IP>. (But here's the good news: Authenticated requests get a higher rate limit...)
```

**Root cause**: Nix uses GitHub API to resolve `github:` and `nixpkgs#` flake references. Unauthenticated requests are limited to 60/hour per IP. Once exhausted, all flake operations fail.

**Why user's token may not work**: Even if user has a GitHub PAT configured elsewhere (e.g., git push), **Nix needs its own config**. Check:
- `~/.config/nix/nix.conf` — must have `access-tokens = github.com=<TOKEN>`
- `/etc/nix/nix.conf` — same
- `GITHUB_TOKEN` env var — unreliable with `sudo` (often not preserved)

**Fix**: Add token to user-level nix.conf:
```bash
echo 'access-tokens = github.com=<YOUR_TOKEN>' >> ~/.config/nix/nix.conf
```

**Verify rate limit status**:
```bash
curl -sI https://api.github.com | grep -i x-ratelimit
# x-ratelimit-limit: 5000 (with auth) vs 60 (without)
# x-ratelimit-remaining: 4999
```

**Workaround if no token available**: Wait ~1 hour for rate limit to reset, then retry.

**Anti-pattern**: Don't bypass by using alternative registries or workarounds — fix the root cause (token config). User prefers solving problems directly, not working around them.

See `references/devenv-python-ml-template.md` for a complete working template.

## Pitfalls

- Use pip (via devenv venv), NOT nixpkgs — nixpkgs torch may lack MPS support
- `torch>=2.0.0` from pip includes native MPS backend for Apple Silicon
- Verify: `python -c "import torch; print(torch.backends.mps.is_available())"`

See `references/devenv-python-ml-template.md` for a complete working template.

## Pitfalls

- **Forgot to rebuild**: Editing configuration.nix does nothing without `sudo nixos-rebuild switch`
- **Duplicate blocks**: Can't have two `nix = { ... };` blocks — merge them
- **No GUI, no input method**: fcitx5 needs a desktop environment to function
- **Mirror sources**: May not take effect from configuration.nix alone; write /etc/nix/nix.conf directly first
- **stateVersion**: Never change this unless you know what it does
- **Template is bare**: nix-starter-configs template `configuration.nix` has almost no real config — must merge in all existing system settings
- **GitHub rate limit**: Flake `github:` inputs hit 403 without token; `GITHUB_TOKEN` env var unreliable with sudo
- **SSH lockout**: Template sets `PasswordAuthentication = false` by default — change to `true` if no SSH keys configured

### greetd $HOME Expansion
```nix
# WRONG: $HOME expands to _greeter user, not your user
services.greetd.settings.default_session.command =
  "${pkgs.tuigreet}/bin/tuigreet --cmd $HOME/.wayland-session";

# CORRECT: Use direct command
services.greetd.settings.default_session.command =
  "${pkgs.tuigreet}/bin/tuigreet --cmd niri-session";
```

### Display Manager Conflicts
```nix
# WRONG: Both greetd and GDM enabled
services.greetd.enable = true;
services.xserver.displayManager.gdm.enable = true;

# CORRECT: Choose one
services.greetd.enable = true;
# services.xserver.displayManager.gdm.enable = false;
```

### npm Global Install — Use Activation Scripts
```nix
# WRONG: Violates declarative principle
home.activation.installTool = lib.hm.dag.entryAfter ["writeBoundary"] ''
  npm install -g @some/tool 2>/dev/null || true
'';

# CORRECT: Check existence first
home.activation.installTool = lib.hm.dag.entryAfter ["writeBoundary"] ''
  if ! command -v tool &>/dev/null; then
    $DRY_RUN_CMD ${pkgs.nodejs}/bin/npm install -g @some/tool 2>&1 || echo "Install failed"
  fi
'';
```

### lib.mkIf — Apply to Whole Attribute Set
```nix
# WRONG: mkIf on individual fields
hardware.nvidia = {
  modesetting.enable = lib.mkIf config.myConfig.hasNvidia true;
  package = lib.mkIf config.myConfig.hasNvidia ...;
};

# CORRECT: mkIf wraps the whole set
hardware.nvidia = lib.mkIf config.myConfig.hasNvidia {
  modesetting.enable = true;
  package = ...;
};
```

### lib.optionals — Needs Parens in List Concatenation
```nix
# WRONG: Missing parens
home.packages = with pkgs; [
  ripgrep
] ++ lib.optionals hasGUI [ vscode ];

# CORRECT: Wrap in parens
home.packages = with pkgs; [
  ripgrep
] ++ (lib.optionals hasGUI [ vscode ]);
```

### options Requires config Block
```nix
# WRONG: config attributes at top level alongside options
{
  options.myConfig = { ... };
  boot.loader.systemd-boot.enable = true;  # ERROR: unsupported attribute
}

# CORRECT: wrap all config in config = { }
{
  options.myConfig = { ... };
  config = {
    boot.loader.systemd-boot.enable = true;
  };
}
```

### Flakes Only See Committed Files
```bash
# WRONG: Create new host dir, immediately rebuild
mkdir hosts/newhost
nixos-rebuild switch --flake .#newhost  # ERROR: path doesn't exist

# CORRECT: Commit first, then rebuild
git add hosts/newhost/
git commit -m "Add new host"
nixos-rebuild switch --flake .#newhost
```

### Empty dev.nix / Unused Module Files
```nix
# WRONG: Empty file with only comments
{ ... }:
{
  # This file is for additional dev-specific configuration
}

# CORRECT: Either fill with actual config or delete and remove from imports
```

### Session Variables Conditional Merge (Attrsets)
```nix
# WRONG: Can't ++ on attrsets
home.sessionVariables = {
  EDITOR = "nvim";
} ++ (lib.optionals hasGUI [ { BROWSER = "chrome"; } ]);

# CORRECT: Use // and lib.optionalAttrs
home.sessionVariables = {
  EDITOR = "nvim";
} // (lib.optionalAttrs hasGUI {
  NIXOS_OZONE_WL = "1";
  BROWSER = "chrome";
});
```

### Notable Package Availability
- `clash-verge-rev` — in nixpkgs, just add to `home.packages`; TUN service mode configured via GUI
- `claude-code` — in nixpkgs (add to `home.packages`)
- Obsidian — use `pkgs.obsidian` (nixpkgs), NOT AppImage
- Python/uv — use `pkgs.uv` + `pkgs.python312`, create venvs per project

## Reducing Daily Friction

User reports "installing software is troublesome" on NixOS. Three friction sources:

1. **Every install requires editing config → rebuild → wait for compilation** — this is NixOS's design cost
2. **Some software lacks nixpkgs packages** — need custom derivation or nix-shell, missing AUR-style experience
3. **Cryptic error messages** — Nix error stacks are unfriendly to newcomers

### Practical Solutions

**For common tools**: Write everything into `configuration.nix` upfront, configure once.

**For temporary/experimental software**: Use `nix-shell -p xxx`, don't pollute system.

**For closed-source or hard-to-package software**: Enable Flatpak:
```nix
services.flatpak.enable = true;
```
Then: `flatpak install flathub com.spotify.Client`

This covers ~80% of "installing software is annoying" complaints.

### When to Consider Switching Distros

If weekly NixOS maintenance exceeds 2+ hours, the time ROI favors switching. See `references/distro-freshness-comparison.md` for Repology data showing:
- **openSUSE Tumbleweed**: 72.2% package freshness + rolling release + openQA testing, best balance of stable+new
- **Arch Linux**: 86.9% freshness but stability depends on user
- **Fedora Stable**: Only 46-54% freshness (worse than community perception suggests)

See `references/community-config-ecosystem.md` for NixOS community config recommendations (nix-starter-configs, hlissner/dotfiles patterns).

## Verification Checklist

After each component:
- GPU: `nvidia-smi` shows GPU info
- Mirrors: `nix show-config | grep substituters` shows tuna/ustc
- Input method: fcitx5 tray icon appears, can switch with Ctrl+Space
- WiFi: `nmcli device wifi list` shows networks
