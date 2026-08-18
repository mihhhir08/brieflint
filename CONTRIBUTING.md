# Contributing to BriefLint

BriefLint should be easy to understand before it is easy to extend.

## Before opening code

- Search existing issues and discussions.
- For new checkers or file formats, include two real requirement examples and expected evidence.
- For behavior changes, describe how false confidence is prevented.
- Keep packs data-only and source files immutable.

## Contribution paths

- Add a reusable preflight pack
- Add parsing fixtures for real requirement language
- Improve a deterministic checker
- Add a safe file inspector with fixtures
- Improve accessibility, documentation, or visual polish

## Development principles

- Prefer platform APIs and pure functions.
- Do not add a framework or service for a hypothetical future.
- Every non-trivial parser or checker needs a focused runnable test.
- A failure to inspect is `review` or `skipped`, never `pass`.
- User-facing evidence should explain the observation without exposing file contents unnecessarily.

Setup and verification commands will be added with the implementation milestone.

## Pull requests

Keep changes focused. Explain the user problem, include before/after behavior, and list the checks you ran. UI changes should include desktop and mobile screenshots. Security-sensitive findings should follow [docs/SECURITY.md](docs/SECURITY.md), not a public issue.
