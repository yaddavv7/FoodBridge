import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, Flame } from 'lucide-react';
import { evaluateDonationPriority } from '../../services/urgencyEngine';

export default function UrgencyBadge({ donation, className = '' }) {
  const [priorityData, setPriorityData] = useState(() => evaluateDonationPriority(donation));

  useEffect(() => {
    // Update live countdown every second
    const interval = setInterval(() => {
      setPriorityData(evaluateDonationPriority(donation));
    }, 1000);
    return () => clearInterval(interval);
  }, [donation]);

  const { priority, color, badgeText, countdownText, isUrgent } = priorityData;

  const colorStyles = {
    rose: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900',
    amber: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900',
    teal: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-900',
    slate: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800',
  }[color] || 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorStyles} ${className}`}>
      {isUrgent ? (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
      ) : (
        <Clock className="w-3.5 h-3.5 opacity-80" />
      )}
      <span>{badgeText}</span>
      {countdownText && (
        <span className="opacity-90 font-mono text-[11px] font-normal border-l border-current pl-1.5 ml-0.5">
          {countdownText}
        </span>
      )}
    </div>
  );
}
