---
title: Karpathy Neural Networks Zero to Hero
created: 2026-05-28
updated: 2026-05-28
type: concept
tags: [llm, training, inference, mlops]
sources: []
confidence: high
---

# Karpathy Neural Networks: Zero to Hero

**讲师**: [[andrej-karpathy|Andrej Karpathy]]
**性质**: 从零手写神经网络的实战教程
**总时长**: 约20.5小时（10讲）
**YouTube播放列表**: [YouTube](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)

## 内容

| # | 主题 | 时长 | 核心价值 | 视频 | 字幕 |
|---|------|------|----------|------|------|
| 1 | micrograd + [[backpropagation\|backpropagation]] | 2h25m | 从零实现自动微分，理解反向传播本质 | [▶️](https://www.youtube.com/watch?v=VMj-3S1tku0) | [[raw/transcripts/karpathy-nn-zero-to-hero/01-micrograd-backprop-VMj-3S1tku0\|📝]] |
| 2 | makemore: [[language-model\|language modeling]] | 1h57m | 字符级语言模型，建立文本生成直觉 | [▶️](https://www.youtube.com/watch?v=PaCmpygFfXo) | [[raw/transcripts/karpathy-nn-zero-to-hero/02-makemore-language-modeling-PaCmpygFfXo\|📝]] |
| 3 | makemore: [[neural-network\|MLP]] | 1h15m | 多层感知机实现语言模型 | [▶️](https://www.youtube.com/watch?v=TCH_1BHY58I) | [[raw/transcripts/karpathy-nn-zero-to-hero/03-makemore-MLP-TCH_1BHY58I\|📝]] |
| 4 | makemore: [[activation-functions\|activations]] & [[gradient-descent\|gradients]], BatchNorm | 1h55m | 激活函数、梯度、批归一化 | [▶️](https://www.youtube.com/watch?v=P6sfmUTpUmc) | [[raw/transcripts/karpathy-nn-zero-to-hero/04-makemore-activations-gradients-P6sfmUTpUmc\|📝]] |
| 5 | makemore: becoming a [[backpropagation\|backprop]] ninja | 1h55m | 手动反向传播，深入理解梯度流 | [▶️](https://www.youtube.com/watch?v=q8SA3rM6ckI) | [[raw/transcripts/karpathy-nn-zero-to-hero/05-makemore-backprop-ninja-q8SA3rM6ckI\|📝]] |
| 6 | makemore: WaveNet | 56min | 因果卷积在序列建模中的应用 | [▶️](https://www.youtube.com/watch?v=t3YJ5hKiMQ0) | [[raw/transcripts/karpathy-nn-zero-to-hero/06-makemore-WaveNet-t3YJ5hKiMQ0\|📝]] |
| 7 | Let's build GPT from scratch | 1h56m | 从零实现[[transformer\|GPT]]，社区最热门的一讲 | [▶️](https://www.youtube.com/watch?v=kCc8FmEb1nY) | [[raw/transcripts/karpathy-nn-zero-to-hero/07-build-GPT-from-scratch-kCc8FmEb1nY\|📝]] |
| 8 | State of GPT | 42min | GPT技术全景综述（无字幕） | - | - |
| 9 | Let's build the GPT [[tokenization\|Tokenizer]] | 2h13m | BPE tokenizer实现 | [▶️](https://www.youtube.com/watch?v=zduSFxRajkE) | [[raw/transcripts/karpathy-nn-zero-to-hero/09-GPT-Tokenizer-zduSFxRajkE\|📝]] |
| 10 | Let's reproduce GPT-2 (124M) | 4h01m | 完整复现GPT-2训练流程 | [▶️](https://www.youtube.com/watch?v=l8pRSuU81PU) | [[raw/transcripts/karpathy-nn-zero-to-hero/10-reproduce-GPT-2-l8pRSuU81PU\|📝]] |

## 学习建议

**推荐顺序（针对有软件工程背景者）：**

1. **先看第7讲**（build GPT）— 最具影响力的一讲，建立Transformer直觉
2. **第1-2讲**（micrograd + makemore）— 补齐基础，理解自动微分
3. **第3-6讲**（makemore深入）— 按兴趣选择性学习
4. **第9-10讲**（Tokenizer + GPT-2复现）— 深入工程实践

**核心价值：**
- 每一讲都是**从零写代码**，不是调库
- 理解LLM不是黑盒，而是可以手写的程序
- 第7讲 "build GPT from scratch" 是社区公认的入门必读

**与你的工作结合：**
- 第9讲 Tokenizer → 理解不同模型的tokenization策略
- 第10讲 GPT-2复现 → 理解模型训练全流程，对MLOps有帮助
- 整体 → 建立"AI即程序"的认知，对AI图生码工具开发有启发

## 关联

- [[andrej-karpathy]] — 讲师信息
- [[karpathy-llm-talks]] — 同系列LLM理论演讲
- [[llm-learning-path]] — LLM学习路径（本系列覆盖阶段1-4）
- [[hylee-genai-ml-2025]] — 李宏毅导论课（理论补充）
- [[ai-learning-resources]] — AI学习资源导航
