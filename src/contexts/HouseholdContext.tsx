import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { Household } from '@/types';
import { useAuth } from './AuthContext';
import { getUserHouseholds, getHousehold } from '@/lib/firebase/households';

interface HouseholdContextType {
  household: Household | null;
  households: Household[];
  loading: boolean;
  selectHousehold: (id: string) => void;
  refresh: () => Promise<void>;
}

const HouseholdContext = createContext<HouseholdContextType>({
  household: null,
  households: [],
  loading: true,
  selectHousehold: () => {},
  refresh: async () => {},
});

const STORAGE_KEY = 'grocery-active-household';

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [household, setHousehold] = useState<Household | null>(null);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHouseholds = useCallback(async () => {
    if (!user) {
      setHouseholds([]);
      setHousehold(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const list = await getUserHouseholds(user.uid);
      setHouseholds(list);

      const savedId = localStorage.getItem(STORAGE_KEY);
      const active =
        list.find((h) => h.id === savedId) ?? list[0] ?? null;

      setHousehold(active);
      if (active) localStorage.setItem(STORAGE_KEY, active.id);
    } catch (err) {
      console.error('Failed to load households:', err);
      setHouseholds([]);
      setHousehold(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadHouseholds();
  }, [loadHouseholds]);

  const selectHousehold = (id: string) => {
    const found = households.find((h) => h.id === id);
    if (found) {
      setHousehold(found);
      localStorage.setItem(STORAGE_KEY, id);
    }
  };

  return (
    <HouseholdContext.Provider
      value={{
        household,
        households,
        loading,
        selectHousehold,
        refresh: loadHouseholds,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  return useContext(HouseholdContext);
}
