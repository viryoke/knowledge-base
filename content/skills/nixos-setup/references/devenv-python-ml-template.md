# devenv Python ML Template

Complete working template for Python ML development using Nix devenv.

## Project Structure

```
project/
├── flake.nix          # Flake inputs (nixpkgs + devenv)
├── devenv.nix         # Environment configuration
├── .envrc             # Auto-enter shell (direnv)
└── README.md
```

## flake.nix

```nix
{
  description = "Python ML development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    devenv.url = "github:cachix/devenv";
  };

  outputs = { self, nixpkgs, devenv, ... }:
    let
      system = "aarch64-darwin";  # or x86_64-linux
      pkgs = import nixpkgs {
        inherit system;
        config.allowUnfree = true;
      };
    in {
      devShells.${system}.default = devenv.lib.mkShell {
        inherit inputs pkgs;
        modules = [ ./devenv.nix ];
      };
    };
}
```

## devenv.nix

```nix
{ pkgs, config, ... }:

{
  # Python environment
  languages.python = {
    enable = true;
    version = "3.11";
    venv.enable = true;
    venv.requirements = ''
      torch>=2.0.0
      torchvision
      torchaudio
      d2l==0.17.6
      jupyter
      matplotlib
      pandas
      numpy
    '';
  };

  # Development tools
  packages = [
    pkgs.git
  ];

  # Shell entry message
  enterShell = ''
    echo "🐍 Python ML environment ready"
    echo ""
    echo "Commands:"
    echo "  jupyter notebook    # Start Jupyter"
    echo "  python              # Python REPL"
    echo ""
    echo "Verify PyTorch MPS (Apple Silicon):"
    python -c "import torch; print('MPS available:', torch.backends.mps.is_available())"
  '';
}
```

## .envrc

```bash
use flake .
```

## Usage

```bash
# First time
nix develop

# Download d2l.ai notebooks
curl -Lo d2l-zh-2.0.0.zip https://zh-v2.d2l.ai/d2l-zh-2.0.0.zip
unzip d2l-zh-2.0.0.zip

# Start learning
jupyter notebook
```

## Notes

- `torch>=2.0.0` from pip includes MPS backend for Apple Silicon
- d2l==0.17.6 is the version used by zh.d2l.ai
- Jupyter is installed automatically via d2l's dependencies
- All packages are isolated in the devenv shell, no global pollution
