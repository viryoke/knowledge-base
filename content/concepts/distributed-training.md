---
title: 分布式训练
created: 2026-05-30
updated: 2026-05-30
type: concept
tags: [training, engineering, mlops]
sources:
  - raw/articles/lilian-weng-scaling-laws.md
---

# 分布式训练

> 训练大型神经网络的核心技术，通过多种并行策略突破单GPU内存限制。

## 核心挑战

训练大型模型面临两个关键问题：
- **GPU内存限制**：单个GPU无法容纳超大模型
- **训练时间**：大规模数据和深层网络需要极长训练时间

## 训练并行策略

```d2
direction: down

DP: 数据并行 (Data Parallelism) {
  DP1: "GPU 0\n完整模型副本\n数据批次 A"
  DP2: "GPU 1\n完整模型副本\n数据批次 B"
  Sync: "梯度同步"
  Update: "统一更新参数"
  DP1 -> Sync
  DP2 -> Sync
  Sync -> Update
}

MP: 模型并行 (Model Parallelism) {
  L1: "GPU 0\n第 1-10 层"
  L2: "GPU 1\n第 11-20 层"
  L3: "GPU 2\n第 21-30 层"
  L1 -> L2 -> L3
}

PP: 流水线并行 (Pipeline Parallelism) {
  Stage1: "Stage 1\nGPU 0"
  Stage2: "Stage 2\nGPU 1"
  Stage3: "Stage 3\nGPU 2"
  Stage1 -> Stage2 -> Stage3
}

TP: 张量并行 (Tensor Parallelism) {
  Mat: "矩阵乘法"
  Slice1: "GPU 0\n列切分"
  Slice2: "GPU 1\n列切分"
  AllReduce: "AllReduce"
  Mat -> Slice1
  Mat -> Slice2
  Slice1 -> AllReduce
  Slice2 -> AllReduce
}
```

> 四种训练并行策略各有适用场景：数据并行最简单但内存需求高，模型并行可训练超大模型但利用率低，流水线并行减少气泡时间，张量并行通信效率高但需高速互联。

### 1. 数据并行（Data Parallelism）

**原理**：
- 复制模型到多个GPU
- 每个GPU处理不同的数据批次
- 梯度同步后统一更新参数

**优点**：实现简单，扩展性好
**限制**：每个GPU都需要完整模型副本，内存需求高

### 2. 模型并行（Model Parallelism）

**原理**：
- 将模型不同层分布到不同GPU
- 数据依次流经各个GPU

**优点**：可以训练超过单GPU内存的模型
**限制**：GPU间通信开销大，利用率低

### 3. 流水线并行（Pipeline Parallelism）

**原理**：
- 结合模型并行和数据并行
- 将模型分成多个阶段，每个阶段在多个micro-batch上流水线执行

**优点**：提高GPU利用率，减少气泡时间
**实现**：GPipe、PipeDream

### 4. 张量并行（Tensor Parallelism）

**原理**：
- 将单个张量操作切分到多个GPU
- 例如：将矩阵乘法按列/行切分

**优点**：细粒度并行，通信效率高
**限制**：需要高速互联（如NVLink）

## Mixture-of-Experts（MoE）

**原理**：
- 模型包含多个专家子网络
- 每个输入只激活部分专家
- 通过路由机制选择专家

**优点**：
- 模型容量大但计算量可控
- 可以扩展到超大参数量（如1.6万亿）

**代表**：Switch Transformer、GLaM

## 内存优化技术

```d2
direction: right

Memory: 内存优化策略 {
  Offload: "CPU Offloading\n不活跃张量卸载到CPU"
  Recompute: "激活重计算\n前向不保存激活值\n反向重新计算"
  MixedPrec: "混合精度训练\nFP16前向/反向\nFP32参数更新"
  ZeRO: "ZeRO 优化器\n分片优化器状态"
}

Trade: "以计算/延迟换内存"
Reduce: "直接减少内存占用"

Memory.Offload -> Trade
Memory.Recompute -> Trade
Memory.MixedPrec -> Reduce
Memory.ZeRO -> Reduce
```

> 内存优化技术的核心思路：以计算换内存（CPU Offloading、激活重计算）或直接减少内存占用（混合精度、ZeRO 分片）。

### CPU Offloading
- 将不活跃的张量卸载到CPU内存
- 需要时再加载回GPU

### 激活重计算（Activation Recomputation）
- 前向传播时不保存所有激活值
- 反向传播时重新计算
- 以计算换内存

### 混合精度训练
- 使用FP16进行前向和反向计算
- 使用FP32进行参数更新
- 减少内存占用，提高吞吐量

### 内存高效优化器
- ZeRO（Zero Redundancy Optimizer）：分片优化器状态
- 8-bit优化器：降低优化器状态精度

## 实践建议

**小模型（< 1B参数）**：
- 单GPU或简单数据并行即可

**中等模型（1B-10B）**：
- 数据并行 + 混合精度
- 考虑ZeRO优化

**超大模型（> 10B）**：
- 组合多种并行策略（3D并行）
- 必须使用MoE或激活重计算
- 需要高速网络互联

## 与已有知识的关联

### [[mlops-zoomcamp]]
- 分布式训练是MLOps的关键环节
- 涉及资源调度、容错、监控

### [[lilian-weng-inference-optimization]]
- 训练时的并行策略影响推理部署
- MoE模型需要特殊的推理优化

### [[training-tips]]
- 分布式训练引入新的超参数（如梯度累积步数）
- 需要注意数值稳定性（混合精度）

## 引用建议

> "How to train large and deep neural networks is challenging, as it demands a large amount of GPU memory and a long horizon of training time."
