import assert from "node:assert/strict";
import test from "node:test";
import { compileBrief } from "./compiler.ts";
import { parsePack } from "./pack.ts";
import { runPreflight } from "./run.ts";
import type { Artifact } from "../types.ts";

const brief = [
  "Submit exactly one Markdown file named final-essay.md.",
  "The essay must be between 5 and 12 words.",
  "Include a section titled References.",
  "Include the exact phrase ‘independent analysis’.",
  "Confirm every external image has permission.",
].join("\n");

test("compiler extracts deterministic rules and preserves ambiguity", () => {
  const pack = compileBrief(brief, "Essay submission");
  assert.deepEqual(pack.rules.map((rule) => rule.checker), [
    "file.count",
    "file.name",
    "file.extension",
    "text.wordCount",
    "text.heading",
    "text.includes",
    "manual.confirm",
  ]);
  assert.equal(pack.rules[0].source, "Submit exactly one Markdown file named final-essay.md.");
  assert.equal(new Set(pack.rules.map((rule) => rule.id)).size, pack.rules.length);
});

test("passing package produces a ready report without leaking file text", () => {
  const pack = compileBrief(brief, "Essay submission");
  pack.rules = pack.rules.filter((rule) => rule.checker !== "manual.confirm");
  const artifacts: Artifact[] = [{
    id: "artifact-1",
    name: "final-essay.md",
    size: 140,
    type: "text/markdown",
    text: "# Independent analysis\nA short original argument.\n# References",
  }];
  const run = runPreflight(pack, artifacts, new Date("2026-08-17T12:00:00Z"));

  assert.equal(run.summary.ready, true);
  assert.equal(run.summary.pass, 6);
  assert.equal("text" in run.artifacts[0], false);
  assert.equal(JSON.stringify(run).includes("short original argument"), false);
});

test("failures and human review block readiness", () => {
  const pack = compileBrief(brief, "Essay submission");
  const artifacts: Artifact[] = [{ id: "artifact-1", name: "draft.txt", size: 12, text: "Too short" }];
  const run = runPreflight(pack, artifacts);

  assert.equal(run.summary.ready, false);
  assert.ok(run.summary.fail >= 1);
  assert.equal(run.summary.review, 1);
});

test("unreadable content is skipped rather than passed", () => {
  const pack = compileBrief("The essay must be at least 500 words.");
  const run = runPreflight(pack, [{ id: "artifact-1", name: "essay.pdf", size: 2_000 }]);

  assert.equal(run.results[0].status, "skipped");
  assert.equal(run.summary.ready, false);
});

test("pack parser rejects executable or unknown checker names", () => {
  const pack = compileBrief("Submit exactly one PDF file.");
  const unsafe = structuredClone(pack) as unknown as { rules: Array<{ checker: string }> };
  unsafe.rules[0].checker = "javascript.eval";

  assert.throws(() => parsePack(unsafe), /Unknown checker/);
});
