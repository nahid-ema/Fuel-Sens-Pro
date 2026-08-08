import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Smartphone, Monitor, CheckCircle, ExternalLink } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerInstall?: () => void;
  hasNativePrompt?: boolean;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  onTriggerInstall,
  hasNativePrompt
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto"
          >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <img 
            src="/icon.svg" 
            alt="Fuel Flow Logo" 
            className="w-12 h-12 rounded-2xl object-contain shadow-lg shadow-[#0F3854]/20" 
            referrerPolicy="no-referrer"
          />
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">Install Fuel Flow</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Chrome Progressive Web Application (PWA)</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-zinc-300 mb-5 leading-relaxed">
          Install Fuel Flow directly on your desktop or phone to use it like a native app with offline access, quick launch from home screen, and fast performance.
        </p>

        {/* Action Button if Native Prompt Available */}
        {hasNativePrompt && (
          <button
            onClick={() => {
              if (onTriggerInstall) onTriggerInstall();
              onClose();
            }}
            className="w-full mb-5 py-3 rounded-2xl bg-[#FF5200] hover:bg-[#E04800] text-white font-bold text-xs tracking-wide shadow-lg shadow-[#FF5200]/30 transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Click to Install Instantly</span>
          </button>
        )}

        {/* Step-by-Step Instructions */}
        <div className="space-y-4 text-xs">
          
          {/* Desktop Chrome Instructions */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
              <Monitor className="w-4 h-4 text-[#FF5200]" />
              <span>Google Chrome Desktop:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-zinc-400 text-[11px] leading-normal">
              <li>Look at the right end of the Chrome address bar (URL bar).</li>
              <li>Click the <strong className="text-slate-800 dark:text-zinc-200">Install icon</strong> (a monitor or plus symbol).</li>
              <li>Or click Chrome Menu (<strong className="text-slate-800 dark:text-zinc-200">⋮</strong>) ➔ <strong className="text-slate-800 dark:text-zinc-200">Save and share</strong> ➔ <strong className="text-[#FF5200]">Install Fuel Flow</strong>.</li>
            </ol>
          </div>

          {/* Android / Mobile Chrome Instructions */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
              <Smartphone className="w-4 h-4 text-[#FF5200]" />
              <span>Mobile Chrome (Android / iOS):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-zinc-400 text-[11px] leading-normal">
              <li>Tap the <strong className="text-slate-800 dark:text-zinc-200">three dots menu (⋮)</strong> in top right corner.</li>
              <li>Select <strong className="text-[#FF5200]">"Add to Home screen"</strong> or <strong className="text-[#FF5200]">"Install app"</strong>.</li>
              <li>Confirm and Fuel Flow will appear on your home screen!</li>
            </ol>
          </div>

        </div>

        {/* Open in New Tab prompt if inside preview iframe */}
        <div className="mt-5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong>Tip for AI Studio Preview:</strong> Chrome PWA installation works best when you open the app in a standalone tab.
            <a
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 font-bold text-[#FF5200] hover:underline flex items-center gap-1"
            >
              <span>Open App in New Tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Close Modal Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold text-xs transition"
        >
          Got It
        </button>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
