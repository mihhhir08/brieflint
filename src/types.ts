export type CheckStatus = "pass" | "fail" | "review" | "skipped";
export type Severity = "required" | "advisory";

export type CheckerName =
  | "file.count"
  | "file.name"
  | "file.extension"
  | "file.maxSize"
  | "text.wordCount"
  | "text.includes"
  | "text.heading"
  | "manual.confirm";

export interface RuleScope {
  extensions?: string[];
  names?: string[];
}

export interface RuleExpectation {
  equal?: string | number;
  min?: number;
  max?: number;
  oneOf?: string[];
  includes?: string;
  matches?: string;
  prompt?: string;
}

export interface Rule {
  id: string;
  source: string;
  checker: CheckerName;
  scope: RuleScope;
  expected: RuleExpectation;
  severity: Severity;
  enabled: boolean;
  confidence: number;
}

export interface PreflightPack {
  $schema: string;
  version: 1;
  id: string;
  name: string;
  description?: string;
  rules: Rule[];
}

export interface Artifact {
  id: string;
  name: string;
  size: number;
  type?: string;
  text?: string;
  readError?: string;
}

export interface CheckResult {
  ruleId: string;
  status: CheckStatus;
  severity: Severity;
  source: string;
  expectation: string;
  observation: string;
  evidence: string[];
  remediation?: string;
}

export interface PreflightSummary {
  ready: boolean;
  pass: number;
  fail: number;
  review: number;
  skipped: number;
}

export interface PreflightRun {
  schemaVersion: 1;
  createdAt: string;
  pack: PreflightPack;
  artifacts: Array<Pick<Artifact, "id" | "name" | "size" | "type">>;
  results: CheckResult[];
  summary: PreflightSummary;
}
