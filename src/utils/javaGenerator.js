import { sanitizeJavaIdentifier } from "./validation";

const visibility = {
  public: "public",
  private: "private",
  protected: "protected",
  package: ""
};

const primitiveDefaults = {
  byte: "0",
  short: "0",
  int: "0",
  long: "0L",
  float: "0.0f",
  double: "0.0",
  boolean: "false",
  char: "'\\0'"
};

function vis(value, fallback = "private") {
  const result = visibility[value ?? fallback];
  return result ? `${result} ` : "";
}

function formatParams(params = []) {
  return params
    .filter(p => p?.name)
    .map(p => `${p.type || "String"} ${sanitizeJavaIdentifier(p.name, "param")}`)
    .join(", ");
}

function defaultReturn(type) {
  if (!type || type === "void") return "";
  if (primitiveDefaults[type]) return `return ${primitiveDefaults[type]};`;
  return "return null;";
}

function attributeCode(a) {
  return `    ${vis(a.visibility)}${a.type || "String"} ${sanitizeJavaIdentifier(a.name, "attribute")};`;
}

function methodCode(m, isInterface = false) {
  const name = sanitizeJavaIdentifier(m.name, "method");
  const returnType = m.returnType || "void";
  const signature = `    ${vis(m.visibility, isInterface ? "public" : "public")}${returnType} ${name}(${formatParams(m.parameters)})`;

  if (isInterface) return `${signature};`;

  const ret = defaultReturn(returnType);
  return ret ? `${signature} {\n        ${ret}\n    }` : `${signature} {\n    }`;
}

function relationshipField(edge, source, target, relation) {
  const targetName = sanitizeJavaIdentifier(target.name, "RelatedClass");
  const fieldName = sanitizeJavaIdentifier(
    relation.label || targetName.charAt(0).toLowerCase() + targetName.slice(1),
    "related"
  );
  const type = relation.multiplicityTarget === "*" ? `List<${targetName}>` : targetName;
  const initializer = relation.multiplicityTarget === "*" ? "new ArrayList<>()" : "null";
  return {
    type,
    fieldName,
    initializer,
    needsList: relation.multiplicityTarget === "*"
  };
}

function normalizeRelation(edge) {
  return {
    type: edge.data?.relationship || "association",
    label: edge.data?.label || "",
    multiplicitySource: edge.data?.multiplicitySource || "1",
    multiplicityTarget: edge.data?.multiplicityTarget || "1"
  };
}

export function generateJavaClass(node, nodes, edges) {
  const data = node.data;
  const isInterface = data.type === "interface";
  const className = sanitizeJavaIdentifier(data.name, "UnnamedClass");

  const outgoing = edges
    .filter(e => e.source === node.id)
    .map(e => ({ edge: e, target: nodes.find(n => n.id === e.target) }))
    .filter(x => x.target);

  const incoming = edges
    .filter(e => e.target === node.id)
    .map(e => ({ edge: e, source: nodes.find(n => n.id === e.source) }))
    .filter(x => x.source);

  let extendsName = data.extendsClass?.trim();
  let implementsNames = Array.isArray(data.implementsInterfaces) ? [...data.implementsInterfaces] : [];

  outgoing.forEach(({ edge, target }) => {
    const relation = normalizeRelation(edge);
    const targetName = sanitizeJavaIdentifier(target.data.name, "RelatedClass");
    if (relation.type === "inheritance") extendsName = targetName;
    if (relation.type === "implementation") implementsNames.push(targetName);
  });

  implementsNames = [...new Set(implementsNames.filter(Boolean))];

  const imports = new Set();
  const generatedRelationshipAttributes = [];

  outgoing.forEach(({ edge, target }) => {
    const relation = normalizeRelation(edge);
    if (["association", "aggregation", "composition"].includes(relation.type)) {
      const field = relationshipField(edge, data, target.data, relation);
      generatedRelationshipAttributes.push(field);
      if (field.needsList) imports.add("java.util.List");
      if (field.needsList) imports.add("java.util.ArrayList");
    }
  });

  incoming.forEach(({ edge, source }) => {
    const relation = normalizeRelation(edge);
    if (relation.type === "association" && relation.multiplicityTarget !== "1") {
      // Relationship can be represented from the source side; no duplicate field is generated here.
    }
  });

  const declaredAttributes = (data.attributes || []).map(attributeCode);
  const relationshipAttributes = generatedRelationshipAttributes.map(
    f => `    ${vis("private")}${f.type} ${f.fieldName}${f.needsList ? ` = ${f.initializer}` : ""};`
  );

  const attributes = [...declaredAttributes, ...relationshipAttributes];

  const methods = (data.methods || []).map(m => methodCode(m, isInterface));

  let declaration = `public ${isInterface ? "interface" : "class"} ${className}`;
  if (!isInterface && extendsName) declaration += ` extends ${sanitizeJavaIdentifier(extendsName, "BaseClass")}`;
  if (implementsNames.length) declaration += ` implements ${implementsNames.map(x => sanitizeJavaIdentifier(x, "Interface")).join(", ")}`;

  const body = [...attributes, ...methods].filter(Boolean).join("\n\n");

  const importText = [...imports].sort().map(i => `import ${i};`).join("\n");
  const content = `${importText ? importText + "\n\n" : ""}${declaration} {\n${body ? "\n" + body + "\n" : ""}}`;

  return { className, content };
}

export function generateAllJavaFiles(nodes, edges) {
  return nodes.map(node => generateJavaClass(node, nodes, edges));
}

export function generateCombinedJava(nodes, edges) {
  return generateAllJavaFiles(nodes, edges)
    .map(file => `// ===== ${file.className}.java =====\n\n${file.content}`)
    .join("\n\n\n");
}