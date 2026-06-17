import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../../.quartz/plugins"
export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title =
      (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")

    // Url of current page
    const socialUrl =
      fileData.slug === "404" ? url.toString() : joinSegments(url.toString(), fileData.slug!)

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`

    const coreStylesheet = css[0]?.content
    const coreScript = js.find(
      (r) => r.loadTime === "beforeDOMReady" && r.contentType === "external",
    )

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {coreStylesheet && <link rel="preload" href={coreStylesheet} as="style" />}
        {coreScript && coreScript.contentType === "external" && (
          <link rel="preload" href={coreScript.src} as="script" />
        )}
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="og:site_name" content={cfg.pageTitle}></meta>
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={description} />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta
              property="og:image:type"
              content={`image/${getFileExtension(ogImageDefaultPath) ?? "png"}`}
            />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={socialUrl}></meta>
            <meta property="twitter:url" content={socialUrl}></meta>
          </>
        )}

        <link rel="icon" href={iconPath} />
        <meta name="description" content={description} />
        <meta name="generator" content="Quartz" />

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        <script defer data-persist="true" dangerouslySetInnerHTML={{__html: `
const KROKI_API = "https://kroki.io";
const DIAGRAM_TYPES = [
  { lang: "d2", krokiType: "d2", label: "D2" },
  { lang: "plantuml", krokiType: "plantuml", label: "PlantUML" },
  { lang: "dot", krokiType: "graphviz", label: "GraphViz" },
  { lang: "graphviz", krokiType: "graphviz", label: "GraphViz" },
];
async function renderKrokiDiagram(code, krokiType) {
  const r = await fetch(KROKI_API + "/" + krokiType + "/svg", {method: "POST", headers: {"Content-Type": "text/plain"}, body: code});
  if (!r.ok) throw new Error("Kroki error: " + r.status);
  return r.text();
}
function createKrokiContainer(svg, label) {
  const c = document.createElement("div"); c.className = "diagram-container";
  const w = document.createElement("div"); w.innerHTML = svg; c.appendChild(w);
  const cap = document.createElement("div"); cap.className = "diagram-caption"; cap.textContent = label; c.appendChild(cap);
  return c;
}
async function renderKrokiDiagrams() {
  for (const dt of DIAGRAM_TYPES) {
    document.querySelectorAll("code[data-language='" + dt.lang + "']").forEach(function(cb) {
      const fig = cb.closest("figure") || cb.closest("pre").parentElement;
      if (fig.dataset.krokiDone) return;
      const src = cb.textContent.trim();
      if (!src) return;
      const ld = document.createElement("div"); ld.className = "kroki-loading"; ld.textContent = "Rendering " + dt.label + "...";
      fig.parentElement.insertBefore(ld, fig);
      renderKrokiDiagram(src, dt.krokiType).then(function(svg) {
        const c = createKrokiContainer(svg, dt.label);
        const btn = document.createElement("button"); btn.className = "diagram-source-toggle"; btn.textContent = "Show source";
        btn.onclick = function() { var v = fig.style.display !== "none"; fig.style.display = v ? "none" : "block"; btn.textContent = v ? "Show source" : "Hide source"; };
        fig.style.display = "none"; fig.dataset.krokiDone = "1";
        ld.replaceWith(c); c.appendChild(btn);
      }).catch(function(e) { ld.remove(); console.warn("Kroki fail:", e); });
    });
  }
}
document.addEventListener("nav", renderKrokiDiagrams);
document.addEventListener("render", renderKrokiDiagrams);
if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", renderKrokiDiagrams); } else { renderKrokiDiagrams(); }
setTimeout(renderKrokiDiagrams, 1500);
`}} />
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
