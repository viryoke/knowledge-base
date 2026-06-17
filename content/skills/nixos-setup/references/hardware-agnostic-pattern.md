# Hardware-Agnostic Pattern Reference

Complete implementation of the hardware-agnostic NixOS config pattern.

## Directory Structure

```
nix-config/
├── flake.nix                          # Entry point, defines hosts
├── flake.lock                         # Locked dependencies
├── hosts/
│   ├── desktop/
│   │   ├── default.nix                # Defines options, conditional services
│   │   └── hardware-configuration.nix # Auto-generated + manual toggles
│   ├── laptop/
│   │   ├── default.nix
│   │   └── hardware-configuration.nix
│   └── server/
│       ├── default.nix
│       └── hardware-configuration.nix
└── home/
    ├── default.nix                    # Receives hasGUI via extraSpecialArgs
    ├── niri.nix                       # Window manager config
    └── dev.nix                        # Development tools
```

## File 1: flake.nix

```nix
{
  description = "viryoke's NixOS configuration";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    niri.url = "github:sodiboo/niri-flake";
    catppuccin.url = "github:catppuccin/nix";
  };

  outputs = { self, nixpkgs, home-manager, niri, catppuccin }:
    let
      system = "x86_64-linux";
      username = "viryoke";

      mkSystem = hostname: nixpkgs.lib.nixosSystem {
        inherit system;
        specialArgs = {
          inherit username niri;
        };
        modules = [
          ./hosts/${hostname}
          niri.nixosModules.niri
          catppuccin.nixosModules.catppuccin
          home-manager.nixosModules.home-manager
          {
            home-manager = {
              useGlobalPkgs = true;
              useUserPackages = true;
              users.${username} = import ./home;
              sharedModules = [
                catppuccin.homeManagerModules.catppuccin
              ];
            };
          }
        ];
      };
    in
    {
      nixosConfigurations = {
        desktop = mkSystem "desktop";
        laptop = mkSystem "laptop";
        server = mkSystem "server";
      };
    };
}
```

**Key points**:
- `mkSystem` is a function that takes hostname only
- No `hasNvidia`/`hasGUI` parameters here
- Passes `username`/`niri` via `specialArgs`
- Home Manager is configured but doesn't receive hardware flags yet

## File 2: hosts/desktop/default.nix

