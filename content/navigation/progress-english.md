---
title: 英语学习进度
created: 2026-05-29
updated: 2026-05-29
type: concept
tags: [english]
---

# 英语学习进度 (English Learning Progress)

> 系统化的技术英语学习路径，从发音基础到口语输出，循序渐进。

## 学习路径总览

```
Step 1: 发音基础 → Step 2: 词汇积累 → Step 3: 语法模式 → Step 4: 听力实战 → Step 5: 口语输出
```

---

## Step 1: 发音基础 → [[english-pronunciation-notes]]

> 目标：纠正中国学习者常见发音问题，建立正确的发音习惯

- [ ] /θ/ /ð/ 音练习
  - 舌尖轻放上下齿间，送气/震动声带
  - 练习句: "The throughput is three times higher."
  - 技术场景: "The thread pool has three active threads."
- [ ] /r/-/l/ 区分
  - /r/ 舌尖卷起不触上颚，/l/ 舌尖抵上齿龈
  - 练习句: "Really read the right light."
  - 技术场景: "Load the library and read the documentation."
- [ ] 词尾辅音处理
  - 有意识发出词尾辅音，不吞音
  - 练习: architecture /ˈɑːkɪtektʃər/, server /ˈsɜːrvər/, request /rɪˈkwest/
- [ ] 元音长度区分
  - ship/sheep, bit/beat, pull/pool, stack/stark
  - 练习句: "A bit of data in the beat."
- [ ] 连读弱读规则
  - 连读: check it → /ˈtʃekɪt/, send an email → /sendəˈneɪmeɪl/
  - 弱读: and → /ən/, to → /tə/, for → /fər/
- [ ] 技术场景发音练习
  - 用影子跟读法 (Shadowing) 练习技术播客片段
  - 每天录1分钟技术描述，对比原音

---

## Step 2: 词汇积累 → [[english-vocab-tech]]

> 目标：掌握技术工作场景高频词汇和搭配，按场景分组记忆

- [ ] 系统架构词汇 (30词)
  - scalability, latency, throughput, bottleneck, trade-off, overhead
  - microservice, monolith, decoupled, orchestration
  - scale out/up, refactor, decouple, migrate, deprecate
- [ ] 性能优化词汇 (25词)
  - latency, throughput, QPS/TPS, concurrency, contention
  - optimize, profile, benchmark, tune, cache
  - 常用表达: "The bottleneck is in the database layer."
- [ ] 代码评审词汇 (20词)
  - LGTM, "Could you clarify...", "Consider extracting..."
  - clean, readable, maintainable, testable, robust, brittle, hacky, elegant
  - 评审模板: Summary / Changes / Testing / Concerns
- [ ] 会议英语表达 (20词)
  - 开场: "Let's get started.", "Let me walk you through the agenda."
  - 讨论: "The trade-off here is...", "From a performance perspective..."
  - 总结: "Action items from this meeting...", "Next steps are..."
- [ ] 故障排查词汇 (15词)
  - reproduce, investigate, trace, diagnose, mitigate
  - "The root cause is...", "It turns out that..."
  - "We're seeing intermittent failures."

---

## Step 3: 语法模式 → [[english-grammar-patterns]]

> 目标：掌握技术写作和沟通中最常用的语法模式，减少中式英语

- [ ] 时态（5种核心时态）
  - 一般现在时: 描述系统行为 → "The service handles 10K requests."
  - 现在完成时: 已完成动作 → "We have migrated to PostgreSQL."
  - 一般过去时: 已发生的操作 → "We deployed the fix yesterday."
  - 现在进行时: 正在排查 → "We are investigating the root cause."
  - 过去完成时: 过去之前完成 → "The service had crashed before the alert fired."
- [ ] 冠词用法
  - a/an: 泛指首次提及 → "We added a cache layer."
  - the: 特指已知事物 → "The cache layer reduced latency."
  - 零冠词: 不可数/复数泛指 → "Memory is limited."
  - 专有名词不加 the: Redis, Kubernetes, Docker
