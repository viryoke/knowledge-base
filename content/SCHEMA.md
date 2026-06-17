# Wiki Schema

## 核心理念

本知识库基于 [Andrej Karpathy 的 LLM Wiki 理念](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) 构建。

### 为什么不用 RAG？

传统 RAG（检索增强生成）的问题：
- 每次查询都从零发现知识，重复劳动
- 交叉引用缺失，矛盾未被标记
- 知识碎片化，无法形成网络

Wiki 的优势：
- **编译一次，持续更新**：交叉引用已建好，矛盾已标记，综合反映了所有摄入的内容
- **复利增长**：每个新源可能触发多个页面的更新，知识网络随时间增值
- **可审查性**：人类可以浏览、验证、修正，而非黑盒检索

### 人机分工

- **人类**：策展源材料、指导分析方向、审查质量
- **Agent**：总结、交叉引用、归档、维护一致性、执行 Lint 检查

### 三层架构

```
Layer 3 — Schema（本文件）
  ↓ 约束
Layer 2 — Wiki（navigation/, concepts/, entities/, comparisons/, queries/）
  ↑ 只读
Layer 1 — Raw Sources（raw/，不可变）
```

- **Layer 1**：原始素材，Agent 只读不改
- **Layer 2**：Wiki 页面，Agent 负责创建、更新、交叉引用
- **Layer 3**：规则层，定义 Agent 行为边界

### 文本优先学习原则 (Text-First Learning Principle)

所有学习材料的收录和推荐遵循「文本优先，视频为辅」原则：

- **首选**：教科书、官方文档、技术博客、论文、交互式教程（如 d2l.ai）
- **次选**：视频课程的字幕文本、课件 PDF、课程笔记
- **辅助**：视频本身（仅在文本无法替代时使用，如可视化讲解、实操演示）

**理由**：
- 文本可翻译、可跳读、可精读，学习密度远高于视频
- 英文原版视频对听力要求高，文本材料可有效降低语言障碍
- 文本材料更易于 Agent 处理和索引，提升知识复利效率

**实践规则**：
- 课程页面必须标注文本资源的优先级（教材链接 > 字幕 > 视频）
- 学习计划中优先推荐有配套文本的资源（d2l.ai、Stanford笔记、官方文档）
- 纯视频课程若无文本配套，标注「⚠️ 仅视频」并建议替代方案
- 收录课程时，优先下载课件PDF和字幕文本，视频链接仅作备用

### 复利思维

知识库的价值 = 页面数量 × 交叉引用密度 × 内容质量

- 新源摄入时，不只是创建新页面，而是更新所有相关页面
- 每个页面至少有 2 个出站链接，形成知识图谱
- 定期 Lint 检查，防止孤儿页面和断链

---

## 领域

个人知识体系——涵盖：AI/ML、软件工程、英语、考试备考、身心健康、人文认知、个人理财。
目标：构建一个持续复利增长的知识网络，服务于考试备考、技术深耕、认知升级与人生决策。

### 知识领域（Knowledge Domains）

| Domain | 说明 | 当前状态 |
|--------|------|----------|
| AI-ML | 人工智能与机器学习 | ✅ 核心领域 |
| Software-Engineering | 软件工程（架构、设计模式、DevOps） | ✅ 已有内容 |
| English | 英语能力（听说读写） | ⚠️ 初步建设 |
| Exam-Prep | 考试备考（软考架构师） | ⚠️ 仅有计划 |
| Wellbeing | 身心健康（心理、家庭关系、习惯、运动） | ❌ 待建设 |
| Humanities | 人文认知（历史、哲学、时事、经济学） | ❌ 待建设 |
| Finance | 个人理财（投资、预算、保险） | ❌ 待建设 |
| Linux | Linux系统（NixOS、桌面环境、系统管理） | ⚠️ 初步建设 |

---

## 目录结构

