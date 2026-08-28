'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Login.module.css';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h1 className={styles.title}>Admin Access</h1>
          <p style={{ color: '#A0A0A0', fontSize: '0.9rem' }}>Enter password to access dashboard</p>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          className={styles.input}
        />

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <Link href="/" style={{ color: '#A0A0A0', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', minHeight: '24px', padding: '4px 8px' }}>
            ← Back to Portfolio
          </Link>
        </div>
      </form>
    </main>
  );
}
