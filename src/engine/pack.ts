import { CHECKERS } from "./checkers.ts";
import type { CheckerName, PreflightPack, Rule } from "../types.ts";

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function validExpected(checker: CheckerName, expected: Record<string, unknown>): boolean {
  const number = (key: string) => typeof expected[key] === "number" && Number.isFinite(expected[key]);
  const text = (key: string) => typeof expected[key] === "string" && Boolean((expected[key] as string).trim());

  if (checker === "file.count") return number("equal") || number("min") || number("max");
  if (checker === "file.name") return text("equal");
  if (checker === "file.extension") return stringArray(expected.oneOf) && expected.oneOf.length > 0;
  if (checker === "file.maxSize") return number("max") && (expected.max as number) >= 0;
  if (checker === "text.wordCount") return number("min") || number("max");
  if (checker === "text.includes" || checker === "text.heading") return text("includes");
  return text("prompt");
}

export function parsePack(input: unknown): PreflightPack {
  if (!record(input)) throw new Error("Pack must be a JSON object.");
  const pack = input as Partial<PreflightPack>;
  if (pack.version !== 1) throw new Error("Only preflight pack version 1 is supported.");
  if (typeof pack.$schema !== "string") throw new Error("Pack schema is required.");
  if (typeof pack.id !== "string" || typeof pack.name !== "string") throw new Error("Pack id and name are required.");
  if (!Array.isArray(pack.rules) || pack.rules.length === 0) throw new Error("Pack must contain at least one rule.");

  const ids = new Set<string>();
  for (const candidate of pack.rules as unknown[]) {
    if (!record(candidate) || typeof candidate.id !== "string" || !candidate.id.trim()) throw new Error("Every rule needs an id.");
    if (ids.has(candidate.id)) throw new Error(`Duplicate rule id: ${candidate.id}`);
    ids.add(candidate.id);
    if (typeof candidate.checker !== "string" || !(candidate.checker in CHECKERS)) throw new Error(`Unknown checker: ${String(candidate.checker)}`);
    if (typeof candidate.source !== "string" || !candidate.source.trim()) throw new Error(`Rule ${candidate.id} needs source text.`);
    if (!record(candidate.scope)) throw new Error(`Rule ${candidate.id} needs a valid scope.`);
    if (candidate.scope.extensions !== undefined && !stringArray(candidate.scope.extensions)) throw new Error(`Rule ${candidate.id} has invalid scope extensions.`);
    if (candidate.scope.names !== undefined && !stringArray(candidate.scope.names)) throw new Error(`Rule ${candidate.id} has invalid scope names.`);
    if (!record(candidate.expected) || !validExpected(candidate.checker as CheckerName, candidate.expected)) throw new Error(`Rule ${candidate.id} has an invalid expectation.`);
    if (candidate.severity !== "required" && candidate.severity !== "advisory") throw new Error(`Rule ${candidate.id} has an invalid severity.`);
    if (typeof candidate.enabled !== "boolean") throw new Error(`Rule ${candidate.id} needs an enabled state.`);
    if (candidate.confidence !== undefined && (typeof candidate.confidence !== "number" || candidate.confidence < 0 || candidate.confidence > 1)) throw new Error(`Rule ${candidate.id} has invalid confidence.`);
  }

  return pack as PreflightPack & { rules: Rule[] };
}
