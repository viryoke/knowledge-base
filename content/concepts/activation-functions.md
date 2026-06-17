---
title: 激活函数 (Activation Functions)
created: 2026-05-28
updated: 2026-05-28
type: concept
tags: [training, llm]
sources: []
confidence: high
---

## 定义

[[neural-network]] 中引入非线性的函数。没有激活函数，无论多少层网络都等价于单层线性变换——激活函数赋予深度网络表达复杂函数的能力。

## 常见类型

| 函数 | 公式 | 特点 | 使用场景 |
|------|------|------|----------|
| **Sigmoid** | $\frac{1}{1+e^{-x}}$ | 输出 (0,1)，有梯度消失问题 | 二分类输出层 |
| **Tanh** | $\frac{e^x - e^{-x}}{e^x + e^{-x}}$ | 输出 (-1,1)，零均值 | RNN 隐藏层 |
| **ReLU** | $\max(0, x)$ | 计算高效，有 dead neuron 问题 | 通用隐藏层默认 |
| **Leaky ReLU** | $\max(0.01x, x)$ | 解决 dead neuron | CNN 等 |
| **GELU** | $x \cdot \Phi(x)$ | 平滑版 ReLU | Transformer 标准 |
| **Swish/SiLU** | $x \cdot \text{sigmoid}(x)$ | 非单调，性能优异 | LLaMA 等现代 LLM |

## 跨课程视角

> 以下课程深入讲解了激活函数，点击课程名查看完整笔记。

### [[andrew-ng-ml-specialization|Andrew Ng ML Specialization]] (Video 36)

讲解 ReLU 作为现代默认选择的原因，对比 Sigmoid 的梯度消失问题——当输入值远离 0 时 Sigmoid 导数趋近于零，导致 [[backpropagation]] 中梯度逐层衰减，深层网络难以训练。

^[raw/transcripts/andrew-ng-ml-spec/36-Activation-Functions.md]

### [[karpathy-nn-zero-to-hero|Karpathy NN Zero to Hero]] (L4)

深入分析不同 [[activation-functions]] 对梯度流的影响。实验对比 Tanh vs ReLU 在字符级语言模型中的表现，展示激活函数选择如何影响训练收敛速度和最终生成质量。

^[raw/transcripts/karpathy-nn-zero-to-hero/04-makemore-activations-gradients-P6sfmUTpUmc.md]

### [[hylee-genai-ml-2025|李宏毅 GenAI 2025]] (第5-6讲)

[[training-tips]] 中涉及激活函数选择——在深度学习基础和实践技巧两讲中，讨论了不同 [[activation-functions]] 对训练稳定性和模型性能的影响。

^[raw/transcripts/hylee-genai-2025/05-Basic-ML-DL.md]

## 选择指南

- **隐藏层**: 默认 ReLU 或 GELU（Transformer 系列）
- **二分类输出**: Sigmoid（配合 [[loss-function]] 中的 Binary Cross-Entropy）
- **多分类输出**: Softmax（配合 Cross-Entropy Loss）
- **生成模型**: Swish/SiLU（在 LLaMA、Mistral 等模型中广泛使用）

## 前沿趋势

- **Transformer 中的 GELU**: BERT、GPT 系列的标准选择，平滑特性有助于 [[gradient-descent]] 收敛
- **Swish/SiLU 在 LLaMA 中的应用**: Meta 的实验表明 SwiGLU（Swish 变体）在 [[language-model]] 中优于 GELU
- **可学习激活函数**: 如 PReLU（Parametric ReLU），让网络自适应学习激活函数的参数

## 与 [[backpropagation]] 的关系

激活函数的导数直接决定梯度传播的效率。Sigmoid/Tanh 在饱和区梯度消失，ReLU 在负半轴梯度为零（dead neuron），GELU/Swish 通过平滑设计缓解了这些问题。

## 相关链接

- [[neural-network]] — 激活函数是神经网络的基本组件
- [[backpropagation]] — 激活函数导数影响梯度传播
- [[gradient-descent]] — 激活函数选择影响优化收敛
- [[training-tips]] — 激活函数选择的工程实践
