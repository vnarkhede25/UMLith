const STORAGE_KEY = "umlith-diagram-v2";

export function saveDiagram(nodes, edges) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 2,
      nodes,
      edges,
      savedAt: new Date().toISOString()
    })
  );
}

export function loadDiagram() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearDiagram() {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportDiagramFile(nodes, edges) {
  return JSON.stringify({ version: 2, nodes, edges }, null, 2);
}