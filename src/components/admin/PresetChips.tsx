'use client';

import React, { useState } from 'react';
import { FaGlobe, FaSearch, FaSpinner } from 'react-icons/fa';
import styles from './admin.module.css';

interface PresetChipsProps<T> {
  title?: string;
  items: T[];
  getLabel: (item: T) => string;
  onSelect: (item: T) => void;
  allowWebSearch?: boolean;
  searchType?: 'skills' | 'hobbies' | 'interests' | 'languages';
}

const DEFAULT_TREND_PILLS = [
  { label: '🔥 Trending 2026', query: 'trending' },
  { label: '🤖 AI & LLMs', query: 'artificial intelligence llm' },
  { label: '🎨 Frontend', query: 'frontend framework ui' },
  { label: '⚙️ Backend', query: 'backend server api' },
  { label: '☁️ Cloud & DevOps', query: 'cloud devops kubernetes' },
  { label: '🐘 Databases', query: 'database sql nosql' },
];

export function PresetChips<T>({
  title = 'Suggested Presets (Click to add)',
  items,
  getLabel,
  onSelect,
  allowWebSearch = true,
  searchType = 'skills',
}: PresetChipsProps<T>) {
  const [showWebSearch, setShowWebSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [webResults, setWebResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearchWeb = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setSearchError('');

    try {
      const res = await fetch(
        `/api/recommendations?type=${searchType}&query=${encodeURIComponent(queryText)}`
      );
      const data = await res.json();

      if (res.ok && data.results) {
        setWebResults(data.results);
      } else {
        setSearchError(data.error || 'No trends found for this query');
      }
    } catch (err: any) {
      setSearchError(err?.message || 'Failed to reach live trends server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchWeb(searchQuery);
  };

  return (
    <div className={styles.presetContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div className={styles.presetTitle}>{title}</div>
        {allowWebSearch && (
          <button
            type="button"
            onClick={() => setShowWebSearch(!showWebSearch)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: 'var(--accent)',
              background: 'rgba(94, 106, 210, 0.1)',
              border: '1px solid rgba(94, 106, 210, 0.2)',
              borderRadius: '14px',
              padding: '3px 10px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <FaGlobe /> {showWebSearch ? 'Hide Web Trends' : '🌐 Discover Live Trends from Web'}
          </button>
        )}
      </div>

      {showWebSearch && (
        <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search live tech trends e.g. 'Next.js', 'AI Agents', 'Rust', 'Kubernetes'..."
              style={{
                flex: 1,
                padding: '8px 12px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={styles.primaryButton}
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              {isLoading ? <FaSpinner className={styles.spinner} /> : <FaSearch />} Search Web
            </button>
          </form>

          {/* Quick trend pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {DEFAULT_TREND_PILLS.map((pill) => (
              <button
                key={pill.label}
                type="button"
                onClick={() => {
                  setSearchQuery(pill.query);
                  handleSearchWeb(pill.query);
                }}
                style={{
                  fontSize: '0.76rem',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {searchError && (
            <div style={{ color: '#f87171', fontSize: '0.82rem', marginTop: '8px' }}>{searchError}</div>
          )}

          {/* Live Web Results */}
          {webResults.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
                LIVE WEB RESULTS (Click to instant add):
              </div>
              <div className={styles.presetChips}>
                {webResults.map((res, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelect(res as unknown as T)}
                    className={styles.chip}
                    style={{ borderColor: 'var(--accent)', background: 'rgba(94, 106, 210, 0.08)' }}
                    title={res.description || res.name}
                  >
                    + {res.icon} {res.name} ({res.category})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Baseline items */}
      <div className={styles.presetChips}>
        {items.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(item)}
            className={styles.chip}
          >
            + {getLabel(item)}
          </button>
        ))}
      </div>
    </div>
  );
}
