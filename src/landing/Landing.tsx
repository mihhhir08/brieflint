import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  FileText,
  GithubLogo,
  LockKey,
  MagnifyingGlass,
  PencilSimple,
  ShieldCheck,
  Warning,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import type { PropsWithChildren } from "react";
import { compileBrief } from "../engine/compiler.ts";
import { runPreflight } from "../engine/run.ts";

const SAMPLE_RUN = runPreflight(
  compileBrief([
    "Submit exactly one Markdown file named final-essay.md.",
    "The essay must be under 1200 words.",
    "Confirm every external image has permission.",
  ].join("\n"), "Sample essay"),
  [{ id: "sample", name: "final-essay.md", size: 8462, type: "text/markdown", text: "Evidence ".repeat(318) }],
  new Date("2026-08-17T12:00:00Z"),
);

function Reveal({ children, className = "", delay = 0 }: PropsWithChildren<{ className?: string; delay?: number }>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function EvidencePreview() {
  const reduce = useReducedMotion();
  return (
    <div className="evidence-preview" aria-label="A real BriefLint sample result">
      <div className="preview-topline">
        <span>Evidence ledger</span>
        <strong>{SAMPLE_RUN.summary.pass} passed, {SAMPLE_RUN.summary.review} review</strong>
      </div>
      {SAMPLE_RUN.results.map((result, index) => (
        <motion.div
          className={`preview-result preview-${result.status}`}
          initial={reduce ? false : { opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.42, delay: 0.14 + index * 0.08 }}
          key={result.ruleId}
        >
          {result.status === "pass" ? <CheckCircle weight="fill" /> : <Warning weight="fill" />}
          <div><strong>{result.source}</strong><span>{result.observation}</span></div>
        </motion.div>
      ))}
      <p>This preview runs the repository's real engine against sample inputs.</p>
    </div>
  );
}

export function Landing() {
  return (
    <div className="landing">
      <header className="landing-header">
        <a className="brand" href="/" aria-label="BriefLint home"><span className="brand-wordmark">Brief<span>Lint</span></span></a>
        <nav className="landing-nav-links" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#use-cases">Use cases</a>
          <a href="#open-source">Open source</a>
        </nav>
        <a className="nav-cta" href="/app">Open workspace <ArrowUpRight /></a>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="hero-copy">
            <span className="landing-kicker"><LockKey /> Local-first preflight</span>
            <h1><span>Before you send it,</span><span>prove it.</span></h1>
            <p>Turn any brief into evidence-backed checks. Run them locally against the files you plan to submit.</p>
            <div className="hero-actions">
              <a className="landing-primary" href="/app">Open workspace <ArrowRight /></a>
              <a className="landing-secondary" href="https://github.com/mihhhir08/brieflint">View on GitHub <GithubLogo weight="fill" /></a>
            </div>
          </div>
          <figure className="hero-visual">
            <img src="/images/hero-preflight.webp" width="1536" height="1024" fetchPriority="high" alt="Documents, ruler, pencil, and a checked inspection slip arranged for final review" />
            <figcaption><ShieldCheck weight="fill" /> Nothing uploaded. Nothing guessed.</figcaption>
          </figure>
        </section>

        <section className="manifesto" id="how-it-works">
          <Reveal>
            <h2>A brief becomes useful when every claim can face evidence.</h2>
          </Reveal>
          <div className="requirement-ribbon" aria-label="Examples of requirements BriefLint can verify">
            <span><FileText /> Exactly one PDF</span>
            <span><PencilSimple /> Under 1,200 words</span>
            <span><MagnifyingGlass /> Heading: References</span>
            <span><ShieldCheck /> Human review required</span>
          </div>
        </section>

        <section className="proof-section">
          <Reveal className="proof-copy">
            <h2>Agentic, without the black box.</h2>
            <p>BriefLint observes the brief, proposes a plan, runs safe checks, and records the evidence. You approve the interpretation.</p>
            <div className="proof-principles">
              <div><strong>Deterministic first</strong><span>Metadata and text checks do not need an LLM.</span></div>
              <div><strong>Uncertainty stays visible</strong><span>Unable to verify never becomes a pass.</span></div>
            </div>
          </Reveal>
          <Reveal className="proof-live" delay={0.08}><EvidencePreview /></Reveal>
        </section>

        <section className="use-cases" id="use-cases">
          <div className="use-case-heading">
            <h2>Different work.<br />The same final doubt.</h2>
            <p>Use the engine for one deadline, then save the checks as a reusable pack.</p>
          </div>
          <div className="use-case-mosaic">
            <Reveal className="use-case creator-case">
              <img src="/images/creator-kit.webp" width="1122" height="1402" loading="lazy" alt="Camera, storage media, drive, and review checklist arranged on a creator's desk" />
              <div><h3>Creators</h3><p>Validate sponsor files, formats, counts, names, and delivery notes before handoff.</p></div>
            </Reveal>
            <Reveal className="use-case student-case" delay={0.1}>
              <img src="/images/student-submit.webp" width="1586" height="992" loading="lazy" alt="Essay package and a checked review slip beside a closed laptop" />
              <div><h3>Students</h3><p>Check assignments, applications, citations, filenames, and limits before the deadline.</p></div>
            </Reveal>
          </div>
        </section>

        <section className="open-source-section" id="open-source">
          <Reveal className="open-source-copy">
            <span className="landing-kicker">Open source</span>
            <h2>Fork the engine.<br />Own the preflight.</h2>
            <p>Apache-licensed, local by default, and built around data-only packs. Add checks without handing private files to another service.</p>
            <a className="landing-secondary" href="https://github.com/mihhhir08/brieflint/fork">Fork BriefLint <GithubLogo weight="fill" /></a>
          </Reveal>
          <Reveal className="pack-spec" delay={0.08}>
            <div className="pack-filebar"><span>assignment-essay.json</span><span>portable pack</span></div>
            <pre><code>{`{
  "source": "Submit exactly one PDF",
  "checker": "file.count",
  "expected": { "equal": 1 },
  "severity": "required"
}`}</code></pre>
            <div className="pack-footer"><CheckCircle weight="fill" /> Data only. No executable code.</div>
          </Reveal>
        </section>

        <section className="landing-cta">
          <div>
            <h2>Make the last check count.</h2>
            <p>Paste a brief. Add the files. Leave with evidence.</p>
          </div>
          <a className="landing-primary" href="/app">Open workspace <ArrowRight /></a>
        </section>
      </main>

      <footer className="landing-footer">
        <a className="brand footer-brand" href="/"><span className="brand-wordmark">Brief<span>Lint</span></span></a>
        <p>Built in the open. Files stay on your device.</p>
        <div><a href="https://github.com/mihhhir08/brieflint">GitHub</a><a href="https://github.com/mihhhir08/brieflint/blob/main/LICENSE">Apache 2.0</a></div>
      </footer>
    </div>
  );
}
