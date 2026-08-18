import {
  ArrowRight,
  Check,
  CheckCircle,
  DownloadSimple,
  FileArrowUp,
  FileText,
  Flask,
  GithubLogo,
  Info,
  LockKey,
  Plus,
  ShieldCheck,
  Trash,
  UploadSimple,
  Warning,
  X,
  XCircle,
} from "@phosphor-icons/react";
import { useMemo, useRef, useState } from "react";
import { compileBrief } from "../engine/compiler.ts";
import { parsePack } from "../engine/pack.ts";
import { runPreflight } from "../engine/run.ts";
import { inspectFiles } from "../inspectors/browserFiles.ts";
import type { Artifact, CheckResult, PreflightPack, PreflightRun, Rule } from "../types.ts";

const DEMO_BRIEF = `Submit exactly one Markdown file named final-essay.md.
The essay must be between 8 and 80 words.
Include a section titled References.
Include the exact phrase ‘independent analysis’.
Confirm every external image has permission.`;

const STATUS_META = {
  pass: { label: "Passed", Icon: CheckCircle },
  fail: { label: "Failed", Icon: XCircle },
  review: { label: "Review", Icon: Warning },
  skipped: { label: "Skipped", Icon: Info },
} as const;

function downloadJson(filename: string, value: unknown) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function ExpectedEditor({ rule, onChange }: { rule: Rule; onChange: (rule: Rule) => void }) {
  const update = (key: "equal" | "min" | "max" | "includes" | "prompt", value: string) => {
    const numeric = key === "min" || key === "max" || (key === "equal" && rule.checker === "file.count");
    onChange({ ...rule, expected: { ...rule.expected, [key]: numeric ? Number(value) : value } });
  };

  if (rule.checker === "file.count") return <input aria-label="Expected file count" type="number" min="0" value={rule.expected.equal ?? ""} onChange={(event) => update("equal", event.target.value)} />;
  if (rule.checker === "file.name") return <input aria-label="Expected filename" value={rule.expected.equal ?? ""} onChange={(event) => update("equal", event.target.value)} />;
  if (rule.checker === "file.extension") return <span className="expectation-copy">{rule.expected.oneOf?.map((item) => `.${item}`).join(", ")}</span>;
  if (rule.checker === "file.maxSize") return <input aria-label="Maximum bytes" type="number" min="0" value={rule.expected.max ?? ""} onChange={(event) => update("max", event.target.value)} />;
  if (rule.checker === "text.wordCount") return (
    <div className="range-inputs">
      <input aria-label="Minimum words" type="number" min="0" placeholder="Min" value={rule.expected.min ?? ""} onChange={(event) => update("min", event.target.value)} />
      <input aria-label="Maximum words" type="number" min="0" placeholder="Max" value={rule.expected.max ?? ""} onChange={(event) => update("max", event.target.value)} />
    </div>
  );
  if (rule.checker === "text.includes" || rule.checker === "text.heading") return <input aria-label="Required text" value={rule.expected.includes ?? ""} onChange={(event) => update("includes", event.target.value)} />;
  return <span className="expectation-copy">Human confirmation</span>;
}

function RulePlan({ pack, setPack }: { pack: PreflightPack; setPack: (pack: PreflightPack) => void }) {
  const updateRule = (next: Rule) => setPack({ ...pack, rules: pack.rules.map((rule) => rule.id === next.id ? next : rule) });
  const removeRule = (id: string) => setPack({ ...pack, rules: pack.rules.filter((rule) => rule.id !== id) });
  const addManual = () => {
    const id = `manual-${crypto.randomUUID()}`;
    setPack({
      ...pack,
      rules: [...pack.rules, {
        id,
        source: "Confirm this requirement manually.",
        checker: "manual.confirm",
        scope: {},
        expected: { prompt: "Confirm this requirement manually." },
        severity: "required",
        enabled: true,
        confidence: 1,
      }],
    });
  };

  return (
    <section className="panel rule-panel" aria-labelledby="rules-title">
      <div className="panel-heading">
        <div>
          <h2 id="rules-title">Inspect the plan</h2>
        </div>
        <button className="text-button" type="button" onClick={addManual}><Plus /> Add review</button>
      </div>
      <p className="panel-help">BriefLint never hides its interpretation. Edit or disable a rule before running it.</p>
      {pack.rules.length ? (
        <div className="rule-list">
          {pack.rules.map((rule) => (
            <article className={`rule-row ${rule.enabled ? "" : "is-disabled"}`} key={rule.id}>
              <label className="toggle" title={rule.enabled ? "Disable rule" : "Enable rule"}>
                <input type="checkbox" checked={rule.enabled} onChange={(event) => updateRule({ ...rule, enabled: event.target.checked })} />
                <span aria-hidden="true"><Check /></span>
              </label>
              <div className="rule-copy">
                <input className="rule-source" aria-label="Requirement source" value={rule.source} onChange={(event) => updateRule({ ...rule, source: event.target.value })} />
                <div className="rule-meta">
                  <code>{rule.checker}</code>
                  <ExpectedEditor rule={rule} onChange={updateRule} />
                </div>
              </div>
              <button className="icon-button" type="button" aria-label={`Delete rule: ${rule.source}`} onClick={() => removeRule(rule.id)}><Trash /></button>
            </article>
          ))}
        </div>
      ) : <div className="empty-inline">Compile a brief to create the first rule plan.</div>}
    </section>
  );
}

