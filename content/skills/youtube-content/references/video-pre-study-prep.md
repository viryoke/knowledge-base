# Video Pre-Study Prep Materials

## When to Use

When the user is studying English-language video courses (e.g., 3Blue1Brown, Karpathy, Andrew Ng) and finds the original English challenging, generate a pre-study sheet BEFORE they watch the video. This turns the viewing from "learn concept + learn English simultaneously" into "verify understanding + practice English listening."

## Workflow

### 1. Fetch Transcript

Use `fetch_transcript.py` to get transcripts:

```bash
python3 SKILL_DIR/scripts/fetch_transcript.py "VIDEO_URL" --language "en" --timestamps
```

**Output is JSON by default.** The key fields are:
- `full_text`: complete transcript as plain text (no timestamps)
- `timestamped_text`: timestamped lines like `0:10 The fundamental...` (only when `--timestamps` flag is used)
- `segment_count`: number of segments

To get plain text directly (no JSON parsing):
```bash
python3 SKILL_DIR/scripts/fetch_transcript.py "VIDEO_URL" --language "en" --text-only
```

**Parse JSON output in Python:**
```python
import json
data = json.loads(terminal_output)
full_text = data["full_text"]           # plain text
timestamped = data.get("timestamped_text", "")  # with timestamps
```

**Pitfall: Video IDs may be outdated or unavailable.** Some course progress trackers contain old YouTube video IDs that return "Video unavailable" on both `fetch_transcript.py` and `yt-dlp`. Always verify video IDs before batch fetching. When a video is genuinely unavailable:
1. Search YouTube for the correct current URL (e.g., "3Blue1Brown span basis vectors")
2. If the correct URL also fails, fill the gap with knowledge-based content (you know the curriculum) and note which videos failed
3. Never block the entire prep material because 1-2 out of 4 videos failed — partial transcripts + knowledge fill is better than nothing

### 2. Extract Key Vocabulary

From the transcript, identify:
- **Technical terms** with Chinese translations (e.g., "span = 张成空间", "basis vectors = 基向量")
- **Key phrases** the speaker uses repeatedly (e.g., "what this means geometrically", "think of it as...")
- **Transition phrases** that signal structure (e.g., "now let's look at", "the key insight is")

### 3. Generate Pre-Study Sheet

Output a concise 1-2 page document with:

```markdown
# Pre-Study: [Video Title]
## Duration: Xmin | Difficulty: [easy/medium/hard]

## Core Concepts (预习核心概念)
1. **[English Term]** — [Chinese explanation]
   > Key sentence from video: "[quote]"
2. ...

## Key Sentences to Listen For (重点听力句)
- [03:45] "When we say the vectors span a space..."
  → 当我们说向量张成一个空间时……
- ...

## Structure Preview (内容结构预览)
- 00:00-03:00 — Introduction: why vectors matter
- 03:00-07:00 — Core concept: span and basis
- 07:00-end — Applications and examples

## Study Tips
- Watch at 0.75x speed
- Enable YouTube auto-translate subtitles (Settings → Subtitles → Auto-translate → Chinese)
- Focus on understanding, not word-by-word translation
```

### 4. Post-Viewing (Optional)

After the user watches, offer to:
- Quiz key concepts in English (builds active vocabulary)
- Explain any segments they didn't understand
- Add new vocabulary to their `english-vocab-tech` wiki page

## User Context

- User studies AI/ML courses in English (native Chinese speaker)
- English listening is a secondary learning goal alongside technical content
- Time-constrained: pre-study sheet should take ≤5 min to read
- Prefers approach: watch Chinese explanation first (B站), then English original for verification + listening practice

## Recommended Approach Order

For the user, suggest these in order:
1. **B站中文版 first** (if available) → understand concept → English original for language practice
2. **Pre-study sheet** → scan vocabulary → watch at 0.75x with bilingual subtitles
3. **Segment retelling** (advanced, time-consuming) — only when user has more time and wants to practice speaking
