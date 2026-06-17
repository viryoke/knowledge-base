# VTT to Markdown Conversion Script

Complete Python script for converting YouTube VTT subtitles into readable, timestamped Markdown with semantic paragraph merging and bilingual support.

## Usage

```bash
# Single file conversion
python3 convert_vtt.py input.vtt output.md

# Batch conversion (all .vtt files in directory)
python3 convert_vtt.py transcripts/*.vtt

# Bilingual merge (if both zh and en versions exist)
python3 convert_vtt.py --bilingual zh-file.vtt en-file.vtt output.md
```

## The Script

```python
#!/usr/bin/env python3
"""Convert VTT subtitles to readable Markdown with timestamps."""

import os
import re
import sys
import glob
from collections import defaultdict

def parse_vtt_with_seconds(vtt_content):
    """Parse VTT into list of (timestamp_str, seconds, text) tuples."""
    lines = vtt_content.split('\n')
    blocks = []
    current_ts = None
    current_seconds = None
    current_text = []
    
    for line in lines:
        ts_match = re.match(r'(\d{2}):(\d{2}):(\d{2})\.\d+ --> \d{2}:\d{2}:\d{2}\.\d+', line)
        if ts_match:
            if current_ts is not None and current_text:
                blocks.append((current_ts, current_seconds, ' '.join(current_text)))
            h, m, s = int(ts_match.group(1)), int(ts_match.group(2)), int(ts_match.group(3))
            current_seconds = h * 3600 + m * 60 + s
            current_ts = f"{h:02d}:{m:02d}:{s:02d}"
            current_text = []
        elif current_ts is not None:
            clean_line = re.sub(r'</?c[^>]*>', '', line).strip()
            if clean_line and not re.match(r'^\d+$', clean_line):
                current_text.append(clean_line)
                
    if current_ts is not None and current_text:
        blocks.append((current_ts, current_seconds, ' '.join(current_text)))
        
    return blocks

def merge_into_paragraphs(blocks, max_gap=2.0, max_paragraph_len=200):
    """
    Merge subtitle blocks into paragraphs.
    Break on: punctuation (.?!;), time gap > max_gap seconds, or paragraph length > max_paragraph_len.
    """
    if not blocks:
        return []
    
    paragraphs = []
    current_ts = blocks[0][0]
    current_text = blocks[0][2]
    current_end_seconds = blocks[0][1]
    
    sentence_enders = re.compile(r'[。？！；\.\?\!;]$')
    
    for i in range(1, len(blocks)):
        ts, seconds, text = blocks[i]
        time_gap = seconds - current_end_seconds
        
        # Check if we should break the paragraph
        should_break = (
            time_gap > max_gap or  # Large time gap
            sentence_enders.search(current_text.rstrip()) or  # Sentence ending
            len(current_text) + len(text) > max_paragraph_len  # Too long
        )
        
        if should_break:
            # Save current paragraph
            paragraphs.append((current_ts, current_text.strip()))
            # Start new paragraph
            current_ts = ts
            current_text = text
        else:
            # Continue current paragraph
            current_text += text
        
        current_end_seconds = seconds
    
    # Don't forget the last paragraph
    if current_text.strip():
        paragraphs.append((current_ts, current_text.strip()))
    
    return paragraphs

def vtt_to_markdown(vtt_content, title=""):
    """Convert VTT content to readable Markdown."""
    blocks = parse_vtt_with_seconds(vtt_content)
    paragraphs = merge_into_paragraphs(blocks)
    
    lines = []
    if title:
        lines.append(f"# {title}")
        lines.append("")
    
    lines.append("> 字幕转录（自动生成自 YouTube 字幕，已按语义合并）")
    lines.append("")
    
    for ts, text in paragraphs:
        lines.append(f"**[{ts}]** {text}")
        lines.append("")
    
    return '\n'.join(lines)

def parse_markdown_timestamps(content):
    """Extract timestamp-text pairs from markdown."""
    lines = content.split('\n')
    pairs = []
    for line in lines:
        match = re.match(r'\*\*\[(\d{2}:\d{2}:\d{2})\]\*\* (.+)', line)
        if match:
            pairs.append((match.group(1), match.group(2)))
    return pairs

def merge_bilingual(zh_content, en_content, title=""):
    """Merge Chinese and English subtitles into bilingual Markdown."""
    zh_pairs = parse_markdown_timestamps(zh_content)
    en_pairs = parse_markdown_timestamps(en_content)
    
    # Create dict for easy lookup
    zh_dict = {ts: text for ts, text in zh_pairs}
    en_dict = {ts: text for ts, text in en_pairs}
    
    # Get all unique timestamps, sorted
    all_timestamps = sorted(set(zh_dict.keys()) | set(en_dict.keys()))
    
    lines = []
    if title:
        lines.append(f"# {title}")
        lines.append("")
    
    lines.append("> 字幕转录（中英双语，自动生成自 YouTube 字幕）")
    lines.append("")
    
    for ts in all_timestamps:
        zh_text = zh_dict.get(ts, "")
        en_text = en_dict.get(ts, "")
        
        if zh_text:
            lines.append(f"**[{ts}]** {zh_text}")
        if en_text:
            lines.append(f"**[{ts}]** {en_text}")
        lines.append("")
    
    return '\n'.join(lines)

def convert_file(input_path, output_path=None):
    """Convert a single VTT file to Markdown."""
    with open(input_path, 'r', encoding='utf-8') as f:
        vtt_content = f.read()
    
    title = os.path.splitext(os.path.basename(input_path))[0]
    md_content = vtt_to_markdown(vtt_content, title)
    
    if output_path is None:
        output_path = input_path.replace('.vtt', '.md')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    return output_path

def batch_convert(pattern):
    """Convert all VTT files matching a glob pattern."""
    files = sorted(glob.glob(pattern))
    for f in files:
        output = convert_file(f)
        print(f"Converted: {f} -> {output}")
    return len(files)

def bilingual_merge(zh_path, en_path, output_path):
    """Merge Chinese and English VTT files into bilingual Markdown."""
    # Convert both to markdown first
    zh_md = vtt_to_markdown(open(zh_path, 'r', encoding='utf-8').read())
    en_md = vtt_to_markdown(open(en_path, 'r', encoding='utf-8').read())
    
    title = os.path.splitext(os.path.basename(zh_path))[0]
    title = re.sub(r'\.(zh|zh-TW|en-zh|en-zh-TW)$', '', title)
    
    bilingual = merge_bilingual(zh_md, en_md, title)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(bilingual)
    
    return output_path

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 convert_vtt.py <input.vtt> [output.md]")
        print("       python3 convert_vtt.py <pattern>  # batch mode")
        print("       python3 convert_vtt.py --bilingual <zh.vtt> <en.vtt> <output.md>")
        sys.exit(1)
    
    if sys.argv[1] == '--bilingual':
        if len(sys.argv) != 5:
            print("Usage: python3 convert_vtt.py --bilingual <zh.vtt> <en.vtt> <output.md>")
            sys.exit(1)
        bilingual_merge(sys.argv[2], sys.argv[3], sys.argv[4])
        print(f"Created bilingual: {sys.argv[4]}")
    elif '*' in sys.argv[1] or '?' in sys.argv[1]:
        count = batch_convert(sys.argv[1])
        print(f"Converted {count} files")
    else:
        output = convert_file(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
        print(f"Created: {output}")
```

## Key Features

1. **Semantic paragraph merging**: Combines 2-5 word fragments into readable paragraphs
2. **Timestamp preservation**: Every paragraph starts with `[HH:MM:SS]` for video navigation
3. **Bilingual support**: Interleaves Chinese and English translations
4. **Configurable merging**: Adjust `max_gap` (2s default) and `max_paragraph_len` (200 chars default)

## Integration with Obsidian

After conversion, the .md files are immediately visible in Obsidian vault. Delete the original .vtt files to keep the directory clean.
