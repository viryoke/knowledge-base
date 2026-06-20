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

1. **知识库归档优先，HTML 生成在后（用户明确约定）** — 用户的工作流约定：信息源必须来自知识库，HTML 页面只是从知识库发布到 GitHub Pages 时才生成的产物。正确流程：
   - (1) 将内容归档到知识库合适的目录（`queries/`、`concepts/` 等）
   - (2) 更新 `index.md`（新增条目 + 更新总数）和 `log.md`（追加操作记录）
   - (3) 生成 HTML 幻灯片，保存到 `ObsidianVault/presentations/`
   - (4) 运行 `sync-content.sh` 同步到 Quartz 仓库
   - (5) `npx quartz build` 构建
   - (6) `git push` 触发 CI 自动部署到 GitHub Pages
   - (7) 知识库页面中链接到 HTML 幻灯片的发布地址
   **绝对不要跳过知识库归档直接生成 HTML** — 这违反了"知识库作为唯一实体来源"原则。

2. **HTML 文件存放在 `ObsidianVault/presentations/`，不是 `quartz/static/`** — 知识库是唯一实体来源。HTML 幻灯片作为知识库的资产，必须存放在 vault 的 `presentations/` 目录。通过 `sync-content.sh` 同步到 `quartz/content/presentations/`，再由 Quartz 的 Assets emitter 复制到 `public/presentations/`。旧流程中将 HTML 放在 `quartz/static/presentations/` 是错误的——quartz/static/ 只应存放 Quartz 自身的静态资源（CSS、JS、图标）。

3. **Quartz 5 的 `slugifyFilePath` 会去掉 `.html` 扩展名** — Assets emitter 使用 `slugifyFilePath` 处理文件路径，会将 `.html` 扩展名去掉。导致 `presentations/foo.html` → `public/presentations/foo`（无扩展名 → 浏览器无法正确服务）。需要修改 `quartz/plugins/emitters/assets.ts`，在 `copyFile` 函数中为 `.html`、`.pdf`、`.pptx` 等文件保留扩展名。详见 `quartz-obsidian-publishing` skill。

4. **`content/` 是普通目录，不是软链接** — GitHub Actions 无法解析跨仓库软链接，所以 `quartz/content/` 必须是普通目录，由 `sync-content.sh` 从 vault 同步内容。

5. **python-pptx 设计上限很低** — 本质是"画矩形和文本框"，没有渐变、阴影、精美排版。用户反馈"效果挺差的"。不要作为首选方案。
6. **pptxgenjs 比 python-pptx 好，但仍达不到专业水准** — 用户反馈"比上一个好很多了，不过还是没法直接作为成品进行展示"。
7. **HTML 幻灯片是代码生成的最佳方案** — CSS 支持渐变、阴影、动画、精美排版，浏览器全屏演示效果好，Chrome headless 可无损导出 PDF。
8. **HTML → PPTX 转换效果极差** — 大量设计丢失，排版错位，不推荐。
9. **用户偏好**：代码生成的演示文稿要达到"可直接展示"的水平，必须用 HTML 方案或外部工具（Gamma）。

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

## Procedure: Embedding Dynamic Diagrams (Kroki.io)

For presentations that showcase multiple diagram-as-code languages, use Kroki.io's URL-based rendering API with JavaScript dynamic encoding.

### Architecture

1. Load pako library in `<head>` for deflate compression:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js"></script>
   ```

2. Define diagram sources in JavaScript object:
   ```javascript
   const diagrams = {
     'mermaid-diagram': { lang: 'mermaid', source: `graph TD\n  A --> B` },
     'plantuml-diagram': { lang: 'plantuml', source: `@startuml\nA -> B\n@enduml` },
     // ... more diagrams
   };
   ```

3. Encode and render on window load:
   ```javascript
   function encodeForKroki(source) {
     const encoder = new TextEncoder();
     const data = encoder.encode(source);
     const compressed = pako.deflate(data, { level: 9 });
     const base64 = btoa(String.fromCharCode(...compressed))
       .replace(/\+/g, '-')
       .replace(/\//g, '_')
       .replace(/=/g, '');
     return base64;
   }

   window.addEventListener('load', () => {
     if (typeof pako === 'undefined') {
       // Show error state
       return;
     }
     
     for (const [id, { lang, source }] of Object.entries(diagrams)) {
       const container = document.getElementById(id);
       const encoded = encodeForKroki(source);
       const url = `https://kroki.io/${lang}/svg/${encoded}`;
       const img = new Image();
       img.onload = () => {
         container.classList.remove('loading');
         container.appendChild(img);
       };
       img.onerror = () => {
         container.innerHTML = `<span style="color:var(--rose);">加载失败</span>`;
       };
       img.src = url;
     }
   });
   ```

### Recommended Approach: POST Requests

**Always use POST requests instead of GET URL encoding** for Kroki diagrams. GET encoding fails with:
- Chinese characters (Unicode)
- Complex PlantUML syntax
- Long diagram sources

POST method:
```javascript
const response = await fetch(`https://kroki.io/${lang}/svg`, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' },
  body: source  // Plain text, no encoding needed
});

