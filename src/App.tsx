import React, { useState, useEffect, useRef } from 'react';
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
import { CheckCircle2, Sparkles } from 'lucide-react';
import {
  auth,
  db,
  onAuthStateChanged,
  firebaseSignOut,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  getDocFromServer,
  getDocsFromServer,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from './lib/firebase';

// Helper to remove undefined values before saving to Firestore
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      clean[key] = value;
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

  // Cloud Sync Status & Notification Toasts
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('synced');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Test Firebase Connection on App Load
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        setSyncStatus('synced');
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          setSyncStatus('offline');
        } else {
          setSyncStatus('synced'); // Default connected
        }
      }
    }
    testConnection();
  }, []);

  // 2. User Authentication State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fuelflow_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.isGuest) {
          return null;
        }
        return parsed;
      } catch {
        // Fallback
      }
    }
    return null;
  });

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && !firebaseUser.isAnonymous) {
        const u: User = {
          email: firebaseUser.email || 'guest@fuelflow.app',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          isGuest: false,
          uid: firebaseUser.uid
        };
        setUser(u);
        localStorage.setItem('fuelflow_user', JSON.stringify(u));
      } else {
        setUser(null);
        localStorage.removeItem('fuelflow_user');
      }
    });
    return () => unsubscribe();
  }, []);

  // 3. Fuel Logs State
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => {
    const saved = localStorage.getItem('fuelflow_fuel_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback
      }
    }
    return INITIAL_MAINTENANCE_LOGS;
  });

  // Keep refs to current state to prevent stale closure during Firestore callbacks
  const fuelLogsRef = useRef(fuelLogs);
  useEffect(() => { fuelLogsRef.current = fuelLogs; }, [fuelLogs]);

  const maintenanceLogsRef = useRef(maintenanceLogs);
  useEffect(() => { maintenanceLogsRef.current = maintenanceLogs; }, [maintenanceLogs]);

  // Custom Service Target & Odometer Settings (Synced Online)
  const [customServiceTarget, setCustomServiceTarget] = useState<number | null>(() => {
    const saved = localStorage.getItem('fuelflow_next_service_target');
    return saved ? parseInt(saved, 10) : null;
  });
  const [customCurrentOdometer, setCustomCurrentOdometer] = useState<number | null>(() => {
    const saved = localStorage.getItem('fuelflow_current_odometer');
    return saved ? parseInt(saved, 10) : null;
  });

  // Track initial cloud seed per user UID
  const seededFuelUidRef = useRef<Set<string>>(new Set());
  const seededMaintUidRef = useRef<Set<string>>(new Set());

  // Real-time Firestore Sync for Fuel Logs, Maintenance Logs & Settings
  useEffect(() => {
    const targetUid = user?.uid || 'guest_driver';
    setSyncStatus('syncing');

    // 1. Fuel Logs Query
    const fuelQuery = query(
      collection(db, 'fuelLogs'),
      where('userId', '==', targetUid)
    );

    const unsubFuel = onSnapshot(
      fuelQuery,
      (snapshot) => {
        setSyncStatus('synced');
        const cloudDocs: FuelLog[] = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as FuelLog)
        );

        if (snapshot.empty && !seededFuelUidRef.current.has(targetUid)) {
          seededFuelUidRef.current.add(targetUid);
          const initialLogs = fuelLogsRef.current;
          if (initialLogs.length > 0) {
            initialLogs.forEach((localDoc) => {
              const payload = sanitizeForFirestore({
                ...localDoc,
                userId: targetUid,
                updatedAt: serverTimestamp()
              });
              setDoc(doc(db, 'fuelLogs', localDoc.id), payload).catch(() => {});
            });
          }
        } else {
          seededFuelUidRef.current.add(targetUid);
          const sorted = [...cloudDocs].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setFuelLogs(sorted);
        }
      },
      (err) => {
        console.warn('Fuel snapshot note:', err);
        setSyncStatus('error');
      }
    );

    // 2. Maintenance Logs Query
    const maintQuery = query(
      collection(db, 'maintenanceLogs'),
      where('userId', '==', targetUid)
    );

    const unsubMaint = onSnapshot(
      maintQuery,
      (snapshot) => {
        setSyncStatus('synced');
        const cloudDocs: MaintenanceLog[] = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as MaintenanceLog)
        );

        if (snapshot.empty && !seededMaintUidRef.current.has(targetUid)) {
          seededMaintUidRef.current.add(targetUid);
          const initialLogs = maintenanceLogsRef.current;
          if (initialLogs.length > 0) {
            initialLogs.forEach((localDoc) => {
              const payload = sanitizeForFirestore({
                ...localDoc,
                userId: targetUid,
                updatedAt: serverTimestamp()
              });
              setDoc(doc(db, 'maintenanceLogs', localDoc.id), payload).catch(() => {});
            });
          }
        } else {
          seededMaintUidRef.current.add(targetUid);
          const sorted = [...cloudDocs].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setMaintenanceLogs(sorted);
        }
      },
      (err) => {
        console.warn('Maint snapshot note:', err);
        setSyncStatus('error');
      }
    );

    // 3. User Settings Query (Target KM & Current Odometer)
    const settingsDocRef = doc(db, 'userSettings', targetUid);
    const unsubSettings = onSnapshot(
      settingsDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.customServiceTarget !== undefined) {
            setCustomServiceTarget(data.customServiceTarget);
            if (data.customServiceTarget === null) localStorage.removeItem('fuelflow_next_service_target');
            else localStorage.setItem('fuelflow_next_service_target', data.customServiceTarget.toString());
          }
          if (data.customCurrentOdometer !== undefined) {
            setCustomCurrentOdometer(data.customCurrentOdometer);
            if (data.customCurrentOdometer === null) localStorage.removeItem('fuelflow_current_odometer');
            else localStorage.setItem('fuelflow_current_odometer', data.customCurrentOdometer.toString());
          }
        }
      },
      (err) => {
        console.warn('Settings snapshot note:', err);
      }
    );

    return () => {
      unsubFuel();
      unsubMaint();
      unsubSettings();
    };
  }, [user?.uid]);

  // Sync to local storage for offline backup
  useEffect(() => {
    localStorage.setItem('fuelflow_fuel_logs', JSON.stringify(fuelLogs));
  }, [fuelLogs]);

  useEffect(() => {
    localStorage.setItem('fuelflow_maintenance_logs', JSON.stringify(maintenanceLogs));
  }, [maintenanceLogs]);

  // User Authenticate & Guest-to-User Log Migration
  const handleAuthenticate = async (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('fuelflow_user', JSON.stringify(newUser));

    // Automatically migrate any existing local logs to new user ID and save online in Firestore
    setSyncStatus('syncing');
    try {
      const updatedFuel = fuelLogs.map((log) => ({ ...log, userId: newUser.uid }));
      setFuelLogs(updatedFuel);
      for (const log of updatedFuel) {
        const payload = sanitizeForFirestore({ ...log, updatedAt: serverTimestamp() });
        await setDoc(doc(db, 'fuelLogs', log.id), payload);
      }

      const updatedMaint = maintenanceLogs.map((log) => ({ ...log, userId: newUser.uid }));
      setMaintenanceLogs(updatedMaint);
      for (const log of updatedMaint) {
        const payload = sanitizeForFirestore({ ...log, updatedAt: serverTimestamp() });
        await setDoc(doc(db, 'maintenanceLogs', log.id), payload);
      }

      setSyncStatus('synced');
      showToast(lang === 'bn' ? 'আপনার সমস্ত ডেটা অনলাইনে নতুন অ্যাকাউন্টে সিঙ্ক হয়েছে!' : 'All your logs are now synced online to your new account!');
    } catch (err) {
      console.error('Migration sync error:', err);
      setSyncStatus('error');
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
    setUser(null);
    localStorage.removeItem('fuelflow_user');
    
    // Clear local data on sign out so next user gets a fresh slate
    setFuelLogs([]);
    setMaintenanceLogs([]);
    setCustomServiceTarget(null);
    setCustomCurrentOdometer(null);
    localStorage.removeItem('fuelflow_fuel_logs');
    localStorage.removeItem('fuelflow_maintenance_logs');
    localStorage.removeItem('fuelflow_next_service_target');
    localStorage.removeItem('fuelflow_current_odometer');
  };

  // Handlers for Save Custom Target & Odometer to Firestore Online
  const handleSaveCustomTarget = async (target: number | null) => {
    const targetUid = user?.uid || 'guest_driver';
    setCustomServiceTarget(target);
    if (target === null) localStorage.removeItem('fuelflow_next_service_target');
    else localStorage.setItem('fuelflow_next_service_target', target.toString());

    try {
      await setDoc(
        doc(db, 'userSettings', targetUid),
        {
          userId: targetUid,
          customServiceTarget: target,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
      showToast(lang === 'bn' ? 'সার্ভিস টার্গেট অনলাইনে সেভ হয়েছে!' : 'Next service target saved online!');
    } catch (err) {
      console.error('Save target online error:', err);
    }
  };

  const handleSaveCustomOdometer = async (odometer: number | null) => {
    const targetUid = user?.uid || 'guest_driver';
    setCustomCurrentOdometer(odometer);
    if (odometer === null) localStorage.removeItem('fuelflow_current_odometer');
    else localStorage.setItem('fuelflow_current_odometer', odometer.toString());

    try {
      await setDoc(
        doc(db, 'userSettings', targetUid),
        {
          userId: targetUid,
          customCurrentOdometer: odometer,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
      showToast(lang === 'bn' ? 'ওডোমিটার অনলাইনে সেভ হয়েছে!' : 'Bike current odometer saved online!');
    } catch (err) {
      console.error('Save odometer online error:', err);
    }
  };

  // Handlers for Add Fuel Log
  const handleAddFuelLog = async (newLogData: Omit<FuelLog, 'id'>) => {
    const id = `fuel-${Date.now()}`;
    const targetUid = user?.uid || 'guest_driver';
    const newLog: FuelLog = {
      ...newLogData,
      id,
      userId: targetUid
    };

    setFuelLogs((prev) => [newLog, ...prev]);
    setSyncStatus('syncing');

    try {
      const payload = sanitizeForFirestore({
        ...newLog,
        createdAt: serverTimestamp()
      });
      await setDoc(doc(db, 'fuelLogs', id), payload);
      setSyncStatus('synced');
      showToast(lang === 'bn' ? 'ফুয়েল লগ অনলাইনে সেভ হয়েছে!' : 'Fuel fill-up saved to Cloud!');
    } catch (err) {
      console.error('Firestore save fuel log error:', err);
      setSyncStatus('error');
    }
  };

  const handleDeleteFuelLog = async (id: string) => {
    setFuelLogs((prev) => prev.filter((log) => log.id !== id));
    setSyncStatus('syncing');

    try {
      await deleteDoc(doc(db, 'fuelLogs', id));
      setSyncStatus('synced');
      showToast(lang === 'bn' ? 'ফুয়েল লগ মুছে ফেলা হয়েছে' : 'Fuel log deleted online');
    } catch (err) {
      console.error('Firestore delete fuel log error:', err);
      setSyncStatus('error');
    }
  };

  // Handlers for Add Maintenance Log
  const handleAddMaintenanceLog = async (newLogData: Omit<MaintenanceLog, 'id'>) => {
    const id = `maint-${Date.now()}`;
    const targetUid = user?.uid || 'guest_driver';
    const newLog: MaintenanceLog = {
      ...newLogData,
      id,
      userId: targetUid
    };

    setMaintenanceLogs((prev) => [newLog, ...prev]);
    setSyncStatus('syncing');

    try {
      const payload = sanitizeForFirestore({
        ...newLog,
        createdAt: serverTimestamp()
      });
      await setDoc(doc(db, 'maintenanceLogs', id), payload);
      setSyncStatus('synced');
      showToast(lang === 'bn' ? 'সার্ভিস লগ অনলাইনে সেভ হয়েছে!' : 'Service log saved to Cloud!');
    } catch (err) {
      console.error('Firestore save maintenance log error:', err);
      setSyncStatus('error');
    }
  };

  const handleDeleteMaintenanceLog = async (id: string) => {
    setMaintenanceLogs((prev) => prev.filter((log) => log.id !== id));
    setSyncStatus('syncing');

    try {
      await deleteDoc(doc(db, 'maintenanceLogs', id));
      setSyncStatus('synced');
      showToast(lang === 'bn' ? 'সার্ভিস লগ মুছে ফেলা হয়েছে' : 'Service log deleted online');
    } catch (err) {
      console.error('Firestore delete maintenance log error:', err);
      setSyncStatus('error');
    }
  };

  // Force Manual Re-sync Button Handler
  const handleManualSync = async () => {
    setSyncStatus('syncing');
    const targetUid = user?.uid || 'guest_driver';
    try {
      const startTime = Date.now();
      
      // Test Ping
      await setDoc(doc(db, 'testSync', 'ping'), {
        timestamp: serverTimestamp(),
        pingBy: targetUid
      });
      await getDocFromServer(doc(db, 'testSync', 'ping'));
      
      // 1. FETCH & RESTORE FROM CLOUD FIRST
      const fuelQuery = query(collection(db, 'fuelLogs'), where('userId', '==', targetUid));
      const maintQuery = query(collection(db, 'maintenanceLogs'), where('userId', '==', targetUid));
      
      const [fuelSnap, maintSnap] = await Promise.all([
        getDocsFromServer(fuelQuery),
        getDocsFromServer(maintQuery)
      ]);
      
      const cloudFuelDocs = fuelSnap.docs.map(d => ({ id: d.id, ...d.data() } as FuelLog));
      const cloudMaintDocs = maintSnap.docs.map(d => ({ id: d.id, ...d.data() } as MaintenanceLog));
      
      // Merge with local logs
      setFuelLogs((prev) => {
        const mergedMap = new Map<string, FuelLog>();
        cloudFuelDocs.forEach(cd => mergedMap.set(cd.id, cd));
        prev.forEach(ld => { if (!mergedMap.has(ld.id)) mergedMap.set(ld.id, ld); });
        const merged = Array.from(mergedMap.values());
        merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return merged;
      });
      
      setMaintenanceLogs((prev) => {
        const mergedMap = new Map<string, MaintenanceLog>();
        cloudMaintDocs.forEach(cd => mergedMap.set(cd.id, cd));
        prev.forEach(ld => { if (!mergedMap.has(ld.id)) mergedMap.set(ld.id, ld); });
        const merged = Array.from(mergedMap.values());
        merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return merged;
      });
      
      // Also fetch settings
      const settingsSnap = await getDocFromServer(doc(db, 'userSettings', targetUid));
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        if (data.customServiceTarget !== undefined) setCustomServiceTarget(data.customServiceTarget);
        if (data.customCurrentOdometer !== undefined) setCustomCurrentOdometer(data.customCurrentOdometer);
      }

      const latency = Date.now() - startTime;

      let fuelCount = 0;
      // 2. Upload all local logs to ensure cloud is up to date
      // Wait for state to settle? We'll just use the merged data.
      // Actually, since setState is async, we can just use the merged arrays directly.
      
      const mergedFuel = (() => {
        const map = new Map<string, FuelLog>();
        cloudFuelDocs.forEach(cd => map.set(cd.id, cd));
        fuelLogs.forEach(ld => { if (!map.has(ld.id)) map.set(ld.id, ld); });
        return Array.from(map.values());
      })();
      
      for (const log of mergedFuel) {
        const payload = sanitizeForFirestore({
          ...log,
          userId: targetUid,
          updatedAt: serverTimestamp()
        });
        await setDoc(doc(db, 'fuelLogs', log.id), payload);
        await setDoc(doc(db, 'backups', `fuel_${log.id}`), payload).catch(() => {});
        fuelCount++;
      }

      let maintCount = 0;
      const mergedMaint = (() => {
        const map = new Map<string, MaintenanceLog>();
        cloudMaintDocs.forEach(cd => map.set(cd.id, cd));
        maintenanceLogs.forEach(ld => { if (!map.has(ld.id)) map.set(ld.id, ld); });
        return Array.from(map.values());
      })();
      
      for (const log of mergedMaint) {
        const payload = sanitizeForFirestore({
          ...log,
          userId: targetUid,
          updatedAt: serverTimestamp()
        });
        await setDoc(doc(db, 'maintenanceLogs', log.id), payload);
        await setDoc(doc(db, 'backups', `maint_${log.id}`), payload).catch(() => {});
        maintCount++;
      }

      // 3. Upload user settings
      const settingsPayload = sanitizeForFirestore({
        userId: targetUid,
        customServiceTarget,
        customCurrentOdometer,
        updatedAt: serverTimestamp()
      });
      await setDoc(doc(db, 'userSettings', targetUid), settingsPayload, { merge: true });
      await setDoc(doc(db, 'backups', `settings_${targetUid}`), settingsPayload, { merge: true }).catch(() => {});

      setSyncStatus('synced');
      showToast(
        lang === 'bn'
          ? `ক্লাউড রিস্টোর ও সিঙ্ক সফল! ${fuelCount}টি ফুয়েল ও ${maintCount}টি সার্ভিস লগ পাওয়া গেছে (${latency}ms)`
          : `Cloud restored & synced! ${fuelCount} fuel & ${maintCount} service logs (${latency}ms)`
      );
    } catch (err) {
      console.error('Manual sync error:', err);
      setSyncStatus('error');
      showToast(
        lang === 'bn'
          ? 'ক্লাউড সিঙ্কে ত্রুটি ঘটেছে, পুনরায় চেষ্টা করুন।'
          : 'Cloud sync error occurred. Please try again.'
      );
    }
  };

  // Calculate highest odometer for smart defaulting in modals
  const highestOdometerFromFuel = fuelLogs.reduce((max, log) => Math.max(max, log.odometerKm || 0), 0);
  const highestOdometerFromMaint = maintenanceLogs.reduce((max, log) => Math.max(max, log.odometerKm || 0), 0);
  const latestOdometer = Math.max(highestOdometerFromFuel, highestOdometerFromMaint, 42500);

  // 5. Active Tab State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // 6. Modals State
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      setShowAuthModal(true);
    }
  }, [user]);
  const [showAddFuelModal, setShowAddFuelModal] = useState<boolean>(false);
  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = useState<boolean>(false);
  const [showTripCalculatorModal, setShowTripCalculatorModal] = useState<boolean>(false);

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
    <div className="min-h-screen bg-[#F2F3F5] dark:bg-[#09090B] text-slate-900 dark:text-white transition-colors relative">
      
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
        syncStatus={syncStatus}
        onManualSync={handleManualSync}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-zinc-800 text-white text-xs font-bold shadow-2xl border border-slate-700 dark:border-zinc-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
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
            customServiceTarget={customServiceTarget}
            customCurrentOdometer={customCurrentOdometer}
            onSaveCustomTarget={handleSaveCustomTarget}
            onSaveCustomOdometer={handleSaveCustomOdometer}
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
        onClose={() => { if (user) setShowAuthModal(false); }}
        onAuthenticate={handleAuthenticate}
        lang={lang}
        canClose={!!user}
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
