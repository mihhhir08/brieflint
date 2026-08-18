import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { parsePack } from "./pack.ts";
import { runPreflight } from "./run.ts";
import type { Artifact, PreflightSummary } from "../types.ts";

async function json(relative: string): Promise<unknown> {
  return JSON.parse(await readFile(new URL(relative, import.meta.url), "utf8"));
}

test("assignment example reproduces its expected summary", async () => {
  const pack = parsePack(await json("../../examples/assignment-essay/pack.json"));
  const expected = await json("../../examples/assignment-essay/expected-summary.json") as PreflightSummary;
  const text = await readFile(new URL("../../examples/assignment-essay/files/final-essay.md", import.meta.url), "utf8");
  const artifacts: Artifact[] = [{ id: "essay", name: "final-essay.md", size: Buffer.byteLength(text), type: "text/markdown", text }];

  assert.deepEqual(runPreflight(pack, artifacts).summary, expected);
});

test("creator example reproduces its expected summary", async () => {
  const pack = parsePack(await json("../../examples/creator-delivery/pack.json"));
  const expected = await json("../../examples/creator-delivery/expected-summary.json") as PreflightSummary;
  const caption = await readFile(new URL("../../examples/creator-delivery/files/caption.txt", import.meta.url), "utf8");
  const hero = await stat(new URL("../../examples/creator-delivery/files/campaign-hero.webp", import.meta.url));
  const artifacts: Artifact[] = [
    { id: "hero", name: "campaign-hero.webp", size: hero.size, type: "image/webp" },
    { id: "caption", name: "caption.txt", size: Buffer.byteLength(caption), type: "text/plain", text: caption },
  ];

  assert.deepEqual(runPreflight(pack, artifacts).summary, expected);
});
