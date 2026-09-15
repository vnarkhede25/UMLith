import React, { useMemo, useState } from "react";
import { Check, Clipboard, Download, FileCode2 } from "lucide-react";
import { generateAllJavaFiles, generateCombinedJava } from "../utils/javaGenerator";

export default function CodePanel({ nodes, edges }) {
  const [selectedFile, setSelectedFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const files = useMemo(() => generateAllJavaFiles(nodes, edges), [nodes, edges]);
  const active = files[selectedFile];
  const code = active?.content || "// Add a class to generate Java source code.";

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  function downloadCurrent() {
    if (!active) return;
    const blob = new Blob([active.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${active.className}.java`; a.click();
    URL.revokeObjectURL(url);
  }

  function downloadAll() {
    if (!files.length) return;
    const blob = new Blob([generateCombinedJava(nodes, edges)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "UMLith-generated-java.txt"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="code-panel">
      <div className="code-header">
        <div className="code-title"><FileCode2 size={19}/><div><span>JAVA SOURCE GENERATOR</span><small>{files.length} generated file{files.length !== 1 ? "s" : ""}</small></div></div>
        <div className="code-actions">
          <button onClick={copyCode} disabled={!active}>{copied ? <Check size={14}/> : <Clipboard size={14}/>} {copied ? "Copied" : "Copy"}</button>
          <button onClick={downloadCurrent} disabled={!active}><Download size={14}/> .java</button>
          <button onClick={downloadAll} disabled={!files.length}><Download size={14}/> All</button>
        </div>
      </div>
      {files.length > 0 && <div className="file-tabs">{files.map((f, i) => <button key={f.className} className={i === selectedFile ? "active" : ""} onClick={() => setSelectedFile(i)}>{f.className}.java</button>)}</div>}
      <div className="code-window">
        <div className="window-bar"><span/><span/><span/><label>{active ? `${active.className}.java` : "Generated.java"}</label></div>
        <pre><code>{code}</code></pre>
      </div>
    </section>
  );
}