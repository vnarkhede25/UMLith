import { useCallback } from "react";
import { addEdge, useEdgesState, useNodesState } from "@xyflow/react";

function newId() {
  return crypto.randomUUID();
}

export function makeClassNode(index = 0, type = "class") {
  const isInterface = type === "interface";
  return {
    id: newId(),
    type: "umlClass",
    position: {
      x: 80 + (index % 3) * 330,
      y: 70 + Math.floor(index / 3) * 300
    },
    data: {
      name: isInterface ? `Interface${index + 1}` : `Class${index + 1}`,
      type,
      attributes: [],
      methods: [],
      extendsClass: "",
      implementsInterfaces: []
    }
  };
}

export function useDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((connection) => {
    setEdges(current => addEdge({
      ...connection,
      id: newId(),
      animated: true,
      type: "smoothstep",
      data: {
        relationship: "association",
        label: "",
        multiplicitySource: "1",
        multiplicityTarget: "1"
      }
    }, current));
  }, [setEdges]);

  const addClass = useCallback(() => {
    setNodes(current => [...current, makeClassNode(current.length, "class")]);
  }, [setNodes]);

  const addInterface = useCallback(() => {
    setNodes(current => [...current, makeClassNode(current.length, "interface")]);
  }, [setNodes]);

  const updateNodeData = useCallback((nodeId, data) => {
    setNodes(current => current.map(node =>
      node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
    ));
  }, [setNodes]);

  const updateEdgeData = useCallback((edgeId, data) => {
    setEdges(current => current.map(edge =>
      edge.id === edgeId ? { ...edge, data: { ...edge.data, ...data } } : edge
    ));
  }, [setEdges]);

  const deleteNode = useCallback((nodeId) => {
    setNodes(current => current.filter(n => n.id !== nodeId));
    setEdges(current => current.filter(e => e.source !== nodeId && e.target !== nodeId));
  }, [setNodes, setEdges]);

  const deleteEdge = useCallback((edgeId) => {
    setEdges(current => current.filter(e => e.id !== edgeId));
  }, [setEdges]);

  const clearAll = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  return {
    nodes, setNodes, edges, setEdges,
    onNodesChange, onEdgesChange, onConnect,
    addClass, addInterface, updateNodeData, updateEdgeData,
    deleteNode, deleteEdge, clearAll
  };
}