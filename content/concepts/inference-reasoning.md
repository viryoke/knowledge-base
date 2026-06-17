---
title: "Inference & Reasoning"
created: 2026-05-29
updated: 2026-06-01
type: concept
tags: [inference, llm]
sources:
  - raw/transcripts/hylee-ml-2025/hylee-ml-2025-07-深度思考Reasoning-bJFtcwLSNxI.md
  - raw/transcripts/hylee-ml-2025/hylee-ml-2025-08-推理过程不用太长-ip3XnTpcxoA.md
confidence: medium
---

# Inference & Reasoning

## 定义

在大型语言模型 (LLM) 的语境中，**inference** 和 **reasoning** 是两个相关但不同的概念：

- **Inference（推论）**：指使用一个已训练好的模型进行预测或生成输出的过程
- **Reasoning（推理）**：指某些模型在 inference 时会产生特别长的思考过程，先进行深度思考再给出最终答案的行为

具有 reasoning 能力的模型（如 DeepSeek-R1、OpenAI O-series、Gemini Flash Thinking、Claude Extended Thinking）会在答案前产生一个"内心小剧场"，包括验证、探索、规划等行为。

## Chain-of-Thought (CoT)

Chain-of-Thought 是让模型先列出解题过程再给出答案的推理方法。

### 实现方式

1. **Few-shot CoT**：给模型示例，展示"问题→推理过程→答案"的格式
2. **Zero-shot CoT**：直接告诉模型 "Let's think step by step"
3. **Supervised CoT**：在 prompt 中详细指定思考的方式和流程

### Long CoT vs Short CoT

- **Short CoT**（2022年）：简单的逐步思考
- **Long CoT**（现代推理模型）：产生非常长的思考过程，通常用 `<think>...</think>` 标签包裹

## Test-Time Compute

在测试阶段投入更多算力以获得更好结果的方法。

### 历史背景

AlphaGo 是 test-time compute 的早期应用：
- 训练时：Policy Network + Value Network
- 测试时：使用 Monte Carlo Tree Search (MCTS) 进行大规模搜索

### Test-Time Scaling

投入更多 test-time compute 往往能得到更好的结果。但研究表明，推理长度与正确率之间存在复杂的权衡关系。

## 构建推理模型的四种方法

### 方法一：更好的 Chain-of-Thought（无需微调）

通过精心设计的 prompt 让现有模型进行深度思考：
- 要求模型分析题目、制定计划、逐步执行、多次验证
- 适用于能力较强的模型

### 方法二：推理工作流（无需微调）

直接给模型推理的工作流程：
- **Parallel paradigm**：让模型对同一问题回答多次，用 majority vote 或 best-of-N 选择答案
- **Sequential paradigm**：让模型基于前一次解答继续改进
- **Beam search / Tree search**：展开搜索树，用 verifier 评估每一步

### 方法三：直接教学（需要微调）

**Imitation Learning / Knowledge Distillation**：
- 用会推理的模型（老师）生成推理过程
- 学生模型学习这些推理过程
- 可以选择最短的正确推理过程来训练

**Explicit to Implicit CoT**：
- 渐进式移除推理 token
- 最终训练出"心算"能力——不产生推理过程也能得到正确答案

### 方法四：强化学习（需要微调）

通过 RL 让模型自己学会推理：
- 只给 outcome reward（答案对错）
- 模型会自动发展出长推理过程
- 问题：推理过程可能过于冗长

## 推理长度控制

### 为什么推理会变长？

RL 训练中如果只考虑正确率，模型会无限延长推理过程——反复验证、尝试多种方法，因为没有人告诉它长度有限制。

### 控制方法

1. **Prompt 控制**：Chain of Draft（每步思考不超过5个词）
2. **搜索控制**：减小 beam size、缩小搜索树
3. **知识蒸馏**：选择老师模型最短的正确推理
4. **RL reward 设计**：
   - 相对标准：比平均正确推理长度更短才给正面 reward
   - 绝对标准：用户指定目标长度，reward = 正确率 - |目标长度 - 实际长度|

