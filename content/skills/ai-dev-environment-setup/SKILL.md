---
name: ai-dev-environment-setup
description: "AI/ML Python dev environment: hardware-aware version selection, PyTorch + companion library compatibility auditing, uv-managed venvs, Ollama local LLMs."
version: 1.0.0
author: agent
tags: [pytorch, cuda, ollama, uv, ai-dev, gpu, transformers, ml-env]
platforms: [linux]
---

# AI/ML Dev Environment Setup

Set up a GPU-accelerated Python AI development environment with version-compatible packages.

## Triggers

- User asks to set up / configure an AI or ML development environment
- User asks to install PyTorch, CUDA, or ML libraries
- User asks to verify ML library compatibility
- User asks to set up local LLM inference (Ollama)

## Core Principle

**Hardware-first version selection**: Determine the latest versions that are *compatible with the user's hardware*, not simply the newest release numbers. Cross-validate from authoritative sources before installing anything.

## Workflow (6 phases)

### Phase 1: Hardware Reconnaissance

```bash
# GPU + driver + CUDA support ceiling
nvidia-smi  # Look for "CUDA Version: X.Y" — this is the driver's max supported CUDA, not installed toolkit
cat /etc/os-release | head -5
free -h | head -2
```

The `CUDA Version` shown by nvidia-smi is the **maximum CUDA version the driver supports**, not the installed toolkit. PyTorch bundles its own CUDA runtime, so you just need the driver to be new enough.

### Phase 2: Authoritative Version Discovery

**Always check the PyTorch official site first** — never guess the install command from memory:

1. Navigate to `https://pytorch.org/get-started/locally/`
2. Select: **Stable** build → **Linux** → **Pip** → **Python** → note the default **CUDA** option
3. The page shows the recommended install command with the correct `--index-url`
4. The CUDA version in that URL (e.g., `cu126`) is the *recommended* version, not necessarily the highest

**Pitfall**: Do NOT hardcode a CUDA index URL from memory. The recommended CUDA version changes with each PyTorch release. Using an old index (e.g., `cu124` when `cu126` is current) will install an outdated PyTorch.

### Phase 3: Companion Version Matrix

After installing PyTorch, verify companion packages match:

| PyTorch | torchvision | torchaudio | Source |
|---------|-------------|------------|--------|
| 2.12    | 0.27        | ~2.12      | [torchvision README](https://github.com/pytorch/vision) has explicit table |

- **torchvision**: Check the official README compatibility table (reliable)
- **torchaudio**: Docs often lag behind releases; verify by import + functional test
- **vllm**: Pins exact `torch==X.Y.Z` — check PyPI metadata before installing; may require downgrading PyTorch
- **transformers**: Requires `torch>=2.4` (no upper bound as of 5.x) — safe with current PyTorch
- **accelerate/peft/trl**: Require `torch>=1.13` or `>=2.0` — generally safe

**Cross-validate from PyPI**: Use `browser_navigate` to `https://pypi.org/pypi/<package>/json` and extract `info.version` + `info.requires_dist` to check dependency constraints.

### Phase 4: Environment Creation (uv)

Use **uv** for environment management — fast, PEP 668 compliant, no system Python conflicts:

```bash
mkdir -p ~/ai-dev && cd ~/ai-dev
uv init --python 3.11 ai-env && cd ai-env
uv venv --python 3.11
source .venv/bin/activate

# PyTorch with correct CUDA index (from Phase 2)
uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu126
```

**Pitfall**: On PEP 668 systems (Arch/CachyOS, recent Ubuntu), never use system pip. Always use `uv pip install` inside a venv.

### Phase 5: Library Installation

Install companion libraries in groups, checking compatibility as you go:

```bash
# HuggingFace ecosystem
uv pip install transformers accelerate datasets safetensors huggingface_hub peft trl

# Application layer
uv pip install gradio openai anthropic langchain langchain-community langchain-ollama

# Data/vector
uv pip install chromadb sentence-transformers

# Data science
uv pip install jupyter jupyterlab ipywidgets matplotlib seaborn scikit-learn pandas numpy scipy
```

### Phase 6: Verification

Run a comprehensive functional test — import alone is not enough:

```python
# GPU compute
import torch
x = torch.randn(1000, 1000, device='cuda')
assert torch.cuda.is_available()

# Companion library functional tests
from torchvision import transforms  # Must import
from transformers import AutoTokenizer  # Must load a tokenizer
from accelerate import Accelerator  # Must initialize
from peft import LoraConfig  # Must create config

# Check for warnings
import warnings
with warnings.catch_warnings(record=True) as w:
    warnings.simplefilter("always")
    # re-import all key libs
    # assert no DeprecationWarning or FutureWarning
```

## Ollama (Local LLM)

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2:1b    # Quick test model
ollama pull qwen2.5:7b     # General purpose (8GB VRAM friendly)
```

**VRAM sizing guide for 8GB GPUs**: Use ≤7B parameter models. Quantized variants (Q4_K_M) allow larger models.

## Pitfalls

1. **Never guess CUDA index URLs** — check pytorch.org/get-started/locally/ every time
2. **Never blindly install latest** — check hardware compatibility first (nvidia-smi CUDA ceiling)
3. **vllm pins torch version exactly** — if you need vllm, check its PyPI page for the required torch version and plan around it
4. **torchaudio docs lag** — the compatibility table may not cover the latest PyTorch; rely on functional tests
5. **PEP 668 systems** — always use uv inside a venv, never system pip
6. **Cross-validate before installing** — use browser tools to check PyPI and official docs, don't rely on memory

## Support Files

- `references/pytorch-companion-matrix.md` — PyTorch ↔ torchvision/torchaudio version mapping
- `references/library-compatibility-notes.md` — Known constraints and conflicts for popular AI libraries
