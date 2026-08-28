import React from 'react';
import MCQQuestion from './MCQQuestion';
import { Terminal, Code } from 'lucide-react';

export default function OutputPredictionQuestion({
  options = [],
  selectedOption,
  onSelectOption
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
        <Terminal className="h-4 w-4" />
        <span>Analyze the program logic and select the precise runtime output:</span>
      </div>

      <MCQQuestion
        options={options}
        selectedOption={selectedOption}
        onSelectOption={onSelectOption}
      />
    </div>
  );
}
