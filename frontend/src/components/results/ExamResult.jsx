import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import SkillAnalysis from './SkillAnalysis';
import PlacementRecommendations from './PlacementRecommendations';
import { Award, CheckCircle, ShieldCheck, ShieldAlert, ArrowLeft, Download, RotateCcw, Brain, CheckSquare, Layers, Sparkles, Compass, Rocket, Crown, BookOpen, ArrowRight, Zap, Target } from 'lucide-react';

export default function ExamResult({
  result,
  onRetakeExam
}) {
  useEffect(() => {
    if (result && result.percentage >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti fallback
      }
    }
  }, [result]);

  if (!result) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading Assessment Report...
      </div>
    );
  }

  const isPassing = result.percentage >= 60;
  const sectionScores = result.section_scores || {};
  const pct = result.percentage || 0;

  // Determine Level Properties
  let levelTitle = result.candidate_level || (
    pct >= 85 ? 'Expert / Industry-Ready' :
    pct >= 70 ? 'Advanced' :
    pct >= 50 ? 'Intermediate' : 'Beginner'
  );

  let levelConfig = {
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    icon: Crown,
    stepIndex: 4,
    colorGradient: 'from-emerald-500 to-teal-400',
    tagline: 'Direct Corporate Interview & Fast-Track Core Placement Qualified'
  };

  if (levelTitle.includes('Beginner')) {
    levelConfig = {
      badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      icon: BookOpen,
      stepIndex: 1,
      colorGradient: 'from-rose-500 to-amber-500',
      tagline: 'Foundational Knowledge — Recommended for Structured Bridge Upskilling'
    };
  } else if (levelTitle.includes('Intermediate')) {
    levelConfig = {
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      icon: Compass,
      stepIndex: 2,
      colorGradient: 'from-amber-500 to-yellow-400',
      tagline: 'Working Technical Competence — Suitable for Supervised Engineering Internships'
    };
  } else if (levelTitle.includes('Advanced')) {
    levelConfig = {
      badgeBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
      icon: Rocket,
      stepIndex: 3,
      colorGradient: 'from-indigo-500 to-cyan-400',
      tagline: 'Strong Engineering & Problem-Solving Ability — Ready for Core Product Roles'
    };
  }

  const LevelIcon = levelConfig.icon;

  const levels = [
    { title: 'Beginner', range: '0% – 49%', step: 1 },
    { title: 'Intermediate', range: '50% – 69%', step: 2 },
    { title: 'Advanced', range: '70% – 84%', step: 3 },
    { title: 'Expert', range: '85% – 100%', step: 4 },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Results Card */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950 p-6 sm:p-10 shadow-2xl backdrop-blur relative overflow-hidden">
        <div className="max-w-5xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <CheckCircle className="h-4 w-4" />
              <span>Assessment Completed & Verified</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Integrity: <strong className="text-emerald-300">{result.integrity_summary?.status || 'Clean'}</strong></span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Candidate Competency & Placement Evaluation
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Candidate: <strong className="text-slate-200">{result.student_name}</strong> • Domain Specialization:{' '}
                <span className="font-semibold text-indigo-400">{result.domain}</span>
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-950/90 p-4 rounded-2xl border border-slate-800 shadow-inner shrink-0">
              <div className="text-center">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                  Overall Score
                </span>
                <span className="text-3xl font-extrabold text-white font-mono">
                  {result.overall_score}
                  <span className="text-slate-500 text-base font-normal"> / {result.max_score}</span>
                </span>
              </div>
              <div className="h-10 w-px bg-slate-800" />
              <div className="text-center">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                  Percentage
                </span>
                <span className={`text-3xl font-extrabold font-mono ${isPassing ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {result.percentage}%
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CANDIDATE PROFICIENCY LEVEL DIAGNOSTIC CARD (HIGHLIGHTED INNOVATION) */}
          {/* ========================================================================= */}
          <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3.5">
                <div className={`p-3 rounded-2xl border ${levelConfig.badgeBg} shadow-lg shadow-indigo-500/10`}>
                  <LevelIcon className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block font-semibold">
                    Evaluated Examiner / Candidate Level
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      {levelTitle}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold border ${levelConfig.badgeBg}`}>
                      Level {levelConfig.stepIndex} of 4
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-semibold text-indigo-300 block">
                  {levelConfig.tagline}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Industry Benchmarking Score: {result.percentage}%
                </span>
              </div>
            </div>

            {/* 4-Stage Level Progression Ladder */}
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Proficiency Level Spectrum:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {levels.map((lvl) => {
                  const isCurrent = lvl.step === levelConfig.stepIndex;
                  const isAchieved = lvl.step <= levelConfig.stepIndex;

                  return (
                    <div
                      key={lvl.title}
                      className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between gap-1 relative ${
                        isCurrent
                          ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-600/20'
                          : isAchieved
                          ? 'bg-slate-950/80 border-slate-700/80 text-slate-300'
                          : 'bg-slate-950/30 border-slate-850 text-slate-600 opacity-60'
                      }`}
                    >
                      {isCurrent && (
                        <span className="absolute -top-2 -right-1 bg-indigo-500 text-[10px] text-white font-bold px-2 py-0.2 rounded-full shadow">
                          CURRENT
                        </span>
                      )}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isCurrent ? 'text-white' : isAchieved ? 'text-slate-200' : 'text-slate-500'}`}>
                          {lvl.title}
                        </span>
                        {isAchieved ? (
                          <CheckCircle className={`h-3.5 w-3.5 ${isCurrent ? 'text-indigo-400' : 'text-emerald-500'}`} />
                        ) : (
                          <span className="h-3 w-3 rounded-full border border-slate-700" />
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {lvl.range}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Level Diagnostic Summary & Next Roadmap */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span>Level Capability Evaluation</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {result.candidate_level_description ||
                    'Candidate evaluated based on practical code execution, live bug repair, and architectural conceptual mastery.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Next Milestone Progression Roadmap</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {result.next_milestone_recommendation ||
                    'Focus on identified skill gaps and advanced algorithmic problem-solving to level up to the next tier.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Section Breakdown Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Sectional Performance Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(sectionScores).map(([secKey, secData]) => {
            const pct = Math.round(secData.percentage);
            return (
              <div
                key={secKey}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white capitalize">
                    {secKey.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      pct >= 70
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : pct >= 50
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {pct}%
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                  <span>Score: {secData.score} / {secData.max_score}</span>
                  <span>Correct: {secData.correct_count} / {secData.questions_count}</span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      pct >= 70
                        ? 'bg-emerald-500'
                        : pct >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.max(5, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill Analysis Matrix */}
      <SkillAnalysis
        skillScores={result.skill_scores}
        skillDetails={result.skill_details}
        strongSkills={result.strong_skills}
        weakSkills={result.weak_skills}
        skillGaps={result.skill_gaps}
      />

      {/* Placement & Internship Recommendations */}
      <PlacementRecommendations
        recommendations={result.career_recommendations}
        studentName={result.student_name}
        domain={result.domain}
      />

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          onClick={onRetakeExam}
          className="px-5 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Return to Dashboard / New Assessment</span>
        </button>

        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Export Skill Transcript / Print</span>
        </button>
      </div>
    </div>
  );
}
