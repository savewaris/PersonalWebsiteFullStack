'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './experience.module.css';

interface Experience {
    id: string;
    role: string;
    company: string;
    location: string | null;
    startDate: string;
    endDate: string | null;
    description: string;
}

export default function ExperienceClient({ initialExperience }: { initialExperience: Experience[] }) {
    const [experiences, setExperiences] = useState<Experience[]>(initialExperience);
    const [isEditing, setIsEditing] = useState(false);
    const [currentExp, setCurrentExp] = useState<Partial<Experience>>({});
    const router = useRouter();

    const resetForm = () => {
        setCurrentExp({});
        setIsEditing(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this experience?')) return;

        const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setExperiences(experiences.filter(e => e.id !== id));
            router.refresh();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = currentExp.id ? `/api/experience/${currentExp.id}` : '/api/experience';
        const method = currentExp.id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentExp),
        });

        if (res.ok) {
            const savedExp = await res.json();
            // Backend returns ISO dates, frontend might need conversion if we were using date objects, but string is fine for now
            if (currentExp.id) {
                setExperiences(experiences.map(e => e.id === savedExp.id ? savedExp : e));
            } else {
                setExperiences([savedExp, ...experiences]);
            }
            resetForm();
            router.refresh();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Experience Management</h1>
                <button onClick={() => setIsEditing(true)} className={styles.addButton}>
                    <FaPlus /> Add Experience
                </button>
            </div>

            {isEditing && (
                <div className={styles.formContainer}>
                    <h2>{currentExp.id ? 'Edit Experience' : 'Add New Experience'}</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.row}>
                            <input
                                type="text"
                                placeholder="Role"
                                value={currentExp.role || ''}
                                onChange={e => setCurrentExp({ ...currentExp, role: e.target.value })}
                                required
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Company"
                                value={currentExp.company || ''}
                                onChange={e => setCurrentExp({ ...currentExp, company: e.target.value })}
                                required
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.row}>
                            <input
                                type="text"
                                placeholder="Location"
                                value={currentExp.location || ''}
                                onChange={e => setCurrentExp({ ...currentExp, location: e.target.value })}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.row}>
                            <div className={styles.dateGroup}>
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={currentExp.startDate ? new Date(currentExp.startDate).toISOString().split('T')[0] : ''}
                                    onChange={e => setCurrentExp({ ...currentExp, startDate: e.target.value })}
                                    required
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.dateGroup}>
                                <label>End Date (Leave empty for Present)</label>
                                <input
                                    type="date"
                                    value={currentExp.endDate ? new Date(currentExp.endDate).toISOString().split('T')[0] : ''}
                                    onChange={e => setCurrentExp({ ...currentExp, endDate: e.target.value || null })}
                                    className={styles.input}
                                />
                            </div>
                        </div>
                        <textarea
                            placeholder="Description (Markdown Supported: - bullet points, **bold**, *italic*)"
                            value={currentExp.description || ''}
                            onChange={e => setCurrentExp({ ...currentExp, description: e.target.value })}
                            required
                            className={styles.textarea}
                        />
                        <div className={styles.formActions}>
                            <button type="button" onClick={resetForm} className={styles.cancelButton}>Cancel</button>
                            <button type="submit" className={styles.saveButton}>Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.grid}>
                {experiences.map(exp => (
                    <div key={exp.id} className={styles.card}>
                        <div className={styles.cardInfo}>
                            <h3>{exp.role}</h3>
                            <p className={styles.company}>{exp.company}</p>
                            <p className={styles.date}>
                                {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                            </p>
                        </div>
                        <div className={styles.cardActions}>
                            <button onClick={() => { setCurrentExp(exp); setIsEditing(true); }} className={styles.iconButton}>
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(exp.id)} className={styles.iconButtonDelete}>
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
