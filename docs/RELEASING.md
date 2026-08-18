# Releasing BriefLint

## Release gate

1. Confirm the working tree is clean.
2. Run `npm ci`, `npm test`, and `npm run build`.
3. Complete the accessibility and responsive checklist in the PRD.
4. Update `CHANGELOG.md` and the package version.
5. Tag the exact verified commit with `vX.Y.Z`.
6. Create a GitHub release using the changelog entry.

Do not publish a release when a required check can produce false confidence, the default workflow makes network requests with file content, or the examples cannot be reproduced.

## Versioning

- Patch: fixes that preserve the pack contract
- Minor: backward-compatible checks, inspectors, and interface features
- Major: incompatible pack schema or result semantics

Pack format versions are independent from application versions. A new application release does not imply a new pack version.
