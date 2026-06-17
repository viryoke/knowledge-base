---
title: 梯度下降 (Gradient Descent)
created: 2026-05-28
updated: 2026-05-28
type: concept
tags: [training, llm]
sources: []
confidence: high
---

# 梯度下降 (Gradient Descent)

## 定义

通过迭代更新参数以最小化目标函数的优化算法。它是[[neural-network]]训练中最核心的优化方法，几乎所有深度学习模型的训练都依赖它或其变体。

## 核心公式

$$\theta = \theta - \alpha \nabla J(\theta)$$

其中：
- $\theta$：模型参数
- $\alpha$：学习率（learning rate）
- $\nabla J(\theta)$：目标函数关于参数的梯度

## 关键变体

| 变体 | 描述 | 优缺点 |
|------|------|--------|
| **Batch GD** | 每次用全部数据计算梯度 | 收敛稳定但计算开销大 |
| **Stochastic GD (SGD)** | 每次只用一个样本 | 速度快但震荡剧烈 |
| **Mini-batch GD** | 每次用一小批样本 | 兼顾速度和稳定性，实际最常用 |
| **Adam optimizer** | 自适应学习率 + momentum | 大规模训练默认选择 |
| **AdamW** | Adam + 解耦权重衰减 | 现代 LLM 训练标配 |

## 学习率 (Learning Rate)

学习率是梯度下降中最重要的超参数之一：

- **太小**：收敛速度极慢，可能陷入局部最优
- **太大**：不收敛或产生震荡，甚至发散
- **合适**：稳定下降到（局部）最优

现代训练通常配合学习率调度（learning rate scheduling）：warmup → cosine decay / linear decay。

## 跨课程视角

> 以下课程深入讲解了梯度下降，点击课程名查看完整笔记。

### [[andrew-ng-ml-specialization|Andrew Ng ML Specialization]] (videos 08, 09, 17, 19)

从最简单的线性回归引入，用可视化方式讲解代价函数（cost function）曲面和下降路径。特别强调凸函数（convex function）的全局最优保证——在线性回归中，代价函数是凸的，因此梯度下降一定能找到全局最优解。^[raw/transcripts/andrew-ng-ml-spec/08-C1W1L2-Gradient-Descent.md] ^[raw/transcripts/andrew-ng-ml-spec/09-C1W1L3-Learning-Rate.md]

### [[hylee-genai-ml-2025|李宏毅 GenAI 2025]] (第5讲 BasicML)

在深度学习框架下讲解优化，引入 **momentum** 和学习率调度。强调实际训练中 loss landscape 远比线性回归复杂，需要更 sophisticated 的优化策略。^[raw/transcripts/hylee-genai-2025/05-Basic-ML-DL.md]

### [[hylee-ml-2025|李宏毅 ML 2025]] (第5讲 Pretrain)

聚焦大规模训练中的优化挑战：AdamW 等现代优化器、mixed precision training、gradient clipping。讨论了为什么在 pretrain 阶段优化器的选择和超参数调优至关重要。^[raw/transcripts/hylee-ml-2025/05-pretrain.md]

### [[karpathy-nn-zero-to-hero|Karpathy NN Zero to Hero]] (micrograd)

从零手写梯度下降，通过[[backpropagation]]自动计算梯度。不依赖任何框架，用最朴素的 Python 代码实现整个优化循环，让人真正理解"参数更新"到底在做什么。^[raw/transcripts/karpathy-nn-zero-to-hero/01-micrograd-backprop-VMj-3S1tku0.md]

## 常见陷阱

- **局部最优 (local minima)**：在非凸优化中，梯度下降可能停在局部最优而非全局最优
- **鞍点 (saddle points)**：高维空间中大量存在，梯度为零但不是最优解
- **梯度消失 (vanishing gradients)**：深层网络中梯度逐层衰减，导致底层参数几乎不更新（参见[[activation-functions]]中 ReLU 对此的缓解）
- **梯度爆炸 (exploding gradients)**：梯度逐层放大，导致参数更新过大，训练不稳定

## 相关概念

- [[backpropagation]] — 计算梯度的核心算法
- [[loss-function]] — 梯度下降要最小化的目标
- [[neural-network]] — 梯度下降的主要应用场景
- [[training-tips]] — 训练中的实用技巧
- [[activation-functions]] — 影响梯度流动的关键组件
