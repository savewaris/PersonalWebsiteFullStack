"use client";

import { useState } from "react";
import { FadeIn } from "@/components/MotionWrappers";
import styles from "./resume.module.css";
import ReactMarkdown from "react-markdown";

type SuggestedJob = {
  title: string;
  description: string;
  keywords: string[];
};

type ActiveTab = "resume" | "cover-letter";
type LangOption = "en" | "th" | "both";

// ── tiny language meta ──────────────────────────────────────
const LANG_META: Record<LangOption, { label: string; flag: string }> = {
  en:   { label: "English",  flag: "🇬🇧" },
  th:   { label: "Thai",     flag: "🇹🇭" },
  both: { label: "Both",     flag: "🌐" },
};

export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("resume");
  const [lang, setLang] = useState<LangOption>("en");

  // ── Shared state ──────────────────────────────────────────
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestedJobs, setSuggestedJobs] = useState<SuggestedJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<SuggestedJob | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Resume state ──────────────────────────────────────────
  const [loadingResume, setLoadingResume] = useState(false);
  const [resumeEn, setResumeEn] = useState<string | null>(null);
  const [resumeTh, setResumeTh] = useState<string | null>(null);
  const [bilingualView, setBilingualView] = useState<"en" | "th">("en"); // mobile toggle

  // ── Cover Letter state ────────────────────────────────────
  const [loadingLetter, setLoadingLetter] = useState(false);
  const [letterEn, setLetterEn] = useState<string | null>(null);
  const [letterTh, setLetterTh] = useState<string | null>(null);
  const [bilingualLetterView, setBilingualLetterView] = useState<"en" | "th">("en");
  const [applicantName, setApplicantName] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [hrEmail, setHrEmail] = useState("");

  // ── Actions ───────────────────────────────────────────────
  const fetchSuggestions = async (keepSelection = false) => {
    setLoadingSuggestions(true);
    setError(null);
    setSuggestedJobs([]);
    if (!keepSelection) {
      setSelectedJob(null);
      setResumeEn(null); setResumeTh(null);
      setLetterEn(null); setLetterTh(null);
    }

    try {
      const res = await fetch("/api/ai/suggest-jobs");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch suggestions");
      setSuggestedJobs(data.data);
      // Only auto-select first job if nothing is selected yet
      if (!keepSelection && data.data?.length > 0) setSelectedJob(data.data[0]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  /** Fetch a single language resume */
  const fetchResumeLang = async (language: "en" | "th") => {
    const res = await fetch("/api/ai/tailor-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetJob: selectedJob, language }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Failed (${language})`);
    return data.data as string;
  };

  const generateResume = async () => {
    if (!selectedJob) return;
    setLoadingResume(true);
    setError(null);
    setResumeEn(null); setResumeTh(null);

    try {
      if (lang === "both") {
        const [en, th] = await Promise.all([fetchResumeLang("en"), fetchResumeLang("th")]);
        setResumeEn(en); setResumeTh(th);
        setBilingualView("en");
      } else if (lang === "en") {
        setResumeEn(await fetchResumeLang("en"));
      } else {
        setResumeTh(await fetchResumeLang("th"));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingResume(false);
    }
  };

  /** Fetch a single language cover letter */
  const fetchLetterLang = async (language: "en" | "th") => {
    const res = await fetch("/api/ai/cover-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetJob: selectedJob, applicantName, hiringManager, companyName, hrEmail, language }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Failed (${language})`);
    return data.data as string;
  };

  const generateCoverLetter = async () => {
    if (!selectedJob) return;
    setLoadingLetter(true);
    setError(null);
    setLetterEn(null); setLetterTh(null);

    try {
      if (lang === "both") {
        const [en, th] = await Promise.all([fetchLetterLang("en"), fetchLetterLang("th")]);
        setLetterEn(en); setLetterTh(th);
        setBilingualLetterView("en");
      } else if (lang === "en") {
        setLetterEn(await fetchLetterLang("en"));
      } else {
        setLetterTh(await fetchLetterLang("th"));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingLetter(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────
  const downloadMd = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const sendEmail = (letterContent: string) => {
    if (!hrEmail) return;
    const subject = encodeURIComponent(
      `Application for ${selectedJob?.title ?? "the position"}${companyName ? ` at ${companyName}` : ""} — ${applicantName || "Applicant"}`
    );
    const body = encodeURIComponent(letterContent);
    window.location.href = `mailto:${hrEmail}?subject=${subject}&body=${body}`;
  };

  const safeSlug = (s?: string) => (s ?? "").replace(/[^a-zA-Z0-9]/g, "_");

  // ── derived booleans ─────────────────────────────────────
  const isBoth       = lang === "both";
  const hasResume    = !!(resumeEn || resumeTh);
  const hasLetter    = !!(letterEn || letterTh);
  const isGenerating = loadingResume || loadingLetter;

  // ── Language pill bar ─────────────────────────────────────
  const LangToggle = () => (
    <div className={styles.langToggle}>
      {(Object.keys(LANG_META) as LangOption[]).map((l) => (
        <button
          key={l}
          className={`${styles.langPill} ${lang === l ? styles.langPillActive : ""}`}
          onClick={() => setLang(l)}
        >
          {LANG_META[l].flag} {LANG_META[l].label}
        </button>
      ))}
    </div>
  );

  // ── Bilingual mobile switcher ─────────────────────────────
  const BiSwitcher = ({ view, setView }: { view: "en" | "th"; setView: (v: "en" | "th") => void }) => (
    <div className={styles.biSwitcher}>
      <button className={`${styles.biPill} ${view === "en" ? styles.biPillActive : ""}`} onClick={() => setView("en")}>🇬🇧 EN</button>
      <button className={`${styles.biPill} ${view === "th" ? styles.biPillActive : ""}`} onClick={() => setView("th")}>🇹🇭 TH</button>
    </div>
  );

  // ── Document output block (shared for resume + letter) ────
  const DocPanel = ({
    content, lang: docLang, filename, letterMode,
  }: { content: string; lang: "en" | "th"; filename: string; letterMode?: boolean }) => (
    <div>
      <div className={styles.panelMeta}>
        <span className={styles.panelFlag}>{docLang === "en" ? "🇬🇧 English" : "🇹🇭 ภาษาไทย"}</span>
        <div className={styles.panelActions}>
          <button className={styles.buttonSecondary} onClick={() => downloadMd(content, filename)}>Download .MD</button>
          {letterMode && hrEmail && (
            <button className={styles.buttonSecondary} onClick={() => sendEmail(content)}>📧 Send</button>
          )}
          <button className={styles.buttonPrimary} onClick={() => window.print()}>Print PDF</button>
        </div>
      </div>
      <div className={styles.previewContainer}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <FadeIn>
        <h1 className={styles.title}>AI Career Documents</h1>
        <p className={styles.description}>
          Discover roles you are qualified for, then generate a tailored resume or a personalised cover letter — in English, Thai, or both simultaneously.
        </p>
      </FadeIn>

      {error && <div className={styles.error}>{error}</div>}

      {/* ── Tab Bar ── */}
      <FadeIn delay={0.05}>
        <div className={styles.tabBar}>
          <button className={`${styles.tab} ${activeTab === "resume" ? styles.tabActive : ""}`} onClick={() => setActiveTab("resume")}>
            📄 Resume
          </button>
          <button className={`${styles.tab} ${activeTab === "cover-letter" ? styles.tabActive : ""}`} onClick={() => setActiveTab("cover-letter")}>
            ✉️ Cover Letter
          </button>
        </div>
      </FadeIn>

      {/* ── Language Selector ── */}
      <FadeIn delay={0.08}>
        <LangToggle />
      </FadeIn>

      {/* ── Action Bar ── */}
      <FadeIn delay={0.1}>
        <div className={styles.actions}>
          <button
            className={styles.buttonPrimary}
            onClick={() => fetchSuggestions(false)}
            disabled={loadingSuggestions || isGenerating}
          >
            {loadingSuggestions ? "Analyzing Profile…" : "🔍 Discover Matching Jobs"}
          </button>

          {suggestedJobs.length > 0 && (
            <button
              className={styles.buttonSecondary}
              onClick={() => fetchSuggestions(true)}
              disabled={loadingSuggestions || isGenerating}
              title="Get fresh suggestions while keeping your current selection"
            >
              {loadingSuggestions ? "…" : "🔄 Regenerate"}
            </button>
          )}

          {activeTab === "resume" && (
            <button
              className={styles.buttonSecondary}
              onClick={generateResume}
              disabled={!selectedJob || loadingSuggestions || loadingResume}
              title={!selectedJob ? "Discover jobs and select a role first" : `Generate ${lang === "both" ? "bilingual resume" : LANG_META[lang].label + " resume"} for: ${selectedJob.title}`}
            >
              {loadingResume
                ? "Crafting Resume…"
                : selectedJob
                ? `${isBoth ? "🌐 Generate Both" : LANG_META[lang].flag} Resume — ${selectedJob.title}`
                : "Create Tailored Resume"}
            </button>
          )}

          {activeTab === "cover-letter" && (
            <button
              className={styles.buttonSecondary}
              onClick={generateCoverLetter}
              disabled={!selectedJob || loadingSuggestions || loadingLetter}
              title={!selectedJob ? "Discover jobs and select a role first" : `Generate ${lang === "both" ? "bilingual cover letter" : LANG_META[lang].label + " cover letter"} for: ${selectedJob.title}`}
            >
              {loadingLetter
                ? "Writing Letter…"
                : selectedJob
                ? `${isBoth ? "🌐 Generate Both" : LANG_META[lang].flag} Letter — ${selectedJob.title}`
                : "Write Cover Letter"}
            </button>
          )}
        </div>
      </FadeIn>

      {/* ── Job Grid ── */}
      {suggestedJobs.length > 0 && (
        <FadeIn delay={0.2}>
          <h2 className={styles.sectionTitle}>Suggested Roles</h2>
          <p className={styles.description}>Click a role to select it, then generate your document above.</p>
          <div className={styles.suggestionsGrid}>
            {suggestedJobs.map((job, idx) => (
              <div
                key={idx}
                className={`${styles.jobCard} ${selectedJob?.title === job.title ? styles.jobCardSelected : ""}`}
                onClick={() => setSelectedJob(job)}
              >
                <div className={styles.jobTitle}>{job.title}</div>
                <div className={styles.jobDesc}>{job.description}</div>
                <div className={styles.keywordTags}>
                  {job.keywords.map((kw, i) => (
                    <span key={i} className={styles.tag}>{kw}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      )}

      {/* ── Cover Letter Form ── */}
      {activeTab === "cover-letter" && (
        <FadeIn delay={0.25}>
          <div className={styles.clForm}>
            <h2 className={styles.sectionTitle}>Personalise Your Letter</h2>
            <p className={styles.description}>All fields are optional — they help the AI address the letter correctly.</p>
            <div className={styles.clGrid}>
              <div className={styles.clField}>
                <label className={styles.clLabel}>Your Name</label>
                <input className={styles.clInput} type="text" placeholder="e.g. Waris Khamkaweepart" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} />
              </div>
              <div className={styles.clField}>
                <label className={styles.clLabel}>Company Name</label>
                <input className={styles.clInput} type="text" placeholder="e.g. Google" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div className={styles.clField}>
                <label className={styles.clLabel}>Hiring Manager (optional)</label>
                <input className={styles.clInput} type="text" placeholder="e.g. Ms. Jane Smith" value={hiringManager} onChange={(e) => setHiringManager(e.target.value)} />
              </div>
              <div className={styles.clField}>
                <label className={styles.clLabel}>HR Email Address</label>
                <input className={styles.clInput} type="email" placeholder="e.g. hr@company.com" value={hrEmail} onChange={(e) => setHrEmail(e.target.value)} />
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {/* ── Loading ── */}
      {isGenerating && (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
          <p>
            {loadingResume
              ? `Crafting ${isBoth ? "bilingual resumes" : LANG_META[lang].label + " resume"} for "${selectedJob?.title}"…`
              : `Writing ${isBoth ? "bilingual cover letters" : LANG_META[lang].label + " cover letter"} for "${selectedJob?.title}"…`}
          </p>
          {isBoth && <p className={styles.loadingSubText}>Generating 🇬🇧 English and 🇹🇭 Thai versions in parallel…</p>}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
           RESUME OUTPUT
      ══════════════════════════════════════════════════════ */}
      {activeTab === "resume" && hasResume && (
        <FadeIn delay={0.2}>
          <div className={styles.outputHeader}>
            <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
              Resume — <span style={{ color: "var(--accent)" }}>{selectedJob?.title}</span>
            </h2>
            {isBoth && <BiSwitcher view={bilingualView} setView={setBilingualView} />}
          </div>

          {/* BOTH: side-by-side on desktop, tabbed on mobile */}
          {isBoth ? (
            <>
              {/* Desktop split */}
              <div className={styles.biPanel}>
                {resumeEn && (
                  <DocPanel
                    content={resumeEn}
                    lang="en"
                    filename={`Resume_EN_${safeSlug(selectedJob?.title)}.md`}
                  />
                )}
                {resumeTh && (
                  <DocPanel
                    content={resumeTh}
                    lang="th"
                    filename={`Resume_TH_${safeSlug(selectedJob?.title)}.md`}
                  />
                )}
              </div>
              {/* Mobile single-view (CSS hides the other) */}
              <div className={styles.biMobile}>
                {bilingualView === "en" && resumeEn && (
                  <DocPanel content={resumeEn} lang="en" filename={`Resume_EN_${safeSlug(selectedJob?.title)}.md`} />
                )}
                {bilingualView === "th" && resumeTh && (
                  <DocPanel content={resumeTh} lang="th" filename={`Resume_TH_${safeSlug(selectedJob?.title)}.md`} />
                )}
              </div>
            </>
          ) : (
            <>
              {resumeEn && <DocPanel content={resumeEn} lang="en" filename={`Resume_EN_${safeSlug(selectedJob?.title)}.md`} />}
              {resumeTh && <DocPanel content={resumeTh} lang="th" filename={`Resume_TH_${safeSlug(selectedJob?.title)}.md`} />}
            </>
          )}
        </FadeIn>
      )}

      {/* ══════════════════════════════════════════════════════
           COVER LETTER OUTPUT
      ══════════════════════════════════════════════════════ */}
      {activeTab === "cover-letter" && hasLetter && (
        <FadeIn delay={0.2}>
          <div className={styles.outputHeader}>
            <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
              Cover Letter — <span style={{ color: "var(--accent)" }}>{selectedJob?.title}</span>
              {companyName && <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}> at {companyName}</span>}
            </h2>
            {isBoth && <BiSwitcher view={bilingualLetterView} setView={setBilingualLetterView} />}
          </div>

          {isBoth ? (
            <>
              <div className={styles.biPanel}>
                {letterEn && (
                  <DocPanel content={letterEn} lang="en" filename={`CoverLetter_EN_${safeSlug(selectedJob?.title)}_${companyName || "Company"}.md`} letterMode />
                )}
                {letterTh && (
                  <DocPanel content={letterTh} lang="th" filename={`CoverLetter_TH_${safeSlug(selectedJob?.title)}_${companyName || "Company"}.md`} letterMode />
                )}
              </div>
              <div className={styles.biMobile}>
                {bilingualLetterView === "en" && letterEn && (
                  <DocPanel content={letterEn} lang="en" filename={`CoverLetter_EN_${safeSlug(selectedJob?.title)}_${companyName || "Company"}.md`} letterMode />
                )}
                {bilingualLetterView === "th" && letterTh && (
                  <DocPanel content={letterTh} lang="th" filename={`CoverLetter_TH_${safeSlug(selectedJob?.title)}_${companyName || "Company"}.md`} letterMode />
                )}
              </div>
            </>
          ) : (
            <>
              {letterEn && <DocPanel content={letterEn} lang="en" filename={`CoverLetter_EN_${safeSlug(selectedJob?.title)}_${companyName || "Company"}.md`} letterMode />}
              {letterTh && <DocPanel content={letterTh} lang="th" filename={`CoverLetter_TH_${safeSlug(selectedJob?.title)}_${companyName || "Company"}.md`} letterMode />}
            </>
          )}
        </FadeIn>
      )}
    </div>
  );
}
