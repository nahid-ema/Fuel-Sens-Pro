import React, { useState, useRef, useEffect } from 'react';
import { Fuel, Sun, Moon, MoreVertical, Calculator, User as UserIcon, LogOut, Flame, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenTripCalculator: () => void;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  darkMode,
  onToggleDarkMode,
  onOpenTripCalculator,
  onOpenAuthModal,
  onSignOut
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
          <div className="w-10 h-10 rounded-2xl bg-[#FF5200] flex items-center justify-center text-white shadow-lg shadow-[#FF5200]/30 transition-transform hover:scale-105">
            <Fuel className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Fuel<span className="text-[#FF5200]">Flow</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF5200]/10 text-[#FF5200] border border-[#FF5200]/20 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-[#FF5200]" /> 91 OCTANE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">Vehicle & Fuel Tracker</p>
          </div>
        </div>

        {/* Right Section Actions & 3-Dot Overflow Menu */}
        <div className="flex items-center gap-2">
          
          {/* Quick User Badge */}
          {user ? (
            <button
              onClick={onOpenAuthModal}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800/80 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200 transition"
              title="Click to switch user or edit profile"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#FF5200]" />
              <span className="max-w-[120px] truncate">{user.isGuest ? 'Guest Mode' : user.email}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 rounded-full bg-[#FF5200] text-white text-xs font-semibold shadow-md hover:bg-[#E04800] transition"
            >
              Sign In
            </button>
          )}

          {/* Direct Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 transition"
            aria-label="Toggle dark/light theme"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

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
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Fuel Flow Options</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                    {user ? (user.isGuest ? 'Guest Session' : user.email) : 'Not Logged In'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    onOpenTripCalculator();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-zinc-200 hover:bg-[#FF5200]/10 hover:text-[#FF5200] transition"
                >
                  <Calculator className="w-4 h-4 text-[#FF5200]" />
                  <span>Trip & Fuel Calculator</span>
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
                    <span>{darkMode ? 'Switch to Light' : 'Switch to Dark'}</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                    {darkMode ? 'Dark' : 'Light'}
                  </span>
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-zinc-800/60" />

                {user ? (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{user.isGuest ? 'Exit Guest Mode' : 'Sign Out'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenAuthModal();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[#FF5200] hover:bg-[#FF5200]/10 transition"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Login or Register</span>
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
