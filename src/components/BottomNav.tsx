import React from 'react';
import { LayoutDashboard, Fuel, Wrench } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  fuelCount: number;
  maintenanceCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  fuelCount,
  maintenanceCount
}) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'fuel' as TabType,
      label: 'Fuel',
      icon: Fuel,
      badge: fuelCount > 0 ? fuelCount : null
    },
    {
      id: 'maintenance' as TabType,
      label: 'Maintenance',
      icon: Wrench,
      badge: maintenanceCount > 0 ? maintenanceCount : null
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-lg border-t border-slate-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-[#FF5200] font-bold scale-105'
                  : 'text-slate-500 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div
                className={`p-1.5 rounded-full transition-colors ${
                  isActive ? 'bg-[#FF5200]/10' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>

              {/* Indicator Pill for active tab */}
              {isActive && (
                <span className="absolute -bottom-1 w-8 h-1 rounded-full bg-[#FF5200] shadow-sm shadow-[#FF5200]/50" />
              )}

              {/* Badge */}
              {tab.badge && (
                <span className="absolute top-0.5 right-2 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
