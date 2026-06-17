---
title: "Evaluation & Benchmark"
created: 2026-05-29
updated: 2026-05-29
type: concept
tags: [evaluation, llm]
sources: 
  - raw/transcripts/hylee-genai-2025/hylee-2025-04-評估生成式AI能力-dWQVY_h0YXU.md
  - raw/transcripts/hylee-ml-2025/hylee-ml-2025-09-LLM评估-s266BzGNKKc.md
confidence: medium
---

# Evaluation & Benchmark

## 定义

评估（Evaluation）是衡量[[language-model]]在特定任务上能力的关键环节。**Benchmark**（基准测试）既可以指评估模型的整个过程，也可以指用于评估的数据集——包含输入数据和对应的标准答案（Ground Truth）。

通过 Benchmark，我们可以量化模型的表现，得到 Evaluation Metric（评估指标），进而比较不同模型在同一任务上的能力差异。

## 评估方法

### 自动评估（Automatic Evaluation）

当存在标准答案时，可以定义一个对答案的函数 $e$，计算模型输出与标准答案的相似程度。

#### Exact Match（精确匹配）

最简单无脑的方法：模型输出与标准答案完全一致得 1 分，否则得 0 分。

**问题**：
- 对于生成式 AI，即使答案语义正确，格式稍有不同就会被判错（例如回答「3」但标准答案是「三」）
- 在选择题场景下，模型可能输出「B 玉山」而非单纯的「B」，导致判错
- 可能测量的是模型遵循指令的能力，而非真正想测的知识（例如考台湾地理却变成考指令理解）

**适用场景**：答案可能性有限的选择题，且明确告知模型只输出选项字母。

#### 词彙相似度指标

计算输出与标准答案有多少共同的词汇：

- **BLEU score**：翻译任务常用指标
- **ROUGE score**：摘要任务常用指标
- **METEOR**：考虑词汇语义相似度，依赖外部数据库（如 WordNet）
- **BERTScore**：使用[[language-model]]的 Contextualized Embedding 计算语义相似度，比单纯词汇匹配更准确

#### Goodhart's Law 与指标陷阱

> 一旦一项指标被当作优化目标，它就不再是一个好的指标。

**Parrot 悖论**：在换句话说的任务中，如果模型直接把输入当作输出（鹦鹉学舌），不做任何改变，却能在 BLEU、METEOR 等指标上取得高分，甚至打爆 state-of-the-art 模型。这说明过度依赖指标会导致得到高分但实际表现糟糕的模型。

### 人类评估（Human Evaluation）

当没有标准答案时（如写小说、写诗），最终可以请人类来评判。

**常见形式**：
- **Mean Opinion Score (MOS)**：让人类对输出打 1-5 分，计算平均值
- **Chatbot Arena**：随机匹配两个模型，让人类判断哪个回答更好，使用 Elo score 计算排名

**问题**：
1. **主观偏见**：人类往往更在意模型「怎么说」而非「说了什么」——回答更长、使用 Markdown 格式、更多 emoji 的模型容易占优势
2. **Setting 敏感**：给评估者不同的指令（如评估自然度 vs 失真度 vs 综合），会导致完全不同的排名结果
3. **成本高**：需要找人、付费
4. **再现性差**：今天找的人和明天找的人不同，结果可能不一致

**Chatbot Arena 的改进**：引入 $\beta_0$ 项，考虑与模型实力无关的因素（如回答长度、emoji 数量、正面程度等），去除风格影响后重新排名。结果显示 Claude 系列模型在去除风格影响后排名大幅上升——它们很聪明但说话太正经，不讨喜。

## 常见 Benchmark

### 知识问答类

- **MMLU**（Massive Multitask Language Understanding）：57 个学科的选择题，测试模型的知识广度
- **SimpleQA**：OpenAI 提出的简单问答 benchmark，特点是答错会倒扣，说「我不知道」得 0 分，引导模型减少[[hallucination]]

### 数学推理类

- **GSM8K**：小学数学应用题，多数模型都能答对，但存在数据污染问题
- **AIME**：数学竞赛题，难度更高，用于测试推理模型（如 DeepSeek、o1 系列）
- **ARC-AGI**：图形智力测验，2019 年发布，目标是防止模型依赖网络上见过的知识，测试真正的推理能力。o3 模型在此 benchmark 上表现超过普通人类，但每答一题需要消耗 1000 美金算力

### 代码生成类

- **HumanEval**：编程任务 benchmark，测试模型的代码生成能力

### 综合评估平台

