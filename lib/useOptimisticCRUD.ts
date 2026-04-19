"use client";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

interface UseOptimisticCRUDOptions<T extends { _id: string }> {
  apiBase: string; // e.g. "/api/services"
  onSuccess?: (action: string, item: T) => void;
}

export function useOptimisticCRUD<T extends { _id: string }>(
  initialItems: T[],
  options: UseOptimisticCRUDOptions<T>
) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [saving, setSaving] = useState<string | null>(null); // id of item being saved
  const [deleting, setDeleting] = useState<string | null>(null);

  // Optimistic toggle for a boolean field (e.g. isActive, featured)
  const toggleField = useCallback(
    async (id: string, field: keyof T, currentValue: boolean) => {
      // Instant UI update
      setItems(prev =>
        prev.map(item =>
          item._id === id ? { ...item, [field]: !currentValue } : item
        )
      );

      try {
        const res = await fetch(`${options.apiBase}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: !currentValue }),
        });
        if (!res.ok) throw new Error("Update failed");
        const updated = await res.json();
        // Sync with server response
        setItems(prev => prev.map(item => (item._id === id ? updated : item)));
        options.onSuccess?.("toggle", updated);
      } catch {
        // Revert on failure
        setItems(prev =>
          prev.map(item =>
            item._id === id ? { ...item, [field]: currentValue } : item
          )
        );
        toast.error("Update failed — reverted");
      }
    },
    [options]
  );

  // Optimistic patch any fields
  const patchItem = useCallback(
    async (id: string, patch: Partial<T>) => {
      setSaving(id);
      const originalItem = items.find(i => i._id === id);

      // Instant UI update
      setItems(prev =>
        prev.map(item => (item._id === id ? { ...item, ...patch } : item))
      );

      try {
        const res = await fetch(`${options.apiBase}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (!res.ok) throw new Error("Update failed");
        const updated = await res.json();
        setItems(prev => prev.map(item => (item._id === id ? updated : item)));
        toast.success("Saved!");
        options.onSuccess?.("patch", updated);
      } catch {
        // Revert
        if (originalItem) {
          setItems(prev =>
            prev.map(item => (item._id === id ? originalItem : item))
          );
        }
        toast.error("Save failed — changes reverted");
      } finally {
        setSaving(null);
      }
    },
    [items, options]
  );

  // Optimistic delete
  const deleteItem = useCallback(
    async (id: string, confirmMsg?: string) => {
      if (confirmMsg && !confirm(confirmMsg)) return;

      const originalItems = [...items];
      setDeleting(id);

      // Instant removal
      setItems(prev => prev.filter(item => item._id !== id));

      try {
        const res = await fetch(`${options.apiBase}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Delete failed");
        toast.success("Deleted");
        options.onSuccess?.("delete", { _id: id } as T);
      } catch {
        // Restore
        setItems(originalItems);
        toast.error("Delete failed — item restored");
      } finally {
        setDeleting(null);
      }
    },
    [items, options]
  );

  // Create new item (no optimistic — wait for server ID)
  const createItem = useCallback(
    async (data: Omit<T, "_id">) => {
      setSaving("new");
      try {
        const res = await fetch(options.apiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Create failed");
        const created = await res.json();
        setItems(prev => [created, ...prev]);
        toast.success("Created!");
        options.onSuccess?.("create", created);
        return created as T;
      } catch {
        toast.error("Failed to create");
        return null;
      } finally {
        setSaving(null);
      }
    },
    [options]
  );

  return {
    items,
    setItems,
    saving,
    deleting,
    toggleField,
    patchItem,
    deleteItem,
    createItem,
    isLoading: (id: string) => saving === id || deleting === id,
  };
}
