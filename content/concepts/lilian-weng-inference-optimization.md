---
title: "LLM 推理优化 (Lilian Weng)"
created: 2026-05-30
updated: 2026-05-30
type: concept
tags: [llm, inference, mlops]
related:
  - "[[transformer]]"
  - "[[attention-mechanism]]"
  - "[[inference-reasoning]]"
  - "[[lilian-weng-blog]]"
source: raw/articles/lilian-weng-inference-optimization.md
---

# LLM 推理优化

> Lilian Weng 在 2023 年 1 月发布的系统性综述，全面梳理了 Transformer 推理优化的各种技术。这是理解 LLM 工程化的核心参考资料。

## 核心挑战

### 为什么大模型推理困难？

**两个主要因素**（Pope et al. 2022）：

1. **内存占用大**
   - 模型参数 + 中间状态都需要存储在内存中
   - KV Cache 示例：batch size 512 + context length 2048 → KV cache 总计 3TB（模型大小的 3 倍！）
   - 注意力机制的计算成本随序列长度平方增长

2. **并行性低**
   - 自回归生成方式使得解码过程难以并行
   - 每一步都依赖前一步的输出

### 优化目标

- 减少内存占用（使用更少 GPU 设备和显存）
- 降低计算复杂度（减少 FLOPs）
- 提高吞吐量（每秒生成的 token 数）
- 降低延迟（首 token 延迟 + 每 token 延迟）

## 优化技术分类

### 1. 蒸馏（Distillation）

**核心思想**：
- 用大模型（teacher）指导小模型（student）训练
- 小模型学习大模型的行为，而非直接拟合数据

**知识蒸馏的类型**：
- **Logit-based**：学习 teacher 的输出分布
- **Feature-based**：学习 teacher 的中间层表示
- **Relation-based**：学习样本间的关系

**典型工作**：
- DistilBERT（2019）：66% 的 BERT 大小，97% 的性能
- TinyBERT（2019）：多层蒸馏，包括 embedding、encoder、prediction 层
- MobileBERT（2020）：针对移动端优化

**优势**：
- 可以大幅减小模型体积
- 保持较好的性能

**局限**：
- 需要额外的训练成本
- 性能可能有损失

### 2. 量化（Quantization）

**核心思想**：
- 将浮点数参数（FP32/FP16）转换为低精度整数（INT8/INT4）
- 减少内存占用和计算成本

**Transformer 量化的挑战**：
- 权重和激活值的分布不均匀
- 存在异常值（outliers），影响量化精度
- 注意力机制对精度敏感

**两种主要方法**：

#### (1) 训练后量化（PTQ, Post-Training Quantization）
- 不需要重新训练，直接对已训练模型量化
- 速度快，但精度损失可能较大

**关键技术**：

**混合精度量化（Mixed-precision）**：
- 不同层使用不同精度
- 敏感层保持高精度，其他层使用低精度
- 例如：HAWQ（2019）使用 Hessian 信息决定精度

**细粒度量化（Fine-grained granularity）**：
- 按 channel、group、block 等粒度量化
- 比 per-tensor 量化精度更高
- 例如：Per-channel 量化

**二阶信息量化**：
- 使用 Hessian 矩阵指导量化
- 识别对量化敏感的参数
- 例如：AdaRound（2020）、BRECQ（2021）

**异常值平滑（Outlier smoothing）**：
- 检测并平滑异常值
- 减少量化误差
- 例如：SmoothQuant（2022）

#### (2) 量化感知训练（QAT, Quantization-Aware Training）
- 在训练过程中模拟量化误差
- 模型学习适应量化，精度损失更小
- 需要额外的训练成本

**典型工作**：
- Q8BERT（2019）：INT8 量化的 BERT
- LLM.int8()（2022）：混合精度分解，处理异常值
- GPTQ（2022）：一次性量化 GPT 模型

### 3. 剪枝（Pruning）

**核心思想**：
- 移除不重要的权重或神经元
- 减少模型大小和计算量

**剪枝方法**：

#### (1) 如何剪枝？

**非结构化剪枝（Unstructured）**：
- 剪枝单个权重
- 可以达到高稀疏度（90%+）
- 但难以利用硬件加速