```
ObsidianVault/
├── AGENTS.md           # Agent 行为约束（每次会话自动注入）
├── SCHEMA.md           # 本文件：规范与约定
├── index.md            # 分区目录，每条附一行摘要
├── log.md              # 操作日志（追加式，超500条轮换）
│
├── profile/            # 个人画像（Agent 渐进式构建，用户审核后写入）
│   ├── identity.md     # 身份、性格、价值观（极少变）
│   ├── preferences.md  # 交互偏好、输出风格（极少变）
│   ├── tech-stack.md   # 技术栈、学习阶段（中等频率）
│   ├── goals.md        # 当前目标、项目进度（高频变）
│   └── interests.md    # 兴趣爱好、关注话题（低频变）
│
├── navigation/         # Layer 2：导航层
│   ├── learning-dashboard.md
│   ├── progress-*.md
│   └── *-plan.md / *-strategy.md
│
├── concepts/           # Layer 2：概念层（课程 + 知识概念）
├── entities/           # Layer 2：实体层（人物、组织、资源索引）
├── comparisons/        # Layer 2：对比分析
├── queries/            # Layer 2：存档查询
├── skills/             # Layer 2+：可复用操作流程（Agent 提炼，用户审核）
│
└── raw/                # Layer 1：原始素材（不可变）
    ├── transcripts/    # 字幕，按来源建子目录
    ├── papers/         # 课件PDF，按来源建子目录
    ├── articles/       # 文章
    └── assets/         # 图片资源
```

### 各层职责

| 层 | 目录 | 职责 | 谁维护 |
|----|------|------|--------|
| Meta | profile/ | 个人画像（身份、偏好、目标、兴趣） | Agent 渐进式构建，用户审核 |
| Layer 2 | navigation/ | 学习入口、进度跟踪、计划文档 | 人 + Agent |
| Layer 2 | concepts/ | 课程概览、技术概念、跨课程知识 | Agent 主导 |
| Layer 2 | entities/ | 人物传记、组织信息、资源索引 | Agent 主导 |
| Layer 2 | comparisons/ | 方案/工具/方法对比 | Agent 主导 |
| Layer 2 | queries/ | 值得存档的问答结果 | Agent 主导 |
| Layer 2+ | skills/ | 可复用的操作流程 | Agent 提炼，用户审核 |
| Layer 1 | raw/ | 字幕、课件、文章（不可变） | Agent 采集，不修改 |

---

## 页面类型

| type | 说明 | 存放目录 |
|------|------|----------|
| `concept` | 技术概念或课程概览 | concepts/ |
| `entity` | 人物、组织、产品、资源索引 | entities/ |
| `comparison` | 方案/工具/方法的对比分析 | comparisons/ |
| `query` | 值得存档的问答结果 | queries/ |
| `summary` | 综合性总结（跨多个来源） | concepts/ 或 navigation/ |
| `skill` | 可复用的操作流程 | skills/ |

---

## Frontmatter

### Wiki 页面

所有 Layer 2 页面必须包含：

```yaml
---
title: 页面标题
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: concept | entity | comparison | query | summary
tags: [from taxonomy below]
sources: [raw/path 或 URL]
confidence: high | medium | low
# 可选质量信号：
contested: true                        # 存在未解决的矛盾时设置
contradictions: [other-page-slug]      # 与哪些页面矛盾
---
```

- `sources` 字段可为空数组 `[]`，但不能省略
- 更新页面时必须 bump `updated` 日期
- URL 中包含 `?` 时必须加引号：`sources: ["https://youtube.com/playlist?list=XXX"]`
- `confidence: low` 的页面会在 Lint 中被标记待审查
- `contested: true` 的页面会在 Lint 中被标记待人工审查

### Raw 素材

Layer 1 的原始素材也需要 frontmatter，用于检测来源变更：

```yaml
---
source_url: https://example.com/article   # 原始 URL（如适用）
ingested: YYYY-MM-DD
sha256: <body 内容的 hex digest>
---
```

- `sha256` 计算范围：frontmatter 之后的正文内容
- 重新摄入同一 URL 时：比对 sha256，相同则跳过，不同则标记 source drift
- 字幕文件（自动采集）可省略 sha256，但必须有 `ingested` 日期

