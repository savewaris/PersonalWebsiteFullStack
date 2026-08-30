'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GLOBAL_APP_ERROR]:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#09090b',
          color: '#ffffff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', padding: '32px', maxWidth: '480px' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '12px' }}>Application Error</h1>
          <p style={{ color: '#a1a1aa', fontSize: '0.95rem', marginBottom: '24px' }}>
            A critical error occurred while rendering the application.
          </p>
          {error.digest && (
            <p style={{ color: '#71717a', fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: '24px' }}>
              Digest: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              background: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}
