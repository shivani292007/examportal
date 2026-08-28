import React, { useState } from 'react';
import { ShieldCheck, BookOpen, Terminal, Code, Database, Cpu, Award, ArrowRight, UserCheck, Lock, Sparkles } from 'lucide-react';

const DOMAINS = [
  {
    id: 'Python',
    name: 'Python Full-Stack & Systems',
    icon: Terminal,
    desc: 'GIL, Decorators, Concurrency, Algorithms & Dynamic Systems',
    badge: 'Popular'
  },
  {
    id: 'Java',
    name: 'Java Enterprise Architecture',
    icon: Code,
    desc: 'JVM Memory, Concurrency, Generics, Spring & Data Structures',
    badge: 'Enterprise'
  },
  {
    id: 'JavaScript',
    name: 'Modern JavaScript / Node.js',
    icon: Sparkles,
    desc: 'Event Loop, Microtasks, Closures, Async/Await & REST APIs',
    badge: 'Web'
  },
  {
    id: 'SQL',
    name: 'SQL & Database Engineering',
    icon: Database,
    desc: 'ACID Levels, Query Optimization, Window Functions & Indexing',
    badge: 'Core'
  },
  {
    id: 'Data Structures',
    name: 'Data Structures & Algorithms',
    icon: Cpu,
    desc: 'Trees, Dynamic Programming, Graphs, Heaps & Complexity',
    badge: 'Algorithms'
  }
];

export default function ExamDashboard({
  student,
  onStartExam,
  onRegisterOrLogin,
  isLoggedIn = false
}) {
  const [selectedDomain, setSelectedDomain] = useState(student?.target_domain || 'Python');
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: 'Shiva Sharma',
    email: 'shiva.candidate@univ.edu',
    password: 'Password123!',
    college: 'Apex Institute of Technology',
    roll_number: 'AI-2026-901'
  });
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      await onRegisterOrLogin(authMode, { ...formData, target_domain: selectedDomain });
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
      {/* Banner / Hero */}
      <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/40 via-slate-900/60 to-slate-900/90 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>AI-Resistant Secure Skill Assessment Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Portal for Academia–Industry Collaboration
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Verify your true practical problem-solving, live coding, and debugging competence under a secure assessment environment. Assessment results directly power your <strong className="text-indigo-300">Skill Mapping</strong> and fast-track <strong className="text-cyan-300">Internship & Placement Matching</strong>.
          </p>
        </div>
      </div>

      {/* Assessment Flow Pipeline */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Integrated Candidate Progression Journey
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 text-indigo-300 font-semibold flex flex-col items-center justify-center gap-1">
            <UserCheck className="h-5 w-5 text-indigo-400" />
            <span>1. Candidate Profile</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-semibold flex flex-col items-center justify-center gap-1">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
            <span>2. Secure Assessment</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-semibold flex flex-col items-center justify-center gap-1">
            <Award className="h-5 w-5 text-emerald-400" />
            <span>3. Skill Analysis</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-semibold flex flex-col items-center justify-center gap-1">
            <Terminal className="h-5 w-5 text-amber-400" />
            <span>4. Gap Identification</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-semibold flex flex-col items-center justify-center gap-1">
            <ArrowRight className="h-5 w-5 text-purple-400" />
            <span>5. Placement Match</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Domain Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Select Your Technical Specialization Domain
              </h3>
              <p className="text-xs text-slate-400">
                The technical MCQs and algorithmic coding tasks will be personalized to your selected area.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DOMAINS.map((dom) => {
                const IconComp = dom.icon;
                const isSelected = selectedDomain === dom.id;
                return (
                  <button
                    key={dom.id}
                    type="button"
                    onClick={() => setSelectedDomain(dom.id)}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <IconComp className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                        {dom.badge}
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-sm text-white mb-1">{dom.name}</div>
                      <div className="text-xs text-slate-400 leading-relaxed">{dom.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Profile Authentication / Start Action */}
        <div className="space-y-6">
          {isLoggedIn && student ? (
            <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-lg">
                  {student.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{student.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{student.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 border-y border-slate-800 py-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Domain:</span>
                  <span className="font-semibold text-indigo-300">{selectedDomain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Duration:</span>
                  <span className="font-semibold text-slate-200">90 Minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Sections:</span>
                  <span className="font-semibold text-slate-200">6 Specialized Sections</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Integrity Guard:</span>
                  <span className="font-semibold text-emerald-400">Active (3 Strikes Max)</span>
                </div>
              </div>

              <button
                onClick={() => onStartExam(selectedDomain)}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceed to Integrity Rules</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* Student Auth Form */
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm">
                  {authMode === 'login' ? 'Candidate Login' : 'Register New Student'}
                </h3>
                <div className="flex text-xs bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${authMode === 'login' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400'}`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${authMode === 'register' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400'}`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
                {authMode === 'register' && (
                  <>
                    <div>
                      <label className="block text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                        placeholder="e.g. Shiva Sharma"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">College / University</label>
                      <input
                        type="text"
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                        placeholder="Institute Name"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                    placeholder="candidate@univ.edu"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  {loading ? 'Processing...' : authMode === 'login' ? 'Sign In & Enter Portal' : 'Create Account & Continue'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
