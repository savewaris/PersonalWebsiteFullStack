import Link from 'next/link';
import { FaHome, FaFolderOpen, FaExclamationTriangle } from 'react-icons/fa';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.codeBadge}>
          <FaExclamationTriangle
            style={{ color: '#f59e0b', marginRight: '6px', verticalAlign: '-1px' }}
          />
          HTTP 404 • ROUTE_NOT_FOUND
        </div>

        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Signal Lost in Deep Space</h2>

        <p className={styles.description}>
          The requested coordinate does not exist in this domain architecture. It may have been
          relocated, refactored, or exists only in an alternate branch.
        </p>

        <div className={styles.terminalBox}>
          <code>
            &gt; error: route [404] unreachable
            <br />
            &gt; suggested_action: reroute_to_root()
          </code>
        </div>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            <FaHome size={15} />
            <span>Return to Command Center</span>
          </Link>

          <Link href="/#projects" className={styles.secondaryBtn}>
            <FaFolderOpen size={15} />
            <span>View Projects</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
