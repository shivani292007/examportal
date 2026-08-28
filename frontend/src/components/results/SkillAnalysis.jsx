import React from 'react';
import { Award, TrendingUp, AlertTriangle, CheckCircle, Brain, Target, Sparkles, ShieldCheck } from 'lucide-react';

export default function SkillAnalysis({
  skillScores = {},
  skillDetails = [],
  strongSkills = [],
  weakSkills = [],
  skillGaps = []
}) {
  return (
    <div className="space-y-6">
      {/* Skill Indicators Grid */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Skill Competency & Level Mapping
              </h3>
              <p className="text-xs text-slate-400">
                Granular multidimensional skill levels evaluated across practical assessment sections
              </p>
            </div>
          </div>
        </div>

        {/* Skill Progress Bars with Explicit Level Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {Object.entries(skillScores).map(([skill, score]) => {
            const pct = Math.round(score);
            let barColor = 'bg-gradient-to-r from-emerald-500 to-teal-400';
            let textColor = 'text-emerald-400';
            let badgeBg = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
            let levelLabel = 'Expert';

            if (pct < 50) {
              barColor = 'bg-gradient-to-r from-rose-600 to-rose-400';
              textColor = 'text-rose-400';
              badgeBg = 'bg-rose-500/10 text-rose-300 border-rose-500/30';
              levelLabel = 'Beginner';
            } else if (pct < 70) {
              barColor = 'bg-gradient-to-r from-amber-500 to-yellow-400';
              textColor = 'text-amber-400';
              badgeBg = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
              levelLabel = 'Intermediate';
            } else if (pct < 85) {
              barColor = 'bg-gradient-to-r from-indigo-500 to-cyan-400';
              textColor = 'text-indigo-300';
              badgeBg = 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
              levelLabel = 'Advanced';
            }

            return (
              <div
                key={skill}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2.5"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">{skill}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold border ${badgeBg}`}>
                      {levelLabel}
                    </span>
                    <span className={`font-mono font-bold ${textColor}`}>{pct}%</span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                    style={{ width: `${Math.max(5, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strong Skills vs Weak Skills / Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Skills */}
        <div className="rounded-2xl border border-emerald-900/40 bg-slate-900/80 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Demonstrated Strong Skills</h4>
              <p className="text-xs text-slate-400">Advanced & Expert competencies ($ \ge 65\% $)</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {strongSkills.length > 0 ? (
              strongSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{skill}</span>
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No skills currently in the mastery tier.</p>
            )}
          </div>
        </div>

        {/* Skill Gaps / Needs Improvement */}
        <div className="rounded-2xl border border-amber-900/40 bg-slate-900/80 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Identified Skill Gaps & Level Up Areas</h4>
              <p className="text-xs text-slate-400">Target areas to transition from Beginner/Intermediate to Advanced</p>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {skillGaps.length > 0 ? (
              skillGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-800/40 text-xs text-slate-300 flex items-start gap-2"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{gap}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No critical skill gaps detected. Outstanding mastery!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
