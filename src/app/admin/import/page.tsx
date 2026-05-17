"use client";

import { useState } from "react";
import { FadeIn } from "@/components/MotionWrappers";
import styles from "./import.module.css";

export default function ImportPage() {
  const [text, setText] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [overwrite, setOverwrite] = useState(false);

  const handleParse = async () => {
    if (!text.trim()) {
      setError("Please paste some text to parse.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setParsedData(null);

    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, apiKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to parse data");
      }

      setParsedData(data.data);
      setSuccess(`Successfully parsed ${data.data.experiences?.length || 0} experiences, ${data.data.education?.length || 0} educations, and ${data.data.skills?.length || 0} skills.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!parsedData) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/import/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsedData, overwrite }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save data");
      }

      setSuccess("Data successfully saved to the database!");
      setParsedData(null);
      setText("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <FadeIn>
        <h1 className={styles.title}>Universal Profile Import</h1>
        <p className={styles.description}>
          Paste a profile URL (e.g. from a portfolio website) OR raw text from any job hunting platform (LinkedIn, JobsDB). 
          Our AI will automatically scrape and extract your Experience, Education, and Skills.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className={styles.card}>
          <label className={styles.label}>
            Gemini API Key (Optional if set in .env)
          </label>
          <input
            type="password"
            className={styles.input}
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />

          <label className={styles.label}>
            Raw Profile Text or Profile URL
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Paste your profile URL (e.g. https://your-portfolio.com) OR raw text (Ctrl+A, Ctrl+C from LinkedIn)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />

          <div className={styles.actions}>
            <button
              className={styles.buttonPrimary}
              onClick={handleParse}
              disabled={loading || !text.trim()}
            >
              {loading && !parsedData ? "Parsing with AI..." : "Extract Data"}
            </button>
          </div>

          {error && <div className={styles.statusError}>{error}</div>}
          {success && !parsedData && <div className={styles.statusSuccess}>{success}</div>}
        </div>
      </FadeIn>

      {parsedData && (
        <FadeIn delay={0.2} className={styles.previewSection}>
          <h2 className={styles.title}>Data Preview</h2>
          <div className={styles.statusSuccess}>{success}</div>

          {/* Experiences Preview */}
          {parsedData.experiences?.length > 0 && (
            <div>
              <h3 className={styles.label} style={{ marginBottom: "12px", fontSize: "1.1rem" }}>Experiences</h3>
              <div className={styles.previewGrid}>
                {parsedData.experiences.map((exp: any, i: number) => (
                  <div key={i} className={styles.previewCard}>
                    <div className={styles.previewTitle}>{exp.role}</div>
                    <div className={styles.previewSubtitle}>{exp.company}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-tertiary)" }}>
                      {exp.startDate} - {exp.endDate || "Present"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Preview */}
          {parsedData.education?.length > 0 && (
            <div>
              <h3 className={styles.label} style={{ marginBottom: "12px", fontSize: "1.1rem", marginTop: "16px" }}>Education</h3>
              <div className={styles.previewGrid}>
                {parsedData.education.map((edu: any, i: number) => (
                  <div key={i} className={styles.previewCard}>
                    <div className={styles.previewTitle}>{edu.institution}</div>
                    <div className={styles.previewSubtitle}>{edu.degree} in {edu.fieldOfStudy}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Preview */}
          {parsedData.skills?.length > 0 && (
            <div>
              <h3 className={styles.label} style={{ marginBottom: "12px", fontSize: "1.1rem", marginTop: "16px" }}>Skills</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {parsedData.skills.map((skill: any, i: number) => (
                  <span key={i} style={{ padding: "4px 12px", backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}>
                    {skill.name} ({skill.proficiency}%)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects Preview */}
          {parsedData.projects?.length > 0 && (
            <div>
              <h3 className={styles.label} style={{ marginBottom: "12px", fontSize: "1.1rem", marginTop: "16px" }}>Projects</h3>
              <div className={styles.previewGrid}>
                {parsedData.projects.map((proj: any, i: number) => (
                  <div key={i} className={styles.previewCard}>
                    <div className={styles.previewTitle}>{proj.title}</div>
                    <div className={styles.previewSubtitle}>{proj.tags}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages Preview */}
          {parsedData.languages?.length > 0 && (
            <div>
              <h3 className={styles.label} style={{ marginBottom: "12px", fontSize: "1.1rem", marginTop: "16px" }}>Languages</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {parsedData.languages.map((lang: any, i: number) => (
                  <span key={i} style={{ padding: "4px 12px", backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}>
                    {lang.name} - {lang.proficiency}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies Preview */}
          {parsedData.hobbies?.length > 0 && (
            <div>
              <h3 className={styles.label} style={{ marginBottom: "12px", fontSize: "1.1rem", marginTop: "16px" }}>Hobbies</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {parsedData.hobbies.map((hobby: any, i: number) => (
                  <span key={i} style={{ padding: "4px 12px", backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}>
                    {hobby.emoji} {hobby.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests Preview */}
          {parsedData.interests?.length > 0 && (
            <div>
              <h3 className={styles.label} style={{ marginBottom: "12px", fontSize: "1.1rem", marginTop: "16px" }}>Interests</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {parsedData.interests.map((interest: any, i: number) => (
                  <span key={i} style={{ padding: "4px 12px", backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}>
                    {interest.emoji} {interest.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.card} style={{ marginTop: "16px" }}>
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={overwrite}
                onChange={(e) => setOverwrite(e.target.checked)}
              />
              Overwrite existing data? (Warning: This will delete ALL current experiences, education, skills, projects, languages, hobbies, and interests)
            </label>
            <div className={styles.actions}>
              <button
                className={styles.buttonPrimary}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save to Database"}
              </button>
              <button
                className={styles.buttonSecondary}
                onClick={() => { setParsedData(null); setSuccess(null); }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
