---
title: 分词 (Tokenization)
created: 2026-05-29
updated: 2026-05-29
type: concept
tags: [llm, training]
sources:
  - raw/transcripts/karpathy-nn-zero-to-hero/09-GPT-Tokenizer-zduSFxRajkE.md
  - raw/transcripts/karpathy-llm-talks/02-Deep-Dive-into-LLMs-7xTGNNLPyMI.md
confidence: medium
---

# 分词 (Tokenization)

## 定义

将原始文本（raw text）转换为离散的符号序列（token sequence）的过程，以及反向的解码过程。这些 token 是[[language-model]]所感知的"原子"——一切都以 token 为单位进行，一切也都围绕 token 展开。Karpathy 称之为他在处理 LLM 时**最不喜欢的部分**，但同时也是必须深入理解的部分，因为 LLM 的许多怪异行为最终都可以追溯到分词。

## 为什么分词很重要

在 Transformer 模型中，[[attention-mechanism|注意力机制]]的计算代价与序列长度的平方成正比，上下文长度（context length）是极其宝贵且有限的资源。分词的目标就是在**词汇表大小**和**序列长度**之间找到最佳平衡：

```
原始比特流 -> 字节序列(256个符号) -> BPE压缩(~10万个符号) -> 短序列输入Transformer
```

更大的词汇表意味着更短的序列，同样的上下文窗口可以"看到"更多的文本；但过大的词汇表会增加嵌入表和输出 softmax 层的参数量，且稀有 token 可能训练不足。实践中，约 **10万** 左右的词汇量被证明是一个不错的折中选择。

## Character-Level vs Subword Tokenization

### 字符级分词 (Character-Level)

最简单的方案：每个字符就是一个 token。例如在 Karpathy 的 bi-gram [[language-model]] 教程中，莎士比亚数据集仅包含 65 个不同的字符，词汇表大小为 65。这种方法简单透明，没有任意性，但序列非常长——1000 个字符就是 1000 个 token，极大浪费了 Transformer 有限的上下文窗口。

### Subword 分词

现代 SOTA 模型使用 subword 级别的 token——既不是单个字符，也不是完整的单词，而是介于两者之间的**字符块**。这些字符块通过算法（如 BPE）从训练数据中自动学习得到。GPT-2 使用约 50,257 个 token，GPT-4 使用约 100,277 个 token。

## BPE 算法详解 (Byte Pair Encoding)

BPE 最早来自数据压缩领域，后被引入 LLM 作为分词机制（首次大规模应用见 GPT-2 论文）。其核心思想极其简洁：

### 训练阶段

1. **起始状态**：将文本编码为 UTF-8 字节流，此时词汇表有 256 个基础 token（所有可能的 byte），每个字节是一个 token
2. **统计频率**：遍历整个序列，统计所有相邻 token 对（consecutive pair）的出现次数
3. **合并最高频对**：将出现频率最高的 token 对合并为一个新 token，分配新的 ID（从 256 开始递增）
4. **迭代**：重复步骤 2-3，直到达到预设的词汇表大小

例如：假设 "e" + 空格 出现了 20 次，是最高频的对，则创建新 token #256 = "e "，替换所有出现的该对。然后继续寻找下一个最高频对并合并。

```
初始: [a, a, b, c, a, a, b, d, ...]  词汇表={a,b,c,d} 大小=4
第1轮: aa->Z  -> [Z, b, c, Z, b, d, ...]  词汇表+={Z} 大小=5
第2轮: ab->Y  -> [Z, Y, c, Z, Y, d, ...]  词汇表+={Y} 大小=6
第3轮: ZY->X  -> [X, c, X, d, ...]        词汇表+={X} 大小=7
```

每一次合并都使序列缩短、词汇表增大。合并的次数是一个**超参数**，决定了最终的词汇表大小。

### 推理阶段（编码 encode）