- **Chatbot Arena**：众包评估平台，全世界的人都可以提问并评判，使用 Elo score 排名。虽然难以被针对性 hack，但仍可能被风格因素（emoji、长回答）影响
- **HELM**（Holistic Evaluation of Language Models）：Stanford 提出的全面评估框架

## 评估陷阱

### 数据污染（Data Contamination）

模型可能在训练时「偷看」了测试集的题目。例如：

- 把 GSM8K 的题目中的人名、数字、句子顺序换掉，多数模型的正确率会下降，说明它们背过原题
- 即使从训练数据中删除与测试集相同的题目，模型仍可能通过其他语言的翻译版本间接见过（如 GSM8K 被翻译成蒙古文放在网上）
- 跨语言学习能力让模型即使看到不同语言的版本，仍能识别出相同的题目

**检测方法困难**：无法把测试集翻译成所有语言去检查模型是否见过。

### 过拟合 Benchmark

多数 benchmark 在发布 2-3 年内就会被模型 overfit，正确率接近 100%。ARC-AGI 是个例外，发布 5 年内进展缓慢，但也可以通过大量生成类似题目来 hack。

### Cherry-picking（选择性展示）

模型开发者可能只展示模型表现好的 benchmark，隐藏表现差的。同一模型在不同 benchmark 上的表现可能差异巨大。

### Hallucination 与评估机制

模型明明不知道答案却硬要编造，原因之一是评估机制的缺陷：

- 说「我不知道」得 0 分
- 瞎猜一个答案也得 0 分，但搞不好蒙对了
- 因此模型没有动机承认自己的无知

**解决方案**：引入倒扣机制——答对得 1 分，答错得负分，说「我不知道」得 0 分。这样模型会学到「不知道时承认比乱猜更好」。

## LLM-as-Judge

用[[language-model]]取代人类进行评估。

**起源**：ChatGPT 出现后的隔周，李宏毅实验室的江成翰同学提出这个想法，发表在 ACL 2023，成为该会议引用次数前五的论文。Microsoft 同期发表了类似的 G-Eval 论文。

**做法**：让语言模型阅读与人类相同的评估指令，对模型输出打分。

**评分格式的影响**：

1. **只给分数**：模型只输出数字，不解释
2. **自由发挥**：模型想说什么就说什么
3. **先给分数再解释**：模型输出分数后解释理由
4. **先推理再给分**：模型先分析内容、制定评分标准、推理，最后给分

**发现**：让模型提供解释（即使是事后解释）能让评分结果更接近人类评分。模型「知道」自己在解释，这会影响它的评分准确性。

**现状**：LLM-as-Judge 已被广泛接受，许多常用 benchmark 都使用语言模型评分。

## 跨课程视角

> 以下课程深入讲解了评估与 benchmark，点击课程名查看完整笔记。

### [[hylee-genai-ml-2025|李宏毅 GenAI 2025]]（第 4 讲）

系统讲解生成式 AI 的评估方法，从 Exact Match 的局限性，到 BLEU/ROUGE/BERTScore 等自动指标，再到人类评估的问题（Chatbot Arena、风格偏见、MOS 的再现性问题）。通过 Parrot 悖论和 Hallucination 的例子说明 Goodhart's Law，引出 LLM-as-Judge 的概念。^[raw/transcripts/hylee-genai-2025/hylee-2025-04-評估生成式AI能力-dWQVY_h0YXU.md]

### [[hylee-ml-2025|李宏毅 ML 2025]]（第 9 讲）

聚焦推理模型的评估，讨论 GSM8K 的数据污染问题（改名换数字就答错）、ARC-AGI 的设计理念（避免模型依赖记忆）、Chatbot Arena 的 Elo score 机制。深入分析 Chatbot Arena 如何被 hack（emoji、长回答、风格因素），以及如何通过 $\beta_0$ 项去除风格影响。最后以 Goodhart's Law 和眼镜蛇效应作结。^[raw/transcripts/hylee-ml-2025/hylee-ml-2025-09-LLM评估-s266BzGNKKc.md]

### [[language-model]]

评估的核心对象。语言模型的能力通过 benchmark 量化，但评估指标本身可能误导模型优化方向（Goodhart's Law）。

### [[overfitting-regularization]]

评估与过拟合密切相关：模型可能在训练集上表现好但在测试集上差，或者在公开 benchmark 上 overfit。数据污染是另一种形式的过拟合——模型「背」了测试题。

## 相关概念

- [[language-model]] — 评估的主要对象
- [[overfitting-regularization]] — 数据污染与 benchmark overfitting
- [[fine-tuning]] — 微调后需要评估模型是否真的变好
- [[hallucination]] — 评估机制缺陷导致模型不愿说「我不知道」
- [[alignment]] — 评估模型是否符合人类意图
