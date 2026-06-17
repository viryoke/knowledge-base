# NixOS Configuration Pitfalls & Fixes

## Core Rule
**nix-config only manages: drivers, tools, and applications.**
Do NOT touch: `boot.loader.*`, `boot.kernelPackages`, disk partitioning — all set during NixOS installation.

## Critical Pitfalls

### 1. `options` requires `config` wrapper
When a module defines `options`, ALL other attributes MUST be inside `config = { ... };`:
```nix
{ config, pkgs, lib, ... }:
{
  options.myConfig = { ... };
  config = {
    # ALL other config goes here
    boot.kernelPackages = ...;
    services.xserver = ...;
  };
}
```
Error: "Module has an unsupported attribute... caused by introducing a top-level `config` or `options` attribute"

### 2. Duplicate attribute definitions
`services.xserver` in two places → merge into one block with `lib.mkIf` conditionals.

### 3. Patch tool corrupts .nix files
Multiple sequential patches misalign braces. For complex rewrites, use `write_file` instead.

### 4. Catppuccin API (2026)
- `catppuccin.homeManagerModules.catppuccin` → `catppuccin.homeModules.catppuccin` (in `sharedModules`)
- `programs.xxx.catppuccin.enable` → REMOVED. Catppuccin auto-enrolls.
- `programs.bat.catppuccin` → `programs.bat.config.theme = "Catppuccin Mocha"`

### 5. Package renames (nixpkgs-unstable)
| Old | New |
|-----|-----|
| `fcitx5-configtool` | `pkgs.qt6Packages.fcitx5-configtool` |
| `noto-fonts-emoji` | `noto-fonts-color-emoji` |
| `nixfmt-rfc-style` | `nixfmt` |
| `source-han-sans-simplified-chinese` | `source-han-sans` |
| `source-han-serif-simplified-chinese` | `source-han-serif` |

### 6. Architecture-specific
- `hardware.graphics.enable32Bit = true` → FAILS on aarch64. Use `pkgs.stdenv.hostPlatform.isx86_64`
- `linuxPackages_lts` → NOT on aarch64. Use `linuxPackages` or skip
- NVIDIA only on x86_64

### 7. GitHub API rate limit (403)
Flakes limited to 60 req/hr/IP unauthenticated.
Fix: `echo "access-tokens = github.com=TOKEN" >> ~/.config/nix/nix.conf`
Or: ensure `flake.lock` is committed.

### 8. OrbStack NixOS is LXC container
- OrbStack manages `/etc/nixos/configuration.nix`
- Flake-based `nixos-rebuild switch` gets OVERWRITTEN on reboot
- Fix: Create `custom.nix` module, add to OrbStack's `imports = [...]`
- OrbStack shares Mac filesystem

### 9. Git tracking required
`nixos-rebuild --flake .` only sees tracked files. Untracked files → "path does not exist".
Fix: `git add -A && git commit` before rebuild.

### 10. Home Manager option renames
- `programs.git.userName` → `programs.git.settings.user.name`
- `programs.git.userEmail` → `programs.git.settings.user.email`
- `programs.git.extraConfig` → `programs.git.settings`
- `programs.zsh.initExtra` → `programs.zsh.initContent`

### 11. sudo loses environment
`export GITHUB_TOKEN=*** lost with `sudo`.
Fix: `sudo -E` or write to `/etc/nix/nix.conf`.

## Validation
```bash
nix-instantiate --parse file.nix > /dev/null 2>&1 && echo OK
nixos-rebuild dry-run --flake .#hostname
sudo nixos-rebuild switch --flake .#hostname
```
