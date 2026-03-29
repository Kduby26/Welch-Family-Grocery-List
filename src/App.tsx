import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { HouseholdProvider, useHousehold } from '@/contexts/HouseholdContext';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { CreateHousehold } from '@/components/household/CreateHousehold';
import { BottomNav, Tab } from '@/components/layout/BottomNav';
import { GroceryPage } from '@/pages/GroceryPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { MealPlanPage } from '@/pages/MealPlanPage';
import { PriceHistoryPage } from '@/pages/PriceHistoryPage';
import { ToastContainer } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function SetupGuide() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="text-6xl">🛒</div>
        <h1 className="text-3xl font-bold text-slate-100">
          Family Groceries
        </h1>
        <p className="text-slate-400">
          Firebase is not configured yet. Follow these steps to get started:
        </p>
        <div className="text-left bg-slate-800 rounded-xl p-5 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-emerald-400">1. Create a Firebase Project</h3>
            <p className="text-xs text-slate-400">
              Go to console.firebase.google.com and create a new project
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-emerald-400">2. Enable Google Auth</h3>
            <p className="text-xs text-slate-400">
              Authentication → Sign-in method → Enable Google
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-emerald-400">3. Create Firestore Database</h3>
            <p className="text-xs text-slate-400">
              Firestore Database → Create database → Start in production mode
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-emerald-400">4. Add Web App & Copy Config</h3>
            <p className="text-xs text-slate-400">
              Project Settings → Add web app → Copy config values to .env.local
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-emerald-400">5. Deploy Security Rules</h3>
            <p className="text-xs text-slate-400">
              Copy firestore.rules to the Firestore Rules tab
            </p>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 text-left">
          <p className="text-xs font-mono text-slate-500 mb-2">.env.local</p>
          <pre className="text-xs text-slate-400 overflow-x-auto">
{`VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...`}
          </pre>
        </div>
        <p className="text-xs text-slate-500">
          After adding .env.local, restart the dev server
        </p>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, loading: authLoading, configured } = useAuth();
  const { household, loading: householdLoading } = useHousehold();
  const [activeTab, setActiveTab] = useState<Tab>('list');

  if (!configured) {
    return <SetupGuide />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (householdLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!household) {
    return <CreateHousehold />;
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'list' && (
          <GroceryPage onOpenSettings={() => setActiveTab('settings')} />
        )}
        {activeTab === 'meals' && <MealPlanPage />}
        {activeTab === 'prices' && <PriceHistoryPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </div>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HouseholdProvider>
        <AppContent />
        <ToastContainer />
      </HouseholdProvider>
    </AuthProvider>
  );
}
