# BriefLint brand system

## Brand idea

BriefLint makes readiness visible. The identity combines the precision of blue-pencil proofing with the accessibility of an open-source developer tool.

The identity is wordmark-only. “Brief” carries the primary weight and “Lint” shifts to cobalt at a lighter weight, making the product's two-part purpose visible without inventing a decorative symbol.

## Voice

- Concrete before clever
- Calm under deadline pressure
- Honest about uncertainty
- Technical without excluding non-technical users
- No unsupported metrics, customer claims, or absolute guarantees

## Visual direction

- Cool neutral surfaces: silver white, graphite, smoke gray
- One cobalt accent for brand, action, and focus
- Green is reserved for real pass states backed by evidence
- Soft 10-14 px radii for controls and containers
- Large sans-serif typography with tight display spacing
- Editorial asymmetry balanced by a rigorous content grid
- Layered proof-sheet planes and subtle fixed grain create material depth
- Real material photography: paper, storage media, inspection tools, and finished deliverables

The site respects the system light or dark preference. Individual sections do not change theme.

## Core tokens

| Role | Light | Dark |
| --- | --- | --- |
| Page | `#f1f3f8` | `#181a20` |
| Surface | `#f9faff` | `#20232b` |
| Text | `#1d2029` | `#edf0f8` |
| Muted text | `#626875` | `#adb3c0` |
| Accent | `#304fc3` | `#91a6ff` |
| Accent surface | `#dfe5fa` | `#283250` |
| Success | `#237157` | `#6fc3a0` |
| Success surface | `#dcebe4` | `#253b33` |

Warning and failure colors appear only when they communicate a real result state.

## Design dials

### Landing page

- `DESIGN_VARIANCE: 8`
- `MOTION_INTENSITY: 6`
- `VISUAL_DENSITY: 4`

### Product workspace

- `DESIGN_VARIANCE: 5`
- `MOTION_INTENSITY: 3`
- `VISUAL_DENSITY: 6`

Motion communicates entry order and state change. All animations honor reduced-motion preferences.

## Image assets

The landing imagery was generated with the built-in image-generation tool and then converted to quality-82 WebP for the project.

- `public/images/hero-preflight.webp`: overhead inspection still life with documents, ruler, pencil, and one green pass mark
- `public/images/creator-kit.webp`: creator delivery kit with camera, media, drive, and review slip
- `public/images/student-submit.webp`: essay package beside a closed laptop and checked review slip

The imagery uses cool neutrals with green only on checked evidence. The complete generated originals remain in the Codex image library associated with the project session.

## Usage rules

- Do not introduce a second brand accent.
- Do not use green outside verified pass states.
- Do not show a pass without attached evidence.
- Do not use fake product screenshots; use the live engine or a capture of the real product.
- Do not place text over photography unless a contrast-tested scrim is present.
- Do not add a standalone icon unless it communicates a unique BriefLint concept more clearly than the wordmark.
