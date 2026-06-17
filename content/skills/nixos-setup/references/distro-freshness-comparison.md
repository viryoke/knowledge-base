# Repology 包新鲜度对比数据（2026年6月）

按"最新包占比"排序，数据源: repology.org/repositories/statistics

| 发行版 | 总包数 | 最新包占比 | 过时包占比 |
|--------|--------|-----------|-----------|
| Arch Linux | 12k | 86.9% | 12.9% |
| nixpkgs unstable | 115k | 84.8% | 15.1% |
| nixpkgs 26.05 | 115k | 83.8% | 16.2% |
| Manjaro Stable | 12k | 78.8% | 21.0% |
| Fedora Rawhide | 23k | 75.1% | 24.6% |
| Gentoo | 18k | 72.6% | 26.8% |
| openSUSE Tumbleweed | 16k | 72.2% | 27.4% |
| Debian Unstable | 40k | 70.5% | 27.3% |
| Fedora 42 | 25k | 54.4% | 45.4% |
| Fedora 41 | 24k | 46.5% | 53.3% |
| Ubuntu 25.04 | 39k | 42.5% | 55.5% |
| Ubuntu 24.04 LTS | 37k | 36.0% | 62.0% |
| Debian 12 Stable | 34k | 33.5% | 64.7% |

## 关键洞察

- **Arch 最新但包数少**：12k 包，86.9% 最新。AUR 补生态。
- **nixpkgs 包数碾压**：115k 包（所有发行版最多），unstable 新鲜度 84.8%，仅次于 Arch。
- **Fedora Stable 并不新**：社区普遍认为 Fedora "比 Ubuntu 新"，但数据显示 Fedora 41/42 只有 46-54% 最新包，仅略好于 Ubuntu。
- **openSUSE Tumbleweed 平衡最好**：72.2% 最新 + rolling release + openQA 自动测试，是唯一有系统级 QA 的滚动发行版。
- **Debian Stable 最旧**：33.5%，适合服务器不适合开发机。

## 用户场景建议

用户需要：稳定 + 生态 + 最新软件。三者本质矛盾，推荐折中：

1. **留在 NixOS**：nixpkgs unstable 新鲜度优秀（84.8%），用 Flatpak 补闭源软件
2. **换 openSUSE Tumbleweed**：rolling + openQA 测试，72.2% 最新，Java/Go/Python/Docker 一等支持
3. **Arch + AUR**：最新（86.9%），生态最大（AUR），但稳定性靠用户自己
