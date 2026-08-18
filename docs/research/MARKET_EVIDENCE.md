# Market evidence

Research snapshot: 2026-08-17

## Observed demand

The problem is currently handled through manual checklists and narrow products:

- Stanford publishes a detailed checklist asking students to re-read specifications, run tests, remove debug material, include citations, and confirm every required file is present: [CS106A submit checklist](https://web.stanford.edu/class/archive/cs/cs106a/cs106a.1268/resources/submit_checklist.html).
- Universities recommend pre-submission self-assessment and separate accessibility/file checklists: [Online Network of Educators](https://onlinenetworkofeducators.org/pre-submission-checklist/).
- Toronto Metropolitan University requires authors to manually check links, filenames, file sizes, alt text, heading structure, copyright, captions, and forms before release: [pre-release checklist](https://www.torontomu.ca/content/ryerson/web-support/help/pre-release-checklist.html).
- Elsevier instructs authors to verify anonymization, format, length, and journal-specific checklists before upload: [pre-submission preparation](https://supportcontent.elsevier.com/Support%20Hub/Journals/Editorial%20Manager%20Videos%20Transcript/Pre-submission%20preparation.pdf).
- Instructors report incorrect or unreadable submissions recurring across semesters: [discussion of wrong-file submissions](https://www.reddit.com/r/Professors/comments/1kholfc).

## Fragmented paid and narrow solutions

- [FileVeil](https://apps.apple.com/us/app/fileveil-privacy/id6776994003) provides a narrow pre-send privacy scan and redaction workflow.
- [SendAware](https://www.techhit.com/SendAware/) checks Outlook recipients, attachment presence, file type, and encryption.
- Grammar, plagiarism, accessibility, PDF, and platform-format tools each cover one slice of the preflight problem.

This fragmentation is evidence that people value individual checks, while the repeated assembly of those checks remains manual.

## Open-source comparison

Research found specialized artifact evaluators and scientific-submission auditors, but no mature open-source product with BriefLint's central contract:

> arbitrary requirements + mixed deliverables → reusable checks → evidence-backed pass/fail/unknown → approved repairs → re-verification

This is a landscape inference, not a claim that no private prototype exists.

## Naming research

The selected name is **BriefLint**:

- “Brief” identifies the source of requirements.
- “Lint” communicates repeatable, inspectable checks before release.
- Exact-name searches returned no matching software product, GitHub project, package, or trademark result at the time of selection.
- The phrase is descriptive enough to understand but uncommon enough to avoid the generic naming pool used by coding agents.

## Strategic conclusion

BriefLint should not compete with document editors. It should become the verification layer that can call deterministic document and media tools, preserve evidence, and remain honest about what it cannot prove.
