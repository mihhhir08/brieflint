# Examples

Each example contains:

- `brief.txt`: the source requirements
- `pack.json`: a reviewed, reusable version 1 pack
- `files/`: non-sensitive sample deliverables
- `expected-summary.json`: the deterministic result summary

The repository test suite loads every included pack through the same trust-boundary parser used by the browser and verifies the expected summary.

To try one manually, start BriefLint, import its `pack.json`, add the files in its `files/` folder, and run the preflight. A manual-review rule intentionally keeps each sample from claiming complete readiness.

Never contribute a real private brief or deliverable. Replace names and content with the smallest representative fixture.
