import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Zap, ShieldCheck, Loader2 } from 'lucide-react';
import { User } from '../types';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
  db,
  doc,
  setDoc,
  serverTimestamp
} from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const displayName = name.trim() || email.split('@')[0];
        if (userCred.user) {
          await updateProfile(userCred.user, { displayName });
          // Create profile record in firestore
          await setDoc(doc(db, 'users', userCred.user.uid), {
            uid: userCred.user.uid,
            email: userCred.user.email,
            name: displayName,
            createdAt: serverTimestamp()
          });
        }
        onAuthenticate({
          email: userCred.user.email || email.trim(),
          name: displayName,
          isGuest: false,
          uid: userCred.user.uid
        });
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
        onAuthenticate({
          email: userCred.user.email || email.trim(),
          name: userCred.user.displayName || email.split('@')[0],
          isGuest: false,
          uid: userCred.user.uid
        });
      }
      onClose();
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      let msg = err?.message || 'Authentication failed. Please check your credentials.';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found')) {
        msg = 'Invalid email or password. Please check and try again.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'An account with this email already exists. Please sign in instead.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Password should be at least 6 characters.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setError('');
    setLoading(true);
    try {
      const userCred = await signInAnonymously(auth);
      onAuthenticate({
        email: 'guest@fuelflow.app',
        name: 'Guest Driver',
        isGuest: true,
        uid: userCred.user.uid
      });
      onClose();
    } catch (err: any) {
      console.error('Anonymous auth error:', err);
      // Fallback guest user if anonymous auth disabled
      onAuthenticate({
        email: 'guest@fuelflow.app',
        name: 'Guest Driver',
        isGuest: true
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md m3-card bg-white dark:bg-[#121214] p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#FF5200] flex items-center justify-center text-white shadow-lg shadow-[#FF5200]/30">
            <Zap className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Welcome to <span className="text-[#FF5200]">Fuel Flow</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Track fuel efficiency, mileage, and maintenance logs synced live on Firebase.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              mode === 'login'
                ? 'bg-white dark:bg-[#1C1C20] text-[#FF5200] shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              mode === 'signup'
                ? 'bg-white dark:bg-[#1C1C20] text-[#FF5200] shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-zinc-500" />
                <input
                  type="text"
                  placeholder="Nahid Ferdous Emon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-zinc-500" />
              <input
                type="email"
                placeholder="driver@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-zinc-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#FF5200] hover:bg-[#E04800] text-white font-bold text-xs tracking-wide shadow-lg shadow-[#FF5200]/30 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Account' : 'Create Fuel Flow Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
            <span className="bg-white dark:bg-[#121214] px-3 text-slate-400 dark:text-zinc-500">
              Or Try Immediately
            </span>
          </div>
        </div>

        {/* One-Tap Guest Access */}
        <button
          type="button"
          onClick={handleGuestAccess}
          disabled={loading}
          className="w-full py-3 rounded-full bg-slate-100 dark:bg-zinc-800/90 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-100 font-bold text-xs transition flex items-center justify-center gap-2 border border-slate-200 dark:border-zinc-700 disabled:opacity-50"
        >
          <ShieldCheck className="w-4 h-4 text-[#FF5200]" />
          <span>Proceed as Guest (Online Sync Mode)</span>
        </button>

      </div>
    </div>
  );
};

