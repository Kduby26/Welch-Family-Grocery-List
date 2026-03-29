import { useEffect, useState } from 'react';
import { Store } from '@/types';
import { subscribeToStores } from '@/lib/firebase/stores';

export function useStores(householdId: string | undefined) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!householdId) {
      setStores([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = subscribeToStores(householdId, (data) => {
      setStores(data);
      setLoading(false);
    });

    return unsub;
  }, [householdId]);

  return { stores, loading };
}
