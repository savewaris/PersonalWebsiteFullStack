'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaTools, FaProjectDiagram, FaBriefcase, FaEnvelope, FaLock } from 'react-icons/fa';
import styles from './Navbar.module.css';

const SECTIONS = [
  { id: 'skills', label: 'Skills', icon: FaTools },
  { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
  { id: 'experience', label: 'Experience', icon: FaBriefcase },
  { id: 'contact', label: 'Contact', icon: FaEnvelope },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    const elements = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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
    <nav className={styles.navbar} aria-label="Main navigation">
      <Link
        href="/"
        className={styles.logo}
        aria-label="Home"
        onClick={(e) => {
          if (pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            window.history.pushState(null, '', '/');
          }
        }}
      >
        <FaHome />
      </Link>
      <ul className={styles.navLinks}>
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <Link
              href={`#${id}`}
              aria-label={label}
              aria-current={activeSection === id ? 'true' : undefined}
              className={activeSection === id ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
              onClick={(e) => handleScrollToSection(e, id)}
            >
              <Icon />
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/admin" className={styles.adminLink} aria-label="Admin">
        <FaLock />
      </Link>
    </nav>
  );
}
