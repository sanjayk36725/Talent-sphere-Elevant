import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckSquare,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
} from 'lucide-react';
import { Assessment, AssessmentAttempt } from '../types';
import { NeoExamShield } from './NeoExamShield';
import { downloadAsCSV, downloadAsExcel, downloadAsJSON, downloadAsWordDoc } from '../lib/export_utils';

interface AssessmentRunnerProps {
  assessment: Assessment;
  onSubmit: (assessmentId: string, answers: Record<string, string | number>) => Promise<AssessmentAttempt>;
  onBack: () => void;
}

export const AssessmentRunner: React.FC<AssessmentRunnerProps> = ({
  assessment,
  onSubmit,
  onBack,
}) => {
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeLeft, setTimeLeft] = useState(assessment.durationMinutes * 60);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentAttempt | null>(null);

  // Proctoring States
  const [warningsCount, setWarningsCount] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  const handleWarning = (reason: string, count: number) => {
    setWarningsCount(count);
  };

  const handleAutoKickout = async () => {
    setIsLockedOut(true);
    setSubmitting(true);
    try {
      const attempt = await onSubmit(assessment.id, answers);
      setResult(attempt);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  // Timer
  useEffect(() => {
    if (!isExamStarted || result || submitting || isLockedOut) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamStarted, result, submitting, isLockedOut]);

  const handleOptionSelect = (qId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const attempt = await onSubmit(assessment.id, answers);
      setResult(attempt);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQ = assessment.questions[currentQuestionIndex] || assessment.questions[0];
  const completionPercentage = Math.round(
    (Object.keys(answers).length / (assessment.questions.length || 1)) * 100
  );

  // Result Export Handlers for Student Scorecard
  const handleExportData = (format: 'json' | 'csv' | 'excel' | 'word') => {
    if (!result) return;
    const exportRecord = [
      {
        attemptId: result.id,
        assessmentTitle: assessment.title,
        dayModule: assessment.dayLabel || `Day ${assessment.dayId}`,
        score: result.score,
        totalMarks: result.totalMarks,
        percentage: `${Math.round((result.score / (result.totalMarks || 1)) * 100)}%`,
        status: result.passed ? 'PASSED' : 'FAILED',
        warningsCount: warningsCount,
        submittedAt: new Date(result.submittedAt).toLocaleString(),
        aiFeedback: result.aiAnalysis || 'Evaluation complete.',
      },
    ];

    const headers = [
      { key: 'attemptId', label: 'Attempt ID' },
      { key: 'assessmentTitle', label: 'Assessment Title' },
      { key: 'dayModule', label: 'Curriculum Module' },
      { key: 'score', label: 'Score Obtained' },
      { key: 'totalMarks', label: 'Total Marks' },
      { key: 'percentage', label: 'Score Percentage' },
      { key: 'status', label: 'Pass / Fail Verdict' },
      { key: 'warningsCount', label: 'Proctor Warnings' },
      { key: 'submittedAt', label: 'Submission Timestamp' },
      { key: 'aiFeedback', label: 'AI Competency Analysis' },
    ];

    const filename = `TalentSphere_Scorecard_${assessment.title.replace(/\s+/g, '_')}`;

    if (format === 'json') downloadAsJSON(exportRecord, `${filename}.json`);
    else if (format === 'csv') downloadAsCSV(exportRecord, headers, `${filename}.csv`);
    else if (format === 'excel') downloadAsExcel(exportRecord, headers, 'Official Exam Scorecard', `${filename}.xls`);
    else if (format === 'word') downloadAsWordDoc(exportRecord, headers, `Official Scorecard - ${assessment.title}`, `${filename}.doc`);
  };

  // 1. Result Screen
  if (result) {
    const isLocked = result.resultReleased !== true;

    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6 text-slate-900 dark:text-slate-100">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-5 shadow-lg">
          {isLockedOut ? (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-300 text-xs font-black flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span>TEST TERMINATED: Maximum 3 Proctor Warnings Exceeded!</span>
            </div>
          ) : null}

          {isLocked ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 flex items-center justify-center font-black text-2xl mx-auto">
                🔒
              </div>

              <div>
                <span className="text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono font-black px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800 uppercase">
                  SUBMISSION SECURED • RESULT LOCKED
                </span>
                <h2 className="text-2xl font-black text-slate-950 dark:text-white mt-2">{assessment.title}</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Exam submitted on {new Date(result.submittedAt).toLocaleTimeString()}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 font-black uppercase font-mono">Evaluation Status</span>
                  <span className="font-black text-amber-700 dark:text-amber-400 font-mono flex items-center gap-1">
                    Pending Instructor Release
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 font-black uppercase font-mono">Proctor Warnings</span>
                  <span className="font-black text-slate-950 dark:text-white font-mono">{warningsCount} / 3</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 font-black uppercase font-mono">Questions Answered</span>
                  <span className="font-black text-slate-950 dark:text-white font-mono">{Object.keys(answers).length} / {assessment.questions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-black uppercase font-mono">Faculty Examiner</span>
                  <span className="font-black text-slate-950 dark:text-white font-mono">Dr. Sarah Jenkins</span>
                </div>
              </div>

              {/* Multi-Format Export Buttons */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block">
                  Export Submission Proof & Telemetry
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => handleExportData('json')}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 font-black text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> JSON
                  </button>
                  <button
                    onClick={() => handleExportData('csv')}
                    className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-950 dark:text-emerald-300 font-black text-xs px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> CSV
                  </button>
                  <button
                    onClick={() => handleExportData('excel')}
                    className="bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 dark:hover:bg-teal-900 text-teal-950 dark:text-teal-300 font-black text-xs px-3 py-2 rounded-xl border border-teal-300 dark:border-teal-800 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" /> Excel (.xls)
                  </button>
                  <button
                    onClick={() => handleExportData('word')}
                    className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-950 dark:text-indigo-300 font-black text-xs px-3 py-2 rounded-xl border border-indigo-300 dark:border-indigo-800 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-600" /> Word (.doc)
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 font-black text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> PDF / Print
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={onBack}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Go to Exam Portal & Results Hub
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl mx-auto border ${
                  result.passed ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                }`}
              >
                {result.passed ? 'PASS' : 'RETRY'}
              </div>

              <h2 className="text-2xl font-black text-slate-950 dark:text-white">{assessment.title} — Official Score Report</h2>

              <div className="text-4xl font-black font-mono text-amber-600 dark:text-amber-400">
                {result.score} / {result.totalMarks} Marks ({Math.round((result.score / result.totalMarks) * 100)}%)
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 max-w-md mx-auto leading-relaxed bg-slate-50 dark:bg-slate-800/70 p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-serif italic">
                &quot;{result.aiAnalysis}&quot;
              </p>

              {/* Multi-Format Export Buttons */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block">
                  Download Official Scorecard in Any Format
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => handleExportData('json')}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 font-black text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> JSON
                  </button>
                  <button
                    onClick={() => handleExportData('csv')}
                    className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-950 dark:text-emerald-300 font-black text-xs px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> CSV
                  </button>
                  <button
                    onClick={() => handleExportData('excel')}
                    className="bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 dark:hover:bg-teal-900 text-teal-950 dark:text-teal-300 font-black text-xs px-3 py-2 rounded-xl border border-teal-300 dark:border-teal-800 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" /> Excel (.xls)
                  </button>
                  <button
                    onClick={() => handleExportData('word')}
                    className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-950 dark:text-indigo-300 font-black text-xs px-3 py-2 rounded-xl border border-indigo-300 dark:border-indigo-800 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-600" /> Word (.doc)
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 font-black text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> PDF / Print
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={onBack}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Return to Assessments List
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <NeoExamShield
      examTitle={assessment.title}
      durationMinutes={assessment.durationMinutes}
      totalQuestions={assessment.questions.length}
      totalMarks={assessment.totalMarks}
      passingMarks={assessment.passingMarks}
      isExamStarted={isExamStarted}
      onStartExam={() => setIsExamStarted(true)}
      onTerminate={handleAutoKickout}
      onWarning={handleWarning}
      onBack={onBack}
    >
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 text-slate-900 dark:text-slate-100">
        {/* Exam Header */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 uppercase">
              {assessment.dayLabel || `Day ${assessment.dayId}`} • EXAM
            </span>
            <h1 className="text-lg font-black text-slate-950 dark:text-white mt-1">{assessment.title}</h1>
          </div>
          <div className="bg-slate-950 text-amber-400 px-3.5 py-1.5 rounded-xl font-mono text-xs font-black flex items-center gap-1.5 shadow-xs border border-slate-800">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Main Panel: MCQ Question Runner */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
            {/* Progress Bar & Question Counter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-300">
                <span>Question {currentQuestionIndex + 1} of {assessment.questions.length}</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{completionPercentage}% Answered</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-mono font-black text-indigo-700 dark:text-indigo-400 uppercase">
                MULTIPLE CHOICE QUESTION ({currentQ?.marks || 10} MARKS)
              </span>
              <h3 className="text-sm font-black text-slate-950 dark:text-white mt-1 leading-relaxed">
                {currentQ?.text}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ?.options.map((opt, idx) => {
                const isSelected = answers[currentQ.id] === idx;
                const optionLabels = ['A', 'B', 'C', 'D'];
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(currentQ.id, idx)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-600 dark:border-indigo-500 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-black border shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {optionLabels[idx] || idx + 1}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation & Submit Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-900 dark:text-slate-200 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {currentQuestionIndex < assessment.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(assessment.questions.length - 1, prev + 1))}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
                  Submit Exam
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </NeoExamShield>
  );
};
