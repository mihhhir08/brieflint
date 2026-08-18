import { CHECKERS } from "./checkers.ts";
import type { Artifact, CheckResult, PreflightPack, PreflightRun } from "../types.ts";

export function runPreflight(pack: PreflightPack, artifacts: Artifact[], now = new Date()): PreflightRun {
  const results = pack.rules
    .filter((rule) => rule.enabled)
    .map((rule): CheckResult => CHECKERS[rule.checker](rule, artifacts));

  const summary = {
    ready: results.every((result) => result.severity === "advisory" || result.status === "pass"),
    pass: results.filter((result) => result.status === "pass").length,
    fail: results.filter((result) => result.status === "fail").length,
    review: results.filter((result) => result.status === "review").length,
    skipped: results.filter((result) => result.status === "skipped").length,
  };

  return {
    schemaVersion: 1,
    createdAt: now.toISOString(),
    pack,
    artifacts: artifacts.map(({ id, name, size, type }) => ({ id, name, size, type })),
    results,
    summary,
  };
}
