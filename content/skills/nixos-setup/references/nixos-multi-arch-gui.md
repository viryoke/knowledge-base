# NixOS Multi-Architecture and GUI/TUI Flexibility

Patterns for building portable NixOS configurations that work across architectures and use cases.

## Multi-Architecture Support

### Flake Structure

```nix
{
  outputs = { self, nixpkgs, ... }:
    let
      # Don't hardcode architecture
      mkSystem = hostname: system: nixpkgs.lib.nixosSystem {
        inherit system;
        modules = [ ./hosts/${hostname} ];
      };
    in
    {
      # Different architectures
      nixosConfigurations.desktop = mkSystem "desktop" "x86_64-linux";
      nixosConfigurations.nixos = mkSystem "nixos" "aarch64-linux";
    };
}
```

### Architecture-Conditional Features

```nix
# Only enable 32-bit support on x86_64
hardware.graphics = {
  enable = true;
  enable32Bit = pkgs.stdenv.hostPlatform.isx86_64;
};
```

### Kernel Packages

```nix
# linuxPackages_lts doesn't exist on aarch64
boot.kernelPackages = pkgs.linuxPackages;  # Works everywhere
# boot.kernelPackages = pkgs.linuxPackages_lts;  # x86_64 only
```

## GUI/TUI Flexibility

### Passing hasGUI Flag

**flake.nix:**
```nix
home-manager = {
  extraSpecialArgs = {
    inherit hasGUI;
  };
};
```

**hosts/<name>/default.nix:**
```nix
{ config, pkgs, lib, username, hasGUI, ... }:
{
  options.myConfig = {
    hasGUI = lib.mkOption {
      type = lib.types.bool;
      default = true;
      description = "Whether to enable GUI (display manager, desktop environment)";
    };
  };

  config = {
    # Conditional display manager
    services.greetd.enable = lib.mkIf config.myConfig.hasGUI true;
    
    # Conditional desktop environment
    services.xserver = lib.mkIf config.myConfig.hasGUI {
      enable = true;
      desktopManager.gnome.enable = true;
    };
  };
}
```

### Conditional Packages in Home Manager

```nix
{ pkgs, lib, hasGUI, ... }:
{
  imports = (lib.optionals hasGUI [ ./niri.nix ]) ++ [ ./dev.nix ];

  home.packages = with pkgs; [
    # CLI tools (always installed)
    ripgrep fd eza zoxide jq tree htop
  ] ++ (lib.optionals hasGUI [
    # GUI apps (only when hasGUI = true)
    vscode obsidian google-chrome firefox telegram-desktop
    mpv imv zathura
  ]);

  programs.ghostty = lib.mkIf hasGUI {
    enable = true;
    settings = { theme = "catppuccin-mocha"; };
  };
}
```

## Package Renames (nixpkgs-unstable 2025-2026)

### Fonts

| Old Name | New Name |
|----------|----------|
| `noto-fonts-emoji` | `noto-fonts-color-emoji` |
| `source-han-sans-simplified-chinese` | `source-han-sans` |
| `source-han-serif-simplified-chinese` | `source-han-serif` |

### Development Tools

| Old Name | New Name |
|----------|----------|
| `nixfmt-rfc-style` | `nixfmt` |
| `fcitx5-configtool` | `qt6Packages.fcitx5-configtool` |

### Deprecated Options

| Old Option | New Option |
|------------|------------|
| `programs.git.userName` | `programs.git.settings.user.name` |
| `programs.git.userEmail` | `programs.git.settings.user.email` |
| `programs.git.extraConfig` | `programs.git.settings` |
| `programs.zsh.initExtra` | `programs.zsh.initContent` |
| `programs.bat.catppuccin.enable` | `programs.bat.config.theme = "Catppuccin Mocha"` |

## Catppuccin Integration

### Flake Input

```nix
{
  inputs.catppuccin.url = "github:catppuccin/nix";
}
```

### System Module

```nix
{
  imports = [ catppuccin.nixosModules.catppuccin ];
  
  catppuccin = {
    enable = true;
    flavor = "mocha";
    accent = "mauve";
  };
}
```

### Home Manager Module

```nix
{
  home-manager.sharedModules = [
    catppuccin.homeModules.catppuccin  # Note: homeModules, not homeManagerModules
  ];
  
  # In home/default.nix
  catppuccin = {
    enable = true;
    flavor = "mocha";
    accent = "mauve";
  };
}
```

## Flakes and Git

### Uncommitted Files

Flakes only see committed files. After creating new host directories:

```bash
git add -A
git commit -m "Add new host"
# Now nixos-rebuild can see hosts/<name>/
```

### GitHub API Rate Limiting

**Problem:** Building flakes without `flake.lock` downloads from GitHub API (60 req/hour anonymous).

**Fix:** Add GitHub token to `/etc/nix/nix.conf`:

```
access-tokens = github.com=***
```

Or set environment variable:

```bash
export GITHUB_TOKEN=***
sudo -E nixos-rebuild switch --flake .#hostname
```

## Testing in VMs

### OrbStack (macOS)

```bash
# Create VM
orb create nixos

# Run commands (shares macOS filesystem at /Users/username)
orb -m nixos -w /Users/username/nix-config bash -c "nixos-rebuild dry-run --flake .#nixos"
```

### Dry Run Validation

```bash
# Syntax check
nix-instantiate --parse hosts/desktop/default.nix

# Full config validation (without building)
sudo nixos-rebuild dry-run --flake .#hostname

# Build without applying
sudo nixos-rebuild build --flake .#hostname
```

## Common Pitfalls

### Duplicate Attribute Definitions

If you define `options`, ALL config must be inside `config = { }`:

```nix
# ❌ Wrong
{
  options.myConfig.hasNvidia = ...;
  services.xserver.enable = true;  # Error!
}

# ✅ Correct
{
  options.myConfig.hasNvidia = ...;
  config = {
    services.xserver.enable = true;
  };
}
```

### services.xserver Duplication

Don't define `services.xserver` multiple times. Merge all settings:

```nix
# ❌ Wrong
services.xserver.videoDrivers = lib.mkIf config.myConfig.hasNvidia [ "nvidia" ];
services.xserver = lib.mkIf config.myConfig.hasGUI {
  enable = true;
  desktopManager.gnome.enable = true;
};

# ✅ Correct
services.xserver = {
  videoDrivers = lib.mkIf config.myConfig.hasNvidia [ "nvidia" ];
  enable = lib.mkIf config.myConfig.hasGUI true;
  desktopManager.gnome.enable = lib.mkIf config.myConfig.hasGUI true;
};
```

### Home Manager Version Mismatch

If using `nixos-unstable` with Home Manager, you may see warnings about version mismatch. Suppress with:

```nix
{
  home-manager.users.<username> = { ... }: {
    home.enableNixpkgsReleaseCheck = false;
  };
}
```

## Audit Checklist

When adding multi-arch or GUI/TUI support:

- [ ] Architecture not hardcoded in flake.nix
- [ ] `hasGUI` flag defined in options
- [ ] Display manager conditional on `hasGUI`
- [ ] Desktop environment conditional on `hasGUI`
- [ ] GUI packages wrapped in `lib.optionals hasGUI`
- [ ] `enable32Bit` conditional on architecture
- [ ] Kernel packages work on target architectures
- [ ] Font packages use current names (check for renames)
- [ ] Deprecated options updated to new syntax
