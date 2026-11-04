'use client';

import type { ReactNode } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FaEllipsisH, FaTrash } from 'react-icons/fa';
import styles from './RowActions.module.css';

export interface RowAction {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  /** Renders the menu item as a link (e.g. Download, Preview). */
  href?: string;
  download?: string;
  external?: boolean;
}

interface RowActionsProps {
  /** Human name of the row, used in accessible names ("Edit waris-cv"). */
  itemName: string;
  /** The one promoted action, shown inline with a visible label on desktop. */
  primary: RowAction;
  /** Remaining actions, shown in the ⋯ menu above the divider. */
  menu?: RowAction[];
  onDelete: () => void;
  deleteLabel?: string;
}

/**
 * Shared row action menu: one labelled primary action, a persistent ⋯ menu, and Delete
 * last behind a divider (red text only). On touch devices only the 44px ⋯ trigger shows,
 * so the primary action is duplicated as the first menu item.
 */
export function RowActions({ itemName, primary, menu = [], onDelete, deleteLabel = 'Delete' }: RowActionsProps) {
  const renderItem = (action: RowAction, touchOnly = false) => {
    const content = (
      <>
        {action.icon}
        <span>{action.label}</span>
      </>
    );
    if (action.href) {
      return (
        <DropdownMenu.Item key={action.label} asChild className={`${styles.item} ${touchOnly ? styles.touchOnly : ''}`}>
          <a
            href={action.href}
            download={action.download}
            {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {content}
          </a>
        </DropdownMenu.Item>
      );
    }
    return (
      <DropdownMenu.Item
        key={action.label}
        className={`${styles.item} ${touchOnly ? styles.touchOnly : ''}`}
        onSelect={action.onClick}
      >
        {content}
      </DropdownMenu.Item>
    );
  };

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.primary}
        onClick={primary.onClick}
        aria-label={`${primary.label} ${itemName}`}
      >
        {primary.icon}
        <span>{primary.label}</span>
      </button>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger className={styles.trigger} aria-label={`More actions for ${itemName}`}>
          <FaEllipsisH size={14} aria-hidden="true" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={styles.content} align="end" sideOffset={6}>
            {renderItem(primary, true)}
            {menu.map((action) => renderItem(action))}
            <DropdownMenu.Separator className={styles.separator} />
            <DropdownMenu.Item className={`${styles.item} ${styles.danger}`} onSelect={onDelete}>
              <FaTrash size={13} aria-hidden="true" />
              <span>{deleteLabel}</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
