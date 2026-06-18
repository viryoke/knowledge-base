---
title: "AI工具使用心得：构建个性化AI工作流"
created: 2026-06-17
updated: 2026-06-17
type: query
tags: [agent, engineering]
sources: []
---

# AI工具使用心得：构建个性化AI工作流

> 六个关键实践，让AI工具从"一次性回答机器"变成真正积累起来的工作伙伴。

## 1. 统一多个AI工具

**问题**：Claude Code、Copilot、Cursor、Hermes Agent……每个都能干活，但输出风格和质量参差不齐。

**做法**：构建全局 AGENTS.md，定义AI角色与个人偏好，让所有工具统一引用。

**配置位置**：
- Hermes Agent → `SOUL.md`（灵魂文件，定义人格和行为准则）
- OpenCode → `~/.agents/AGENTS.md`（全局配置）
- Claude Code → `~/.claude/CLAUDE.md`（记忆文件）

**效果**：所有工具共享同一套规则——字体偏好（霞鹜文楷 + Inter + JetBrains Mono）、设计风格（Editorial Warm Academic）、图表规范（Mermaid only，禁止ASCII art）、输出要求（文本优先、具体可执行）。

---

## 2. 让AI工具更懂你

**问题**：每次对话都从零开始，AI不知道你的背景和偏好。

**做法**：通过个人画像和持久记忆，让AI工具渐进式理解你。

**实现路径**：
1. **记忆积累**：Hermes Agent 自动记录偏好（字体、设计风格、编码习惯、学习进度）
2. **画像生成**：基于记忆生成结构化个人画像（角色、目标、风格）
3. **全局引用**：配置在 AGENTS.md 中，所有工具共享

**示例记忆**：
```yaml
user.font.cn: 霞鹜文楷
user.font.code: JetBrains Mono
user.design: Editorial Warm Academic
user.chart: Mermaid only, no ASCII
user.role: 12年研发经验 · 架构师
user.goals: AI/ML · 软考 · 英语
user.style: 文本优先 · 具体可执行
```

**核心理念**：记忆是渐进式的。AI不会一开始就懂你，但通过持续交互和主动提供个人信息文档，画像会越来越精准。

---

## 3. 积累AI产生的素材

**问题**：AI生成的洞察、方案、设计稿散落各处，无法复利。

**做法**：基于 Karpathy LLM Wiki 理念构建本地知识库，让素材形成复利网络。

**三层架构**：
```
Raw（不可变素材）→ Wiki（编译后的知识页面）→ Schema（规则约束）
```

**AGENTS.md 声明**：
- **何时引用**：回答问题时、生成内容时、交叉引用时
- **何时更新**：新素材摄入时、知识冲突时、定期lint检查时

**定时任务（Hermes Cron）**：
- AI 双日简报：自动搜集AI领域新闻
- 知识库 Lint 检查：孤儿页、断链、标签脱节
- 知识库同步 GitHub：自动 commit + push

**待解决问题**：上下文浪费——AI 工具在引用知识库进行交叉引用、Lint 检查、回答查询时，需要读取大量知识库页面作为上下文，消耗巨量 Token。知识库越丰富，每次交互的 Token 成本越高。目前尚未找到优雅的按需加载方案。

---

## 4. 必装的 Skills

五个经过实战验证的 Skill：

| Skill | 用途 | 价值 |
|-------|------|------|
| **find-skills** | 描述问题，自动查找可用 Skill | 避免重复造轮子 |
| **skill-creator** | 高质量创建自定义 Skill | 自动生成标准结构和文档 |
| **superpowers** | 头脑风暴 → Spec → Plan → Verify 四步走 | 确保AI生成质量 |
| **frontend-design** | 生成Web页面时消除"AI味" | 避免通用渐变、glassmorphism等AI生成特征 |
| **ui-ux-pro-max** | 50+风格、161色彩方案、57字体配对 | 搭配frontend-design，一个设计全局架构，一个生成高质量单页 |

**工作流**：需求描述 → find-skills → 匹配Skill → superpowers → 高质量输出

---

## 5. 知识库的跨端共享

**问题**：知识库只在本地，无法多设备访问。

**做法**：GitHub 私仓同步 + Quartz 发布 + Kroki.io 图表渲染。

**架构**：
```
Obsidian Vault（本地）
    ↓ git push
GitHub 私仓（obsidian-vault）→ 多设备同步（Mac · iPhone · iPad）
    ↓
Quartz 构建（npx quartz build）
    ↓
GitHub Pages（viryoke.github.io/knowledge-base）
```

**Quartz 配置**：
- baseUrl: `viryoke.github.io/knowledge-base`
- exclude: `raw/`, `profile/`, `SCHEMA.md`, `AGENTS.md`
- font: Inter + JetBrains Mono
- theme: 暖色调学术风

**Kroki.io 图表引擎**：统一渲染入口，支持 Mermaid、PlantUML、D2、GraphViz、Excalidraw，绘制流程图、架构图、类图、时序图、思维导图。

**自动化**：Hermes 定时任务执行 Lint 检查 → git commit + push → Quartz 构建 + Pages 部署。

---

## 6. 富文本的生成

**问题**：没有订阅图片生成模型（image2、nano banana），如何生成精美幻灯片和音视频？

**做法**：Markdown 中转——AI生成MD素材，手动导入免费工具生成富文本。

**Pipeline**：
```
AI 生成 MD → 手动导入 → 富文本输出
```

**工具选择**：
- **Gemini Canvas**：导入 Markdown，生成精美幻灯片和信息图
- **NotebookLM**：导入文档，自动生成音频摘要和对话式播客

**适用场景**：
- 学习笔记 → 幻灯片分享
- 技术调研 → 团队汇报
- 课程笔记 → 音频复习

**这正是本幻灯片的制作方式**——你正在看的这份 slides 就是这套流程的产物。

---

## 关联

- [[ai-agent-tooling-team-sharing]] — AI Agent 工具链踩坑与收获（团队经验分享，更详细的实战细节）
- [[skills/frontend-design/SKILL.md|frontend-design]] — 前端设计 Skill
- [[skills/ui-ux-pro-max/SKILL.md|ui-ux-pro-max]] — UI/UX 设计素材库
- [[skills/quartz-obsidian-wiki/SKILL.md|quartz-obsidian-wiki]] — Quartz + Obsidian Wiki 发布
- [[andrej-karpathy]] — Karpathy LLM Wiki 理念的提出者

---

## 演示文稿

本心得的演示文稿版本：[AI工具使用心得 Slides](https://viryoke.github.io/knowledge-base/presentations/ai-tools-insights.html)
