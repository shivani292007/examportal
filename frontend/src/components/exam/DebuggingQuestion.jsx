import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import { Bug, Play, CheckCircle2, XCircle, Terminal, AlertCircle, Clock, RotateCcw, Wrench } from 'lucide-react';
import { apiClient } from '../../api/client';

export default function DebuggingQuestion({
  question,
  code = '',
  language = 'python',
  sampleTestCases = [],
  onChangeCode,
  onPasteBlocked
}) {
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [execTime, setExecTime] = useState(0);

  const initialCode = code || question.faulty_code || question.code_template || '';

  const handleTestFixedCode = async () => {
    if (!initialCode || !initialCode.trim()) return;
    setRunning(true);
    setTestResults(null);
    setErrorMessage('');

    try {
      const res = await apiClient.runCode({
        language,
        code: initialCode,
        question_id: question.id
      });

      if (res.test_results) {
        setTestResults(res.test_results);
      }
      if (res.error) {
        setErrorMessage(res.error);
      }
      setExecTime(res.execution_time_ms || 0);
    } catch (err) {
      setErrorMessage(err.message || 'Execution failed');
    } finally {
      setRunning(false);
    }
  };

  const handleResetToFaulty = () => {
    if (question.faulty_code) {
      onChangeCode(question.faulty_code);
    }
  };

  const allPassed = testResults && testResults.every((t) => t.passed);
  const passedCount = testResults ? testResults.filter((t) => t.passed).length : 0;

  return (
    <div className="space-y-6">
      {/* Faulty Code Inspector Panel */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <Bug className="h-4 w-4 text-amber-400" />
            <span>Target Buggy Code Snippet (Inspect the flaw below)</span>
          </div>
          <span className="text-[11px] font-mono text-amber-400/80 bg-amber-900/30 px-2 py-0.5 rounded border border-amber-700/40">
            Contains Syntax / Logical Bug
          </span>
        </div>

        <pre className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 text-xs font-mono text-amber-200/90 overflow-x-auto whitespace-pre leading-5 no-select">
          {question.faulty_code || '# No faulty snippet specified'}
        </pre>
      </div>

      {/* Editor Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center gap-2 font-bold text-xs text-indigo-300">
          <Wrench className="h-4 w-4 text-indigo-400" />
          <span>Fix and Repair the Code Below:</span>
        </div>

        <div className="flex items-center gap-2">
          {question.faulty_code && (
            <button
              type="button"
              onClick={handleResetToFaulty}
              title="Reset code to original faulty snippet"
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Buggy Code</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleTestFixedCode}
            disabled={running || !initialCode.trim()}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              running
                ? 'bg-indigo-700/50 text-indigo-300 cursor-wait'
                : 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/20'
            }`}
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{running ? 'Testing Bug Fix...' : 'Validate Repaired Code'}</span>
          </button>
        </div>
      </div>

      {/* Code Editor for Fixed Code */}
      <CodeEditor
        code={initialCode}
        onChange={onChangeCode}
        language={language}
        onPasteBlocked={onPasteBlocked}
        placeholder="Edit and repair the faulty code here manually..."
      />

      {/* Execution Results Console */}
      {(testResults || errorMessage) && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-indigo-400" />
              <span className="font-mono font-bold text-slate-200">Validation Console</span>
            </div>
            {execTime > 0 && (
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                <Clock className="h-3.5 w-3.5" />
                <span>{execTime} ms</span>
              </div>
            )}
          </div>

          <div className="p-4 space-y-3">
            {testResults && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Test Case Evaluation: {passedCount}/{testResults.length} Passed
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      allPassed
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {allPassed ? '✓ Bug Fixed Successfully' : '✗ Bug Persists in Solution'}
                  </span>
                </div>

                <div className="space-y-2">
                  {testResults.map((tr, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs font-mono flex flex-col md:flex-row md:items-center justify-between gap-2 ${
                        tr.passed
                          ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                          : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {tr.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                        )}
                        <span>Case {tr.test_case_index}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-500">Input:</span> {tr.input}
                        </div>
                        <div>
                          <span className="text-slate-500">Expected:</span> {tr.expected}
                        </div>
                        <div>
                          <span className="text-slate-500">Actual:</span>{' '}
                          <span className={tr.passed ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                            {tr.actual || '(none)'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Time:</span> {tr.execution_time_ms} ms
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs font-mono text-rose-300 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="whitespace-pre-wrap">{errorMessage}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
