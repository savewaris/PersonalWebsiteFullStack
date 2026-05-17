import styles from './page.module.css';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 0; // Ensure fresh data on admin dashboard

export default async function AdminDashboard() {
    const [
        skills,
        projects,
        experience,
        messages,
        education,
        hobbies,
        languages
    ] = await Promise.all([
        prisma.skill.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
        prisma.project.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
        prisma.experience.findMany({ orderBy: { startDate: 'desc' }, take: 5 }),
        prisma.message.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
        prisma.education.findMany({ orderBy: { startDate: 'desc' }, take: 5 }),
        prisma.hobby.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
        prisma.language.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
    ]);

    return (
        <div className={styles.dashboard}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Here is a quick overview of your portfolio content.</p>

            <div className={styles.statsGrid}>
                {/* Skills */}
                <Link href="/admin/skills" className={styles.statCard}>
                    <div className={styles.cardHeader}>
                        <h3>Skills</h3>
                        <span className={styles.countBadge}>{skills.length}</span>
                    </div>
                    <ul className={styles.previewList}>
                        {skills.map(s => <li key={s.id}>{s.name} ({s.proficiency}%)</li>)}
                        {skills.length === 0 && <li>No skills added</li>}
                    </ul>
                </Link>

                {/* Projects */}
                <Link href="/admin/projects" className={styles.statCard}>
                    <div className={styles.cardHeader}>
                        <h3>Projects</h3>
                        <span className={styles.countBadge}>{projects.length}</span>
                    </div>
                    <ul className={styles.previewList}>
                        {projects.map(p => <li key={p.id}>{p.title}</li>)}
                        {projects.length === 0 && <li>No projects added</li>}
                    </ul>
                </Link>

                {/* Experience */}
                <Link href="/admin/experience" className={styles.statCard}>
                    <div className={styles.cardHeader}>
                        <h3>Experience</h3>
                        <span className={styles.countBadge}>{experience.length}</span>
                    </div>
                    <ul className={styles.previewList}>
                        {experience.map(e => <li key={e.id}>{e.role} at {e.company}</li>)}
                        {experience.length === 0 && <li>No experience added</li>}
                    </ul>
                </Link>

                {/* Education */}
                <Link href="/admin/education" className={styles.statCard}>
                    <div className={styles.cardHeader}>
                        <h3>Education</h3>
                        <span className={styles.countBadge}>{education.length}</span>
                    </div>
                    <ul className={styles.previewList}>
                        {education.map(e => <li key={e.id}>{e.degree}</li>)}
                        {education.length === 0 && <li>No education added</li>}
                    </ul>
                </Link>

                {/* Messages */}
                <Link href="/admin/messages" className={styles.statCard}>
                    <div className={styles.cardHeader}>
                        <h3>Messages</h3>
                        <span className={styles.countBadge}>{messages.length}</span>
                    </div>
                    <ul className={styles.previewList}>
                        {messages.map(m => (
                            <li key={m.id} style={{ fontWeight: m.read ? 'normal' : 'bold' }}>
                                {m.name}: {m.message.substring(0, 20)}...
                            </li>
                        ))}
                        {messages.length === 0 && <li>No messages</li>}
                    </ul>
                </Link>

                {/* Hobbies */}
                <Link href="/admin/hobbies" className={styles.statCard}>
                    <div className={styles.cardHeader}>
                        <h3>Hobbies</h3>
                        <span className={styles.countBadge}>{hobbies.length}</span>
                    </div>
                    <ul className={styles.previewList}>
                        {hobbies.map(h => <li key={h.id}>{h.emoji} {h.name}</li>)}
                        {hobbies.length === 0 && <li>No hobbies added</li>}
                    </ul>
                </Link>
                
                {/* Languages */}
                <Link href="/admin/languages" className={styles.statCard}>
                    <div className={styles.cardHeader}>
                        <h3>Languages</h3>
                        <span className={styles.countBadge}>{languages.length}</span>
                    </div>
                    <ul className={styles.previewList}>
                        {languages.map(l => <li key={l.id}>{l.name} - {l.proficiency}</li>)}
                        {languages.length === 0 && <li>No languages added</li>}
                    </ul>
                </Link>
            </div>
        </div>
    );
}
