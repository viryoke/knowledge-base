---
title: Nix 表达式语言
created: 2026-06-01
updated: 2026-06-01
type: concept
tags: [linux]
sources: []
confidence: high
---

## 定义

Nix 是一种**函数式、惰性求值、动态类型**的编程语言，专为包管理设计。它用于描述软件包的构建过程和系统配置。

核心特征：
- **函数式**：无副作用，相同输入产生相同输出
- **惰性求值**：只在需要时计算表达式
- **动态类型**：类型在运行时检查
- **声明式**：描述"是什么"而非"怎么做"

---

## 基础语法

### 1. 基本类型

```nix
# 数字
42
3.14

# 字符串
"hello world"
''
  多行字符串
  支持换行
''

# 布尔值
true
false

# null
null

# 路径（Nix 特有）
./file.txt
/nix/store
~/Documents

# 列表
[ 1 2 3 "hello" ./file.txt ]

# 属性集（Attribute Set）— 类似字典/对象
{
  name = "vim";
  version = "9.0";
  src = ./vim-src;
}
```

### 2. 字符串插值

```nix
let
  name = "world";
  version = "1.0";
in
"hello ${name}, version ${version}"
# 结果: "hello world, version 1.0"

# 在属性名中插值
{
  "package-${name}" = value;
}
```
> let...in可以看成是一个变量声明模块吗?
### 3. let 表达式（局部变量）

```nix
let
  x = 10;
  y = 20;
  sum = x + y;
in
sum * 2
# 结果: 60
```

### 4. with 表达式（导入属性集到作用域）

```nix
let
  pkgs = import <nixpkgs> {};
in
with pkgs; [
  vim
  git
  curl
]
# 等价于: [ pkgs.vim pkgs.git pkgs.curl ]
```
> with后面必然跟着一个数组吗?
### 5. 条件表达式

```nix
# if-then-else
let
  x = 10;
in
if x > 5 then "big" else "small"

# 多条件
if x > 10 then "huge"
else if x > 5 then "big"
else "small"
```

### 6. 函数

```nix
# 单参数函数
x: x + 1

# 多参数函数（柯里化）
x: y: x + y

# 属性集参数（解构）
{ name, version }: "${name}-${version}"

# 带默认值的参数
{ name, version ? "1.0" }: "${name}-${version}"

# 剩余参数（rest args）
{ name, version, ... }@args: args

# 调用函数
(x: x + 1) 5          # 结果: 6
(x: y: x + y) 3 4     # 结果: 7
({ name }: name) { name = "vim"; }  # 结果: "vim"
```
> 这里有点看不懂了
---

## 高级特性

### 1. 递归属性集（rec）

```nix
rec {
  x = 10;
  y = x + 5;      # 可以引用同级的 x
  z = y * 2;      # 可以引用同级的 y
}
# 结果: { x = 10; y = 15; z = 30; }
```

### 2. 继承（inherit）

```nix
let
  x = 10;
  y = 20;
in
{
  inherit x y;           # 等价于: x = x; y = y;
  z = x + y;
}

# 从属性集继承
let
  pkgs = import <nixpkgs> {};
in
{
  inherit (pkgs) vim git curl;
  # 等价于: vim = pkgs.vim; git = pkgs.git; curl = pkgs.curl;
}
```

### 3. 属性访问

```nix
let
  config = {
    user = {
      name = "viryoke";
      home = "/home/viryoke";
    };
  };
in
config.user.name          # 结果: "viryoke"

# 带默认值的访问（使用 or）
config.user.email or "unknown@example.com"
```

### 4. 列表操作

```nix
let
  list = [ 1 2 3 4 5 ];
in
{
  # 内置函数
  head = builtins.head list;        # 1
  tail = builtins.tail list;        # [ 2 3 4 5 ]
  length = builtins.length list;    # 5
  elemAt = builtins.elemAt list 2;  # 3

  # 列表推导（map）
  doubled = map (x: x * 2) list;    # [ 2 4 6 8 10 ]

  # 过滤
  evens = builtins.filter (x: x % 2 == 0) list;  # [ 2 4 ]

  # 拼接
  concat = list ++ [ 6 7 ];         # [ 1 2 3 4 5 6 7 ]
}
```

### 5. 属性集操作

```nix
let
  set1 = { a = 1; b = 2; };
  set2 = { b = 3; c = 4; };
in
{
  # 合并（右侧覆盖左侧）
  merged = set1 // set2;            # { a = 1; b = 3; c = 4; }

  # 删除属性
  removed = builtins.removeAttrs set1 [ "b" ];  # { a = 1; }

  # 检查属性是否存在
  hasA = builtins.hasAttr "a" set1; # true

  # 获取所有属性名
  names = builtins.attrNames set1;  # [ "a" "b" ]
}
```

---

## 模块系统（Module System）

NixOS 配置基于**模块系统**，每个模块是一个函数，返回属性集。

