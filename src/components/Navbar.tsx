import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    Portfolio
                </Link>
                <ul className={styles.navLinks}>
                    <li><Link href="#skills">Skills</Link></li>
                    <li><Link href="#projects">Projects</Link></li>
                    <li><Link href="#experience">Experience</Link></li>
                    {/* Admin Link for demo purposes */}
                    <li><Link href="/admin" className={styles.adminLink}>Admin</Link></li>
                </ul>
            </div>
        </nav>
    );
}
