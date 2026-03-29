export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-8 h-8 border-3 border-slate-600 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );
}
