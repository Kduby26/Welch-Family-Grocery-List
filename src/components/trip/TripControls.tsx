interface Props {
  hasChecked: boolean;
  onStartTrip: () => void;
  onClearChecked: () => void;
}

export function TripControls({ hasChecked, onStartTrip, onClearChecked }: Props) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800">
      <button
        onClick={onStartTrip}
        className="btn-primary text-sm py-2 px-4"
      >
        🛒 Start Shopping Trip
      </button>
      {hasChecked && (
        <button
          onClick={onClearChecked}
          className="btn-ghost text-sm py-2 px-4"
        >
          Clear Completed
        </button>
      )}
    </div>
  );
}
