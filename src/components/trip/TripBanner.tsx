import { useState, useEffect } from 'react';

interface Props {
  startedAt: number;
  onEndTrip: () => void;
}

export function TripBanner({ startedAt, onEndTrip }: Props) {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    const tick = () => {
      const diff = Date.now() - startedAt;
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setElapsed(`${mins}:${secs.toString().padStart(2, '0')}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-emerald-900/50 border-b border-emerald-800">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        <span className="text-sm text-emerald-300 font-medium">
          Shopping — {elapsed}
        </span>
      </div>
      <button
        onClick={onEndTrip}
        className="text-sm text-emerald-400 font-semibold px-3 py-1 rounded-lg active:bg-emerald-800 transition-colors"
      >
        End Trip
      </button>
    </div>
  );
}
