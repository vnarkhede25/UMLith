import { javaKeywords } from "../data/javaKeywords";

export function isValidJavaIdentifier(value) {
  const name = String(value ?? "").trim();
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) && !javaKeywords.has(name);
}

export function sanitizeJavaIdentifier(value, fallback = "Unnamed") {
  let name = String(value ?? "").trim().replace(/[^A-Za-z0-9_$]/g, "");
  if (!name) name = fallback;
  if (/^[0-9]/.test(name)) name = `_${name}`;
  if (javaKeywords.has(name)) name = `${name}Value`;
  return name;
}

export function validateJavaName(value, label = "Name") {
  if (!String(value ?? "").trim()) return `${label} is required.`;
  if (!isValidJavaIdentifier(value)) return `${label} must be a valid Java identifier.`;
  return "";
}