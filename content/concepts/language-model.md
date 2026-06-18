---
title: 语言模型 (Language Model)
created: 2026-05-28
updated: 2026-05-28
type: concept
tags: [llm, training, inference]
sources: []
confidence: high
---

# 语言模型 (Language Model)

## 定义

对文本序列的概率分布建模，预测下一个 token 出现的概率：

$$P(w_t \mid w_1, w_2, \ldots, w_{t-1})$$

语言模型的核心任务是**学习语言的统计规律**——从简单的 n-gram 计数到千亿参数的[[transformer]]，本质都是在做"给定上文，预测下一个词"这件事。

## 演化历程

```
N-gram (统计方法, 1980s)
    ↓
RNN/LSTM (神经网络, 2010s)
    ↓
[[transformer]] (注意力机制, 2017)
    ↓
GPT / BERT (预训练大模型, 2018+)
    ↓
GPT-4 / Claude / LLaMA (超大规模 LLM, 2023+)
```

## 关键概念

### 自回归 (Autoregressive)

当前主流 LLM 的生成方式：每次生成一个 token，然后将其加入输入序列，再生成下一个 token。这就像"接龙"一样，逐步构建完整输出。

### 上下文窗口 (Context Window)

模型一次能"看到"的最大 token 数量。早期 GPT-2 是 1024，GPT-4 达到 128K，Claude 达到 200K。上下文窗口的大小直接影响模型处理长文档的能力。

### 困惑度 (Perplexity)

衡量语言模型好坏的经典指标：

$$\text{Perplexity} = \exp\left(-\frac{1}{N}\sum_{i=1}^{N} \log P(w_i \mid w_{<i})\right)$$

困惑度越低，模型对文本的预测越准确。但注意：低困惑度不等于好的对话能力，还需要[[fine-tuning]]来对齐人类偏好。

### 涌现能力 (Emergence)

当模型规模超过某个阈值时，突然出现的能力——这些能力在小模型中完全不存在，无法通过小模型的表现线性外推预测。典型例子：
- **In-context learning**：无需微调，仅通过 few-shot 示例学习新任务
- **Chain-of-thought reasoning**：逐步推理的能力
- **代码生成**：理解和编写程序代码

## 跨课程视角

> 以下课程深入讲解了语言模型，点击课程名查看完整笔记。

### [[karpathy-nn-zero-to-hero|Karpathy NN Zero to Hero]] (L2-6 makemore)

从字符级语言模型开始，用一个简单的 bi-gram 模型生成人名，然后逐步升级到更复杂的架构（MLP、WaveNet-style 卷积），建立语言建模的直觉。核心思想：不管模型多复杂，做的事情都是"给定前面的字符，预测下一个字符的概率分布"。^[raw/transcripts/karpathy-nn-zero-to-hero/02-makemore-language-modeling-PaCmpygFfXo.md]

### [[karpathy-llm-talks|Karpathy LLM Talks]] (L1 Intro, L2 Deep Dive)

LLM 的全景综述——从训练到推理到应用的完整技术栈。L1 介绍 LLM 是什么、怎么工作；L2 深入技术细节，从 tokenizer 到预训练到 RLHF 到 inference。核心洞察：LLM 本质上是一个"下一个 token 预测器"，但其规模带来的涌现能力远超简单的文本补全。^[raw/transcripts/karpathy-llm-talks/01-intro-llm-zjkBMFJNjSQ.md] ^[raw/transcripts/karpathy-llm-talks/02-deep-dive-llm-7xSuS5HCAM.md]

### [[hylee-genai-ml-2025|李宏毅 GenAI 2025]] (第1, 3讲)

生成式 AI 的核心就是语言模型。讲解预训练（pre-training）如何让模型从海量文本中学习语言规律，以及 prompt engineering 如何通过精心设计的输入引导模型产生期望的输出。强调"提示工程本质上是在利用语言模型的条件概率特性"。^[raw/transcripts/hylee-genai-2025/01-LLM-Intro.md]

### [[hylee-ml-2025|李宏毅 ML 2025]] (第3讲)

深入 LLM 内部运作机制，解剖模型行为。探讨模型到底"理解"了什么，还是仅仅在做模式匹配？通过 probing 和 interpretability 研究，揭示 LLM 内部的表征结构。^[raw/transcripts/hylee-ml-2025/03-model_inside.md]

## Scaling Laws

模型性能随三个因素的增加呈现可预测的**幂律关系 (power law)**：

- **参数量 (Parameters)**：模型越大越强
- **数据量 (Data)**：训练数据越多越好
- **计算量 (Compute)**：更多的 FLOPs 带来更好的性能

Kaplan et al. (2020) 和 Chinchilla (2022) 的研究表明，最优训练策略是让模型大小和数据量**同步增长**，而非一味增大模型。

## LLM vs 小型语言模型

| 维度 | 小型 LM | 大型 LM (LLM) |
|------|---------|---------------|
| 参数量 | < 1B | 7B ~ 1T+ |
| 涌现能力 | ❌ | ✅ |
| In-context learning | 有限 | 强大 |
| 推理能力 | 弱 | 显著（尤其 CoT） |
| 训练成本 | 低 | 极高 |
| 应用场景 | 特定任务 | 通用智能助手 |

规模带来的涌现能力（reasoning, in-context learning）是 LLM 区别于传统语言模型的关键特征。

## 相关概念

- [[transformer]] — 现代语言模型的核心架构
- [[tokenization]] — 将文本转化为模型可处理的 token
- [[fine-tuning]] — 在预训练基础上适配特定任务或对齐人类偏好
- [[inference-reasoning]] — LLM 的推理阶段优化和推理能力
- [[generative-model]] — 语言模型是生成模型的一种
