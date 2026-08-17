'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    // If on home page, smoothly scroll to center
    if (pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.history.pushState(null, '', `#${targetId}`);
      }
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link
          href="/"
          className={styles.logo}
          onClick={(e) => {
            if (pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              window.history.pushState(null, '', '/');
            }
          }}
        >
          Portfolio
        </Link>
        <ul className={styles.navLinks}>
          <li>
            <Link href="#skills" onClick={(e) => handleScrollToSection(e, 'skills')}>
              Skills
            </Link>
          </li>
          <li>
            <Link href="#projects" onClick={(e) => handleScrollToSection(e, 'projects')}>
              Projects
            </Link>
          </li>
          <li>
            <Link href="#experience" onClick={(e) => handleScrollToSection(e, 'experience')}>
              Experience
            </Link>
          </li>
          <li>
            <Link href="#contact" onClick={(e) => handleScrollToSection(e, 'contact')}>
              Contact
            </Link>
          </li>
          <li>
            <Link href="/admin" className={styles.adminLink}>
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
