---
title: RAG (Retrieval-Augmented Generation)
created: 2026-05-29
updated: 2026-05-29
type: concept
tags: [rag, llm, engineering]
sources:
  - raw/transcripts/hylee-genai-2025/hylee-2025-02-上下文工程-lVdajtNpaGI.md
confidence: medium
---

# RAG (Retrieval-Augmented Generation)

## 定义

检索增强生成（Retrieval-Augmented Generation，简称 RAG）是一种将**外部知识检索**与 [[language-model]] 生成相结合的混合架构。其核心思想是：在 LLM 生成回答之前，先从外部知识库中检索出与当前任务相关的信息，将其作为上下文（context）提供给模型，从而让模型基于真实、最新的数据进行"文字接龙"。^[raw/transcripts/hylee-genai-2025/hylee-2025-02-上下文工程-lVdajtNpaGI.md]

从 [[context-engineering|Context Engineering]] 的角度来看，RAG 本质上是"选择"（Selection）策略的最佳实践——不把整个互联网塞进 context，而是只检索出与当前任务高度相关的信息放入 prompt。

## 为什么需要 RAG

### LLM 的知识局限

- **知识截止（Knowledge Cutoff）**：[[language-model]] 的知识停留在训练数据的时间点，无法回答关于最新事件的问题
- **幻觉（Hallucination）**：模型本质是在做文字接龙，当缺乏相关知识时可能生成看似合理但事实错误的内容
- **领域知识不足**：通用模型对企业内部文档、私有数据一无所知
- **模型不可修改**：多数线上闭源模型无法直接更新参数，只能通过改变输入 x 来改善输出 f(x)

### RAG 的解决方案

RAG 通过在推理时引入外部检索结果，弥补了上述不足：
- 无需重新训练模型即可获得最新信息
- 提供来源可追溯的知识，降低幻觉风险
- 可接入任意私有知识库，适配特定领域

> **注意**：RAG 并非万能。即便搭配了搜索引擎，语言模型仍然可能犯错——经典的例子是 Google AI Overview 在测试时将 Reddit 上的恶搞回答（"用胶水把起司粘在披萨上"）当作事实呈现给用户。^[raw/transcripts/hylee-genai-2025/hylee-2025-02-上下文工程-lVdajtNpaGI.md]

## RAG Pipeline

```
用户提问 (Query)
    ↓
[1] Query 处理 → 生成检索关键词 / Query 改写
    ↓
[2] 检索 (Retrieval) → 从知识库中找出 Top-K 相关文档片段
    ↓
[3] 重排序 (Reranking) → 精选最相关的文档
    ↓
[4] 上下文组装 → 将检索结果与原始 prompt 拼接
    ↓
[5] 生成 (Generation) → LLM 基于增强后的 context 生成回答
```

## Chunking 策略

在将文档存入知识库之前，需要将长文档切分为合理的片段（chunks），这直接影响检索质量：

| 策略 | 描述 | 适用场景 |
|------|------|----------|
| **固定长度切分** | 按 token 数（如 512 tokens）切分，可设 overlap | 通用场景，实现简单 |
| **段落切分** | 按自然段落或章节边界切分 | 结构化文档 |
| **语义切分** | 根据语义变化点分割 | 需要保持语义完整性 |
| **递归切分** | 先按大结构（章节），再按小结构（段落、句子）层层切分 | 复杂文档 |

关键考量：chunk 太大会引入噪音，太小会丢失上下文。实践中常设置 10-20% 的 overlap 来保持连贯性。

## Embedding 模型

Embedding 模型将文本转化为高维向量（如 1536 维），是 RAG 检索的核心：

- **OpenAI text-embedding-3-small/large**：闭源，效果好，按 API 调用计费
- **BGE (BAAI General Embedding)**：开源，中文表现优秀
- **M3E (Moka Massive Mixed Embedding)**：开源，面向中文场景
- **GTE (General Text Embeddings)**：阿里巴巴开源
- **Cohere embed**：多语言支持好

选择 Embedding 模型时需考虑：语言覆盖、向量维度（影响存储和检索速度）、在 MTEB 等基准上的排名。

## [[vector-database-ai|向量数据库]]

检索结果存储在向量数据库中，支持高效的近似最近邻（ANN）检索：

- **Milvus / Zilliz**：开源，国产，支持分布式
- **Pinecone**：全托管 SaaS，开箱即用
- **Chroma**：轻量级，适合原型开发
- **Qdrant**：Rust 实现，高性能
- **pgvector**：PostgreSQL 扩展，适合已有 PG 基础设施

核心索引算法：HNSW（高召回率）、IVF（适合大规模）、PQ（压缩存储）。

## 检索技术进阶

### Hybrid Search（混合检索）

将**向量检索**（语义匹配）与**关键词检索**（BM25 精确匹配）相结合：
- 向量检索擅长理解同义词、模糊语义
- BM25 擅长精确匹配专有名词、代码符号
- 通过 Reciprocal Rank Fusion (RRF) 或加权融合两路结果

### Reranking（重排序）

在初步检索后，用更精准的模型对候选文档重新打分排序：
- 使用 Cross-encoder 模型（如 BGE-reranker）对 query-document pair 打分
- 也可使用较小的 [[language-model]] 作为 reranker，逐篇判断文档与 query 的相关性^[raw/transcripts/hylee-genai-2025/hylee-2025-02-上下文工程-lVdajtNpaGI.md]
- Provence 论文进一步做到**句子级选择**——不选整篇文章，而是只选出相关的句子，进一步压缩 context

### Query 改写与扩展

