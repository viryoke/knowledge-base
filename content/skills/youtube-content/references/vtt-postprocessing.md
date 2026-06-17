# VTT 字幕后处理

VTT 文件是**不可见**的。Obsidian 只显示已知文件类型（.md, .png, .pdf 等）。必须转换为 .md。

## 关键规则

### 1. 保留时间戳
**绝对不能删除时间戳**。用户明确要求保留 `[HH:MM:SS]` 格式，用于视频导航。

输出格式：
```markdown
**[00:01:23]** 这是合并后的段落文本，包含完整的句子。下一个时间戳开始新段落。

**[00:02:45]** Another paragraph starts here with its own timestamp for navigation.
```

### 2. 语义段落合并
YouTube 自动字幕将文本拆分为 2-5 个词的片段。必须合并为可读段落：

```python
def merge_into_paragraphs(blocks, max_gap=2.0, max_paragraph_len=200):
    """
    合并字幕块为段落。
    断开条件：标点符号（。？！；. ? ! ;）、时间间隔 > max_gap 秒、段落长度 > max_paragraph_len
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
        
        # 检查是否应该断开段落
        should_break = (
            time_gap > max_gap or  # 时间间隔过大
            sentence_enders.search(current_text.rstrip()) or  # 句子结束
            len(current_text) + len(text) > max_paragraph_len  # 段落过长
        )
        
        if should_break:
            # 保存当前段落
            paragraphs.append((current_ts, current_text.strip()))
            # 开始新段落
            current_ts = ts
            current_text = text
        else:
            # 继续当前段落
            current_text += text
        
        current_end_seconds = seconds
    
    # 不要忘记最后一个段落
    if current_text.strip():
        paragraphs.append((current_ts, current_text.strip()))
    
    return paragraphs
```

### 3. 双语字幕合并
当同时存在中文（zh/zh-TW）和英文（en-zh/en-zh-TW）字幕时，合并为单个双语 .md 文件：

```markdown
**[00:01:23]** 中文内容在这里
**[00:01:23]** English translation here

**[00:02:45]** 下一个段落
**[00:02:45]** Next paragraph
```

这样可以将文件数量减半，并提供并行阅读。

### 4. 清理
**转换后删除 VTT 文件**。一旦 .md 存在，它们就没有用途，如果需要可以重新下载。保持目录清洁。

## 完整转换脚本

```python
#!/usr/bin/env python3
"""将 VTT 字幕转换为可读的 Markdown，带时间戳。"""

import os
import re
import sys
import glob
from collections import defaultdict

def parse_vtt_with_seconds(vtt_content):
    """将 VTT 解析为 (timestamp_str, seconds, text) 元组列表。"""
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
    """将字幕块合并为段落。"""
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
        
        # 检查是否应该断开段落
        should_break = (
            time_gap > max_gap or  # 时间间隔过大
            sentence_enders.search(current_text.rstrip()) or  # 句子结束
            len(current_text) + len(text) > max_paragraph_len  # 段落过长
        )
        
        if should_break:
            # 保存当前段落
            paragraphs.append((current_ts, current_text.strip()))
            # 开始新段落
            current_ts = ts
            current_text = text
        else:
            # 继续当前段落
            current_text += text
        
        current_end_seconds = seconds
    
    # 不要忘记最后一个段落
    if current_text.strip():
        paragraphs.append((current_ts, current_text.strip()))
    
    return paragraphs

def vtt_to_markdown(vtt_content, title=""):
    """将 VTT 内容转换为可读的 Markdown。"""
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
    """从 markdown 中提取时间戳-文本对。"""
    lines = content.split('\n')
    pairs = []
    for line in lines:
        match = re.match(r'\*\*\[(\d{2}:\d{2}:\d{2})\]\*\* (.+)', line)
        if match:
            pairs.append((match.group(1), match.group(2)))
    return pairs

def merge_bilingual(zh_content, en_content, title=""):
    """将中英文字幕合并为双语 Markdown。"""
    zh_pairs = parse_markdown_timestamps(zh_content)
    en_pairs = parse_markdown_timestamps(en_content)
    
    # 创建字典以便快速查找
    zh_dict = {ts: text for ts, text in zh_pairs}
    en_dict = {ts: text for ts, text in en_pairs}
    
    # 获取所有唯一时间戳，排序
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
    """将单个 VTT 文件转换为 Markdown。"""
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
    """批量转换匹配 glob 模式的所有 VTT 文件。"""
    files = sorted(glob.glob(pattern))
    for f in files:
        output = convert_file(f)
        print(f"Converted: {f} -> {output}")
    return len(files)

def bilingual_merge(zh_path, en_path, output_path):
    """将中英文 VTT 文件合并为双语 Markdown。"""
    # 先将两者转换为 markdown
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

## 关键特性

1. **语义段落合并**：将 2-5 个词的片段组合成可读段落
2. **时间戳保留**：每个段落都以 `[HH:MM:SS]` 开头，用于视频导航
3. **双语支持**：交错中英文翻译
4. **可配置合并**：调整 `max_gap`（默认 2 秒）和 `max_paragraph_len`（默认 200 字符）

## 与 Obsidian 集成

转换后，.md 文件立即可在 Obsidian vault 中查看。删除原始 .vtt 文件以保持目录清洁。
