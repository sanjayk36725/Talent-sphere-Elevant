import React from 'react';
import { Lock, CheckCircle2, Sparkles, Unlock, ShieldAlert } from 'lucide-react';

interface AscentPathProps {
  currentUnlockedDay: number;
  maxDays?: number;
  isTeacher?: boolean;
  onUnlockClick?: (dayId: number) => void;
  onLockClick?: (dayId: number) => void;
  compact?: boolean;
}

export const AscentPath: React.FC<AscentPathProps> = ({
  currentUnlockedDay,
  maxDays = 7,
  isTeacher = false,
  onUnlockClick,
  onLockClick,
  compact = false,
}) => {
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-semibold text-slate-600">Curriculum Progress:</span>
        <div className="flex items-center gap-1">
          {days.map((day) => {
            const isUnlocked = day <= currentUnlockedDay;
            return (
              <span
                key={day}
                className={`text-xs px-2 py-0.5 rounded font-mono font-bold transition-all ${
                  isUnlocked
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                Day {day}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  const getDayTopic = (day: number) => {
    const topics: Record<number, string> = {
      1: 'Foundations & OKRs',
      2: 'AI Career Pathing',
      3: '360 Feedback & Leadership',
      4: 'Talent Acquisition & Sourcing',
      5: 'Performance Appraisal Matrices',
      6: 'Compensation & Benefits',
      7: 'Strategic HR Architecture',
    };
    return topics[day] || `Module ${day}`;
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            {isTeacher ? 'The Ascent Path — Teacher Day-Wise Lock & Unlock Control' : 'The Ascent Path — Day-Wise Curriculum Roadmap'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isTeacher
              ? 'Instructor Control Panel: Click any day to unlock or lock curriculum modules, study PDFs, and evaluations for students.'
              : 'Teacher-Regulated Access: Only your course instructor can unlock or lock curriculum days and corresponding study materials.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200 font-bold flex items-center gap-1.5">
            <Unlock className="w-3.5 h-3.5 text-amber-600" />
            Day {currentUnlockedDay} / {maxDays} Unlocked
          </span>
        </div>
      </div>

      <div className="relative py-4">
        {/* Connecting Track */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-8 h-1 bg-amber-500 -translate-y-1/2 z-0 transition-all duration-500"
          style={{
            width: maxDays > 1 ? `${(Math.min(currentUnlockedDay - 1, maxDays - 1) / (maxDays - 1)) * 100}%` : '0%',
          }}
        />

        {/* Path Nodes */}
        <div className="relative z-10 flex justify-between items-center overflow-x-auto pb-2 sm:pb-0 gap-3">
          {days.map((day) => {
            const isUnlocked = day <= currentUnlockedDay;
            const isCurrent = day === currentUnlockedDay;

            return (
              <div key={day} className="flex flex-col items-center min-w-[70px]">
                {/* Node representation */}
                {isTeacher ? (
                  <button
                    onClick={() => {
                      if (isUnlocked && onLockClick) {
                        onLockClick(day - 1 > 0 ? day - 1 : 1);
                      } else if (onUnlockClick) {
                        onUnlockClick(day);
                      }
                    }}
                    title={isUnlocked ? `Click to Lock back to Day ${day - 1}` : `Click to Unlock up to Day ${day}`}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold font-mono transition-all duration-300 relative touch-sensor-btn sensor-glow cursor-pointer ${
                      isUnlocked
                        ? 'bg-amber-500 text-white shadow-xs hover:bg-amber-600'
                        : 'bg-slate-100 border-2 border-slate-300 text-slate-500 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                  >
                    {isUnlocked ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}

                    {isCurrent && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                    )}
                  </button>
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold font-mono transition-all duration-300 relative select-none ${
                      isUnlocked
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 border-2 border-slate-200 text-slate-400'
                    }`}
                  >
                    {isUnlocked ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}

                    {isCurrent && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>
                )}

                <div className="mt-2.5 text-center">
                  <span
                    className={`text-xs font-bold font-mono block ${
                      isUnlocked ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    Day {day}
                  </span>
                  <span className="text-[10px] text-slate-500 block max-w-[90px] truncate">
                    {getDayTopic(day)}
                  </span>
                  <span
                    className={`text-[9px] font-mono block mt-0.5 ${
                      isUnlocked ? 'text-emerald-700 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {isUnlocked ? '✓ Unlocked' : '🔒 Locked'}
                  </span>
                </div>

                {/* Teacher-only Quick Action Buttons */}
                {isTeacher && (
                  <div className="mt-1.5 flex gap-1">
                    {!isUnlocked && onUnlockClick && (
                      <button
                        onClick={() => onUnlockClick(day)}
                        className="text-[9px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-0.5 rounded shadow-xs transition-all touch-sensor-btn"
                      >
                        Unlock
                      </button>
                    )}
                    {isUnlocked && day > 1 && onLockClick && (
                      <button
                        onClick={() => onLockClick(day - 1)}
                        className="text-[9px] bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded border border-amber-300 transition-all touch-sensor-btn"
                      >
                        Lock
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

