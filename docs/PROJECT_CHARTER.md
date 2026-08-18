# Project charter

## Mission

Make “ready to send” a verifiable state instead of a feeling.

## Problem

Requirements arrive as prose scattered across briefs, rubrics, webpages, emails, and checklists. Deliverables arrive as mixed files. People manually compare the two immediately before a deadline, when attention is lowest and mistakes are most expensive.

Existing tools validate isolated concerns such as grammar, plagiarism, accessibility, email recipients, or file privacy. They do not compile arbitrary requirements into a reusable, evidence-backed preflight.

## Product promise

Given requirements and candidate deliverables, BriefLint will:

1. Extract atomic requirements without silently inventing any.
2. Mark each requirement as deterministic, semantic, manual, or unsupported.
3. Run the checks that can be verified.
4. Attach evidence to every result.
5. Distinguish failure from uncertainty.
6. Suggest safe repairs and write corrected copies only after approval.
7. Re-run the same contract until the package is ready.

## The wedge

Version 1 focuses on **file-based submissions**. It does not automate the final Send, Submit, or Publish action. This boundary makes the first release useful across education, creator work, applications, and client delivery without requiring fragile integrations into every destination.

## Non-goals for version 1

- Grading creative quality or predicting a grade
- Plagiarism or AI-authorship detection
- Automatically submitting files to third-party platforms
- Editing source files in place
- Claiming legal, regulatory, or accessibility certification
- Building a general-purpose document editor
- Supporting every file format at launch

## Success criteria

The first public release succeeds when a new user can:

- Install and run BriefLint in under five minutes.
- Provide requirements plus a folder of deliverables.
- Receive a useful report without configuring an LLM.
- Understand why every result passed, failed, or remained unknown.
- Add a custom deterministic check without modifying the engine.
- Reproduce the demo locally from the repository.

## Open-source advantage

BriefLint becomes more valuable as communities contribute:

- File inspectors
- Requirement extractors
- Repair actions
- Preflight packs for recurring submission types
- Output reporters and integrations

The core engine remains useful without any hosted service or proprietary model.
