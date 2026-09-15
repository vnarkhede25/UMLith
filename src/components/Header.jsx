import React from "react";
import { motion } from "framer-motion";
import { Network, Sparkles, Github } from "lucide-react";

export default function Header() {
  return (
    <motion.header className="app-header"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .65 }}>
      <div className="brand-section">
        <motion.div className="brand-icon"
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity }}>
          <Network size={25} />
        </motion.div>
        <div>
          <div className="brand-title">UMLith <Sparkles size={16} /></div>
          <div className="brand-subtitle">Visual Architecture → Java Source</div>
        </div>
      </div>
      <div className="header-right">
        <div className="student-badge">
          <div>
            <strong>Vaishnavi Narkhede</strong>
            <span>Rollno: 48</span>
          </div>
        </div>
        <div className="live-pill"><span /> LIVE EDITOR</div>
      </div>
    </motion.header>
  );
}