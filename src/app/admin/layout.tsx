import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminSidebarNav } from '@/components/admin/AdminSidebarNav';
import styles from './AdminLayout.module.css';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'true') {
    redirect('/login');
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Portfolio Admin</h2>
        </div>
        <AdminSidebarNav />
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
