import React, { useState } from 'react';
import { MaintenanceLog } from '../types';
import {
  Wrench,
  Plus,
  Trash2,
  Calendar,
  Gauge,
  Tag,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface MaintenanceViewProps {
  logs: MaintenanceLog[];
  onOpenAddMaintenance: () => void;
  onDeleteLog: (id: string) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  logs,
  onOpenAddMaintenance,
  onDeleteLog
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categories = ['All', 'Engine Oil', 'Brake Service', 'General Service', 'Tires', 'Other'];

  const filteredLogs = logs.filter((log) => {
    const matchesCategory = selectedCategory === 'All' || log.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      log.serviceTitle.toLowerCase().includes(term) ||
      (log.notes && log.notes.toLowerCase().includes(term)) ||
      log.date.includes(term);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-200">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-[#FF5200]" />
            Maintenance & Service Logs
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Keep track of oil changes, brake pads, tire rotations, and repair costs in BDT (৳).
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search service logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200] transition"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#FF5200] text-white shadow-md shadow-[#FF5200]/30'
                  : 'bg-white dark:bg-[#121214] text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 hover:border-[#FF5200]/40'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Service Log Cards */}
      {filteredLogs.length > 0 ? (
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="m3-card p-5 hover:border-[#FF5200]/40 transition group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#FF5200]/10 text-[#FF5200] flex items-center justify-center shrink-0 mt-0.5">
                    <Wrench className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {log.serviceTitle}
                      </h3>
                      {log.category && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-700/80">
                          {log.category}
                        </span>
                      )}
                    </div>

                    {/* Metadata Row */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-zinc-400 mt-2 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {log.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Gauge className="w-3.5 h-3.5 text-slate-400" />
                        {log.odometerKm.toLocaleString()} KM
                      </span>
                    </div>

                    {/* Description / Notes */}
                    {log.notes && (
                      <p className="text-xs text-slate-600 dark:text-zinc-300 mt-2.5 bg-slate-50 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800/80">
                        {log.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Cost & Actions */}
                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    ৳ {log.totalCost.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">BDT</p>

                  <div className="mt-3">
                    {deletingId === log.id ? (
                      <div className="flex items-center justify-end gap-1">
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
                        title="Delete maintenance entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="m3-card p-12 text-center border-dashed border-2 border-slate-200 dark:border-zinc-800">
          <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-[#FF5200]/10 text-[#FF5200] flex items-center justify-center shadow-inner">
            <Wrench className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            No Maintenance Services Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-6">
            Keep your vehicle running smoothly by logging oil changes, brake repairs, engine checkups, and parts replacement.
          </p>
          <button
            onClick={onOpenAddMaintenance}
            className="px-6 py-3 rounded-full bg-[#FF5200] hover:bg-[#E04800] text-white font-bold text-xs tracking-wide shadow-lg shadow-[#FF5200]/30 transition inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Record First Service Entry</span>
          </button>
        </div>
      )}

      {/* Floating Add Button (+) */}
      <button
        onClick={onOpenAddMaintenance}
        className="fixed bottom-20 right-6 z-40 w-14 h-14 rounded-full bg-[#FF5200] hover:bg-[#E04800] text-white flex items-center justify-center shadow-xl shadow-[#FF5200]/40 hover:scale-110 active:scale-95 transition-all duration-200"
        aria-label="Add Maintenance Log"
        title="Log New Service / Repair"
      >
        <Plus className="w-7 h-7 stroke-[3]" />
      </button>

    </div>
  );
};
