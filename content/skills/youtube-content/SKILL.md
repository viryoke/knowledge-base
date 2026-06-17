---
name: youtube-content
description: "YouTube transcripts to summaries, threads, blogs."
platforms: [linux, macos, windows]
---

# YouTube Content Tool

## When to use

Use when the user shares a YouTube URL or video link, asks to summarize a video, requests a transcript, or wants to extract and reformat content from any YouTube video. Transforms transcripts into structured content (chapters, summaries, threads, blog posts).

Extract transcripts from YouTube videos and convert them into useful formats.

## Setup

```bash
# Primary method (PREFERRED - no cookies needed, works around PO token issues)
pip install youtube-transcript-api

# Fallback method (when transcript-api fails or for manual subtitles)
pip install yt-dlp  # or: python3 -m pip install yt-dlp
```

## CRITICAL: fetch_transcript.py Output Format

**The default output is JSON, not plain text.**

```json
{
  "video_id": "...",
  "segment_count": 157,
  "duration": "9:51",
  "full_text": "complete transcript as plain text",
  "timestamped_text": "0:00 first line\n0:15 second line\n..."
}
```

**Use `--text-only` flag for plain text output:**
```bash
python3 fetch_transcript.py "URL" --text-only --timestamps
# Output: "0:00 first line\n0:15 second line\n..."
```

**Or parse JSON and extract fields:**
```python
import json
data = json.loads(output)
full_text = data["full_text"]
timestamped = data.get("timestamped_text", "")
```

**Do NOT try to parse raw output as plain timestamped lines** — it will fail.

## CRITICAL: Use fetch_transcript.py First

**DO NOT write custom download scripts.** The `scripts/fetch_transcript.py` in this skill handles:
- youtube-transcript-api integration (bypasses YouTube PO token issues)
- Automatic language fallback chains
- JSON and timestamped text output formats

```bash
# Preferred workflow: use the skill's script
python3 SKILL_DIR/scripts/fetch_transcript.py "URL" --language "zh-Hans,en" --timestamps

# Only fall back to yt-dlp when fetch_transcript.py fails
yt-dlp --cookies-from-browser chrome --write-auto-sub --write-sub \
  --sub-lang "LANG_CODE" --skip-download --sub-format vtt \
  -o "output-%(id)s.%(ext)s" "URL"
```

**Why this order matters:**
- `fetch_transcript.py` uses youtube-transcript-api which bypasses PO token requirements
- yt-dlp requires browser cookies and may hit n-challenge issues (needs EJS solver)
- Writing custom scripts duplicates logic already in the skill and introduces bugs

**User correction:** When downloading YouTube transcripts, always check this skill first before writing custom code. The user explicitly corrected this pattern in a previous session.

## Helper Scripts

The skill includes several helper scripts in the `scripts/` directory:

- `fetch_transcript.py` - Fetch a single YouTube transcript as JSON or plain text (uses youtube-transcript-api v1.x)
- `convert_vtt.py` - Convert VTT files to Markdown with timestamps and bilingual support

## Reference Documentation

Detailed guides are available in the `references/` directory:

- `youtube-transcript-api-v1.md` - Migration guide for youtube-transcript-api v1.x (breaking changes from v0.x)
- `batch-course-transcripts.md` - Complete workflow for batch processing entire course playlists
- `vtt-postprocessing.md` - Detailed VTT to Markdown conversion with semantic paragraph merging

## Workflow

**For single videos:**
1. Use `fetch_transcript.py` to get the transcript
2. Format as needed (summary, chapters, thread, blog post)

**For entire courses/playlists:**
1. Follow the batch processing workflow in `references/batch-course-transcripts.md`
2. Use yt-dlp with `--cookies-from-browser chrome` to download VTT files
3. Convert VTT to bilingual Markdown using the conversion script
4. Delete VTT files after conversion

**When youtube-transcript-api fails (IP blocking):**
- Fall back to yt-dlp with browser cookies
- See `references/youtube-transcript-api-v1.md` for troubleshooting

