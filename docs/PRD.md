# BriefLint product requirements

Status: Implemented for v0.1 public alpha

Target: v0.1 public alpha

Last updated: 2026-08-18

## 1. Product summary

BriefLint is a local-first preflight agent for file-based deliverables. A user provides requirements and candidate files. BriefLint converts the requirements into an inspectable contract, chooses safe checks, executes them, and produces an evidence-backed readiness report.

The product does not answer “is this probably fine?” It answers “which stated requirements can be proven, which fail, and which still require a human?”

## 2. Primary users

### Student

Before an assignment or application deadline, checks that the correct files, names, types, limits, links, and required sections are present.

### Creator

Before sending sponsor work or publishing a content package, checks required formats, dimensions, counts, naming, disclosures, and included assets.

### General user

Before sending a high-stakes package, checks that the attachments agree with a written checklist or brief.

## 3. Jobs to be done

- When I have prose requirements and several files, help me turn the prose into a checklist I can inspect.
- When I am close to a deadline, run objective checks faster and more consistently than I can.
- When a requirement cannot be proven automatically, tell me clearly instead of guessing.
- When something fails, show the evidence and the smallest useful next action.
- When I repeat the same workflow, let me save and share the contract as a preflight pack.

## 4. Version 0.1 scope

### Inputs

- Requirements pasted as plain text
- An optional reusable BriefLint pack
- Files selected or dropped into the browser
- Optional user corrections to the compiled contract

### Requirement compilation

- Split requirement prose into atomic statements
- Detect explicit constraints for file count, filename, extension, maximum size, minimum/maximum words, required phrases, and required sections
- Preserve the original source text for every compiled rule
- Assign a confidence and checker type
- Route ambiguous requirements to manual review

### Verification

- Inspect files without uploading them
- Execute supported deterministic checks
- Produce one of four states: `pass`, `fail`, `review`, or `skipped`
- Attach evidence, rule source, and remediation guidance to every result
- Summarize package readiness without converting unknowns into passes

### Outputs

- Interactive results view
- Filterable result list
- Downloadable JSON report
- Downloadable reusable pack
- Stable demo pack and sample files in the repository

## 5. Explicit non-goals

- Automatic submission, email sending, or publication
- In-place editing of source files
- AI-authorship, plagiarism, or originality detection
- Subjective grading of creative quality
- Legal or regulatory certification
- Accounts, cloud storage, billing, teams, or telemetry in v0.1
- OCR and password-protected archive inspection in v0.1

## 6. Core experience

1. The user pastes a brief or chooses an example.
2. BriefLint compiles a draft contract and highlights what it understood.
3. The user can disable, correct, or add a rule before execution.
4. The user drops the candidate files.
5. BriefLint runs the plan locally and streams result states.
6. The readiness summary separates failures from human-review items.
7. The user exports the report or pack, corrects the package, and runs again.

## 7. Functional requirements

| ID | Requirement | Acceptance condition |
| --- | --- | --- |
| FR-01 | Accept pasted prose | Multi-line text can be compiled without a network request |
| FR-02 | Preserve provenance | Every generated rule retains its exact source sentence |
| FR-03 | Allow correction | Generated rules can be enabled, disabled, edited, or deleted |
| FR-04 | Accept multiple files | Drag/drop and file picker both support a package of files |
| FR-05 | Check file inventory | Count, filename, extension, and size constraints return evidence |
| FR-06 | Check readable text | Word limits, required phrases, and required headings run on supported text files |
| FR-07 | Be honest about limits | Unsupported content produces `review` or `skipped`, never an inferred pass |
| FR-08 | Explain results | Each result includes status, observed value, expected value, and next action |
| FR-09 | Export evidence | The full run can be downloaded as versioned JSON |
| FR-10 | Reuse contracts | A compiled pack can be downloaded and loaded again |
| FR-11 | Work offline | The shipped core workflow functions after initial page load without an API key |
| FR-12 | Protect source files | No verification action mutates selected files |

## 8. Quality requirements

- A first-time user reaches a result in under three minutes.
- The demo completes in under two seconds on a typical laptop.
- Keyboard and screen-reader users can complete the primary workflow.
- The interface works from 360 px mobile width through large desktop screens.
- No user file contents leave the browser in the default build.
- Identical inputs and pack versions produce identical deterministic results.

## 9. Success measures

The public alpha will instrument no analytics. Validation uses opt-in issue templates, discussions, and structured user tests.

- At least 8 of 10 test users complete the demo without instruction.
- At least 7 of 10 correctly explain the difference between `fail` and `review`.
- At least 5 community-authored packs or checks are proposed within the first public feedback cycle.
- No confirmed case of a failed or unverifiable rule displayed as passed.

## 10. Release gate

Version 0.1 is ready when:

- The core demo and all deterministic check types pass automated tests.
- A clean clone can install and start using documented commands.
- The example assignment and creator packs both produce expected reports.
- Accessibility, responsive behavior, and local-only claims are manually verified.
- Security limitations and unsupported formats are visible in-product and in documentation.
