---
title: AI/ML 学习进度追踪
created: 2026-05-29
updated: 2026-06-10
type: concept
tags: [ml, llm]
sources: []
---

# AI/ML 学习进度追踪

> 本页面是学习**进度追踪器**，不是学习计划。完整计划请参见 [[ai-learning-plan]]。
> 每完成一项，点击前方的复选框 ☑ 即可标记完成。
> 标注 🥇=首选文本 🥈=辅助 📹=视频（辅助）

---

## Phase 1: 基础理论 (Week 1-8)

### Step 1: d2l.ai 动手学深度学习 — Part I (🥇 文本教材)

> [zh.d2l.ai](https://zh.d2l.ai/) — 交互式教材，每个概念附可运行代码。中文原版。

- [x] [[Vectors - Chapter 1, Essence of linear algebra|3B1B 线性代数]] 前10讲（可视化补充）
- [ ] 第2章 预备知识（张量操作、线性代数回顾）
- [ ] 第3章 线性神经网络（线性回归、softmax、[[loss-function|损失函数]]）
- [ ] 第4章 多层感知机（前向传播、[[backpropagation|反向传播]]、[[activation-functions|激活函数]]）
- [ ] 第5章 深度学习计算（模型构造、参数管理、GPU）

### Step 2: Andrew Ng ML Specialization 配套材料

> Coursera 课程，有文字版讲义。Python + scikit-learn。→ [[andrew-ng-ml-specialization]]

#### Course 1: Supervised Machine Learning

- [ ] 线性回归与假设函数
- [ ] [[loss-function|代价函数]] 与 [[gradient-descent|梯度下降]]
- [ ] 学习率与凸函数
- [ ] 多特征与多元线性回归
- [ ] 特征缩放与多项式回归

#### Course 2: Classification

- [ ] [[classification|分类]]问题与逻辑回归
- [ ] 决策边界与逻辑回归代价函数
- [ ] [[overfitting-regularization|正则化]]（线性回归 + 逻辑回归）

#### Course 3: Neural Networks

- [ ] [[neural-network|神经网络]]简介与模型
- [ ] 前向传播与向量化实现
- [ ] [[activation-functions|激活函数]]与随机初始化
- [ ] 训练[[neural-network|神经网络]]与多[[classification|分类]]

**实践检查点**：
- [ ] Kaggle Titanic 入门竞赛
- [ ] scikit-learn 完整 ML pipeline
- [ ] 手写线性回归和逻辑回归

---

## Phase 2: 深度学习核心 (Week 9-18)

### Step 1: d2l.ai Part II — CNN/RNN/Attention (🥇 文本教材)

- [ ] 第6章 卷积神经网络（CNN、LeNet）
- [ ] 第7章 现代CNN（VGG、ResNet、BatchNorm）
- [ ] 第8章 循环神经网络（RNN、LSTM、GRU）
- [ ] 第10章 注意力机制（Attention、Self-Attention — 重中之重）

### Step 2: Transformer 深度阅读 (🥇 博客 + 🥈 论文)

- [ ] Jay Alammar: [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) (🥇 必读)
- [ ] Jay Alammar: [The Illustrated BERT](https://jalammar.github.io/illustrated-bert/) (🥇)
- [ ] 精读 "Attention Is All You Need" 论文
- [ ] [[raschka-understanding-llms|Raschka LLM学习路线图]] (🥇 已收录)

📹 **辅助视频**（推荐看这一讲）：
- [ ] [[karpathy-nn-zero-to-hero|Karpathy NN]] Ep.7 Let's build GPT from scratch

### Step 3: 已有视频课程（字幕文本学习）

> 以下课程已有字幕存入Wiki，可作为文本阅读学习。

- [ ] [[hylee-genai-ml-2025|李宏毅生成式AI导论]] 第1讲 生成式AI原理
- [ ] [[hylee-genai-ml-2025|李宏毅生成式AI导论]] 第5讲 ML/DL基本原理
- [ ] [[hylee-genai-ml-2025|李宏毅生成式AI导论]] 第6讲 训练技巧
- [ ] [[karpathy-blog-articles|Karpathy博客]]: A Recipe for Training Neural Networks (🥇)

**Phase 2 实践检查点**：
- [ ] PyTorch 基础熟练
- [ ] 用 PyTorch 实现 CNN 做图像分类
- [ ] 从零实现 [[transformer|Transformer]]（跟 Karpathy 第7讲）
- [ ] 精读 Illustrated Transformer + 原始论文

---

## Phase 3: LLM 应用开发 (Week 19-26)

### Step 1: LLM 原理与 Prompt Engineering (🥇 文本为主)

- [ ] [[karpathy-llm-talks|Karpathy]]: Intro to Large Language Models (字幕文本)
- [ ] [[lilian-weng-blog|Lilian Weng]]: LLM Powered Agent (🥇 博客)
- [ ] [[lilian-weng-blog|Lilian Weng]]: Prompt Engineering (🥇 博客)
- [ ] OpenAI Prompt Engineering Guide (🥇 官方文档)
- [ ] [[anthropic-prompt-engineering|Anthropic Prompt Engineering]] (🥇 已收录)

### Step 2: RAG 与 Agent 开发 (🥇 文档 + 博客)

- [ ] [HuggingFace NLP Course](https://huggingface.co/learn/nlp-course) — RAG章节 (🥇)
- [ ] [LangChain 官方文档](https://python.langchain.com/docs/) (🥇 框架文档)
- [ ] [[anthropic-building-agents|Anthropic: Building Effective Agents]] (🥇 已收录)
- [ ] [[eugene-yan-simon-willison|Eugene Yan: LLM Engineering Patterns]] (🥇 已收录)
- [ ] [[rag-architecture|RAG 系统架构]] 概念页深入阅读

📹 **辅助视频**（选看）：
- [ ] [[langchain-mastery-2025|LangChain Mastery 2025]]
- [ ] [[freecodecamp-langgraph|LangGraph 课程]]

**Phase 3 实践检查点**：
- [ ] 构建企业知识库问答系统（RAG）
- [ ] 开发 AI Agent（能调用工具、记忆上下文）
- [ ] 能使用 LCEL 构建 Chain

---

## Phase 4: 生产化 (Week 27-34)

### Step 1: MLOps 核心阅读 (🥇 书籍 + 博客)

- [ ] Chip Huyen: Designing ML Systems (🥇 书籍，O'Reilly)
- [ ] [Full Stack Deep Learning](https://fullstackdeeplearning.com/) (🥇 文字教程)
- [ ] ML Engineering Book (Andriy Burkov) (🥇 [mlebook.com](http://www.mlebook.com/))
- [ ] [[lilian-weng-inference-optimization|Lilian Weng: LLM推理优化]] (🥇 已收录)

### Step 2: 实践

- [ ] 模型推理服务搭建（vLLM / TGI）
- [ ] MLflow 实验追踪
- [ ] CI/CD for ML
- [ ] 模型量化与推理优化

📹 **辅助视频**（选看）：
- [ ] [[mlops-zoomcamp|MLOps Zoomcamp]] 关键模块

**Phase 4 实践检查点**：
- [ ] 能将模型容器化并部署到云
- [ ] 能设置 CI/CD 管道
- [ ] 完成端到端 ML 项目

---

## Phase 5: 专题深化 (持续)

### 多模态 AI

- [ ] [[lilian-weng-vision-language-models|Lilian Weng: 视觉语言模型]] (🥇 博客)
- [ ] [[cvpr-2022-multimodal-ml|CVPR 2022多模态ML]] 📹

### 补充方向

- [ ] **LLM微调**：[[freecodecamp-llm-finetuning]] 📹 + HuggingFace PEFT文档 🥇
- [ ] **AI Agent**：LangGraph文档 🥇 + [[freecodecamp-langgraph]] 📹

---

## 总进度

| Phase | 资源类型 | 已学 | 进度 |
|-------|----------|------|------|
| Phase 1: 基础理论 | d2l.ai + Andrew Ng | 4/21项 | 19% |
| Phase 2: 深度学习 | d2l.ai + 博客 + 视频 | 0 | 0% |
| Phase 3: LLM应用 | 博客 + 文档 | 0 | 0% |
| Phase 4: 生产化 | 书籍 + 博客 | 0 | 0% |
| Phase 5: 专题 | 持续 | — | — |

---

## 里程碑

### 第3个月末
- [ ] 完成 d2l.ai 前10章 + Andrew Ng ML专项
- [ ] Kaggle 入门竞赛提交成功
- [ ] 理解 [[gradient-descent|梯度下降]]、[[overfitting-regularization|过拟合]] 等核心概念

### 第6个月末
- [ ] 精读 Illustrated Transformer + 原始论文
- [ ] 从零实现 [[transformer|Transformer]]
- [ ] 理解 Attention 机制

### 第9个月末
- [ ] 完成2个 LLM 应用项目（RAG + Agent）
- [ ] 熟悉 LangChain/LangGraph
- [ ] 能部署 LLM 服务到 K8s

### 第12个月末
- [ ] 完成1个生产级 AI 项目
- [ ] 有 MLOps 实践经验
- [ ] 可以面试 AI Engineer 岗位

---

## 关联

- [[ai-learning-plan]] — 完整学习计划
- [[llm-learning-path]] — LLM 专项学习路径
- [[ruankao-11month-strategy]] — 软考备考策略（并行计划）
