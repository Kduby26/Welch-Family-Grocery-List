import { useState } from 'react';
import { GroceryEntry } from '@/types';
import { GroceryItem } from './GroceryItem';
import clsx from 'clsx';

interface Props {
  entries: GroceryEntry[];
  onCheckOff: (id: string, checked: boolean) => void;
  onRemove: (id: string) => void;
  onTap: (entry: GroceryEntry) => void;
  isTrip?: boolean;
}

export function StoreGroupedList({ entries, onCheckOff, onRemove, onTap, isTrip }: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  // Group by store
  const groups = new Map<string, GroceryEntry[]>();
  for (const entry of entries) {
    const key = entry.store ?? 'No Store';
    const list = groups.get(key) ?? [];
    list.push(entry);
    groups.set(key, list);
  }

  // Sort: named stores first alphabetically, "No Store" last
  const sortedKeys = [...groups.keys()].sort((a, b) => {
    if (a === 'No Store') return 1;
    if (b === 'No Store') return -1;
    return a.localeCompare(b);
  });

  const toggle = (key: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="divide-y divide-slate-800">
      {sortedKeys.map((storeKey) => {
        const items = groups.get(storeKey)!;
        const isOpen = !collapsed.has(storeKey);

        return (
          <div key={storeKey}>
            <button
              onClick={() => toggle(storeKey)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 active:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{isOpen ? '▼' : '▶'}</span>
                <span className="text-sm font-semibold text-slate-300">
                  {storeKey}
                </span>
              </div>
              <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </button>
            {isOpen && (
              <div className="divide-y divide-slate-800/50">
                {items.map((entry) => (
                  <GroceryItem
                    key={entry.id}
                    entry={entry}
                    onCheckOff={onCheckOff}
                    onRemove={onRemove}
                    onTap={onTap}
                    isTrip={isTrip}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