```nix
{ config, pkgs, lib, username, ... }:
{
  imports = [ ./hardware-configuration.nix ];

  # ═══════════════════════════════════════════════════════════
  # DEFINE OPTIONS (hardware-configuration.nix will set these)
  # ═══════════════════════════════════════════════════════════
  options.myConfig = {
    hasNvidia = lib.mkOption {
      type = lib.types.bool;
      default = false;
      description = "Whether this machine has an NVIDIA GPU";
    };
    hasGUI = lib.mkOption {
      type = lib.types.bool;
      default = true;
      description = "Whether to enable desktop environment";
    };
  };

  # ═══════════════════════════════════════════════════════════
  # PASS TO HOME MANAGER
  # ═══════════════════════════════════════════════════════════
  home-manager.extraSpecialArgs = {
    hasGUI = config.myConfig.hasGUI;
  };

  # ═══════════════════════════════════════════════════════════
  # ALWAYS-ON SERVICES
  # ═══════════════════════════════════════════════════════════
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  networking.hostName = "desktop";
  networking.networkmanager.enable = true;

  time.timeZone = "Asia/Shanghai";
  i18n.defaultLocale = "en_US.UTF-8";

  services.openssh = {
    enable = true;
    settings = {
      PasswordAuthentication = false;
      KbdInteractiveAuthentication = false;
    };
  };

  # Audio (PipeWire)
  services.pipewire = {
    enable = true;
    alsa.enable = true;
    alsa.support32Bit = true;
    pulse.enable = true;
    wireplumber.enable = true;
  };

  # Adaptive swap (works on any RAM size)
  zramSwap = {
    enable = true;
    algorithm = "zstd";
    memoryPercent = 25;  # 8GB VM → 2GB, 64GB desktop → 16GB
  };

  # User
  users.users.${username} = {
    isNormalUser = true;
    extraGroups = [ "wheel" "networkmanager" "docker" ];
    shell = pkgs.zsh;
  };

  # Always-installed packages
  environment.systemPackages = with pkgs; [
    vim git curl wget htop
  ];

  programs.zsh.enable = true;
  virtualisation.docker.enable = true;

  # ═══════════════════════════════════════════════════════════
  # CONDITIONAL: NVIDIA
  # ═══════════════════════════════════════════════════════════
  services.xserver.videoDrivers = lib.mkIf config.myConfig.hasNvidia [ "nvidia" ];

  hardware.nvidia = lib.mkIf config.myConfig.hasNvidia {
    modesetting.enable = true;
    open = false;
    nvidiaSettings = true;
    powerManagement.enable = true;
    package = config.boot.kernelPackages.nvidiaPackages.stable;
  };

  hardware.graphics = {
    enable = true;
    enable32Bit = true;
  };

  environment.sessionVariables = lib.mkIf config.myConfig.hasNvidia {
    LIBVA_DRIVER_NAME = "nvidia";
    __GLX_VENDOR_LIBRARY_NAME = "nvidia";
    GBM_BACKEND = "nvidia-drm";
    NIXOS_OZONE_WL = "1";
  };

  boot.kernelParams = lib.mkIf config.myConfig.hasNvidia [
    "nvidia-drm.fbdev=1"
  ];

  hardware.nvidia-container-toolkit.enable = config.myConfig.hasNvidia;

  # ═══════════════════════════════════════════════════════════
  # CONDITIONAL: GUI
  # ═══════════════════════════════════════════════════════════
  programs.niri.enable = config.myConfig.hasGUI;

  services.greetd = lib.mkIf config.myConfig.hasGUI {
    enable = true;
    settings = {
      default_session = {
        user = username;
        command = "${pkgs.tuigreet}/bin/tuigreet --time --cmd niri-session";
      };
    };
  };

  services.xserver = lib.mkIf config.myConfig.hasGUI {
    enable = true;
    desktopManager.gnome.enable = true;
  };

  xdg.portal = lib.mkIf config.myConfig.hasGUI {
    enable = true;
    xdgOpenUsePortal = true;
    extraPortals = with pkgs; [
      xdg-desktop-portal-gtk
      xdg-desktop-portal-gnome
    ];
  };

  # ═══════════════════════════════════════════════════════════
  # SYSTEM CONFIG
  # ═══════════════════════════════════════════════════════════
  nixpkgs.config.allowUnfree = true;
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
  nix.settings.auto-optimise-store = true;

  system.stateVersion = "24.05";
}
```

**Key points**:
- `options.myConfig` defines the toggles at the top
- `home-manager.extraSpecialArgs` passes `hasGUI` to Home Manager
- `lib.mkIf config.myConfig.hasNvidia` wraps all NVIDIA config
- `lib.mkIf config.myConfig.hasGUI` wraps all GUI services
- Always-on services (SSH, audio, swap) are unconditional

## File 3: hosts/desktop/hardware-configuration.nix

```nix
# ═══════════════════════════════════════════════════════════
# MANUAL TOGGLES (set once per machine)
# ═══════════════════════════════════════════════════════════
{ config, lib, pkgs, modulesPath, ... }:
{
  imports = [ (modulesPath + "/installer/scan/not-detected.nix") ];

  # Edit these two lines for your hardware:
  myConfig.hasNvidia = true;   # Set to false if no NVIDIA GPU
  myConfig.hasGUI = true;      # Set to false for headless server

  # ═══════════════════════════════════════════════════════════
  # AUTO-GENERATED (do not edit manually)
  # ═══════════════════════════════════════════════════════════
  boot.initrd.availableKernelModules = [ "nvme" "xhci_pci" "ahci" "usbhid" ];
  boot.initrd.kernelModules = [ ];
  boot.kernelModules = [ "kvm-intel" ];
  boot.extraModulePackages = [ ];

  fileSystems."/" = {
    device = "/dev/disk/by-uuid/xxxx-xxxx-xxxx";
    fsType = "ext4";
  };

  fileSystems."/boot" = {
    device = "/dev/disk/by-uuid/xxxx-xxxx";
    fsType = "vfat";
  };

  swapDevices = [ ];

  nixpkgs.hostPlatform = lib.mkDefault "x86_64-linux";
  hardware.cpu.intel.updateMicrocode = lib.mkDefault config.hardware.enableRedistributableFirmware;
}
```