## Output Formats

After fetching the transcript, format it based on what the user asks for:

- **Chapters**: Group by topic shifts, output timestamped chapter list
- **Summary**: Concise 5-10 sentence overview of the entire video
- **Chapter summaries**: Chapters with a short paragraph summary for each
- **Thread**: Twitter/X thread format — numbered posts, each under 280 chars
- **Blog post**: Full article with title, sections, and key takeaways
- **Quotes**: Notable quotes with timestamps

### Example — Chapters Output

```
00:00 Introduction — host opens with the problem statement
03:45 Background — prior work and why existing solutions fall short
12:20 Core method — walkthrough of the proposed approach
24:10 Results — benchmark comparisons and key takeaways
31:55 Q&A — audience questions on scalability and next steps
```

## Workflow

1. **Fetch** the transcript using the helper script with `--text-only --timestamps`.
2. **Validate**: confirm the output is non-empty and in the expected language. If empty, retry without `--language` to get any available transcript. If still empty, tell the user the video likely has transcripts disabled.
3. **Chunk if needed**: if the transcript exceeds ~50K characters, split into overlapping chunks (~40K with 2K overlap) and summarize each chunk before merging.
4. **Transform** into the requested output format. If the user did not specify a format, default to a summary.
5. **Verify**: re-read the transformed output to check for coherence, correct timestamps, and completeness before presenting.

## youtube-transcript-api v1.x (NEW API)

**IMPORTANT: v1.0+ has breaking changes from v0.x**

```python
from youtube_transcript_api import YouTubeTranscriptApi

# Create instance (NOT class method!)
api = YouTubeTranscriptApi()

# List available transcripts
transcript_list = api.list(video_id)
for t in transcript_list:
    print(f"{t.language} ({t.language_code})")

# Fetch specific language(s) with fallback
result = api.fetch(video_id, languages=["zh-Hans", "zh-Hant", "zh", "en"])

# Access snippets
for snippet in result.snippets:
    print(f"[{snippet.start:.1f}s] {snippet.text}")
```

**Common pitfall**: Old code using `YouTubeTranscriptApi.list_transcripts()` will fail with "type object has no attribute 'list_transcripts'". Use `api.list()` and `api.fetch()` instead.

## yt-dlp Fallback (when youtube-transcript-api fails)

`youtube-transcript-api` may fail due to YouTube's PO token requirements (error: "YouTube is blocking requests from your IP"). When it does, use `yt-dlp` with browser cookies:

```bash
# Install yt-dlp (macOS)
python3 -m pip install yt-dlp
# Binary typically at ~/Library/Python/3.9/bin/yt-dlp (adjust for your Python version)

# Single video: probe available subtitle languages first
yt-dlp --cookies-from-browser chrome --list-subs "URL"

# Download subtitles (auto-generated + manual)
yt-dlp --cookies-from-browser chrome \
  --write-auto-sub --write-sub \
  --sub-lang "zh-TW,zh-Hant,zh-Hans,zh,en-zh,en-zh-TW,en" \
  --skip-download --sub-format vtt \
  -o "output-%(id)s.%(ext)s" "URL"
```

## VTT Post-Processing (REQUIRED for Obsidian integration)

VTT files are **invisible in Obsidian** — it only shows known file types (.md, .png, .pdf, etc.). Always convert to .md.

**CRITICAL: Preserve timestamps.** User explicitly corrected removal of timestamps — they need `[HH:MM:SS]` for video navigation.

### Semantic Paragraph Merging

YouTube auto-captions break text into 2-5 word fragments. Merge into readable paragraphs:

```python
def merge_into_paragraphs(blocks, max_gap=2.0, max_paragraph_len=200):
    """
    Merge subtitle blocks into paragraphs.
    Break on: punctuation (.?!;), time gap > max_gap seconds, or paragraph length > max_paragraph_len.
    """
    # Algorithm: accumulate text until break condition, then start new paragraph
    # Break conditions:
    # 1. Time gap > 2 seconds between consecutive blocks
    # 2. Sentence-ending punctuation (。？！；. ? ! ;)
    # 3. Paragraph exceeds 200 characters
```

