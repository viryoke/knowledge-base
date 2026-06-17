---
title: Transformer变体全景
created: 2026-05-30
updated: 2026-05-30
type: concept
tags: [architecture, inference]
sources:
  - raw/articles/lilian-weng-transformer-family-v1.md
  - raw/articles/lilian-weng-transformer-family-v2.md
related:
  - "[[transformer]]"
  - "[[attention-mechanism]]"
  - "[[inference-reasoning]]"
  - "[[distributed-training]]"
---

# Transformer变体全景

> Lilian Weng对Transformer架构演进的系统性梳理，覆盖2018-2023年间的重要变体。

## 核心动机

原始Transformer面临的关键挑战：
- **计算复杂度**：O(n²)的自注意力，长序列成本高昂
- **内存占用**：需要存储完整的注意力矩阵
- **固定深度**：所有token经过相同层数，缺乏自适应
- **上下文限制**：难以处理超长序列

## 架构演进时间线

### 早期变体（2018-2020）

**1. 改进注意力跨度**

**Transformer-XL** (2019)：
- 引入segment-level recurrence
- 缓存前一层的隐藏状态
- 可以建模超长距离依赖

**Adaptive Attention Span** (2019)：
- 每个head学习不同的注意力范围
- 简单任务用短跨度，复杂任务用长跨度
- 减少不必要的计算

**Localized Attention** (Image Transformer, 2018)：
- 只关注局部邻域
- 适合图像生成任务
- 线性复杂度

**2. 降低时间和内存成本**

**Sparse Transformers** (2019)：
- 注意力矩阵稀疏分解
- 使用局部和跨步注意力模式
- 复杂度降至O(n√n)

**Reformer** (2020)：
- 使用Locality-Sensitive Hashing (LSH)
- 相似向量映射到同一桶
- 只计算同桶内的注意力
- 复杂度O(n log n)

**3. 循环机制**

**Universal Transformer** (2018)：
- 所有层共享参数
- 动态决定每个token的循环次数
- 类似RNN但保持并行性

**GTrXL** (2019)：
- 为强化学习优化的Transformer
- 使用Gated Transformer-XL
- 更好的训练稳定性

### 现代变体（2020-2023）

**1. 高效注意力**

**Linear Attention**：
- 使用核函数近似softmax
- 复杂度O(n)
- 代表：Linear Transformer, Performer

**FlashAttention** (2022)：
- IO感知的注意力算法
- 减少HBM访问
- 加速2-4倍，内存减少5-20倍

**Multi-Query/Grouped-Query Attention**：
- 多个query共享KV cache
- 减少内存占用
- 保持模型质量

**2. 长上下文处理**

**ALiBi** (2022)：
- 线性偏置的位置编码
- 不需要显式位置向量
- 可以外推到更长序列

**RoPE** (Rotary Position Embedding)：
- 旋转位置编码
- 相对位置信息
- 被LLaMA等广泛采用

**Ring Attention**：
- 分布式注意力计算
- 序列切分到多个设备
- 支持超长上下文

**3. 自适应计算**

**Adaptive Computation Time (ACT)**：
- 动态决定每个token的计算步数
- 简单token早停，复杂token多算
- 平衡效率和准确率

**Depth-Adaptive Transformer**：
- 允许不同token在不同层退出
- 使用置信度阈值
- 减少平均推理成本

**4. 架构创新**

**Mixture of Experts (MoE)**：
- 每个token只激活部分专家
- 扩大模型容量但不增加计算
- 代表：Switch Transformer, GShard

**State Space Models (SSM)**：
- 连续时间状态空间模型
- 线性复杂度
- 代表：S4, Mamba

**RetNet**：
- 结合RNN和Transformer优势
- 训练时并行，推理时循环
- 支持长上下文

## 关键技术创新

### 位置编码演进

**绝对位置编码**：
- 可学习的位置向量
- 简单但难以外推

**相对位置编码**：
- 建模token间的相对距离
- 更好的泛化能力

**旋转位置编码 (RoPE)**：
- 通过旋转实现相对位置
- 数学优雅，效果优秀
- 当前主流方案

### 注意力机制优化

**KV Cache**：
- 缓存历史KV，避免重复计算
- 自回归生成的关键优化

**Sliding Window Attention**：
- 只关注固定窗口内的token
- 线性复杂度
- 适合长序列

**Cross-Attention**：
- 不同序列间的注意力
- 用于encoder-decoder架构

### 效率提升技术

**量化**：
- INT8/INT4量化
- 减少内存和计算
- 保持模型质量

**剪枝**：
- 移除不重要的权重或注意力头
- 稀疏化模型

**知识蒸馏**：
- 大模型指导小模型
- 压缩模型规模

## 与已有知识的关联

### [[transformer]]
- 本文是transformer页面的扩展阅读
- 提供架构演进的历史视角
- 理解各种变体的设计动机

### [[attention-mechanism]]
- 深入探讨注意力机制的优化方向
- 从O(n²)到O(n)的演进路径
- 不同注意力模式的适用场景

### [[inference-reasoning]]
- 长上下文处理是推理的关键
- KV cache和efficient attention直接影响推理速度
- MoE可以扩大推理能力

### [[distributed-training]]
- 大型Transformer变体需要分布式训练
- MoE、Ring Attention等需要多GPU支持
- 训练效率优化与架构设计相互影响

## 选择指南

**需要长上下文**：
- 优先：RoPE + FlashAttention
- 备选：Transformer-XL, ALiBi
- 超长序列：Ring Attention, SSM

**需要快速推理**：
- 优先：Multi-Query Attention + KV Cache
- 备选：Adaptive Computation Time
- 内存受限：量化 + 剪枝

**需要大模型容量**：
- 优先：Mixture of Experts
- 备选：深度自适应
- 平衡效率：稀疏注意力

**需要训练效率**：
- 优先：FlashAttention + 混合精度
- 备选：Linear Attention
- 大规模：分布式MoE

## 引用建议

> "The Transformer architecture has evolved rapidly since 2017, with numerous variants addressing different challenges in efficiency, scalability, and capability."
