---
title: Eugene Yan & Simon Willison - LLM 工程实践
created: 2026-05-30
updated: 2026-05-30
type: concept
tags: [llm, engineering]
sources:
  - raw/articles/eugene-yan-llm-patterns.md
  - raw/articles/simon-willison-ai-enhanced-development.md
related:
  - "[[llm-application-architecture]]"
  - "[[ai-agent]]"
  - "[[rag]]"
---

# Eugene Yan & Simon Willison - LLM 工程实践

收录了两篇来自一线工程师的 LLM 应用开发实践文章，重点关注**工程落地**而非理论研究。

## Eugene Yan - Patterns for Building LLM Applications

**核心观点**：从实际项目经验中总结的 7 个 LLM 应用开发模式。

### 关键模式

1. **Prompt Engineering 不是万能的**
   - 复杂的 prompt 难以维护和调试
   - 优先考虑系统架构而非 prompt 技巧

2. **Evaluation-Driven Development**
   - 先定义评估标准，再开发功能
   - 使用真实数据构建评估集
   - 持续监控生产环境表现

3. **RAG 不仅仅是检索**
   - 检索质量决定上限
   - 考虑 chunking 策略、embedding 模型、重排序
   - 混合检索（向量 + 关键词）效果更好

4. **Agent 需要严格控制**
   - 限制 agent 的行动空间
   - 添加人类审批环节
   - 记录所有决策过程便于调试

5. **Guardrails 是必需的**
   - 输入验证：过滤恶意 prompt
   - 输出验证：检查格式、安全性、事实性
   - 使用专门的 guardrail 库

6. **Fine-tuning 是最后手段**
   - 成本高、维护复杂
   - 只在 prompt + RAG 无法满足需求时考虑
   - 确保有足够的标注数据

7. **可观测性至关重要**
   - 记录每次 LLM 调用的输入输出
   - 监控延迟、成本、用户反馈
   - 建立告警机制

**适用场景**：正在或计划构建 LLM 应用的工程师，特别是企业级应用。

---

## Simon Willison - AI-Enhanced Development

**核心观点**：AI 工具如何改变个人开发者的工作方式，让独立开发者能承担更复杂的项目。

### 关键洞察

1. **降低探索成本**
   - 快速原型验证想法
   - 不需要预先学习所有 API
   - AI 帮助阅读和理解陌生代码

2. **提升个人生产力**
   - 一个人可以完成以前需要团队的工作
   - 自动化重复性任务
   - 生成测试用例和文档

3. **改变学习曲线**
   - 通过对话学习新技术
   - AI 解释复杂概念
   - 即时获得代码示例

4. **新的工作模式**
   - **Prompt-Driven Development**：用自然语言描述需求
   - **Iterative Refinement**：多轮对话优化实现
   - **Code Review by AI**：让 AI 检查代码质量

### 实践建议

- **保持怀疑态度**：AI 生成的代码需要验证
- **理解底层原理**：不要完全依赖 AI
- **建立个人知识库**：记录有效的 prompt 和解决方案
- **版本控制一切**：包括与 AI 的对话历史

**适用场景**：独立开发者、全栈工程师、希望提升个人生产力的程序员。

---

## 与已有知识的关联

### [[llm-application-architecture]]
- Eugene Yan 的模式是该页面的实践补充
- 特别关注 guardrails 和可观测性

### [[ai-agent]]
- Eugene Yan 对 agent 的谨慎态度值得注意
- Simon Willison 展示了 AI 作为开发助手的应用

### [[rag]]
- Eugene Yan 强调检索质量的重要性
- 与 [[vector-database-ai]] 的技术选型相关

### [[langchain-mastery-2025]]
- 这些模式是 LangChain 框架的工程实践指导
- 帮助理解框架设计背后的思想

---

## 学习建议

**阅读顺序**：
1. 先读 Eugene Yan 的 Patterns（系统性框架）
2. 再读 Simon Willison 的文章（个人实践视角）
3. 结合 [[llm-application-architecture]] 深入理解

**实践项目**：
- 用学到的模式重构自己的 LLM 项目
- 建立评估集和监控机制
- 记录遇到的问题和解决方案

---

## 相关概念

- [[llm-application-architecture]] - LLM 应用架构模式
- [[ai-agent]] - AI Agent 设计
- [[rag]] - RAG 检索增强生成
- [[inference-reasoning]] - 推理与深度思考
