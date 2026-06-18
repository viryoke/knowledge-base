---
title: 微调 (Fine-tuning)
created: 2026-05-28
updated: 2026-05-28
type: concept
tags: [training, llm, mlops]
sources: []
confidence: high
---

## 定义

在预训练模型的基础上，用特定任务或领域的数据进一步训练，使模型适应特定需求。微调是 [[language-model]] 从"通用知识"走向"专业应用"的关键桥梁。

## 微调类型

- **Full Fine-tuning**: 更新所有模型参数，计算成本高但效果最好
- **LoRA / QLoRA** (Parameter-Efficient Fine-Tuning): 仅训练低秩矩阵，大幅降低计算需求
- **Instruction Tuning (SFT)**: 用指令-回答对训练，让模型学会遵循指令
- **RLHF / DPO (Alignment)**: 通过人类偏好数据对齐模型行为

## LLM 训练三阶段

```
Pre-training → Fine-tuning (SFT) → Alignment (RLHF/DPO)
     ↑                ↑                    ↑
  学习语言        学习遵循指令         学习人类偏好
  通用知识        任务特定能力          安全与对齐
```

## 跨课程视角

> 以下课程深入讲解了微调技术，点击课程名查看完整笔记。

### [[hylee-genai-ml-2025|李宏毅 GenAI 2025]] (第8讲 Lifelong Learning)

模型的"终身学习"全景——Fine-tuning, Model Editing, Model Merging, Test-Time Training。探讨模型部署后如何持续进化和适应新需求。

^[raw/transcripts/hylee-genai-2025/08-Lifelong-Learning.md]

### [[hylee-ml-2025|李宏毅 ML 2025]] (第6、8、10-11讲)

后训练 (Post-training) 的全景视角：
- **第6讲**: RLHF 和 DPO 对齐方法
- **第8讲**: Reasoning 能力的后训练增强
- **第10-11讲**: Model Editing（修改模型内部知识）和 Model Merging（合并多个模型）

^[raw/transcripts/hylee-ml-2025/06-post_training.md]
^[raw/transcripts/hylee-ml-2025/10-edit.md]
^[raw/transcripts/hylee-ml-2025/11-merging.md]

### [[karpathy-llm-talks|Karpathy LLM Talks]] (L2 Deep Dive)

ChatGPT 训练流程中 fine-tuning 和 RLHF 的角色——从 GPT 预训练到 InstructGPT 的对齐过程，解释了为什么 SFT + RLHF 是让模型"听话"的关键。

^[raw/transcripts/karpathy-llm-talks/02-deep-dive-llm-7xSuS5HCAM.md]

### [[karpathy-nn-zero-to-hero|Karpathy NN Zero to Hero]] (L10 GPT-2)

完整复现 GPT-2 训练流程——从数据准备到模型训练到生成评估，理解从预训练到微调的全链路工程实现。

^[raw/transcripts/karpathy-nn-zero-to-hero/10-gpt2-reproduce-CiKlZmHc8dg.md]

## 灾难性遗忘 (Catastrophic Forgetting)

微调后丧失预训练知识的风险——模型在学习新任务时"遗忘"原有能力。应对策略：

- **Replay**: 混入原始预训练数据
- **Elastic Weight Consolidation (EWC)**: 保护重要参数不过度变化
- **LoRA**: 参数高效方法天然减轻遗忘问题
- **Model Merging**: 将微调模型与原始模型合并（参见第11讲）

## 与 [[overfitting-regularization]] 的关系

微调数据集通常远小于预训练数据，因此 [[overfitting-regularization]] 尤为重要：
- 小数据集 + 全参数微调 = 高过拟合风险
- LoRA 本身带有正则化效果（低秩约束）
- Early Stopping 和验证集监控是标准实践

## 与 [[ai-agent]] 的关系

Agent 的能力可以通过微调增强——用 Agent 交互轨迹数据做 SFT，让 LLM 更准确地调用工具和执行规划。

## 相关链接

- [[language-model]] — 微调的基础模型
- [[transformer]] — 被微调的架构
- [[overfitting-regularization]] — 微调中的过拟合防控
- [[training-tips]] — 微调的工程实践技巧
- [[alignment]] — 对齐作为微调的最终阶段
