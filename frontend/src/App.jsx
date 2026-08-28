import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/layout/Header';
import WatermarkOverlay from './components/layout/WatermarkOverlay';
import ExamDashboard from './components/exam/ExamDashboard';
import ExamInstructions from './components/exam/ExamInstructions';
import ExamTimer from './components/exam/ExamTimer';
import SectionNavigation from './components/exam/SectionNavigation';
import QuestionPanel from './components/exam/QuestionPanel';
import MCQQuestion from './components/exam/MCQQuestion';
import CodingQuestion from './components/exam/CodingQuestion';
import DebuggingQuestion from './components/exam/DebuggingQuestion';
import OutputPredictionQuestion from './components/exam/OutputPredictionQuestion';
import ShortAnswerQuestion from './components/exam/ShortAnswerQuestion';
import IntegrityMonitor from './components/exam/IntegrityMonitor';
import ViolationModal from './components/exam/ViolationModal';
import ExamResult from './components/results/ExamResult';
import { useAntiCheating } from './hooks/useAntiCheating';
import { useExamTimer } from './hooks/useExamTimer';
import { apiClient } from './api/client';
import { ChevronLeft, ChevronRight, Send, Save, AlertCircle } from 'lucide-react';

export default function App() {
  // App views: 'dashboard' | 'instructions' | 'assessment' | 'results'
  const [view, setView] = useState('dashboard');
  
  // Auth state
  const [student, setStudent] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Exam session state
  const [selectedDomain, setSelectedDomain] = useState('Python');
  const [sessionData, setSessionData] = useState(null);
  const [currentSection, setCurrentSection] = useState('aptitude');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [savedAnswers, setSavedAnswers] = useState({}); // question_id -> { selected_option, code_submission, text_response, language }
  
  // Submissions & Results
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [integrityDrawerOpen, setIntegrityDrawerOpen] = useState(false);

  // Auto-save debounce ref
  const autoSaveTimerRef = useRef(null);

  // 1. Check existing student login & active session on mount
  useEffect(() => {
    async function initApp() {
      try {
        const profile = await apiClient.getProfile();
        setStudent(profile);
        setSelectedDomain(profile.target_domain || 'Python');

        // Check if there is an active session to resume
        const active = await apiClient.getActiveSession();
        if (active) {
          setSessionData(active);
          setCurrentSection(active.current_section || 'aptitude');
          setSavedAnswers(active.saved_answers || {});
          setView('assessment');
        }
      } catch (err) {
        // Not logged in or no active session
      } finally {
        setIsAuthLoading(false);
      }
    }
    initApp();
  }, []);

  // 2. Submit Assessment Handler
  const handleSubmitAssessment = useCallback(async (reason = 'manual_submit') => {
    if (!sessionData?.session_id || isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Build final answers payload
      const finalAnswersPayload = Object.entries(savedAnswers).map(([qId, ans]) => ({
        question_id: parseInt(qId),
        selected_option: ans.selected_option,
        code_submission: ans.code_submission,
        language: ans.language,
        text_response: ans.text_response,
      }));

      const report = await apiClient.submitAssessment({
        session_id: sessionData.session_id,
        final_answers: finalAnswersPayload
      });

      setAssessmentResult(report);
      setView('results');
    } catch (err) {
      console.error('Failed to submit assessment:', err);
      alert('Error submitting assessment: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [sessionData, savedAnswers, isSubmitting]);

  // 3. Anti-Cheating Hook setup
  const {
    strikeCount,
    violations,
    violationModal,
    setViolationModal,
    isFullscreen,
    enterFullscreen,
    recordViolation
  } = useAntiCheating({
    sessionId: sessionData?.session_id,
    isActive: view === 'assessment',
    onAutoSubmit: () => handleSubmitAssessment('integrity_strike_limit')
  });

  // 4. Timer Hook setup
  const {
    secondsLeft,
    formattedTime,
    urgency,
    isExpired
  } = useExamTimer({
    initialSeconds: sessionData?.time_remaining_seconds || 5400,
    isActive: view === 'assessment',
    onTimeExpired: () => handleSubmitAssessment('time_expired')
  });

  // 5. Auto-Save trigger (debounced)
  const triggerAutoSave = useCallback((updatedAnswers) => {
    if (!sessionData?.session_id || view !== 'assessment') return;
    setIsAutoSaving(true);

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        const payloadAnswers = Object.entries(updatedAnswers).map(([qId, ans]) => ({
          question_id: parseInt(qId),
          selected_option: ans.selected_option,
          code_submission: ans.code_submission,
          language: ans.language,
          text_response: ans.text_response,
        }));

        await apiClient.autoSaveAnswer({
          session_id: sessionData.session_id,
          current_section: currentSection,
          time_remaining_seconds: secondsLeft,
          answers: payloadAnswers
        });
      } catch (err) {
        console.warn('Auto-save background sync error:', err);
      } finally {
        setIsAutoSaving(false);
      }
    }, 800);
  }, [sessionData, view, currentSection, secondsLeft]);

  // Handle Answer Changes
  const handleUpdateAnswer = (field, value, extra = {}) => {
    const questionsForSection = sessionData?.questions?.[currentSection] || [];
    const currentQ = questionsForSection[currentQuestionIdx];
    if (!currentQ) return;

    setSavedAnswers((prev) => {
      const existing = prev[currentQ.id] || {};
      const updated = {
        ...prev,
        [currentQ.id]: {
          ...existing,
          [field]: value,
          ...extra
        }
      };
      triggerAutoSave(updated);
      return updated;
    });
  };

  // Start Exam Flow
  const handleStartExam = (domain) => {
    setSelectedDomain(domain);
    setView('instructions');
  };

  const handleAgreeAndStart = async () => {
    setIsSubmitting(true);
    try {
      const data = await apiClient.startAssessment(selectedDomain);
      setSessionData(data);
      setCurrentSection(data.current_section || 'aptitude');
      setCurrentQuestionIdx(0);
      setSavedAnswers(data.saved_answers || {});
      setView('assessment');
      await enterFullscreen();
    } catch (err) {
      alert('Failed to start assessment: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuth = async (mode, formData) => {
    const authRes = mode === 'login'
      ? await apiClient.login({ email: formData.email, password: formData.password })
      : await apiClient.register(formData);

    apiClient.setToken(authRes.access_token);
    setStudent(authRes.student);
    setSelectedDomain(authRes.student.target_domain || 'Python');
  };

  const handleRetakeExam = () => {
    setSessionData(null);
    setAssessmentResult(null);
    setSavedAnswers({});
    setView('dashboard');
  };

  // Question navigation helpers
  const questionsInCurrentSection = sessionData?.questions?.[currentSection] || [];
  const currentQuestion = questionsInCurrentSection[currentQuestionIdx];
  const currentAnswer = currentQuestion ? (savedAnswers[currentQuestion.id] || {}) : {};

  const handleNextQuestion = () => {
    if (currentQuestionIdx < questionsInCurrentSection.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Jump to next section if available
      const sectionKeys = ['aptitude', 'programming', 'debugging', 'technical_mcq', 'output_prediction', 'short_answer'];
      const curSecIdx = sectionKeys.indexOf(currentSection);
      if (curSecIdx < sectionKeys.length - 1) {
        setCurrentSection(sectionKeys[curSecIdx + 1]);
        setCurrentQuestionIdx(0);
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span className="text-sm font-medium">Initializing Security Engine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-indigo-500/20">
      {/* Dynamic Security Watermark Overlay */}
      {view === 'assessment' && (
        <WatermarkOverlay student={student} sessionId={sessionData?.session_id} />
      )}

      {/* Header */}
      <Header
        student={student}
        examSession={view === 'assessment' ? sessionData : null}
        formattedTime={formattedTime}
        urgency={urgency}
        strikeCount={strikeCount}
        violationsCount={violations.length}
        isFullscreen={isFullscreen}
        onEnterFullscreen={enterFullscreen}
        onOpenIntegrityLog={() => setIntegrityDrawerOpen(!integrityDrawerOpen)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-12">
        {view === 'dashboard' && (
          <ExamDashboard
            student={student}
            onStartExam={handleStartExam}
            onRegisterOrLogin={handleAuth}
            isLoggedIn={!!student}
          />
        )}

        {view === 'instructions' && (
          <ExamInstructions
            domain={selectedDomain}
            onAgreeAndStart={handleAgreeAndStart}
            isLoading={isSubmitting}
          />
        )}

        {view === 'assessment' && sessionData && (
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Top Timer & Section Progress Bar */}
            <ExamTimer
              formattedTime={formattedTime}
              urgency={urgency}
              currentSection={currentSection}
              currentQuestionIndex={currentQuestionIdx}
              totalQuestionsInSection={questionsInCurrentSection.length}
            />

            {/* Section Tabs & Question Palette */}
            <SectionNavigation
              sections={sessionData.questions}
              currentSectionKey={currentSection}
              currentQuestionIndex={currentQuestionIdx}
              savedAnswers={savedAnswers}
              onSelectSection={(secKey) => {
                setCurrentSection(secKey);
                setCurrentQuestionIdx(0);
              }}
              onSelectQuestion={(idx) => setCurrentQuestionIdx(idx)}
            />

            {/* Question Workspace Area */}
            {currentQuestion ? (
              <QuestionPanel
                question={currentQuestion}
                questionNumber={currentQuestionIdx + 1}
              >
                {/* 1. Aptitude & Technical MCQs */}
                {(currentSection === 'aptitude' || currentSection === 'technical_mcq') && (
                  <MCQQuestion
                    options={currentQuestion.options}
                    selectedOption={currentAnswer.selected_option}
                    onSelectOption={(opt) => handleUpdateAnswer('selected_option', opt)}
                  />
                )}

                {/* 2. Programming */}
                {currentSection === 'programming' && (
                  <CodingQuestion
                    question={currentQuestion}
                    code={currentAnswer.code_submission}
                    language={currentAnswer.language || 'python'}
                    sampleTestCases={currentQuestion.sample_test_cases}
                    onChangeCode={(val) => handleUpdateAnswer('code_submission', val)}
                    onChangeLanguage={(lang) => handleUpdateAnswer('language', lang)}
                    onPasteBlocked={(eventType) => recordViolation(eventType, 'Clipboard action intercepted in CodeEditor', 'warning')}
                  />
                )}

                {/* 3. Debugging */}
                {currentSection === 'debugging' && (
                  <DebuggingQuestion
                    question={currentQuestion}
                    code={currentAnswer.code_submission}
                    language={currentAnswer.language || 'python'}
                    sampleTestCases={currentQuestion.sample_test_cases}
                    onChangeCode={(val) => handleUpdateAnswer('code_submission', val)}
                    onPasteBlocked={(eventType) => recordViolation(eventType, 'Clipboard action intercepted in DebuggingEditor', 'warning')}
                  />
                )}

                {/* 4. Output Prediction */}
                {currentSection === 'output_prediction' && (
                  <OutputPredictionQuestion
                    options={currentQuestion.options}
                    selectedOption={currentAnswer.selected_option}
                    onSelectOption={(opt) => handleUpdateAnswer('selected_option', opt)}
                  />
                )}

                {/* 5. Short Answer / Concept */}
                {currentSection === 'short_answer' && (
                  <ShortAnswerQuestion
                    textResponse={currentAnswer.text_response || ''}
                    onChangeText={(val) => handleUpdateAnswer('text_response', val)}
                    onPasteBlocked={(eventType) => recordViolation(eventType, 'Clipboard action intercepted in ConceptAnswer', 'warning')}
                  />
                )}
              </QuestionPanel>
            ) : (
              <div className="p-8 text-center text-slate-500 rounded-xl bg-slate-900 border border-slate-800">
                No questions available for this section.
              </div>
            )}

            {/* Bottom Action & Submission Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIdx === 0}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    currentQuestionIdx > 0
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer'
                      : 'bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <span>Save & Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>

                {isAutoSaving && (
                  <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                    <Save className="h-3 w-3 animate-spin" />
                    <span>Auto-saving...</span>
                  </span>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to finalize and submit your assessment? You cannot modify your answers after submission.')) {
                      handleSubmitAssessment('manual_submit');
                    }
                  }}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? 'Evaluating Submission...' : 'Finalize & Submit Assessment'}</span>
                </button>
              </div>
            </div>

            {/* Live Integrity Monitoring Drawer */}
            <IntegrityMonitor
              strikeCount={strikeCount}
              maxStrikes={3}
              violations={violations}
              isOpen={integrityDrawerOpen}
              onToggle={() => setIntegrityDrawerOpen(!integrityDrawerOpen)}
            />
          </div>
        )}

        {view === 'results' && (
          <ExamResult
            result={assessmentResult}
            onRetakeExam={handleRetakeExam}
          />
        )}
      </main>

      {/* Security Violation Modal */}
      <ViolationModal
        isOpen={violationModal.isOpen}
        title={violationModal.title}
        message={violationModal.message}
        severity={violationModal.severity}
        onClose={() => setViolationModal((prev) => ({ ...prev, isOpen: false }))}
        onEnterFullscreen={enterFullscreen}
      />
    </div>
  );
}
