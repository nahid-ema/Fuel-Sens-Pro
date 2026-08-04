import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Zap, ShieldCheck, Loader2 } from 'lucide-react';
import { User } from '../types';
import { Language, translations } from '../lib/translations';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
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
  lang?: Language;
  canClose?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
  lang = 'en',
  canClose = true
}) => {
  const t = translations[lang];
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
      setError(lang === 'bn' ? 'অনুগ্রহ করে সকল তথ্য প্রদান করুন।' : 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const trimmedEmail = email.trim().toLowerCase();
    const displayName = name.trim() || trimmedEmail.split('@')[0] || 'Rider';

    try {
      let userCred;
      if (mode === 'signup') {
        try {
          userCred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        } catch (e: any) {
          if (e?.code === 'auth/email-already-in-use') {
            userCred = await signInWithEmailAndPassword(auth, trimmedEmail, password);
          } else {
            throw e;
          }
        }

        if (userCred?.user) {
          await updateProfile(userCred.user, { displayName }).catch(() => {});
          await setDoc(doc(db, 'users', userCred.user.uid), {
            uid: userCred.user.uid,
            email: userCred.user.email,
            name: displayName,
            createdAt: serverTimestamp()
          }).catch(() => {});
        }
      } else {
        // Mode: Login
        try {
          userCred = await signInWithEmailAndPassword(auth, trimmedEmail, password);
        } catch (e: any) {
          if (e?.code === 'auth/user-not-found' || e?.code === 'auth/invalid-credential') {
            // Auto register if user doesn't exist
            userCred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
            if (userCred?.user) {
              await updateProfile(userCred.user, { displayName }).catch(() => {});
              await setDoc(doc(db, 'users', userCred.user.uid), {
                uid: userCred.user.uid,
                email: userCred.user.email,
                name: displayName,
                createdAt: serverTimestamp()
              }).catch(() => {});
            }
          } else {
            throw e;
          }
        }
      }

      if (userCred?.user) {
        onAuthenticate({
          email: userCred.user.email || trimmedEmail,
          name: userCred.user.displayName || displayName,
          isGuest: false,
          uid: userCred.user.uid
        });
        onClose();
      } else {
        throw new Error('Authentication failed. Please try again.');
      }
    } catch (err: any) {
      let msg = err?.message || 'Authentication error occurred.';
      if (err?.code === 'auth/wrong-password') {
        msg = lang === 'bn' ? 'ভুল পাসওয়ার্ড। আবার চেষ্টা করুন।' : 'Incorrect password. Please try again.';
      } else if (err?.code === 'auth/weak-password') {
        msg = lang === 'bn' ? 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।' : 'Password should be at least 6 characters.';
      } else if (err?.code === 'auth/operation-not-allowed') {
        msg = lang === 'bn' ? 'লগইন মাধ্যমটি ফায়ারবেস কনসোলে বন্ধ আছে। দয়া করে ফায়ারবেস Authentication থেকে এটি চালু করুন।' : 'This sign-in method is not enabled. Please enable it in the Firebase Console (Authentication > Sign-in method).';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      if (userCred?.user) {
        onAuthenticate({
          email: userCred.user.email || 'user@google.com',
          name: userCred.user.displayName || 'Google User',
          isGuest: false,
          uid: userCred.user.uid
        });
        onClose();
      }
    } catch (err: any) {
      let msg = err?.message || 'Authentication error occurred.';
      if (err?.code === 'auth/operation-not-allowed') {
        msg = lang === 'bn' ? 'গুগল লগইন ফায়ারবেস কনসোলে বন্ধ আছে। দয়া করে ফায়ারবেস Authentication থেকে Google Sign-in চালু করুন।' : 'Google Sign-in is not enabled. Please enable it in the Firebase Console.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md m3-card bg-white dark:bg-[#121214] p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white">
        
        {/* Close Button */}
        {canClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#FF5200] flex items-center justify-center text-white shadow-lg shadow-[#FF5200]/30">
            <Zap className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            {t.welcomeTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            {t.authDesc}
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
            {lang === 'bn' ? 'সাইন ইন' : 'Sign In'}
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
            {lang === 'bn' ? 'নতুন অ্যাকাউন্ট' : 'Create Account'}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold leading-relaxed">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                {t.fullName}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-zinc-500" />
                <input
                  type="text"
                  placeholder={lang === 'bn' ? 'নাহিদ ফেরদৌস ইমন' : 'Nahid Ferdous Emon'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5200]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
              {t.email}
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
              {t.password}
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
                <span>{mode === 'login' ? t.signInBtn : t.signUpBtn}</span>
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
              {lang === 'bn' ? 'অথবা সরাসরি অপশন' : 'Or Quick Access'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-slate-50 dark:bg-zinc-800/60 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-bold text-xs transition flex items-center justify-center gap-2 border border-slate-200 dark:border-zinc-700 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{lang === 'bn' ? 'গুগল দিয়ে সাইন ইন' : 'Sign in with Google'}</span>
          </button>


        </div>

      </div>
    </div>
  );
};


