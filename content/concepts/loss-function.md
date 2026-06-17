---
title: 损失函数 (Loss Function)
created: 2026-05-28
updated: 2026-05-28
type: concept
tags: [training, llm]
sources: []
confidence: high
---

## 定义

衡量模型预测值与真实值之间差距的函数。训练的目标就是最小化损失函数——通过 [[gradient-descent]] 等优化算法不断调整参数，使损失逐步降低。

## 常见类型

- **MSE (Mean Squared Error, 均方误差)** — 回归任务的标准选择，$L = \frac{1}{n}\sum(y_i - \hat{y}_i)^2$
- **Cross-Entropy (交叉熵)** — 分类任务的核心损失，衡量预测概率分布与真实分布的差异
- **Hinge Loss** — SVM 使用的损失函数，关注分类边界

## 跨课程视角

> 以下课程深入讲解了损失函数，点击课程名查看完整笔记。

### [[andrew-ng-ml-specialization|Andrew Ng ML Specialization]] (Videos 06-07, 11, 24)

最系统的讲解——从线性回归的 MSE 到逻辑回归的交叉熵，用可视化方式展示代价函数的形状（凸函数 vs 非凸函数），解释了为什么逻辑回归不能直接用 MSE。

^[raw/transcripts/andrew-ng-ml-spec/06-C1W1L2-Cost-Function.md]
^[raw/transcripts/andrew-ng-ml-spec/24-Logistic-Cost-Function.md]

### [[karpathy-nn-zero-to-hero|Karpathy NN Zero to Hero]] (L1 micrograd)

通过手写实现一个微型自动微分引擎（micrograd），从底层理解损失计算和梯度传播的全过程。每一个 loss 值如何从标量运算链中产生，又如何通过 [[backpropagation]] 反传梯度。

^[raw/transcripts/karpathy-nn-zero-to-hero/01-micrograd-backprop-VMj-3S1tku0.md]

### [[hylee-genai-ml-2025|李宏毅 GenAI 2025]] (第5讲)

深度学习中的损失函数选择——在 [[neural-network]] 训练中，不同任务和架构如何匹配合适的损失函数。

^[raw/transcripts/hylee-genai-2025/05-Basic-ML-DL.md]

## 正则化损失

在原始损失上添加惩罚项以防止 [[overfitting-regularization]]：

- **L1 正则化 (Lasso)**: $\lambda \sum |w_i|$，倾向于产生稀疏权重
- **L2 正则化 (Ridge)**: $\lambda \sum w_i^2$，倾向于让权重趋向小值
- **Elastic Net**: L1 + L2 的组合

## 与 [[classification]] 的关系

交叉熵损失是分类任务的标准选择。在 [[language-model]] 训练中，模型本质上在做 next-token prediction 这一大规模分类任务（词表上的 [[classification]]），因此也使用 Cross-Entropy Loss。

## 相关链接

- [[gradient-descent]] — 最小化损失函数的核心优化算法
- [[overfitting-regularization]] — 正则化损失的设计动机
- [[classification]] — 交叉熵损失的主要应用场景
- [[neural-network]] — 损失函数在神经网络训练中的角色
