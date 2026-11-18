'use client';

import { useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type Modifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaGripVertical } from 'react-icons/fa';
import type { Identifiable } from '@/lib/useAdminCrud';
import styles from './SortableTable.module.css';

const lockToVerticalAxis: Modifier = ({ transform }) => ({ ...transform, x: 0 });

interface SortableTableProps<T extends Identifiable & { order?: number }> {
  /** The rows currently shown (may be a filtered subset of `allItems`). */
  items: T[];
  /** The full list, when `items` is a filtered view; visible rows are re-ordered among their own slots. */
  allItems?: T[];
  setItems: Dispatch<SetStateAction<T[]>>;
  /** Admin route segment known to POST /api/reorder, e.g. "skills". */
  resource: string;
  className?: string;
  /** <thead> and <tbody> containing <SortableRow>s. */
  children: ReactNode;
}

/**
 * Drop-in <table> that makes its <SortableRow> children drag-reorderable (mouse, touch and
 * keyboard). The drag context wraps the table (not the <tbody>) because dnd-kit renders
 * hidden helper <div>s that are invalid HTML inside a table. The new order is applied optimistically and saved via POST /api/reorder;
 * if the save fails the previous order is restored and a toast explains.
 */
export function SortableTable<T extends Identifiable & { order?: number }>({
  items,
  allItems,
  setItems,
  resource,
  className,
  children,
}: SortableTableProps<T>) {
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === active.id);
    const to = items.findIndex((i) => i.id === over.id);
    if (from < 0 || to < 0) return;

    const full = allItems ?? items;
    const reorderedVisible = arrayMove(items, from, to);
    // Visible rows take back the slots they occupied in the full list, in their new order.
    const visibleIds = new Set(items.map((i) => i.id));
    let cursor = 0;
    const merged = full.map((item) => (visibleIds.has(item.id) ? reorderedVisible[cursor++] : item));
    const previous = full;
    const next = merged.map((item, index) => ({ ...item, order: index + 1 }));
    setItems(next);

    try {
      const res = await fetch('/api/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource, ids: next.map((i) => i.id) }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Failed to save order');
      }
    } catch (err) {
      setItems(previous);
      setError(err instanceof Error ? err.message : 'Failed to save order');
      window.setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <>
      <DndContext
        id={`sortable-${resource}`} // stable id: dnd-kit's auto counter differs between SSR and client
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[lockToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <table className={className}>{children}</table>
        </SortableContext>
      </DndContext>
      {error &&
        createPortal(
          <div role="alert" className={styles.toast}>
            Couldn&apos;t save the new order: {error}. Restored the previous order.
          </div>,
          document.body,
        )}
    </>
  );
}

interface SortableRowProps {
  id: string;
  /** Row name for the handle's accessible label ("Reorder waris-cv"). */
  label: string;
  children: ReactNode;
}

/** A <tr> with a leading six-dot drag handle cell. Pair with a leading empty <th>. */
export function SortableRow({ id, label, children }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? styles.dragging : undefined}
    >
      <td className={styles.handleCell}>
        <button
          type="button"
          ref={setActivatorNodeRef}
          className={styles.handle}
          aria-label={`Reorder ${label}`}
          title="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <FaGripVertical size={14} aria-hidden="true" />
        </button>
      </td>
      {children}
    </tr>
  );
}

/** Header cell for the handle column. */
export function SortableHandleTh() {
  return <th className={styles.handleTh} aria-label="Reorder" />;
}
