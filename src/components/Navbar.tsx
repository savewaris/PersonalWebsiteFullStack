'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaTools, FaProjectDiagram, FaBriefcase, FaEnvelope, FaLock } from 'react-icons/fa';
import styles from './Navbar.module.css';

const SECTIONS = [
  { id: 'skills', label: 'Skills', icon: FaTools },
  { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
  { id: 'experience', label: 'Experience', icon: FaBriefcase },
  { id: 'contact', label: 'Contact', icon: FaEnvelope },
];

const EASE: [number, number, number, number] = [0.25, 0.8, 0.25, 1];

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

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
    <nav
      className={isExpanded ? `${styles.navbar} ${styles.navbarExpanded}` : styles.navbar}
      aria-label="Main navigation"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
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
        <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className={styles.iconSlot}>
          <FaHome />
        </motion.span>
      </Link>
      <ul className={styles.navLinks}>
        {SECTIONS.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <li key={id} className={styles.navLinkItem}>
              <Link
                href={`#${id}`}
                aria-label={label}
                aria-current={isActive ? 'true' : undefined}
                className={styles.navLink}
                onClick={(e) => handleScrollToSection(e, id)}
              >
                {isActive && (
                  <motion.span
                    layoutId="navActiveIndicator"
                    className={styles.navLinkActive}
                    transition={{ duration: 0.25, ease: EASE }}
                  />
                )}
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={styles.iconSlot}
                >
                  <Icon />
                </motion.span>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      className={styles.navLinkLabel}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15, ease: EASE }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link href="/admin" className={styles.adminLink} aria-label="Admin">
        <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className={styles.iconSlot}>
          <FaLock />
        </motion.span>
      </Link>
    </nav>
  );
}
