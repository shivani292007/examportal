import React from 'react';
import { Briefcase, Building, CheckCircle2, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';

export default function PlacementRecommendations({
  recommendations = [],
  studentName = 'Candidate',
  domain = 'Python'
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-5 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Academia–Industry Internship & Placement Matching
            </h3>
            <p className="text-xs text-slate-400">
              Personalized corporate roles aligned with your verified assessment competencies
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, idx) => {
          const matchPct = Math.round(rec.match_percentage);
          const isHighMatch = matchPct >= 65;

          return (
            <div
              key={idx}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between gap-4 ${
                isHighMatch
                  ? 'bg-slate-950/90 border-indigo-500/40 hover:border-indigo-400/80 shadow-lg shadow-indigo-950/40'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-white">{rec.role_title}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <Building className="h-3.5 w-3.5 text-slate-500" />
                      <span>{rec.company_type}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                        isHighMatch
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {matchPct}% Match
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {rec.recommendation_note}
                </p>

                {/* Required Skills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {rec.required_skills.map((sk, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Assessment Verified</span>
                </span>

                <button
                  type="button"
                  onClick={() => alert(`Redirecting to Industry Partner application portal for "${rec.role_title}"`)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Apply with Score</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
