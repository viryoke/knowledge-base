# OrbStack VM Deployment Pattern

OrbStack's NixOS is an **LXC container**, not a traditional VM. This has critical implications for deployment.

## Key Differences from Traditional VM

| Aspect | Traditional VM | OrbStack Container |
|--------|---------------|-------------------|
| Boot loader | systemd-boot/grub | OrbStack manages boot |
| `/etc/nixos/` | User-managed | OrbStack-managed (auto-generated) |
| System profiles | Persistent | Can be overridden on reboot |
| `/boot` partition | Real EFI partition | Not present |
| Rebuild command | `nixos-rebuild switch --flake .#host` | Must integrate with OrbStack config |

## Deployment Pattern

### 1. Create Custom Module

Create a standalone module with your packages and settings:

```nix
# hosts/nixos/custom.nix
{ config, pkgs, lib, ... }:
{
  environment.systemPackages = with pkgs; [
    ripgrep fd eza zellij vim git curl
    python312 uv nodejs_22 bun
  ];

  fonts = {
    fontDir.enable = true;
    packages = with pkgs; [
      nerd-fonts.jetbrains-mono
      noto-fonts-cjk-sans
      source-han-sans
    ];
  };

  programs.zsh.enable = true;
  virtualisation.docker.enable = true;
  
  zramSwap = {
    enable = true;
    algorithm = "zstd";
    memoryPercent = 25;
  };

  nix.settings = {
    experimental-features = [ "nix-command" "flakes" ];
    substituters = [
      "https://mirrors.ustc.edu.cn/nix-channels/store"
      "https://cache.nixos.org"
    ];
  };

  nixpkgs.config.allowUnfree = true;
}
```

### 2. Copy Module to OrbStack

```bash
orb -m nixos sudo cp /path/to/custom.nix /etc/nixos/custom.nix
```

### 3. Import into OrbStack's configuration.nix

```bash
# View current imports
orb -m nixos bash -c "head -20 /etc/nixos/configuration.nix"

# Add ./custom.nix to existing imports list
orb -m nixos bash -c "
  sudo head -n -1 /etc/nixos/configuration.nix > /tmp/cfg.nix
  sed -i 's|./orbstack.nix|./orbstack.nix\n      ./custom.nix|' /tmp/cfg.nix
  echo '}' >> /tmp/cfg.nix
  sudo mv /tmp/cfg.nix /etc/nixos/configuration.nix
"
```

### 4. Rebuild

```bash
orb -m nixos sudo nixos-rebuild switch
```

## Common Issues

### 1. System Profile Override on Reboot

**Problem**: OrbStack reverts to its own system profile after reboot.

**Cause**: OrbStack's initialization scripts manage system profiles.

**Solution**: Import your config as a module (not replace entire system).

### 2. Boot Loader Errors

**Problem**: `efiSysMountPoint = '/boot' is not a mounted partition`

**Cause**: OrbStack containers don't have real `/boot` partition.

**Solution**: Disable boot loaders in custom module:
```nix
boot.loader.grub.enable = false;
boot.loader.systemd-boot.enable = false;
```

### 3. Permission Denied Writing to /etc/nixos/

**Problem**: `cp: cannot create regular file '/etc/nixos/custom.nix': Permission denied`

**Solution**: Use sudo:
```bash
orb -m nixos sudo cp custom.nix /etc/nixos/
```

### 4. Duplicate imports Attribute

**Problem**: `attribute 'imports' already defined`

**Cause**: Appending new `imports = [ ... ]` block instead of adding to existing list.

**Solution**: Add to existing imports list (see step 3 above).

### 5. Missing Closing Brace

**Problem**: `syntax error, unexpected end of file, expecting INHERIT`

**Cause**: Removed closing `}` when editing configuration.nix.

**Solution**: Always ensure file ends with `}`:
```bash
echo '}' | sudo tee -a /etc/nixos/configuration.nix
```

## Verification

After successful rebuild:

```bash
# Check packages installed
orb -m nixos bash -c "which zellij rg fd eza"

# Check versions
orb -m nixos bash -c "zellij --version && rg --version | head -1"

# Check services
orb -m nixos bash -c "systemctl status docker"

# Check ZRAM
orb -m nixos bash -c "cat /proc/swaps"
```

## Persistence

Configuration persists across reboots because:
1. `/etc/nixos/configuration.nix` includes `./custom.nix`
2. OrbStack's rebuild process reads this config
3. System profile is rebuilt from this config on boot

**Note**: If OrbStack regenerates `/etc/nixos/configuration.nix`, you'll need to re-add the import. Monitor after OrbStack updates.

## Comparison: Flake vs Module Approach

| Approach | When to Use | Complexity |
|----------|-------------|------------|
| **Flake-based** (traditional) | Physical machines, traditional VMs | Standard |
| **Module import** (OrbStack) | OrbStack containers | Requires integration |

For OrbStack, the module import approach is necessary because OrbStack manages the base configuration and boot process.
