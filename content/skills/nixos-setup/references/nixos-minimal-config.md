# NixOS Minimal Desktop Config (8 files)

Complete config pushed to github.com/viryoke/nix-config.

## File List

```
flake.nix                         # 4 inputs: nixpkgs, home-manager, niri-flake, catppuccin
hosts/desktop/default.nix          # System: NVIDIA, GNOME, PipeWire, SSH, Docker, mirrors
hosts/desktop/hardware-configuration.nix  # PLACEHOLDER — replace after install
home/default.nix                   # User: all packages, shell, apps, activation
home/niri.nix                      # Niri KDL config (keybindings, layout, screenshots)
home/dev.nix                       # Dev environment notes
.gitignore                         # result, result-*
README.md                          # Install guide + keyboard shortcuts for all tools
```

## Packages Included

**System**: NVIDIA drivers, fcitx5+rime, GNOME fallback, PipeWire, SSH, Docker, fonts (JetBrains Mono Nerd Font + Source Han)

**User CLI**: ghostty, zsh+oh-my-zsh+starship, neovim+LSP, bat, ripgrep, fd, eza, zoxide, yazi, htop, btop, jq, tree, tldr, claude-code, python312+uv, nodejs_22+bun

**User GUI**: vscode, obsidian, clash-verge-rev, google-chrome, firefox, telegram-desktop, remmina, foliate, mpv, imv, zathura

**Auto-installed via activation**: hermes-agent (npm global)

## Post-Install (One Command)

```bash
git clone https://github.com/LazyVim/starter ~/.config/nvim && rm -rf ~/.config/nvim/.git
```

Everything else is declarative.