Output format (one paragraph per timestamp):
```markdown
**[00:01:23]** 这是合并后的段落文本，包含完整的句子。下一个时间戳开始新段落。

**[00:02:45]** Another paragraph starts here with its own timestamp for navigation.
```

### Bilingual Subtitle Merging

When both Chinese (zh/zh-TW) and English (en-zh/en-zh-TW) subtitles exist, merge into single bilingual .md file:

```markdown
**[00:01:23]** 中文内容在这里
**[00:01:23]** English translation here

**[00:02:45]** 下一个段落
**[00:02:45]** Next paragraph
```

This halves file count and enables parallel reading.

### Cleanup

**Delete VTT files after conversion.** They serve no purpose once .md exists, and can be re-downloaded if needed. Keep directory clean.

### VTT Conversion Quality Issues

**Common VTT parsing problems that produce unreadable output:**

1. **Inline HTML tags** — YouTube VTT files contain `<c>` tags and inline timestamps like `<00:01:23.456>`. Strip ALL tags with `re.sub(r'<[^>]+>', '', text)` before processing.

2. **Text duplication** — Auto-captions often repeat the same text 3 times per line. After stripping tags, deduplicate using longest-common-substring or prefix/suffix overlap detection.

3. **Mixed timestamp formats** — Some VTT files have both cue-level timestamps (`00:00:01.000 --> 00:00:05.000`) and inline timestamps (`<00:01:23.456>`). Strip inline timestamps but preserve cue-level ones for the final `[HH:MM:SS]` markers.

**Robust conversion pattern:**
```python
import re

def clean_vtt_line(line):
    # Strip all HTML-like tags
    line = re.sub(r'<[^>]+>', '', line)
    # Strip inline timestamps
    line = re.sub(r'<\d{2}:\d{2}:\d{2}\.\d{3}>', '', line)
    # Remove duplicate phrases (simple heuristic: if line contains same 5+ word phrase twice, keep one)
    words = line.split()
    if len(words) >= 10:
        half = len(words) // 2
        if words[:half] == words[half:]:
            line = ' '.join(words[:half])
    return line.strip()
```

### Pitfalls

