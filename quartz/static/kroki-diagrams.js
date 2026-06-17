const KROKI_API = "https://kroki.io";

const DIAGRAM_TYPES = [
  { lang: "d2", krokiType: "d2", label: "D2" },
  { lang: "plantuml", krokiType: "plantuml", label: "PlantUML" },
  { lang: "dot", krokiType: "graphviz", label: "GraphViz" },
  { lang: "graphviz", krokiType: "graphviz", label: "GraphViz" },
];

async function renderKrokiDiagram(code, krokiType) {
  const response = await fetch(KROKI_API + "/" + krokiType + "/svg", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: code,
  });
  if (!response.ok) throw new Error("Kroki API error: " + response.status);
  return response.text();
}

function createDiagramContainer(svgContent, label) {
  const container = document.createElement("div");
  container.className = "diagram-container";

  const svgWrapper = document.createElement("div");
  svgWrapper.innerHTML = svgContent;
  container.appendChild(svgWrapper);

  const caption = document.createElement("div");
  caption.className = "diagram-caption";
  caption.textContent = label;
  container.appendChild(caption);

  return container;
}

function createSourceToggle(pre) {
  const toggle = document.createElement("button");
  toggle.className = "diagram-source-toggle";
  toggle.textContent = "Show source";

  let visible = false;
  toggle.addEventListener("click", function() {
    visible = !visible;
    pre.style.display = visible ? "block" : "none";
    toggle.textContent = visible ? "Hide source" : "Show source";
  });

  return toggle;
}

async function renderDiagrams() {
  const debugInfo = [];

  for (const diagramType of DIAGRAM_TYPES) {
    const codeBlocks = document.querySelectorAll(
      "code[data-language='" + diagramType.lang + "']"
    );

    debugInfo.push({lang: diagramType.lang, count: codeBlocks.length});

    for (const codeBlock of codeBlocks) {
      const pre = codeBlock.closest("pre") || codeBlock.parentElement;
      const figure = codeBlock.closest("figure") || pre.parentElement;

      if (figure.dataset.krokiRendered === "true") {
        debugInfo.push({lang: diagramType.lang, skip: "already rendered"});
        continue;
      }

      const sourceCode = codeBlock.textContent || "";

      if (!sourceCode.trim()) {
        debugInfo.push({lang: diagramType.lang, skip: "empty"});
        continue;
      }

      const loadingDiv = document.createElement("div");
      loadingDiv.className = "kroki-loading";
      loadingDiv.textContent = "Rendering " + diagramType.label + "...";
      figure.parentElement.insertBefore(loadingDiv, figure);

      try {
        const svgContent = await renderKrokiDiagram(sourceCode, diagramType.krokiType);
        const container = createDiagramContainer(svgContent, diagramType.label);
        const toggle = createSourceToggle(figure);

        figure.style.display = "none";
        figure.dataset.krokiRendered = "true";
        loadingDiv.replaceWith(container);
        container.appendChild(toggle);
        debugInfo.push({lang: diagramType.lang, success: true});
      } catch (error) {
        loadingDiv.remove();
        console.warn("Failed to render " + diagramType.label + ":", error);
        debugInfo.push({lang: diagramType.lang, error: error.message});
      }
    }
  }

  window.__krokiDebug = debugInfo;
}

document.addEventListener("nav", renderDiagrams);
document.addEventListener("render", renderDiagrams);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderDiagrams);
} else {
  renderDiagrams();
}

setTimeout(renderDiagrams, 1000);
