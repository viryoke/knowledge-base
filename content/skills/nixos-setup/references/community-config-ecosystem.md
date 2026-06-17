# NixOS 社区配置方案调研（2025-2026）

## 主流方案

### 1. nix-starter-configs（Misterio77）⭐ 2.1k+
- **社区公认最佳起点**，Reddit/博客反复推荐
- 两个变体：minimal（纯 NixOS）和 standard（NixOS + home-manager）
- 基于 flakes，文档教学式
- 用户当前已使用 standard 模板

### 2. hlissner/dotfiles ⭐ 3.4k
- 社区称"gold standard"，最全面的个人配置
- 自定义模块系统、极度完善的开发环境
- **不要 fork** — 太复杂，fork 了也维护不了
- 正确用法：当参考书，学模块设计模式

### 3. Snowfall Lib
- 自动发现模块的框架，减少手动 import boilerplate
- 在 simple flake 和复杂框架之间的中间地带
- 适合"已有配置想优化结构"的场景

### 4. Digga
- 面向团队/组织的重型框架
- 对个人用户过重，社区评价"overkill"

## 核心事实

**NixOS 没有 "oh-my-zsh"。** 社区哲学是"你必须理解你在配什么"。

所有人的 dotfiles 都高度个人化，fork 别人的配置 = 继承你不理解的复杂度。nix-starter-configs 已经是最接近"开箱即用"的方案。

## 降低日常摩擦的方法

1. **常用工具全写进 configuration.nix**，一次配好不折腾
2. **临时软件用 `nix-shell -p xxx`**，不污染系统
3. **闭源/难包的软件用 Flatpak**：`services.flatpak.enable = true`，补上 nixpkgs 的短板
4. **参考 hlissner/dotfiles 的模块结构**重组配置
