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
  for (const diagramType of DIAGRAM_TYPES) {
    const codeBlocks = document.querySelectorAll("pre > code.language-" + diagramType.lang);

    for (const codeBlock of codeBlocks) {
      const pre = codeBlock.parentElement;
      const sourceCode = codeBlock.textContent || "";

      if (!sourceCode.trim()) continue;

      const loadingDiv = document.createElement("div");
      loadingDiv.className = "kroki-loading";
      loadingDiv.textContent = "Rendering " + diagramType.label + "...";
      pre.parentElement.insertBefore(loadingDiv, pre);

      try {
        const svgContent = await renderKrokiDiagram(sourceCode, diagramType.krokiType);
        const container = createDiagramContainer(svgContent, diagramType.label);
        const toggle = createSourceToggle(pre);

        pre.style.display = "none";
        loadingDiv.replaceWith(container);
        container.appendChild(toggle);
      } catch (error) {
        loadingDiv.remove();
        console.warn("Failed to render " + diagramType.label + ":", error);
      }
    }
  }
}

document.addEventListener("nav", renderDiagrams);
document.addEventListener("render", renderDiagrams);
renderDiagrams();
