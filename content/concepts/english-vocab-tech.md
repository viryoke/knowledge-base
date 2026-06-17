---
title: 技术英语词汇
created: 2026-05-28
updated: 2026-05-28
type: concept
tags: [english, career]
sources: []
confidence: high
---

# 技术英语词汇 (Technical English Vocabulary)

> 按场景组织的技术工作常用词汇和表达，包含发音要点和常见搭配。

## 系统架构 (System Architecture)

### 核心名词
| 词汇 | 发音 | 含义 | 常见搭配 |
|------|------|------|----------|
| **scalability** | /ˌskeɪləˈbɪləti/ | 可扩展性 | horizontal/vertical scalability, scalability concerns |
| **latency** | /ˈleɪtənsi/ | 延迟 | low latency, reduce latency, latency-sensitive |
| **throughput** | /ˈθruːpʊt/ | 吞吐量 | high throughput, throughput bottleneck |
| **bottleneck** | /ˈbɒtlnek/ | 瓶颈 | identify the bottleneck, performance bottleneck |
| **trade-off** | /ˈtreɪdɒf/ | 权衡 | trade-off between A and B, make a trade-off |
| **overhead** | /ˈəʊvəhed/ | 开销 | minimal overhead, system overhead |

### 架构模式
| 词汇 | 发音 | 含义 | 例句 |
|------|------|------|------|
| **microservice** | /ˈmaɪkrəʊsɜːvɪs/ | 微服务 | "We're migrating from a monolith to microservices." |
| **monolith** | /ˈmɒnəlɪθ/ | 单体应用 | "The legacy monolith is hard to maintain." |
| **decoupled** | /diːˈkʌpəld/ | 解耦的 | "These services are loosely decoupled." |
| **orchestration** | /ˌɔːkɪˈstreɪʃn/ | 编排 | "Kubernetes handles container orchestration." |

### 常用动词
- **scale out/up** - 横向/纵向扩展
  - "We need to scale out to handle the traffic spike."
- **refactor** - 重构
  - "Let's refactor this module for better testability."
- **decouple** - 解耦
  - "We should decouple these two services."
- **migrate** - 迁移
  - "We're migrating from MySQL to PostgreSQL."
- **deprecate** - 废弃
  - "This API will be deprecated in v2.0."

---

## 性能优化 (Performance)

### 性能指标
| 词汇 | 发音 | 含义 | 例句 |
|------|------|------|------|
| **latency** | /ˈleɪtənsi/ | 延迟 | "P99 latency is under 100ms." |
| **throughput** | /ˈθruːpʊt/ | 吞吐量 | "We're getting 10K requests per second throughput." |
| **QPS/TPS** | - | 每秒查询/事务数 | "The system handles 50K QPS." |
| **concurrency** | /kənˈkʌrənsi/ | 并发 | "High concurrency causes lock contention." |
| **contention** | /kənˈtenʃn/ | 争用 | "Database lock contention is the issue." |

### 优化动作
- **optimize** - 优化
  - "We need to optimize the query execution plan."
- **profile** - 性能分析
  - "Let's profile the application to find hotspots."
- **benchmark** - 基准测试
  - "Run a benchmark before and after the change."
- **tune** - 调优
  - "We tuned the JVM heap size."
- **cache** - 缓存
  - "Cache the frequently accessed data."

### 常用表达
- "The bottleneck is in the database layer."
- "We're seeing high CPU utilization."
- "Memory usage spikes during peak hours."
- "This introduces unnecessary overhead."
- "Let's measure before we optimize."

---

## 代码评审 (Code Review)

### 评审动作
| 表达 | 含义 | 使用场景 |
|------|------|----------|
| "LGTM" | Looks Good To Me | 通过评审 |
| "Could you clarify the intent here?" | 请解释意图 | 不理解代码目的 |
| "Consider extracting this into a helper function" | 建议提取函数 | 代码重构建议 |
| "What's the rationale behind this approach?" | 为什么这样做 | 询问设计决策 |
| "Nit: maybe rename this variable" | 小建议：重命名变量 | 非阻塞性建议 |
| "This might be a bug" | 这可能是bug | 发现问题 |
| "Should we add error handling here?" | 是否加错误处理 | 健壮性建议 |

