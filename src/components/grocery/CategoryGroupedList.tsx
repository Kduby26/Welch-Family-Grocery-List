import { useState } from 'react';
import { GroceryEntry } from '@/types';
import { GroceryItem } from './GroceryItem';
import { CATEGORIES, getCategoryInfo } from '@/config/categories';

interface Props {
  entries: GroceryEntry[];
  onCheckOff: (id: string, checked: boolean) => void;
  onRemove: (id: string) => void;
  onTap: (entry: GroceryEntry) => void;
  isTrip?: boolean;
}

export function CategoryGroupedList({ entries, onCheckOff, onRemove, onTap, isTrip }: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  // Group by category in display order
  const groups = new Map<string, GroceryEntry[]>();
  for (const entry of entries) {
    const key = entry.category;
    const list = groups.get(key) ?? [];
    list.push(entry);
    groups.set(key, list);
  }

  const toggle = (key: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (entries.length === 0) return null;

  return (
    <div className="divide-y divide-slate-800">
      {CATEGORIES.filter((c) => groups.has(c.id)).map((cat) => {
        const items = groups.get(cat.id)!;
        const isOpen = !collapsed.has(cat.id);

        return (
          <div key={cat.id}>
            <button
              onClick={() => toggle(cat.id)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 active:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{isOpen ? '▼' : '▶'}</span>
                <span className="text-sm">{cat.emoji}</span>
                <span className="text-sm font-semibold text-slate-300">
                  {cat.label}
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
