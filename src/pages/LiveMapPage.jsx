import React from 'react';
import { MapPin, Layers, ShieldCheck, Info } from 'lucide-react';
import { useData } from '../context/DataContext';
import DonationMap from '../components/maps/DonationMap';

export default function LiveMapPage() {
  const { donations, ngos } = useData();

  return (
    <div className="py-8 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-800 dark:bg-forest-950/60 dark:text-mint-300 mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Real-Time Geographic Redistribution</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Live Food Rescue Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Explore active surplus donations, verified NGO community kitchens, and transit routes across Metro City.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-darkcard px-4 py-2 rounded-xl border border-slate-200 dark:border-darkborder shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Stream Active ({donations.length} total listings)</span>
          </div>
        </div>

        {/* Map Component */}
        <DonationMap
          donations={donations}
          ngos={ngos}
          height="620px"
          showFilters={true}
        />

        {/* Map Guide Callout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-card space-y-1">
            <strong className="text-slate-800 dark:text-slate-200 block font-bold">
              🟢 Active Food Listings
            </strong>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Commercial kitchens with unconsumed edible meals. Click any green or red pin to view dietary type and portions.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-card space-y-1">
            <strong className="text-slate-800 dark:text-slate-200 block font-bold">
              🔵 Verified NGO Shelters
            </strong>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Audited charitable distribution kitchens and pantries equipped with food-safe refrigeration storage.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-card space-y-1">
            <strong className="text-slate-800 dark:text-slate-200 block font-bold">
              🔒 Privacy-First Obfuscation
            </strong>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Public pins represent general neighborhood vicinities. Exact kitchen loading bays are shared only with the assigned courier upon task claim.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
