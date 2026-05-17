'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './skills.module.css';
import { SKILL_SUGGESTIONS } from '@/lib/recommendations';

interface Skill {
    id: string;
    name: string;
    proficiency: number;
    category: string;
    icon: string | null;
}

export default function SkillsClient({ initialSkills }: { initialSkills: Skill[] }) {
    const [skills, setSkills] = useState<Skill[]>(initialSkills);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSkill, setCurrentSkill] = useState<Partial<Skill>>({});
    const [categoryFilter, setCategoryFilter] = useState<string>('All');
    const router = useRouter();

    const resetForm = () => {
        setCurrentSkill({});
        setIsEditing(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this skill?')) return;
        const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setSkills(skills.filter(s => s.id !== id));
            router.refresh();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = currentSkill.id ? `/api/skills/${currentSkill.id}` : '/api/skills';
        const method = currentSkill.id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentSkill),
        });

        if (res.ok) {
            const savedSkill = await res.json();
            if (currentSkill.id) {
                setSkills(skills.map(s => s.id === savedSkill.id ? savedSkill : s));
            } else {
                setSkills([savedSkill, ...skills]);
            }
            resetForm();
            router.refresh();
        }
    };

    // Filter out already-added suggestions
    const existingNames = new Set(skills.map(s => s.name.toLowerCase()));
    const categories = ['All', ...Array.from(new Set(SKILL_SUGGESTIONS.map(s => s.category)))];
    const filteredSuggestions = SKILL_SUGGESTIONS.filter(s =>
        !existingNames.has(s.name.toLowerCase()) &&
        (categoryFilter === 'All' || s.category === categoryFilter)
    );

    const applyChip = (suggestion: typeof SKILL_SUGGESTIONS[0]) => {
        setCurrentSkill({ name: suggestion.name, proficiency: suggestion.proficiency, category: suggestion.category });
        setIsEditing(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Skills Management</h1>
                <button onClick={() => setIsEditing(true)} className={styles.addButton}>
                    <FaPlus /> Add Skill
                </button>
            </div>

            {/* ── Recommendations ── */}
            {!isEditing && filteredSuggestions.length > 0 && (
                <div className={styles.recommendSection}>
                    <div className={styles.recommendHeader}>
                        <span className={styles.recommendLabel}>✨ Suggestions — click to add</span>
                        <div className={styles.filterTabs}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`${styles.filterTab} ${categoryFilter === cat ? styles.filterTabActive : ''}`}
                                    onClick={() => setCategoryFilter(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={styles.chips}>
                        {filteredSuggestions.map((s, i) => (
                            <button key={i} className={styles.chip} onClick={() => applyChip(s)}>
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isEditing && (
                <div className={styles.formContainer}>
                    <h2>{currentSkill.id ? 'Edit Skill' : 'Add New Skill'}</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <input
                            type="text"
                            placeholder="Skill Name"
                            value={currentSkill.name || ''}
                            onChange={e => setCurrentSkill({ ...currentSkill, name: e.target.value })}
                            required
                            className={styles.input}
                        />
                        <input
                            type="number"
                            placeholder="Proficiency (0-100)"
                            value={currentSkill.proficiency || ''}
                            onChange={e => setCurrentSkill({ ...currentSkill, proficiency: Number(e.target.value) })}
                            required
                            max="100"
                            min="0"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Category (e.g. Frontend)"
                            value={currentSkill.category || ''}
                            onChange={e => setCurrentSkill({ ...currentSkill, category: e.target.value })}
                            required
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Icon (Optional)"
                            value={currentSkill.icon || ''}
                            onChange={e => setCurrentSkill({ ...currentSkill, icon: e.target.value })}
                            className={styles.input}
                        />
                        <div className={styles.formActions}>
                            <button type="button" onClick={resetForm} className={styles.cancelButton}>Cancel</button>
                            <button type="submit" className={styles.saveButton}>Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.grid}>
                {skills.map(skill => (
                    <div key={skill.id} className={styles.card}>
                        <div className={styles.cardInfo}>
                            <h3>{skill.name}</h3>
                            <p>{skill.category} • {skill.proficiency}%</p>
                        </div>
                        <div className={styles.cardActions}>
                            <button onClick={() => { setCurrentSkill(skill); setIsEditing(true); }} className={styles.iconButton}>
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(skill.id)} className={styles.iconButtonDelete}>
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