**结构化剪枝（Structured）**：
- 剪枝整个神经元、通道、层
- 稀疏度较低（50-70%）
- 可以直接加速推理

**剪枝标准**：
- **Magnitude-based**：剪枝绝对值小的权重
- **Gradient-based**：剪枝梯度小的权重
- **Hessian-based**：剪枝对损失影响小的权重

#### (2) 如何重训练？

**Fine-tuning**：
- 剪枝后微调恢复性能
- 通常只需少量 epoch

**Retraining from scratch**：
- 剪枝后重新训练
- 效果更好但成本高

**典型工作**：
- Lottery Ticket Hypothesis（2018）：存在稀疏子网络
- Movement Pruning（2020）：基于权重变化方向剪枝
- SparseGPT（2023）：一次性剪枝 GPT 模型

### 4. 稀疏性（Sparsity）

**核心思想**：
- 利用稀疏计算减少 FLOPs
- 与剪枝相关，但更关注计算模式

#### (1) N:M 稀疏性

**NVIDIA 的 N:M 模式**：
- 每 M 个连续权重中保留 N 个非零值
- 例如：2:4 稀疏（50% 稀疏度）
- 可以利用 NVIDIA Ampere GPU 的硬件加速

**优势**：
- 结构化稀疏，易于硬件加速
- 性能损失较小

#### (2) 稀疏化 Transformer

**稀疏注意力模式**：
- **Local attention**：只关注局部窗口
- **Strided attention**：跳跃式关注
- **Global attention**：关注全局 token
- **Random attention**：随机关注

**典型工作**：
- Longformer（2020）：local + global attention
- BigBird（2020）：local + global + random
- Linformer（2020）：低秩近似注意力

### 5. Mixture-of-Experts（MoE）

**核心思想**：
- 将模型分为多个专家（experts）
- 每个输入只激活部分专家
- 减少计算量，同时保持模型容量

**关键组件**：

#### (1) 路由策略（Routing Strategy）

**Top-k 路由**：
- 每个 token 选择 top-k 个专家
- 典型：k=1 或 k=2

**负载均衡（Load Balancing）**：
- 避免某些专家过载
- 使用辅助损失函数鼓励均匀分配

**典型工作**：
- Sparsely-Gated MoE（2017）：首次提出 MoE
- GShard（2020）：扩展到 6000 亿参数
- Switch Transformer（2021）：简化路由，top-1 专家

#### (2) 内核优化（Kernel Improvement）

**专家并行（Expert Parallelism）**：
- 不同专家分布在不同设备
- 需要高效的 all-to-all 通信

**典型工作**：
- DeepSpeed-MoE（2022）：优化 MoE 训练
- Tutel（2022）：自适应路由和计算

### 6. 架构优化（Architectural Optimization）

**核心思想**：
- 设计更高效的 Transformer 架构
- 从根源上减少计算和内存需求

#### (1) 稀疏注意力模式

**线性注意力（Linear Attention）**：
- 将 O(n²) 的注意力降为 O(n)
- 使用核函数近似 softmax

**典型工作**：
- Linear Transformer（2020）：使用核函数
- Performer（2020）：随机特征近似
- RWKV（2023）：RNN + Transformer 混合

#### (2) 循环设计（Recurrence）

**核心思想**：
- 引入 RNN 的循环机制
- 复用之前的计算结果

**典型工作**：
- Transformer-XL（2019）：segment-level 循环
- Universal Transformer（2018）：layer-level 循环

#### (3) 内存节省设计

**共享参数**：
- 多层共享同一组参数
- 例如：ALBERT（2019）

**低秩分解**：
- 将大矩阵分解为小矩阵乘积
- 例如：LoRA（2021）用于微调

**KV Cache 优化**：
- **MQA（Multi-Query Attention）**：多个 query 共享同一组 KV
- **GQA（Grouped-Query Attention）**：分组共享 KV
- **PagedAttention**：分页管理 KV cache（vLLM）

#### (4) 自适应注意力（Adaptive Attention）

**核心思想**：
- 根据输入动态调整计算量
- 简单 token 使用少量计算，复杂 token 使用更多计算

