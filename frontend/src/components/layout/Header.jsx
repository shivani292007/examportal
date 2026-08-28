import React from 'react';
import { ShieldCheck, ShieldAlert, Clock, Maximize2, User, BookOpen, AlertTriangle } from 'lucide-react';

export default function Header({
  student,
  examSession,
  formattedTime,
  urgency,
  strikeCount,
  violationsCount,
  isFullscreen,
  onEnterFullscreen,
  onOpenIntegrityLog
}) {
  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Portal Branding */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-base sm:text-lg">
                Academia–Industry Portal
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Secure Exam Module
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              AI-Resistant Skill Assessment & Placement Engine
            </p>
          </div>
        </div>

        {/* Dynamic Exam Bar (When session is active) */}
        {examSession && (
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Timer Widget */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono text-sm font-semibold transition-all ${
                urgency === 'critical'
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 animate-pulse'
                  : urgency === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700 text-cyan-300'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>{formattedTime}</span>
            </div>

            {/* Integrity Status Pill */}
            <button
              onClick={onOpenIntegrityLog}
              title="Click to view integrity activity log"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:scale-105 ${
                strikeCount >= 2
                  ? 'bg-rose-950/60 border-rose-600 text-rose-300'
                  : strikeCount === 1
                  ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                  : 'bg-emerald-950/40 border-emerald-700/50 text-emerald-400'
              }`}
            >
              {strikeCount > 0 ? (
                <ShieldAlert className="h-3.5 w-3.5 animate-bounce" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              )}
              <span>
                {strikeCount > 0
                  ? `Integrity: ${strikeCount}/3 Strikes`
                  : 'Integrity: Clean'}
              </span>
              {violationsCount > 0 && (
                <span className="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full text-[10px]">
                  {violationsCount} events
                </span>
              )}
            </button>

            {/* Fullscreen Button if exited */}
            {!isFullscreen && (
              <button
                onClick={onEnterFullscreen}
                className="hidden sm:flex items-center gap-1.5 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Re-enter Fullscreen</span>
              </button>
            )}
          </div>
        )}

        {/* Student Profile Info */}
        {student && (
          <div className="flex items-center gap-2.5 bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-1.5">
            <div className="h-7 w-7 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300">
              {student.name ? student.name[0].toUpperCase() : 'S'}
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight">
                {student.name}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {student.college || student.target_domain}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
