import styles from '@/components/admin/admin.module.css';

export default function AdminLoading() {
  return (
    <div>
      {/* Header Skeleton */}
      <div className={`${styles.skeletonBlock} ${styles.skeletonHeader}`} />

      {/* Grid of Card Skeletons */}
      <div className={styles.cardGrid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`${styles.skeletonBlock} ${styles.skeletonCard}`} />
        ))}
      </div>
    </div>
  );
}