**典型工作**：
- Adaptive Attention Span（2019）：学习每个头的注意力范围
- Early Exit（2020）：简单样本提前退出

## 技术对比

| 技术 | 压缩率 | 速度提升 | 精度损失 | 训练成本 | 适用场景 |
|------|--------|----------|----------|----------|----------|
| **蒸馏** | 2-10x | 2-10x | 小-中 | 高 | 需要小模型 |
| **量化（PTQ）** | 2-4x | 2-4x | 小 | 低 | 快速部署 |
| **量化（QAT）** | 4-8x | 4-8x | 小 | 中 | 极致压缩 |
| **剪枝** | 2-10x | 2-10x | 中 | 中 | 结构化稀疏 |
| **MoE** | 2-8x（计算） | 2-8x | 小 | 高 | 超大模型 |
| **架构优化** | 2-4x | 2-4x | 小 | 高 | 新模型设计 |

## 实践建议

### 推理优化选择指南

**场景 1：快速部署已有模型**
- 首选：PTQ（训练后量化）
- 次选：非结构化剪枝 + 稀疏推理引擎

**场景 2：极致压缩**
- 组合：QAT + 结构化剪枝 + 蒸馏
- 示例：INT4 量化 + 50% 剪枝 + 知识蒸馏

**场景 3：训练新模型**
- 首选：MoE 架构
- 次选：线性注意力 + 内存节省设计

**场景 4：长序列推理**
- 首选：稀疏注意力模式
- 次选：KV cache 优化（PagedAttention）

### 工程化注意事项

1. **基准测试**
   - 测量首 token 延迟（Time to First Token）
   - 测量每 token 延迟（Time per Token）
   - 测量吞吐量（Tokens per Second）

2. **内存管理**
   - 监控 KV cache 大小
   - 使用 PagedAttention 或分页管理
   - 考虑 batch size 和 sequence length 的权衡

3. **硬件适配**
   - 量化：选择支持 INT8/INT4 的硬件
   - 稀疏：使用支持稀疏计算的 GPU（NVIDIA Ampere+）
   - MoE：使用高速互联（NVLink、InfiniBand）

4. **精度验证**
   - 在目标任务上验证性能
   - 关注边界情况（长序列、特殊 token）
   - 使用人类评估验证生成质量

## 与已有知识的关联

### [[transformer]]
- 本文提供了 Transformer 推理优化的完整技术栈
- 从量化、剪枝到架构优化，覆盖所有主要方向

### [[attention-mechanism]]
- 注意力机制是推理瓶颈的核心
- 稀疏注意力、线性注意力是主要优化方向

### [[inference-reasoning]]
- 推理优化直接影响推理速度
- 长序列推理需要特别关注 KV cache 优化

### [[lilian-weng-blog]]
- 本文是 Lilian Weng 博客系列的重要补充
- 专注于工程化落地，而非理论研究

### [[mlops-zoomcamp]]
- 推理优化是 MLOps 的核心环节
- 模型压缩 → 部署 → 监控 → 迭代

## 行动建议

1. **评估现有模型**
   - 测量当前推理性能（延迟、吞吐量、内存）
   - 识别瓶颈（计算密集型 vs 内存密集型）

2. **选择合适的优化技术**
   - 根据场景选择（快速部署 vs 极致压缩）
   - 考虑组合使用多种技术

3. **实施优化**
   - 从简单技术开始（PTQ、非结构化剪枝）
   - 逐步尝试更复杂的技术（QAT、MoE）

4. **验证和监控**
   - 在目标任务上验证性能
   - 建立推理性能监控
   - 定期更新优化策略

## 延伸阅读

- [[transformer]] - Transformer 架构基础
- [[attention-mechanism]] - 注意力机制原理
- [[inference-reasoning]] - 推理与深度思考
- [[mlops-zoomcamp]] - MLOps 工程化实践

---

**原始文件**：`raw/articles/lilian-weng-inference-optimization.md` (52KB)

**引用建议**：
> "The extremely high inference cost, in both time and memory, is a big bottleneck for adopting a powerful transformer for solving real-world tasks at scale."
