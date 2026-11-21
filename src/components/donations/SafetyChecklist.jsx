import React from 'react';
import { ShieldCheck, Check, AlertTriangle, Thermometer, Clock, PackageCheck, HeartHandshake } from 'lucide-react';

export default function SafetyChecklist({
  checklist = {
    freshlyPrepared: true,
    safeTemperatureMaintained: true,
    foodGradePackaging: true,
    cleanHygienicHandling: true,
    noExpiredIngredients: true,
  },
  onChange,
  readOnly = false,
}) {
  const items = [
    {
      key: 'freshlyPrepared',
      label: 'Prepared & handled hygienically',
      desc: 'Cooked/handled in commercial or certified sanitary kitchen under sanitary conditions.',
      icon: HeartHandshake,
    },
    {
      key: 'safeTemperatureMaintained',
      label: 'Safe food temperature maintained',
      desc: 'Hot food held above 60°C or cold perishables refrigerated below 4°C prior to transfer.',
      icon: Thermometer,
    },
    {
      key: 'foodGradePackaging',
      label: 'Sealed food-grade containers',
      desc: 'Food is boxed, wrapped or sealed in clean, leak-resistant, food-safe containers.',
      icon: PackageCheck,
    },
    {
      key: 'noExpiredIngredients',
      label: 'No expired or spoiled ingredients',
      desc: 'No past-date dairy, sour produce, compromised cans, or damaged food items.',
      icon: ShieldCheck,
    },
    {
      key: 'cleanHygienicHandling',
      label: 'Donor food safety declaration',
      desc: 'Donor certifies food is fit for human consumption according to Good Samaritan and food rescue guidelines.',
      icon: Check,
    },
  ];

  const handleToggle = (key) => {
    if (readOnly || !onChange) return;
    onChange({
      ...checklist,
      [key]: !checklist[key],
    });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-darkborder space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-mint-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-mint-400" />
          Mandatory Food Safety Checklist
        </div>
        <span className="text-[11px] font-medium text-slate-500">
          {Object.values(checklist).filter(Boolean).length} of {items.length} Verified
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {items.map(item => {
          const checked = Boolean(checklist[item.key]);
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              onClick={() => handleToggle(item.key)}
              className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                readOnly ? 'cursor-default' : 'cursor-pointer hover:border-forest-500'
              } ${
                checked
                  ? 'bg-white dark:bg-darkcard border-emerald-200 dark:border-emerald-950/80 shadow-xs'
                  : 'bg-white/60 dark:bg-darkcard/60 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div
                className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                  checked
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-transparent'
                }`}
              >
                {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-slate-500" />
                  {item.label}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>
          <strong>Food Safety Notice:</strong> FoodBridge provides tracking and transparency. Donor entities certify initial food safety and preparation standards.
        </span>
      </div>
    </div>
  );
}
