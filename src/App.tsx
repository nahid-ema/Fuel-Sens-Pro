import React, { useState, useEffect } from 'react';
import { FuelLog, MaintenanceLog, User, TabType } from './types';
import { INITIAL_FUEL_LOGS, INITIAL_MAINTENANCE_LOGS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { FuelView } from './components/FuelView';
import { MaintenanceView } from './components/MaintenanceView';
import { AuthModal } from './components/AuthModal';
import { AddFuelModal } from './components/AddFuelModal';
import { AddMaintenanceModal } from './components/AddMaintenanceModal';
import { TripCalculatorModal } from './components/TripCalculatorModal';

export default function App() {
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
    // Default guest session so app works seamlessly immediately
    return {
      email: 'guest@fuelflow.app',
      name: 'Guest Driver',
      isGuest: true
    };
  });

  const handleAuthenticate = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('fuelflow_user', JSON.stringify(newUser));
  };

  const handleSignOut = () => {
    setUser(null);
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

  useEffect(() => {
    localStorage.setItem('fuelflow_fuel_logs', JSON.stringify(fuelLogs));
  }, [fuelLogs]);

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
  const handleAddFuelLog = (newLogData: Omit<FuelLog, 'id'>) => {
    const newLog: FuelLog = {
      ...newLogData,
      id: `fuel-${Date.now()}`
    };
    setFuelLogs((prev) => [newLog, ...prev]);
  };

  const handleDeleteFuelLog = (id: string) => {
    setFuelLogs((prev) => prev.filter((log) => log.id !== id));
  };

  // Handlers for Add Maintenance
  const handleAddMaintenanceLog = (newLogData: Omit<MaintenanceLog, 'id'>) => {
    const newLog: MaintenanceLog = {
      ...newLogData,
      id: `maint-${Date.now()}`
    };
    setMaintenanceLogs((prev) => [newLog, ...prev]);
  };

  const handleDeleteMaintenanceLog = (id: string) => {
    setMaintenanceLogs((prev) => prev.filter((log) => log.id !== id));
  };

  // Calculate highest odometer for smart defaulting in modals
  const highestOdometerFromFuel = fuelLogs.reduce((max, log) => Math.max(max, log.odometerKm || 0), 0);
  const highestOdometerFromMaint = maintenanceLogs.reduce((max, log) => Math.max(max, log.odometerKm || 0), 0);
  const latestOdometer = Math.max(highestOdometerFromFuel, highestOdometerFromMaint, 42500);

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
          />
        )}

        {activeTab === 'fuel' && (
          <FuelView
            logs={fuelLogs}
            onOpenAddFuel={() => setShowAddFuelModal(true)}
            onDeleteLog={handleDeleteFuelLog}
          />
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceView
            logs={maintenanceLogs}
            onOpenAddMaintenance={() => setShowAddMaintenanceModal(true)}
            onDeleteLog={handleDeleteMaintenanceLog}
          />
        )}
      </main>

      {/* Bottom Tab Bar Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        fuelCount={fuelLogs.length}
        maintenanceCount={maintenanceLogs.length}
      />

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticate={handleAuthenticate}
      />

      <AddFuelModal
        isOpen={showAddFuelModal}
        onClose={() => setShowAddFuelModal(false)}
        onAddLog={handleAddFuelLog}
        latestOdometer={latestOdometer}
      />

      <AddMaintenanceModal
        isOpen={showAddMaintenanceModal}
        onClose={() => setShowAddMaintenanceModal(false)}
        onAddLog={handleAddMaintenanceLog}
        latestOdometer={latestOdometer}
      />

      <TripCalculatorModal
        isOpen={showTripCalculatorModal}
        onClose={() => setShowTripCalculatorModal(false)}
        onSaveTripToFuelLogs={handleAddFuelLog}
      />

    </div>
  );
}