**Key points**:
- Manual toggles at the top (clearly separated)
- Auto-generated hardware detection below
- This file varies per machine, but structure is consistent

## File 4: home/default.nix

```nix
{ pkgs, lib, username, hasGUI, ... }:
{
  # ═══════════════════════════════════════════════════════════
  # CONDITIONAL IMPORTS
  # ═══════════════════════════════════════════════════════════
  imports = (lib.optionals hasGUI [ ./niri.nix ]) ++ [ ./dev.nix ];

  home.username = username;
  home.homeDirectory = "/home/${username}";

  # ═══════════════════════════════════════════════════════════
  # ALWAYS-ON PROGRAMS
  # ═══════════════════════════════════════════════════════════
  programs.git = {
    enable = true;
    userName = "viryoke";
    userEmail = "viryoke@example.com";
  };

  programs.fzf = {
    enable = true;
    enableZshIntegration = true;
  };

  programs.zoxide = {
    enable = true;
    enableZshIntegration = true;
  };

  programs.bat = {
    enable = true;
    catppuccin.enable = true;
  };

  # ═══════════════════════════════════════════════════════════
  # CONDITIONAL PROGRAMS
  # ═══════════════════════════════════════════════════════════
  programs.ghostty = lib.mkIf hasGUI {
    enable = true;
    settings = {
      theme = "catppuccin-mocha";
      font-family = "JetBrainsMono Nerd Font";
      font-size = 14;
    };
  };

  programs.yazi = lib.mkIf hasGUI {
    enable = true;
    catppuccin.enable = true;
  };

  # ═══════════════════════════════════════════════════════════
  # PACKAGES
  # ═══════════════════════════════════════════════════════════
  home.packages = with pkgs; [
    # Always installed (CLI tools)
    ripgrep fd eza zoxide jq tree htop btop
    python312 uv
    nodejs_22 bun

    # ML tools
    python312Packages.numpy
    python312Packages.pandas
    python312Packages.matplotlib
  ] ++ (lib.optionals hasGUI [
    # GUI-only packages
    vscode firefox obsidian telegram-desktop
    mpv imv zathura
    wl-clipboard grim slurp
  ]);

  programs.home-manager.enable = true;
}
```

**Key points**:
- Receives `hasGUI` via `extraSpecialArgs`
- `lib.mkIf hasGUI` for conditional programs (ghostty, yazi)
- `lib.optionals hasGUI` for conditional packages
- Conditional imports for niri.nix

## Migration Example

### Before (hardcoded)

```nix
# hosts/desktop/default.nix
{ config, pkgs, lib, username, ... }:
{
  # Hardcoded NVIDIA
  hardware.nvidia = {
    modesetting.enable = true;
    package = config.boot.kernelPackages.nvidiaPackages.stable;
  };

  # Hardcoded GUI
  services.xserver = {
    enable = true;
    desktopManager.gnome.enable = true;
  };

  # Hardcoded memory-based swap
  zramSwap = {
    enable = true;
    memoryPercent = 25;  # Assumes 64GB
  };
}

# home/default.nix
{ pkgs, lib, username, ... }:
{
  home.packages = with pkgs; [
    ripgrep
    firefox    # Hardcoded GUI app
    vscode     # Hardcoded GUI app
  ];
}
```

### After (hardware-agnostic)