- 用 LLM 将用户的自然语言问题转化为更适合检索的关键词^[raw/transcripts/hylee-genai-2025/hylee-2025-02-上下文工程-lVdajtNpaGI.md]
- HyDE（Hypothetical Document Embeddings）：先让 LLM 生成一个"假想答案"，用假想答案的 embedding 去检索
- Multi-query：生成多个不同角度的查询，合并检索结果

## Lost in the Middle 与上下文长度问题

实验表明，RAG 的效果并非"检索结果越多越好"：

- **数据量与正确率的关系**：Databricks 的实验发现，对多数模型而言，检索结果数量适中时效果最佳；数据过多后，模型"头晕目眩"，正确率反而下降。^[raw/transcripts/hylee-genai-2025/hylee-2025-02-上下文工程-lVdajtNpaGI.md]
- **Lost in the Middle 现象**：模型对 context 的开头和结尾记忆较好，中间部分容易被忽略。如果正确答案出现在 20 篇文章的中间位置，效果甚至不如不做 RAG 让模型直接回答。^[raw/transcripts/hylee-genai-2025/hylee-2025-02-上下文工程-lVdajtNpaGI.md]

→ 实践启示：精简检索结果，将最相关的文档放在开头或结尾；宁可少给、精给，也不要堆砌。

## RAG vs Fine-Tuning

| 维度 | RAG | [[fine-tuning]] |
|------|-----|-----------|
| **知识更新** | 实时，改知识库即可 | 需要重新训练 |
| **成本** | 推理时增加检索延迟 | 训练成本高，推理无额外开销 |
| **幻觉控制** | 可提供来源引用 | 难以保证不幻觉 |
| **适用场景** | 事实性问答、知识库查询 | 风格迁移、特定格式输出、行为调整 |
| **可解释性** | 高，可追溯检索来源 | 低，知识融入参数中 |
| **维护** | 维护知识库 | 维护训练数据和流程 |

实际项目中，RAG 和 fine-tuning 常**结合使用**：用 fine-tuning 调整模型的行为风格和输出格式，用 RAG 注入事实性知识。

## 评估挑战

RAG 系统的评估是多层面的难题：

- **检索质量**：Recall@K、Precision@K、MRR（Mean Reciprocal Rank）
- **生成质量**：Faithfulness（是否忠于检索内容）、Relevance（是否回答了问题）、Hallucination rate
- **端到端**：RAGAS、TruLens 等框架提供综合评估指标
- **困难之处**：缺乏统一标注数据；"好的回答"定义因场景而异；检索正确但生成错误的 case 难以自动区分

## RAG 的扩展应用

### Tool-based RAG

将工具的使用说明视为"文档"，根据用户需求只检索相关工具的说明放入 context，避免给模型塞入过多工具导致"发疯"。ChatGPT 的 Plugin 功能就曾限制最多只能选三个工具，背后正是这个考量。^[raw/transcripts/hylee-genai-2025/hylee-2025-02-上下文工程-lVdajtNpaGI.md]

### Memory RAG

对 [[ai-agent]] 的长期记忆做 RAG——将历史交互、经验存储在外部，需要时用 RAG 检索相关记忆。最早的实践来自 Stanford 小镇（2023），其中每个 Agent 的记忆独立存储，按需检索。^[raw/transcripts/hylee-genai-2025/hylee-2025-02-上下文工程-lVdajtNpaGI.md]

### Agentic RAG

将 RAG 嵌入 [[ai-agent]] 的决策循环中——Agent 自主判断何时需要检索、用什么 query 检索、是否需要多轮检索。这代表了 RAG 从被动工具到主动能力的进化。

## 跨课程视角

> 以下课程涉及 RAG 相关内容，点击课程名查看完整笔记。

### [[hylee-genai-ml-2025|李宏毅 GenAI 2025]]（第2讲 Context Engineering）

从 Context Engineering 的"选择"策略出发讲解 RAG——语言模型的信息容量有限，不可能把整个互联网当作 context，因此需要通过搜索引擎只检索出最相关的部分。课程还介绍了 Reranking（让较小的语言模型逐篇筛选文章）以及 Provence 论文的句子级选择方法。强调 RAG 是 Context Engineering 中非常重要的技术。^[raw/transcripts/hylee-genai-2025/hylee-2025-02-上下文工程-lVdajtNpaGI.md]

### [[ai-agent]] — RAG 作为 Agent 的工具

RAG 可以看作 [[ai-agent]] 的一种**工具**——检索增强本质上是通过外部知识库扩展 Agent 的信息获取能力。Agent = LLM + Planning + Memory + Tools（包括 RAG）。Memory RAG 让 Agent 拥有长期记忆而不必把所有历史塞入 context。

### [[vector-database-ai]] — RAG 的存储基础设施

向量数据库是 RAG pipeline 的核心基础设施，负责存储 embedding 向量并提供高效的相似度检索。Chunking → Embedding → 向量数据库 → 检索 → LLM 生成，构成了完整的 RAG 数据流。

### [[language-model]] — RAG 的生成核心

RAG 的生成阶段完全依赖语言模型。理解 LLM 本质上是做"文字接龙"（给定 prompt 预测下一个 token），有助于理解为什么 RAG 有效（提供正确的 context 引导接龙方向）以及为什么会失败（模型可能错误解读检索结果）。

## 相关概念

- [[language-model]] — RAG 的生成引擎
- [[vector-database-ai]] — RAG 的检索基础设施
- [[ai-agent]] — RAG 是 Agent 的核心工具之一
- [[fine-tuning]] — 与 RAG 互补的模型定制方法
- [[context-engineering]] — RAG 是 Context Engineering 的关键技术
- [[transformer]] — LLM 的底层架构
