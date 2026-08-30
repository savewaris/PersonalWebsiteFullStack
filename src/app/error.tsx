'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to error monitoring or console
    console.error('[APP_ERROR_BOUNDARY]:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--bg-primary, #09090b)',
        color: 'var(--text-primary, #ffffff)',
        textAlign: 'center',
        fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
      }}
    >
      <div
        style={{
          maxWidth: '540px',
          padding: '40px',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚡</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '12px' }}>
          Something went wrong
        </h1>
        <p style={{ color: 'var(--text-secondary, #a1a1aa)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
          An unexpected error occurred while loading this page. Our team has been notified.
        </p>

        {error.digest && (
          <div
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              fontSize: '0.75rem',
              color: 'var(--text-muted, #71717a)',
              marginBottom: '24px',
              fontFamily: 'monospace',
            }}
          >
            Error Digest: {error.digest}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => reset()}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'var(--accent-primary, #3b82f6)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            Try Again
          </button>
          <Link
            href="/"
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'transparent',
              color: 'var(--text-primary, #ffffff)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
