'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './languages.module.css';

interface Language {
    id: string;
    name: string;
    proficiency: string;
}

export default function LanguagesClient({ initialLanguages }: { initialLanguages: Language[] }) {
    const [languages, setLanguages] = useState<Language[]>(initialLanguages);
    const [isEditing, setIsEditing] = useState(false);
    const [currentLang, setCurrentLang] = useState<Partial<Language>>({});
    const router = useRouter();

    const resetForm = () => {
        setCurrentLang({});
        setIsEditing(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this language?')) return;

        const res = await fetch(`/api/languages/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setLanguages(languages.filter(l => l.id !== id));
            router.refresh();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = currentLang.id ? `/api/languages/${currentLang.id}` : '/api/languages';
        const method = currentLang.id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentLang),
        });

        if (res.ok) {
            const savedLang = await res.json();
            if (currentLang.id) {
                setLanguages(languages.map(l => l.id === savedLang.id ? savedLang : l));
            } else {
                setLanguages([savedLang, ...languages]);
            }
            resetForm();
            router.refresh();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Languages Management</h1>
                <button onClick={() => setIsEditing(true)} className={styles.addButton}>
                    <FaPlus /> Add Language
                </button>
            </div>

            {isEditing && (
                <div className={styles.formContainer}>
                    <h2>{currentLang.id ? 'Edit Language' : 'Add New Language'}</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.row}>
                            <input
                                type="text"
                                placeholder="Language Name (e.g. English)"
                                value={currentLang.name || ''}
                                onChange={e => setCurrentLang({ ...currentLang, name: e.target.value })}
                                required
                                className={styles.input}
                            />
                            <select
                                value={currentLang.proficiency || ''}
                                onChange={e => setCurrentLang({ ...currentLang, proficiency: e.target.value })}
                                required
                                className={styles.input}
                            >
                                <option value="" disabled>Select Proficiency</option>
                                <option value="Native">Native</option>
                                <option value="Fluent">Fluent</option>
                                <option value="Advanced">Advanced (C1/C2)</option>
                                <option value="Intermediate">Intermediate (B1/B2)</option>
                                <option value="Basic">Basic (A1/A2)</option>
                            </select>
                        </div>
                        <div className={styles.formActions}>
                            <button type="button" onClick={resetForm} className={styles.cancelButton}>Cancel</button>
                            <button type="submit" className={styles.saveButton}>Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.grid}>
                {languages.map(lang => (
                    <div key={lang.id} className={styles.card}>
                        <div className={styles.cardInfo}>
                            <h3>{lang.name}</h3>
                            <span className={styles.proficiency}>{lang.proficiency}</span>
                        </div>
                        <div className={styles.cardActions}>
                            <button onClick={() => { setCurrentLang(lang); setIsEditing(true); }} className={styles.iconButton}>
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(lang.id)} className={styles.iconButtonDelete}>
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