### 常用形容词
- **clean** - 清晰的代码
- **readable** - 可读的
- **maintainable** - 可维护的
- **testable** - 可测试的
- **robust** - 健壮的
- **brittle** - 脆弱的（易出错的）
- **hacky** - 不优雅的临时方案
- **elegant** - 优雅的

### 评审模板
```
## Summary
This PR adds X feature by doing Y.

## Changes
- Added A
- Modified B
- Removed C

## Testing
- Unit tests cover the main logic
- Integration test for edge cases

## Concerns
- Performance impact needs benchmarking
- Should we add more error handling?
```

---

## 会议英语 (Meetings)

### 开场
- "Let's get started." - 开始会议
- "Thanks for joining. Today we'll discuss..." - 介绍主题
- "Let me walk you through the agenda." - 介绍议程

### 讨论中
- "Let me walk you through the architecture." - 介绍架构
- "The trade-off here is between X and Y." - 权衡讨论
- "Scalability-wise, this approach..." - 扩展性讨论
- "From a performance perspective..." - 性能角度
- "Let's circle back to this later." - 暂时搁置
- "Can you elaborate on that?" - 请详细说明
- "I see your point, but..." - 同意但有保留

### 总结
- "Action items from this meeting..." - 会议总结
- "Let's summarize what we've decided." - 总结决定
- "Next steps are..." - 下一步

### 技术演示结构
```
1. Problem Statement - 问题陈述
   "We're facing X challenge because of Y."

2. Current Approach - 当前方案
   "Currently, we're doing A, which has limitations B and C."

3. Proposed Solution - 提议方案
   "I propose we do X, which addresses Y and Z."

4. Trade-offs - 权衡
   "The trade-offs are A vs B, but we gain C."

5. Implementation Plan - 实施计划
   "We'll implement this in three phases..."

6. Q&A - 问答
   "Any questions or concerns?"
```

---

## 故障排查 (Troubleshooting)

### 问题描述
- "We're seeing intermittent failures." - 间歇性故障
- "The issue reproduces under high load." - 高负载下复现
- "It works on my machine but not in production." - 本地正常生产异常
- "The error occurs randomly." - 随机错误

### 排查动作
- **reproduce** - 复现
  - "Can you reproduce the issue consistently?"
- **investigate** - 调查
  - "Let me investigate the root cause."
- **trace** - 追踪
  - "Trace the request through the system."
- **diagnose** - 诊断
  - "Diagnose the performance issue."
- **mitigate** - 缓解
  - "We need a quick mitigation."

### 根因分析
- "The root cause is..." - 根本原因是
- "It turns out that..." - 结果发现
- "After investigation, we found..." - 调查后发现

---

## 发音难点 (Pronunciation Challenges)

### 中国开发者常见发音问题

| 词汇 | 错误发音 | 正确发音 | 技巧 |
|------|----------|----------|------|
| **architecture** | /ˈɑːkɪtektʃə/ | /ˈɑːkɪtektʃər/ | 注意结尾的 /r/ |
| **throughput** | /ˈθruːpʊt/ | /ˈθruːpʊt/ | /θ/ 咬舌尖 |
| **scalability** | /skeɪləˈbɪləti/ | /ˌskeɪləˈbɪləti/ | 重音在第三个音节 |
| **latency** | /ˈleɪtənsi/ | /ˈleɪtənsi/ | 注意 /t/ 和 /n/ 的连读 |

详细发音指导见 [[english-pronunciation-notes]]

---

## 学习建议

### 记忆方法
1. **场景记忆** - 不要背单词表，而是在具体场景中使用
2. **搭配记忆** - 记住常用搭配而非单独的词
3. **输出驱动** - 在代码评审、会议中主动使用新学的表达

### 每日练习
- 阅读一篇技术博客，记录5个新表达
- 用英语写代码注释（哪怕只是简单的）
- 在脑中用英语描述正在做的技术方案

---

## 相关页面

- [[english-learning-resources]] - 学习资源导航
- [[english-pronunciation-notes]] - 发音难点与纠正
- [[english-grammar-patterns]] - 常用语法模式

---

*最后更新: 2026-05-28*
