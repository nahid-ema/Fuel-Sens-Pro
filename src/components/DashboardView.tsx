import React, { useState } from 'react';
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
  Activity,
  Edit3,
  Info,
  RotateCcw,
  Check,
  X
} from 'lucide-react';

interface DashboardViewProps {
  fuelLogs: FuelLog[];
  maintenanceLogs: MaintenanceLog[];
  onChangeTab: (tab: TabType) => void;
  onOpenAddFuel: () => void;
  onOpenAddMaintenance: () => void;
  lang: Language;
  customServiceTarget?: number | null;
  customCurrentOdometer?: number | null;
  onSaveCustomTarget?: (target: number | null) => void;
  onSaveCustomOdometer?: (odometer: number | null) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  fuelLogs,
  maintenanceLogs,
  onChangeTab,
  onOpenAddFuel,
  onOpenAddMaintenance,
  lang,
  customServiceTarget = null,
  customCurrentOdometer = null,
  onSaveCustomTarget,
  onSaveCustomOdometer
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

  // 3. Metric Tile: Next Service Mileage target & Current Odometer
  const [showEditServiceModal, setShowEditServiceModal] = useState<boolean>(false);
  const [showEditOdometerModal, setShowEditOdometerModal] = useState<boolean>(false);
  const [inputTargetKm, setInputTargetKm] = useState<string>('');
  const [inputOdometerKm, setInputOdometerKm] = useState<string>('');

  const highestOdometerFromFuel = fuelLogs.reduce((max, log) => Math.max(max, log.odometerKm || 0), 0);
  const highestOdometerFromMaint = maintenanceLogs.reduce((max, log) => Math.max(max, log.odometerKm || 0), 0);
  const autoOdometer = Math.max(highestOdometerFromFuel, highestOdometerFromMaint, 0);
  const currentOdometer = customCurrentOdometer !== null ? customCurrentOdometer : autoOdometer;

  const lastMaintenanceOdometer = maintenanceLogs.length > 0 ? maintenanceLogs[0].odometerKm : currentOdometer;
  const autoCalculatedTargetKm = lastMaintenanceOdometer + 5000;
  const nextServiceTargetKm = customServiceTarget !== null ? customServiceTarget : autoCalculatedTargetKm;
  const kmUntilService = Math.max(0, nextServiceTargetKm - currentOdometer);

  const handleSaveTarget = (target: number | null) => {
    if (onSaveCustomTarget) {
      onSaveCustomTarget(target);
    }
    setShowEditServiceModal(false);
  };