- [ ] 介词搭配
  - in production / on the server / at scale / migrate to / depend on
  - 易错: discuss 不加 about, impact 搭配 on, it depends on
- [ ] 被动语态
  - 技术文档大量使用: "Requests are routed through the gateway."
  - 常见错误: "The data is store" → "The data is stored"
- [ ] 条件句
  - 零条件句: "If CPU exceeds 80%, the autoscaler triggers."
  - 第一条件句: "If we add caching, latency will decrease."
  - 第二条件句: "If we used gRPC, we would get better performance."
  - 第三条件句 (事故复盘): "If we had monitored the disk, we would have prevented the outage."
- [ ] 技术写作句型
  - 定语从句: "A load balancer is a service that distributes traffic."
  - 分词短语: "Data is sent using Protocol Buffers for efficiency."
  - 名词化: "Query optimization reduced latency."
  - Code Review 建议: "Consider adding error handling here."

---

## Step 4: 听力实战

> 目标：适应真实语速的英语技术内容，提升听力理解力

- [ ] 选一个英语播客，每天听15分钟
  - 推荐起步: 6 Minute English (BBC) — 6分钟，有 transcript
  - 进阶: Software Engineering Daily — 纯技术访谈
  - 高级: Lex Fridman Podcast — AI/科技深度对话
  - 方法: 第一遍泛听理解大意 → 第二遍精听记笔记 → 第三遍跟读
- [ ] 技术 YouTube 频道跟听
  - Fireship: 100秒系列，技术快讯，字幕清晰
  - Hussein Nasser: 后端工程深度讲解
  - TED Talks: 演讲结构示范，有完整 transcript
  - 方法: 看视频 → 关字幕再听 → 打开字幕核对 → 跟读模仿

---

## Step 5: 口语输出

> 目标：从被动输入转为主动输出，建立英语口语习惯

- [ ] 每天用英语自言自语3分钟技术话题
  - 话题参考: 今天做的技术方案、代码评审要点、系统架构决策
  - 方法: 先用中文想好要点 → 用英语说出来 → 录音回听
  - 模板: "Today I worked on... The challenge was... I decided to... because..."
  - 进阶: 尝试用英语做技术方案 self-review

---

## 学习资源

详见 → [[english-learning-resources]]

### 推荐工具速查
| 工具 | 用途 |
|------|------|
| ELSA Speak | AI纠音，即时发音反馈 |
| Anki | 间隔重复记忆词汇 |
| YouGlish | 查单词真实语境发音 |
| 每日英语听力 | 播客聚合，变速播放 |
| Rachel's English | 系统发音教程 |

### 每日时间分配建议
```
早上通勤 (15min): 播客听力
午休 (10min):     发音视频 + 练习
晚上通勤 (15min): 技术播客/YouTube
睡前 (10min):     Anki 词汇复习
```

---

## 总进度

| Step | 主题 | 完成项 | 总项 | 进度 |
|------|------|--------|------|------|
| 1 | 发音基础 | 0 | 6 | ░░░░░░░░░░ 0% |
| 2 | 词汇积累 | 0 | 5 | ░░░░░░░░░░ 0% |
| 3 | 语法模式 | 0 | 6 | ░░░░░░░░░░ 0% |
| 4 | 听力实战 | 0 | 2 | ░░░░░░░░░░ 0% |
| 5 | 口语输出 | 0 | 1 | ░░░░░░░░░░ 0% |
| **合计** | | **0** | **20** | **░░░░░░░░░░ 0%** |

> 每完成一项，点击前方的复选框 ☑ 即可标记完成，并更新总进度表。

---

## 相关页面

- [[english-learning-resources]] - 学习资源导航
- [[english-vocab-tech]] - 技术英语词汇
- [[english-pronunciation-notes]] - 发音难点与纠正
- [[english-grammar-patterns]] - 常用语法模式

---

*最后更新: 2026-05-29*
