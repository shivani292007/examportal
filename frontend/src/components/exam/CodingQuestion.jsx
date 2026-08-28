import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import { Play, CheckCircle2, XCircle, RotateCcw, Terminal, Clock, Check, AlertCircle } from 'lucide-react';
import { apiClient } from '../../api/client';

export default function CodingQuestion({
  question,
  code = '',
  language = 'python',
  sampleTestCases = [],
  onChangeCode,
  onChangeLanguage,
  onPasteBlocked
}) {
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [customOutput, setCustomOutput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [execTime, setExecTime] = useState(0);

  const handleRunCode = async () => {
    if (!code || !code.trim()) return;
    setRunning(true);
    setTestResults(null);
    setErrorMessage('');
    setCustomOutput('');

    try {
      const res = await apiClient.runCode({
        language,
        code,
        question_id: question.id
      });

      if (res.test_results) {
        setTestResults(res.test_results);
      } else {
        setCustomOutput(res.output || '');
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

  const handleResetTemplate = () => {
    if (question.code_template) {
      onChangeCode(question.code_template);
    }
  };

  const allPassed = testResults && testResults.every((t) => t.passed);
  const passedCount = testResults ? testResults.filter((t) => t.passed).length : 0;

  return (
    <div className="space-y-4">
      {/* Editor Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400">Language:</label>
          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="python">Python 3</option>
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="java">Java 17</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {question.code_template && (
            <button
              type="button"
              onClick={handleResetTemplate}
              title="Reset code template"
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Template</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleRunCode}
            disabled={running || !code.trim()}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              running
                ? 'bg-indigo-700/50 text-indigo-300 cursor-wait'
                : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/20'
            }`}
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{running ? 'Executing Code...' : 'Run Code against Test Cases'}</span>
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <CodeEditor
        code={code || question.code_template || ''}
        onChange={onChangeCode}
        language={language}
        onPasteBlocked={onPasteBlocked}
      />

      {/* Sample Test Cases Guide */}
      {sampleTestCases && sampleTestCases.length > 0 && !testResults && !errorMessage && !customOutput && (
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Public Sample Test Cases:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
            {sampleTestCases.map((tc, i) => (
              <div key={i} className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400">
                  <span className="text-slate-500">Input:</span> {tc.input}
                </div>
                <div className="text-emerald-400">
                  <span className="text-slate-500">Expected:</span> {tc.expected}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Execution Results Console */}
      {(testResults || errorMessage || customOutput) && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl animate-in fade-in">
          {/* Console Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span className="font-mono font-bold text-slate-200">Execution Console</span>
            </div>
            {execTime > 0 && (
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                <Clock className="h-3.5 w-3.5" />
                <span>{execTime} ms</span>
              </div>
            )}
          </div>

          <div className="p-4 space-y-3">
            {/* Test Cases Table */}
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
                    {allPassed ? '✓ All Test Cases Passed' : '✗ Some Test Cases Failed'}
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
                        <span>Test Case {tr.test_case_index}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-500">Input:</span> {tr.input || '(empty)'}
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

            {/* Custom Output if no test cases */}
            {customOutput && (
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-1">Standard Output:</div>
                <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap">
                  {customOutput}
                </pre>
              </div>
            )}

            {/* Error Output */}
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