---

## 课程页面规范

课程页面是知识库的核心枢纽，连接原始素材和知识概念。

### 标准结构

```markdown
# 课程名称

**讲师**: [[entity|讲师名]]
**类型**: 交互式教材 / 博客系列 / 视频课程（含字幕） / 论文合集
**总时长/章节**: X章 / Xh (N讲)
**官方教材**: [d2l.ai](URL) / [课程笔记](URL)
**YouTube播放列表**: [YouTube](URL)（辅助）

## 学习资源（按优先级排列）

| 优先级 | 资源类型 | 链接 | 说明 |
|--------|----------|------|------|
| 🥇 首选 | 教材/文档 | [链接](URL) | 主学习材料 |
| 🥈 次选 | 课件PDF | raw/papers/课程/ | 配套slides |
| 🥉 辅助 | 字幕文本 | raw/transcripts/课程/ | 视频配套字幕 |
| 📹 备用 | 视频 | [▶️](URL) | 仅视频无可替代时使用 |

## 课程结构

| 章节 | 主题 | 核心内容 | 教材链接 | 课件 | 字幕 | 视频 |
|------|------|----------|----------|------|------|------|
| 1 | 主题名 | 简要摘要 | [📖](URL) | [📄](PDF) | [[字幕\|📝]] | [▶️](URL) |

## 学习建议
## 关联
```

### 表格图标约定

| 图标 | 含义 | 格式 |
|------|------|------|
| 📖 | 教材/文档链接 | `[📖](URL)` |
| 📝 | 字幕文件 | `[[raw/transcripts/课程/文件名\|📝]]` |
| 📄 | 课件PDF | `[📄](raw/papers/课程/文件名.pdf)` |
| ▶️ | 视频链接（辅助） | `[▶️](https://youtube.com/watch?v=ID)` |
| ↑ | 同上（整课共享资源时使用） | 纯文本 `↑` |
| - | 不可用 | 纯文本 `-` |

### 关键原则

- **文本资源前置**：教材链接 > 课件 > 字幕 > 视频，视频始终在最后
- **素材内嵌表格**：所有资源链接直接绑定到每讲行内
- **无 Raw Materials 区**：所有素材引用都在表格中
- **核心内容列**：每讲一行简要摘要（20-40字）
- **课程类型标注**：明确标注该课程是文本为主还是视频为主

---

## 概念页面规范

概念页面聚合多门课程的交叉讲解，是知识图谱的核心节点。

### 标准结构

```markdown
## 定义
简明定义 + 核心公式或结构图

## 跨课程视角
> 以下课程深入讲解了XXX，点击课程名查看完整笔记。

### [[course-page|课程显示名]] (讲次)
该课程中关于本概念的讲解要点
^[raw/transcripts/课程/字幕文件.md]

## 相关概念
- [[concept-a]] — 关系说明
```

### 关键原则

- **跨课程视角必须有课程回链**：`### [[course-page|显示名]]` 格式
- **provenance markers**：用 `^[raw/transcripts/...]` 标注知识来源
- **每个概念至少 2 个出站链接**
- 合成 3+ 来源的页面，段落末尾标注 `^[raw/路径]`

---

## 导航页面规范

| 页面类型 | 文件 | 职责 |
|----------|------|------|
| 仪表盘 | learning-dashboard.md | 各领域进度总览，不含详细内容 |
| 进度跟踪 | progress-*.md | 每个领域一个，含 checkbox 任务列表 |
| 学习计划 | *-plan.md / *-strategy.md | 详细的学习方案和资源推荐 |

- **每个领域一个计划入口**：不在 index.md 中暴露多个并行计划
- **进度页 = 学习顺序 + 完成状态 + 资源链接**
- **仪表盘只做汇总**：链接到各进度页，不重复详细内容

---

## Skill 页面规范

