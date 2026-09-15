import React from "react";
import { Handle, Position } from "@xyflow/react";

const symbol = { public: "+", private: "-", protected: "#", package: "~" };

export default function ClassNode({ data, selected }) {
  return (
    <div className={`uml-node ${selected ? "uml-node-selected" : ""} ${data.type === "interface" ? "is-interface" : ""}`}>
      <Handle type="target" position={Position.Top} />
      <div className="uml-node-header">
        {data.type === "interface" && <span className="interface-label">&lt;&lt;interface&gt;&gt;</span>}
        <span>{data.name || "Unnamed"}</span>
      </div>
      <div className="uml-section">
        {(data.attributes || []).length ? data.attributes.map((a, i) =>
          <div className="uml-member" key={i}>{symbol[a.visibility] || "~"} {a.name} : {a.type}</div>
        ) : <div className="empty-member">No attributes</div>}
      </div>
      <div className="uml-section">
        {(data.methods || []).length ? data.methods.map((m, i) =>
          <div className="uml-member" key={i}>
            {symbol[m.visibility] || "+"} {m.name}({(m.parameters || []).map(p => `${p.name} : ${p.type}`).join(", ")}) : {m.returnType || "void"}
          </div>
        ) : <div className="empty-member">No methods</div>}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}