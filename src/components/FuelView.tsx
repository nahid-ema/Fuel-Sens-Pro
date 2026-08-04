import React, { useState } from 'react';
import { FuelLog } from '../types';
import {
  Fuel,
  Plus,
  Trash2,
  Flame,
  Search,
  Calendar,
  Gauge,
  TrendingUp,
  Droplet
} from 'lucide-react';

interface FuelViewProps {
  logs: FuelLog[];
  onOpenAddFuel: () => void;
  onDeleteLog: (id: string) => void;
}

export const FuelView: React.FC<FuelViewProps> = ({
  logs,
  onOpenAddFuel,
  onDeleteLog
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    return (
      log.date.includes(term) ||
      (log.notes && log.notes.toLowerCase().includes(term)) ||
      log.fuelGrade.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-200">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Fuel className="w-6 h-6 text-[#FF5200]" />
            Fuel Fill-Up Logs
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Track fuel efficiency, mileage, and fill-up expenses in BDT (৳).
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search logs or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200] transition"
          />
        </div>
      </div>

      {/* History List */}
      {filteredLogs.length > 0 ? (
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="m3-card p-5 hover:border-[#FF5200]/40 transition group relative"
            >
              {/* Card Header Row */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FF5200]/10 text-[#FF5200] flex items-center justify-center font-bold text-xs">
                    <Fuel className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {log.date}
                    </span>
                    {log.odometerKm && (
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                        <Gauge className="w-3 h-3" />
                        Odometer: {log.odometerKm.toLocaleString()} KM
                      </p>
                    )}
                  </div>
                </div>

                {/* Badges & Delete */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FF5200]/10 text-[#FF5200] border border-[#FF5200]/20 text-[10px] font-extrabold">
                    <Flame className="w-3 h-3 fill-[#FF5200]" />
                    {log.fuelGrade || '91 Grade'}
                  </span>

                  {deletingId === log.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onDeleteLog(log.id)}
                        className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(log.id)}
                      className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      title="Delete fuel log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-100 dark:border-zinc-800/80 text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-bold">
                    Distance
                  </p>
                  <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {log.travelKm} KM
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-bold">
                    Liters Filled
                  </p>
                  <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {log.liters.toFixed(1)} L
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-bold">
                    Total Cost
                  </p>
                  <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                    ৳ {log.totalCost.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-bold">
                    Fuel Efficiency
                  </p>
                  <p className="font-extrabold text-[#FF5200] mt-0.5 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {log.efficiency.toFixed(1)} KM/L
                  </p>
                </div>
              </div>

              {/* Notes if any */}
              {log.notes && (
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-3 italic px-1">
                  "{log.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="m3-card p-12 text-center border-dashed border-2 border-slate-200 dark:border-zinc-800">
          <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-[#FF5200]/10 text-[#FF5200] flex items-center justify-center shadow-inner">
            <Droplet className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            No Fuel Logs Recorded Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-6">
            Log your vehicle's fill-ups to calculate live fuel efficiency (KM/L) and track cost per kilometer in BDT (৳).
          </p>
          <button
            onClick={onOpenAddFuel}
            className="px-6 py-3 rounded-full bg-[#FF5200] hover:bg-[#E04800] text-white font-bold text-xs tracking-wide shadow-lg shadow-[#FF5200]/30 transition inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Record First Fuel Fill-Up</span>
          </button>
        </div>
      )}

      {/* Floating Add Button (+) */}
      <button
        onClick={onOpenAddFuel}
        className="fixed bottom-20 right-6 z-40 w-14 h-14 rounded-full bg-[#FF5200] hover:bg-[#E04800] text-white flex items-center justify-center shadow-xl shadow-[#FF5200]/40 hover:scale-110 active:scale-95 transition-all duration-200"
        aria-label="Add Fuel Log"
        title="Log New Fuel Fill-Up"
      >
        <Plus className="w-7 h-7 stroke-[3]" />
      </button>

    </div>
  );
};
