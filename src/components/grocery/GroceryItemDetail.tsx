import { useState, useEffect } from 'react';
import { GroceryEntry } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { useHousehold } from '@/contexts/HouseholdContext';
import { useStores } from '@/hooks/useStores';
import { updateGroceryEntry, removeGroceryEntry } from '@/lib/firebase/grocery-list';
import { CATEGORIES } from '@/config/categories';

interface Props {
  entry: GroceryEntry | null;
  onClose: () => void;
}

export function GroceryItemDetail({ entry, onClose }: Props) {
  const { household } = useHousehold();
  const { stores } = useStores(household?.id);
  const [quantityNeeded, setQuantityNeeded] = useState(1);
  const [quantityOnHand, setQuantityOnHand] = useState(0);
  const [notes, setNotes] = useState('');
  const [store, setStore] = useState<string | null>(null);

  useEffect(() => {
    if (entry) {
      setQuantityNeeded(entry.quantityNeeded);
      setQuantityOnHand(entry.quantityOnHand);
      setNotes(entry.notes ?? '');
      setStore(entry.store);
    }
  }, [entry]);

  if (!entry || !household) return null;

  const handleSave = async () => {
    await updateGroceryEntry(household.id, entry.id, {
      quantityNeeded,
      quantityOnHand,
      notes: notes || null,
      store,
    });
    onClose();
  };

  const handleDelete = async () => {
    await removeGroceryEntry(household.id, entry.id);
    onClose();
  };

  const netNeeded = Math.max(0, quantityNeeded - quantityOnHand);

  return (
    <Modal open={!!entry} onClose={onClose} title={entry.itemName}>
      <div className="space-y-5">
        {/* Quantity controls */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Need</label>
            <div className="flex items-center bg-slate-700 rounded-lg">
              <button
                onClick={() => setQuantityNeeded(Math.max(0, quantityNeeded - 1))}
                className="w-10 h-10 text-slate-300 text-lg"
              >
                −
              </button>
              <span className="flex-1 text-center text-slate-100 font-medium">
                {quantityNeeded}
              </span>
              <button
                onClick={() => setQuantityNeeded(quantityNeeded + 1)}
                className="w-10 h-10 text-slate-300 text-lg"
              >
                +
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">On Hand</label>
            <div className="flex items-center bg-slate-700 rounded-lg">
              <button
                onClick={() => setQuantityOnHand(Math.max(0, quantityOnHand - 1))}
                className="w-10 h-10 text-slate-300 text-lg"
              >
                −
              </button>
              <span className="flex-1 text-center text-slate-100 font-medium">
                {quantityOnHand}
              </span>
              <button
                onClick={() => setQuantityOnHand(quantityOnHand + 1)}
                className="w-10 h-10 text-slate-300 text-lg"
              >
                +
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Net</label>
            <div className="flex items-center justify-center bg-slate-700/50 rounded-lg h-10">
              <span className="text-emerald-400 font-bold">{netNeeded}</span>
            </div>
          </div>
        </div>

        {/* Store select */}
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Store</label>
          <select
            value={store ?? ''}
            onChange={(e) => setStore(e.target.value || null)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-100 min-h-[44px]"
          >
            <option value="">No store</option>
            {stores.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Brand preferences, size, substitutions..."
            rows={2}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-100 placeholder:text-slate-500 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={handleSave} className="btn-primary flex-1">
            Save
          </button>
          <button onClick={handleDelete} className="btn-danger">
            Remove
          </button>
        </div>
      </div>
    </Modal>
  );
}
