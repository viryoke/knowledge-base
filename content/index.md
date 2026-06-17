# Wiki Index

> 知识库总目录。
> Last updated: 2026-06-15 | Total pages: 108

---

## 🚀 导航（navigation/）

### 入口
- **[[learning-dashboard]]** — 学习仪表盘 · 各领域进度总览

### 进度跟踪
- **[[progress-ai-ml]]** — AI/ML 学习进度（5 阶段 · 文本优先路线）
- **[[progress-english]]** — 英语学习进度（5 步）
- **[[progress-ruankao]]** — 软考备考进度（2 阶段）
- **[[progress-linux]]** — Linux/NixOS 学习进度（3 阶段 · 12 项）

### 学习计划
- **[[ai-learning-plan]]** — AI/ML 系统学习计划（文本优先版：d2l.ai为主线）
- **[[english-learning-resources]]** — 英语学习计划与资源
- **[[ruankao-11month-strategy]]** — 软考备考策略

---

## 📚 课程（concepts/）

### 数学基础
- [[3blue1brown-linear-algebra]] — 线性代数的本质（14讲）

### ML 基础
- [[andrew-ng-ml-specialization]] — 吴恩达机器学习专项（41讲）

### 深度学习
- [[hylee-genai-ml-2025]] — 李宏毅生成式AI导论（11讲）
- [[hylee-ml-2025]] — 李宏毅机器学习2025（13讲）
- [[karpathy-nn-zero-to-hero]] — Karpathy 从零手写神经网络（10讲）
- [[karpathy-llm-talks]] — Karpathy LLM系列演讲（3讲）
- [[fast-ai-practical-deep-learning-2022]] — fast.ai 实战深度学习（8讲）

### LLM 应用开发
- [[langchain-mastery-2025]] — LangChain v0.3 完整教程（11讲）
- [[freecodecamp-langgraph]] — LangGraph 复杂Agent构建
- [[freecodecamp-llm-finetuning]] — LLM微调实战（LoRA/QLoRA）

### 生产化与专题
- [[mlops-zoomcamp]] — MLOps Zoomcamp 2024
- [[karpathy-blog-articles]] — Karpathy 博客经典文章（4篇文本素材）
- [[lilian-weng-blog]] — Lilian Weng 博客综述（3篇：Agent/RAG/Prompt）
- [[jay-alammar-chip-huyen-blog]] — Jay Alammar & Chip Huyen（Transformer可视化/BERT/LLM工程化）
- [[cvpr-2022-multimodal-ml]] — CVPR 2022 多模态ML（7讲）
- [[eugene-yan-simon-willison]] — Eugene Yan & Simon Willison（LLM工程模式/AI辅助开发）
- [[anthropic-building-agents]] — Anthropic Agent实战指南（2024）
- [[raschka-understanding-llms]] — Raschka LLM学习路线图（2023）
- [[pg-do-things-dont-scale]] — Paul Graham 创业哲学（2013）
- [[lilian-weng-inference-optimization]] — Lilian Weng LLM 推理优化（2023）
- [[lilian-weng-semi-supervised]] — Lilian Weng 半监督学习（2021）
- [[lilian-weng-vision-language-models]] — Lilian Weng 视觉语言模型（2022）
- [[stanford-cs336]] — Stanford CS336 从零构建语言模型（2026）+ AI Agent 使用规范
---

## 🧠 概念（concepts/）

### AI/ML · 模型与架构
- [[multi-head-latent-attention]] — Multi-Head Latent Attention（共享低秩KV，内存降92%）
- [[neural-network]] — 神经网络
- [[transformer]] — Transformer · 自注意力机制
- [[transformer-family]] — Transformer变体全景（2018-2023演进）
- [[language-model]] — 语言模型
- [[generative-model]] — 生成模型（Autoregressive/VAE/GAN/Diffusion）
- [[diffusion-video-generation]] — 扩散模型视频生成
- [[activation-functions]] — 激活函数

### AI/ML · 训练与优化
- [[gradient-descent]] — 梯度下降
- [[backpropagation]] — 反向传播
- [[loss-function]] — 损失函数
- [[overfitting-regularization]] — 过拟合与正则化
- [[training-tips]] — 训练技巧
- [[distributed-training]] — 分布式训练（数据/模型/流水线/张量并行）

