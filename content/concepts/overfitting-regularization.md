---
title: 过拟合与正则化 (Overfitting & Regularization)
created: 2026-05-28
updated: 2026-05-28
type: concept
tags: [training, llm]
sources: []
confidence: high
---

## 定义

**过拟合 (Overfitting)** 指模型在训练集上表现优秀但在新数据上泛化能力差的现象。**正则化 (Regularization)** 是通过添加约束或惩罚项来限制模型复杂度、防止过拟合的一系列技术。

## Bias-Variance Tradeoff

| 状态 | 偏差 | 方差 | 表现 |
|------|------|------|------|
| 欠拟合 (Underfitting) | 高 | 低 | 训练集和测试集都差 |
| 适度拟合 | 适中 | 适中 | 泛化良好 |
| 过拟合 (Overfitting) | 低 | 高 | 训练集好、测试集差 |

## 正则化方法

- **L1/L2 正则化** — 在 [[loss-function]] 上添加权重惩罚项
- **Dropout** — 训练时随机丢弃神经元，迫使网络学习鲁棒特征
- **Early Stopping** — 监控验证集性能，在开始过拟合前停止训练
- **Data Augmentation** — 扩充训练数据多样性
- **Weight Decay** — 等价于 L2 正则化的实现方式

## 跨课程视角

> 以下课程深入讲解了过拟合与正则化，点击课程名查看完整笔记。

### [[andrew-ng-ml-specialization|Andrew Ng ML Specialization]] (Videos 26-29)

系统讲解过拟合的诊断和应对策略。从多项式回归的过拟合可视化入手，推导正则化线性回归和正则化逻辑回归的 [[gradient-descent]] 更新公式，展示 $\lambda$ 参数如何控制正则化强度。

^[raw/transcripts/andrew-ng-ml-spec/26-Addressing-Overfitting.md]
^[raw/transcripts/andrew-ng-ml-spec/27-Cost-Function-Regularization.md]

### [[hylee-genai-ml-2025|李宏毅 GenAI 2025]] (第6讲 Training Tips)

实战中的各种防过拟合技巧——包括 Learning Rate Schedule、Batch Normalization、[[activation-functions]] 选择等，从工程角度给出可操作的 [[training-tips]]。

^[raw/transcripts/hylee-genai-2025/06-Training-Tips.md]

### [[karpathy-nn-zero-to-hero|Karpathy NN Zero to Hero]] (L4)

深入分析 BatchNorm 和 Dropout 在字符级语言模型中的作用。通过实验对比不同正则化策略对训练 loss 和生成质量的影响。

^[raw/transcripts/karpathy-nn-zero-to-hero/04-makemore-activations-gradients-P6sfmUTpUmc.md]

## 现代视角：大模型时代的过拟合

传统 ML 理论认为参数量远超数据量时必然过拟合，但 [[language-model]] 和 [[neural-network]] 的实践表明：

- **Double Descent 现象**: 随着模型增大，test error 先升后降，超大模型反而泛化更好
- **Implicit Regularization**: [[gradient-descent]] 本身带有隐式正则化效果
- **Scale Laws**: 在 [[evaluation-benchmark]] 上，更大模型 + 更多数据持续提升性能

这对 [[fine-tuning]] 也有启示——微调时的过拟合风险需要结合具体数据量来评估。

## 相关链接

- [[loss-function]] — 正则化项附加在损失函数上
- [[neural-network]] — 过拟合在深度网络中的表现
- [[training-tips]] — 实战中的防过拟合工程技巧
- [[fine-tuning]] — 微调场景下的过拟合风险
- [[evaluation-benchmark]] — 泛化能力的量化评估
