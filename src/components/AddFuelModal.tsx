import React, { useState, useEffect } from 'react';
import { X, Fuel, Flame, Calendar, Gauge, DollarSign, Calculator, FileText } from 'lucide-react';
import { FuelLog } from '../types';
import { Language, translations } from '../lib/translations';

interface AddFuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLog: (log: Omit<FuelLog, 'id'>) => void;
  latestOdometer?: number;
  lang?: Language;
}

export const AddFuelModal: React.FC<AddFuelModalProps> = ({
  isOpen,
  onClose,
  onAddLog,
  latestOdometer = 42500,
  lang = 'en'
}) => {
  const t = translations[lang];
  const [travelKm, setTravelKm] = useState<string>('350');
  const [perLiterCost, setPerLiterCost] = useState<string>('130');
  const [totalCost, setTotalCost] = useState<string>('3640');
  const [odometerKm, setOdometerKm] = useState<string>((latestOdometer + 350).toString());
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Automatic real-time calculations:
  // Liters filled = Total Cost / Per Liter Cost
  // Mileage (KM/L) = Travel KM / Liters filled
  const numericTravelKm = parseFloat(travelKm) || 0;
  const numericPerLiterCost = parseFloat(perLiterCost) || 0;
  const numericTotalCost = parseFloat(totalCost) || 0;

  const litersFilled = numericPerLiterCost > 0 ? numericTotalCost / numericPerLiterCost : 0;
  const calculatedMileage = litersFilled > 0 ? numericTravelKm / litersFilled : 0;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericTravelKm <= 0 || numericPerLiterCost <= 0 || numericTotalCost <= 0) {
      setError('Please enter valid positive values for Travel KM, Price, and Total Cost.');
      return;
    }

    onAddLog({
      date: date || new Date().toISOString().split('T')[0],
      travelKm: numericTravelKm,
      perLiterCost: numericPerLiterCost,
      totalCost: numericTotalCost,
      liters: litersFilled,
      efficiency: calculatedMileage,
      fuelGrade: '91 Grade',
      odometerKm: parseFloat(odometerKm) || undefined,
      notes: notes.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg m3-card bg-white dark:bg-[#121214] p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5200] text-white flex items-center justify-center shadow-md shadow-[#FF5200]/30">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">{t.addFuelTitle}</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">{t.addFuelDesc}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Locked Fuel Standard Banner */}
        <div className="mb-5 p-3 rounded-2xl bg-[#FF5200]/10 border border-[#FF5200]/20 flex items-center justify-between text-xs font-bold text-[#FF5200]">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 fill-[#FF5200]" />
            <span>Fuel Standard: 91 Octane Grade</span>
          </div>
          <span className="text-[10px] bg-[#FF5200] text-white px-2 py-0.5 rounded-full uppercase">Fixed</span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Grid Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Travel Distance KM */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Distance Traveled (KM)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  placeholder="350"
                  value={travelKm}
                  onChange={(e) => setTravelKm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">KM</span>
              </div>
            </div>

            {/* Per Liter Cost in BDT */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Per Liter Price (৳)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  placeholder="130"
                  value={perLiterCost}
                  onChange={(e) => setPerLiterCost(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">৳/L</span>
              </div>
            </div>

            {/* Total Cost in BDT */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Total Expense (৳)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  placeholder="3640"
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">BDT ৳</span>
              </div>
            </div>

            {/* Odometer Reading KM */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Odometer Reading (KM)
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="42850"
                  value={odometerKm}
                  onChange={(e) => setOdometerKm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">KM</span>
              </div>
            </div>

          </div>

          {/* Real-Time Calculated Outputs */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase">
                Calculated Liters
              </p>
              <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {litersFilled > 0 ? litersFilled.toFixed(2) : '0.00'} <span className="text-xs text-slate-400">L</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">(Total Cost / Price Per Liter)</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase">
                Calculated Efficiency
              </p>
              <p className="text-lg font-black text-[#FF5200] mt-0.5">
                {calculatedMileage > 0 ? calculatedMileage.toFixed(1) : '0.0'} <span className="text-xs">KM/L</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">(Distance Traveled / Liters)</p>
            </div>
          </div>

          {/* Date & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Log Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Highway cruise, Full Tank"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#FF5200] hover:bg-[#E04800] text-white font-bold text-xs tracking-wide shadow-lg shadow-[#FF5200]/30 transition flex items-center justify-center gap-2 mt-2"
          >
            <Fuel className="w-4 h-4" />
            <span>Save Fuel Fill-Up Log</span>
          </button>

        </form>

      </div>
    </div>
  );
};
