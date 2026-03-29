import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHousehold } from '@/contexts/HouseholdContext';
import { useStores } from '@/hooks/useStores';
import { addStore, removeStore } from '@/lib/firebase/stores';
import { signOut } from '@/lib/firebase/auth';
import { toast } from '@/components/ui/Toast';

export function HouseholdSettings() {
  const { user } = useAuth();
  const { household } = useHousehold();
  const { stores } = useStores(household?.id);
  const [newStore, setNewStore] = useState('');

  const handleAddStore = async () => {
    if (!household || !newStore.trim()) return;
    await addStore(household.id, newStore.trim(), stores.length);
    setNewStore('');
    toast('Store added', 'success');
  };

  const handleRemoveStore = async (storeId: string) => {
    if (!household) return;
    await removeStore(household.id, storeId);
  };

  const handleCopyCode = () => {
    if (!household) return;
    navigator.clipboard.writeText(household.inviteCode);
    toast('Invite code copied!', 'success');
  };

  if (!household) return null;

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-slate-100">Settings</h2>

      {/* Household info */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
          Household
        </h3>
        <div className="bg-slate-800 rounded-xl p-4 space-y-3">
          <div>
            <span className="text-xs text-slate-500">Name</span>
            <p className="text-slate-200">{household.name}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500">Invite Code</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-mono font-bold text-emerald-400 tracking-[0.2em]">
                {household.inviteCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded active:bg-slate-600"
              >
                Copy
              </button>
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Members</span>
            <p className="text-slate-400 text-sm">
              {household.members.length} member{household.members.length !== 1 && 's'}
            </p>
          </div>
        </div>
      </section>

      {/* Stores */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
          Stores
        </h3>
        <div className="space-y-2">
          {stores.map((store) => (
            <div
              key={store.id}
              className="flex items-center justify-between bg-slate-800 rounded-xl px-4 py-3"
            >
              <span className="text-slate-200">{store.name}</span>
              <button
                onClick={() => handleRemoveStore(store.id)}
                className="text-xs text-red-400 px-2 py-1 rounded active:bg-slate-700"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={newStore}
              onChange={(e) => setNewStore(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddStore()}
              placeholder="Add a store..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 min-h-[48px]"
            />
            <button
              onClick={handleAddStore}
              disabled={!newStore.trim()}
              className="btn-primary px-4"
            >
              Add
            </button>
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
          Account
        </h3>
        <div className="bg-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt=""
                className="w-10 h-10 rounded-full"
              />
            )}
            <div>
              <p className="text-slate-200 font-medium">{user?.displayName}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="btn-danger w-full"
        >
          Sign Out
        </button>
      </section>
    </div>
  );
}