function ResultRow({ result }: { result: CheckResult }) {
  const { label, Icon } = STATUS_META[result.status];
  return (
    <article className={`result-row status-${result.status}`}>
      <div className="result-status"><Icon weight="fill" /><span>{label}</span></div>
      <div className="result-copy">
        <h3>{result.source}</h3>
        <p>{result.observation}</p>
        {result.evidence.length > 0 && <small>{result.evidence.join(" | ")}</small>}
        {result.remediation && <strong>{result.remediation}</strong>}
      </div>
    </article>
  );
}

export function Workbench() {
  const [brief, setBrief] = useState("");
  const [pack, setPack] = useState<PreflightPack>(() => compileBrief("", "Untitled preflight"));
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [run, setRun] = useState<PreflightRun | null>(null);
  const [filter, setFilter] = useState<"all" | CheckResult["status"]>("all");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const packInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const visibleResults = useMemo(() => run?.results.filter((result) => filter === "all" || result.status === filter) ?? [], [filter, run]);

  const addFiles = async (files: File[]) => {
    setError("");
    try {
      setArtifacts(await inspectFiles(files));
      setRun(null);
    } catch {
      setError("BriefLint could not inspect the selected files.");
    }
  };

  const loadDemo = async () => {
    setBrief(DEMO_BRIEF);
    setPack(compileBrief(DEMO_BRIEF, "Essay submission"));
    await addFiles([new File(["# Independent analysis\nThis is an original short argument prepared for review.\n\n# References\nSources listed here."], "final-essay.md", { type: "text/markdown" })]);
  };

  const importPack = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = parsePack(JSON.parse(await file.text()));
      setPack(parsed);
      setBrief(parsed.rules.map((rule) => rule.source).join("\n"));
      setRun(null);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "That pack could not be imported.");
    }
  };

  return (
    <div className="workbench-shell">
      <header className="app-header">
        <a className="brand" href="/" aria-label="BriefLint home"><span className="brand-mark"><Check weight="bold" /></span>BriefLint</a>
        <div className="header-actions">
          <span className="local-note"><LockKey /> Files stay local</span>
          <a className="icon-link" href="https://github.com/mihhhir08/brieflint" aria-label="BriefLint on GitHub"><GithubLogo weight="fill" /></a>
        </div>
      </header>

      <main>
        <div className="workspace-intro">
          <div>
            <span className="kicker">Preflight workspace</span>
            <h1>Make ready-to-send<br />a verifiable state.</h1>
          </div>
          <div className="intro-actions">
            <button className="secondary-button" type="button" onClick={loadDemo}><Flask /> Load demo</button>
            <button className="secondary-button" type="button" onClick={() => packInput.current?.click()}><UploadSimple /> Import pack</button>
            <input ref={packInput} className="sr-only" type="file" accept="application/json,.json" onChange={(event) => importPack(event.target.files?.[0])} />
          </div>
        </div>

        {error && <div className="error-banner" role="alert"><XCircle weight="fill" /><span>{error}</span><button type="button" aria-label="Dismiss error" onClick={() => setError("")}><X /></button></div>}

        <div className="workspace-grid">
          <section className="panel brief-panel" aria-labelledby="brief-title">
            <div className="panel-heading">
              <div><h2 id="brief-title">Add the brief</h2></div>
              <span className="privacy-label"><ShieldCheck /> Local input</span>
            </div>
            <label className="field-label" htmlFor="brief">Requirements</label>
            <textarea id="brief" value={brief} onChange={(event) => setBrief(event.target.value)} placeholder="Paste the submission brief, rubric, checklist, or delivery requirements here." />
            <div className="panel-footer">
              <span>{brief.trim() ? `${brief.trim().split(/\s+/).length} words` : "Waiting for requirements"}</span>
              <button className="primary-button" type="button" disabled={!brief.trim()} onClick={() => { setPack(compileBrief(brief, "My preflight")); setRun(null); }}>
                Compile rules <ArrowRight />
              </button>
            </div>
          </section>

          <RulePlan pack={pack} setPack={(next) => { setPack(next); setRun(null); }} />

          <section className="panel files-panel" aria-labelledby="files-title">
            <div className="panel-heading"><div><h2 id="files-title">Add deliverables</h2></div></div>
            <button
              className={`drop-zone ${dragging ? "is-dragging" : ""}`}
              type="button"
              onClick={() => fileInput.current?.click()}
              onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => { event.preventDefault(); setDragging(false); void addFiles(Array.from(event.dataTransfer.files)); }}
            >
              <FileArrowUp />
              <strong>Drop the package here</strong>
              <span>or choose files from this device</span>
            </button>
            <input ref={fileInput} className="sr-only" type="file" multiple onChange={(event) => void addFiles(Array.from(event.target.files ?? []))} />
            {artifacts.length > 0 && (
              <div className="file-list">
                {artifacts.map((artifact) => (
                  <div className="file-row" key={artifact.id}>
                    <FileText />
                    <span><strong>{artifact.name}</strong><small>{Math.max(1, Math.round(artifact.size / 1024))} KB{artifact.text !== undefined ? " | text ready" : " | metadata only"}</small></span>
                  </div>
                ))}
              </div>
            )}
            <div className="panel-footer">
              <span>{artifacts.length ? `${artifacts.length} file${artifacts.length === 1 ? "" : "s"} ready` : "No files selected"}</span>
              <button className="primary-button" type="button" disabled={!artifacts.length || !pack.rules.some((rule) => rule.enabled)} onClick={() => { setRun(runPreflight(pack, artifacts)); setFilter("all"); }}>
                Run preflight <ArrowRight />
              </button>
            </div>
          </section>
        </div>

        <section className="results-section" aria-labelledby="results-title" aria-live="polite">
          <div className="results-heading">
            <div>
              <h2 id="results-title">Evidence ledger</h2>
            </div>
            {run && (
              <div className="export-actions">
                <button className="text-button" type="button" onClick={() => downloadJson("brieflint-pack.json", pack)}><DownloadSimple /> Export pack</button>
                <button className="secondary-button" type="button" onClick={() => downloadJson("brieflint-report.json", run)}><DownloadSimple /> Export report</button>
              </div>
            )}
          </div>

          {!run ? (
            <div className="results-empty"><ShieldCheck /><h3>No verdict without evidence.</h3><p>Compile a plan, add files, and run the preflight. Unknown requirements remain visible.</p></div>
          ) : (
            <>
              <div className={`verdict ${run.summary.ready ? "is-ready" : "needs-work"}`}>
                <span className="verdict-icon">{run.summary.ready ? <CheckCircle weight="fill" /> : <Warning weight="fill" />}</span>
                <div><strong>{run.summary.ready ? "Ready to send" : "Not ready yet"}</strong><span>{run.summary.ready ? "Every required check passed." : "Resolve failures and review uncertain requirements."}</span></div>
              </div>
              <div className="result-filters" aria-label="Filter results">
                {(["all", "pass", "fail", "review", "skipped"] as const).map((status) => {
                  const count = status === "all" ? run.results.length : run.summary[status];
                  return <button type="button" className={filter === status ? "is-active" : ""} onClick={() => setFilter(status)} key={status}>{status === "all" ? "All" : STATUS_META[status].label}<span>{count}</span></button>;
                })}
              </div>
              <div className="result-list">
                {visibleResults.length ? visibleResults.map((result) => <ResultRow key={result.ruleId} result={result} />) : <div className="empty-inline">No results match this filter.</div>}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
