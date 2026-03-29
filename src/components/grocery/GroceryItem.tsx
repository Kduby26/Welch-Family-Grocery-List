import { GroceryEntry } from '@/types';
import { getCategoryInfo } from '@/config/categories';
import { SwipeableRow } from '@/components/ui/SwipeableRow';
import clsx from 'clsx';

interface GroceryItemProps {
  entry: GroceryEntry;
  onCheckOff: (id: string, checked: boolean) => void;
  onRemove: (id: string) => void;
  onTap: (entry: GroceryEntry) => void;
  isTrip?: boolean;
}

export function GroceryItem({
  entry,
  onCheckOff,
  onRemove,
  onTap,
  isTrip,
}: GroceryItemProps) {
  const cat = getCategoryInfo(entry.category);
  const display = entry.netNeeded > 0 ? entry.netNeeded : entry.quantityNeeded;

  const content = (
    <div
      onClick={() => (isTrip ? onCheckOff(entry.id, !entry.checkedOff) : onTap(entry))}
      className={clsx(
        'flex items-center gap-3 px-4 py-3 min-h-[56px] bg-slate-900 active:bg-slate-800 transition-colors',
        entry.checkedOff && 'opacity-50'
      )}
    >
      {/* Category dot */}
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: cat.color }}
      />

      {/* Item info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'text-slate-100 font-medium truncate',
              entry.checkedOff && 'line-through text-slate-500'
            )}
          >
            {entry.itemName}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {entry.notes && (
            <span className="text-xs text-slate-500 truncate">
              {entry.notes}
            </span>
          )}
        </div>
      </div>

      {/* Quantity badge */}
      <div className="flex items-center gap-1.5 shrink-0">
        {display > 1 && (
          <span className="text-sm font-medium text-slate-400">
            {display}
            {entry.unit && <span className="text-xs ml-0.5">{entry.unit}</span>}
          </span>
        )}
        {entry.unit && display <= 1 && (
          <span className="text-xs text-slate-500">{entry.unit}</span>
        )}
        {entry.store && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700">
            {entry.store}
          </span>
        )}
      </div>
    </div>
  );

  if (entry.checkedOff) {
    return content;
  }

  return (
    <SwipeableRow
      onSwipeRight={() => onCheckOff(entry.id, true)}
      onSwipeLeft={() => onRemove(entry.id)}
    >
      {content}
    </SwipeableRow>
  );
}
