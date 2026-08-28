import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export default function ExamTimer({
  formattedTime,
  urgency,
  currentSection,
  currentQuestionIndex,
  totalQuestionsInSection
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            urgency === 'critical'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
              : urgency === 'warning'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-indigo-500/20 text-cyan-400 border border-indigo-500/30'
          }`}
        >
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
            Assessment Time Remaining
          </span>
          <span
            className={`font-mono text-xl font-bold tracking-tight ${
              urgency === 'critical'
                ? 'text-rose-400'
                : urgency === 'warning'
                ? 'text-amber-300'
                : 'text-white'
            }`}
          >
            {formattedTime}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono">
        <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
          <span className="text-slate-500">Section: </span>
          <span className="font-semibold text-indigo-400 capitalize">
            {currentSection ? currentSection.replace('_', ' ') : 'Aptitude'}
          </span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
          <span className="text-slate-500">Question: </span>
          <span className="font-semibold text-cyan-300">
            {currentQuestionIndex + 1} / {totalQuestionsInSection}
          </span>
        </div>
      </div>
    </div>
  );
}
