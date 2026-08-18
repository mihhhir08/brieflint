# Security and trust model

## Default trust boundary

BriefLint v0.1 runs in the browser. Selected files remain on the user's device. The default build has no upload endpoint, user account, analytics SDK, or remote model call.

## Safety invariants

- Selected artifacts are read-only inputs.
- Raw file contents are not included in exported reports.
- Unsupported or failed extraction cannot produce a pass.
- Requirement provenance remains attached to generated rules.
- A generated rule is visible and editable before it affects the final report.
- Imported packs are data, never executable JavaScript.
- Rendered file text is escaped by React and never injected as HTML.

## Threats considered in v0.1

### Malicious or malformed files

The application limits text extraction by file type and byte size, handles read failures, and records unsupported inputs as review items. It does not unpack archives or execute macros, scripts, or embedded content.

### Malicious imported packs

Imported JSON is schema-validated. Unknown checker names and versions are rejected. Strings are treated as display data, not HTML or code.

### Sensitive data leakage

The application makes no network request during the preflight workflow. Exported JSON includes names, sizes, MIME types, check evidence, and hashes only where documented; it excludes raw file bodies.

### Misleading certainty

The result model separates `fail`, `review`, and `skipped`. Aggregate readiness cannot be “ready” while a required rule is failed or awaiting review.

## Known limitations

- Browser and extension behavior remains part of the user's trust boundary.
- Filename and MIME metadata can be inaccurate.
- Text extraction does not prove visual layout or rendering fidelity.
- BriefLint is not a malware scanner, compliance certification tool, or substitute for human review.
- A locally modified fork can change these guarantees; users should review its diff and build provenance.

## Vulnerability reporting

Do not disclose exploitable findings in a public issue. Until a private reporting channel is configured, contact the repository owner through the security contact listed in the GitHub profile and include “BriefLint security” in the subject.
