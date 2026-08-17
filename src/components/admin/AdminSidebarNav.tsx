'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaTachometerAlt,
  FaCode,
  FaFolderOpen,
  FaBriefcase,
  FaGraduationCap,
  FaSmile,
  FaLightbulb,
  FaLanguage,
  FaEnvelope,
  FaExternalLinkAlt,
  FaSignOutAlt,
} from 'react-icons/fa';
import styles from '@/app/admin/AdminLayout.module.css';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: FaTachometerAlt, exact: true },
  { href: '/admin/skills', label: 'Skills', icon: FaCode },
  { href: '/admin/projects', label: 'Projects', icon: FaFolderOpen },
  { href: '/admin/experience', label: 'Experience', icon: FaBriefcase },
  { href: '/admin/education', label: 'Education', icon: FaGraduationCap },
  { href: '/admin/hobbies', label: 'Hobbies', icon: FaSmile },
  { href: '/admin/interests', label: 'Interests', icon: FaLightbulb },
  { href: '/admin/languages', label: 'Languages', icon: FaLanguage },
  { href: '/admin/messages', label: 'Messages', icon: FaEnvelope },
];

export function AdminSidebarNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
          >
            <Icon className={styles.navIcon} />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <div style={{ height: '1px', background: 'var(--border)', margin: '16px 0' }} />

      <Link href="/" target="_blank" prefetch={false} className={styles.navLink}>
        <FaExternalLinkAlt className={styles.navIcon} />
        <span>View Site</span>
      </Link>

      <button type="button" onClick={handleLogout} className={`${styles.navLink} ${styles.logoutBtn}`}>
        <FaSignOutAlt className={styles.navIcon} />
        <span>Logout</span>
      </button>
    </nav>
  );
}
