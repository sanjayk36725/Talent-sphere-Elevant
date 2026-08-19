import React from 'react';
import { Check, X, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  showRequirements?: boolean;
}

export interface PasswordAnalysis {
  hasMinLength: boolean;
  hasLower: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  score: number; // 0 to 5
  label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
  colorClass: string;
  bgClass: string;
  barColor: string;
}

export const analyzePassword = (password: string): PasswordAnalysis => {
  const hasMinLength = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const criteriaMet = [hasMinLength, hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

  let label: PasswordAnalysis['label'] = 'Very Weak';
  let colorClass = 'text-rose-600';
  let bgClass = 'bg-rose-50 border-rose-200';
  let barColor = 'bg-rose-500';

  if (!password) {
    label = 'Very Weak';
    colorClass = 'text-slate-400';
    bgClass = 'bg-slate-50 border-slate-200';
    barColor = 'bg-slate-200';
  } else if (criteriaMet <= 2) {
    label = 'Weak';
    colorClass = 'text-rose-600';
    bgClass = 'bg-rose-50 border-rose-200';
    barColor = 'bg-rose-500';
  } else if (criteriaMet === 3) {
    label = 'Medium';
    colorClass = 'text-amber-600';
    bgClass = 'bg-amber-50 border-amber-200';
    barColor = 'bg-amber-500';
  } else if (criteriaMet === 4) {
    label = 'Strong';
    colorClass = 'text-indigo-600';
    bgClass = 'bg-indigo-50 border-indigo-200';
    barColor = 'bg-indigo-600';
  } else {
    label = 'Very Strong';
    colorClass = 'text-emerald-600';
    bgClass = 'bg-emerald-50 border-emerald-200';
    barColor = 'bg-emerald-500';
  }

  return {
    hasMinLength,
    hasLower,
    hasUpper,
    hasNumber,
    hasSymbol,
    score: criteriaMet,
    label,
    colorClass,
    bgClass,
    barColor,
  };
};

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  showRequirements = true,
}) => {
  if (!password) return null;

  const analysis = analyzePassword(password);
  const percentage = (analysis.score / 5) * 100;

  const requirements = [
    { label: '8+ Characters', met: analysis.hasMinLength },
    { label: 'Lowercase (a-z)', met: analysis.hasLower },
    { label: 'Uppercase (A-Z)', met: analysis.hasUpper },
    { label: 'Number (0-9)', met: analysis.hasNumber },
    { label: 'Special Symbol (!@#$...)', met: analysis.hasSymbol },
  ];

  return (
    <div className="space-y-2 mt-2">
      {/* Strength Bar & Badge */}
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-slate-500 text-[11px] font-mono flex items-center gap-1">
          {analysis.score >= 4 ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          ) : analysis.score >= 3 ? (
            <Shield className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          )}
          Password Strength:
        </span>
        <span className={`text-[11px] font-extrabold uppercase font-mono px-2 py-0.5 rounded border ${analysis.bgClass} ${analysis.colorClass}`}>
          {analysis.label} ({analysis.score}/5)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <div
          className={`h-full transition-all duration-300 ${analysis.barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Detailed Requirements Checklist */}
      {showRequirements && (
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {requirements.map((req, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 text-[10px] font-medium transition-all ${
                req.met ? 'text-emerald-700 font-bold' : 'text-slate-400'
              }`}
            >
              {req.met ? (
                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
              ) : (
                <X className="w-3 h-3 text-slate-300 shrink-0" />
              )}
              <span>{req.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
