import React from "react";
import { Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-brand"><Code2 size={17} /> UMLith</div>
      <div>Interactive UML Class Diagram Generator</div>
      <div className="copyright">© 2026 Vaishnavi Narkhede | Rollno: 48</div>
    </footer>
  );
}