Skill 是知识复利的最高形态——将经验转化为可直接执行的资产。遵循 [Agent Skills 开放标准](https://agentskills.io)。

### 目录结构

每个 skill 以独立目录存放于 `skills/` 下：

```
skills/
└── {skill-name}/           # 小写连字符命名
    ├── SKILL.md            # 必需：元数据 + 指令
    ├── scripts/            # 可选：可执行脚本
    ├── references/         # 可选：参考文档
    └── templates/          # 可选：模板文件
```

### Frontmatter

```yaml
---
# === 通用标准必填字段 ===
name: skill-name                # 小写连字符，与目录名一致
description: "描述触发条件，而非 skill 本身"

# === 通用标准可选字段 ===
version: 1.0.0                  # 语义化版本
author: viryoke                 # 创建者
tags:                           # 必须来自 SCHEMA.md 标签体系
  - from-SCHEMA-taxonomy

# === 知识库扩展字段（Obsidian 兼容） ===
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: skill
confidence: high | medium | low
---
```

### description 字段写法

description 是 SKILL 最关键的字段——Agent 用它决定是否激活此 skill。

```
✅ 好的 description（描述触发条件）：
  "从 YouTube 视频获取字幕并转为 Markdown 格式存入知识库。"
  "排查 Python 虚拟环境安装到错误路径的问题。"
  "在 NixOS 上配置桌面环境（Ghostty、Starship、Catppuccin）。"

❌ 差的 description：
  "帮助处理视频" — 太宽泛
  "一个很有用的技能" — 描述 skill 本身，而非触发条件
```

### 指令正文结构

```markdown
# Skill 名称

## When to Use
什么场景下应该使用此 skill

## Prerequisites
执行前需要确认的环境、依赖、权限

## Procedure
分步操作流程

## Quick Reference
常用命令或速查表

## Pitfalls
常见陷阱和注意事项

## Verification
如何确认 skill 执行成功
```

### 生命周期

| 阶段 | 负责人 | 说明 |
|------|--------|------|
| 提炼 | Agent | 从交互中识别信号，抽象出可复用流程 |
| 审核 | 用户 | 确认 skill 的准确性和实用性 |
| 调用 | Agent | 后续匹配 description 时自动激活 |
| 迭代 | Agent + 用户 | 根据实际使用反馈持续优化 |
| 整合 | Agent | 定期将同类窄 skill 合并为 umbrella skill |

### 关键原则

- 出现提炼信号时（用户纠正、复杂任务成功、非平凡方案），Agent 应主动建议提炼 skill
- Skill 必须经过用户审核后才标记为 `confidence: high`
- 每个 skill 至少链接到 1 个相关的 concept 或 query 页面
- `description` 字段用于 Agent 自动匹配场景，必须描述触发条件
- 文件名必须是 `SKILL.md`（大写，大小写敏感）
- `name` 必须与目录名一致

---

## 标签体系

### 设计原则

使用 cross-cutting 标签，而非为同一领域建立平行分类。

❌ 错误：`系统架构` + `软件工程` + `考试备考` 作为三个独立顶级分类
- 架构是软件工程的子话题
- 考试描述的是*为什么学*（目的），不是*学什么*（领域）

✅ 正确：
- 架构并入 `软件工程`
- 考试作为 cross-cutting 标签，可以附加到任何领域的页面

**判断规则**：
- 如果 A 的内容大部分是 B 的子集 → 合并
- 如果 C 描述的是*为什么学*而非*学什么* → 做成 cross-cutting

### 标签列表 (17 tags)

#### AI/ML topics
- ml: 机器学习基础（深度学习、数学、可视化、PyTorch）
- llm: 大语言模型
- architecture: 模型架构（Transformer、注意力机制、神经网络）
- training: 训练技术（微调、RLHF、LoRA、对齐、数据效率）
- inference: 推理优化（量化、剪枝、效率）
- vision: 视觉模型（多模态、视觉语言、图像描述、VQA）
- generative: 生成模型（扩散、视频生成）

#### AI/ML engineering
- mlops: MLOps（DevOps、云原生、部署、生产环境）
- rag: 检索增强生成
- agent: AI Agent（工作流、LangChain、LangGraph）
- evaluation: 模型评估（基准测试、数据质量、标注、可靠性）

#### Software
- engineering: 软件工程（分布式系统、微服务、设计模式、应用开发、自动化）

#### Linux & Systems
- linux: Linux系统（NixOS、桌面环境、系统管理、Wayland、驱动）

#### Skills
- english: 英语（语法、口语、发音、词汇）
- exam-prep: 考试备考（学习路径规划）
- career: 职业发展（成长、创业）

#### Meta
- person: 人物
- resource: 资源（开源项目、公司、研究、产品）

**规则**：新标签必须先添加到此处，再使用。每个页面标签必须来自此列表。

---

## 页面阈值

- **创建页面**：实体/概念出现在 2+ 来源中，或是某来源的核心主题
- **追加到已有页面**：来源提到了已有页面覆盖的内容
- **不创建页面**：仅被提及一次的非核心内容
- **拆分页面**：超过 ~200 行时考虑拆分为子主题
- **归档页面**：内容完全被替代时，移至 `_archive/`，从 index.md 移除，更新所有入站链接

---

## 更新策略

当新信息与已有内容冲突时：

1. 检查日期——新来源通常优先
2. 如果确实矛盾，注明双方立场、日期和来源
3. 在 frontmatter 标记：`contradictions: [page-name]`，`contested: true`
4. 在 Lint 报告中标记待人工审查

---

## index.md 格式

分区目录，每条附一行摘要。按导航→课程→概念→实体分层。

```markdown
## 🚀 导航（navigation/）
- **[[page]]** — 一行摘要

## 📚 课程（concepts/）
### 分类名
- [[page]] — 一行摘要

## 🧠 概念（concepts/）
### 分类名
- [[page]] — 一行摘要

## 👤 实体（entities/）
- [[page]] — 一行摘要

## ⚡ Skills（skills/）
- [[page]] — 触发场景 + 一句话说明
```

- 任何分区超过 50 条时，拆分子分区
- 总条目超过 200 时，创建 `_meta/topic-map.md` 按主题分组

---

## log.md 格式

追加式日志，每条记录格式：

```markdown
## [YYYY-MM-DD] action | subject
- 详细说明
```

Actions: `ingest`, `update`, `query`, `lint`, `create`, `archive`, `delete`

超过 500 条时轮换为 `log-YYYY.md`，重新开始。

---

## Lint / 健康检查

定期执行（每月或超过 50 页时）：

1. **孤儿页面**：无入站 `[[wikilinks]]` 的页面
2. **断链**：wikilink 指向不存在的页面
3. **索引完整性**：所有页面都应出现在 index.md 中
4. **Frontmatter 验证**：所有必需字段存在且合法
5. **标签蔓延**：taxonomy 外的标签
6. **陈旧内容**：updated 日期过旧的页面
7. **矛盾审查**：`contested: true` 或 `contradictions` 字段的页面
8. **质量信号**：`confidence: low` 的页面 + 仅单源且无 confidence 的页面
9. **Source drift**：raw/ 中有 sha256 的文件，重新计算并比对
10. **页面大小**：超过 200 行的页面
11. **日志轮换**：log.md 超过 500 条时轮换

---

## Obsidian 集成

本知识库同时作为 Obsidian Vault 使用：

- `[[wikilinks]]` 在 Obsidian 中渲染为可点击链接
- Graph View 可视化知识网络
- YAML frontmatter 支持 Dataview 查询
- 附件文件夹设置为 `raw/assets/`
- 启用 Wikilinks（默认开启）
- 推荐安装 Dataview 插件：`TABLE tags FROM "concepts" WHERE contains(tags, "llm")`

---

## 约定

- **文件名**：小写、连字符、无空格（如 `transformer-architecture.md`）
- **链接**：使用 `[[wikilinks]]`，每个页面至少 2 个出站链接
- **语言**：中文为主，技术术语保留英文原文
- **provenance markers**：合成 3+ 来源的页面，段落末尾标注 `^[raw/路径]`
- **素材不可变**：raw/ 中的文件只能新增，不能修改
- **one entity = one page**：同一实体不分散在多个文件中
