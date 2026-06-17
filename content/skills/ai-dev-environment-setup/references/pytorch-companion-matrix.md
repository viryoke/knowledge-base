# PyTorch Companion Version Matrix

Official version mapping between PyTorch and its companion libraries (torchvision, torchaudio).

**Source**: [torchvision README](https://github.com/pytorch/vision) — this is the authoritative source.

## Compatibility Table

| PyTorch | torchvision | Python Support |
|---------|-------------|----------------|
| 2.12    | 0.27        | ≥3.10, ≤3.14   |
| 2.11    | 0.26        | ≥3.10, ≤3.13   |
| 2.10    | 0.25        | ≥3.10, ≤3.13   |
| 2.9     | 0.24        | ≥3.9, ≤3.13    |
| 2.8     | 0.23        | ≥3.9, ≤3.13    |
| 2.7     | 0.22        | ≥3.9, ≤3.12    |
| 2.6     | 0.21        | ≥3.9, ≤3.12    |
| 2.5     | 0.20        | ≥3.8, ≤3.11    |
| 2.4     | 0.19        | ≥3.8, ≤3.11    |
| 2.3     | 0.18        | ≥3.8, ≤3.11    |

## torchaudio Status

**Warning**: torchaudio documentation often lags behind PyTorch releases. As of May 2026, the official compatibility table only covers up to PyTorch 2.6.

**Pattern**: torchaudio version typically matches PyTorch major.minor (e.g., torch 2.6 → torchaudio 2.6.0), but this is not officially documented for recent versions.

**Verification method**: Install and run functional tests rather than relying on docs:

```python
import torchaudio
# Test basic functionality
waveform = torch.randn(1, 16000)
resampler = torchaudio.transforms.Resample(orig_freq=16000, new_freq=8000)
resampled = resampler(waveform)
```

## CUDA Index URLs

PyTorch provides pre-built wheels for specific CUDA versions. The recommended CUDA version changes with each PyTorch release.

**As of May 2026**:
- PyTorch 2.12.0 → `--index-url https://download.pytorch.org/whl/cu126` (CUDA 12.6)
- Driver requirement: CUDA 12.6 or higher (check via `nvidia-smi`)

**Critical**: Always check `https://pytorch.org/get-started/locally/` for the current recommended CUDA version. Do not hardcode old URLs.

## How to Verify Your Setup

```python
import torch
import torchvision
import torchaudio

print(f"PyTorch: {torch.__version__}")
print(f"torchvision: {torchvision.__version__}")
print(f"torchaudio: {torchaudio.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"CUDA version: {torch.version.cuda}")
    print(f"cuDNN version: {torch.backends.cudnn.version()}")
```

Expected output for PyTorch 2.12.0+cu126:
- torch: 2.12.0+cu126
- torchvision: 0.27.0+cu126
- torchaudio: 2.11.0+cu126 (or 2.12.x if released)