### AI/ML · LLM 专项
- [[tokenization]] — 分词（BPE/WordPiece/SentencePiece）
- [[fine-tuning]] — 微调
- [[alignment]] — AI对齐（RLHF/DPO）
- [[inference-reasoning]] — 推理与深度思考（CoT/Test-Time Compute）
- [[latent-reasoning]] — 潜在推理（Reasoning in Memory/无CoT生成）
- [[evaluation-benchmark]] — 评估与基准测试
- [[llm-hallucination]] — LLM 幻觉（检测与缓解）
- [[human-data-quality]] — 高质量人工标注数据（RLHF/对齐）
- [[classification]] — 分类

### AI/ML · 应用架构
- [[ai-agent]] — AI Agent
- [[ai-agent-tooling-practice]] — AI Agent 工具链实践总结（工具选型/Skill生态/知识库/全局约束/核心问题）
- [[rag]] — RAG · 检索增强生成
- [[rag-architecture]] — RAG 系统架构
- [[llm-application-architecture]] — LLM 应用架构模式
- [[vector-database-ai]] — 向量数据库

### 软件工程
- [[hexagonal-architecture]] — 六边形架构
- [[clean-architecture]] — Clean Architecture
- [[onion-architecture]] — 洋葱架构
- [[microservice-architecture]] — 微服务架构
- [[ddd-tactical-patterns]] — DDD 战术模式

### 英语
- [[english-vocab-tech]] — 技术英语词汇
- [[english-pronunciation-notes]] — 发音难点与纠正
- [[english-grammar-patterns]] — 语法核心模式

### Linux
- [[nixos-overview]] — NixOS 核心理念与架构（声明式、不可变、可复现）
- [[nix-language]] — Nix 表达式语言（函数式、惰性求值）
- [[nixos-flakes]] — Flakes 机制详解（inputs/outputs/lock）
- [[nixos-home-manager]] — Home Manager 用户级声明式配置
- [[nixos-wayland-niri]] — Wayland 协议与 Niri 合成器
- [[nixos-nvidia]] — NVIDIA GPU 配置（闭源驱动、Wayland 兼容、CUDA）
- [[nixos-config-review]] — nix-config 审查与优化建议

---


### 概念（stub 页面）
- [[attention-mechanism]] — 注意力机制
- [[multimodal-learning]] — 多模态学习
- [[image-captioning]] — 图像描述
- [[supervised-learning]] — 监督学习
- [[unsupervised-learning]] — 无监督学习
- [[self-supervised-learning]] — 自监督学习
- [[context-engineering]] — 上下文工程
- [[cloud-native]] — 云原生架构
- [[hallucination]] — 幻觉问题
- [[reward-hacking]] — 奖励黑客
- [[embedding]] — 嵌入技术
- [[product-management]] — 产品管理
- [[learning-methods]] — 学习方法
- [[anthropic-prompt-engineering]] — Anthropic提示工程
- [[visual-question-answering]] — 视觉问答
- [[reinforcement-learning]] — 强化学习
- [[knowledge-distillation]] — 知识蒸馏
- [[data-augmentation]] — 数据增强
- [[residual-vector-quantization]] — 残差向量量化
- [[brain-computer-interface]] — 脑机接口（侵入式/非侵入式，2026中国首例临床批准）
- [[agent-os]] — Agent OS（专为AI Agent设计的操作系统，Microsoft Project Solara）

## 👤 实体（entities/）

### 人物
- [[andrej-karpathy]] — Karpathy
- [[andrew-ng]] — 吴恩达
- [[hung-yi-lee]] — 李宏毅
- [[li-mu-d2l]] — 李沐

### 组织与资源
- [[huggingface]] — Hugging Face
- [[ai-bloggers-blogs]] — AI博主索引
- [[ai-communities]] — AI社区索引

---

## 参考（navigation/，无需主动阅读）

> 以下是补充参考材料，已整合到各领域学习计划中。

- [[ai-learning-resources]] — AI学习资源导航
- [[ai-learning-roadmaps]] — AI学习路线图合集
- [[llm-learning-path]] — LLM专项学习路径

---

## Comparisons
<!-- 暂无 -->

## Queries
- [[ai-agent-tooling-team-sharing]] — AI Agent 工具链团队经验分享稿（基于 ai-agent-tooling-practice 的口语化分享版）
