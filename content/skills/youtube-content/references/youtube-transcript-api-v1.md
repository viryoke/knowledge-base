# youtube-transcript-api v1.x 迁移指南

## Breaking Changes (v0.x → v1.x)

### Old API (v0.x) - 不再可用
```python
# ❌ 这些方法在 v1.x 中不存在
from youtube_transcript_api import YouTubeTranscriptApi

transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
```

### New API (v1.x) - 当前版本
```python
# ✅ 必须创建实例
from youtube_transcript_api import YouTubeTranscriptApi

api = YouTubeTranscriptApi()

# 列出可用字幕
transcript_list = api.list(video_id)
for t in transcript_list:
    print(f"{t.language} ({t.language_code}) - {t.is_generated}")

# 获取字幕（支持语言回退）
result = api.fetch(video_id, languages=["zh-Hans", "zh-Hant", "zh", "en"])

# 访问片段
for snippet in result.snippets:
    print(f"[{snippet.start:.1f}s] {snippet.text}")
```

## 常见错误

### "type object 'YouTubeTranscriptApi' has no attribute 'list_transcripts'"
原因：代码使用了 v0.x API，但安装的是 v1.x
解决：改用 `api.list()` 和 `api.fetch()`

### "YouTube is blocking requests from your IP"
原因：YouTube 临时封禁了 IP（请求过于频繁或来自云服务商）
解决：
1. 等待 10-30 分钟后重试
2. 切换到 yt-dlp: `yt-dlp --cookies-from-browser chrome --write-sub`

## 版本检查
```bash
pip show youtube-transcript-api
# Version: 1.0.0+
```

## 安装
```bash
pip install youtube-transcript-api
```
