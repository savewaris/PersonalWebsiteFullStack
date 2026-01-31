'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './hobbies.module.css';

interface Hobby {
    id: string;
    name: string;
    emoji: string | null;
}

export default function HobbiesClient({ initialHobbies }: { initialHobbies: Hobby[] }) {
    const [hobbies, setHobbies] = useState<Hobby[]>(initialHobbies);
    const [isEditing, setIsEditing] = useState(false);
    const [currentHobby, setCurrentHobby] = useState<Partial<Hobby>>({});
    const router = useRouter();

    const resetForm = () => {
        setCurrentHobby({});
        setIsEditing(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this hobby?')) return;

        const res = await fetch(`/api/hobbies/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setHobbies(hobbies.filter(h => h.id !== id));
            router.refresh();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = currentHobby.id ? `/api/hobbies/${currentHobby.id}` : '/api/hobbies';
        const method = currentHobby.id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentHobby),
        });

        if (res.ok) {
            const savedHobby = await res.json();
            if (currentHobby.id) {
                setHobbies(hobbies.map(h => h.id === savedHobby.id ? savedHobby : h));
            } else {
                setHobbies([savedHobby, ...hobbies]);
            }
            resetForm();
            router.refresh();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Hobbies Management</h1>
                <button onClick={() => setIsEditing(true)} className={styles.addButton}>
                    <FaPlus /> Add Hobby
                </button>
            </div>

            {isEditing && (
                <div className={styles.formContainer}>
                    <h2>{currentHobby.id ? 'Edit Hobby' : 'Add New Hobby'}</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.row}>
                            <input
                                type="text"
                                placeholder="Hobby Name (e.g. Photography)"
                                value={currentHobby.name || ''}
                                onChange={e => setCurrentHobby({ ...currentHobby, name: e.target.value })}
                                required
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Emoji (e.g. 📷)"
                                value={currentHobby.emoji || ''}
                                onChange={e => setCurrentHobby({ ...currentHobby, emoji: e.target.value })}
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
                {hobbies.map(hobby => (
                    <div key={hobby.id} className={styles.card}>
                        <div className={styles.emoji}>{hobby.emoji}</div>
                        <div className={styles.cardInfo}>
                            <h3>{hobby.name}</h3>
                        </div>
                        <div className={styles.cardActions}>
                            <button onClick={() => { setCurrentHobby(hobby); setIsEditing(true); }} className={styles.iconButton}>
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(hobby.id)} className={styles.iconButtonDelete}>
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