### 过犹不及

推理长度并非越长越好：
- 同一问题问5次，最短的答案不一定比最长的差
- 冗长推理浪费算力
- 最好的 AI 应该在有限资源下做到最好，而非不计成本追求完美

## Process Reward vs Outcome Reward

### Outcome Reward
只看最终答案是否正确，容易导致推理过程冗长。

### Process Reward
评估推理过程中每一步的质量：
- 训练 **Process Verifier**：预测从当前步骤继续解题得到正确答案的概率
- 在中间步骤就进行验证，避免"一步错步步错"
- 可以让小模型（如1B）通过合理的推理流程超越大模型（如8B）

## Reasoning Scaling Laws

推理能力与以下因素相关：
- **模型规模**：更大的模型通常推理能力更强
- **Test-time compute**：更多测试时算力可以提升表现
- **推理长度**：在一定范围内，更长的推理有助于复杂问题
- **问题难度**：难题需要更长推理，简单题不需要

关键发现：1B 模型通过 beam search + process verifier 可以在特定任务上超越 8B 模型。

## 跨课程视角

> 以下课程深入讲解了推理与深度思考，点击课程名查看完整笔记。

### [[hylee-ml-2025|李宏毅 ML 2025]]（第7-8讲）

系统讲解深度思考模型的构建方法，从 Chain-of-Thought 到强化学习，涵盖 test-time compute、推理工作流设计、process verifier 训练等核心技术。探讨推理长度的权衡与控制。^[raw/transcripts/hylee-ml-2025/hylee-ml-2025-07-深度思考Reasoning-bJFtcwLSNxI.md] ^[raw/transcripts/hylee-ml-2025/hylee-ml-2025-08-推理过程不用太长-ip3XnTpcxoA.md]

### [[language-model]]

推理是语言模型的高级能力。从基础的 next-token prediction 到复杂的 chain-of-thought，体现了模型从记忆到推理的能力跃迁。

### [[transformer]]

Transformer 架构是推理模型的基础。Attention 机制使模型能够在长序列中追踪依赖关系，支撑复杂的推理过程。

### [[ai-agent]]

推理能力是 AI Agent 的核心。Agent 需要规划、执行、验证、调整的循环，这正是 reasoning 模型所展现的行为模式。

## 相关概念

- [[transformer]] — 现代 LLM 的基础架构
- [[language-model]] — 推理能力的载体
- [[reinforcement-learning]] — 训练推理模型的关键方法
- [[knowledge-distillation]] — 从大模型迁移推理能力到小模型
- [[ai-agent]] — 推理能力的应用场景
- [[neural-network]] — 推理模型的底层基础
- [[latent-reasoning]] — 潜在推理：用内部表示替代 CoT 生成的推理步骤

## 最新进展（2026-05-31）

### Test-Time Scaling with Unlabeled Data

OpenReview 新论文（2026年5月）提出"测试时无标签数据也有用"的方法，通过在推理阶段利用未标注数据扩展模型能力。核心思路：

- 在 test-time 阶段，模型可以利用大量未标注的输入数据来改善推理过程
- 通过 self-play、consistency checking 或 pseudo-labeling 等技术，未标注数据可以提供额外的信号
- 这对数据稀缺场景（如低资源语言、专业领域）的模型部署有重大实践意义

这一方向与 [[self-supervised-learning]] 高度相关，将自监督学习的思想延伸到了推理阶段。

**来源**：[OpenReview - Unlabeled Data for Test-Time Scaling](https://openreview.net/forum?id=bmzf0Lut7R)

### Latent Reasoning: Reasoning in Memory (RiM)

arXiv 新论文（2026年5月）提出用固定的 memory block 特殊 token 序列替代自回归生成的推理步骤，在单次前向传播中完成潜在推理（latent reasoning）。两阶段课程训练：先 grounding 再 refinement。跨多种模型规模匹配或超越现有方法。详见 [[latent-reasoning]]。

**来源**：[arXiv - Unlocking the Working Memory of LLMs for Latent Reasoning](https://arxiv.org/abs/2605.30343)
