import React, { useState } from 'react';
import { X, Download, Smartphone, Monitor, AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';

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
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Detect if inside an iframe
  const isIframe = window.self !== window.top;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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
            <h2 className="text-lg font-extrabold tracking-tight">Install Fuel Sens App</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Standalone Web App (PWA)</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-zinc-300 mb-4 leading-relaxed">
          Install <strong>Fuel Sens</strong> directly on your mobile home screen to run it as a fast, full-screen native app with offline access and instant loading.
        </p>

        {/* Notice for iframe / AI Studio preview */}
        {isIframe && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="font-bold">
                Preview Window Restriction:
              </div>
            </div>
            <p className="text-[11px] leading-relaxed mb-3 text-slate-700 dark:text-zinc-300">
              Web browsers block app installation inside embedded preview frames. To install <strong>Fuel Sens</strong> on your phone or PC, open the app link directly in a new browser tab.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#FF5200] hover:bg-[#E04800] text-white font-bold text-[11px] shadow-md transition flex items-center justify-center gap-1.5"
              >
                <span>Open in Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-bold text-[11px] transition flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>
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
            <span>Click to Install App Instantly</span>
          </button>
        )}

        {/* Step-by-Step Instructions */}
        <div className="space-y-3.5 text-xs">
          
          {/* Android Chrome Instructions */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
              <Smartphone className="w-4 h-4 text-[#FF5200]" />
              <span>Android (Google Chrome / Mobile Browser):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-zinc-400 text-[11px] leading-normal">
              <li>Open the link in Google Chrome on your phone.</li>
              <li>Tap the <strong className="text-slate-900 dark:text-zinc-100">Three Dots Menu (⋮)</strong> in top right.</li>
              <li>Tap <strong className="text-[#FF5200]">"Install app"</strong> or <strong className="text-[#FF5200]">"Add to Home screen"</strong>.</li>
              <li>Fuel Sens will now appear on your phone home screen like a native app!</li>
            </ol>
          </div>

          {/* iPhone Safari Instructions */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
              <Smartphone className="w-4 h-4 text-[#FF5200]" />
              <span>iPhone / iPad (iOS Safari):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-zinc-400 text-[11px] leading-normal">
              <li>Open the app URL in Safari browser.</li>
              <li>Tap the <strong className="text-[#FF5200]">Share button</strong> (square with arrow pointing up).</li>
              <li>Scroll down and tap <strong className="text-slate-900 dark:text-zinc-100">"Add to Home Screen"</strong>.</li>
              <li>Tap <strong className="text-[#FF5200]">"Add"</strong> in top right.</li>
            </ol>
          </div>

          {/* Desktop Instructions */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
              <Monitor className="w-4 h-4 text-[#FF5200]" />
              <span>Desktop PC (Chrome / Edge / Brave):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-zinc-400 text-[11px] leading-normal">
              <li>Click the <strong className="text-slate-900 dark:text-zinc-100">Install icon (⊕)</strong> at the right side of address bar.</li>
              <li>Or click Chrome Menu (<strong className="text-slate-900 dark:text-zinc-100">⋮</strong>) ➔ <strong className="text-slate-900 dark:text-zinc-100">Save and share</strong> ➔ <strong className="text-[#FF5200]">Install Fuel Sens</strong>.</li>
            </ol>
          </div>

        </div>

        {/* Copy Link helper if not in iframe */}
        {!isIframe && (
          <div className="mt-4 flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs">
            <span className="text-[11px] text-slate-500 dark:text-zinc-400 truncate max-w-[200px]">
              {window.location.href}
            </span>
            <button
              onClick={handleCopyLink}
              className="py-1.5 px-3 rounded-xl bg-[#FF5200] hover:bg-[#E04800] text-white font-bold text-[11px] transition flex items-center gap-1 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        )}

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


