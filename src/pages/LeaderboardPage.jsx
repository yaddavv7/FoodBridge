import React, { useState } from 'react';
import { 
  Trophy, Award, Utensils, Building2, Bike, Star, 
  Sparkles, CheckCircle2, ShieldCheck, Medal 
} from 'lucide-react';
import { DEMO_LEADERBOARD } from '../data/demoData';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('donors'); // 'donors' | 'ngos' | 'volunteers'

  const badges = [
    { name: 'First Rescue', icon: '🌱', desc: 'Completed 1st verified food rescue', req: '1 Rescue' },
    { name: '100 Portions Rescued', icon: '🍲', desc: 'Saved over 100 wholesome portions', req: '100+ Portions' },
    { name: 'Food Hero', icon: '🦸', desc: 'Saved over 500 wholesome meals', req: '500+ Portions' },
    { name: 'Community Champion', icon: '🏆', desc: '10+ verified rescue handovers', req: '10+ Rescues' },
    { name: 'Reliable Courier', icon: '🚴', desc: 'Completed 20+ thermal bike deliveries', req: '20+ Deliveries' },
    { name: 'Zero-Waste Pioneer', icon: '🌍', desc: 'Saved over 1,000 meals from landfill', req: '1,000+ Portions' },
  ];

  return (
    <div className="py-8 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-warm-100 text-warm-900 dark:bg-warm-950/60 dark:text-warm-300">
            <Trophy className="w-3.5 h-3.5 text-warm-600" />
            <span>Community Impact Recognition</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            FoodBridge Impact Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Celebrating restaurants, charitable kitchens, and volunteer couriers actively eliminating food waste.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
            <button
              onClick={() => setActiveTab('donors')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'donors'
                  ? 'bg-forest-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Utensils className="w-4 h-4" />
              Food Donors
            </button>

            <button
              onClick={() => setActiveTab('ngos')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'ngos'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              NGO Pantries
            </button>

            <button
              onClick={() => setActiveTab('volunteers')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'volunteers'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Bike className="w-4 h-4" />
              Eco-Couriers
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white dark:bg-darkcard rounded-3xl border border-slate-200 dark:border-darkborder shadow-card overflow-hidden">
          <div className="p-4 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-100 dark:border-darkborder flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Rank & Entity Name</span>
            <div className="flex items-center gap-8">
              <span>Portions / Volume</span>
              <span>Impact Points</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {activeTab === 'donors' &&
              DEMO_LEADERBOARD.donors.map(d => (
                <div key={d.rank} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${
                      d.rank === 1
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : d.rank === 2
                        ? 'bg-slate-200 text-slate-800'
                        : d.rank === 3
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'bg-slate-50 text-slate-600'
                    }`}>
                      {d.rank === 1 ? '🥇' : d.rank === 2 ? '🥈' : d.rank === 3 ? '🥉' : d.rank}
                    </div>

                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {d.name}
                        <span className="text-[10px] font-bold bg-forest-100 text-forest-800 dark:bg-forest-950/80 dark:text-mint-300 px-2 py-0.5 rounded-full border border-forest-200 dark:border-forest-800">
                          {d.badge}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {d.completedDonations} completed rescue transactions
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-right">
                    <div>
                      <span className="text-sm font-extrabold text-forest-700 dark:text-mint-400 block font-mono">
                        {d.rescuedPortions.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400">Portions</span>
                    </div>

                    <div className="w-20">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white block font-mono">
                        {d.points}
                      </span>
                      <span className="text-[10px] text-amber-600 font-semibold">Points</span>
                    </div>
                  </div>
                </div>
              ))}

            {activeTab === 'ngos' &&
              DEMO_LEADERBOARD.ngos.map(n => (
                <div key={n.rank} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-extrabold text-xs shrink-0">
                      #{n.rank}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {n.name}
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded-full">
                          {n.badge}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {n.acceptedDonations} rescue batches distributed
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-right">
                    <div>
                      <span className="text-sm font-extrabold text-blue-600 block font-mono">
                        {n.receivedPortions.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400">Meals Served</span>
                    </div>

                    <div className="w-20">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white block font-mono">
                        {n.points}
                      </span>
                      <span className="text-[10px] text-amber-600 font-semibold">Points</span>
                    </div>
                  </div>
                </div>
              ))}

            {activeTab === 'volunteers' &&
              DEMO_LEADERBOARD.volunteers.map(v => (
                <div key={v.rank} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-xs shrink-0">
                      #{v.rank}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {v.name}
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full">
                          {v.badge}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {v.deliveriesCompleted} Handover dropoffs completed ({v.distanceKm} km)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-right">
                    <div>
                      <span className="text-sm font-extrabold text-amber-600 block font-mono">
                        {v.deliveriesCompleted}
                      </span>
                      <span className="text-[10px] text-slate-400">Deliveries</span>
                    </div>

                    <div className="w-20">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white block font-mono">
                        {v.points}
                      </span>
                      <span className="text-[10px] text-amber-600 font-semibold">Points</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Impact Badge Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-warm-500" />
              Achievement & Verification Badges
            </h2>
            <span className="text-xs text-slate-400">Awarded on verified deliveries</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {badges.map(b => (
              <div
                key={b.name}
                className="p-4 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-card text-center space-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-1">{b.icon}</div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">
                    {b.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                    {b.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-darkborder text-[10px] font-bold text-forest-700 dark:text-mint-400">
                  Req: {b.req}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
