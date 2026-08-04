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
      isGuest: true
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
      isGuest: true
    };
    setUser(guestUser);
    localStorage.removeItem('fuelflow_user');
  };

  // 3. Fuel Logs State
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => {
    const saved = localStorage.getItem('fuelflow_fuel_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
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
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_MAINTENANCE_LOGS;
  });

  // Real-time Firestore Sync for Fuel Logs & Maintenance Logs
  useEffect(() => {
    if (!user?.uid) return;

    // Fuel Logs Query
    const fuelQuery = query(
      collection(db, 'fuelLogs'),
      where('userId', '==', user.uid)
    );

    const unsubFuel = onSnapshot(fuelQuery, (snapshot) => {
      if (!snapshot.empty) {
        const docs: FuelLog[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        })) as FuelLog[];
        // Sort by date descending
        docs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setFuelLogs(docs);
      } else {
        // Seed initial data to firestore for new user
        INITIAL_FUEL_LOGS.forEach(async (log) => {
          try {
            const seedId = `${user.uid}_${log.id}`;
            await setDoc(doc(db, 'fuelLogs', seedId), {
              ...log,
              id: seedId,
              userId: user.uid,
              createdAt: serverTimestamp()
            });
          } catch (err) {
            console.warn('Could not seed initial fuel log:', err);
          }
        });
      }
    }, (err) => {
      console.warn('Fuel snapshot note:', err);
    });

    // Maintenance Logs Query
    const maintQuery = query(
      collection(db, 'maintenanceLogs'),
      where('userId', '==', user.uid)
    );

    const unsubMaint = onSnapshot(maintQuery, (snapshot) => {
      if (!snapshot.empty) {
        const docs: MaintenanceLog[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        })) as MaintenanceLog[];
        docs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setMaintenanceLogs(docs);
      } else {
        // Seed initial data to firestore for new user
        INITIAL_MAINTENANCE_LOGS.forEach(async (log) => {
          try {
            const seedId = `${user.uid}_${log.id}`;
            await setDoc(doc(db, 'maintenanceLogs', seedId), {
              ...log,
              id: seedId,
              userId: user.uid,
              createdAt: serverTimestamp()
            });
          } catch (err) {
            console.warn('Could not seed initial maint log:', err);
          }
        });
      }
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
    const newLog: FuelLog = {
      ...newLogData,
      id,
      userId: user?.uid
    };

    setFuelLogs((prev) => [newLog, ...prev]);

    if (user?.uid) {
      try {
        await setDoc(doc(db, 'fuelLogs', id), {
          ...newLog,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.error('Firestore save fuel log error:', err);
      }
    }
  };

  const handleDeleteFuelLog = async (id: string) => {
    setFuelLogs((prev) => prev.filter((log) => log.id !== id));

    if (user?.uid) {
      try {
        await deleteDoc(doc(db, 'fuelLogs', id));
      } catch (err) {
        console.error('Firestore delete fuel log error:', err);
      }
    }
  };

  // Handlers for Add Maintenance
  const handleAddMaintenanceLog = async (newLogData: Omit<MaintenanceLog, 'id'>) => {
    const id = `maint-${Date.now()}`;
    const newLog: MaintenanceLog = {
      ...newLogData,
      id,
      userId: user?.uid
    };

    setMaintenanceLogs((prev) => [newLog, ...prev]);

    if (user?.uid) {
      try {
        await setDoc(doc(db, 'maintenanceLogs', id), {
          ...newLog,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.error('Firestore save maintenance log error:', err);
      }
    }
  };

  const handleDeleteMaintenanceLog = async (id: string) => {
    setMaintenanceLogs((prev) => prev.filter((log) => log.id !== id));

    if (user?.uid) {
      try {
        await deleteDoc(doc(db, 'maintenanceLogs', id));
      } catch (err) {
        console.error('Firestore delete maintenance log error:', err);
      }
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

      {/* PWA Chrome Install Notification Banner */}
      {showInstallBanner && (
        <div className="max-w-4xl mx-auto px-4 pt-3">
          <div className="p-3.5 rounded-2xl bg-[#FF5200] text-white flex items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">
                ⚡
              </div>
              <div>
                <p className="text-xs font-bold">{lang === 'bn' ? 'ফ্যুয়েল ফ্লো অ্যাপ ইনস্টল করুন' : 'Install Fuel Flow App'}</p>
                <p className="text-[10px] text-white/80">{lang === 'bn' ? 'ক্রোমে দ্রুত ব্যবহারের জন্য হোম স্ক্রিনে যোগ করুন' : 'Add to home screen for fast Chrome access'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallPwa}
                className="px-3 py-1.5 rounded-full bg-white text-[#FF5200] font-bold text-xs shadow-sm hover:bg-slate-100 transition"
              >
                {lang === 'bn' ? 'এখনই ইনস্টল করুন' : 'Install Now'}
              </button>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="text-xs text-white/80 hover:text-white px-2 py-1"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Dismiss'}
              </button>
            </div>
          </div>
        </div>
      )}

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
