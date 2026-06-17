---
title: MLOps Zoomcamp 2024
created: 2026-05-28
updated: 2026-05-28
type: concept
tags: [mlops, engineering]
sources: ["https://github.com/DataTalksClub/mlops-zoomcamp", "https://www.youtube.com/playlist?list=PL3MmuxUbc_hJD0AVR2Un_GSVGMpotGM2t"]
confidence: high
---

# MLOps Zoomcamp 2024

## Overview

**DataTalksClub** 的免费开源 MLOps 训练营，2024 年第 3 版。社区评价最高的 MLOps 实战课程之一。

- **时长**: 8 周 + 2 周项目
- **难度**: 中级（需要 Python 和基础 ML 知识）
- **语言**: 英语（提供字幕）
- **成本**: 完全免费
- **GitHub**: [GitHub](https://github.com/DataTalksClub/mlops-zoomcamp)

## Why This Course

### 适合你的原因

1. **工程导向**: 你是资深工程师，这个课程强调工程实践而非理论
2. **生产级**: 聚焦将模型部署到生产环境，这正是你的目标
3. **工具现代化**: 使用 Mage、MLflow、AWS、Kubernetes 等现代工具栈
4. **项目驱动**: 每周有作业，最终有完整项目，适合构建作品集
5. **社区活跃**: DataTalksClub 社区庞大，Slack 群有数千成员

### 社区评价

- Reddit r/MachineLearning: "最好的免费 MLOps 课程，没有之一"
- 超过 15,000 名学员完成
- 多位学员因此获得 MLOps 相关工作

## Curriculum Structure

| 模块 | 主题 | 核心内容 | 视频 | 字幕 |
|------|------|---------|------|------|
| Module 1 | Introduction to MLOps (Week 1) | MLOps成熟度模型、ML生命周期、工具概览 | [▶️](https://www.youtube.com/playlist?list=PL3MmuxUbc_hJD0AVR2Un_GSVGMpotGM2t) | - |
| Module 2 | Experiment Tracking (Week 2) | MLflow实验追踪、模型注册、超参数管理、实验对比 | [▶️](https://www.youtube.com/playlist?list=PL3MmuxUbc_hJD0AVR2Un_GSVGMpotGM2t) | - |
| Module 3 | Workflow Orchestration (Week 3-4) | Mage数据管道编排、数据准备管道、模型训练管道、触发器与调度 | [▶️](https://www.youtube.com/playlist?list=PL3MmuxUbc_hJD0AVR2Un_GSVGMpotGM2t) | [[raw/transcripts/mlops-zoomcamp/MLOps Zoomcamp 3.1 - Machine Learning Pipelines\|📝]] (25个文件) |
| Module 4 | Model Deployment (Week 5-6) | 模型服务化策略、AWS ECS容器化部署、CI/CD管道、监控与可观测性 | [▶️](https://www.youtube.com/playlist?list=PL3MmuxUbc_hJD0AVR2Un_GSVGMpotGM2t) | - |
| Module 5 | Model Monitoring (Week 7) | 数据漂移检测、模型性能监控、告警设置、可视化仪表板 | [▶️](https://www.youtube.com/playlist?list=PL3MmuxUbc_hJD0AVR2Un_GSVGMpotGM2t) | - |
| Module 6 | Best Practices (Week 8) | 代码质量、测试策略、文档编写、MLOps成熟度评估 | [▶️](https://www.youtube.com/playlist?list=PL3MmuxUbc_hJD0AVR2Un_GSVGMpotGM2t) | - |
| Capstone | Capstone Project (Week 9-10) | 端到端ML项目、从数据到生产部署、社区评审与反馈 | [▶️](https://www.youtube.com/playlist?list=PL3MmuxUbc_hJD0AVR2Un_GSVGMpotGM2t) | - |

## Technology Stack

| Category | Tools |
|----------|-------|
| **Experiment Tracking** | MLflow |
| **Workflow Orchestration** | Mage |
| **Model Registry** | MLflow Model Registry |
| **Containerization** | Docker |
| **Deployment** | AWS ECS, Kubernetes (optional) |
| **CI/CD** | GitHub Actions |
| **Monitoring** | Custom dashboards, Evidently AI |
| **Cloud** | AWS (free tier sufficient) |

## Learning Path

### Prerequisites
- Python 编程（中级）
- 基础机器学习概念（线性回归、分类）
- Git 基础
- Docker 基础（可选，课程会教）

### Recommended Sequence

**Week 1-2: 基础设置**
```
1. 安装 Python, Docker, Git
2. 克隆 GitHub 仓库
3. 设置 AWS 账号（免费层）
4. 安装 MLflow, Mage
5. 完成 Module 1 视频 + 作业
6. 完成 Module 2 视频 + 作业
```

**Week 3-4: 管道构建**
```
1. 学习 Mage 编排
2. 构建数据准备管道
3. 构建训练管道
4. 实现触发器和调度
5. 完成 Module 3-4 视频 + 作业
```

**Week 5-6: 部署与监控**
```
1. 容器化模型服务
2. 部署到 AWS ECS
3. 设置 CI/CD 管道
4. 实现监控仪表板
5. 完成 Module 5-6 视频 + 作业
```

**Week 7-8: 项目实战**
```
1. 选择 Capstone 项目主题
2. 端到端实现
3. 部署到生产
4. 准备演示
5. 提交社区评审
```

## Key Takeaways

### 你将学到的

1. **MLOps 思维**: 如何将 ML 项目视为工程项目
2. **实验追踪**: 如何系统化管理 ML 实验
3. **管道编排**: 如何自动化 ML 工作流
4. **生产部署**: 如何将模型安全部署到生产
5. **监控告警**: 如何检测模型退化并自动响应
6. **工程实践**: 如何编写可维护的 ML 代码

### 你将构建的

- 完整的 ML 管道（数据→训练→部署→监控）
- 实验追踪系统
- CI/CD 部署管道
- 监控仪表板
- 生产级 ML 项目（可用于作品集）

## Integration with Your Goals

### Phase 4: 生产化能力

这个课程直接支撑你的 **Phase 4: 生产化能力** 目标：

1. **模型服务化** (Week 5-6)
   - 容器化部署
   - API 设计
   - 负载均衡

2. **MLOps 基础** (Week 2-4)
   - 实验追踪
   - 模型注册
   - 管道编排

3. **CI/CD for ML** (Week 6)
   - 自动化训练
   - 自动化部署
   - 模型验证

4. **性能优化** (贯穿全程)
   - 监控模型性能
   - 检测数据漂移
   - 自动重训练

### 与你的背景契合

| 你的优势 | 如何帮助学习 |
|---------|-------------|
| 12 年工程经验 | 快速理解 MLOps 工程实践 |
| K8s 经验 | 理解容器化部署 |
| CI/CD 经验 | 理解自动化管道 |
| AWS 经验 | 快速上手 AWS 服务 |
| Python 经验 | 专注于 ML 部分而非编程 |

## Study Tips

### 学习策略

1. **跟着做**: 每个视频都要动手实践，不要只看
2. **做笔记**: 记录关键概念和踩过的坑
3. **提交作业**: 即使不完美也要提交，获得反馈
4. **参与社区**: 在 Slack 群提问和帮助他人
5. **构建项目**: Capstone 项目是学习的核心

### 时间投入

- **每周**: 10-15 小时（视频 3-4 小时 + 实践 7-11 小时）
- **总计**: 80-120 小时（8 周）
- **建议**: 每天 2 小时，周末加量

### 常见问题

**Q: 需要付费的 AWS 服务吗？**
A: 不需要，免费层足够。课程会教你如何优化成本。

**Q: 没有 ML 背景可以学吗？**
A: 需要基础 ML 概念。建议先完成 Phase 1 数学补课。

**Q: 课程结束后还能访问材料吗？**
A: 是的，所有材料永久免费开放。

## Resources

### Primary
- **课程主页**: [GitHub](https://github.com/DataTalksClub/mlops-zoomcamp)
- **YouTube 播放列表**: [YouTube](https://www.youtube.com/playlist?list=PL3MmuxUbc_hJD0AVR2Un_GSVGMpotGM2t)
- **Slack 社区**: [datatalks.club/slack](https://datatalks.club/slack.html)

### Supplementary
- **MLflow 文档**: [mlflow.org](https://mlflow.org/docs/latest/index.html)
- **Mage 文档**: [docs.mage.ai](https://docs.mage.ai/)
- **AWS 免费层**: [aws.amazon.com/free](https://aws.amazon.com/free/)

### Community
- **DataTalksClub Slack**: #course-mlops-zoomcamp
- **Reddit**: r/MachineLearning
- **YouTube 评论**: 与其他学员交流

## Assessment

### 自我检查点

完成以下检查，确认掌握核心概念：

- [ ] 能够解释 MLOps 成熟度模型的各个级别
- [ ] 能够使用 MLflow 追踪实验和管理模型
- [ ] 能够构建 Mage 数据管道
- [ ] 能够将模型容器化并部署到云
- [ ] 能够设置 CI/CD 管道
- [ ] 能够监控模型性能并设置告警
- [ ] 能够完成端到端 ML 项目

### 项目评估

完成 Capstone 项目后，问自己：
1. 我的项目可以自动化运行吗？
2. 如果数据变化，模型会自动重训练吗？
3. 如果模型性能下降，我会收到告警吗？
4. 我可以向面试官清晰解释整个系统吗？

如果都能回答"是"，你已经掌握了 MLOps 基础。

## Related Concepts

- [[ai-learning-plan]] - AI 学习总体计划
- [[llm-learning-path]] - LLM 学习路径（MLOps 概念适用）
- [[karpathy-nn-zero-to-hero]] - 深度学习基础（前置知识）

## Tags

#mlops #production #engineering #deployment #course #free #hands-on

## Raw Materials

> Module 3 字幕（25个文件）已嵌入课程表格中
