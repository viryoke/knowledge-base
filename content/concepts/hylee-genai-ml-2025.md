---
title: 李宏毅·生成式AI与机器学习导论2025
created: 2026-05-28
updated: 2026-05-28
type: concept
tags:
  - llm
  - training
  - inference
  - rag
  - agent
  - evaluation
  - mlops
sources: []
confidence: high
---

# 李宏毅·生成式AI与机器学习导论2025

**课程全称**: 【生成式人工智慧與機器學習導論2025】
**讲师**: [[hung-yi-lee|李宏毅]]（台湾大学）
**性质**: TAICA（台湾大专院校人工智慧学程联盟）课程
**总时长**: 约22小时（11讲）
**课程网页**: [speech.ee.ntu.edu.tw](https://speech.ee.ntu.edu.tw/~hylee/GenAI-ML/2025-fall.php)
**YouTube播放列表**: [YouTube](https://www.youtube.com/playlist?list=PLJV_el3uVTsMMGi5kbnKP5DrDHZpTX0jT)

## 课程结构

| 讲次 | 主题 | 时长 | 核心内容 | 视频 | 课件 | 字幕 |
|------|------|------|----------|------|------|------|
| 第0讲 | 開場與課程簡介 | 18min | 课程概览与学习目标 | [▶️](https://www.youtube.com/watch?v=VuQUF1VVX40) | [📄](raw/papers/hylee-genai-2025/hylee-genai-2025-00-01-LLM-Intro.pdf) | [[raw/transcripts/hylee-genai-2025/hylee-2025-00-開場與課程簡介-VuQUF1VVX40\|📝]] |
| 第1讲 | 生成式[[language-model\|人工智慧]]的原理 | 1h45m | GenAI工作原理、预训练与微调流程、Prompt Engineering基础 | [▶️](https://www.youtube.com/watch?v=TigfpYPJk1s) | [📄](raw/papers/hylee-genai-2025/hylee-genai-2025-00-01-LLM-Intro.pdf) | [[raw/transcripts/hylee-genai-2025/hylee-2025-01-生成式人工智慧的原理-TigfpYPJk1s\|📝]] |
| 第2讲 | [[ai-agent\|上下文工程]] (Context Engineering) — AI Agent 背后的关键技术 | 1h50m | Agent架构设计、上下文管理策略、工具调用与记忆机制 | [▶️](https://www.youtube.com/watch?v=lVdajtNpaGI) | [📄](raw/papers/hylee-genai-2025/hylee-genai-2025-02-Context-Engineering.pdf) | [[raw/transcripts/hylee-genai-2025/hylee-2025-02-上下文工程-lVdajtNpaGI\|📝]] |
| 第3讲 | 解剖[[language-model\|大型語言模型]] | 2h04m | Transformer内部结构、注意力机制可视化、模型行为分析 | [▶️](https://www.youtube.com/watch?v=8iFvM7WUUs8) | [📄](raw/papers/hylee-genai-2025/hylee-genai-2025-03-LLM-Dissection.pdf) | [[raw/transcripts/hylee-genai-2025/hylee-2025-03-解剖大型語言模型-8iFvM7WUUs8\|📝]] |
| 第4讲 | 评估[[language-model\|生成式AI]]能力时可能遇到的各种坑 | 2h01m | 评估指标设计、基准测试陷阱、实际应用场景评测方法 | [▶️](https://www.youtube.com/watch?v=dWQVY_h0YXU) | [📄](raw/papers/hylee-genai-2025/hylee-genai-2025-04-Evaluation.pdf) | [[raw/transcripts/hylee-genai-2025/hylee-2025-04-評估生成式AI能力-dWQVY_h0YXU\|📝]] |
| 第5讲 | [[neural-network\|机器学习与深度学习]]的基本原理 | 2h24m | 监督学习基础、损失函数、优化算法、正则化技术 | [▶️](https://www.youtube.com/watch?v=Taj1eHmZyWw) | [📄](raw/papers/hylee-genai-2025/hylee-genai-2025-05-Basic-ML-DL.pdf) | [[raw/transcripts/hylee-genai-2025/hylee-2025-05-機器學習與深度學習基本原理-Taj1eHmZyWw\|📝]] |
| 第6讲 | 训练[[neural-network\|神经网路]]的各种诀窍 | 2h06m | 学习率调度、批归一化、Dropout、数据增强实战技巧 | [▶️](https://www.youtube.com/watch?v=mPWvAN4hzzY) | [📄](raw/papers/hylee-genai-2025/hylee-genai-2025-06-Training-Tips.pdf) | [[raw/transcripts/hylee-genai-2025/hylee-2025-06-訓練神經網路的各種訣竅-mPWvAN4hzzY\|📝]] |
| 第7讲 | [[language-model\|大型語言模型]]的學習歷程 | 1h58m | 预训练数据构建、训练流程、Scaling Laws、计算资源需求 | [▶️](https://www.youtube.com/watch?v=YJoegm7kiUM) | [📄](raw/papers/hylee-genai-2025/hylee-genai-2025-07-LLM-Training.pdf) | [[raw/transcripts/hylee-genai-2025/hylee-2025-07-大型語言模型的學習歷程-YJoegm7kiUM\|📝]] |
| 第8讲 | 通用模型的终身学习 ([[fine-tuning\|Fine-tuning]], Model Editing, Model Merging) | 2h00m | 指令微调、RLHF对齐、模型编辑与知识更新、模型合并技术 | [▶️](https://www.youtube.com/watch?v=EnWz5XuOnIQ) | [📄](raw/papers/hylee-genai-2025/hylee-genai-2025-08-Lifelong-Learning.pdf) | [[raw/transcripts/hylee-genai-2025/hylee-2025-08-通用模型的終身學習-EnWz5XuOnIQ\|📝]] |
| 第9讲 | 影像和声音上的生成策略 (Diffusion/Flow-matching + Autoregressive) | 2h03m | 扩散模型原理、Flow-matching、多模态生成架构对比 | [▶️](https://www.youtube.com/watch?v=ccqCDD9LqCA) | [📄](raw/papers/hylee-genai-2025/hylee-genai-2025-09-Generation.pdf) | [[raw/transcripts/hylee-genai-2025/hylee-2025-09-影像和聲音上的生成策略-ccqCDD9LqCA\|📝]] |
| 第10讲 | 語音[[language-model\|語言模型]]發展史 | 2h29m | ASR/TTS演进、端到端语音模型、Whisper与语音LLM | [▶️](https://www.youtube.com/watch?v=CbIPjrOj2Tc) | [📄](raw/papers/hylee-genai-2025/hylee-genai-2025-10-Speech-LLM.pdf) | [[raw/transcripts/hylee-genai-2025/hylee-2025-10-語音語言模型發展史-CbIPjrOj2Tc\|📝]] |

## 学习建议

### 推荐顺序（针对有软件工程背景者）

1. **先看第1讲**（生成式AI原理）— 建立全局直觉
2. **第2讲**（Context Engineering）— 直接关联你当前的AI Agent工作
3. **第3讲**（解剖LLM）— 理解内部机制
4. **第5-6讲**（ML/DL基础+训练技巧）— 补齐理论基础
5. **第7-8讲**（LLM训练+终身学习）— 深入训练方法
6. **第4讲**（评估）— 了解如何衡量AI能力
7. **第9-10讲**（多模态生成+语音）— 拓展到非文本领域

### 与你的工作结合

- 第2讲 Context Engineering → 直接关联你当前做的AI图生码（CodeGenie）
- 第8讲 Fine-tuning → 鸿蒙端侧模型微调方向
- 第4讲 Evaluation → 软考案例题可能涉及

## 关联

- [[hung-yi-lee]] — 讲师信息
- [[llm-learning-path]] — LLM学习路径（本课程覆盖阶段1-5）
- [[ai-learning-resources]] — AI学习资源导航
- [[li-mu-d2l]] — 李沐d2l（理论补充）
- [[vector-database-ai]] — 向量数据库（RAG相关）
- [[hexagonal-architecture]] — 六边形架构（Agent系统设计）


