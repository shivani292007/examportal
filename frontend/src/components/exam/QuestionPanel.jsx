import React from 'react';
import { Award, Tag, BookOpen, Layers } from 'lucide-react';

export default function QuestionPanel({
  question,
  questionNumber,
  children
}) {
  if (!question) {
    return (
      <div className="p-8 text-center text-slate-500 rounded-2xl border border-slate-800 bg-slate-900/60">
        No question selected.
      </div>
    );
  }

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'hard':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden backdrop-blur">
      {/* Question Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-mono font-bold text-sm flex items-center justify-center">
            Q{questionNumber}
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight no-select">
              {question.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Tag className="h-3 w-3 text-slate-500" />
                <span>{question.topic}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] font-mono text-indigo-300 flex items-center gap-1">
                <Layers className="h-3 w-3 text-indigo-400" />
                <span>Skill: {question.skill_tag}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty || 'Medium'}
          </span>
          <span className="text-xs px-3 py-1 rounded-full font-mono font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center gap-1">
            <Award className="h-3.5 w-3.5" />
            <span>{question.marks} Marks</span>
          </span>
        </div>
      </div>

      {/* Question Statement / Description (Protected with no-select) */}
      <div className="p-6 space-y-6">
        <div className="no-select text-slate-200 text-sm sm:text-base leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800 whitespace-pre-line">
          {question.description}
        </div>

        {/* Specialized Interactive Area */}
        <div>{children}</div>
      </div>
    </div>
  );
}
