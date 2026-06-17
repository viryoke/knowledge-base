---
title: Brain-Computer Interface (BCI)
created: 2026-06-02
updated: 2026-06-02
type: concept
tags: [ml, engineering, resource]
sources: ["https://www.technologyreview.com/2026/06/01/1138133/china-world-first-brain-chip/"]
confidence: medium
---

## 定义

Brain-Computer Interface（脑机接口）是一种直接在大脑与外部设备之间建立通信通道的技术。侵入式 BCI 通过手术将电极植入大脑皮层，采集高分精度神经信号，用于控制外部设备（如机械臂、计算机光标、轮椅等）。

## 核心技术

### 信号采集方式
- **侵入式（Invasive）**: 电极直接接触大脑皮层，信号精度最高，但需要手术
- **半侵入式（Semi-invasive）**: 电极放置在大脑表面（如硬膜外/硬膜下），精度中等
- **非侵入式（Non-invasive）**: 如 EEG 脑电帽，精度最低但最安全

### 工作流程
```
神经信号 → 电极采集 → 信号预处理 → 特征提取 → 解码算法 → 设备控制
```

### 关键技术挑战
- **生物相容性**: 植入材料不能引起免疫排斥或组织损伤
- **长期稳定性**: 电极在大脑中的长期工作可靠性
- **信号解码**: 从嘈杂的神经信号中准确提取意图
- **双向通信**: 不仅读取大脑信号，还能向大脑传递反馈信息

## 2026 年 6 月进展

### 中国批准全球首个侵入式 BCI 芯片临床应用
MIT Technology Review 报道，中国已批准全球首个侵入式脑机接口芯片的临床应用。报道详细描述了一位 39 岁患者董辉的案例：

- 六年前因车祸导致颈部以下瘫痪
- 植入脑机芯片后，尝试重新握笔写字
- 芯片采集大脑运动皮层信号，解码为控制指令
- 这是 BCI 从实验室研究走向临床医疗的重要里程碑

**意义**: 这标志着侵入式 BCI 技术正式进入临床验证阶段，为全球数百万瘫痪患者带来了新的康复希望。同时也引发了关于脑数据隐私、神经伦理等深层问题的讨论。

## 相关概念

- [[ai-agent]] — BCI 的解码算法越来越多地使用 AI Agent 架构，将神经信号解读视为一个"意图理解"问题
- [[neural-network]] — 深度学习在 BCI 信号解码中的应用日益广泛
- [[reinforcement-learning]] — 强化学习用于优化 BCI 的个性化适配

## 主要玩家

- **Neuralink** (美国): Elon Musk 创办，已获得 FDA 批准进行人体试验
- **清华大学/博睿康** (中国): 半侵入式 BCI "NEO" 系统
- **量坤科技** (中国): 量子计算 + BCI 交叉方向
- **Blackrock Neurotech** (美国): 侵入式 BCI 硬件供应商

## 来源

- [China has approved the world's first invasive brain-computer chip](https://www.technologyreview.com/2026/06/01/1138133/china-world-first-brain-chip/) — MIT Technology Review, 2026-06-01
