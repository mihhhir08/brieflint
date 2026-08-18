# BriefLint

> Lint any deliverable against any brief.

[![CI](https://github.com/mihhhir08/brieflint/actions/workflows/ci.yml/badge.svg)](https://github.com/mihhhir08/brieflint/actions/workflows/ci.yml)
[![Apache 2.0](https://img.shields.io/badge/license-Apache--2.0-20745a.svg)](LICENSE)
[![Local first](https://img.shields.io/badge/files-stay_local-20745a.svg)](docs/SECURITY.md)

![Documents and inspection tools prepared for a final preflight](public/images/hero-preflight.webp)

BriefLint is an open-source, local-first preflight agent. Give it a brief, rubric, checklist, or submission page together with the files you plan to send. It compiles the requirements into inspectable checks, evaluates the deliverables, and reports **pass**, **fail**, **review**, or **skipped** with evidence.

No account. No upload endpoint. No API key required.

## Why this exists

Requirements arrive as prose. Deliverables arrive as files. The final comparison is usually manual, rushed, and repeated across assignments, applications, creator campaigns, and client handoffs.

BriefLint turns that comparison into a reusable preflight:

```text
brief + deliverables -> editable rule plan -> local checks -> evidence ledger
```

## Try it locally

Requires Node.js 24 or newer.

```bash
git clone https://github.com/mihhhir08/brieflint.git
cd brieflint
npm install
npm run dev
```

Open the printed local URL. Choose **Load demo** for a complete run, or paste your own requirements and add files from your device.

```bash
npm test
npm run build
```

## What works today

| Check | Example requirement |
| --- | --- |
| File count | “Submit exactly two files.” |
| Exact filename | “Name the file final-essay.md.” |
| File extension | “Submit one PDF file.” |
| Maximum file size | “Keep the file under 5 MB.” |
| Word count | “Use between 800 and 1,200 words.” |
| Required phrase | “Include the exact phrase ‘independent analysis’.” |
| Required heading | “Include a section titled References.” |
| Human review | Anything the engine cannot prove safely |

Metadata checks work for every browser-selected file. Content checks currently support readable text-like files. See the [roadmap](docs/ROADMAP.md) for rich document formats.

## The agent loop

1. **Observe** the brief and available files.
2. **Plan** atomic rules and select a safe checker.
3. **Approve** the visible rule plan before execution.
4. **Act** with deterministic, read-only inspection tools.
5. **Evaluate** observed evidence against the requirement.
6. **Report** failures and uncertainty without hiding either.
7. **Repeat** the same pack against corrected deliverables.

The loop works without an LLM. Future semantic adapters must produce the same inspectable contract and cannot bypass evidence or approval.

## Reusable packs

Preflight packs are versioned JSON, not executable plugins. Start with the included examples:

- [`assignment-essay`](examples/assignment-essay): filename, extension, word count, heading, phrase, and manual review
- [`creator-delivery`](examples/creator-delivery): mixed-file package, size, caption length, disclosure, and manual review

The full contract is documented in the [pack specification](docs/PREFLIGHT_PACK_SPEC.md) and [JSON Schema](schema/pack-v1.schema.json).

## Trust model

- Files stay in the browser during the default workflow.
- Source files are never modified.
- Exported reports exclude raw file contents.
- Unsupported inspection becomes `review` or `skipped`, never `pass`.
- Imported packs are validated data and cannot execute code.

Read [security and limitations](docs/SECURITY.md) before using BriefLint for sensitive or regulated work.

## Project documentation

- [Product requirements](docs/PRD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Project charter](docs/PROJECT_CHARTER.md)
- [Market evidence](docs/research/MARKET_EVIDENCE.md)
- [Brand system](docs/BRAND.md)
- [Roadmap](docs/ROADMAP.md)
- [Contributing](CONTRIBUTING.md)

## Contributing

Real requirement examples are especially valuable. You can contribute a pack, a parsing fixture, a deterministic checker, a safe file inspector, accessibility improvements, or documentation.

See [CONTRIBUTING.md](CONTRIBUTING.md). By participating, you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

Apache License 2.0. See [LICENSE](LICENSE).
