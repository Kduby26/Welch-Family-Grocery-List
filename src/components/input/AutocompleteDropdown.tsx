import { KnownItem } from '@/types';
import { getCategoryInfo } from '@/config/categories';

interface Props {
  items: KnownItem[];
  onSelect: (item: KnownItem) => void;
}

export function AutocompleteDropdown({ items, onSelect }: Props) {
  return (
    <div className="mx-3 mb-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden max-h-[200px] overflow-y-auto">
      {items.map((item) => {
        const cat = getCategoryInfo(item.category);
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700 active:bg-slate-700 transition-colors border-b border-slate-700/50 last:border-0"
          >
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-slate-200 text-sm flex-1 truncate">
              {item.name}
            </span>
            <span className="text-xs text-slate-500">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
