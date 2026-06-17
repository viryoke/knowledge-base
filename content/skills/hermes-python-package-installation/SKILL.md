---
name: Hermes Python Package Installation
description: Install Python packages for Hermes Agent to use, ensuring they go to the correct venv
version: 1.0.0
author: viryoke
license: MIT
platforms: [macos, linux]
tags: [hermes, python, venv, package-management, telegram]
---

# Hermes Python Package Installation

## Problem Context

Hermes Agent runs in its own isolated virtual environment, separate from system Python and Homebrew Python. When installing Python packages that Hermes needs to use (like `python-telegram-bot`), you must install them into Hermes's venv, not the system or Homebrew Python.

## Hermes Environment Details

**Hermes venv location:** `~/.hermes/hermes-agent/venv/`

**Python version:** Currently 3.11.15 (may vary with Hermes updates)

**Entry point:** `~/.local/bin/hermes` → shell wrapper → `~/.hermes/hermes-agent/venv/bin/hermes`

**Common mistake:** Using `pip install` or `pip3 install` from terminal installs to the wrong Python environment (system 3.9 or Homebrew 3.14 on macOS).

## Installation Steps

### 1. Identify the correct pip

Always use the full path to Hermes's pip:

```bash
~/.hermes/hermes-agent/venv/bin/pip3 install <package-name>
```

Or activate the venv first:

```bash
source ~/.hermes/hermes-agent/venv/bin/activate
pip install <package-name>
```

### 2. Verify installation

```bash
~/.hermes/hermes-agent/venv/bin/python3 -c "import <package>; print(<package>.__version__)"
```

### 3. Restart gateway (if needed)

For gateway platforms (Telegram, Discord, etc.), restart to load new packages:

```bash
hermes gateway restart
```

## Example: Installing python-telegram-bot

```bash
# Install to Hermes venv
~/.hermes/hermes-agent/venv/bin/pip3 install python-telegram-bot

# Verify
~/.hermes/hermes-agent/venv/bin/python3 -c "import telegram; print(telegram.__version__)"

# Restart gateway
hermes gateway restart
```

## Telegram Configuration with Proxy

### Problem

If `api.telegram.org` is blocked in your network, Hermes will timeout on primary connection and fall back to direct IP, adding 10-15 seconds delay.

### Solution: Set TELEGRAM_PROXY

1. Identify your proxy tool and port (e.g., Clash Verge Rev mixed-port: 7897)
2. Verify proxy works:

```bash
curl -x http://127.0.0.1:7897 -s -o /dev/null -w "HTTP_CODE:%{http_code}" https://api.telegram.org
```

3. Add to `~/.hermes/.env`:

```bash
TELEGRAM_PROXY=http://127.0.0.1:7897
```

4. Restart gateway:

```bash
hermes gateway restart
```

5. Verify in logs:

```bash
grep -i "telegram" ~/.hermes/logs/gateway.log | tail -10
# Should show: "Proxy detected; passing explicitly to HTTPXRequest"
```

## Common Pitfalls

### Pitfall 1: Wrong Python environment

**Symptom:** `hermes doctor` shows package not installed despite `pip install` success

**Cause:** Installed to system/Homebrew Python instead of Hermes venv

**Fix:** Use full path `~/.hermes/hermes-agent/venv/bin/pip3`

### Pitfall 2: PEP 668 protection on Homebrew Python

**Symptom:** "externally-managed-environment" error when using `pip3 install` with Homebrew Python 3.14

**Cause:** Homebrew enables PEP 668 to prevent breaking system packages

**Fix:** Install to Hermes venv instead, or use `--break-system-packages` flag (not recommended)

### Pitfall 3: Telegram connection timeout

**Symptom:** Gateway logs show "Primary api.telegram.org connection failed" warnings

**Cause:** Direct access to Telegram API blocked, falling back to IP

**Fix:** Configure `TELEGRAM_PROXY` in `~/.hermes/.env`

### Pitfall 4: Gateway doesn't load new packages

**Symptom:** Package installed but platform still not starting

**Cause:** Gateway process using cached imports

**Fix:** Always `hermes gateway restart` after installing new packages

## Verification Checklist

After installing a package for Hermes:

- [ ] Installed using `~/.hermes/hermes-agent/venv/bin/pip3`
- [ ] Verified import works in Hermes venv
- [ ] Restarted gateway if platform-related
- [ ] Checked gateway logs for successful connection
- [ ] No "connection failed" or "package not found" warnings

## Related Configuration

### Hermes Config Files

- `~/.hermes/.env` — Environment variables, API keys, proxy settings
- `~/.hermes/config.yaml` — Platform configuration, model settings
- `~/.hermes/logs/gateway.log` — Gateway runtime logs

### Useful Commands

```bash
# Check Hermes health
hermes doctor

# View gateway status
hermes gateway status

# Tail gateway logs
tail -f ~/.hermes/logs/gateway.log

# Restart gateway
hermes gateway restart
```

## References

- Hermes Agent docs: https://hermes-agent.nousresearch.com/docs/
- Gateway platform docs: https://hermes-agent.nousresearch.com/docs/user-guide/messaging/
- python-telegram-bot: https://python-telegram-bot.org/
