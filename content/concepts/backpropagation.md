---
title: 反向传播 (Backpropagation)
created: 2026-05-28
updated: 2026-05-28
type: concept
tags: [training, llm]
sources: []
confidence: high
---

# 反向传播 (Backpropagation)

## 定义

利用链式法则（chain rule）高效计算[[neural-network]]中每个参数的梯度。它是[[gradient-descent]]能够应用于深层网络的关键——没有反向传播，计算梯度的成本将随参数数量指数增长。

## 核心洞察

> **计算图 (Computation Graph) + 链式法则 (Chain Rule) = 高效梯度计算**

反向传播的本质是在计算图上做反向的梯度传递。每个操作节点都知道自己的局部梯度，通过链式法则将上游梯度乘以局部梯度，传递给下游节点。

$$\frac{\partial L}{\partial x} = \frac{\partial L}{\partial y} \cdot \frac{\partial y}{\partial x}$$

## 关键概念

- **计算图 (Computation Graph)**：将前向计算过程表示为有向无环图，每个节点是一个操作
- **链式法则 (Chain Rule)**：复合函数求导的核心法则，反向传播的数学基础
- **自动微分 (Autograd)**：框架（如 PyTorch、JAX）自动构建计算图并执行反向传播
- **梯度累积 (Gradient Accumulation)**：在显存有限时，多个 mini-batch 的梯度累加后再更新参数，等效于更大的 batch size

## 跨课程视角

> 以下课程深入讲解了反向传播，点击课程名查看完整笔记。

### [[karpathy-nn-zero-to-hero|Karpathy NN Zero to Hero]] (L1 micrograd)

最经典的讲解——从零构建自动微分引擎，手写 `Value` 类和 `backward` 方法。每个 `Value` 对象保存一个数值和其梯度，通过 `+`、`*`、`relu` 等操作构建计算图，然后调用 `backward()` 递归地反向传播梯度。让人真正理解反向传播不是魔法，而是简单的链式法则的递归应用。^[raw/transcripts/karpathy-nn-zero-to-hero/01-micrograd-backprop-VMj-3S1tku0.md]

### [[karpathy-nn-zero-to-hero|Karpathy NN Zero to Hero]] (L5 Backprop Ninja)

手动推导反向传播，不依赖 autograd，逐行手写每个操作的梯度计算。深入理解梯度流（gradient flow）和数值稳定性问题，例如 softmax + cross-entropy 的梯度合并技巧。^[raw/transcripts/karpathy-nn-zero-to-hero/05-makemore-backprop-ninja-q8SA3rM6ckI.md]

### [[hylee-genai-ml-2025|李宏毅 GenAI 2025]] (第5-6讲)

在 PyTorch 框架下讲解，侧重实际使用而非手写实现。强调 `loss.backward()` 和 `optimizer.step()` 的配合使用，以及 `zero_grad()` 的重要性（PyTorch 默认会累积梯度）。^[raw/transcripts/hylee-genai-2025/05-Basic-ML-DL.md]

### [[hylee-ml-2025|李宏毅 ML 2025]] (第5讲)

大规模模型训练中的反向传播优化：gradient checkpointing（用计算换显存）、mixed precision training、分布式训练中的梯度同步策略。^[raw/transcripts/hylee-ml-2025/05-pretrain.md]

## 实现要点

```python
# PyTorch 中的反向传播三步曲
loss = criterion(output, target)  # 1. 计算损失
loss.backward()                    # 2. 反向传播计算梯度
optimizer.step()                   # 3. 更新参数
optimizer.zero_grad()              # 4. 清零梯度（顺序可调）
```

### 数值稳定性注意事项

- Softmax + Cross-Entropy 应使用合并实现（`F.cross_entropy`），避免中间步骤的数值溢出
- 梯度裁剪（gradient clipping）防止梯度爆炸
- Mixed precision 下注意 loss scaling

## 相关概念

- [[gradient-descent]] — 反向传播计算梯度后，用梯度下降更新参数
- [[neural-network]] — 反向传播的应用对象
- [[activation-functions]] — 每个激活函数的导数影响梯度流
- [[training-tips]] — 训练中与反向传播相关的实用技巧
