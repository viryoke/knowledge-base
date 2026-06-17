---
title: 李宏毅·生成式AI时代下的机器学习2025
created: 2026-05-28
updated: 2026-05-28
type: concept
tags:
  - llm
  - training
  - inference
  - agent
  - mlops
  - evaluation
sources: []
confidence: high
---

# 李宏毅·生成式AI时代下的机器学习2025

**课程全称**: 生成式AI時代下的機器學習(2025)
**讲师**: [[hung-yi-lee|李宏毅]]（台湾大学）
**总时长**: 约16小时（13讲，含1节助教课）
**课程网页**: [speech.ee.ntu.edu.tw](https://speech.ee.ntu.edu.tw/~hylee/ml/2025-spring.php)
**YouTube播放列表**: [YouTube](https://www.youtube.com/playlist?list=PLJV_el3uVTsNZEFAdQsDeOdzAaHTca2Gi)

## 课程特点

这是李宏毅2025年最新的机器学习课程，相比[[hylee-genai-ml-2025|生成式AI与机器学习导论]]，本课程更侧重：
- **前沿技术深度剖析**：Reasoning、Model Editing、Model Merging等2025年热点
- **工程实践导向**：多GPU训练、DeepSpeed、Flash Attention等实战技能
- **Transformer后时代**：Mamba等新型架构的介绍

## 课程结构

| 讲次 | 主题 | 时长 | 核心内容 | 视频 | PDF | 字幕 |
|------|------|------|----------|------|-----|------|
| 第一讲 | 生成式[[language-model\|AI]]的技术突破与未来发展 | 1h24m | 2025年GenAI全景、多模态趋势、工业应用案例、未来研究方向 | [▶️](https://www.youtube.com/watch?v=QLiKmca4kzI) | [[raw/papers/hylee-ml-2025/hylee-ml-2025-01-introduction.pdf\|📄]] | [[raw/transcripts/hylee-ml-2025/hylee-ml-2025-01-生成式AI技术突破与未来发展-QLiKmca4kzI.md\|📝]] |
| 第二讲 | [[ai-agent\|AI Agent]]原理（经验调整、工具使用、规划） | 1h42m | Agent三大能力、ReAct框架、工具调用API、任务分解与执行 | [▶️](https://www.youtube.com/watch?v=M2Yg1kwPpts) | [[raw/papers/hylee-ml-2025/hylee-ml-2025-02-ai_agent.pdf\|📄]] | [[raw/transcripts/hylee-ml-2025/hylee-ml-2025-02-AI-Agent原理-M2Yg1kwPpts.md\|📝]] |
| 第三讲 | AI脑科学：[[language-model\|语言模型]]内部运作机制剖析 | 1h49m | 神经元激活模式、概念表征、知识存储机制、可解释性研究 | [▶️](https://www.youtube.com/watch?v=Xnil63UDW2o) | [[raw/papers/hylee-ml-2025/hylee-ml-2025-03-model_inside.pdf\|📄]] | [[raw/transcripts/hylee-ml-2025/hylee-ml-2025-03-AI脑科学-语言模型内部机制-Xnil63UDW2o.md\|📝]] |
| 第四讲 | [[transformer\|Transformer]]的终结？介绍竞争者们（Mamba等） | 1h22m | SSM/Mamba架构、线性注意力、混合模型、长序列处理效率对比 | [▶️](https://www.youtube.com/watch?v=gjsdVi90yQo) | [[raw/papers/hylee-ml-2025/hylee-ml-2025-04-mamba.pdf\|📄]] | [[raw/transcripts/hylee-ml-2025/hylee-ml-2025-04-Transformer竞争者-gjsdVi90yQo.md\|📝]] |
| 第五讲 | 预训练-[[fine-tuning\|对齐]]方法的强大与极限 | 1h19m | 预训练数据质量、对齐技术(RLHF/DPO)、能力边界与失效模式 | [▶️](https://www.youtube.com/watch?v=Ozos6M1JtIE) | [[raw/papers/hylee-ml-2025/hylee-ml-2025-05-pretrain.pdf\|📄]] | [[raw/transcripts/hylee-ml-2025/hylee-ml-2025-05-预训练与对齐-Ozos6M1JtIE.md\|📝]] |
| 助教课 | 多GPU训练：DeepSpeed、Liger Kernel、Flash Attention、Quantization | 54m | 分布式训练实战、显存优化、混合精度、推理加速技术栈 | [▶️](https://www.youtube.com/watch?v=mpuRca2UZtI) | [[raw/papers/hylee-ml-2025/hylee-ml-2025-00-bonus.pdf\|📄]] | [[raw/transcripts/hylee-ml-2025/hylee-ml-2025-00-助教课-多GPU训练-mpuRca2UZtI.md\|📝]] |
| 第六讲 | [[fine-tuning\|后训练]]与遗忘问题 | 1h15m | 灾难性遗忘机制、持续学习策略、模型编辑、知识保留与更新 | [▶️](https://www.youtube.com/watch?v=Z6b5-77EfGk) | [[raw/papers/hylee-ml-2025/hylee-ml-2025-06-post_training.pdf\|📄]] | [[raw/transcripts/hylee-ml-2025/hylee-ml-2025-06-后训练与遗忘-Z6b5-77EfGk.md\|📝]] |
| 第七讲 | DeepSeek-R1如何深度思考（[[inference-reasoning\|Reasoning]]） | 1h18m | 思维链推理、过程监督训练、推理模型架构、与GPT-o1对比 | [▶️](https://www.youtube.com/watch?v=bJFtcwLSNxI) | [[raw/papers/hylee-ml-2025/hylee-ml-2025-07-reasoning.pdf\|📄]] | [[raw/transcripts/hylee-ml-2025/hylee-ml-2025-07-深度思考Reasoning-bJFtcwLSNxI.md\|📝]] |
| 第八讲 | [[inference-reasoning\|推理]]过程不用太长、够用就好 | 24m | 推理效率优化、短思维链、计算成本与性能权衡 | [▶️](https://www.youtube.com/watch?v=ip3XnTpcxoA) | [[raw/papers/hylee-ml-2025/hylee-ml-2025-08-reason_shorter.pdf\|📄]] | [[raw/transcripts/hylee-ml-2025/hylee-ml-2025-08-推理过程不用太长-ip3XnTpcxoA.md\|📝]] |
| 第九讲 | [[language-model\|LLM]][[evaluation-benchmark\|评估]]的几件事 | 24m | 评估方法论、基准测试设计、人工评估vs自动评估、实际场景指标 | [▶️](https://www.youtube.com/watch?v=s266BzGNKKc) | [[raw/papers/hylee-ml-2025/hylee-ml-2025-09-reason_eval.pdf\|📄]] | [[raw/transcripts/hylee-ml-2025/hylee-ml-2025-09-LLM评估-s266BzGNKKc.md\|📝]] |
| 第十讲 | Model Editing：[[fine-tuning\|AI的微创手术]] | 44m | 知识定位技术、ROME/MEMIT算法、事实性修正、参数级编辑 | [▶️](https://www.youtube.com/watch?v=9HPsz7F0mJg) | [[raw/papers/hylee-ml-2025/hylee-ml-2025-10-edit.pdf\|📄]] | [[raw/transcripts/hylee-ml-2025/hylee-ml-2025-10-Model-Editing-9HPsz7F0mJg.md\|📝]] |
| 第十一讲 | Model Merging：[[fine-tuning\|Task Vector技术]] | 34m | 模型融合方法、任务向量算术、多任务模型构建、权重插值策略 | [▶️](https://www.youtube.com/watch?v=jFUwoCkdqAo) | [[raw/papers/hylee-ml-2025/hylee-ml-2025-11-merging.pdf\|📄]] | [[raw/transcripts/hylee-ml-2025/hylee-ml-2025-11-Model-Merging-jFUwoCkdqAo.md\|📝]] |
| 第十二讲 | 语音[[language-model\|语言模型]]发展历程 | 1h31m | 语音识别演进、端到端模型、语音合成、语音LLM最新进展 | [▶️](https://www.youtube.com/watch?v=gkAyqoQkOSk) | [[raw/papers/hylee-ml-2025/hylee-ml-2025-12-speech.pdf\|📄]] | [[raw/transcripts/hylee-ml-2025/hylee-ml-2025-12-语音语言模型-gkAyqoQkOSk.md\|📝]] |

## 学习建议

### 推荐顺序（针对有软件工程背景者）

1. **第一讲**（技术突破）— 建立2025年AI全景认知
2. **第二讲**（AI Agent）— 直接关联你的CodeGenie工作
3. **第七-八-九讲**（Reasoning系列）— 理解DeepSeek-R1等推理模型
4. **第五-六讲**（预训练+后训练）— 深入训练方法
5. **第三-四讲**（模型内部+Transformer替代）— 理解架构演进
6. **第十-十一讲**（Editing+Merging）— 模型微调新技术
7. **第十二讲**（语音）— 多模态扩展
8. **助教课**（多GPU）— 工程实践补充

### 与你的工作结合

- **第二讲 AI Agent** → 直接关联你当前的AI图生码（CodeGenie）和Agent设计
- **第七讲 Reasoning** → 理解DeepSeek-R1等推理模型的工作原理
- **第十-十一讲** → Model Editing/Merging是鸿蒙端侧模型适配的潜在方向
- **助教课** → 多GPU训练的工程实践，虽然你可能用不到，但理解原理有帮助

### 与[[hylee-genai-ml-2025|导论课程]]的关系

- **导论课程**：基础原理为主，适合从零开始
- **本课程**：前沿专题为主，适合已有基础后深入
- 建议先学导论，再学本课程；或者直接跳到你感兴趣的专题

## 关联

- [[hung-yi-lee]] — 讲师信息
- [[hylee-genai-ml-2025]] — 导论课程（更基础）
- [[llm-learning-path]] — LLM学习路径
- [[ai-learning-resources]] — AI学习资源导航
- [[vector-database-ai]] — 向量数据库（RAG相关）
- [[hexagonal-architecture]] — 六边形架构（Agent设计相关）


