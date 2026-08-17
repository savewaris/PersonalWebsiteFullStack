'use client';

import { useState } from 'react';

export interface Identifiable {
  id: string;
}

export function useAdminCrud<T extends Identifiable>(initialItems: T[], endpoint: string) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [deletingItem, setDeletingItem] = useState<T | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setEditingItem(null);
    setError(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: T) => {
    setEditingItem(item);
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setError(null);
  };

  const saveItem = async (payload: Partial<T>): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingItem) {
        // Update
        const res = await fetch(`${endpoint}/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || 'Failed to update item');

        setItems((prev) => prev.map((item) => (item.id === editingItem.id ? resData : item)));
      } else {
        // Create
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || 'Failed to create item');

        setItems((prev) => [resData, ...prev]);
      }

      closeModal();
      return true;
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.error || 'Failed to delete item');
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
      setDeletingItem(null);
      return true;
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    items,
    setItems,
    isModalOpen,
    editingItem,
    deletingItem,
    setDeletingItem,
    isSubmitting,
    error,
    setError,
    openCreate,
    openEdit,
    closeModal,
    saveItem,
    deleteItem,
  };
}
