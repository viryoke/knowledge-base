# 批量处理 YouTube 课程字幕

当需要为整个课程（播放列表）批量下载和转换字幕时，使用此工作流。

## 前提条件
- yt-dlp (用于 VTT 下载)
- youtube-transcript-api v1.x (备选方案)
- Chrome 浏览器已登录 YouTube

## 完整流程

### 1. 提取视频列表
```bash
# 从播放列表提取所有视频 ID 和标题
yt-dlp --cookies-from-browser chrome \
  --flat-playlist \
  --print "%(id)s|%(title)s|%(duration_string)s" \
  "https://www.youtube.com/playlist?list=PLAYLIST_ID"
```

输出示例：
```
abc123|Lecture 1: Introduction|12:34
def456|Lecture 2: Basics|15:20
```

### 2. 下载字幕（两种方法）

#### 方法 A: yt-dlp (优先)
```bash
yt-dlp --cookies-from-browser chrome \
  --write-auto-sub --write-sub \
  --sub-lang "zh-Hans,zh-Hant,en-orig,en" \
  --skip-download \
  --sub-format vtt \
  -o "video-%(id)s.%(ext)s" \
  "VIDEO_URL"
```

#### 方法 B: youtube-transcript-api (备用)
当 yt-dlp 遇到 PO Token 限制时使用：
```python
from youtube_transcript_api import YouTubeTranscriptApi

api = YouTubeTranscriptApi()
result = api.fetch(video_id, languages=["zh-Hans", "en"])
```

### 3. VTT → Markdown 转换

**必须保留时间戳**，用于视频导航。

转换规则：
- 合并连续的字幕块为段落（max_gap=3秒, max_len=300字符）
- 在句号、问号、感叹号处断开
- 输出格式：`**[HH:MM:SS]** 段落文本`

### 4. 中英双语合并

如果有中文和英文字幕，合并为单文件：
```markdown
# Lecture Title

**[00:01:23]** 中文内容第一行
**[00:01:23]** English translation first line

**[00:02:45]** 中文内容第二行
**[00:02:45]** English translation second line
```

### 5. 文件命名规范
- 编号前缀：`01-`, `02-`, ...
- 主题描述：`Cost-Function`, `Gradient-Descent`
- 完整示例：`11-Cost-Function-Squared-Error.md`

## 完整脚本模板

```python
#!/usr/bin/env python3
"""批量下载 YouTube 课程字幕并转换为双语 Markdown"""

import subprocess
import re
from pathlib import Path
from youtube_transcript_api import YouTubeTranscriptApi

# 课程配置
COURSE_DIR = Path("raw/transcripts/course-name")
COURSE_DIR.mkdir(parents=True, exist_ok=True)

# 视频列表: [(编号, video_id, 标题), ...]
videos = [
    (1, "abc123", "Introduction"),
    (2, "def456", "Basic Concepts"),
    # ...
]

def format_time(seconds):
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    return f"{h:02d}:{m:02d}:{s:02d}"

def fetch_transcript(video_id, lang_codes):
    try:
        api = YouTubeTranscriptApi()
        result = api.fetch(video_id, languages=lang_codes)
        return [(s.start, s.text) for s in result.snippets]
    except Exception as e:
        print(f"  Error: {e}")
        return None

def merge_paragraphs(entries, max_gap=3.0, max_len=300):
    if not entries:
        return []
    
    paragraphs = []
    current_text = entries[0][1]
    current_start = entries[0][0]
    last_end = entries[0][0]
    
    sentence_enders = re.compile(r'[。？！；\.\?\!;]$')
    
    for start, text in entries[1:]:
        time_gap = start - last_end
        should_break = (
            time_gap > max_gap or
            sentence_enders.search(current_text.rstrip()) or
            len(current_text) + len(text) > max_len
        )
        
        if should_break:
            paragraphs.append((format_time(current_start), current_text.strip()))
            current_text = text
            current_start = start
        else:
            current_text += ' ' + text
        last_end = start
    
    if current_text.strip():
        paragraphs.append((format_time(current_start), current_text.strip()))
    
    return paragraphs

def create_bilingual_markdown(zh_paragraphs, en_paragraphs, title):
    lines = [f"# {title}", "", ""]
    
    zh_dict = {ts: text for ts, text in (zh_paragraphs or [])}
    en_dict = {ts: text for ts, text in (en_paragraphs or [])}
    all_timestamps = sorted(set(zh_dict.keys()) | set(en_dict.keys()))
    
    for ts in all_timestamps:
        if ts in zh_dict:
            lines.append(f"**[{ts}]** {zh_dict[ts]}")
            lines.append("")
        if ts in en_dict:
            lines.append(f"**[{ts}]** {en_dict[ts]}")
            lines.append("")
    
    return '\n'.join(lines)

# 主循环
for num, video_id, title in videos:
    print(f"[{num:02d}] {title}...", flush=True)
    
    en_entries = fetch_transcript(video_id, ["en", "en-orig"])
    zh_entries = fetch_transcript(video_id, ["zh-Hans", "zh-Hant", "zh", "zh-CN"])
    
    if not en_entries and not zh_entries:
        print(f"[{num:02d}] ✗ No transcripts")
        continue
    
    en_paragraphs = merge_paragraphs(en_entries) if en_entries else []
    zh_paragraphs = merge_paragraphs(zh_entries) if zh_entries else []
    
    md_content = create_bilingual_markdown(zh_paragraphs, en_paragraphs, f"{num:02d} {title}")
    
    output_file = COURSE_DIR / f"{num:02d}-{title.replace(' ', '-')}.md"
    output_file.write_text(md_content, encoding='utf-8')
    
    lang_info = []
    if zh_paragraphs: lang_info.append("zh")
    if en_paragraphs: lang_info.append("en")
    print(f"[{num:02d}] ✓ {output_file.name} ({'+'.join(lang_info)})")

print("\n完成！")
```

## 常见问题

### yt-dlp 失败："n challenge solving failed"
原因：YouTube 的 PO Token 机制
解决：切换到 youtube-transcript-api

### youtube-transcript-api 失败："YouTube is blocking requests"
原因：请求过于频繁或 IP 被临时封禁
解决：等待 10-30 分钟后重试，或使用 yt-dlp

### 部分视频无法获取字幕
原因：YouTube 临时封禁或视频本身没有字幕
解决：记录失败的视频编号，稍后重试

### VTT 文件在 Obsidian 中不可见
原因：Obsidian 只显示已知文件类型
解决：必须转换为 .md 格式

## 性能优化

1. **分批处理**：每批 10-20 个视频，避免触发限流
2. **失败重试**：记录失败列表，稍后单独重试
3. **缓存中间结果**：保留 VTT 文件，转换失败时可重新处理
4. **并行下载**：使用多个进程同时下载（谨慎，易触发限流）
