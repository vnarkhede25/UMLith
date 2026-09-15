import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ReactFlow, Background, Controls, MiniMap, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Toolbar from "./components/Toolbar";
import ClassNode from "./components/ClassNode";
import ClassEditor from "./components/ClassEditor";
import EdgeEditor from "./components/EdgeEditor";
import CodePanel from "./components/CodePanel";
import StatsPanel from "./components/StatsPanel";
import Infographic from "./components/Infographic";
import { useDiagram } from "./hooks/useDiagram";
import { exportDiagramFile, loadDiagram, saveDiagram } from "./utils/diagramStorage";
import "./App.css";

const nodeTypes = { umlClass: ClassNode };

const edgeStyle = {
  association: { strokeWidth: 1.8 },
  inheritance: { strokeWidth: 2.2, strokeDasharray: "0", markerEnd: { type: MarkerType.ArrowClosed } },
  implementation: { strokeWidth: 2, strokeDasharray: "7 5", markerEnd: { type: MarkerType.ArrowClosed } },
  aggregation: { strokeWidth: 2, markerStart: { type: MarkerType.Diamond } },
  composition: { strokeWidth: 2, markerStart: { type: MarkerType.DiamondClosed } }
};

function App() {
  const {
    nodes, setNodes, edges, setEdges, onNodesChange, onEdgesChange, onConnect,
    addClass, addInterface, updateNodeData, updateEdgeData, deleteNode, deleteEdge, clearAll
  } = useDiagram();

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const fileInput = useRef(null);

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId), [nodes, selectedNodeId]);
  const selectedEdge = useMemo(() => edges.find(e => e.id === selectedEdgeId), [edges, selectedEdgeId]);

  const styledEdges = useMemo(() => edges.map(edge => {
    const relation = edge.data?.relationship || "association";
    const style = edgeStyle[relation] || edgeStyle.association;
    const label = edge.data?.label || "";
    const ms = edge.data?.multiplicitySource || "1";
    const mt = edge.data?.multiplicityTarget || "1";
    return {
      ...edge,
      animated: relation === "association",
      style,
      label,
      labelStyle: { fill: "#d7def0", fontWeight: 700, fontSize: 10 },
      labelBgStyle: { fill: "#0c1220", fillOpacity: .92 },
      sourceLabel: ms,
      targetLabel: mt,
      sourceLabelStyle: { fill: "#9ca9c2", fontSize: 10 },
      targetLabelStyle: { fill: "#9ca9c2", fontSize: 10 }
    };
  }), [edges]);

  useEffect(() => {
    if (!selectedNodeId && !selectedEdgeId) return;
  }, [selectedNodeId, selectedEdgeId]);

  const handleNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
  }, []);

  const handleEdgeClick = useCallback((_, edge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
  }, []);

  const paneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, []);

  function handleDelete() {
    if (selectedNodeId) {
      deleteNode(selectedNodeId);
      setSelectedNodeId(null);
    } else if (selectedEdgeId) {
      deleteEdge(selectedEdgeId);
      setSelectedEdgeId(null);
    }
  }

  function handleSave() {
    saveDiagram(nodes, edges);
    alert("Diagram saved locally.");
  }

  function handleLoad() {
    const saved = loadDiagram();
    if (!saved) return alert("No saved UMLith diagram found.");
    setNodes(saved.nodes || []);
    setEdges(saved.edges || []);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }

  function handleExport() {
    const blob = new Blob([exportDiagramFile(nodes, edges)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "umlith-diagram.json"; a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) throw new Error();
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
        alert("Diagram imported successfully.");
      } catch {
        alert("Invalid UMLith JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function handleClear() {
    if (!nodes.length && !edges.length) return;
    if (window.confirm("Clear the entire diagram?")) {
      clearAll();
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
    }
  }

  const sourceName = selectedEdge ? nodes.find(n => n.id === selectedEdge.source)?.data.name : "";
  const targetName = selectedEdge ? nodes.find(n => n.id === selectedEdge.target)?.data.name : "";

  return <div className="app">
    <Header />
    <main className="main-container">
      <StatsPanel nodes={nodes} edges={edges} />

      <Toolbar
        onAddClass={addClass}
        onAddInterface={addInterface}
        onSave={handleSave}
        onLoad={handleLoad}
        onDelete={handleDelete}
        onClear={handleClear}
        onExport={handleExport}
        onImport={() => fileInput.current?.click()}
        hasSelection={Boolean(selectedNodeId || selectedEdgeId)}
      />
      <input ref={fileInput} type="file" accept=".json,application/json" hidden onChange={handleImport}/>

      <div className="workspace">
        <section className="canvas-card">
          <div className="canvas-heading">
            <div><span className="eyebrow">ARCHITECTURE CANVAS</span><h2>Design your UML</h2></div>
            <div className="canvas-tip">Drag nodes • Connect handles • Click to edit</div>
          </div>
          <div className="diagram-canvas">
            {!nodes.length && <div className="canvas-empty">
              <div className="empty-orbit">◇</div>
              <h3>Start Building</h3>
              <p>Add a class or interface, then connect elements to model your architecture.</p>
              <button onClick={addClass}>+ Add First Class</button>
            </div>}
            <ReactFlow
              nodes={nodes}
              edges={styledEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleEdgeClick}
              onPaneClick={paneClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: .25 }}
              deleteKeyCode={null}
              minZoom={0.25}
              maxZoom={1.8}
            >
              <Background gap={24} size={1}/>
              <Controls/>
              <MiniMap nodeColor={(node) => node.data.type === "interface" ? "#22d3ee" : "#8b5cf6"}/>
            </ReactFlow>
          </div>
        </section>

        {selectedEdge ? (
          <EdgeEditor
            edge={selectedEdge}
            sourceName={sourceName}
            targetName={targetName}
            onUpdate={(id, data) => { updateEdgeData(id, data); setSelectedEdgeId(null); }}
            onDelete={(id) => { deleteEdge(id); setSelectedEdgeId(null); }}
            onClose={() => setSelectedEdgeId(null)}
          />
        ) : (
          <ClassEditor
            node={selectedNode}
            onUpdate={(id, data) => { updateNodeData(id, data); setSelectedNodeId(id); }}
            onClose={() => setSelectedNodeId(null)}
          />
        )}
      </div>

      <CodePanel nodes={nodes} edges={edges}/>
      <Infographic/>
    </main>
    <Footer/>
  </div>;
}

export default App;