import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Fuel, Wrench } from 'lucide-react';
import { TabType } from '../types';
import { Language, translations } from '../lib/translations';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenTripCalculator: () => void;
  fuelCount: number;
  maintenanceCount: number;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenTripCalculator,
  fuelCount,
  maintenanceCount,
  lang
}) => {
  const t = translations[lang];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-lg border-t border-slate-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Dashboard Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => onChangeTab('dashboard')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-colors ${
            activeTab === 'dashboard'
              ? 'text-[#FF5200] font-bold'
              : 'text-slate-500 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'dashboard' ? 'bg-[#FF5200]/10' : 'bg-transparent'}`}>
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">{t.dashboard}</span>
          {activeTab === 'dashboard' && (
            <motion.span
              layoutId="activeTabPill"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute -bottom-1 w-8 h-1 rounded-full bg-[#FF5200] shadow-sm shadow-[#FF5200]/50"
            />
          )}
        </motion.button>

        {/* Fuel Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => onChangeTab('fuel')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-colors ${
            activeTab === 'fuel'
              ? 'text-[#FF5200] font-bold'
              : 'text-slate-500 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'fuel' ? 'bg-[#FF5200]/10' : 'bg-transparent'}`}>
            <Fuel className={`w-5 h-5 ${activeTab === 'fuel' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">{t.fuel}</span>
          {activeTab === 'fuel' && (
            <motion.span
              layoutId="activeTabPill"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute -bottom-1 w-8 h-1 rounded-full bg-[#FF5200] shadow-sm shadow-[#FF5200]/50"
            />
          )}
          {fuelCount > 0 && (
            <span className="absolute top-0.5 right-1 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
              {fuelCount}
            </span>
          )}
        </motion.button>

        {/* Maintenance Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => onChangeTab('maintenance')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-colors ${
            activeTab === 'maintenance'
              ? 'text-[#FF5200] font-bold'
              : 'text-slate-500 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'maintenance' ? 'bg-[#FF5200]/10' : 'bg-transparent'}`}>
            <Wrench className={`w-5 h-5 ${activeTab === 'maintenance' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">{t.maintenance}</span>
          {activeTab === 'maintenance' && (
            <motion.span
              layoutId="activeTabPill"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute -bottom-1 w-8 h-1 rounded-full bg-[#FF5200] shadow-sm shadow-[#FF5200]/50"
            />
          )}
          {maintenanceCount > 0 && (
            <span className="absolute top-0.5 right-1 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
              {maintenanceCount}
            </span>
          )}
        </motion.button>

      </div>
    </div>
  );
};
