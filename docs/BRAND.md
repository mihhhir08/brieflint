# BriefLint brand system

## Brand idea

BriefLint makes readiness visible. The identity combines the calm precision of an inspection desk with the accessibility of an open-source developer tool.

The recurring mark is a check inside a softly squared field. It represents a verdict with boundaries, not a decorative promise.

## Voice

- Concrete before clever
- Calm under deadline pressure
- Honest about uncertainty
- Technical without excluding non-technical users
- No unsupported metrics, customer claims, or absolute guarantees

## Visual direction

- Cold neutral surfaces: off-white, graphite, smoke gray
- One muted emerald accent for action, verified evidence, and focus
- Soft 10-14 px radii for controls and containers
- Large sans-serif typography with tight display spacing
- Editorial asymmetry balanced by a rigorous content grid
- Real material photography: paper, storage media, inspection tools, and finished deliverables

The site respects the system light or dark preference. Individual sections do not change theme.

## Core tokens

| Role | Light | Dark |
| --- | --- | --- |
| Page | `#f3f1eb` | `#191b18` |
| Surface | `#fbfaf6` | `#212420` |
| Text | `#242620` | `#eceee8` |
| Muted text | `#686b60` | `#aeb3aa` |
| Accent | `#20745a` | `#65bd98` |
| Accent surface | `#dcebe4` | `#263e33` |

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

- `public/images/hero-preflight.webp`: overhead inspection still life with documents, ruler, pencil, and one emerald check
- `public/images/creator-kit.webp`: creator delivery kit with camera, media, drive, and review slip
- `public/images/student-submit.webp`: essay package beside a closed laptop and checked review slip

All prompts specified cool neutrals, a single muted emerald accent, no readable text, no logos, no purple glow, and no watermark. The complete generated originals remain in the Codex image library associated with the project session.

## Usage rules

- Do not introduce a second brand accent.
- Do not use green as decoration when it could be mistaken for a pass state.
- Do not show a pass without attached evidence.
- Do not use fake product screenshots; use the live engine or a capture of the real product.
- Do not place text over photography unless a contrast-tested scrim is present.
- Do not replace the wordmark with a generated raster logo.
