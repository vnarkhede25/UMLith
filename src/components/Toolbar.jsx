import React from "react";
import { Plus, GitBranch, Save, FolderOpen, Trash2, RotateCcw, Download, Upload } from "lucide-react";

export default function Toolbar({
  onAddClass, onAddInterface, onSave, onLoad, onDelete,
  onClear, onExport, onImport, hasSelection
}) {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button className="toolbar-button primary" onClick={onAddClass}><Plus size={16}/> Class</button>
        <button className="toolbar-button" onClick={onAddInterface}><GitBranch size={16}/> Interface</button>
      </div>
      <div className="toolbar-group">
        <button className="toolbar-button" onClick={onSave}><Save size={15}/> Save</button>
        <button className="toolbar-button" onClick={onLoad}><FolderOpen size={15}/> Load</button>
        <button className="toolbar-button" onClick={onExport}><Download size={15}/> JSON</button>
        <button className="toolbar-button" onClick={onImport}><Upload size={15}/> Import</button>
        <button className="toolbar-button danger" disabled={!hasSelection} onClick={onDelete}><Trash2 size={15}/> Delete</button>
        <button className="toolbar-button danger" onClick={onClear}><RotateCcw size={15}/> Clear</button>
      </div>
    </div>
  );
}