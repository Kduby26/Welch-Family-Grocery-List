import clsx from 'clsx';

interface ChipProps {
  label: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

export function Chip({ label, onClick, active, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'inline-flex items-center px-3 py-2 rounded-full text-sm font-medium',
        'min-h-[40px] whitespace-nowrap transition-colors',
        active
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          : 'bg-slate-700 text-slate-300 border border-slate-600 active:bg-slate-600',
        className
      )}
    >
      {label}
    </button>
  );
}
