---
title: Skills 索引
created: 2026-06-10
updated: 2026-06-10
type: summary
tags: []
sources: []
---

# Skills 索引

本目录存放 AI Agent 在交互过程中提炼出的**可复用操作流程**。

每个 skill 代表一种经过验证的工作模式，遵循 [Agent Skills 开放标准](https://agentskills.io)，下次遇到同类问题时可直接调用，无需从头推导。

## 目录结构

每个 skill 以独立目录存放：

```
skills/
├── index.md                  # 本文件
└── {skill-name}/             # 小写连字符命名
    ├── SKILL.md              # 必需：元数据 + 指令
    ├── scripts/              # 可选：可执行脚本
    ├── references/           # 可选：参考文档
    └── templates/            # 可选：模板文件
```

## Skill 提炼来源

- Agent 在任务执行中识别提炼信号（用户纠正、复杂任务成功、非平凡方案）
- 用户将个人经验显式沉淀为可执行流程
- 成功解决方案的标准化提炼

## 当前 Skills

（暂无，Agent 将在后续交互中逐步提炼）
