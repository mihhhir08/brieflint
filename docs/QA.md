# Version 0.1 quality report

Verified: 2026-08-18

## Automated verification

- `npm test`: 10 passing tests
- `npm run build`: strict TypeScript and Vite production build passed
- `npm audit --omit=dev`: 0 known production dependency vulnerabilities
- JSON examples and schema parse successfully
- GitHub workflow YAML and issue-template YAML parse successfully

The tests cover compilation, evidence-backed success, failure and review semantics, unreadable content, unsafe checker rejection, malformed nested pack data, filename globs, empty-package uncertainty, and both public example packs.

## Browser verification

Verified in the Codex in-app browser at desktop and 390 px mobile widths:

- Landing page has no horizontal overflow or console errors.
- All three image assets load at their intended sections.
- Primary landing CTA opens the real `/app` workspace.
- Demo compiles seven rules and loads one readable file.
- Assignment pack imports through the file picker.
- Assignment sample file produces 6 passes, 1 review, 0 failures, and 0 skipped checks.
- Raw file text does not appear in the exported report model.
- Report and pack export controls produce versioned JSON Blob downloads. The in-app test browser does not expose programmatic Blob downloads as observable download events, so event capture was not included in the automated browser assertion.

## Lighthouse production audit

Audited against the production Vite preview using Lighthouse 13 and headless Chrome.

| Category | Score |
| --- | ---: |
| Performance | 97 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

| Metric | Result |
| --- | ---: |
| First Contentful Paint | 1.7 s |
| Largest Contentful Paint | 2.2 s |
| Total Blocking Time | 70 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 2.3 s |

## Design preflight

- One emerald accent across the page
- One responsive light/dark token system
- Two-line desktop hero with visible actions
- Two eyebrows across six landing sections
- Three original, optimized image assets
- No invented customer claims, testimonials, or usage metrics
- No em dashes, decorative status dots, scroll cues, or fake product screenshots
- All motion communicates reveal order or interaction feedback and honors reduced-motion preferences
- Empty, error, ready, failed, review, and skipped states are represented

## Known release limitations

- Content extraction is limited to readable text-like files.
- Rich PDF, DOCX, and image inspection is planned after format-specific fixtures exist.
- Subjective requirements remain human review.
- BriefLint does not submit, email, publish, or mutate source files.
