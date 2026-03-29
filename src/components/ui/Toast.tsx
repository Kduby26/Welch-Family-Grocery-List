import { useEffect, useState } from 'react';

interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

let addToast: (text: string, type?: ToastMessage['type']) => void = () => {};

export function toast(text: string, type: ToastMessage['type'] = 'info') {
  addToast(text, type);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  let nextId = 0;

  addToast = (text: string, type: ToastMessage['type'] = 'info') => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-xl text-sm font-medium text-center shadow-lg pointer-events-auto ${
            t.type === 'success'
              ? 'bg-emerald-600 text-white'
              : t.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-slate-700 text-slate-100'
          }`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