const svgText = await response.text();
const blob = new Blob([svgText], { type: 'image/svg+xml' });
const url = URL.createObjectURL(blob);

const img = new Image();
img.src = url;
container.appendChild(img);
```

**Benefits**: No encoding complexity, handles all characters, works with any diagram size.

### Pitfalls

1. **Prefer POST over GET URL encoding** — GET encoding with deflate + base64url fails silently with Chinese characters and complex syntax. POST with plain text body is more reliable and simpler.

2. **Never use static pre-encoded URLs** — They're fragile, hard to debug, and break when diagram source changes. Always use POST or dynamic JavaScript encoding.

3. **Load pako in <head>, not dynamically** (only if using GET encoding) — If you create the script tag dynamically, it may not load before your encoding function runs. Add it directly in `<head>`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js"></script>
   ```

4. **Use async fetch with proper error handling** — Check response.ok and show specific error messages:
   ```javascript
   if (!response.ok) {
     throw new Error(`HTTP ${response.status}: ${response.statusText}`);
   }
   ```

5. **Browser cache causes confusion during debugging** — When testing changes, use hard refresh (Ctrl+Shift+R / Cmd+Shift+R) or add cache-busting query param (`?v=2`) to avoid seeing stale versions.

6. **Some diagram languages return empty responses** — BlockDiag and SeqDiag may return HTTP 200 but with empty SVG content. Check `svgText.length > 0` before creating blob. Consider using Nomnoml or Mermaid instead.

7. **HTML/JS Dual-Source Synchronization** — When embedding diagrams in HTML pages with JavaScript rendering, the diagram source appears in TWO places: the HTML `<div class="diagram-code">` (for display) and the JavaScript `diagrams` object (for actual rendering). Common bug: fixing only the HTML display creates misleading "working code" that still fails to render. Always update both locations.

8. **Kroki URL format** (for GET method): `https://kroki.io/{language}/svg/{encoded}` where encoded is deflate-compressed, base64url-encoded (no padding).

### PlantUML-Specific Pitfalls

1. **Component diagrams don't support chained arrows** — `A --> B --> C` causes syntax error. Use individual arrows:
   ```plantuml
   A --> B
   B --> C
   ```

2. **Special characters in package names cause errors** — Characters like `×` (multiplication sign) in `"Encoder Block × N"` trigger syntax errors. Use plain text: `"Encoder Block N"` or `"Encoder Block (N)"`.

3. **Always use individual arrow declarations** — Even for simple chains, write each connection separately to avoid parsing errors.

### Reference Implementation

See `templates/kroki-demo.html` for a complete working example with 6 diagram types (Mermaid, PlantUML, D2, GraphViz, BlockDiag, C4-PlantUML).

## Procedure: Rich Text Generation via Google Gemini Ecosystem

**Preferred workflow**: AI Agent generates structured Markdown → Google Gemini ecosystem converts to rich text (slides, audio, infographics).

**Tools** (Google AI Pro membership, $20/month):

| Tool | Input | Output | Use Case |
|------|-------|--------|----------|
| **Gemini Canvas** | Markdown | Slides, infographics, interactive content | 技术分享、学习笔记 |
| **NotebookLM** | Documents/links | Audio podcasts, Q&A summaries | 通勤复习、内容回顾 |
| **Gemini + HTML** | Markdown | Custom interactive slides | 自定义演示文稿 |

**Workflow**:
1. AI Agent (Hermes/Claude Code) generates structured Markdown with clear sections, code examples, and diagrams
2. Import Markdown into Gemini Canvas or NotebookLM
3. Let Gemini generate the rich text format (slides, audio, etc.)
4. Review and refine the output
5. Export or share

**Key principle**: Markdown is the universal intermediate format. AI tools excel at generating structured text; Gemini tools excel at converting that structure into rich media.

## Procedure: pptxgenjs (when PPTX is required)

See `powerpoint` skill for pptxgenjs details. Remember: result won't be presentation-grade. Suggest the user open in PowerPoint for final polish, or switch to HTML/Gamma approach.

## User Preferences

### Typography and Readability
- **Body text**: 1.2rem (not 1.05rem) for better readability in presentations
- **Captions**: 0.9rem for supporting text
- **Monospace**: 0.88rem for code snippets
- User prefers larger, more comfortable reading sizes over compact layouts

### Content Style
- **Avoid personal experience emphasis**: Don't use phrases like "X years of experience" or "作为N年经验的架构师" - focus on universal problems and solutions
- **Simplify technical jargon**: When explaining pitfalls or lessons learned, use clear, accessible language rather than overly technical descriptions
- **Focus on practical accumulation**: Emphasize how experience and taste build over time through real usage, not abstract principles
- **Correct terminology**: Use precise terms (e.g., "跨端共享" not "跨端访问" when describing cross-device sharing)

