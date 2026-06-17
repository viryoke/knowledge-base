---
title: "Multi-Head Latent Attention"
created: 2026-06-01
updated: 2026-06-01
type: concept
tags: [architecture, inference, generative]
sources: ["https://arxiv.org/abs/2605.30351"]
confidence: medium
---

# Multi-Head Latent Attention (MLA)

## 定义

**Multi-Head Latent Attention** 是一种注意力机制变体，通过用共享的低秩内容潜变量（low-rank content latent）替代传统的逐头 key/value 存储，大幅降低 KV cache 的内存占用，同时保持或提升模型质量。

MLA 最初由 DeepSeek 团队提出用于语言模型，后来被扩展到视频扩散等生成模型领域。

## 核心机制

### 传统 Multi-Head Attention 的内存瓶颈

标准 MHA 中，每个注意力头独立存储自己的 key 和 value：
- 内存占用 = num_heads × head_dim × num_layers × seq_len
- 在长序列生成（尤其是视频）中，KV cache 成为显存的主要消耗者

### MLA 的解决方案

1. **共享低秩潜变量**：所有头共享一个低秩内容潜向量，替代各自的 key/value
2. **解耦位置键**：位置信息用独立的低秩 key（如 3D-RoPE），与内容潜变量分离
3. **压缩比**：可将每 token KV 内存降低 90%+ 以上

### 为什么有效？

直觉上，不同注意力头之间存在信息冗余——共享低秩表示可以捕获这些冗余，同时保留各头需要的差异化信息。

## VideoMLA：将 MLA 应用于视频扩散

### 背景

长时间因果视频扩散（long-rollout causal video diffusion）目前使用固定大小的滑动窗口 KV cache。现有优化集中在窗口内 token 的选择或位置编码上，但 KV 的 per-head 布局本身（流式内存和延迟的主要贡献者）基本未变。

### VideoMLA 的核心创新

1. **首次将 MLA 引入视频扩散**：用共享低秩内容潜变量 + 解耦 3D-RoPE 位置键替代 per-head KV
2. **每 token KV 内存降低 92.7%**：在每一层缓存中实现
3. **频谱假设的证伪**：
   - 预训练的视频注意力并非低秩的（99% 能量的有效秩远高于任何实际潜变量维度）
   - MLA 的有效性并非来自预训练频谱的低秩性
   - 而是 MLA 的瓶颈（bottleneck）本身决定了有效秩

### 实验结果

- VBench 上匹配短期流式视频扩散基线
- 长期生成中取得最高综合评分
- 单 B200 GPU 上吞吐量提升 1.23x

## 与已有注意力变体的关系

在 [[transformer-family]] 中已介绍了多种注意力优化：

- **Multi-Query/Grouped-Query Attention**：多个 query 共享 KV → MLA 进一步将所有头的 KV 压缩为共享低秩表示
- **FlashAttention**：IO 感知的注意力算法 → MLA 减少需要 IO 的数据量，二者正交可叠加
- **Sliding Window Attention**：限制注意力范围 → VideoMLA 在此基础上优化 KV 表示本身

## 前沿进展

### VideoMLA (2026-05-31)
arXiv 论文，首次将 MLA 应用于分钟级视频扩散，KV 内存降低 92.7%，长期生成质量最优。

**来源**：[arXiv - VideoMLA: Low-Rank Latent KV Cache for Minute-Scale Autoregressive Video Diffusion](https://arxiv.org/abs/2605.30351)

## 相关概念

- [[transformer]] — 注意力机制的基础架构
- [[transformer-family]] — Transformer 变体演进全景
- [[attention-mechanism]] — 注意力机制详解
- [[diffusion-video-generation]] — 扩散模型视频生成
- [[inference-reasoning]] — KV cache 优化直接影响推理效率