### 模块结构

```nix
{ config, pkgs, lib, ... }:  # 标准参数

{
  # 导入其他模块
  imports = [
    ./other-module.nix
  ];

  # 配置选项（声明式）
  services.nginx = {
    enable = true;
    virtualHosts."example.com" = {
      root = "/var/www";
    };
  };

  # 自定义选项（定义新选项）
  options = {
    myOption = lib.mkOption {
      type = lib.types.str;
      default = "default value";
      description = "My custom option";
    };
  };

  # 条件配置
  config = lib.mkIf config.services.nginx.enable {
    # 只在 nginx 启用时生效
    networking.firewall.allowedTCPPorts = [ 80 443 ];
  };
}
```
> 这里看不懂了
### 常用 lib 函数

```nix
# 条件配置
lib.mkIf condition value
lib.mkMerge [ value1 value2 ]
lib.mkForce value          # 强制覆盖

# 类型检查
lib.types.str
lib.types.int
lib.types.bool
lib.types.listOf lib.types.str
lib.types.attrsOf lib.types.int

# 默认值
lib.mkDefault value
lib.mkOverride priority value

# 字符串操作
lib.strings.concatStringsSep ", " [ "a" "b" "c" ]
lib.strings.removePrefix "prefix" "prefix-string"
```
> 有点看不懂了
---

## 常见模式

### 1. 配置文件模板

```nix
# 典型的 NixOS 模块
{ config, pkgs, lib, ... }:

let
  cfg = config.myModule;
in
{
  options.myModule = {
    enable = lib.mkEnableOption "my module";
    port = lib.mkOption {
      type = lib.types.port;
      default = 8080;
    };
  };

  config = lib.mkIf cfg.enable {
    systemd.services.myService = {
      description = "My Service";
      wantedBy = [ "multi-user.target" ];
      serviceConfig = {
        ExecStart = "${pkgs.myPackage}/bin/myService --port ${toString cfg.port}";
      };
    };
  };
}
```

### 2. 覆盖包（Overlay）

```nix
# 修改或添加包
self: super: {
  # 覆盖现有包
  vim = super.vim.overrideAttrs (oldAttrs: {
    buildInputs = oldAttrs.buildInputs ++ [ super.python3 ];
  });

  # 添加新包
  myPackage = super.callPackage ./my-package.nix {};
}
```

### 3. 导入 nixpkgs

```nix
# 传统方式
let
  pkgs = import <nixpkgs> {};
in
pkgs.vim

# Flakes 方式（推荐）
# 在 flake.nix 中定义，通过参数传入
{ pkgs, ... }:
{
  environment.systemPackages = [ pkgs.vim ];
}
```

---

## 调试技巧

### 1. 使用 nix repl

```bash
nix repl
```

```nix
# 在 repl 中
nix-repl> 1 + 2
3

nix-repl> let x = 10; in x * 2
20

nix-repl> :p { a = 1; b = 2; }
{ a = 1; b = 2; }

nix-repl> :t "hello"
"a string"

nix-repl> pkgs = import <nixpkgs> {}
nix-repl> pkgs.vim.name
"vim-9.0"
```

### 2. 使用 builtins.trace

```nix
let
  x = builtins.trace "x = ${toString 10}" 10;
in
x + 5
# 输出: trace: x = 10
# 结果: 15
```

### 3. 查看求值结果

```bash
nix-instantiate --eval -E '1 + 2'
nix-instantiate --eval --strict -E '{ a = 1; b = 2; }'
```

---

## 常见陷阱

### 1. 惰性求值陷阱

```nix
# 错误：无限递归
let
  x = x + 1;
in
x

# 正确：使用 let 的递归定义
let
  x = 1;
  y = x + 1;
in
y
```

### 2. 属性集合并顺序

```nix
# 右侧覆盖左侧
{ a = 1; b = 2; } // { b = 3; c = 4; }
# 结果: { a = 1; b = 3; c = 4; }

# 使用 lib.mkMerge 可以累积
lib.mkMerge [
  { a = 1; }
  { a = 2; }
]
# 结果取决于选项类型（listOf 会累积，int 会报错）
```

### 3. 字符串 vs 路径

```nix
# 路径（会被复制到 nix store）
./file.txt

# 字符串（不会复制）
"./file.txt"

# 在配置中通常使用字符串
home.file.".bashrc".text = ''
  alias ll='ls -la'
'';
```

---

## 相关概念

- [[nixos-overview]] — NixOS 核心理念与架构
- [[nixos-flakes]] — Flakes 机制详解
- [[nixos-home-manager]] — Home Manager 用户配置

---

## 参考资源

- [Nix Pills](https://nixos.org/guides/nix-pills/) — 官方入门教程
- [Nix Language Reference](https://nixos.org/manual/nix/stable/language/) — 语言参考
- [NixOS Module System](https://nixos.org/manual/nixos/stable/#sec-writing-modules) — 模块系统
