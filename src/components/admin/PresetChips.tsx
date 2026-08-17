import React from 'react';
import styles from './admin.module.css';

interface PresetChipsProps<T> {
  title?: string;
  items: T[];
  getLabel: (item: T) => string;
  onSelect: (item: T) => void;
}

export function PresetChips<T>({
  title = 'Suggested Presets (Click to add)',
  items,
  getLabel,
  onSelect,
}: PresetChipsProps<T>) {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.presetContainer}>
      <div className={styles.presetTitle}>{title}</div>
      <div className={styles.presetChips}>
        {items.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(item)}
            className={styles.chip}
          >
            + {getLabel(item)}
          </button>
        ))}
      </div>
    </div>
  );
}
