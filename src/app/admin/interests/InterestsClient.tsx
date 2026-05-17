'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './interests.module.css';
import { INTEREST_SUGGESTIONS } from '@/lib/recommendations';

interface Interest {
    id: string;
    name: string;
    emoji: string | null;
}

export default function InterestsClient({ initialInterests }: { initialInterests: Interest[] }) {
    const [interests, setInterests] = useState<Interest[]>(initialInterests);
    const [isEditing, setIsEditing] = useState(false);
    const [currentInterest, setCurrentInterest] = useState<Partial<Interest>>({});
    const router = useRouter();

    const resetForm = () => {
        setCurrentInterest({});
        setIsEditing(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this interest?')) return;
        const res = await fetch(`/api/interests/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setInterests(interests.filter(i => i.id !== id));
            router.refresh();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = currentInterest.id ? `/api/interests/${currentInterest.id}` : '/api/interests';
        const method = currentInterest.id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentInterest),
        });

        if (res.ok) {
            const savedInterest = await res.json();
            if (currentInterest.id) {
                setInterests(interests.map(i => i.id === savedInterest.id ? savedInterest : i));
            } else {
                setInterests([savedInterest, ...interests]);
            }
            resetForm();
            router.refresh();
        }
    };

    const existingNames = new Set(interests.map(i => i.name.toLowerCase()));
    const filteredSuggestions = INTEREST_SUGGESTIONS.filter(s => !existingNames.has(s.name.toLowerCase()));

    // One-click save
    const quickAdd = async (suggestion: typeof INTEREST_SUGGESTIONS[0]) => {
        const res = await fetch('/api/interests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: suggestion.name, emoji: suggestion.emoji }),
        });
        if (res.ok) {
            const saved = await res.json();
            setInterests([saved, ...interests]);
            router.refresh();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Interests Management</h1>
                <button onClick={() => setIsEditing(true)} className={styles.addButton}>
                    <FaPlus /> Add Interest
                </button>
            </div>

            {/* ── Recommendations ── */}
            {filteredSuggestions.length > 0 && (
                <div className={styles.recommendSection}>
                    <span className={styles.recommendLabel}>✨ Suggestions — click to instantly add</span>
                    <div className={styles.chips}>
                        {filteredSuggestions.map((s, i) => (
                            <button key={i} className={styles.chip} onClick={() => quickAdd(s)}>
                                <span>{s.emoji}</span>
                                <span>{s.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isEditing && (
                <div className={styles.formContainer}>
                    <h2>{currentInterest.id ? 'Edit Interest' : 'Add New Interest'}</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.row}>
                            <input
                                type="text"
                                placeholder="Interest Name"
                                value={currentInterest.name || ''}
                                onChange={e => setCurrentInterest({ ...currentInterest, name: e.target.value })}
                                required
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Emoji"
                                value={currentInterest.emoji || ''}
                                onChange={e => setCurrentInterest({ ...currentInterest, emoji: e.target.value })}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formActions}>
                            <button type="button" onClick={resetForm} className={styles.cancelButton}>Cancel</button>
                            <button type="submit" className={styles.saveButton}>Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.grid}>
                {interests.map(interest => (
                    <div key={interest.id} className={styles.card}>
                        <div className={styles.emoji}>{interest.emoji}</div>
                        <div className={styles.cardInfo}>
                            <h3>{interest.name}</h3>
                        </div>
                        <div className={styles.cardActions}>
                            <button onClick={() => { setCurrentInterest(interest); setIsEditing(true); }} className={styles.iconButton}>
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(interest.id)} className={styles.iconButtonDelete}>
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