- **DO NOT write custom batch scripts**: Use `fetch_transcript.py` directly in a loop for batch processing. The user explicitly corrected writing custom scripts when the skill's script handles everything. For playlists: extract video IDs, then loop calling fetch_transcript.py per video.
- **youtube-transcript-api v1.2+ API changed**: The old `YouTubeTranscriptApi.list_transcripts()` static method no longer exists. Use `api = YouTubeTranscriptApi(); result = api.fetch(video_id, languages=[...])` instead. The result has `.snippets` with `.text`, `.start`, `.duration` attributes.
- **yt-dlp n-challenge failure**: yt-dlp may fail with "n challenge solving failed" requiring a JavaScript runtime (EJS solver). This affects subtitle downloads too, not just video. When this happens, `fetch_transcript.py` (youtube-transcript-api) is more reliable as it doesn't need the n-challenge solver.
- **IP blocking after batch downloads**: YouTube may block your IP after many rapid requests. Space out requests or use `fetch_transcript.py` which handles retries better than raw yt-dlp.
- **Hermes venv location**: youtube-transcript-api and yt-dlp should be run from the Hermes venv (`~/.hermes/hermes-agent/venv/bin/python`) to use Python 3.11+. The system Python 3.9 triggers yt-dlp deprecation warnings.
- **PO token error**: `youtube-transcript-api` will fail with "Subtitles disabled" or similar. Switch to yt-dlp with `--cookies-from-browser chrome` — it reads cookies from the user's Chrome (must be logged into YouTube).
- **Subtitle language codes vary per video**: Always probe with `--list-subs` first. Common codes: `zh`, `zh-TW`, `zh-Hant`, `zh-Hans`, `en-zh`, `en-zh-TW`. Don't hardcode one code.
- **Playlist bulk download**: Use `--flat-playlist --print "%(id)s|%(title)s|%(duration_string)s"` to extract all video IDs without downloading, then loop with the subtitle download command per video.
- **yt-dlp path**: On macOS, pip install to user directory means the binary is NOT on PATH. Use full path like `/Users/<user>/Library/Python/3.9/bin/yt-dlp`.
- **No subtitles at all**: Some videos (especially short intros/outros) have no captions. This is not an error — skip and note it.
- **VTT files invisible in Obsidian**: Must convert to .md for visibility. Never leave raw VTT in vault.
- **Never strip timestamps**: User explicitly requires `[HH:MM:SS]` format for video navigation. Do not remove.
- **Auto-captions are fragmented**: Always apply semantic paragraph merging, not naive line-by-line conversion.
- **VTT files are invisible in Obsidian**: Obsidian only shows known file types (.md, .png, .pdf, etc.). VTT subtitle files will not appear in the vault. Always convert to .md for Obsidian integration.
- **NEVER strip timestamps when converting VTT to .md**: Timestamps are essential for video navigation. The user explicitly corrected this — they want `[HH:MM:SS]` preserved on every line so they can jump to the right moment in the video.
- **Auto-captions are fragmented**: YouTube auto-generated subtitles break text into 2-5 word chunks. Raw conversion produces unreadable output. Always apply semantic paragraph merging (see VTT Post-Processing section below).
- **Bilingual subtitle merging**: When a video has both original language (e.g. zh/zh-TW) and translated (e.g. en-zh/en-zh-TW) captions, merge them into a single .md file with both languages per timestamp. This halves the file count and provides parallel reading.
- **DO NOT write custom batch scripts**: Use `fetch_transcript.py` directly in a loop for batch processing. The user explicitly corrected writing custom scripts when the skill's script handles everything. For playlists: extract video IDs, then loop calling fetch_transcript.py per video.
- **youtube-transcript-api v1.2+ API changed**: The old `YouTubeTranscriptApi.list_transcripts()` static method no longer exists. Use `api = YouTubeTranscriptApi(); result = api.fetch(video_id, languages=[...])` instead. The result has `.snippets` with `.text`, `.start`, `.duration` attributes.
- **yt-dlp n-challenge failure**: yt-dlp may fail with "n challenge solving failed" requiring a JavaScript runtime (EJS solver). This affects subtitle downloads too, not just video. When this happens, `fetch_transcript.py` (youtube-transcript-api) is more reliable as it doesn't need the n-challenge solver.
- **IP blocking after batch downloads**: YouTube may block your IP after many rapid requests. Space out requests or use `fetch_transcript.py` which handles retries better than raw yt-dlp.
- **Hermes venv location**: youtube-transcript-api and yt-dlp should be run from the Hermes venv (`~/.hermes/hermes-agent/venv/bin/python`) to use Python 3.11+. The system Python 3.9 triggers yt-dlp deprecation warnings.

### Batch Playlist Processing (40+ videos)

For large playlists, use a scripted batch approach with background execution:

```bash
# Step 1: Enumerate all videos
python3 -m yt_dlp --cookies-from-browser chrome --flat-playlist \
  --print "%(id)s|%(title)s|%(duration_string)s" "PLAYLIST_URL"

# Step 2: Probe first video for language codes
python3 -m yt_dlp --cookies-from-browser chrome --list-subs \
  "https://www.youtube.com/watch?v=FIRST_VIDEO_ID" 2>&1 | grep -E "^(en|zh)"

# Step 3: Write batch script (see scripts/batch_download.py pattern)
# Step 4: Run in background with notify_on_complete=true
```

