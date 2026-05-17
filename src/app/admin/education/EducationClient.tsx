'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './education.module.css';

interface Education {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    faculty: string | null;
    startDate: string;
    endDate: string | null;
    score: string | null;
}

export default function EducationClient({ initialEducation }: { initialEducation: Education[] }) {
    const [education, setEducation] = useState<Education[]>(initialEducation);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEdu, setCurrentEdu] = useState<Partial<Education>>({});
    const router = useRouter();

    const resetForm = () => {
        setCurrentEdu({});
        setIsEditing(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this education entry?')) return;

        const res = await fetch(`/api/education/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setEducation(education.filter(e => e.id !== id));
            router.refresh();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = currentEdu.id ? `/api/education/${currentEdu.id}` : '/api/education';
        const method = currentEdu.id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentEdu),
        });

        if (res.ok) {
            const savedEdu = await res.json();
            if (currentEdu.id) {
                setEducation(education.map(e => e.id === savedEdu.id ? savedEdu : e));
            } else {
                setEducation([savedEdu, ...education]);
            }
            resetForm();
            router.refresh();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Education Management</h1>
                <button onClick={() => setIsEditing(true)} className={styles.addButton}>
                    <FaPlus /> Add Education
                </button>
            </div>

            {isEditing && (
                <div className={styles.formContainer}>
                    <h2>{currentEdu.id ? 'Edit Education' : 'Add New Education'}</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.row}>
                            <input
                                type="text"
                                placeholder="Institution (e.g. University of Example)"
                                value={currentEdu.institution || ''}
                                onChange={e => setCurrentEdu({ ...currentEdu, institution: e.target.value })}
                                required
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Degree (e.g. Bachelor)"
                                value={currentEdu.degree || ''}
                                onChange={e => setCurrentEdu({ ...currentEdu, degree: e.target.value })}
                                required
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.row}>
                            <input
                                type="text"
                                placeholder="Field of Study (e.g. Computer Science)"
                                value={currentEdu.fieldOfStudy || ''}
                                onChange={e => setCurrentEdu({ ...currentEdu, fieldOfStudy: e.target.value })}
                                required
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Faculty (e.g. Faculty of Information and Communication Technology)"
                                value={currentEdu.faculty || ''}
                                onChange={e => setCurrentEdu({ ...currentEdu, faculty: e.target.value })}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.row}>
                            <input
                                type="text"
                                placeholder="Score / GPA (Optional)"
                                value={currentEdu.score || ''}
                                onChange={e => setCurrentEdu({ ...currentEdu, score: e.target.value })}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.row}>
                            <div className={styles.dateGroup}>
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={currentEdu.startDate ? new Date(currentEdu.startDate).toISOString().split('T')[0] : ''}
                                    onChange={e => setCurrentEdu({ ...currentEdu, startDate: e.target.value })}
                                    required
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.dateGroup}>
                                <label>End Date (Leave empty for Present)</label>
                                <input
                                    type="date"
                                    value={currentEdu.endDate ? new Date(currentEdu.endDate).toISOString().split('T')[0] : ''}
                                    onChange={e => setCurrentEdu({ ...currentEdu, endDate: e.target.value || null })}
                                    className={styles.input}
                                />
                            </div>
                        </div>
                        <div className={styles.formActions}>
                            <button type="button" onClick={resetForm} className={styles.cancelButton}>Cancel</button>
                            <button type="submit" className={styles.saveButton}>Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.grid}>
                {education.map(edu => (
                    <div key={edu.id} className={styles.card}>
                        <div className={styles.cardInfo}>
                            <h3>{edu.institution}</h3>
                            <p className={styles.company}>{edu.degree} in {edu.fieldOfStudy}</p>
                            {edu.faculty && <p className={styles.date} style={{ color: 'var(--accent)', fontStyle: 'italic' }}>🏛️ {edu.faculty}</p>}
                            <p className={styles.date}>
                                {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                            </p>
                            {edu.score && <p className={styles.date}>Score: {edu.score}</p>}
                        </div>
                        <div className={styles.cardActions}>
                            <button onClick={() => { setCurrentEdu(edu); setIsEditing(true); }} className={styles.iconButton}>
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(edu.id)} className={styles.iconButtonDelete}>
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
