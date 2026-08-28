import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, AlertTriangle, Monitor, CheckCircle, Terminal, HelpCircle } from 'lucide-react';

export default function ExamInstructions({
  domain = 'Python',
  onAgreeAndStart,
  isLoading = false
}) {
  const [agreed, setAgreed] = useState(false);

  const handleStart = () => {
    if (!agreed) return;
    onAgreeAndStart();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl p-6 sm:p-8 backdrop-blur">
        {/* Title */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="h-14 w-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg shadow-indigo-600/10">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Assessment Integrity Rules
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Portal for Academia–Industry Collaboration • Target Domain:{' '}
              <span className="font-semibold text-indigo-400">{domain}</span>
            </p>
          </div>
        </div>

        {/* Core Notice */}
        <div className="mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-200 flex items-start gap-3">
          <Lock className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-1">AI-Resistant Secured Assessment Protocol</strong>
            This examination utilizes an anti-cheating environment to verify practical engineering competence. Copying, pasting code, tab switching, and external AI assistance are actively detected and restricted.
          </div>
        </div>

        {/* Rules Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="font-semibold text-sm text-white flex items-center gap-2">
              <Eye className="h-4 w-4 text-cyan-400" />
              <span>1. Tab & Window Focus (3 Strikes)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Navigating away, switching tabs, or losing window focus is strictly monitored. The 1st and 2nd violations issue warnings; the 3rd violation triggers automatic test submission.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="font-semibold text-sm text-white flex items-center gap-2">
              <Monitor className="h-4 w-4 text-emerald-400" />
              <span>2. Mandatory Fullscreen Mode</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The assessment must remain in full-screen mode throughout its duration. Exiting fullscreen prompts a re-entry requirement and is recorded in your session integrity log.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="font-semibold text-sm text-white flex items-center gap-2">
              <Terminal className="h-4 w-4 text-amber-400" />
              <span>3. Manual Code Typing</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clipboard paste functionality is disabled in the code editor. All solutions, algorithms, and explanations must be typed directly by the student.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="font-semibold text-sm text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <span>4. Keyboard Shortcuts Interception</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Developer tools shortcuts (F12, Ctrl+Shift+I), page source inspections, and context menus are intercepted and disabled across the application.
            </p>
          </div>
        </div>

        {/* Section Breakdown Summary */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950/40 border border-slate-800">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Assessment Structure (6 Multi-Format Sections)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="font-bold text-white">Aptitude</div>
              <div className="text-[10px] text-slate-400">10 Questions</div>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="font-bold text-white">Programming</div>
              <div className="text-[10px] text-slate-400">5 Problems</div>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="font-bold text-white">Debugging</div>
              <div className="text-[10px] text-slate-400">5 Bug Fixes</div>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="font-bold text-white">Tech MCQ</div>
              <div className="text-[10px] text-slate-400">10 Questions</div>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="font-bold text-white">Output Pred.</div>
              <div className="text-[10px] text-slate-400">5 Snippets</div>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="font-bold text-white">Concept</div>
              <div className="text-[10px] text-slate-400">4 Answers</div>
            </div>
          </div>
        </div>

        {/* Disclaimer on OS-level boundaries */}
        <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <HelpCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Security & Privacy Transparency:</strong> Browser-level controls enforce exam integrity. A personalized security watermark is placed on your session. The system evaluates genuine practical problem-solving ability.
          </span>
        </div>

        {/* Consent Checkbox */}
        <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <input
            id="integrity-agree"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <label htmlFor="integrity-agree" className="text-xs sm:text-sm text-slate-300 cursor-pointer select-none">
            I have read, understood, and agree to strictly abide by the Assessment Integrity Rules. I understand that tab switching, paste actions, and leaving fullscreen will be logged and may terminate my exam.
          </label>
        </div>

        {/* Start Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleStart}
            disabled={!agreed || isLoading}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
              agreed && !isLoading
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/30 cursor-pointer transform hover:-translate-y-0.5'
                : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <span>Initializing Secure Session...</span>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>[ I Agree & Start Assessment ]</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
