import React from 'react';
import { X, Download, Smartphone, Monitor, AlertCircle, ExternalLink } from 'lucide-react';

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
  if (!isOpen) return null;

  // Detect if inside an iframe
  const isIframe = window.self !== window.top;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5200] flex items-center justify-center text-white shadow-lg shadow-[#FF5200]/30">
            <Download className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">Install Fuel Sens</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Progressive Web Application (PWA)</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-zinc-300 mb-5 leading-relaxed">
          Install Fuel Sens directly on your mobile device or computer to run it as a standalone app with offline support, full screen mode, and fast access from your home screen.
        </p>

        {/* Notice for iframe / AI Studio preview */}
        {isIframe && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="font-bold">
                App Installation Notice:
              </div>
            </div>
            <p className="text-[11px] leading-relaxed mb-3">
              Browsers block standalone app installation inside embedded preview windows (iframes). To install <strong>Fuel Sens</strong> as a standalone app on your device, open it directly in a browser tab first.
            </p>
            <a
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-[#FF5200] hover:bg-[#E04800] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Open in Direct Browser Tab</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

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
            <span>Install App Now</span>
          </button>
        )}

        {/* Step-by-Step Instructions */}
        <div className="space-y-3.5 text-xs">
          
          {/* Mobile Chrome Instructions */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
              <Smartphone className="w-4 h-4 text-[#FF5200]" />
              <span>Android Chrome / Mobile Browsers:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-zinc-400 text-[11px] leading-normal">
              <li>Open the app URL directly in Google Chrome.</li>
              <li>Tap the <strong className="text-slate-800 dark:text-zinc-200">three dots (⋮)</strong> in top right.</li>
              <li>Select <strong className="text-[#FF5200]">"Install app"</strong> or <strong className="text-[#FF5200]">"Add to Home screen"</strong>.</li>
              <li>Confirm install to get the full native app experience.</li>
            </ol>
          </div>

          {/* iPhone Safari Instructions */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
              <Smartphone className="w-4 h-4 text-[#FF5200]" />
              <span>iPhone / iOS Safari:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-zinc-400 text-[11px] leading-normal">
              <li>Open the app link in Safari browser.</li>
              <li>Tap the <strong className="text-[#FF5200]">Share button</strong> (square with arrow up).</li>
              <li>Scroll down and tap <strong className="text-slate-800 dark:text-zinc-200">"Add to Home Screen"</strong>.</li>
            </ol>
          </div>

          {/* Desktop Instructions */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
              <Monitor className="w-4 h-4 text-[#FF5200]" />
              <span>Google Chrome Desktop:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-zinc-400 text-[11px] leading-normal">
              <li>Click the <strong className="text-slate-800 dark:text-zinc-200">Install icon</strong> in Chrome address bar.</li>
              <li>Or click Chrome Menu (<strong className="text-slate-800 dark:text-zinc-200">⋮</strong>) ➔ <strong className="text-slate-800 dark:text-zinc-200">Save and share</strong> ➔ <strong className="text-[#FF5200]">Install Fuel Sens</strong>.</li>
            </ol>
          </div>

        </div>

        {/* Close Modal Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold text-xs transition"
        >
          Got It
        </button>

      </div>
    </div>
  );
};

