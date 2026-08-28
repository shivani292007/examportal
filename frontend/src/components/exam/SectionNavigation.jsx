import React from 'react';
import { CheckCircle2, Circle, Code2, Bug, Brain, ListCheck, HelpCircle, Terminal } from 'lucide-react';

const SECTION_CONFIG = [
  { key: 'aptitude', name: 'Aptitude', icon: Brain },
  { key: 'programming', name: 'Programming', icon: Code2 },
  { key: 'debugging', name: 'Debugging', icon: Bug },
  { key: 'technical_mcq', name: 'Technical MCQ', icon: ListCheck },
  { key: 'output_prediction', name: 'Output Pred.', icon: Terminal },
  { key: 'short_answer', name: 'Concept', icon: HelpCircle },
];

export default function SectionNavigation({
  sections = {},
  currentSectionKey = 'aptitude',
  currentQuestionIndex = 0,
  savedAnswers = {},
  onSelectSection,
  onSelectQuestion
}) {
  const currentQuestions = sections[currentSectionKey] || [];

  return (
    <div className="space-y-4">
      {/* Section Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {SECTION_CONFIG.map((sec) => {
          const Icon = sec.icon;
          const isCurrent = currentSectionKey === sec.key;
          const qList = sections[sec.key] || [];
          
          // Count answered questions in this section
          const answeredCount = qList.filter(q => {
            const ans = savedAnswers[q.id];
            if (!ans) return false;
            return !!(ans.selected_option || ans.code_submission?.trim() || ans.text_response?.trim());
          }).length;

          const allAnswered = qList.length > 0 && answeredCount === qList.length;

          return (
            <button
              key={sec.key}
              type="button"
              onClick={() => onSelectSection(sec.key)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                isCurrent
                  ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`h-4 w-4 ${isCurrent ? 'text-indigo-400' : 'text-slate-500'}`} />
                {allAnswered ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">
                    {answeredCount}/{qList.length}
                  </span>
                )}
              </div>
              <div>
                <div className={`text-xs font-bold leading-tight ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                  {sec.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {qList.length} Qs
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Question Palette for Current Section */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-slate-300">
            Question Palette — <span className="text-indigo-400 capitalize">{currentSectionKey.replace('_', ' ')}</span>
          </span>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Answered
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> Current
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-700" /> Unanswered
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentQuestions.map((q, idx) => {
            const isCurrent = idx === currentQuestionIndex;
            const ans = savedAnswers[q.id];
            const isAnswered = !!(ans?.selected_option || ans?.code_submission?.trim() || ans?.text_response?.trim());

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelectQuestion(idx)}
                className={`h-9 w-9 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center border ${
                  isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 scale-105'
                    : isAnswered
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
