import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export default function MCQQuestion({
  options = [],
  selectedOption,
  onSelectOption
}) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        Select the Most Accurate Option:
      </div>

      <div className="grid grid-cols-1 gap-3">
        {options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          const letter = letters[idx] || `${idx + 1}`;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectOption(opt)}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 cursor-pointer no-select ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90 text-slate-300'
              }`}
            >
              <div
                className={`h-7 w-7 rounded-lg shrink-0 font-mono font-bold text-xs flex items-center justify-center border transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {letter}
              </div>

              <div className="flex-1 text-sm pt-0.5 leading-relaxed">
                {opt}
              </div>

              <div className="shrink-0 pt-0.5">
                {isSelected ? (
                  <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
