import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p>&copy; {new Date().getFullYear()} My Portfolio. Built with Next.js & Vanilla CSS.</p>
                <div className={styles.socials}>
                    <a href="#" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
                </div>
            </div>
        </footer>
    );
}
