import React from 'react';
import { Sparkles, Info } from 'lucide-react';

export default function MatchScoreBadge({ score = 90, showTooltip = false }) {
  let colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';

  if (score < 60) {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
  } else if (score < 40) {
    colorClass = 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${colorClass}`}>
      <Sparkles className="w-3.5 h-3.5 text-warm-500 shrink-0" />
      <span>{score}% Match</span>
    </div>
  );
}
