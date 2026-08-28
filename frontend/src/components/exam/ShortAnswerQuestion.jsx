import React, { useState } from 'react';
import { PenTool, ShieldAlert, AlertCircle, Check } from 'lucide-react';

export default function ShortAnswerQuestion({
  textResponse = '',
  onChangeText,
  onPasteBlocked
}) {
  const [pasteWarning, setPasteWarning] = useState(false);

  const wordCount = textResponse.trim() ? textResponse.trim().split(/\s+/).length : 0;
  const charCount = textResponse.length;

  const handlePaste = (e) => {
    e.preventDefault();
    setPasteWarning(true);
    if (onPasteBlocked) {
      onPasteBlocked('paste_attempt');
    }
    setTimeout(() => setPasteWarning(false), 4000);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      setPasteWarning(true);
      if (onPasteBlocked) {
        onPasteBlocked('paste_attempt');
      }
      setTimeout(() => setPasteWarning(false), 4000);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 font-semibold text-slate-300">
          <PenTool className="h-4 w-4 text-indigo-400" />
          <span>Type Your Technical Explanation:</span>
        </div>
        <span className="font-mono text-[11px] text-indigo-300">
          Manual Input Only • Direct Paste Blocked
        </span>
      </div>

      {pasteWarning && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl text-xs text-rose-300 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>
            <strong>Paste Blocked:</strong> Pasting into concept answers is prohibited by security policy. Please type your explanation.
          </span>
        </div>
      )}

      <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 shadow-inner">
        <textarea
          value={textResponse}
          onChange={(e) => onChangeText(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          rows={7}
          placeholder="Explain your approach, system architecture, trade-offs, and data structure choices in detail..."
          className="w-full bg-transparent text-slate-100 text-sm leading-relaxed resize-y focus:outline-none placeholder:text-slate-600 font-sans"
        />

        <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500">
          <span>Words: {wordCount} | Characters: {charCount}</span>
          <span className="text-slate-400">Target: 40–150 words for complete credit</span>
        </div>
      </div>
    </div>
  );
}
