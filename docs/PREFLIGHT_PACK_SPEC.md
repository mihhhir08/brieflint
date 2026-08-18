# Preflight pack specification

Status: Draft for v0.1

A preflight pack is portable data describing what to verify. It contains no executable code.

## Example

```json
{
  "$schema": "https://brieflint.dev/schema/pack-v1.json",
  "version": 1,
  "id": "example.assignment-essay",
  "name": "Assignment essay",
  "description": "Checks a Markdown essay submission.",
  "rules": [
    {
      "id": "submission-file",
      "source": "Submit exactly one Markdown file named final-essay.md.",
      "checker": "file.count",
      "scope": { "extensions": ["md"] },
      "expected": { "equal": 1 },
      "severity": "required",
      "enabled": true
    },
    {
      "id": "required-heading",
      "source": "Include a section titled References.",
      "checker": "text.heading",
      "scope": { "extensions": ["md"] },
      "expected": { "includes": "References" },
      "severity": "required",
      "enabled": true
    }
  ]
}
```

## Top-level fields

| Field | Required | Meaning |
| --- | --- | --- |
| `$schema` | Yes | Canonical schema URL for tooling |
| `version` | Yes | Integer pack format version; v0.1 accepts `1` |
| `id` | Yes | Stable reverse-domain or namespaced identifier |
| `name` | Yes | Human-readable pack name |
| `description` | No | Short purpose statement |
| `rules` | Yes | Ordered array of one or more rules |

## Rule fields

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | Yes | Unique identifier within the pack |
| `source` | Yes | Original requirement text or author-written provenance |
| `checker` | Yes | Registered deterministic checker identifier |
| `scope` | Yes | Artifact selection constraints |
| `expected` | Yes | Checker-specific comparison data |
| `severity` | Yes | `required` or `advisory` |
| `enabled` | Yes | Whether the rule runs |

## Version 1 checker vocabulary

| Checker | Purpose | Expected shape |
| --- | --- | --- |
| `file.count` | Count matching files | `equal`, `min`, or `max` number |
| `file.name` | Match an exact name or safe pattern | `equal` or `matches` string |
| `file.extension` | Allow listed extensions | `oneOf` string array |
| `file.maxSize` | Enforce bytes per matching file | `max` number |
| `text.wordCount` | Count whitespace-delimited words | `min` and/or `max` number |
| `text.includes` | Require a literal phrase | `includes` string |
| `text.heading` | Require a Markdown-like heading | `includes` string |
| `manual.confirm` | Preserve an explicit human check | `prompt` string |

## Evaluation semantics

- A required rule returns `pass`, `fail`, `review`, or `skipped`.
- `review` means the evidence exists but requires human judgment.
- `skipped` means no compatible artifact or checker was available.
- Required `review` and `skipped` results prevent a ready verdict.
- Advisory failures are reported but do not prevent readiness.
- Every result contains the rule ID and a human-readable observation.

## Compatibility

Readers must reject unsupported major versions and unknown checker identifiers. Writers must preserve unknown top-level metadata when editing a pack, but v0.1 does not preserve unknown fields inside rules.
