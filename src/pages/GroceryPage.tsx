import { useState, useCallback } from 'react';
import { useHousehold } from '@/contexts/HouseholdContext';
import { useGroceryList } from '@/hooks/useGroceryList';
import { GroceryEntry } from '@/types';
import { checkOffEntry, removeGroceryEntry, clearCheckedEntries } from '@/lib/firebase/grocery-list';
import { incrementUsage } from '@/lib/firebase/items';
import { Header } from '@/components/layout/Header';
import { StoreGroupedList } from '@/components/grocery/StoreGroupedList';
import { CategoryGroupedList } from '@/components/grocery/CategoryGroupedList';
import { CheckedItemsSection } from '@/components/grocery/CheckedItemsSection';
import { GroceryItemDetail } from '@/components/grocery/GroceryItemDetail';
import { AddItemBar } from '@/components/input/AddItemBar';
import { TripBanner } from '@/components/trip/TripBanner';
import { TripControls } from '@/components/trip/TripControls';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from '@/components/ui/Toast';

interface Props {
  onOpenSettings: () => void;
}

const TRIP_KEY = 'grocery-trip';

export function GroceryPage({ onOpenSettings }: Props) {
  const { household } = useHousehold();
  const { unchecked, checked, loading } = useGroceryList(household?.id);
  const [viewMode, setViewMode] = useState<'store' | 'category'>('store');
  const [editEntry, setEditEntry] = useState<GroceryEntry | null>(null);

  // Trip state (localStorage)
  const [tripStartedAt, setTripStartedAt] = useState<number | null>(() => {
    const saved = localStorage.getItem(TRIP_KEY);
    return saved ? parseInt(saved, 10) : null;
  });
  const isTrip = tripStartedAt !== null;

  const handleCheckOff = useCallback(
    async (id: string, checked: boolean) => {
      if (!household) return;
      await checkOffEntry(household.id, id, checked);
    },
    [household]
  );

  const handleRemove = useCallback(
    async (id: string) => {
      if (!household) return;
      await removeGroceryEntry(household.id, id);
    },
    [household]
  );

  const handleStartTrip = () => {
    const now = Date.now();
    setTripStartedAt(now);
    localStorage.setItem(TRIP_KEY, String(now));
  };

  const handleEndTrip = async () => {
    if (!household) return;
    // Increment usage count for checked items
    for (const entry of checked) {
      try {
        await incrementUsage(household.id, entry.itemId);
      } catch {}
    }
    // Clear checked items
    await clearCheckedEntries(household.id);
    setTripStartedAt(null);
    localStorage.removeItem(TRIP_KEY);
    toast('Trip complete!', 'success');
  };

  const handleClearChecked = async () => {
    if (!household) return;
    await clearCheckedEntries(household.id);
    toast('Cleared completed items', 'info');
  };

  if (loading) {
    return <LoadingSpinner className="flex-1" />;
  }

  const ListView = viewMode === 'store' ? StoreGroupedList : CategoryGroupedList;

  return (
    <>
      <Header
        viewMode={viewMode}
        onToggleView={() =>
          setViewMode((m) => (m === 'store' ? 'category' : 'store'))
        }
        onOpenSettings={onOpenSettings}
      />

      {isTrip ? (
        <TripBanner startedAt={tripStartedAt!} onEndTrip={handleEndTrip} />
      ) : (
        <TripControls
          hasChecked={checked.length > 0}
          onStartTrip={handleStartTrip}
          onClearChecked={handleClearChecked}
        />
      )}

      <div className="flex-1 overflow-y-auto">
        {unchecked.length === 0 && checked.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-slate-300 mb-2">
              List is empty
            </h2>
            <p className="text-sm text-slate-500">
              Add items below or use voice input
            </p>
          </div>
        ) : (
          <>
            <ListView
              entries={unchecked}
              onCheckOff={handleCheckOff}
              onRemove={handleRemove}
              onTap={setEditEntry}
              isTrip={isTrip}
            />
            <CheckedItemsSection
              entries={checked}
              onCheckOff={handleCheckOff}
              onRemove={handleRemove}
              onTap={setEditEntry}
            />
          </>
        )}
      </div>

      <AddItemBar />

      <GroceryItemDetail
        entry={editEntry}
        onClose={() => setEditEntry(null)}
      />
    </>
  );
}
