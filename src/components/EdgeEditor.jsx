import React, { useEffect, useState } from "react";
import { X, Link2, Trash2 } from "lucide-react";

const relations = [
  ["association", "Association"],
  ["inheritance", "Inheritance"],
  ["implementation", "Implementation"],
  ["aggregation", "Aggregation"],
  ["composition", "Composition"]
];

export default function EdgeEditor({ edge, sourceName, targetName, onUpdate, onDelete, onClose }) {
  const [data, setData] = useState(edge?.data || {});

  useEffect(() => setData(edge?.data || {}), [edge]);

  if (!edge) return null;

  const update = (field, value) => setData(d => ({ ...d, [field]: value }));

  return (
    <aside className="editor-panel edge-editor">
      <div className="editor-title-row">
        <div><span className="eyebrow">RELATIONSHIP</span><h2><Link2 size={17}/> Edit Edge</h2></div>
        <button className="icon-button" onClick={onClose}><X size={17}/></button>
      </div>
      <div className="relation-route"><b>{sourceName}</b><span>→</span><b>{targetName}</b></div>
      <div className="form-group">
        <label>Relationship Type</label>
        <select value={data.relationship || "association"} onChange={e => update("relationship", e.target.value)}>
          {relations.map(([v, l]) => <option value={v} key={v}>{l}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Label</label>
        <input value={data.label || ""} onChange={e => update("label", e.target.value)} placeholder="e.g. owns, teaches" />
      </div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Source Multiplicity</label>
          <select value={data.multiplicitySource || "1"} onChange={e => update("multiplicitySource", e.target.value)}>
            <option>1</option><option>0..1</option><option>0..*</option><option>1..*</option><option>*</option>
          </select>
        </div>
        <div className="form-group">
          <label>Target Multiplicity</label>
          <select value={data.multiplicityTarget || "1"} onChange={e => update("multiplicityTarget", e.target.value)}>
            <option>1</option><option>0..1</option><option>0..*</option><option>1..*</option><option>*</option>
          </select>
        </div>
      </div>
      <button className="save-editor-button" onClick={() => onUpdate(edge.id, data)}>Save Relationship</button>
      <button className="outline-danger-button" onClick={() => onDelete(edge.id)}><Trash2 size={15}/> Delete Relationship</button>
      <p className="editor-hint">Inheritance maps to <b>extends</b>, implementation maps to <b>implements</b>, and associations become Java object references.</p>
    </aside>
  );
}