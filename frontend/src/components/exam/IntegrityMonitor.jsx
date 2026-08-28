import React, { useState } from 'react';
import { Shield, ShieldAlert, AlertTriangle, ChevronDown, ChevronUp, Lock, History, Eye } from 'lucide-react';

export default function IntegrityMonitor({
  strikeCount = 0,
  maxStrikes = 3,
  violations = [],
  isOpen = false,
  onToggle
}) {
  const [collapsed, setCollapsed] = useState(!isOpen);

  const getStatusColor = () => {
    if (strikeCount >= 2) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (strikeCount === 1) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  };

  const getStatusText = () => {
    if (strikeCount >= 2) return 'Critical Risk (Final Strike)';
    if (strikeCount === 1) return 'Warning Active';
    return 'Clean & Compliant';
  };

  return (
    <aside aria-label="Integrity Monitoring System" className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden backdrop-blur">
      {/* Header Bar */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-850 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg border ${getStatusColor()}`}>
            {strikeCount > 0 ? (
              <ShieldAlert className="h-4 w-4" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Integrity Monitoring System</span>
              <span className={`text-[10px] px-2 py-0.2 rounded-full border ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Strikes: {strikeCount}/{maxStrikes} • Active Guard Rails
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs font-mono">{violations.length} logs</span>
          {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </div>
      </button>

      {/* Collapsible Panel */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800 space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] block uppercase font-mono">Tab Switches</span>
              <span className={`text-base font-bold font-mono ${strikeCount > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                {violations.filter(v => v.event_type === 'tab_switch').length}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] block uppercase font-mono">Fullscreen Exits</span>
              <span className="text-base font-bold font-mono text-slate-200">
                {violations.filter(v => v.event_type === 'fullscreen_exit').length}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] block uppercase font-mono">Paste Attempts</span>
              <span className="text-base font-bold font-mono text-rose-400">
                {violations.filter(v => v.event_type === 'paste_attempt').length}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] block uppercase font-mono">Blocked Keys</span>
              <span className="text-base font-bold font-mono text-slate-200">
                {violations.filter(v => v.event_type === 'restricted_key' || v.event_type === 'devtools_detected').length}
              </span>
            </div>
          </div>

          {/* Active Security Safeguards */}
          <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-indigo-400" />
              <span>Active Browser Safeguards</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
              <div>✓ Clipboard Cut/Copy/Paste Blocked</div>
              <div>✓ DevTools & Inspect Shortcuts Intercepted</div>
              <div>✓ 3-Strike Auto-Submission Protocol</div>
              <div>✓ Dynamic Traceable Watermark Overlay</div>
            </div>
          </div>

          {/* Activity Log Feed */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-slate-400" />
              <span>Recent Security Events ({violations.length})</span>
            </div>
            
            {violations.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-950/50 rounded-lg text-center">
                No security infractions recorded. Exam environment is fully compliant.
              </p>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {violations.map((ev, i) => (
                  <div
                    key={ev.id || i}
                    className="p-2 rounded bg-slate-950 border border-slate-800/80 text-[11px] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          ev.severity === 'violation'
                            ? 'bg-rose-500'
                            : ev.severity === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-indigo-500'
                        }`}
                      />
                      <span className="font-mono font-semibold text-slate-300 capitalize truncate">
                        {ev.event_type.replace('_', ' ')}
                      </span>
                      <span className="text-slate-400 text-[10px] truncate max-w-[200px]">
                        {ev.details}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : 'Just now'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
