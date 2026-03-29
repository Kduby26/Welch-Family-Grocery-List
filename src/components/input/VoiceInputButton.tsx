import { useVoiceInput } from '@/hooks/useVoiceInput';
import { ParsedItem } from '@/types';
import { Modal } from '@/components/ui/Modal';
import clsx from 'clsx';

interface Props {
  onItems: (items: ParsedItem[]) => void;
}

export function VoiceInputButton({ onItems }: Props) {
  const {
    state,
    parsedItems,
    transcript,
    error,
    supported,
    start,
    stop,
    reset,
  } = useVoiceInput();

  if (!supported) return null;

  const handleConfirm = () => {
    onItems(parsedItems);
    reset();
  };

  return (
    <>
      <button
        onClick={state === 'listening' ? stop : start}
        className={clsx(
          'w-12 h-12 flex items-center justify-center rounded-xl text-xl transition-all',
          state === 'listening'
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-slate-800 text-slate-400 border border-slate-700 active:bg-slate-700'
        )}
      >
        🎤
      </button>

      {/* Confirmation modal */}
      <Modal
        open={state === 'confirming'}
        onClose={reset}
        title="Add these items?"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">"{transcript}"</p>
          <div className="space-y-2">
            {parsedItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-slate-700 rounded-lg px-3 py-2"
              >
                <span className="text-slate-200">{item.name}</span>
                <span className="text-sm text-slate-400">
                  {item.quantity}
                  {item.unit && ` ${item.unit}`}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={handleConfirm} className="btn-primary flex-1">
              Add All
            </button>
            <button onClick={reset} className="btn-ghost">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Error state */}
      {state === 'error' && (
        <Modal open onClose={reset} title="Voice Input">
          <div className="space-y-4">
            <p className="text-red-400 text-sm">{error}</p>
            <div className="flex gap-3">
              <button onClick={start} className="btn-primary flex-1">
                Try Again
              </button>
              <button onClick={reset} className="btn-ghost">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
