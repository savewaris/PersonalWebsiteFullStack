import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import styles from './AdminLayout.module.css';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session || session.value !== 'true') {
        redirect('/login');
    }

    return (
        <div className={styles.adminContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>Admin Panel</h2>
                </div>
                <nav className={styles.nav}>
                    <Link href="/admin" className={styles.navLink}>Dashboard</Link>
                    <Link href="/admin/skills" className={styles.navLink}>Skills</Link>
                    <Link href="/admin/projects" className={styles.navLink}>Projects</Link>
                    <Link href="/admin/experience" className={styles.navLink}>Experience</Link>
                    <Link href="/admin/education" className={styles.navLink}>Education</Link>
                    <Link href="/admin/hobbies" className={styles.navLink}>Hobbies</Link>
                    <Link href="/admin/interests" className={styles.navLink}>Interests</Link>
                    <Link href="/admin/languages" className={styles.navLink}>Languages</Link>
                    <Link href="/" className={styles.navLink}>View Site</Link>
                </nav>
            </aside>
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}
