import { useHousehold } from '@/contexts/HouseholdContext';

interface HeaderProps {
  viewMode: 'store' | 'category';
  onToggleView: () => void;
  onOpenSettings: () => void;
}

export function Header({ viewMode, onToggleView, onOpenSettings }: HeaderProps) {
  const { household } = useHousehold();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-slate-100 truncate">
            {household?.name ?? 'Groceries'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleView}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 border border-slate-700 min-h-[36px]"
          >
            {viewMode === 'store' ? '🏪 By Store' : '📂 By Category'}
          </button>
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 border border-slate-700"
          >
            ⚙
          </button>
        </div>
      </div>
    </header>
  );
}
