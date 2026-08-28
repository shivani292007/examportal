import React from 'react';
import { AlertTriangle, ShieldAlert, Maximize2, XCircle, CheckCircle } from 'lucide-react';

export default function ViolationModal({
  isOpen,
  title,
  message,
  severity,
  onClose,
  onEnterFullscreen
}) {
  if (!isOpen) return null;

  const isTerminated = severity === 'terminated';
  const isFullscreenPrompt = severity === 'fullscreen';
  const isSevere = severity === 'severe';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl transition-all ${
          isTerminated
            ? 'bg-rose-950/95 border-rose-600 text-rose-50'
            : isSevere
            ? 'bg-slate-900 border-amber-500 text-slate-100'
            : isFullscreenPrompt
            ? 'bg-slate-900 border-indigo-500 text-slate-100'
            : 'bg-slate-900 border-amber-600/70 text-slate-100'
        }`}
      >
        {/* Modal Icon Header */}
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl flex items-center justify-center ${
              isTerminated
                ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                : isSevere
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : isFullscreenPrompt
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {isTerminated ? (
              <XCircle className="h-8 w-8" />
            ) : isFullscreenPrompt ? (
              <Maximize2 className="h-8 w-8" />
            ) : (
              <AlertTriangle className="h-8 w-8" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold tracking-tight text-white mb-1.5">
              {title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Warning Policy Box */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <span>Anti-Cheating Policy Enforcement</span>
          </div>
          <p>
            • Tab switches, window blurring, and exiting fullscreen are recorded in the server-side integrity log.
          </p>
          <p>
            • Accumulating 3 integrity strikes triggers automatic examination submission.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          {isFullscreenPrompt ? (
            <button
              onClick={onEnterFullscreen}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Maximize2 className="h-4 w-4" />
              <span>Resume Fullscreen Mode</span>
            </button>
          ) : isTerminated ? (
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all"
            >
              View Assessment Results
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-all"
            >
              I Understand & Acknowledge
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
