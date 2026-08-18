# BriefLint

> Lint any deliverable against any brief.

BriefLint is an open-source, local-first preflight agent. Give it a brief, rubric, checklist, or submission page together with the files you plan to send. It turns the requirements into inspectable checks, evaluates the deliverables, and reports **pass**, **fail**, or **unable to verify** with evidence.

The project is currently in product-definition stage. Implementation begins only after the product requirements, safety model, and architecture are documented.

## Product principles

- **Evidence over confidence.** Every verdict points to the requirement and artifact evidence that produced it.
- **Deterministic first.** File size, type, count, metadata, dimensions, links, and structure never need an LLM.
- **Honest uncertainty.** If a claim cannot be verified, BriefLint says so.
- **Approval before mutation.** Suggested repairs never overwrite source files.
- **Local by default.** Private work stays on the user's machine unless they explicitly configure a remote model.
- **Open checks.** Communities can publish reusable preflight packs without forking the engine.

## Initial audiences

- Students checking assignments and applications
- Creators validating publication and sponsor deliverables
- Freelancers and teams shipping client work
- Anyone sending a high-stakes document package

## Status

See the [project charter](docs/PROJECT_CHARTER.md) and [market evidence](docs/research/MARKET_EVIDENCE.md). The PRD and technical architecture are the next milestone.

## License

Apache License 2.0. See [LICENSE](LICENSE).
