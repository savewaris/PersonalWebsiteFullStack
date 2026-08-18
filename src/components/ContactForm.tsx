'use client';

import { useState } from 'react';
import styles from './ContactForm.module.css';

export default function ContactForm() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className={styles.container}>
            {status === 'success' ? (
                <div className={styles.successMessage}>
                    <h3>Message Sent!</h3>
                    <p>Thanks for reaching out. I&apos;ll get back to you soon.</p>
                    <button onClick={() => setStatus('idle')} className={styles.resetButton}>Send Another Message</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={styles.input}
                            placeholder="John Doe"
                            disabled={status === 'loading'}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={styles.input}
                            placeholder="john@example.com"
                            disabled={status === 'loading'}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className={styles.textarea}
                            placeholder="How can I help you?"
                            disabled={status === 'loading'}
                        />
                    </div>
                    <button type="submit" disabled={status === 'loading'} className={styles.submitButton}>
                        {status === 'loading' ? 'Sending...' : 'Send Message'}
                    </button>
                    {status === 'error' && (
                        <p className={styles.errorMessage}>Failed to send message. Please try again later.</p>
                    )}
                </form>
            )}
        </div>
    );
}
