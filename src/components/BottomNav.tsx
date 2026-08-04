import React from 'react';
import { LayoutDashboard, Calculator, Fuel, Wrench } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenTripCalculator: () => void;
  fuelCount: number;
  maintenanceCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenTripCalculator,
  fuelCount,
  maintenanceCount
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-lg border-t border-slate-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Dashboard Button */}
        <button
          onClick={() => onChangeTab('dashboard')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
            activeTab === 'dashboard'
              ? 'text-[#FF5200] font-bold scale-105'
              : 'text-slate-500 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'dashboard' ? 'bg-[#FF5200]/10' : 'bg-transparent'}`}>
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">Dashboard</span>
          {activeTab === 'dashboard' && (
            <span className="absolute -bottom-1 w-8 h-1 rounded-full bg-[#FF5200] shadow-sm shadow-[#FF5200]/50" />
          )}
        </button>

        {/* Calculator Button (Right next to Dashboard) */}
        <button
          onClick={onOpenTripCalculator}
          className="relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-slate-500 dark:text-zinc-400 font-medium hover:text-[#FF5200] transition-all duration-200 hover:scale-105"
          title="Open Trip & Fuel Calculator"
        >
          <div className="p-1.5 rounded-full bg-slate-100 dark:bg-zinc-800/80 text-[#FF5200]">
            <Calculator className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight font-semibold">Calculator</span>
        </button>

        {/* Fuel Button */}
        <button
          onClick={() => onChangeTab('fuel')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
            activeTab === 'fuel'
              ? 'text-[#FF5200] font-bold scale-105'
              : 'text-slate-500 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'fuel' ? 'bg-[#FF5200]/10' : 'bg-transparent'}`}>
            <Fuel className={`w-5 h-5 ${activeTab === 'fuel' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">Fuel</span>
          {activeTab === 'fuel' && (
            <span className="absolute -bottom-1 w-8 h-1 rounded-full bg-[#FF5200] shadow-sm shadow-[#FF5200]/50" />
          )}
          {fuelCount > 0 && (
            <span className="absolute top-0.5 right-1 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
              {fuelCount}
            </span>
          )}
        </button>

        {/* Maintenance Button */}
        <button
          onClick={() => onChangeTab('maintenance')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
            activeTab === 'maintenance'
              ? 'text-[#FF5200] font-bold scale-105'
              : 'text-slate-500 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'maintenance' ? 'bg-[#FF5200]/10' : 'bg-transparent'}`}>
            <Wrench className={`w-5 h-5 ${activeTab === 'maintenance' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">Maintenance</span>
          {activeTab === 'maintenance' && (
            <span className="absolute -bottom-1 w-8 h-1 rounded-full bg-[#FF5200] shadow-sm shadow-[#FF5200]/50" />
          )}
          {maintenanceCount > 0 && (
            <span className="absolute top-0.5 right-1 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
              {maintenanceCount}
            </span>
          )}
        </button>

      </div>
    </div>
  );
};