**Key patterns for batch scripts:**
- Use `python3 -m yt_dlp` — bare `yt-dlp` is often not on PATH after pip install
- Subtitle language codes for English-original courses: `en-orig` (English Original), `en`, `zh-Hans`, `zh-Hant` — always probe first
- Auto-captions have heavy text duplication — add a `deduplicate_text()` step before `merge_into_paragraphs()`
- For 40+ videos, run as background process (`terminal(background=true, notify_on_complete=true)`) and poll progress
- Download all 4 subtitle tracks (zh-Hans, zh-Hant, en-orig, en) in one pass per video

### yt-dlp 后备方案（PO token 失败时）

`youtube-transcript-api` 在 2024-2025 年经常因 YouTube 的 PO token 要求而失败。当内置脚本失败时，使用 yt-dlp：

### 安装

```bash
# macOS
python3 -m pip install yt-dlp
# 通常安装在 ~/Library/Python/3.9/bin/yt-dlp（根据 Python 版本调整）
```

### 单个视频

```bash
# 1. 探测可用字幕语言
yt-dlp --cookies-from-browser chrome --list-subs "URL" 2>&1 | grep "Available subtitles for"

# 2. 下载字幕（自动+手动）
yt-dlp --cookies-from-browser chrome \
  --write-auto-sub --write-sub \
  --sub-lang "zh-TW,zh-Hant,zh-Hans,zh,en-zh,en-zh-TW,en" \
  --skip-download --sub-format vtt \
  -o "output-%(id)s.%(ext)s" "URL"
```

### 批量播放列表

```bash
# 1. 提取所有视频 ID（不下载）
yt-dlp --cookies-from-browser chrome --flat-playlist \
  --print "%(id)s|%(title)s|%(duration_string)s" "PLAYLIST_URL"

# 2. 对每个视频：探测语言 → 下载
# 关键：语言代码因视频而异（zh vs zh-TW vs zh-Hant）
```

### 关键陷阱

- **语言代码不统一**：同一播放列表中，一个视频可能是 `zh`，另一个是 `zh-TW`。必须先 `--list-subs` 探测
- **浏览器 cookies**：`--cookies-from-browser chrome` 读取用户 Chrome 的登录态，解决 PO token 问题
- **yt-dlp 路径**：macOS pip 安装到用户目录时，二进制不在 PATH 中，需用完整路径
- **某些视频无字幕**：短视频（介绍、公告）可能完全没有字幕，跳过即可

## VTT Post-Processing: Subtitle → Readable Markdown

Raw VTT files and naive text extraction produce unreadable output (2-5 word fragments per line). Always post-process into semantic paragraphs. See `references/vtt-to-markdown.md` for the full conversion script.

### Conversion Pipeline

1. **Parse VTT** → extract (timestamp_seconds, text) tuples, merging multi-line cues within the same timestamp block
2. **Merge into paragraphs** using three break conditions:
   - Time gap > 2 seconds between consecutive blocks
   - Sentence-ending punctuation (。？！；. ? ! ;)
   - Paragraph exceeds ~200 characters
3. **Format output** as `**[HH:MM:SS]** merged paragraph text` — one paragraph per timestamp
4. **Bilingual merge** (if both original + translated captions exist): interleave both languages per timestamp:
   ```
   **[00:01:00]** 中文原文内容
   **[00:01:00]** English translation of the same content
   ```

### Key Rules

- **Always keep timestamps** — never strip them. They enable video navigation.
- **Delete raw .vtt files after conversion** — they serve no purpose once .md exists and can be re-downloaded.
- **Bilingual = single file** — merge zh + en into one .md per video, not two separate files.

## Error Handling

- **Transcript disabled**: 先尝试 yt-dlp + 浏览器 cookies，再放弃
- **Private/unavailable video**: 转达错误，请用户验证 URL
- **No matching language**: 不带 `--language` 重试获取任意字幕，然后告知用户实际语言
- **Dependency missing**: 运行 `pip install youtube-transcript-api` 并重试
