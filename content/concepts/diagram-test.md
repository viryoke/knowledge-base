---
title: 图表渲染测试
created: 2026-06-17
updated: 2026-06-17
type: concept
tags: [test, diagram]
confidence: high
---

# 图表渲染测试页

测试各种图表格式在 Quartz 中的渲染效果。

## Mermaid 流程图

```mermaid
graph TD
    A[开始] --> B{是否有数据?}
    B -->|是| C[处理数据]
    B -->|否| D[返回空结果]
    C --> E[格式化输出]
    E --> F[结束]
    D --> F
```

## Mermaid 时序图

```mermaid
sequenceDiagram
    participant U as 用户
    participant S as 服务器
    participant D as 数据库
    U->>S: 发送请求
    S->>D: 查询数据
    D-->>S: 返回结果
    S-->>U: 响应数据
```

## ASCII 字符图

```ascii
┌─────────────────────────────────────────────────────────────┐
│                    RAG 系统架构                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │  用户    │───▶│  检索器  │───▶│ 向量数据库│              │
│  │  查询    │    │ Retriever│    │  Embeddings│             │
│  └──────────┘    └──────────┘    └──────────┘              │
│       │               │                  │                  │
│       │               ▼                  ▼                  │
│       │         ┌──────────┐    ┌──────────┐              │
│       │         │  重排序  │    │  文档块   │              │
│       │         │ Reranker │    │  Chunks  │              │
│       │         └──────────┘    └──────────┘              │
│       │               │                                    │
│       │               ▼                                    │
│       │         ┌──────────┐                               │
│       └────────▶│   LLM    │──▶ 生成回答                   │
│                 │  Generator│                              │
│                 └──────────┘                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## PlantUML 类图

```plantuml
@startuml
class Transformer {
  +encoder: Encoder
  +decoder: Decoder
  +forward(input): output
}

class Encoder {
  +layers: Layer[]
  +embeddings: Embedding
}

class Decoder {
  +layers: Layer[]
  +embeddings: Embedding
}

class Attention {
  +numHeads: int
  +headDim: int
  +forward(q, k, v): output
}

Transformer *-- Encoder
Transformer *-- Decoder
Encoder o-- Attention
Decoder o-- Attention
@enduml
```

## GraphViz (DOT) 图

```dot
digraph G {
    rankdir=LR;
    node [shape=box, style="rounded,filled", fillcolor="#f0f0f0"];
    
    Input [label="输入文本", fillcolor="#e1f5fe"];
    Tokenizer [label="分词器"];
    Embedding [label="嵌入层"];
    Transformer [label="Transformer\n编码器", fillcolor="#fff3e0"];
    Pooling [label="池化层"];
    Output [label="向量输出", fillcolor="#e8f5e9"];
    
    Input -> Tokenizer -> Embedding -> Transformer -> Pooling -> Output;
}
```

## 简单文本图

```text-diagram
    ┌─────┐     ┌─────┐     ┌─────┐
    │  A  │────▶│  B  │────▶│  C  │
    └─────┘     └─────┘     └─────┘
       │                       │
       │         ┌─────┐       │
       └────────▶│  D  │◀──────┘
                 └─────┘
```
