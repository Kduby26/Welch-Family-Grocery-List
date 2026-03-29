import { useEffect, useState } from 'react';
import { GroceryEntry } from '@/types';
import { subscribeToGroceryList } from '@/lib/firebase/grocery-list';

export function useGroceryList(householdId: string | undefined) {
  const [entries, setEntries] = useState<GroceryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!householdId) {
      setEntries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = subscribeToGroceryList(householdId, (data) => {
      setEntries(data);
      setLoading(false);
    });

    return unsub;
  }, [householdId]);

  const unchecked = entries.filter((e) => !e.checkedOff);
  const checked = entries.filter((e) => e.checkedOff);

  return { entries, unchecked, checked, loading };
}