### Anti-Patterns in Content
- Don't over-emphasize personal credentials or experience years
- Don't use overly complex technical explanations in "pitfalls" sections
- Don't repeat the same layout or phrasing across multiple practice sections
- Do focus on actionable insights and universal lessons

## Design Principles (HTML Slides)

### Preferred Theme: "Editorial Warm Academic" Dark

User's preferred design system, matching the Quartz knowledge base config:

**Color palette** (dark mode):
```
--bg:         #1a1816    (deep warm black)
--bg-surface: #262320    (surface cards)
--bg-elevated:#2e2a26    (elevated elements)
--text:       #e5ddd3    (warm cream text)
--text-muted: #7d7468    (muted text)
--accent:     #c4a97d    (warm gold)
--accent-dim: #8b6f47    (dim gold borders)
--green:      #7daa6d
--blue:       #6d8faa
--rose:       #aa6d6d
--border:     rgba(196,169,125,0.12)
```

**Typography**:
- Chinese body: `LXGW WenKai` (霞鹜文楷, warm serif) — load via `https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css`
- English body: `Inter` (clean sans-serif)
- Headings: `Instrument Serif` (editorial serif, italic for emphasis)
- Code/mono: `JetBrains Mono`

**Layout**: Bento Grid (2-column cards with `border-radius: 12px`, accent left borders, subtle hover transitions). Cards use `background: var(--bg-surface); border: 1px solid var(--border);`.

**Anti-AI-slop rules** (same as frontend-design):
- No generic gradient hero sections
- No glassmorphism / backdrop-blur
- No purple/violet gradients or Space Grotesk font
- No decorative emoji or SVG illustrations
- No filler copy ("Lorem ipsum", "Let's dive in", "Unlock the power of")
- No centered hero CTAs with glowing buttons
- Use real data, specific numbers, actual code snippets
- Editorial restraint: whitespace over decoration

### Content Guidelines

**Typography and readability**:
- Body text: 1.2rem (not 1.05rem) for better readability
- Caption text: 0.9rem
- Mono text: 0.88rem
- Larger fonts improve presentation legibility

**Tone and framing**:
- Don't emphasize personal experience years (e.g., "作为12年经验的架构师")
- Focus on universal, relatable problems that any AI tool user faces
- Frame issues as common challenges, not personal achievements
- Architecture diagrams should show clear hierarchy: tools at center, configuration above, output below

**Simplify technical explanations**:
- "Pitfalls" sections should be concise and relatable
- Avoid overly technical jargon in problem descriptions
- Example: "各个工具独立配置，积累的工具和经验无法汇聚在一起" (clear and relatable)
- Not: "最初每个工具单独配偏好，维护成本极高" (too technical)

**Focus on practical wisdom**:
- Emphasize accumulated experience and personal taste (个人经验、个人品味)
- Architecture design accumulation is just one aspect of overall experience building
- Show how tools help preserve and apply accumulated knowledge

### Alternative Color Palettes

| Theme | Primary | Secondary | Accent | Background |
|-------|---------|-----------|--------|------------|
| **Editorial Warm Academic (dark)** | `#c4a97d` | `#8b6f47` | `#7daa6d` | `#1a1816` |
| Ocean Teal | `#0d9488` | `#14b8a6` | `#5eead4` | `#f8fafc` |
| Midnight Executive | `#1E2761` | `#CADCFC` | `#FFFFFF` | `#0f172a` |
| Forest & Moss | `#2C5F2D` | `#97BC62` | `#F5F5F5` | `#f5f5f0` |
| Warm Terracotta | `#B85042` | `#E7E8D1` | `#A7BEAE` | `#faf8f5` |

### Typography Options

- **Chinese**: `LXGW WenKai` (preferred) or `Noto Serif SC`
- **English headings**: `Instrument Serif` (preferred) or `EB Garamond`
- **English body**: `Inter`
- **Code**: `JetBrains Mono`
- Slide titles: 36-56px bold (use `Instrument Serif` for editorial feel)
- Body text: 14-16px
- Captions: 11-13px muted

### Layout Variety

Never repeat the same layout across slides. Use:
- **Bento Grid cards** with accent left borders (2-3 column grid)
- **Flow steps** (horizontal or vertical) with `.flow-node` / `.flow-arrow` pattern
- **Architecture diagrams** with `.arch-row` / `.arch-box` / `.arch-connector` pattern
- Styled tables with header accent
- Numbered principle lists with colored circles
- Problem/insight rows with alternating backgrounds
- Dark section transition slides with large numbers

## References

- `templates/html-slides-template.html` — Complete HTML slide template with Ocean Teal palette
