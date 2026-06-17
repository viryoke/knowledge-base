---
title: 六边形架构（Hexagonal Architecture）项目实践
created: 2026-05-28
updated: 2026-05-28
type: concept
tags: [engineering, exam-prep]
sources: []
confidence: medium
---

# 六边形架构项目实践

## 概述

六边形架构（Hexagonal Architecture），又称端口与适配器架构（Ports and Adapters），由Alistair Cockburn于2005年提出。核心思想：**让应用在被用户、程序、自动化测试或批处理脚本驱动时表现一致，且与最终运行时设备和数据库完全隔离。**

## 核心结构

```d2
direction: right

Driving: {
  label: "入站适配器 (Driving Adapters)"
  HTTP: "HTTP Controller"
  gRPC: "gRPC Handler"
  CLI: "CLI Command"
}

Domain: {
  label: "核心域 (Domain)"
  DP: {
    label: "入站端口 (Driving Port)"
    shape: interface
  }
  BL: "业务逻辑 (Business Logic)"
  VP: {
    label: "出站端口 (Driven Port)"
    shape: interface
  }
  DP -> BL -> VP
}

Driven: {
  label: "出站适配器 (Driven Adapters)"
  MySQL: {
    label: "MySQL Repository"
    shape: cylinder
  }
  Redis: {
    label: "Redis Repository"
    shape: cylinder
  }
  Kafka: "Kafka Producer"
}

Driving.HTTP -> Domain.DP
Driving.gRPC -> Domain.DP
Driving.CLI -> Domain.DP
Domain.VP -> Driven.MySQL
Domain.VP -> Driven.Redis
Domain.VP -> Driven.Kafka
```

> 上图展示六边形架构的三层结构：入站适配器通过入站端口驱动核心业务逻辑，核心业务逻辑通过出站端口调用出站适配器。依赖方向始终从外向内。

三个核心概念：

**1. 端口（Port）：** 核心业务域对外暴露的接口契约
- **入站端口（Driving Port）**：定义"谁可以调用我"，如 `OrderService` 接口
- **出站端口（Driven Port）**：定义"我需要谁"，如 `OrderRepository` 接口

**2. 适配器（Adapter）：** 端口的具体实现
- **入站适配器（Driving Adapter）**：HTTP Controller、gRPC Handler、CLI Command
- **出站适配器（Driven Adapter）**：MySQL实现、Redis实现、Kafka Producer

**3. 核心域（Domain）：** 纯业务逻辑，不依赖任何框架和基础设施

## 依赖规则

```d2
direction: right
Adapter: "适配器"
Port: {
  label: "端口"
  shape: interface
}
Domain: "核心域"
Adapter -> Port -> Domain
```

> 外层依赖内层，内层不知道外层存在。

这与[[clean-architecture|整洁架构]]和[[onion-architecture|洋葱架构]]共享同一核心原则：**依赖指向内部**。

## 与传统分层架构的区别

**传统三层架构（Controller → Service → DAO）：**
- Service 层直接依赖 DAO 实现（硬耦合）
- 换数据库需要改 Service 代码
- 测试需要mock具体基础设施

**六边形架构：**
- Service 只依赖 Repository 接口（出站端口）
- 换数据库只需替换适配器实现
- 测试可以用内存适配器，零外部依赖

## 项目实践示例

以你在华为云的微服务经验为例：

```java
// 1. 核心域 —— 纯业务逻辑，零框架依赖
class Order {
    String orderId;
    OrderStatus status;
    BigDecimal totalAmount;
    
    void confirm() {
        if (status != OrderStatus.PENDING) 
            throw new IllegalStateException();
        this.status = OrderStatus.CONFIRMED;
    }
}

// 2. 出站端口 —— 核心域定义"我需要什么能力"
interface OrderRepository {
    void save(Order order);
    Optional<Order> findById(String id);
}

// 3. 入站端口 —— 定义"对外提供什么能力"
interface CreateOrderUseCase {
    Order createOrder(CreateOrderCommand cmd);
}

// 4. 入站适配器 —— HTTP层
@RestController
class OrderController {
    private final CreateOrderUseCase useCase;
    
    @PostMapping("/orders")
    OrderResponse create(@RequestBody CreateOrderRequest req) {
        return OrderResponse.from(
            useCase.createOrder(req.toCommand())
        );
    }
}

// 5. 出站适配器 —— 持久化实现（可替换）
class MysqlOrderRepository implements OrderRepository {
    private final JdbcTemplate jdbc;
    // MySQL 具体实现...
}

class RedisOrderRepository implements OrderRepository {
    // Redis 具体实现...
}
```

## 适用场景

- 业务逻辑复杂且频繁变化的系统
- 需要支持多种接入方式（HTTP/gRPC/消息队列）的微服务
- 需要高测试覆盖率的系统（核心域可独立测试）
- 技术栈可能演进的项目（数据库/消息中间件可能更换）

## 不适用场景

- 简单CRUD应用（过度设计）
- 原型/快速验证阶段
- 团队对DDD概念不熟悉时（学习曲线）

## 与其他架构模式的关系

- [[clean-architecture]] — Robert Martin的整洁架构，本质相同
- [[onion-architecture]] — Jeffrey Palermo的洋葱架构，本质相同
- [[ddd-tactical-patterns]] — 六边形架构是DDD战术设计的天然载体
- [[microservice-architecture]] — 每个微服务内部可用六边形架构组织

## 备考提示

软考可能考的角度：
- 六边形架构的核心原则（依赖倒置、端口与适配器分离）
- 与MVC/三层架构的对比
- 给出一个场景，画出端口和适配器的划分
- 在微服务架构中如何应用（每个服务一个六边形）
- 你实际项目中的应用案例（论文素材）

## 与你华为经验的关联

你在华为云做的微服务开发（SMC/OSC/IEF），如果用六边形架构重构：
- 核心域：服务管理的业务规则
- 入站端口：API接口定义
- 入站适配器：REST Controller / gRPC Handler
- 出站端口：Kubernetes操作接口、数据库接口
- 出站适配器：K8s Client实现、GaussDB实现、Redis实现

这样架构的好处：K8s升级或换底座，只改适配器，核心业务逻辑不动。
