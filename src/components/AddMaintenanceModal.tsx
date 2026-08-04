import React, { useState } from 'react';
import { X, Wrench, Calendar, Gauge, DollarSign, FileText, Tag } from 'lucide-react';
import { MaintenanceLog } from '../types';
import { Language, translations } from '../lib/translations';

interface AddMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLog: (log: Omit<MaintenanceLog, 'id'>) => void;
  latestOdometer?: number;
  lang?: Language;
}

export const AddMaintenanceModal: React.FC<AddMaintenanceModalProps> = ({
  isOpen,
  onClose,
  onAddLog,
  latestOdometer = 0,
  lang = 'en'
}) => {
  const t = translations[lang];
  const [serviceTitle, setServiceTitle] = useState('');
  const [category, setCategory] = useState<MaintenanceLog['category']>('Master Service');
  const [totalCost, setTotalCost] = useState('');
  const [odometerKm, setOdometerKm] = useState(latestOdometer > 0 ? latestOdometer.toString() : '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const categories: MaintenanceLog['category'][] = [
    'Master Service',
    'Engine Oil',
    'Brake Service',
    'Tires',
    'Transmission',
    'General Service',
    'Other'
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle.trim()) {
      setError('Please provide a service title.');
      return;
    }
    const cost = parseFloat(totalCost);
    const odo = parseFloat(odometerKm);

    if (isNaN(cost) || cost < 0) {
      setError('Please enter a valid cost in BDT (৳).');
      return;
    }
    if (isNaN(odo) || odo <= 0) {
      setError('Please enter a valid odometer mileage.');
      return;
    }

    onAddLog({
      serviceTitle: serviceTitle.trim(),
      category,
      totalCost: cost,
      odometerKm: odo,
      date: date || new Date().toISOString().split('T')[0],
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
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">{t.addMaintTitle}</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">{t.addMaintDesc}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Service Title */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Service Title
            </label>
            <input
              type="text"
              placeholder="e.g. Synthetic Oil & Filter Change"
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Service Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Cost & Odometer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Total Cost (BDT ৳)
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="5500"
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">৳</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Odometer Reading (KM)
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="42500"
                  value={odometerKm}
                  onChange={(e) => setOdometerKm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">KM</span>
              </div>
            </div>
          </div>

          {/* Date & Notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Service Date
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
              Service Notes & Details (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Replaced oil filter, checked tire pressure, flushed brake fluid..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#FF5200] hover:bg-[#E04800] text-white font-bold text-xs tracking-wide shadow-lg shadow-[#FF5200]/30 transition flex items-center justify-center gap-2 mt-2"
          >
            <Wrench className="w-4 h-4" />
            <span>Save Service Record</span>
          </button>

        </form>

      </div>
    </div>
  );
};
