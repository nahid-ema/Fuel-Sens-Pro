import React, { useState } from 'react';
import { X, Calculator, Flame, Save, Fuel, ArrowRight, Sparkles, Check } from 'lucide-react';
import { FuelLog } from '../types';
import { Language, translations } from '../lib/translations';

interface TripCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTripToFuelLogs: (log: Omit<FuelLog, 'id'>) => void;
  lang?: Language;
}

export const TripCalculatorModal: React.FC<TripCalculatorModalProps> = ({
  isOpen,
  onClose,
  onSaveTripToFuelLogs,
  lang = 'en'
}) => {
  const t = translations[lang];
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState<string>('145');
  const [distanceKm, setDistanceKm] = useState<string>('250');
  const [totalFuelPrice, setTotalFuelPrice] = useState<string>('3625');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // Real-time calculations:
  // Fuel Price per liter = P
  // Distance = D
  // Total Fuel Price = T
  // Fuel Used (Liters) = T / P
  // Mileage (KM/L) = D / Fuel Used
  // Cost per KM (৳/KM) = T / D
  const P = parseFloat(fuelPricePerLiter) || 0;
  const D = parseFloat(distanceKm) || 0;
  const T = parseFloat(totalFuelPrice) || 0;

  const fuelUsedLiters = P > 0 ? T / P : 0;
  const mileageKmL = fuelUsedLiters > 0 ? D / fuelUsedLiters : 0;
  const costPerKm = D > 0 ? T / D : 0;

  const handleSaveTrip = () => {
    if (D <= 0 || P <= 0 || T <= 0) return;

    onSaveTripToFuelLogs({
      date: new Date().toISOString().split('T')[0],
      travelKm: D,
      perLiterCost: P,
      totalCost: T,
      liters: fuelUsedLiters,
      efficiency: mileageKmL,
      fuelGrade: 'Trip Log',
      notes: `Trip Calculator (${D} KM @ ৳${P}/L)`
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg m3-card bg-white dark:bg-[#121214] p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5200] text-white flex items-center justify-center shadow-md shadow-[#FF5200]/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                {t.tripCalcTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                {t.tripCalcDesc}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Fuel Price Per Liter (৳)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                placeholder="145"
                value={fuelPricePerLiter}
                onChange={(e) => setFuelPricePerLiter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">৳ / Liter</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Distance To Travel (KM)
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                placeholder="250"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">KM</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Total Fuel Expense (৳)
            </label>
            <div className="relative">
              <input
                type="number"
                step="10"
                placeholder="3625"
                value={totalFuelPrice}
                onChange={(e) => setTotalFuelPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">BDT ৳</span>
            </div>
          </div>
        </div>

        {/* Outputs Display Cards */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80 space-y-3">
          <p className="text-xs font-extrabold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
            Calculated Trip Metrics
          </p>

          <div className="grid grid-cols-3 gap-3 text-center">
            
            {/* Output 1: Fuel Used */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#121214] border border-slate-200/60 dark:border-zinc-800">
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-bold uppercase">Fuel Used</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                {fuelUsedLiters > 0 ? fuelUsedLiters.toFixed(1) : '0.0'} <span className="text-[10px] font-normal text-slate-400">L</span>
              </p>
            </div>

            {/* Output 2: Mileage */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#121214] border border-slate-200/60 dark:border-zinc-800">
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-bold uppercase">Mileage</p>
              <p className="text-base font-extrabold text-[#FF5200] mt-1">
                {mileageKmL > 0 ? mileageKmL.toFixed(1) : '0.0'} <span className="text-[10px] font-normal">KM/L</span>
              </p>
            </div>

            {/* Output 3: Cost per KM */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#121214] border border-slate-200/60 dark:border-zinc-800">
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-bold uppercase">Cost / KM</p>
              <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                ৳ {costPerKm > 0 ? costPerKm.toFixed(2) : '0.00'}
              </p>
            </div>

          </div>
        </div>

        {/* SAVE Action Button */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleSaveTrip}
            disabled={savedSuccess || D <= 0 || P <= 0 || T <= 0}
            className={`px-6 py-2.5 rounded-full text-xs font-bold text-white shadow-lg transition flex items-center gap-2 ${
              savedSuccess
                ? 'bg-emerald-600 shadow-emerald-600/30'
                : 'bg-[#FF5200] hover:bg-[#E04800] shadow-[#FF5200]/30 disabled:opacity-50'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved to Fuel Logs!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>SAVE TRIP TO LOGS</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
