import Link from 'next/link';
import { StaggerItem } from '@/components/MotionWrappers';
import { ResumeDownloadButton } from '@/components/ResumeDownloadButton';
import { getActiveResumes } from '@/lib/data/resumes';
import styles from '@/app/page.module.css';
import heroStyles from './HeroSection.module.css';

export async function HeroSection() {
  const activeResumes = await getActiveResumes();
  const serializedResumes = activeResumes.map((r) => ({
    id: r.id,
    title: r.title,
    roleCategory: r.roleCategory,
    fileUrl: r.fileUrl,
    fileName: r.fileName,
    isPrimary: r.isPrimary,
  }));

  return (
    <StaggerItem className={`${styles.bentoItem} ${styles.span3} ${heroStyles.heroCard}`}>
      {/* Top Profile & Availability Pill */}
      <div className={heroStyles.topRow}>
        <div className={heroStyles.profileInfo}>
          <div className={heroStyles.avatarCircle}>W</div>
          <div className={heroStyles.nameBlock}>
            <span className={heroStyles.nameTitle}>Waris (Save)</span>
            <span className={heroStyles.roleSubtitle}>Full-Stack Software Engineer</span>
          </div>
        </div>

        <div className={heroStyles.statusPill}>
          <span className={heroStyles.pulsingDot} />
          <span>Available for Hire</span>
        </div>
      </div>

      {/* Main Headline */}
      <h1 className={heroStyles.headline}>
        Building High-Performance Full-Stack Systems & Clean Architectures
      </h1>

      {/* Bio Paragraph */}
      <p className={heroStyles.bio}>
        Specializing in Next.js 16, TypeScript, Distributed Backend Services, and Hexagonal Design.
        Obsessed with pixel-perfect physics micro-interactions and zero-dependency domain boundaries.
      </p>

      {/* Tech Stack Chips */}
      <div className={heroStyles.chipsContainer}>
        <span className={heroStyles.chip}>Next.js 16</span>
        <span className={heroStyles.chip}>TypeScript</span>
        <span className={heroStyles.chip}>Prisma ORM</span>
        <span className={heroStyles.chip}>PostgreSQL (Neon)</span>
        <span className={heroStyles.chip}>Flutter / Dart</span>
        <span className={heroStyles.chip}>Hexagonal Architecture</span>
      </div>

      {/* Action Buttons */}
      <div className={heroStyles.actionsRow}>
        <Link href="#projects" className={heroStyles.ctaPrimary}>
          Explore Projects
        </Link>
        <ResumeDownloadButton initialResumes={serializedResumes} />
        <Link href="#contact" className={heroStyles.ctaSecondary}>
          Get in Touch
        </Link>
      </div>
    </StaggerItem>
  );
}
