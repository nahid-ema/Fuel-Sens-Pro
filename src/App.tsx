import React, { useState, useEffect } from 'react';
import { FuelLog, MaintenanceLog, User, TabType } from './types';
import { INITIAL_FUEL_LOGS, INITIAL_MAINTENANCE_LOGS } from './data/initialData';
import { Language } from './lib/translations';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { FuelView } from './components/FuelView';
import { MaintenanceView } from './components/MaintenanceView';
import { AuthModal } from './components/AuthModal';
import { AddFuelModal } from './components/AddFuelModal';
import { AddMaintenanceModal } from './components/AddMaintenanceModal';
import { TripCalculatorModal } from './components/TripCalculatorModal';
import { PwaInstallModal } from './components/PwaInstallModal';
import {
  auth,
  db,
  onAuthStateChanged,
  firebaseSignOut,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from './lib/firebase';

// Helper to remove undefined or null values before saving to Firestore
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date) && typeof value?.toDate !== 'function') {
        clean[key] = sanitizeForFirestore(value);
      } else {
        clean[key] = value;
      }
    }
  }
  return clean;
}

export default function App() {
  // Language State (English vs Bangla)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('fuelflow_lang');
    return saved === 'bn' ? 'bn' : 'en';
  });

  const toggleLanguage = () => {
    setLang((prev) => {
      const next = prev === 'en' ? 'bn' : 'en';
      localStorage.setItem('fuelflow_lang', next);
      return next;
    });
  };

  // 1. Theme State (Dark vs Light)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('fuelflow_theme');
    if (saved !== null) {
      return saved === 'dark';
    }
    return true; // Default to sleek Onyx Dark mode
  });

  // Apply dark mode class to html document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fuelflow_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fuelflow_theme', 'light');
    }
  }, [darkMode]);

  // 2. User Authentication State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fuelflow_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      email: 'guest@fuelflow.app',
      name: 'Guest Driver',
      isGuest: true,
      uid: 'guest_driver'
    };
  });

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const u: User = {
          email: firebaseUser.email || 'guest@fuelflow.app',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Guest Driver',
          isGuest: firebaseUser.isAnonymous,
          uid: firebaseUser.uid
        };
        setUser(u);
        localStorage.setItem('fuelflow_user', JSON.stringify(u));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAuthenticate = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('fuelflow_user', JSON.stringify(newUser));
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
    const guestUser: User = {
      email: 'guest@fuelflow.app',
      name: 'Guest Driver',
      isGuest: true,
      uid: 'guest_driver'
    };
    setUser(guestUser);
    localStorage.removeItem('fuelflow_user');
  };

  // 3. Fuel Logs State
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => {
    const saved = localStorage.getItem('fuelflow_fuel_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter((log: FuelLog) => !['fuel-1', 'fuel-2', 'fuel-3', 'fuel-4'].includes(log.id) && !log.id.includes('_fuel-'));
      } catch {
        // Fallback
      }
    }
    return INITIAL_FUEL_LOGS;
  });

  // 4. Maintenance Logs State
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(() => {
    const saved = localStorage.getItem('fuelflow_maintenance_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter((log: MaintenanceLog) => !['maint-1', 'maint-2', 'maint-3'].includes(log.id) && !log.id.includes('_maint-'));
      } catch {
        // Fallback
      }
    }
    return INITIAL_MAINTENANCE_LOGS;
  });

  // Real-time Firestore Sync for Fuel Logs & Maintenance Logs
  useEffect(() => {
    const targetUid = user?.uid || 'guest_driver';

    // Fuel Logs Query
    const fuelQuery = query(
      collection(db, 'fuelLogs'),
      where('userId', '==', targetUid)
    );

    const unsubFuel = onSnapshot(fuelQuery, (snapshot) => {
      const docs: FuelLog[] = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() } as FuelLog))
        .filter((log) => !['fuel-1', 'fuel-2', 'fuel-3', 'fuel-4'].includes(log.id) && !log.id.includes('_fuel-'));
      docs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setFuelLogs(docs);
    }, (err) => {
      console.warn('Fuel snapshot note:', err);
    });

    // Maintenance Logs Query
    const maintQuery = query(
      collection(db, 'maintenanceLogs'),
      where('userId', '==', targetUid)
    );

    const unsubMaint = onSnapshot(maintQuery, (snapshot) => {
      const docs: MaintenanceLog[] = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() } as MaintenanceLog))
        .filter((log) => !['maint-1', 'maint-2', 'maint-3'].includes(log.id) && !log.id.includes('_maint-'));
      docs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setMaintenanceLogs(docs);
    }, (err) => {
      console.warn('Maint snapshot note:', err);
    });

    return () => {
      unsubFuel();
      unsubMaint();
    };
  }, [user?.uid]);

  // Sync to local storage for offline support
  useEffect(() => {
    localStorage.setItem('fuelflow_fuel_logs', JSON.stringify(fuelLogs));
  }, [fuelLogs]);

  useEffect(() => {
    localStorage.setItem('fuelflow_maintenance_logs', JSON.stringify(maintenanceLogs));
  }, [maintenanceLogs]);

  // 5. Active Tab State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // 6. Modals State
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showAddFuelModal, setShowAddFuelModal] = useState<boolean>(false);
  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = useState<boolean>(false);
  const [showTripCalculatorModal, setShowTripCalculatorModal] = useState<boolean>(false);

  // Handlers for Add Fuel
  const handleAddFuelLog = async (newLogData: Omit<FuelLog, 'id'>) => {
    const id = `fuel-${Date.now()}`;
    const targetUid = user?.uid || 'guest_driver';
    const newLog: FuelLog = {
      ...newLogData,
      id,
      userId: targetUid
    };

    setFuelLogs((prev) => [newLog, ...prev]);

    try {
      const payload = sanitizeForFirestore({
        ...newLog,
        createdAt: serverTimestamp()
      });
      await setDoc(doc(db, 'fuelLogs', id), payload);
      console.log('Online fuel log saved to Firestore:', id);
    } catch (err) {
      console.error('Firestore save fuel log error:', err);
    }
  };

  const handleDeleteFuelLog = async (id: string) => {
    setFuelLogs((prev) => prev.filter((log) => log.id !== id));

    try {
      await deleteDoc(doc(db, 'fuelLogs', id));
      console.log('Online fuel log deleted from Firestore:', id);
    } catch (err) {
      console.error('Firestore delete fuel log error:', err);
    }
  };

  // Handlers for Add Maintenance
  const handleAddMaintenanceLog = async (newLogData: Omit<MaintenanceLog, 'id'>) => {
    const id = `maint-${Date.now()}`;
    const targetUid = user?.uid || 'guest_driver';
    const newLog: MaintenanceLog = {
      ...newLogData,
      id,
      userId: targetUid
    };

    setMaintenanceLogs((prev) => [newLog, ...prev]);

    try {
      const payload = sanitizeForFirestore({
        ...newLog,
        createdAt: serverTimestamp()
      });
      await setDoc(doc(db, 'maintenanceLogs', id), payload);
      console.log('Online maintenance log saved to Firestore:', id);
    } catch (err) {
      console.error('Firestore save maintenance log error:', err);
    }
  };

  const handleDeleteMaintenanceLog = async (id: string) => {
    setMaintenanceLogs((prev) => prev.filter((log) => log.id !== id));

    try {
      await deleteDoc(doc(db, 'maintenanceLogs', id));
      console.log('Online maintenance log deleted from Firestore:', id);
    } catch (err) {
      console.error('Firestore delete maintenance log error:', err);
    }
  };

  // Calculate highest odometer for smart defaulting in modals
  const highestOdometerFromFuel = fuelLogs.reduce((max, log) => Math.max(max, log.odometerKm || 0), 0);
  const highestOdometerFromMaint = maintenanceLogs.reduce((max, log) => Math.max(max, log.odometerKm || 0), 0);
  const latestOdometer = Math.max(highestOdometerFromFuel, highestOdometerFromMaint, 42500);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);
  const [showInstallGuideModal, setShowInstallGuideModal] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('PWA install choice outcome:', outcome);
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    } else {
      setShowInstallGuideModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F3F5] dark:bg-[#09090B] text-slate-900 dark:text-white transition-colors">
      
      {/* Top Navigation Header */}
      <Navbar
        user={user}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenTripCalculator={() => setShowTripCalculatorModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
        onInstallApp={handleInstallPwa}
        canInstall={true}
        lang={lang}
        onToggleLanguage={toggleLanguage}
      />



      {/* Main Screen Content */}
      <main className="max-w-4xl mx-auto px-4 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            fuelLogs={fuelLogs}
            maintenanceLogs={maintenanceLogs}
            onChangeTab={(tab) => setActiveTab(tab)}
            onOpenAddFuel={() => setShowAddFuelModal(true)}
            onOpenAddMaintenance={() => setShowAddMaintenanceModal(true)}
            lang={lang}
          />
        )}

        {activeTab === 'fuel' && (
          <FuelView
            logs={fuelLogs}
            onOpenAddFuel={() => setShowAddFuelModal(true)}
            onDeleteLog={handleDeleteFuelLog}
            lang={lang}
          />
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceView
            logs={maintenanceLogs}
            onOpenAddMaintenance={() => setShowAddMaintenanceModal(true)}
            onDeleteLog={handleDeleteMaintenanceLog}
            lang={lang}
          />
        )}
      </main>

      {/* Bottom Tab Bar Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        onOpenTripCalculator={() => setShowTripCalculatorModal(true)}
        fuelCount={fuelLogs.length}
        maintenanceCount={maintenanceLogs.length}
        lang={lang}
      />

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticate={handleAuthenticate}
        lang={lang}
      />

      <AddFuelModal
        isOpen={showAddFuelModal}
        onClose={() => setShowAddFuelModal(false)}
        onAddLog={handleAddFuelLog}
        latestOdometer={latestOdometer}
        lang={lang}
      />

      <AddMaintenanceModal
        isOpen={showAddMaintenanceModal}
        onClose={() => setShowAddMaintenanceModal(false)}
        onAddLog={handleAddMaintenanceLog}
        latestOdometer={latestOdometer}
        lang={lang}
      />

      <TripCalculatorModal
        isOpen={showTripCalculatorModal}
        onClose={() => setShowTripCalculatorModal(false)}
        onSaveTripToFuelLogs={handleAddFuelLog}
        lang={lang}
      />

      <PwaInstallModal
        isOpen={showInstallGuideModal}
        onClose={() => setShowInstallGuideModal(false)}
        onTriggerInstall={handleInstallPwa}
        hasNativePrompt={!!deferredPrompt}
      />

    </div>
  );
}
