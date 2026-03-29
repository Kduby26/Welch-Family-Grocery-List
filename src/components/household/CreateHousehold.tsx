import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHousehold } from '@/contexts/HouseholdContext';
import { createHousehold, joinHousehold } from '@/lib/firebase/households';
import { toast } from '@/components/ui/Toast';

export function CreateHousehold() {
  const { user } = useAuth();
  const { refresh } = useHousehold();
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!user || !name.trim()) return;
    setLoading(true);
    try {
      await createHousehold(user.uid, name.trim());
      toast('Household created with 241 items!', 'success');
      await refresh();
    } catch (err: any) {
      toast(err.message ?? 'Failed to create household', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user || !code.trim()) return;
    setLoading(true);
    try {
      const id = await joinHousehold(user.uid, code.trim());
      if (id) {
        toast('Joined household!', 'success');
        await refresh();
      } else {
        toast('Invalid invite code', 'error');
      }
    } catch (err: any) {
      toast(err.message ?? 'Failed to join', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'choose') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="text-5xl">🏠</div>
          <h2 className="text-2xl font-bold text-slate-100">
            Welcome, {user?.displayName?.split(' ')[0] ?? 'there'}!
          </h2>
          <p className="text-slate-400">
            Create a new household or join an existing one
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setMode('create')}
              className="btn-primary w-full"
            >
              Create Household
            </button>
            <button
              onClick={() => setMode('join')}
              className="btn-secondary w-full"
            >
              Join with Code
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <button
            onClick={() => setMode('choose')}
            className="text-slate-400 text-sm"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-slate-100">
            Name your household
          </h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. The Welch Family"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 min-h-[48px]"
            autoFocus
          />
          <button
            onClick={handleCreate}
            disabled={!name.trim() || loading}
            className="btn-primary w-full"
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <button
          onClick={() => setMode('choose')}
          className="text-slate-400 text-sm"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-slate-100">
          Enter invite code
        </h2>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. ABC123"
          maxLength={6}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-center text-2xl tracking-[0.3em] font-mono placeholder:text-slate-500 placeholder:text-base placeholder:tracking-normal min-h-[56px]"
          autoFocus
        />
        <button
          onClick={handleJoin}
          disabled={code.length < 6 || loading}
          className="btn-primary w-full"
        >
          {loading ? 'Joining...' : 'Join'}
        </button>
      </div>
    </div>
  );
}
