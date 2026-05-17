'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './projects.module.css';

interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    demoUrl: string | null;
    repoUrl: string | null;
    tags: string;
}

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
    const router = useRouter();

    const resetForm = () => {
        setCurrentProject({});
        setIsEditing(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setProjects(projects.filter(p => p.id !== id));
            router.refresh();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = currentProject.id ? `/api/projects/${currentProject.id}` : '/api/projects';
        const method = currentProject.id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentProject),
        });

        if (res.ok) {
            const savedProject = await res.json();
            if (currentProject.id) {
                setProjects(projects.map(p => p.id === savedProject.id ? savedProject : p));
            } else {
                setProjects([savedProject, ...projects]);
            }
            resetForm();
            router.refresh();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Projects Management</h1>
                <button onClick={() => setIsEditing(true)} className={styles.addButton}>
                    <FaPlus /> Add Project
                </button>
            </div>

            {isEditing && (
                <div className={styles.formContainer}>
                    <h2>{currentProject.id ? 'Edit Project' : 'Add New Project'}</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <input
                            type="text"
                            placeholder="Project Title"
                            value={currentProject.title || ''}
                            onChange={e => setCurrentProject({ ...currentProject, title: e.target.value })}
                            required
                            className={styles.input}
                        />
                        <textarea
                            placeholder="Description (Markdown Supported: **bold**, *italic*, [link](url))"
                            value={currentProject.description || ''}
                            onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })}
                            required
                            className={styles.textarea}
                        />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={currentProject.imageUrl || ''}
                            onChange={e => setCurrentProject({ ...currentProject, imageUrl: e.target.value })}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Demo URL"
                            value={currentProject.demoUrl || ''}
                            onChange={e => setCurrentProject({ ...currentProject, demoUrl: e.target.value })}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Repo URL"
                            value={currentProject.repoUrl || ''}
                            onChange={e => setCurrentProject({ ...currentProject, repoUrl: e.target.value })}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Tags (comma separated)"
                            value={currentProject.tags || ''}
                            onChange={e => setCurrentProject({ ...currentProject, tags: e.target.value })}
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
                {projects.map(project => (
                    <div key={project.id} className={styles.card}>
                        <div className={styles.cardInfo}>
                            <h3>{project.title}</h3>
                            <p className={styles.truncate}>{project.description}</p>
                        </div>
                        <div className={styles.cardActions}>
                            <button onClick={() => { setCurrentProject(project); setIsEditing(true); }} className={styles.iconButton}>
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(project.id)} className={styles.iconButtonDelete}>
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
