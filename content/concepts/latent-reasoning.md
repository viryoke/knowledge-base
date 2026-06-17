---
title: "Latent Reasoning"
created: 2026-06-01
updated: 2026-06-01
type: concept
tags: [inference, llm, training]
sources: ["https://arxiv.org/abs/2605.30343"]
confidence: medium
---

# Latent Reasoning（潜在推理）

## 定义

**Latent Reasoning** 是一种推理范式：模型在推理时不生成显式的中间文本 token（即不产生 Chain-of-Thought），而是在内部隐式完成推理过程，直接输出最终答案。

核心思想：将推理的"思考过程"从自回归生成的 token 序列转移到模型的内部表示空间（latent space），从而减少推理时的 token 消耗和延迟。

## 与显式推理的对比

| 维度 | 显式推理 (CoT/Reasoning) | 潜在推理 (Latent Reasoning) |
|------|--------------------------|----------------------------|
| 中间步骤 | 生成可见的推理 token | 内部隐式计算，无外部 token |
| 推理延迟 | 较高（需要生成中间 token） | 较低（单次或少量前向传播） |
| 可解释性 | 高（推理链可审查） | 低（推理过程不透明） |
| 计算成本 | 高（更多 token = 更多 FLOPS） | 较低（计算在内部完成） |

## Reasoning in Memory (RiM)

RiM（2026年5月 arXiv 论文）是目前最具代表性的 latent reasoning 方法之一。

### 核心机制

1. **Memory Blocks**：用固定的特殊 token 序列（而非生成的推理步骤）来"解锁"模型的工作记忆容量
2. **单次前向传播**：因为 memory block 是固定的而非生成的，可以在一次 forward pass 中完成
3. **两阶段课程训练**：
   - **Grounding 阶段**：在每个 memory block 之后要求模型预测显式推理步骤，建立记忆与推理的关联
   - **Refinement 阶段**：丢弃逐步监督，仅迭代精炼最终答案

### 关键发现

- 跨不同模型家族和规模，RiM 匹配或超越现有 latent reasoning 方法
- 避免了自回归生成思考步骤的开销
- 证明 LLM 可以被训练使用"工作记忆"作为有效的潜在推理机制

## 与其他方法的关联

### [[inference-reasoning]] 中的"Explicit to Implicit CoT"

在 [[inference-reasoning]] 中已介绍的 Explicit to Implicit CoT 是潜在推理的早期形式：
- 渐进式移除推理 token
- 最终训练出"心算"能力
- RiM 可视为这一思想的系统化实现

### [[self-supervised-learning]]

RiM 的 grounding 阶段使用显式推理作为监督信号，然后在 refinement 阶段移除——这与自监督学习中"预训练→微调"的两阶段范式相似。

### [[transformer]]

Memory block 依赖 Transformer 的注意力机制来在内部表示空间中操作信息。attention 的 key-value 机制天然适合充当"工作记忆"的角色。

## 前沿进展

### RiM (2026-05-31)
arXiv 论文，提出用 memory block 替代 CoT 生成的方法，在推理基准上匹配或超越现有 latent reasoning 方法。

**来源**：[arXiv - Unlocking the Working Memory of Large Language Models for Latent Reasoning](https://arxiv.org/abs/2605.30343)

## 相关概念

- [[inference-reasoning]] — 推理与深度思考的全景
- [[transformer]] — 支撑 latent reasoning 的基础架构
- [[self-supervised-learning]] — 两阶段训练范式的思想来源
- [[knowledge-distillation]] — 另一种将推理能力"内化"的方法
