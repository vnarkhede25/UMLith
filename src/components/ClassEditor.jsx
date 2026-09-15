import React, { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

const types = ["String","int","double","float","long","boolean","char","Object"];
const visibility = ["private","public","protected","package"];

export default function ClassEditor({ node, onUpdate, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (node) setData(JSON.parse(JSON.stringify(node.data)));
  }, [node]);

  if (!node || !data) return (
    <aside className="editor-panel empty-editor">
      <div className="editor-empty-icon">◇</div>
      <h3>Select a class or interface</h3>
      <p>Click a UML node to edit its architecture.</p>
    </aside>
  );

  const field = (name, value) => setData(d => ({ ...d, [name]: value }));

  const addAttribute = () => setData(d => ({
    ...d, attributes: [...d.attributes, { name: `attribute${d.attributes.length + 1}`, type: "String", visibility: "private" }]
  }));
  const removeAttribute = i => setData(d => ({ ...d, attributes: d.attributes.filter((_, x) => x !== i) }));
  const updateAttribute = (i, key, value) => setData(d => ({
    ...d, attributes: d.attributes.map((a, x) => x === i ? { ...a, [key]: value } : a)
  }));

  const addMethod = () => setData(d => ({
    ...d, methods: [...d.methods, { name: `method${d.methods.length + 1}`, visibility: "public", returnType: "void", parameters: [] }]
  }));
  const removeMethod = i => setData(d => ({ ...d, methods: d.methods.filter((_, x) => x !== i) }));
  const updateMethod = (i, key, value) => setData(d => ({
    ...d, methods: d.methods.map((m, x) => x === i ? { ...m, [key]: value } : m)
  }));

  const addParameter = i => setData(d => ({
    ...d, methods: d.methods.map((m, x) => x === i ? {
      ...m, parameters: [...(m.parameters || []), { name: `param${(m.parameters || []).length + 1}`, type: "String" }]
    } : m)
  }));
  const removeParameter = (mi, pi) => setData(d => ({
    ...d, methods: d.methods.map((m, x) => x === mi ? { ...m, parameters: (m.parameters || []).filter((_, p) => p !== pi) } : m)
  }));
  const updateParameter = (mi, pi, key, value) => setData(d => ({
    ...d, methods: d.methods.map((m, x) => x === mi ? {
      ...m, parameters: (m.parameters || []).map((p, y) => y === pi ? { ...p, [key]: value } : p)
    } : m)
  }));

  return (
    <aside className="editor-panel">
      <div className="editor-title-row">
        <div><span className="eyebrow">UML EDITOR</span><h2>Edit {data.name}</h2></div>
        <button className="icon-button" onClick={onClose}><X size={17}/></button>
      </div>

      <div className="form-group">
        <label>Class / Interface Name</label>
        <input value={data.name} onChange={e => field("name", e.target.value)} />
      </div>

      <div className="form-group">
        <label>Element Type</label>
        <select value={data.type} onChange={e => field("type", e.target.value)}>
          <option value="class">Class</option>
          <option value="interface">Interface</option>
        </select>
      </div>

      {data.type === "class" && (
        <>
          <div className="form-group">
            <label>Extends</label>
            <input value={data.extendsClass || ""} onChange={e => field("extendsClass", e.target.value)} placeholder="Optional parent class" />
          </div>
          <div className="form-group">
            <label>Implements (comma separated)</label>
            <input value={(data.implementsInterfaces || []).join(", ")} onChange={e => field("implementsInterfaces", e.target.value.split(",").map(x => x.trim()).filter(Boolean))} placeholder="Runnable, Serializable" />
          </div>
        </>
      )}

      <div className="editor-section">
        <div className="section-heading"><span>Attributes</span><button className="small-add-button" onClick={addAttribute}><Plus size={14}/></button></div>
        {data.attributes.map((a, i) => (
          <div className="member-editor" key={i}>
            <input value={a.name} onChange={e => updateAttribute(i, "name", e.target.value)} placeholder="name"/>
            <select value={a.type} onChange={e => updateAttribute(i, "type", e.target.value)}>{types.map(t => <option key={t}>{t}</option>)}</select>
            <select value={a.visibility} onChange={e => updateAttribute(i, "visibility", e.target.value)}>{visibility.map(v => <option key={v}>{v}</option>)}</select>
            <button className="delete-member" onClick={() => removeAttribute(i)}><Trash2 size={13}/></button>
          </div>
        ))}
        {!data.attributes.length && <p className="editor-hint">No attributes yet.</p>}
      </div>

      <div className="editor-section">
        <div className="section-heading"><span>Methods</span><button className="small-add-button" onClick={addMethod}><Plus size={14}/></button></div>
        {data.methods.map((m, i) => (
          <div className="method-card" key={i}>
            <div className="method-top">
              <input value={m.name} onChange={e => updateMethod(i, "name", e.target.value)} placeholder="methodName"/>
              <select value={m.visibility} onChange={e => updateMethod(i, "visibility", e.target.value)}>{visibility.filter(v => v !== "package").map(v => <option key={v}>{v}</option>)}</select>
              <select value={m.returnType} onChange={e => updateMethod(i, "returnType", e.target.value)}>{["void", ...types].map(t => <option key={t}>{t}</option>)}</select>
              <button className="delete-member" onClick={() => removeMethod(i)}><Trash2 size={13}/></button>
            </div>
            <div className="parameter-title"><span>Parameters</span><button className="tiny-add" onClick={() => addParameter(i)}>+ parameter</button></div>
            {(m.parameters || []).map((p, pi) => (
              <div className="parameter-row" key={pi}>
                <input value={p.name} onChange={e => updateParameter(i, pi, "name", e.target.value)} placeholder="name"/>
                <select value={p.type} onChange={e => updateParameter(i, pi, "type", e.target.value)}>{types.map(t => <option key={t}>{t}</option>)}</select>
                <button className="delete-member" onClick={() => removeParameter(i, pi)}><Trash2 size={12}/></button>
              </div>
            ))}
          </div>
        ))}
        {!data.methods.length && <p className="editor-hint">No methods yet.</p>}
      </div>

      <button className="save-editor-button" onClick={() => onUpdate(node.id, data)}>Save Changes</button>
    </aside>
  );
}