给定一段新文本：
1. 将其编码为 UTF-8 字节列表
2. 按训练时的合并顺序（优先级从高到低），贪心地查找可合并的对并替换
3. 返回最终的 token ID 列表

关键点是必须按照**训练时的合并顺序**依次执行——早期合并的对优先级高于晚期合并的对。

### 解码 (decode)

给定 token ID 列表：
1. 查找 vocab 字典得到每个 token 对应的字节串
2. 将所有字节串拼接
3. 用 UTF-8 解码回字符串

注意：由于 BPE 可能在多字节 Unicode 字符的中间位置切分，生成的字节序列不一定是合法的 UTF-8。因此需要使用 `errors="replace"` 来处理无效字节。

## WordPiece 与 SentencePiece

### WordPiece

Google 提出的算法（用于 BERT 等模型），与 BPE 类似但选择合并对的依据不同：BPE 按出现频率选对，WordPiece 按似然增益（likelihood gain）选对——即合并后对语言模型似然的提升程度最大的对被优先合并。结果上两者往往相似。

### SentencePiece

Google 提出的另一种分词框架（被 Llama 2 采用），主要特点是**直接在 Unicode 文本上操作**，而非先转为 UTF-8 bytes。它会将空格统一替换为特殊符号（meta symbol），然后在字符级别运行类似 BPE 或 Unigram 的算法。Llama 2 选择 SentencePiece 的一个重要原因是它能确保**所有数字都被拆分成单个数字**，从而改善算术能力。

## 词汇表大小的权衡

| 方面 | 小词汇表 (~256, char-level) | 中等 (~50K, GPT-2) | 大词汇表 (~100K, GPT-4) |
|------|---------------------------|--------------------|------------------------|
| 序列长度 | 极长 | 中等 | 较短 |
| 嵌入表大小 | 很小 | 中等 | 较大 |
| Softmax 层开销 | 很小 | 中等 | 较大 |
| 信息密度/token | 低 | 中 | 高 |
| 稀疏 token 训练 | 无问题 | 轻微 | 可能有 |

关键洞察：词汇表不是越大越好。当大量文本被压缩进单个 token 时，Transformer 的前向传播可能不足以"消化"其中蕴含的信息——你需要在 token 密度和模型处理能力之间找到甜蜜点。当前 SOTA 模型通常在 **3万到10万** 之间。

## 分词的陷阱：LLM 的最大敌人

Karpathy 明确指出：**分词是 LLM 中许多怪异现象的核心**。很多看似是网络架构或模型本身的问题，实际上根本原因都在分词。以下是主要陷阱：

### 1. 拼写和字符级任务失败

由于多个字符被合并成一个 token（例如 "defaultstyle" 是一个单独的 token），模型无法感知 token 内部的字符组成。问 GPT "defaultstyle 里有几个字母 L"，它会答错，因为它从未将这个词分解为字符。但如果先让它逐字打印再反转，就能正确完成。

### 2. 非英语语言表现更差

同一句话翻译成韩语或日语后，token 数可能是英语的 **3倍甚至更多**。因为分词器的训练数据以英语为主，非英语语言的字节对合并次数少，导致：
- 相同内容消耗更多 token
- 有限上下文窗口能处理的实际信息量减少
- 非英语文本在 Transformer 看来被"拉长"了

### 3. 算术困难

数字的分词方式是**完全任意的**：127 是一个 token，而 677 可能是两个 token（67 和 7），四位数的拆分方式也不固定。加法需要逐位对齐操作，但模型看到的数字表示完全不一致。Llama 2 使用 SentencePiece 强制拆分所有数字来缓解此问题。

### 4. 空格的浪费（GPT-2 的特殊问题）

GPT-2 分词器没有合并连续空格，每个空格都是独立的 token（#220）。Python 代码依赖缩进（大量空格），导致文本被极度膨胀，上下文严重不足。GPT-4 修复了这个问题——4个空格合并为1个 token。**从 GPT-2 到 GPT-4 的代码能力提升，很大程度上来自分词器的改进**，而不仅仅是模型架构的进步。

