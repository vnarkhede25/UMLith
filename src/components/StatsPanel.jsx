import React from "react";
import { motion } from "framer-motion";
import { Box, Braces, GitBranch, FunctionSquare, Workflow } from "lucide-react";

export default function StatsPanel({ nodes, edges }) {
  const classes = nodes.filter(n => n.data.type === "class").length;
  const interfaces = nodes.filter(n => n.data.type === "interface").length;
  const attributes = nodes.reduce((t, n) => t + (n.data.attributes?.length || 0), 0);
  const methods = nodes.reduce((t, n) => t + (n.data.methods?.length || 0), 0);
  const cards = [
    ["Classes", classes, Box], ["Interfaces", interfaces, Braces],
    ["Attributes", attributes, GitBranch], ["Methods", methods, FunctionSquare]
  ];
  return <div className="stats-grid">
    {cards.map(([label, value, Icon], i) => <motion.div className="stat-card" key={label} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*.06}}>
      <div className="stat-icon"><Icon size={18}/></div><div><strong>{value}</strong><span>{label}</span></div>
    </motion.div>)}
    <div className="relationship-count"><div><Workflow size={17}/><span>Relationships</span></div><strong>{edges.length}</strong></div>
  </div>;
}