import { CHECKERS } from "./checkers.ts";
import type { PreflightPack } from "../types.ts";

export function parsePack(input: unknown): PreflightPack {
  if (!input || typeof input !== "object") throw new Error("Pack must be a JSON object.");
  const pack = input as Partial<PreflightPack>;
  if (pack.version !== 1) throw new Error("Only preflight pack version 1 is supported.");
  if (typeof pack.id !== "string" || typeof pack.name !== "string") throw new Error("Pack id and name are required.");
  if (!Array.isArray(pack.rules) || pack.rules.length === 0) throw new Error("Pack must contain at least one rule.");

  const ids = new Set<string>();
  for (const rule of pack.rules) {
    if (!rule || typeof rule !== "object" || typeof rule.id !== "string") throw new Error("Every rule needs an id.");
    if (ids.has(rule.id)) throw new Error(`Duplicate rule id: ${rule.id}`);
    ids.add(rule.id);
    if (!(rule.checker in CHECKERS)) throw new Error(`Unknown checker: ${rule.checker}`);
    if (typeof rule.source !== "string" || !rule.source.trim()) throw new Error(`Rule ${rule.id} needs source text.`);
    if (!rule.expected || typeof rule.expected !== "object") throw new Error(`Rule ${rule.id} needs an expectation.`);
    if (rule.severity !== "required" && rule.severity !== "advisory") throw new Error(`Rule ${rule.id} has an invalid severity.`);
  }

  return pack as PreflightPack;
}