### 5. 尾随空格警告

在 GPT-2 中，空格通常作为**前缀**附着在下一个 token 上（如 token " hello"）。如果 prompt 以空格结尾，这个空格变成了独立 token #220，脱离了正常的 token 分布，模型会遇到从未见过的上下文模式，输出变得不可预测。OpenAI 的 API 会主动警告用户。

### 6. 同一概念的不同 token 化

"egg" 在句首是两个 token，" egg"（前面有空格）变成一个 token，"Egg" 又是另一个 token。模型必须从海量训练数据中学到这些不同的 token 其实代表同一个概念。这是分词带来的固有认知负担。

### 7. 特殊 token 的安全风险

像 endoftext 这样的特殊 token 如果被不当解析，用户输入中包含 "end of text" 可能触发提前终止。这既是工程实现问题，也与分词的设计密不可分。

## 分词器与 LLM 的关系

分词器是一个**完全独立于语言模型的预处理阶段**：
- 有自己的训练集（可以和 LLM 的训练集不同）
- 是一次性的离线训练——训练好后只用于推理（encode/decode）
- 核心数据结构只有两个：merges（合并规则）和 vocab（词汇表）
- 特殊 token（如 endoftext、FIM token 等）超出 BPE 范畴，由额外逻辑处理

在实践中，训练数据的流程是：原始文本 -> 分词器 encode -> token 序列存储到磁盘 -> LLM 训练时直接读取 token 序列。

## 各代模型的分词演进

| 模型 | 分词器 | 词汇量 | 特点 |
|------|--------|--------|------|
| GPT-2 | BPE on bytes | ~50,257 | 不合并空格，Python 性能差 |
| GPT-4 | BPE on bytes (cl100k_base) | ~100,277 | 合并空格，限制数字最多3位 |
| Llama 2 | SentencePiece | ~32,000 | 强制拆分数字，Unicode 级别操作 |

## 跨课程视角

> 以下课程深入讲解了分词，点击课程名查看完整笔记。

### [[karpathy-nn-zero-to-hero|Karpathy NN Zero to Hero]]

第 9 讲专门且详尽地讲解了 GPT 分词器——从 character-level tokenizer 入手，逐步深入到 Unicode code points、UTF-8 编码、BPE 算法的手动实现（包括 get_stats、merge、encode、decode 函数）、正则表达式预分割（GPT-2 pattern vs GPT-4 pattern）、TikToken 库的使用、以及特殊 token 的处理。最后回顾了视频开头提到的各种 LLM 怪异行为的分词根因。这是理解 tokenization 最完整的单一资源。

### [[karpathy-llm-talks|Karpathy Deep Dive into LLMs]]

面向大众的 LLM 介绍中，用直觉化的方式解释了分词的必要性：原始比特流 -> 8位一组成为字节（256个表情符号般的唯一符号）-> BPE 进一步压缩为更大符号、更短序列。强调了序列长度是神经网络中的"珍贵资源"，并给出了 GPT-4 的约 100K 词汇量作为实践经验值。

### [[language-model]]

语言模型在 token 空间中运作——它接收 token 序列，通过[[embedding|嵌入表]]映射为向量，经 Transformer 处理后预测下一个 token 的概率分布。分词质量直接决定了模型能看到什么粒度的信息，以及能在有限上下文中处理多少内容。

## 相关概念

- [[neural-network]] — 分词后的 token 通过嵌入进入神经网络
- [[transformer]] — 消费 token 序列的核心架构
- [[embedding]] — 将 token ID 映射为连续向量的查找表
- [[language-model]] — 在 token 空间上进行自回归预测的模型
- [[attention-mechanism]] — 序列长度直接影响注意力计算的复杂度
- [[loss-function]] — 模型在词汇表上的分类损失（softmax over vocab）
