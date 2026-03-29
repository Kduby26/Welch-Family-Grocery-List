import clsx from 'clsx';

type Tab = 'list' | 'meals' | 'prices' | 'settings';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'list', label: 'List', icon: '🛒' },
  { id: 'meals', label: 'Meals', icon: '🍽' },
  { id: 'prices', label: 'Prices', icon: '💰' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="sticky bottom-0 bg-slate-900 border-t border-slate-800 pb-safe">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex-1 flex flex-col items-center gap-0.5 py-2 min-h-[56px] transition-colors',
              active === tab.id
                ? 'text-emerald-400'
                : 'text-slate-500 active:text-slate-300'
            )}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export type { Tab };
