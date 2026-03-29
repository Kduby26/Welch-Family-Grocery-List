import { useEffect, useState, useMemo } from 'react';
import { KnownItem } from '@/types';
import { subscribeToItems } from '@/lib/firebase/items';

export function useKnownItems(householdId: string | undefined) {
  const [items, setItems] = useState<KnownItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!householdId) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = subscribeToItems(householdId, (data) => {
      setItems(data);
      setLoading(false);
    });

    return unsub;
  }, [householdId]);

  const frequent = useMemo(
    () =>
      [...items]
        .filter((i) => i.usageCount > 0)
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 15),
    [items]
  );

  const searchItems = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return items
      .filter((i) => i.nameLower.includes(q))
      .slice(0, 10);
  };

  const findByName = (name: string): KnownItem | undefined => {
    const lower = name.toLowerCase().trim();
    return items.find((i) => i.nameLower === lower);
  };

  return { items, frequent, loading, searchItems, findByName };
}
