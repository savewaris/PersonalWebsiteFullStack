'use client';

import { FaEye, FaEyeSlash, FaStar, FaRegStar } from 'react-icons/fa';
import { toggleAdminFlag, type Identifiable } from '@/lib/useAdminCrud';
import styles from './admin.module.css';

interface FlaggedItem extends Identifiable {
  isVisible: boolean;
  isFeatured: boolean;
}

export function StatusToggleButtons<T extends FlaggedItem>({
  item,
  endpoint,
  setItems,
}: {
  item: T;
  endpoint: string;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => toggleAdminFlag(endpoint, item, 'isVisible', setItems)}
        className={`${styles.statusToggle} ${!item.isVisible ? styles.statusToggleOff : ''}`}
        title={item.isVisible ? 'Visible on public site — click to hide' : 'Hidden from public site — click to show'}
      >
        {item.isVisible ? <FaEye size={13} /> : <FaEyeSlash size={13} />}
      </button>
      <button
        type="button"
        onClick={() => toggleAdminFlag(endpoint, item, 'isFeatured', setItems)}
        className={`${styles.statusToggle} ${item.isFeatured ? styles.statusToggleFeatured : ''}`}
        title={item.isFeatured ? 'Featured — click to unfeature' : 'Not featured — click to feature'}
      >
        {item.isFeatured ? <FaStar size={13} /> : <FaRegStar size={13} />}
      </button>
    </>
  );
}
