---
title: Transformer 架构
created: 2026-05-28
updated: 2026-05-28
type: concept
tags: [llm, training, inference]
sources: []
confidence: high
---

# Transformer 架构

## 定义

基于自注意力机制（self-attention）的序列到序列模型架构，2017 年由 Google 在论文 *"Attention Is All You Need"* 中提出。它彻底取代了 RNN/LSTM，成为几乎所有现代[[language-model]]的基础架构。

## 核心组件

| 组件 | 功能 |
|------|------|
| **Self-Attention** | 让序列中每个位置都能"看到"并关注其他所有位置 |
| **Multi-Head Attention** | 多个注意力头并行，捕获不同子空间的关系 |
| **Positional Encoding** | 为序列注入位置信息（Transformer 本身是置换不变的） |
| **Feed-Forward Network (FFN)** | 每个位置独立的两层全连接网络，增加模型容量 |
| **Layer Normalization** | 稳定训练，Pre-Norm vs Post-Norm 的选择影响训练稳定性 |
| **Residual Connections** | 缓解深层网络的梯度消失问题 |

## 注意力机制详解

$$\text{Attention}(Q, K, V) = \text{Softmax}\left(\frac{Q \cdot K^T}{\sqrt{d_k}}\right) \cdot V$$

其中：
- $Q$ (Query)：查询向量，"我在找什么"
- $K$ (Key)：键向量，"我有什么"
- $V$ (Value)：值向量，"我的具体内容"
- $d_k$：键向量的维度，缩放因子防止点积过大

**因果自注意力 (Causal Self-Attention)**：在 decoder 中使用 mask 确保每个位置只能看到它之前的 token，这是自回归[[language-model]]的关键约束。

## 为什么 Transformer 如此重要

- **并行计算**：不像 RNN 必须逐步处理序列，Transformer 可以并行处理所有位置
- **长距离依赖**：自注意力直接建模任意两个位置的关系，不存在 RNN 的长距离遗忘问题
- **可扩展性 (Scalability)**：架构天然适合 scaling up，催生了 GPT、LLaMA 等大模型

## 架构变体

| 类型 | 代表模型 | 用途 |
|------|----------|------|
| **Encoder-only** | BERT | 理解任务（分类、NER） |
| **Decoder-only** | GPT, LLaMA | 生成任务（对话、创作） |
| **Encoder-Decoder** | T5, BART | 序列到序列（翻译、摘要） |

当前主流 LLM 几乎全部采用 **Decoder-only** 架构。

## 跨课程视角

> 以下课程深入讲解了 Transformer 架构，点击课程名查看完整笔记。

### [[karpathy-nn-zero-to-hero|Karpathy NN Zero to Hero]] (L7 Build GPT)

从零手写一个 GPT，逐行实现 Transformer 的每个组件——因果自注意力（causal self-attention）、多头注意力（multi-head attention）、位置编码（positional encoding）、前馈网络（FFN）。社区公认的最佳 Transformer 入门教程：不依赖任何框架的抽象，用最朴素的 PyTorch 代码构建一个可运行的 mini-GPT。^[raw/transcripts/karpathy-nn-zero-to-hero/07-gpt-build-2jCvN01C5mE.md]

### [[karpathy-llm-talks|Karpathy LLM Talks]] (L2 Deep Dive)

在更大的技术栈视角下讲解 Transformer 在 LLM 中的角色。从 tokenizer 到 Transformer 到 RLHF，展示 Transformer 只是 LLM 技术栈中的一个关键组件。^[raw/transcripts/karpathy-llm-talks/02-deep-dive-llm-7xSuS5HCAM.md]

### [[hylee-genai-ml-2025|李宏毅 GenAI 2025]] (第1, 3讲)

从生成式 AI 原理切入，讲解注意力机制如何让模型"看到"整个输入序列。用直觉化的方式解释 Q、K、V 的含义，以及为什么注意力权重可以被理解为"相关性"。^[raw/transcripts/hylee-genai-2025/01-LLM-Intro.md] ^[raw/transcripts/hylee-genai-2025/03-LLM-Dissection.md]

### [[hylee-ml-2025|李宏毅 ML 2025]] (第4讲 Mamba)

讨论 Transformer 的局限性和竞争架构——State Space Models (SSM) / Mamba。核心问题：Transformer 的注意力计算是 $O(n^2)$，对于超长序列效率低下。Mamba 用线性复杂度的状态空间模型替代注意力，但在某些任务上表现不如 Transformer。^[raw/transcripts/hylee-ml-2025/04-mamba.md]

## 争议与前沿

### Mamba/SSM 是否会取代 Transformer？

- **支持替代**：线性复杂度 $O(n)$，更适合超长上下文
- **支持互补**：Transformer 在需要精确回忆（recall）的任务上仍然更强
- **混合架构**：最新研究趋势是将两者结合（如 Jamba, Zamba），用 Mamba 层处理长距离依赖，用少量 Attention 层处理精确回忆

## 相关概念

- [[language-model]] — Transformer 最主要的应用场景
- [[neural-network]] — Transformer 是一种特殊的神经网络架构
- [[fine-tuning]] — 在预训练 Transformer 上进行任务适配
- [[inference-reasoning]] — Transformer 推理阶段的优化与能力
- [[tokenization]] — Transformer 的输入预处理关键步骤
