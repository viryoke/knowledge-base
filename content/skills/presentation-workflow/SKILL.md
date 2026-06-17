---
name: presentation-workflow
description: "Generate presentations, slide decks, or visual reports. Triggers on: PPT, slides, deck, presentation, 演示文稿, 幻灯片, 分享材料."
version: 1.0.0
author: viryoke
tags: [presentation, slides, html, pdf, design]
created: 2026-06-16
updated: 2026-06-16
type: skill
confidence: high
---

# Presentation Workflow

## When to Use

Trigger when the user asks to create any kind of presentation, slide deck, visual report, or shareable document. Covers: PPTX, PDF slides, HTML presentations, and external tools like Gamma.

**Default recommendation**: HTML slides with PDF export. This produces professional-quality output that can be used immediately. Only suggest PPTX generation if the user explicitly needs an editable PowerPoint file.

## Decision Tree

```
User needs presentation?
  ├── Needs editable PPTX? → Warn about quality limits, suggest Gamma.app or HTML→PPTX
  └── Just needs to present/share? → HTML slides → Chrome headless → PDF (RECOMMENDED)
```

### Why HTML Slides is the Default

- **Quality**: Professional design with gradients, shadows, modern typography
- **Speed**: Single HTML file, instant preview, fast PDF export
- **Flexibility**: Works for tech talks, business presentations, any visual style
- **No dependencies**: Just a browser and text editor

Programmatic PPTX generation (python-pptx/pptxgenjs) has inherent quality limits and should only be used when editable PowerPoint is a hard requirement.

### Approach Comparison

| Approach | Design Quality | Editable? | Cost | Best For |
|----------|---------------|-----------|------|----------|
| **HTML → PDF** | ⭐⭐⭐⭐⭐ | HTML only | Free | 技术分享、内部汇报 |
| **pptxgenjs** | ⭐⭐⭐ | PPTX | Free | 需要 PPTX 但不追求精美 |
| **python-pptx** | ⭐⭐ | PPTX | Free | 简单批量生成 |
| **Gamma.app** | ⭐⭐⭐⭐⭐ | PPTX/PDF | $10/月 | 对外演示、重要场合 |

## Pitfalls

1. **python-pptx 设计上限很低** — 本质是"画矩形和文本框"，没有渐变、阴影、精美排版。用户反馈"效果挺差的"。不要作为首选方案。
2. **pptxgenjs 比 python-pptx 好，但仍达不到专业水准** — 用户反馈"比上一个好很多了，不过还是没法直接作为成品进行展示"。
3. **HTML 幻灯片是代码生成的最佳方案** — CSS 支持渐变、阴影、动画、精美排版，浏览器全屏演示效果好，Chrome headless 可无损导出 PDF。
4. **HTML → PPTX 转换效果极差** — 大量设计丢失，排版错位，不推荐。
5. **用户偏好**：代码生成的演示文稿要达到"可直接展示"的水平，必须用 HTML 方案或外部工具（Gamma）。

## Procedure: HTML Slides → PDF

### Step 1: Create HTML File

Use the template in `templates/html-slides-template.html` as a starting point. Key principles:
- Use `@page { size: 1280px 720px; margin: 0; }` for PDF page sizing
- Each `.slide` div is exactly 1280×720px with `page-break-after: always`
- Use Google Fonts for typography (Inter + Noto Serif SC for Chinese)
- Dark slides for title/conclusion, light slides for content
- Cards with `box-shadow` and accent bars for visual hierarchy

### Step 2: Preview

```bash
open ~/Desktop/slides.html  # macOS
# or open in browser
```

### Step 3: Export PDF

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu \
  --print-to-pdf="/path/to/output.pdf" \
  --print-to-pdf-no-header \
  --no-pdf-header-footer \
  /path/to/slides.html
```

**Note**: Chrome may output warning messages like "Trying to load the allocator multiple times" or "DEPRECATED_ENDPOINT" errors, but these don't affect the PDF generation. The command will still produce a high-quality PDF successfully.

### Step 4: Verify

Open the PDF and check: page breaks, text readability, color accuracy, card alignment.

## Procedure: Gamma.app

1. Go to gamma.app and sign in
2. Choose "Generate" → input topic or paste outline
3. Gamma generates content + design automatically
4. Edit and refine
5. Export as PPTX or PDF

## Procedure: pptxgenjs (when PPTX is required)

See `powerpoint` skill for pptxgenjs details. Remember: result won't be presentation-grade. Suggest the user open in PowerPoint for final polish, or switch to HTML/Gamma approach.

## Design Principles (HTML Slides)

### Color Palettes

| Theme | Primary | Secondary | Accent | Background |
|-------|---------|-----------|--------|------------|
| Ocean Teal | `#0d9488` | `#14b8a6` | `#5eead4` | `#f8fafc` |
| Midnight Executive | `#1E2761` | `#CADCFC` | `#FFFFFF` | `#0f172a` |
| Forest & Moss | `#2C5F2D` | `#97BC62` | `#F5F5F5` | `#f5f5f0` |
| Warm Terracotta | `#B85042` | `#E7E8D1` | `#A7BEAE` | `#faf8f5` |

### Typography

- **Chinese**: `Noto Serif SC` (serif) or `LXGW WenKai` (warm serif)
- **English**: `Inter` (sans-serif) or `EB Garamond` (serif)
- **Code**: `JetBrains Mono`
- Slide titles: 36-56px bold
- Body text: 14-16px
- Captions: 11-13px muted

### Layout Variety

Never repeat the same layout across slides. Use:
- Cards with accent bars (2-3 column grid)
- Flow steps (horizontal or vertical)
- Styled tables
- Numbered principle lists with colored circles
- Problem/insight rows with alternating backgrounds
- Dark section transition slides with large numbers

## References

- `templates/html-slides-template.html` — Complete HTML slide template with Ocean Teal palette
