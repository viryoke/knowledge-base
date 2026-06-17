---
title: Stanford CS336 - Language Modeling from Scratch
created: 2026-06-02
updated: 2026-06-02
type: concept
tags: [llm, training, resource, engineering]
sources: ["https://cs336.stanford.edu/", "https://github.com/stanford-cs336/assignment1-basics/blob/main/CLAUDE.md"]
confidence: medium
---

## 概述

Stanford CS336 是斯坦福大学 2026 年推出的新课程 "Language Modeling from Scratch"（从零构建语言模型），系统教授 LLM 的完整构建流程。该课程在 Hacker News 上获得 315 分热议，反映了社区对 LLM 底层原理教育的强烈需求。

## 课程定位

与已有课程的区别：
- **[[karpathy-nn-zero-to-hero]]**: 从零手写神经网络，侧重基础
- **[[karpathy-llm-talks]]**: LLM 概念讲解，侧重理解
- **CS336**: 从零构建完整 LLM 系统，侧重工程实践

课程目标是让学生掌握 LLM 的**全栈工程能力**：从数据处理、模型架构、训练优化到部署推理。

## AI Agent 使用指南

课程同时发布了详细的 AI Agent 使用规范（CLAUDE.md），在 HN 获得 271 分。核心原则：

### 允许使用 AI Agent 的场景
- **代码补全**: 在已有框架内补全实现细节
- **调试辅助**: 理解错误信息、定位 bug
- **文档查询**: 查找 API 用法、库函数说明

### 禁止使用 AI Agent 的场景
- **核心算法实现**: 必须自己手写，确保理解原理
- **架构设计决策**: 必须独立思考，不能依赖 AI 建议
- **作业答案生成**: 禁止让 AI 直接生成完整答案

### 使用规范
```
1. 每次使用 AI Agent 必须在代码注释中标注
2. 说明 AI 的贡献范围和自己的修改
3. 必须能够解释每一行 AI 生成的代码
4. 如果无法解释，必须删除重写
```

**意义**: 这是顶级大学首次系统性地制定 AI Agent 在编程教育中的使用规范，为全球高校提供了重要参考。

## 与已有知识的关联

- [[transformer]] — CS336 要求学生从零实现 Transformer 架构
- [[language-model]] — 课程核心：理解并实现语言模型
- [[tokenization]] — 数据处理模块的重要组成
- [[training-tips]] — 训练优化技巧的系统实践
- [[ai-agent]] — 课程的 AI Agent 使用指南本身就是 Agent 应用的典型案例

## 学习建议

### 前置知识
- 熟悉 Python 编程
- 理解 [[neural-network]] 和 [[gradient-descent]] 基础
- 有 [[transformer]] 架构的基本认知

### 学习路径
1. 先完成 [[karpathy-nn-zero-to-hero]] 建立基础
2. 学习 [[karpathy-llm-talks]] 理解 LLM 概念
3. 进入 CS336 进行工程实践
4. 参考 [[langchain-mastery-2025]] 学习应用开发

## 来源

- [CS336: Language Modeling from Scratch](https://cs336.stanford.edu/) — Stanford, 2026
- [AI Agent Guidelines for CS336](https://github.com/stanford-cs336/assignment1-basics/blob/main/CLAUDE.md) — GitHub, 2026
