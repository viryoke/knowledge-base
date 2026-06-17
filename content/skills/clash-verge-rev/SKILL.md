---
name: clash-verge-rev
description: "Configure and troubleshoot Clash Verge Rev (mihomo core) on macOS — TUN mode, rules, templates, IPv6 issues."
tags: [proxy, clash, network, macOS, tun]
---

# Clash Verge Rev Configuration & Troubleshooting

## Trigger
User asks about Clash Verge Rev configuration, proxy rules, TUN mode, or reports network connectivity issues while Clash is running.

## Architecture

Clash Verge Rev uses a **template layering system**. The active subscription (remote profile) is the base, and enhancement templates overlay on top:

- **Merge.yaml** — merges top-level config (dns, ipv6, mode, etc.)
- **Rules template** (`rCvpkT5Q1h0v.yaml` style filename) — prepend/append/delete rules
- **Proxies template** — prepend/append/delete proxy nodes
- **Groups template** — prepend/append/delete proxy groups
- **Script.js** — JavaScript transform for advanced manipulation

Config dir: `~/Library/Application Support/io.github.clash-verge-rev.clash-verge-rev/`
Key files:
- `verge.yaml` — app settings (TUN mode, system proxy, core selection)
- `profiles.yaml` — profile registry, shows which templates are linked to which subscription
- `profiles/` — all YAML files (subscriptions + enhancement templates)
- `logs/service/service_latest.log` — mihomo core logs (connection routing decisions)
- `clash-verge.yaml` — the **merged** running config (check this to verify template application)

Core: `verge-mihomo` (mihomo, fork of clash-meta). API at `127.0.0.1:9090` when `external-controller` is set.

## Adding DIRECT Rules for Domestic Sites

To force specific domains to bypass proxy (DIRECT), edit the **Rules template** (find it in `profiles.yaml` under the subscription's `option.rules` field):

```yaml
prepend:
  - DOMAIN-SUFFIX,example.com,DIRECT
  - DOMAIN-KEYWORD,example,DIRECT

append: []
delete: []
```

`prepend` rules are inserted **before** the subscription's rules, so they match first. This is critical because subscriptions often have broad `MATCH,Proxy` or `GEOIP,CN,DIRECT` rules at the end.

Common domestic cloud providers that should be DIRECT:
- 阿里云: aliyun.com, aliyuncs.com, alicdn.com, alibabacloud.com
- 腾讯云: cloud.tencent.com, tencentcloudapi.com, myqcloud.com, qcloud.com
- 华为云: huaweicloud.com, hwclouds.cn
- 天翼云: ctyun.cn, ctyun.com.cn
- 移动云: ecloud.10086.cn

After editing, click the **Reload button** on the active profile card in the Clash Verge Rev UI.

## IPv6 Troubleshooting (Critical)

### Symptom
Browser cannot access domestic Chinese websites (baidu.com, aliyun.com, etc.) while curl works fine from terminal. Service logs show:

```
dial DIRECT (match GeoIP/cn) [fdfe:dcba:9876::1]:PORT --> [2409:8c20:...]:443 
error: connect: no route to host
```

### Root Cause
1. TUN mode intercepts all traffic including DNS
2. Browser prefers IPv6 (AAAA records), curl defaults to IPv4
3. DNS returns real IPv6 addresses for Chinese sites (2409:8c20::, 2408:4005::, etc.)
4. Clash matches these as `GEOIP,CN` → routes to DIRECT
5. Mac has **no IPv6 connectivity** → "no route to host"

### Fix
Add to **Merge template** (`Merge.yaml`):

```yaml
profile:
  store-selected: true

dns:
  ipv6: false

ipv6: false
```

Then reload the profile. This forces IPv4-only DNS resolution.

### Verification
After fix, check service logs — should no longer see IPv6 addresses in DIRECT connections. Browser should load domestic sites normally.

## Merge.yaml Critical Pitfalls

### NEVER use `rules:` in Merge.yaml — always use `prepend-rules:`

`rules:` **replaces all rules** from the main subscription config. This deletes every routing rule → all traffic has no match → **network breaks completely**. Use `prepend-rules:` (insert before) or `append-rules:` (add after) instead.

```yaml
# ❌ WRONG — replaces all rules, kills network
rules:
  - IP-CIDR,100.64.0.0/10,DIRECT,no-resolve

# ✅ CORRECT — prepends to existing rules
prepend-rules:
  - IP-CIDR,100.64.0.0/10,DIRECT,no-resolve
```

### NEVER put `tun:` in Merge.yaml

`tun:` in Merge.yaml **overrides** the TUN settings from Clash Verge's GUI. If Merge only has `exclude-interface`, it wipes the rest of the TUN config (stack, dns-hijack, auto-route, etc.) → TUN breaks → LAN works but external network dies. Configure TUN settings in GUI only, or in the main subscription profile.

## Tailscale Bypass

Tailscale uses CGNAT addresses (`100.64.0.0/10`) and WireGuard UDP. Without bypass rules, Clash intercepts and breaks Tailscale connectivity.

Add to Merge.yaml `prepend-rules`:
```yaml
prepend-rules:
  - IP-CIDR,100.64.0.0/10,DIRECT,no-resolve
  - IP-CIDR6,fd7a:115c:a1e0::/48,DIRECT,no-resolve
  - DOMAIN-SUFFIX,tailscale.com,DIRECT
  - DOMAIN-SUFFIX,ts.net,DIRECT
```

For TUN `exclude-interface: tailscale0`, configure in Clash Verge GUI → TUN settings (not in Merge.yaml).

## Pitfalls

- **curl vs browser divergence**: curl uses IPv4 by default, browsers prefer IPv6. If curl works but browser doesn't, think IPv6 first.
- **`rules:` vs `prepend-rules:`**: Using `rules:` in Merge.yaml is the #1 cause of "network dead after config change". Always use `prepend-rules:` or `append-rules:`.
- **`tun:` in Merge.yaml**: Overriding TUN in Merge is the #1 cause of "LAN works but external dead". Keep TUN config out of Merge.
- **Template not applying**: Check `profiles.yaml` to confirm the template UID is linked to the active subscription under `option`. A template file existing in `profiles/` doesn't mean it's active.
- **TUN mode captures everything**: Unlike system proxy (HTTP only), TUN captures all TCP/UDP including DNS. IPv6 issues only manifest in TUN mode.
- **Subscription refresh overwrites**: If the remote subscription updates, it may reset rules. Enhancement templates (prepend/append) survive because they're applied on top.
- **Service logs rotate frequently**: `service_latest.log` only shows the current session. Historical logs are timestamped files in the same directory.
