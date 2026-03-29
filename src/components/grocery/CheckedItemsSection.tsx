import { useState } from 'react';
import { GroceryEntry } from '@/types';
import { GroceryItem } from './GroceryItem';

interface Props {
  entries: GroceryEntry[];
  onCheckOff: (id: string, checked: boolean) => void;
  onRemove: (id: string) => void;
  onTap: (entry: GroceryEntry) => void;
}

export function CheckedItemsSection({ entries, onCheckOff, onRemove, onTap }: Props) {
  const [open, setOpen] = useState(false);

  if (entries.length === 0) return null;

  return (
    <div className="border-t border-slate-800">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-slate-500 active:bg-slate-800/50 transition-colors"
      >
        <span className="text-sm">
          {open ? '▼' : '▶'} Completed ({entries.length})
        </span>
      </button>
      {open && (
        <div className="divide-y divide-slate-800/50">
          {entries.map((entry) => (
            <GroceryItem
              key={entry.id}
              entry={entry}
              onCheckOff={onCheckOff}
              onRemove={onRemove}
              onTap={onTap}
            />
          ))}
        </div>
      )}
    </div>
  );
}