  const handleSaveOdometer = (odometer: number | null) => {
    if (onSaveCustomOdometer) {
      onSaveCustomOdometer(odometer);
    }
    setShowEditOdometerModal(false);
  };

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
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  {lang === 'bn' ? 'পরবর্তী সার্ভিস টার্গেট' : 'Next Service Target'}
                </p>
              </div>
              <p className="text-3xl font-extrabold text-[#FF5200]">
                {nextServiceTargetKm.toLocaleString()} <span className="text-base font-bold text-slate-500 dark:text-zinc-400">{t.km}</span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#FF5200]/10 text-[#FF5200] flex items-center justify-center">
                <Gauge className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={() => {
                  setInputTargetKm(nextServiceTargetKm.toString());
                  setShowEditServiceModal(true);
                }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FF5200] hover:bg-[#E04800] text-white text-[10px] font-bold shadow-sm transition"
              >
                <Edit3 className="w-2.5 h-2.5" />
                <span>{lang === 'bn' ? 'পরিবর্তন' : 'Fix Target'}</span>
              </button>
            </div>
          </div>

          {/* Service Progress */}
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span>{lang === 'bn' ? 'বর্তমান ওডোমিটার' : 'Current Odometer'}: <strong className="text-slate-900 dark:text-white font-extrabold">{currentOdometer.toLocaleString()} {t.km}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setInputOdometerKm(currentOdometer.toString());
                    setShowEditOdometerModal(true);
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-zinc-800 hover:bg-[#FF5200] hover:text-white text-[10px] font-bold transition flex items-center gap-1"
                  title="Change Current Odometer"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>{lang === 'bn' ? 'এডিট' : 'Edit'}</span>
                </button>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {lang === 'bn' ? `${kmUntilService.toLocaleString()} কিমি পরে` : `In ${kmUntilService.toLocaleString()} KM`}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF5200] to-amber-500"
                style={{
                  width: `${Math.min(100, Math.max(10, ((currentOdometer - lastMaintenanceOdometer) / (nextServiceTargetKm - lastMaintenanceOdometer || 5000)) * 100))}%`
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
          Fuel Sens © 2026 • Bike Fuel & Service Tracker
        </p>
      </footer>

      {/* Modal: Fix / Change Next Service Target */}
      {showEditServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FF5200]/10 text-[#FF5200] flex items-center justify-center shrink-0">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {lang === 'bn' ? 'পরবর্তী সার্ভিস টার্গেট ফিক্স করুন' : 'Fix Next Service Target'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    {lang === 'bn' ? 'বাইকের পরবর্তী সার্ভিস ওডোমিটার (KM) সেট করুন' : 'Set your bike\'s target service odometer'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditServiceModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Explanation box */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{lang === 'bn' ? 'সার্ভিস টার্গেট কিভাবে হিসাব হয়?' : 'How Service Target is Calculated'}</p>
                <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                  {lang === 'bn'
                    ? 'অ্যাপটি সর্বশেষ সার্ভিসিং এর সাথে স্ট্যান্ডার্ড ৫,০০০ কিমি যোগ করে পরবর্তী টার্গেট দেয়। আপনি আপনার প্রয়োজন অনুযায়ী নতুন টার্গেট কিমি সেট করতে পারেন।'
                    : 'Fuel Sens automatically adds 5,000 KM to your last recorded maintenance odometer. You can adjust this target anytime based on your bike manufacturer\'s schedule.'}
                </p>
              </div>
            </div>

            {/* Target Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                {lang === 'bn' ? 'পরবর্তী সার্ভিস ওডোমিটার টার্গেট (KM)' : 'Next Service Target Odometer (KM)'}
              </label>
              <input
                type="number"
                step="100"
                value={inputTargetKm}
                onChange={(e) => setInputTargetKm(e.target.value)}
                placeholder="e.g. 45000"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-base font-extrabold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 mb-2">
                {lang === 'bn' ? 'দ্রুত সিলেক্ট করুন (Quick Presets)' : 'Quick Target Presets'}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[45000, 48000, 50000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setInputTargetKm(preset.toString())}
                    className="py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 hover:bg-[#FF5200]/10 hover:text-[#FF5200] text-xs font-bold text-slate-700 dark:text-zinc-300 transition"
                  >
                    {preset.toLocaleString()} KM
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleSaveTarget(null)}
                className="px-3 py-2.5 rounded-2xl bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'অটো টার্গেটে রিসেট' : 'Reset Auto'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const val = parseInt(inputTargetKm, 10);
                  if (!isNaN(val) && val > 0) {
                    handleSaveTarget(val);
                  }
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#FF5200] hover:bg-[#E04800] text-white text-xs font-extrabold shadow-lg shadow-[#FF5200]/30 transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{lang === 'bn' ? 'টার্গেট সেভ করুন' : 'Save Target'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Current Odometer */}
      {showEditOdometerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FF5200]/10 text-[#FF5200] flex items-center justify-center shrink-0">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {lang === 'bn' ? 'বর্তমান ওডোমিটার ফিক্স করুন' : 'Update Current Odometer'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    {lang === 'bn' ? 'আপনার বাইকের আসল ওডোমিটার রিডিং বসান' : 'Set your bike\'s actual current odometer reading'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditOdometerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Info Notice */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{lang === 'bn' ? 'বর্তমান ওডোমিটার কেন পরিবর্তন করবেন?' : 'Setting Bike Odometer'}</p>
                <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                  {lang === 'bn'
                    ? 'আপনার বাইকের ড্যাশবোর্ডের আসল ওডোমিটার কিমি বসান। এর সাথে মিলিয়ে অ্যাপ পরবর্তী সার্ভিস রিমাইন্ডার হিসাব করবে।'
                    : 'Enter the exact odometer reading from your bike\'s display. Fuel Sens will use this to accurately estimate remaining KM until your next service.'}
                </p>
              </div>
            </div>

            {/* Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                {lang === 'bn' ? 'আপনার বাইকের বর্তমান ওডোমিটার (KM)' : 'Bike Current Odometer (KM)'}
              </label>
              <input
                type="number"
                step="1"
                value={inputOdometerKm}
                onChange={(e) => setInputOdometerKm(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-base font-extrabold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleSaveOdometer(null)}
                className="px-3 py-2.5 rounded-2xl bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'স্যাম্পল ডেটায় রিসেট' : 'Reset Auto'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const val = parseInt(inputOdometerKm, 10);
                  if (!isNaN(val) && val >= 0) {
                    handleSaveOdometer(val);
                  }
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#FF5200] hover:bg-[#E04800] text-white text-xs font-extrabold shadow-lg shadow-[#FF5200]/30 transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{lang === 'bn' ? 'ওডোমিটার সেভ করুন' : 'Save Odometer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
