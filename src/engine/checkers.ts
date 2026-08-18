import type { Artifact, CheckResult, CheckerName, Rule } from "../types.ts";

type Checker = (rule: Rule, artifacts: Artifact[]) => CheckResult;

function extension(name: string): string {
  return name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";
}

function inScope(artifact: Artifact, rule: Rule): boolean {
  const extensions = rule.scope.extensions?.map((item) => item.replace(/^\./, "").toLowerCase());
  const names = rule.scope.names?.map((item) => item.toLowerCase());
  return (!extensions?.length || extensions.includes(extension(artifact.name)))
    && (!names?.length || names.includes(artifact.name.toLowerCase()));
}

function base(rule: Rule, status: CheckResult["status"], expectation: string, observation: string, evidence: string[], remediation?: string): CheckResult {
  return { ruleId: rule.id, status, severity: rule.severity, source: rule.source, expectation, observation, evidence, remediation };
}

function compareCount(value: number, rule: Rule): boolean {
  const { equal, min, max } = rule.expected;
  return (typeof equal !== "number" || value === equal)
    && (min === undefined || value >= min)
    && (max === undefined || value <= max);
}

function expectationRange(rule: Rule, unit: string): string {
  const { equal, min, max } = rule.expected;
  if (equal !== undefined) return `${equal} ${unit}`;
  if (min !== undefined && max !== undefined) return `${min}-${max} ${unit}`;
  if (min !== undefined) return `at least ${min} ${unit}`;
  return `at most ${max} ${unit}`;
}

const fileCount: Checker = (rule, artifacts) => {
  const matches = artifacts.filter((artifact) => inScope(artifact, rule));
  const ok = compareCount(matches.length, rule);
  const unit = matches.length === 1 ? "matching file" : "matching files";
  return base(rule, ok ? "pass" : "fail", expectationRange(rule, "matching files"), `${matches.length} ${unit} found`, matches.map((item) => item.name), ok ? undefined : "Add or remove files so the package matches the required count.");
};

const fileName: Checker = (rule, artifacts) => {
  const expected = typeof rule.expected.equal === "string" ? rule.expected.equal : undefined;
  const pattern = rule.expected.matches;
  const regex = pattern ? new RegExp(`^${pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replaceAll("*", ".*").replaceAll("?", ".")}$`, "i") : undefined;
  const match = artifacts.find((artifact) => expected ? artifact.name === expected : regex?.test(artifact.name));
  const target = expected ?? pattern ?? "the required pattern";
  return base(rule, match ? "pass" : "fail", expected ? `file named ${target}` : `filename matching ${target}`, match ? `${match.name} is present` : `${target} was not found`, artifacts.map((item) => item.name), match ? undefined : `Rename or add a file that matches ${target}.`);
};

const fileExtension: Checker = (rule, artifacts) => {
  const allowed = (rule.expected.oneOf ?? []).map((item) => item.replace(/^\./, "").toLowerCase());
  if (!artifacts.length) return base(rule, "skipped", `extensions: ${allowed.join(", ")}`, "No files were available", [], "Add the files described by this requirement.");
  const invalid = artifacts.filter((artifact) => !allowed.includes(extension(artifact.name)));
  return base(rule, invalid.length ? "fail" : "pass", `extensions: ${allowed.join(", ")}`, invalid.length ? `${invalid.length} ${invalid.length === 1 ? "file uses" : "files use"} another extension` : "All files use allowed extensions", artifacts.map((item) => `${item.name} (.${extension(item.name) || "none"})`), invalid.length ? "Convert or replace files that use an unsupported extension." : undefined);
};

const fileMaxSize: Checker = (rule, artifacts) => {
  const matches = artifacts.filter((artifact) => inScope(artifact, rule));
  if (!matches.length) return base(rule, "skipped", "matching files within the size limit", "No compatible file was available", [], "Add the file described by this requirement.");
  const max = rule.expected.max ?? 0;
  const oversized = matches.filter((artifact) => artifact.size > max);
  return base(rule, oversized.length ? "fail" : "pass", `at most ${max} bytes per file`, oversized.length ? `${oversized.length} ${oversized.length === 1 ? "file exceeds" : "files exceed"} the limit` : "All matching files are within the limit", matches.map((item) => `${item.name}: ${item.size} bytes`), oversized.length ? "Compress or replace the oversized file." : undefined);
};

function readable(rule: Rule, artifacts: Artifact[]): Artifact[] {
  return artifacts.filter((artifact) => inScope(artifact, rule) && artifact.text !== undefined);
}

const wordCount: Checker = (rule, artifacts) => {
  const matches = readable(rule, artifacts);
  if (!matches.length) return base(rule, "skipped", expectationRange(rule, "words"), "No readable text was available", [], "Use a supported text file or verify this requirement manually.");
  const counts = matches.map((artifact) => ({ artifact, count: artifact.text!.trim() ? artifact.text!.trim().split(/\s+/).length : 0 }));
  const failed = counts.filter(({ count }) => !compareCount(count, rule));
  return base(rule, failed.length ? "fail" : "pass", expectationRange(rule, "words"), failed.length ? `${failed.length} ${failed.length === 1 ? "file falls" : "files fall"} outside the range` : "All matching files are within the word range", counts.map(({ artifact, count }) => `${artifact.name}: ${count} words`), failed.length ? "Adjust the text length and run the preflight again." : undefined);
};

const includesText: Checker = (rule, artifacts) => {
  const matches = readable(rule, artifacts);
  const phrase = rule.expected.includes ?? "";
  if (!matches.length) return base(rule, "skipped", `include “${phrase}”`, "No readable text was available", [], "Use a supported text file or verify this requirement manually.");
  const found = matches.some((artifact) => artifact.text!.toLowerCase().includes(phrase.toLowerCase()));
  return base(rule, found ? "pass" : "fail", `include “${phrase}”`, found ? "Required phrase found" : "Required phrase not found", matches.map((item) => `${item.name}: searched readable text`), found ? undefined : `Add the required phrase “${phrase}”.`);
};

const heading: Checker = (rule, artifacts) => {
  const matches = readable(rule, artifacts);
  const wanted = rule.expected.includes ?? "";
  if (!matches.length) return base(rule, "skipped", `heading “${wanted}”`, "No readable text was available", [], "Use a supported text file or verify this requirement manually.");
  const pattern = new RegExp(`^\\s{0,3}#{1,6}\\s+${wanted.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "im");
  const found = matches.some((artifact) => pattern.test(artifact.text!));
  return base(rule, found ? "pass" : "fail", `heading “${wanted}”`, found ? "Required heading found" : "Required heading not found", matches.map((item) => `${item.name}: searched headings`), found ? undefined : `Add a heading titled “${wanted}”.`);
};

const manual: Checker = (rule) => base(rule, "review", rule.expected.prompt ?? rule.source, "Human confirmation required", [], "Review this requirement and mark it complete outside BriefLint.");

export const CHECKERS: Record<CheckerName, Checker> = {
  "file.count": fileCount,
  "file.name": fileName,
  "file.extension": fileExtension,
  "file.maxSize": fileMaxSize,
  "text.wordCount": wordCount,
  "text.includes": includesText,
  "text.heading": heading,
  "manual.confirm": manual,
};
