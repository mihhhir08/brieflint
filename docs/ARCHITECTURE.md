# Architecture

## Decision

Version 0.1 is a single client-side TypeScript application built with React and Vite. The requirement compiler, rule engine, file adapters, report model, and interface live in one package with clear module boundaries.

This is intentional. A backend, database, authentication layer, queue, agent framework, and monorepo would add deployment and contribution cost without improving the first user outcome.

## System flow

```text
requirements text / saved pack
              |
              v
      requirement compiler
              |
              v
       editable rule plan <----- user approval
              |
        +-----+-----+
        |           |
        v           v
 file inventory   text extraction
        |           |
        +-----+-----+
              v
       deterministic checks
              |
              v
      evidence result ledger
              |
        +-----+-----+
        |           |
        v           v
 interactive UI   JSON export
```

## Agent model

BriefLint is agentic through an inspectable control loop rather than a chat facade:

1. **Observe:** read the requirements and available artifact capabilities.
2. **Plan:** compile atomic rules and select a checker for each.
3. **Approve:** expose the plan for user correction before execution.
4. **Act:** run deterministic inspection tools against immutable artifact snapshots.
5. **Evaluate:** compare observed evidence with expected constraints.
6. **Report:** preserve successes, failures, uncertainty, and remediation.
7. **Repeat:** run the same contract against a corrected package.

No model is required for this loop. Later semantic adapters may propose rules, but they must produce the same contract format and can never bypass evidence or approval.

## Proposed source layout

```text
src/
  app/           application state and workflow screens
  components/    reusable interface primitives
  engine/        compiler, check registry, evaluator, report builder
  inspectors/    browser file and text inspection
  packs/         schema, validation, bundled examples
  styles/        tokens and global presentation
  types.ts       shared domain model
examples/        briefs, files, and expected reports
docs/            product and contributor documentation
```

Extraction into separate packages is deferred until a second runtime, such as a CLI or editor extension, actually needs the engine.

## Data model

The smallest stable domain consists of:

- `PreflightPack`: versioned metadata and ordered rules
- `Rule`: source, checker, expected constraint, scope, and enabled state
- `Artifact`: immutable metadata plus optional extracted text
- `CheckResult`: status, expectation, observation, evidence, and remediation
- `PreflightRun`: pack snapshot, artifact inventory, results, and summary

All persisted objects carry a schema version. JSON exports exclude raw file contents.

## Checker contract

A checker is a pure function wherever browser APIs permit:

```ts
type Checker = (rule: Rule, artifacts: Artifact[]) => CheckResult;
```

The v0.1 registry is a plain object keyed by checker name. Plugin loading and runtime code execution are deferred; community contributions add reviewed checkers to the repository or publish data-only packs using existing checks.

## Supported artifact surface

The first release guarantees metadata checks for every browser-selected file and content checks for UTF-8 text-like formats such as `.txt`, `.md`, `.csv`, `.json`, and source-code files. Rich document parsing is added format by format only when trustworthy extraction and fixtures exist.

## State and persistence

- React state holds the active brief, draft rules, selected artifacts, and run.
- `localStorage` may retain interface preferences and the last brief, never file bytes.
- Downloads use browser `Blob` URLs.
- No server state exists in v0.1.

## Dependency policy

- Prefer browser APIs and the standard library.
- React and Vite provide the application/runtime boundary.
- Add a dependency only when it replaces substantial correctness-sensitive code.
- Keep parsing and evaluation independent from React so tests can call them directly.

## Deferred architecture

- Hosted collaboration
- Remote model providers
- Plugin sandboxing
- Native desktop packaging
- CLI and language-server protocols
- Persistent run history
- Automatic repairs

Each becomes relevant only after usage proves the corresponding need.
