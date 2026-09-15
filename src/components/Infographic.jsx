import React from "react";
import { motion } from "framer-motion";
import { PencilRuler, Network, WandSparkles, FileCode2, ArrowRight } from "lucide-react";

const steps = [
  [PencilRuler, "Design", "Create classes and interfaces visually."],
  [Network, "Connect", "Model association, inheritance and composition."],
  [WandSparkles, "Transform", "UMLith interprets the architecture."],
  [FileCode2, "Generate", "Produce structured Java source files."]
];

export default function Infographic() {
  return <section className="infographic">
    <span className="section-label">UMLITH PIPELINE</span>
    <h2>Architecture → Logic → Code</h2>
    <p className="infographic-subtitle">A visual workflow for turning software design into a Java-ready architecture.</p>
    <div className="workflow">{steps.map(([Icon, title, text], i) => <div className="workflow-item" key={title}>
      <motion.div className="workflow-card" whileHover={{y:-7, scale:1.015}}>
        <span className="workflow-number">0{i+1}</span><div className="workflow-icon"><Icon size={21}/></div>
        <h3>{title}</h3><p>{text}</p>
      </motion.div>
      {i < steps.length - 1 && <ArrowRight className="workflow-arrow" size={20}/>}
    </div>)}</div>
  </section>;
}