```nix
# hosts/desktop/default.nix
{ config, pkgs, lib, username, ... }:
{
  options.myConfig = {
    hasNvidia = lib.mkOption { type = lib.types.bool; default = false; };
    hasGUI = lib.mkOption { type = lib.types.bool; default = true; };
  };

  home-manager.extraSpecialArgs = {
    hasGUI = config.myConfig.hasGUI;
  };

  # Conditional NVIDIA
  hardware.nvidia = lib.mkIf config.myConfig.hasNvidia {
    modesetting.enable = true;
    package = config.boot.kernelPackages.nvidiaPackages.stable;
  };

  # Conditional GUI
  services.xserver = lib.mkIf config.myConfig.hasGUI {
    enable = true;
    desktopManager.gnome.enable = true;
  };

  # Adaptive swap (works on any RAM)
  zramSwap = {
    enable = true;
    memoryPercent = 25;
  };
}

# home/default.nix
{ pkgs, lib, username, hasGUI, ... }:
{
  home.packages = with pkgs; [
    ripgrep  # Always installed
  ] ++ (lib.optionals hasGUI [
    firefox  # GUI-only
    vscode   # GUI-only
  ]);
}

# hosts/desktop/hardware-configuration.nix
{
  myConfig.hasNvidia = true;
  myConfig.hasGUI = true;
  # ... auto-generated hardware ...
}
```

## Testing Matrix

| Machine | hasNvidia | hasGUI | Result |
|---------|-----------|--------|--------|
| Desktop (RTX 4060) | true | true | NVIDIA + GUI |
| Laptop (Intel) | false | true | Intel graphics + GUI |
| Server (headless) | false | false | No GPU drivers, no display |
| VM (cloud) | false | false | Minimal TUI only |

## Common Mistakes

### ❌ Wrong: Passing hasNvidia via flake.nix

```nix
# flake.nix
mkSystem = { hostname, hasNvidia, hasGUI }: nixpkgs.lib.nixosSystem {
  specialArgs = { inherit hasNvidia hasGUI; };
  # ...
};

nixosConfigurations.desktop = mkSystem {
  hostname = "desktop";
  hasNvidia = true;  # ❌ Hardcoded in flake.nix
  hasGUI = true;
};
```

**Problem**: Requires editing flake.nix for each machine.

### ✅ Right: Define options in default.nix

```nix
# flake.nix
mkSystem = hostname: nixpkgs.lib.nixosSystem {
  modules = [ ./hosts/${hostname} ];
};

# hosts/desktop/default.nix
options.myConfig = {
  hasNvidia = lib.mkOption { type = lib.types.bool; default = false; };
  hasGUI = lib.mkOption { type = lib.types.bool; default = true; };
};

# hosts/desktop/hardware-configuration.nix
myConfig.hasNvidia = true;
myConfig.hasGUI = true;
```

**Benefit**: Only hardware-configuration.nix varies per machine.

### ❌ Wrong: Conditional on individual fields

```nix
hardware.nvidia = {
  modesetting.enable = lib.mkIf config.myConfig.hasNvidia true;
  package = lib.mkIf config.myConfig.hasNvidia ...;
};
```

**Problem**: Creates partial attribute sets, causes evaluation errors.

### ✅ Right: Conditional on entire attribute set

```nix
hardware.nvidia = lib.mkIf config.myConfig.hasNvidia {
  modesetting.enable = true;
  package = ...;
};
```

**Benefit**: Either the whole NVIDIA config exists, or it doesn't.

## Verification Commands

After setup, verify the pattern works:

```bash
# Check if NVIDIA is loaded
if [ "$(nix eval --raw .#nixosConfigurations.desktop.config.myConfig.hasNvidia)" = "true" ]; then
  nvidia-smi
fi

# Check if GUI is available
if [ "$(nix eval --raw .#nixosConfigurations.desktop.config.myConfig.hasGUI)" = "true" ]; then
  echo "GUI enabled"
  echo $XDG_SESSION_TYPE  # Should show "wayland"
fi

# Check packages
which firefox  # Should exist if hasGUI = true
which ripgrep  # Should always exist
```
