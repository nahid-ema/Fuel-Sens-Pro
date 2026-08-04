import React from 'react';
import { FuelLog, MaintenanceLog, TabType } from '../types';
import { Language, translations } from '../lib/translations';
import {
  Flame,
  Droplets,
  Gauge,
  Plus,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Calendar,
  Wrench,
  DollarSign,
  Activity
} from 'lucide-react';

interface DashboardViewProps {
  fuelLogs: FuelLog[];
  maintenanceLogs: MaintenanceLog[];
  onChangeTab: (tab: TabType) => void;
  onOpenAddFuel: () => void;
  onOpenAddMaintenance: () => void;
  lang: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  fuelLogs,
  maintenanceLogs,
  onChangeTab,
  onOpenAddFuel,
  onOpenAddMaintenance,
  lang
}) => {
  const t = translations[lang];

  // 1. Calculate Average Fuel Efficiency in KM/L
  const totalKm = fuelLogs.reduce((acc, log) => acc + log.travelKm, 0);
  const totalLiters = fuelLogs.reduce((acc, log) => acc + log.liters, 0);
  const totalFuelCost = fuelLogs.reduce((acc, log) => acc + log.totalCost, 0);

  const averageEfficiency = totalLiters > 0 ? (totalKm / totalLiters).toFixed(1) : '--';
  const averageCostPerKm = totalKm > 0 ? (totalFuelCost / totalKm).toFixed(2) : '--';

  // 2. Metric Tile: Last Fill Volume
  const lastFuelLog = fuelLogs.length > 0 ? fuelLogs[0] : null;
  const lastFillLiters = lastFuelLog ? `${lastFuelLog.liters.toFixed(1)} L` : '0 L';

  // 3. Metric Tile: Next Service Mileage target (in KM)
  // Calculate based on highest recorded odometer or last maintenance + 5,000 KM
  const highestOdometerFromFuel = fuelLogs.reduce((max, log) => Math.max(max, log.odometerKm || 0), 0);
  const highestOdometerFromMaint = maintenanceLogs.reduce((max, log) => Math.max(max, log.odometerKm || 0), 0);
  const currentOdometer = Math.max(highestOdometerFromFuel, highestOdometerFromMaint, 42500);

  const lastMaintenanceOdometer = maintenanceLogs.length > 0 ? maintenanceLogs[0].odometerKm : 42200;
  const nextServiceTargetKm = lastMaintenanceOdometer + 5000;
  const kmUntilService = Math.max(0, nextServiceTargetKm - currentOdometer);

  // 4. Recent 3 Maintenance Logs
  const recentMaintenance = maintenanceLogs.slice(0, 3);

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200">
      
      {/* Hero Efficiency Banner */}
      <div className="m3-hero-card p-6 md:p-8 text-white relative overflow-hidden group">
        
        {/* Glow Accent Circle Background */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF5200]/20 rounded-full blur-3xl group-hover:bg-[#FF5200]/30 transition-all duration-500" />

        {/* Top Badges Row */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {t.liveLogs}
            </span>
          </div>

          <span className="text-xs text-zinc-400 font-medium">
            {fuelLogs.length} {lang === 'bn' ? 'টি এন্ট্রি ট্র্যাক করা হয়েছে' : 'Fill-ups Tracked'}
          </span>
        </div>

        {/* Hero Efficiency Value */}
        <div className="mb-6">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#FF5200]" />
            {t.fuelEfficiency}
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-sm">
              {averageEfficiency}
            </span>
            <span className="text-xl md:text-2xl font-bold text-[#FF5200]">
              {t.kmPerLiter}
            </span>
          </div>
        </div>

        {/* Sub-Metrics Row Inside Hero */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/80">
          <div>
            <p className="text-[11px] font-medium text-zinc-400">{t.avgCostPerKm}</p>
            <p className="text-lg md:text-xl font-bold text-emerald-400 mt-0.5">
              {t.bdtSymbol} {averageCostPerKm} <span className="text-xs text-zinc-500 font-normal">/ {t.km}</span>
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-zinc-400">{t.totalDistance}</p>
            <p className="text-lg md:text-xl font-bold text-white mt-0.5">
              {totalKm.toLocaleString()} <span className="text-xs text-zinc-500 font-normal">{t.km}</span>
            </p>
          </div>
        </div>

        {/* Quick Action Button inside Hero */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            onClick={onOpenAddFuel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#FF5200] hover:bg-[#E04800] text-white font-bold text-xs tracking-wide shadow-lg shadow-[#FF5200]/30 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t.addFuelBtn}</span>
          </button>
        </div>

      </div>

      {/* Metric Tiles Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Tile 1: Last Fill Volume */}
        <div className="m3-card p-6 relative overflow-hidden group hover:border-[#FF5200]/40 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                {lang === 'bn' ? 'সর্বশেষ ফুয়েল পরিমাণ' : 'Last Fill Volume'}
              </p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {lastFillLiters} <span className="text-sm font-bold text-slate-400">L</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Droplets className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <span>
              {lastFuelLog ? `${t.date}: ${lastFuelLog.date}` : t.noLogsYet}
            </span>
            <span className="font-semibold text-slate-700 dark:text-zinc-300">
              {lastFuelLog ? `৳ ${lastFuelLog.perLiterCost} / L` : ''}
            </span>
          </div>
        </div>

        {/* Tile 2: Next Service Mileage Target */}
        <div className="m3-card p-6 relative overflow-hidden group hover:border-[#FF5200]/40 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                {lang === 'bn' ? 'পরবর্তী সার্ভিস টার্গেট' : 'Next Service Target'}
              </p>
              <p className="text-3xl font-extrabold text-[#FF5200]">
                {nextServiceTargetKm.toLocaleString()} <span className="text-base font-bold text-slate-500 dark:text-zinc-400">{t.km}</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FF5200]/10 text-[#FF5200] flex items-center justify-center">
              <Gauge className="w-6 h-6" />
            </div>
          </div>

          {/* Service Progress */}
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
              <span>{lang === 'bn' ? 'বর্তমান ওডোমিটার' : 'Current Odometer'}: {currentOdometer.toLocaleString()} {t.km}</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {lang === 'bn' ? `${kmUntilService} কিমি পরে` : `In ${kmUntilService} KM`}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF5200] to-amber-500"
                style={{
                  width: `${Math.min(100, Math.max(10, ((currentOdometer - lastMaintenanceOdometer) / 5000) * 100))}%`
                }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Recent Maintenance Preview Section */}
      <div className="m3-card p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#FF5200]" />
              {t.recentMaintenance}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              {lang === 'bn' ? 'সার্ভিস ইতিহাস ও গাড়ির কন্ডিশন লগ' : 'Service history & vehicle health logs'}
            </p>
          </div>

          <button
            onClick={() => onChangeTab('maintenance')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800/80 hover:bg-[#FF5200]/10 hover:text-[#FF5200] text-xs font-bold text-slate-700 dark:text-zinc-200 transition uppercase"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* List of recent 3 maintenance records */}
        {recentMaintenance.length > 0 ? (
          <div className="space-y-3">
            {recentMaintenance.map((maint) => (
              <div
                key={maint.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-4 hover:border-[#FF5200]/30 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#FF5200]/10 text-[#FF5200] flex items-center justify-center shrink-0">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {maint.serviceTitle}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {maint.date}
                      </span>
                      <span>•</span>
                      <span>{maint.odometerKm.toLocaleString()} {t.km}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    ৳ {maint.totalCost.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">BDT</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
            <p className="text-xs text-slate-500 dark:text-zinc-400">{lang === 'bn' ? 'এখনো কোন সার্ভিস রেকর্ড যোগ করা হয়নি।' : 'No maintenance records logged yet.'}</p>
            <button
              onClick={onOpenAddMaintenance}
              className="mt-3 px-4 py-1.5 rounded-full bg-[#FF5200]/10 text-[#FF5200] text-xs font-bold hover:bg-[#FF5200] hover:text-white transition"
            >
              {t.addMaintBtn}
            </button>
          </div>
        )}

      </div>

      {/* Developer Attribution Footer */}
      <footer className="pt-6 pb-2 text-center border-t border-slate-200/60 dark:border-zinc-800/60">
        <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 tracking-wide">
          {t.developerCredit}
        </p>
        <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">
          Fuel Flow © 2026 • Vehicle Fuel & Service Tracker
        </p>
      </footer>

    </div>
  );
};
