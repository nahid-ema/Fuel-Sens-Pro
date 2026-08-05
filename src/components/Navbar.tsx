import React, { useState, useRef, useEffect } from 'react';
import { Fuel, Sun, Moon, MoreVertical, Calculator, User as UserIcon, LogOut, Download, Globe, Cloud, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { Language, translations } from '../lib/translations';

interface NavbarProps {
  user: User | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenTripCalculator: () => void;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  onInstallApp?: () => void;
  canInstall?: boolean;
  lang: Language;
  onToggleLanguage: () => void;
  syncStatus?: 'synced' | 'syncing' | 'offline' | 'error';
  onManualSync?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  darkMode,
  onToggleDarkMode,
  onOpenTripCalculator,
  onOpenAuthModal,
  onSignOut,
  onInstallApp,
  canInstall,
  lang,
  onToggleLanguage,
  syncStatus = 'synced',
  onManualSync
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // Close overflow menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 dark:bg-[#09090B]/85 border-b border-slate-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* App Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#FF5200]/30 transition-transform hover:scale-105 overflow-hidden bg-[#FF5200]">
            <img src="/logo.png" alt="Fuel Sens" className="w-full h-full object-cover bg-white" onError={(e) => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block'; }} />
            <Fuel className="w-5 h-5 stroke-[2.5]" style={{ display: 'none' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Fuel<span className="text-[#FF5200]">Sens</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">{t.appSubtitle}</p>
          </div>
        </div>

        {/* Right Section Actions & 3-Dot Overflow Menu */}
        <div className="flex items-center gap-2">

          {/* Prominent Direct Install App Button */}
          {onInstallApp && canInstall && (
            <button
              onClick={onInstallApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#FF5200] hover:bg-[#E04800] shadow-md shadow-[#FF5200]/20 transition active:scale-95"
              title="Install Fuel Sens as App"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">{t.installApp || 'Install App'}</span>
              <span className="sm:hidden">{lang === 'bn' ? 'ইনস্টল' : 'Install'}</span>
            </button>
          )}

          {/* 3-Dot Overflow Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 transition focus:outline-none"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Overflow Dropdown */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-zinc-800/60 mb-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {lang === 'bn' ? 'ফুয়েল সেন্স অপশনস' : 'Fuel Sens Options'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                    {user ? user.email : (lang === 'bn' ? 'লগইন করা নেই' : 'Not Logged In')}
                  </p>
                </div>

                {/* Install App Button */}
                {onInstallApp && canInstall && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onInstallApp();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#FF5200] hover:bg-[#E04800] shadow-sm transition mb-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t.installApp || 'Install App'}</span>
                  </button>
                )}

                {/* Force Cloud Sync Button in Menu */}
                {onManualSync && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onManualSync();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition mb-1"
                  >
                    <RefreshCw className="w-4 h-4 text-emerald-500" />
                    <span>{t.forceSync}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowMenu(false);
                    onOpenTripCalculator();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-zinc-200 hover:bg-[#FF5200]/10 hover:text-[#FF5200] transition"
                >
                  <Calculator className="w-4 h-4 text-[#FF5200]" />
                  <span>{t.calculator}</span>
                </button>

                {/* Language Switcher Button */}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onToggleLanguage();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-emerald-500" />
                    <span>{lang === 'en' ? 'ভাষা: বাংলা' : 'Language: English'}</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {lang === 'en' ? 'BN' : 'EN'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    onToggleDarkMode();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                >
                  <div className="flex items-center gap-3">
                    {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                    <span>{darkMode ? t.lightMode : t.darkMode}</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                    {darkMode ? 'Dark' : 'Light'}
                  </span>
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-zinc-800/60" />

                {/* Login Method & Account Option */}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onOpenAuthModal();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-zinc-100 hover:bg-[#FF5200]/10 hover:text-[#FF5200] transition"
                >
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-4 h-4 text-[#FF5200]" />
                    <span>{lang === 'bn' ? 'অ্যাকাউন্ট সাইন ইন' : 'Account & Sign In'}</span>
                  </div>
                </button>

                {user ? (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'সাইন আউট' : 'Sign Out'}</span>
                  </button>
                ) : null}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
