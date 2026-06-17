# Ryan4yin's fcitx5 Configuration (Reference)

From: github.com/ryan4yin/nix-config

## System-level (i18n.nix)

```nix
time.timeZone = "Asia/Shanghai";
i18n.defaultLocale = "en_US.UTF-8";
i18n.extraLocaleSettings = {
  LC_ADDRESS = "zh_CN.UTF-8";
  LC_IDENTIFICATION = "zh_CN.UTF-8";
  LC_MEASUREMENT = "zh_CN.UTF-8";
  LC_MONETARY = "zh_CN.UTF-8";
  LC_NAME = "zh_CN.UTF-8";
  LC_NUMERIC = "zh_CN.UTF-8";
  LC_PAPER = "zh_CN.UTF-8";
  LC_TELEPHONE = "zh_CN.UTF-8";
  LC_TIME = "zh_CN.UTF-8";
};
```

## Home Manager (fcitx5/default.nix)

```nix
{ config, pkgs, ... }:
{
  i18n.inputMethod = {
    enable = true;
    type = "fcitx5";
    fcitx5.waylandFrontend = true;
    fcitx5.addons = with pkgs; [
      qt6Packages.fcitx5-configtool
      fcitx5-gtk
      fcitx5-rime           # 小鹤音形
      fcitx5-mozc-ut        # 日本語
      fcitx5-hangul         # 韩语
    ];
  };

  # Pin fcitx5 profile (switching IMs mutates this file)
  xdg.configFile = {
    "fcitx5/profile" = {
      source = ./profile;
      force = true;  # fcitx5 modifies this at runtime
    };
  };
}
```

## Overlay: Custom Rime Data (小鹤音形)

```nix
_:
(_: super: {
  # Override rime-data with Xiaohe Flypy scheme
  rime-data = ./rime-data-flypy;
  fcitx5-rime = super.fcitx5-rime.override {
    rimeDataPkgs = [ ./rime-data-flypy ];
  };
})
```

## Key Takeaways

1. **Profile pinning**: fcitx5 writes to `~/.config/fcitx5/profile` at runtime. Ryan uses `force = true` to overwrite it on each rebuild.
2. **Rime override via overlay**: Custom input scheme data replaces the default `rime-data` package.
3. **Multi-language**: Chinese (Rime), Japanese (Mozc), Korean (Hangul) all in one config.
4. **Wayland frontend**: `fcitx5.waylandFrontend = true` for Wayland compositors (Niri, Sway).
