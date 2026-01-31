import styles from './page.module.css';

export default function AdminDashboard() {
    return (
        <div className={styles.dashboard}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Select a section from the sidebar to manage your content.</p>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Skills</h3>
                    <p>Manage your technical skills</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Projects</h3>
                    <p>Update your portfolio projects</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Experience</h3>
                    <p>Edit your work history</p>
                </div>
            </div>
        </div>
    );
}
