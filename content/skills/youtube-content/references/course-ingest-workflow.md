# YouTube Course Ingest into Obsidian Wiki

Specialized workflow for ingesting a full YouTube course playlist into an Obsidian vault (LLM Wiki style). This extends the single-video workflow with batch operations, PDF slide extraction, and wiki page creation.

## Prerequisites

- yt-dlp: typically at `~/Library/Python/3.9/bin/yt-dlp` or in Hermes venv
- Chrome browser logged into YouTube (for cookies)
- curl available for PDF downloads

## Step-by-step

### 1. Extract playlist info

```bash
yt-dlp --flat-playlist --print "%(id)s|%(title)s|%(duration_string)s" "<PLAYLIST_URL>"
```

### 2. Download PDF slides (if available)

Check the course's official webpage for slide PDFs. Download to `raw/papers/`.

```bash
curl -sL -o "raw/papers/<filename>.pdf" "<PDF_URL>"
```

Verify with: `mdls -name kMDItemNumberOfPages <file>` or check file starts with `%PDF-`.

### 3. Download subtitles (per-video language check)

**CRITICAL:** Different videos use different language codes. Must check per-video:

```bash
yt-dlp --cookies-from-browser chrome --list-subs "<VIDEO_URL>" 2>&1 | grep "Available subtitles"
```

Download command:
```bash
yt-dlp --cookies-from-browser chrome \
  --write-auto-sub --write-sub \
  --sub-lang "zh,zh-TW,en-zh,en-zh-TW" \
  --skip-download --sub-format vtt \
  -o "raw/transcripts/<prefix>-<title>-%(id)s.%(ext)s" \
  "<VIDEO_URL>"
```

### 4. Convert VTT to Markdown

Use the main skill's VTT conversion pipeline. See parent skill's `references/vtt-to-markdown.md` for the full conversion script.

### 5. Bilingual merge

When both Chinese and English subtitles exist, merge into single .md file:

```
**[00:00:00]** 中文原文段落...
**[00:00:00]** English translated paragraph...
```

### 6. Sanitize filenames for wikilinks

After conversion, rename .md files to remove characters that break Obsidian wikilinks:

```python
import re
def sanitize_filename(name):
    name = re.sub(r'\s*\[[A-Za-z0-9_-]+\]', '', name)
    name = name.replace('｜', ' - ').replace('：', ' -')
    name = re.sub(r'\s+', ' ', name).strip()
    return name
```

Never use `|` (halfwidth pipe) — it breaks wikilink parsing.

### 7. Create Wiki pages

- **Entity page** for the instructor (if not exists) in `entities/`
- **Concept page** for the course in `concepts/`
- Include: course structure table, learning suggestions, raw material inventory, cross-references
- Update `index.md` and `log.md`

### 8. Cross-reference

- Link new pages to existing related pages (bidirectional)
- Add entries to relevant entity pages (e.g., instructor's course list)

## Course Ingest Pitfalls

- **Sanitize transcript filenames before creating wikilinks** — YouTube titles contain `[video_id]`, `｜`, `：` that break Obsidian
- **Subtitles language codes vary per video** — always `--list-subs` first
- **Some videos have no subtitles at all** — handle gracefully, note in log
- **Official course pages may have commented-out PDF links** — check HTML comments
- **Browser console JS may fail with "identifier already declared"** — wrap in IIFE
- **Subagents CANNOT run yt-dlp** — `delegate_task` subagents don't inherit Chrome cookies. Always run yt-dlp in the main session.
- **yt-dlp saves subtitles to CWD** — always `mv` to correct directory afterward
- **YouTube rate limiting (HTTP 429)** — batch-downloading 10+ subtitles triggers rate limits. Add `time.sleep(2)` between videos.
