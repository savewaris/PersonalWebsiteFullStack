import { StaggerItem } from '@/components/MotionWrappers';
import styles from '@/app/page.module.css';
import type { Language, Hobby, Interest } from '@prisma/client';
import { LanguagesSection } from './LanguagesSection';
import { InterestsSection } from './InterestsSection';
import { HobbiesSection } from './HobbiesSection';

interface LanguagesInterestsSectionProps {
  languages: Language[];
  hobbies: Hobby[];
  interests: Interest[];
}

export function LanguagesInterestsSection({ languages, hobbies, interests }: LanguagesInterestsSectionProps) {
  return (
    <StaggerItem className={`${styles.bentoItem} ${styles.span4}`} style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
      <LanguagesSection languages={languages} />
      <InterestsSection interests={interests} />
      {hobbies.length > 0 && <HobbiesSection hobbies={hobbies} />}
    </StaggerItem>
  );
}
