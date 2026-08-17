import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import styles from './page.module.css';

export const revalidate = 0;

export default async function AdminDashboard() {
  const [
    skillsCount,
    projectsCount,
    experienceCount,
    educationCount,
    messagesCount,
    unreadMessagesCount,
    hobbiesCount,
    languagesCount,
    recentSkills,
    recentProjects,
    recentExperience,
    recentEducation,
    recentMessages,
  ] = await Promise.all([
    prisma.skill.count(),
    prisma.project.count(),
    prisma.experience.count(),
    prisma.education.count(),
    prisma.message.count(),
    prisma.message.count({ where: { read: false } }),
    prisma.hobby.count(),
    prisma.language.count(),
    prisma.skill.findMany({ orderBy: { proficiency: 'desc' }, take: 4 }),
    prisma.project.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.experience.findMany({ orderBy: { startDate: 'desc' }, take: 3 }),
    prisma.education.findMany({ orderBy: { startDate: 'desc' }, take: 3 }),
    prisma.message.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
  ]);

  const cards = [
    {
      title: 'Skills',
      count: skillsCount,
      href: '/admin/skills',
      items: recentSkills.map((s) => `${s.name} (${s.proficiency}%)`),
      emptyText: 'No skills added yet',
    },
    {
      title: 'Projects',
      count: projectsCount,
      href: '/admin/projects',
      items: recentProjects.map((p) => p.title),
      emptyText: 'No projects added yet',
    },
    {
      title: 'Experience',
      count: experienceCount,
      href: '/admin/experience',
      items: recentExperience.map((e) => `${e.role} at ${e.company}`),
      emptyText: 'No experience added yet',
    },
    {
      title: 'Education',
      count: educationCount,
      href: '/admin/education',
      items: recentEducation.map((e) => `${e.degree} (${e.institution})`),
      emptyText: 'No education added yet',
    },
    {
      title: 'Messages',
      count: messagesCount,
      extraBadge: unreadMessagesCount > 0 ? `${unreadMessagesCount} unread` : undefined,
      href: '/admin/messages',
      items: recentMessages.map((m) => `${m.name}: ${m.message.slice(0, 30)}...`),
      emptyText: 'No messages yet',
    },
    {
      title: 'Hobbies & Interests',
      count: hobbiesCount + languagesCount,
      href: '/admin/hobbies',
      items: [`${hobbiesCount} Hobbies`, `${languagesCount} Languages`],
      emptyText: 'No personal entries',
    },
  ];

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Admin Overview</h1>
      <p className={styles.subtitle}>Manage your portfolio content, resume generator, and incoming messages.</p>

      <div className={styles.statsGrid}>
        {cards.map((card) => (
          <Link key={card.title} href={card.href} className={styles.statCard}>
            <div className={styles.cardHeader}>
              <h3>{card.title}</h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                {card.extraBadge && (
                  <span className={styles.countBadge} style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
                    {card.extraBadge}
                  </span>
                )}
                <span className={styles.countBadge}>{card.count}</span>
              </div>
            </div>
            <ul className={styles.previewList}>
              {card.items.length > 0 ? (
                card.items.map((item, idx) => <li key={idx}>{item}</li>)
              ) : (
                <li>{card.emptyText}</li>
              )}
            </ul>
          </Link>
        ))}
      </div>
    </div>
  );
}
