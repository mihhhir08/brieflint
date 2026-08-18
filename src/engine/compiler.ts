import type { CheckerName, PreflightPack, Rule, RuleScope } from "../types.ts";

const EXTENSION_ALIASES: Record<string, string> = {
  csv: "csv",
  docx: "docx",
  jpeg: "jpg",
  jpg: "jpg",
  json: "json",
  markdown: "md",
  md: "md",
  pdf: "pdf",
  png: "png",
  text: "txt",
  txt: "txt",
  zip: "zip",
};

const NUMBER_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

function numberFrom(value: string): number {
  return NUMBER_WORDS[value.toLowerCase()] ?? Number(value.replaceAll(",", ""));
}

function splitRequirements(text: string): string[] {
  return text
    .replace(/\r/g, "")
    .split(/\n+|(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((part) => part.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
}

function extensionFrom(source: string): string | undefined {
  const dotted = source.match(/\.([a-z0-9]{2,5})\b/i)?.[1]?.toLowerCase();
  if (dotted) return dotted;

  const words = source.toLowerCase().match(/\b(?:csv|docx|jpe?g|json|markdown|md|pdf|png|text|txt|zip)\b/g);
  return words?.map((word) => EXTENSION_ALIASES[word]).find(Boolean);
}

function scopeFrom(source: string): RuleScope {
  const extension = extensionFrom(source);
  return extension ? { extensions: [extension] } : {};
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 42);
}

function rule(
  source: string,
  index: number,
  checker: CheckerName,
  expected: Rule["expected"],
  scope: RuleScope = scopeFrom(source),
  confidence = 0.96,
): Rule {
  return {
    id: `${String(index + 1).padStart(2, "0")}-${checker.replace(".", "-")}-${slug(source)}`,
    source,
    checker,
    scope,
    expected,
    severity: "required",
    enabled: true,
    confidence,
  };
}

function compileStatement(source: string, index: number): Rule[] {
  const rules: Rule[] = [];
  const lower = source.toLowerCase();
  const countMatch = lower.match(/(?:exactly|submit|include|provide)\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(?:[\w.-]+\s+)?files?\b/);
  if (countMatch) rules.push(rule(source, index, "file.count", { equal: numberFrom(countMatch[1]) }));

  const filenameMatch = source.match(/(?:file\s+)?named\s+["“']?([^"”'\s,;]+\.[a-z0-9]{1,8})["”']?/i);
  if (filenameMatch) rules.push(rule(source, index, "file.name", { equal: filenameMatch[1] }, {}));

  const extension = extensionFrom(source);
  if (extension && /\b(?:format|file type|extension|submit|upload|provide)\b/i.test(source)) {
    rules.push(rule(source, index, "file.extension", { oneOf: [extension] }, {}));
  }

  const sizeMatch = lower.match(/(?:under|less than|no (?:more|larger) than|maximum|max(?:imum)?(?: of)?)\s*([\d.]+)\s*(kb|mb|gb)\b/);
  if (sizeMatch) {
    const multiplier = { kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3 }[sizeMatch[2]];
    rules.push(rule(source, index, "file.maxSize", { max: Math.round(Number(sizeMatch[1]) * multiplier) }));
  }

  const rangeWords = lower.match(/between\s+([\d,]+)\s+and\s+([\d,]+)\s+words?\b/);
  const maxWords = lower.match(/(?:under|no more than|maximum|max(?:imum)?(?: of)?)\s+([\d,]+)\s+words?\b/);
  const minWords = lower.match(/(?:at least|minimum|min(?:imum)?(?: of)?)\s+([\d,]+)\s+words?\b/);
  if (rangeWords) {
    rules.push(rule(source, index, "text.wordCount", { min: numberFrom(rangeWords[1]), max: numberFrom(rangeWords[2]) }));
  } else if (maxWords) {
    rules.push(rule(source, index, "text.wordCount", { max: numberFrom(maxWords[1]) }));
  } else if (minWords) {
    rules.push(rule(source, index, "text.wordCount", { min: numberFrom(minWords[1]) }));
  }

  const headingMatch = source.match(/(?:section|heading)(?:\s+(?:titled|called|named))?\s+["“']?([^"”'.;]+)["”']?/i);
  if (headingMatch && /\b(?:include|contain|have|required|must)\b/i.test(source)) {
    rules.push(rule(source, index, "text.heading", { includes: headingMatch[1].trim() }));
  }

  const phraseMatch = source.match(/(?:include|contain)\s+(?:the\s+)?(?:exact\s+)?phrase\s+["“'‘]([^"”'’]+)["”'’]/i);
  if (phraseMatch) rules.push(rule(source, index, "text.includes", { includes: phraseMatch[1] }));

  return rules.length
    ? rules
    : [rule(source, index, "manual.confirm", { prompt: source }, {}, 0.5)];
}

export function compileBrief(text: string, name = "Compiled brief"): PreflightPack {
  const statements = splitRequirements(text);
  const rules = statements.flatMap(compileStatement).map((item, index) => ({
    ...item,
    id: `${String(index + 1).padStart(2, "0")}-${item.id.split("-").slice(1).join("-")}`,
  }));

  return {
    $schema: "https://brieflint.dev/schema/pack-v1.json",
    version: 1,
    id: `local.${slug(name) || "compiled-brief"}`,
    name,
    description: "Compiled locally from pasted requirements.",
    rules,
  };
}
