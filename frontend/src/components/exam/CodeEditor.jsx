import React, { useState, useRef, useEffect } from 'react';
import { Code2, Copy, AlertCircle, ShieldAlert, Check } from 'lucide-react';

export default function CodeEditor({
  code = '',
  onChange,
  language = 'python',
  readOnly = false,
  onPasteBlocked,
  placeholder = 'Type your solution here manually...'
}) {
  const textareaRef = useRef(null);
  const [pasteWarning, setPasteWarning] = useState(false);
  const lineCount = Math.max(code.split('\n').length, 12);

  const handleKeyDown = (e) => {
    // Intercept Tab key for 4-space indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }

    // Intercept Ctrl+V / Cmd+V
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      triggerPasteWarning();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    triggerPasteWarning();
  };

  const handleCopy = (e) => {
    e.preventDefault();
    if (onPasteBlocked) {
      onPasteBlocked('copy_attempt');
    }
  };

  const triggerPasteWarning = () => {
    setPasteWarning(true);
    if (onPasteBlocked) {
      onPasteBlocked('paste_attempt');
    }
    setTimeout(() => setPasteWarning(false), 4000);
  };

  return (
    <div className="flex flex-col rounded-xl border border-slate-700/80 bg-slate-950 overflow-hidden shadow-xl">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-indigo-400" />
          <span className="font-mono font-semibold text-slate-200 uppercase tracking-wider">
            {language} Editor
          </span>
          <span className="bg-slate-800 text-[11px] px-2 py-0.5 rounded text-indigo-300 font-mono">
            Manual Typing Only
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Clipboard Paste Blocked</span>
          </div>
        </div>
      </div>

      {/* Paste Interception Warning Banner */}
      {pasteWarning && (
        <div className="bg-rose-500/10 border-b border-rose-500/30 px-4 py-2 flex items-center justify-between text-xs text-rose-300 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>
              <strong>Paste Prohibited:</strong> Direct pasting is disabled by assessment security policy. You must type your code manually.
            </span>
          </div>
          <span className="text-[10px] text-rose-400 font-mono">Violation Logged</span>
        </div>
      )}

      {/* Editor Body */}
      <div className="relative flex min-h-[300px] max-h-[500px] font-mono text-sm">
        {/* Line Numbers Column */}
        <div className="w-12 py-3 bg-slate-900/60 select-none border-r border-slate-800 text-right pr-3 text-slate-600 font-mono text-xs leading-6">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Input Area */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onCopy={handleCopy}
            readOnly={readOnly}
            placeholder={placeholder}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="w-full h-full min-h-[300px] max-h-[500px] p-3 bg-transparent text-slate-100 font-mono text-sm leading-6 resize-none focus:outline-none focus:ring-0 whitespace-pre tab-size-4"
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-1.5 bg-slate-900/80 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center font-mono">
        <span>Lines: {lineCount} | UTF-8</span>
        <span>Press [Tab] for 4-space indent</span>
      </div>
    </div>
  );
}
