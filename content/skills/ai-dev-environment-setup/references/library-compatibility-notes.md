# AI Library Compatibility Notes

Known constraints, conflicts, and compatibility requirements for popular AI/ML libraries as of May 2026.

## Critical Conflicts

### vllm: Hard-Pins PyTorch Version

**Issue**: vllm pins exact PyTorch version (e.g., `torch==2.11.0`), making it incompatible with newer PyTorch releases.

**Status**: As of May 2026, vllm 0.22.0 requires `torch==2.11.0` exactly.

**Workaround options**:
1. Downgrade PyTorch to match vllm's requirement (sacrifices PyTorch features)
2. Wait for vllm to release a version compatible with current PyTorch
3. Use separate environments for vllm serving vs development

**Verification**: Check PyPI metadata before installing:
```bash
curl -s https://pypi.org/pypi/vllm/json | jq '.info.requires_dist[] | select(contains("torch"))'
```

### transformers: Safe with Current PyTorch

**Requirement**: `torch>=2.4` (no upper bound as of 5.x series)

**Status**: transformers 5.0.0 through 5.9.0 all support PyTorch 2.12.0+

**Recent breaking changes** (5.8.0+):
- Removed Apex integration
- Changed `text_embeds` input handling

### accelerate / peft / trl: Generally Safe

These HuggingFace libraries have loose PyTorch requirements:
- **accelerate**: `torch>=2.0`
- **peft**: `torch>=1.13`
- **trl**: `torch>=2.0`

**Status**: All compatible with PyTorch 2.12.0 as of May 2026.

### sentence-transformers: Safe

**Requirement**: `torch>=1.11`

**Status**: sentence-transformers 5.5.1 fully compatible with PyTorch 2.12.0

### chromadb: No PyTorch Dependency

**Status**: chromadb has no PyTorch dependency, so no conflicts possible. Tested with 1.5.9.

## Dependency Constraint Checking

Use PyPI JSON API to check library requirements:

```python
import requests
import json

def check_pytorch_requirement(package_name):
    """Check a package's PyTorch version requirement."""
    url = f"https://pypi.org/pypi/{package_name}/json"
    data = requests.get(url).json()
    
    # Get latest version info
    version = data['info']['version']
    requires = data['info']['requires_dist'] or []
    
    # Find torch requirement
    torch_reqs = [r for r in requires if 'torch' in r.lower() and not r.startswith('torchvision')]
    
    print(f"{package_name} {version}")
    print(f"  PyTorch requirement: {torch_reqs[0] if torch_reqs else 'None'}")
    
    return torch_reqs

# Example usage
check_pytorch_requirement('vllm')
check_pytorch_requirement('transformers')
check_pytorch_requirement('accelerate')
```

## Version Compatibility Matrix (May 2026)

| Library | Version | PyTorch Requirement | Compatible with 2.12.0? |
|---------|---------|---------------------|------------------------|
| torchvision | 0.27.0 | Exact match (2.12) | ✅ Yes |
| torchaudio | 2.11.0 | Pattern match | ⚠️ Docs lag, test required |
| transformers | 5.9.0 | >=2.4 | ✅ Yes |
| accelerate | 1.13.0 | >=2.0 | ✅ Yes |
| peft | 0.19.1 | >=1.13 | ✅ Yes |
| trl | 1.5.1 | >=2.0 | ✅ Yes |
| datasets | 4.8.5 | None | ✅ Yes |
| sentence-transformers | 5.5.1 | >=1.11 | ✅ Yes |
| langchain | 1.3.2 | None | ✅ Yes |
| gradio | 6.15.2 | None | ✅ Yes |
| openai | 2.38.0 | None | ✅ Yes |
| chromadb | 1.5.9 | None | ✅ Yes |
| **vllm** | 0.22.0 | **==2.11.0** | ❌ **No** |

## Functional Testing Protocol

Import alone is insufficient. Run functional tests:

```python
import torch
import warnings

# Suppress expected warnings
warnings.filterwarnings('ignore', category=UserWarning, module='transformers')

def test_pytorch():
    """GPU compute test"""
    assert torch.cuda.is_available(), "CUDA not available"
    x = torch.randn(1000, 1000, device='cuda')
    y = torch.nn.functional.softmax(x, dim=-1)
    return "✅ PyTorch GPU compute"

def test_torchvision():
    """Transform pipeline test"""
    from torchvision import transforms
    t = transforms.Compose([
        transforms.Resize(224),
        transforms.ToTensor()
    ])
    return "✅ torchvision transforms"

def test_transformers():
    """Tokenizer load test"""
    from transformers import AutoTokenizer
    tok = AutoTokenizer.from_pretrained("bert-base-uncased")
    encoded = tok("Hello world", return_tensors="pt")
    assert 'input_ids' in encoded
    return "✅ transformers tokenizer"

def test_accelerate():
    """Accelerator init test"""
    from accelerate import Accelerator
    acc = Accelerator()
    return "✅ accelerate Accelerator"

def test_peft():
    """LoRA config test"""
    from peft import LoraConfig
    config = LoraConfig(r=8, lora_alpha=16, target_modules=["q_proj"])
    return "✅ peft LoraConfig"

# Run all tests
tests = [test_pytorch, test_torchvision, test_transformers, 
         test_accelerate, test_peft]

for test in tests:
    try:
        print(test())
    except Exception as e:
        print(f"❌ {test.__name__}: {e}")
```

## Update Frequency

This document should be updated:
- When new PyTorch versions are released
- When library compatibility issues are discovered
- When vllm releases a version compatible with newer PyTorch
- Quarterly review of the compatibility matrix
