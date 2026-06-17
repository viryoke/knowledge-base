---
title: freeCodeCamp LLM微调完整课程
created: 2026-05-28
updated: 2026-05-28
type: concept
tags: [llm, training]
sources: ["https://www.youtube.com/watch?v=eC6Hd1hFvos"]
confidence: high
---

# freeCodeCamp LLM微调完整课程

## 课程信息

- **标题**: Fine Tuning LLM Models – Generative AI Course
- **频道**: freeCodeCamp.org
- **时长**: 2小时37分钟
- **YouTube**: [YouTube](https://www.youtube.com/watch?v=eC6Hd1hFvos)
- **播放量**: 442K+
- **难度**: 中级
- **语言**: 英语（含中文字幕）

## 课程大纲

根据视频章节结构：

| 章节 | 主题 | 核心内容 | 视频 | 字幕 |
|------|------|---------|------|------|
| 1 | Introduction | 微调概念介绍、为什么需要微调、与预训练的区别 | [▶️](https://www.youtube.com/watch?v=eC6Hd1hFvos) | [[raw/transcripts/freecodecamp-llm-finetuning/freecodecamp-finetune.en\|EN]] [[raw/transcripts/freecodecamp-llm-finetuning/freecodecamp-finetune.zh-Hans\|中文]] |
| 2 | Quantization Intuition | 量化直觉理解、精度损失与效率的权衡 | [▶️](https://www.youtube.com/watch?v=eC6Hd1hFvos) | ↑ |
| 3 | LoRA and QLoRA Indepth Intuition | LoRA低秩矩阵原理、QLoRA 4-bit量化微调、显存优化 | [▶️](https://www.youtube.com/watch?v=eC6Hd1hFvos) | ↑ |
| 4 | Finetuning With Llama2 | Llama2微调实战、数据集准备、训练超参数配置 | [▶️](https://www.youtube.com/watch?v=eC6Hd1hFvos) | ↑ |
| 5 | 1-bit LLM Indepth Intuition | 1-bit LLM极端量化原理、BitNet架构解析 | [▶️](https://www.youtube.com/watch?v=eC6Hd1hFvos) | ↑ |
| 6 | Finetuning with Google Gemma Models | Gemma模型特性、微调流程差异、性能对比 | [▶️](https://www.youtube.com/watch?v=eC6Hd1hFvos) | ↑ |
| 7 | Building LLM Pipelines With No Code | 无代码LLM管道构建、可视化工具使用 | [▶️](https://www.youtube.com/watch?v=eC6Hd1hFvos) | ↑ |
| 8 | Fine tuning With Own Custom Data | 自定义数据格式、数据清洗、端到端微调流程 | [▶️](https://www.youtube.com/watch?v=eC6Hd1hFvos) | ↑ |

## 核心技术点

### LoRA (Low-Rank Adaptation)
- 冻结预训练权重，添加低秩矩阵
- 大幅减少可训练参数（通常<1%）
- 数学原理：W' = W + BA，其中B和A是低秩矩阵

### QLoRA (Quantized LoRA)
- 4-bit量化基础模型 + LoRA
- 进一步降低显存需求
- 可在消费级GPU上微调7B模型

### 量化技术
- 4-bit NormalFloat (NF4)
- 双重量化（Double Quantization）
- 分页优化器（Paged Optimizer）

## 实战项目

### Llama 2 微调
- 使用QLoRA在单GPU上微调
- 自定义数据集格式
- 训练超参数调优

### Google Gemma 微调
- Gemma模型特性
- 微调流程差异
- 性能对比

## 学习建议

### 适合人群
- 有Python和PyTorch基础
- 了解Transformer架构
- 想在自己的数据上微调LLM

### 前置知识
- [[transformer]] - Transformer架构
- [[fine-tuning]] - 微调概念
- 基础PyTorch操作

### 实践建议
1. 先用小数据集跑通流程
2. 理解LoRA的rank和alpha参数
3. 关注量化对精度的影响
4. 记录训练日志和评估指标

## 与其他资源的配合

- **理论补充**: [[hylee-ml-2025]] 第8讲（终身学习/Fine-tuning）
- **工程实践**: [[mlops-zoomcamp]]（部署微调后的模型）
- **应用开发**: [[langchain-mastery-2025]]（使用微调模型构建应用）

## 相关概念

- [[fine-tuning]] - 微调核心概念
- [[overfitting-regularization]] - 过拟合与正则化
- [[gradient-descent]] - 梯度下降
- [[neural-network]] - 神经网络基础

## Raw Materials

> 字幕已嵌入课程表格中
