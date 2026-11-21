import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, ArrowLeft, Building2, MapPin, CheckCircle2, 
  Clock, Utensils, ShieldCheck, ArrowRight, Info, AlertTriangle 
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { rankNgoMatchesForDonation } from '../services/matchingEngine';
import MatchScoreBadge from '../components/donations/MatchScoreBadge';

export default function SmartMatchingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser } = useAuth();
  const { donations, ngos, acceptDonation } = useData();

  const donation = donations.find(d => d.id === id);

  if (!donation) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Donation listing not found</h2>
        <Link to="/donor" className="text-xs font-bold text-forest-700 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Calculate and rank NGO matches using transparent rule-based algorithm
  const rankedMatches = rankNgoMatchesForDonation(donation, ngos);

  const handleSelectNgo = async (match) => {
    try {
      await acceptDonation(donation.id);
      toast.success(`Matched with ${match.ngoName}! Courier task generated.`);
      navigate(`/donations/${donation.id}`);
    } catch {
      // toast handles error
    }
  };

  return (
    <div className="py-8 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Listing
        </button>

        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-700/80 text-mint-300 border border-forest-600">
              <Sparkles className="w-3.5 h-3.5 text-warm-400" />
              <span>Smart Donor-to-NGO Compatibility Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Recommended NGO Matches
            </h1>
            <p className="text-xs sm:text-sm text-mint-200 max-w-xl">
              Calculated compatibility score out of 100 based on proximity, meal demands, safe timeline, and certified capacity.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs space-y-1">
            <div className="text-mint-300 font-bold uppercase tracking-wider text-[10px]">
              Listing Target
            </div>
            <div className="font-bold text-white text-sm line-clamp-1">{donation.title}</div>
            <div className="text-mint-100">{donation.estimatedPortions} Portions • {donation.category}</div>
          </div>
        </div>

        {/* Algorithm Transparency Notice */}
        <div className="p-4 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-xs flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
          <Info className="w-5 h-5 text-forest-600 dark:text-mint-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Transparent Scoring Engine:</strong> Scores are computed deterministically using 5 auditable criteria:
            Distance (25 pts) + Category Compatibility (20 pts) + Quantity Alignment (20 pts) + Collection Window (20 pts) + Community Urgency (15 pts). We never fabricate artificial AI recommendations.
          </div>
        </div>

        {/* Matches Ranked List */}
        <div className="space-y-4">
          {rankedMatches.map((match, idx) => (
            <div
              key={match.ngoId}
              className={`p-6 bg-white dark:bg-darkcard rounded-2xl border transition-all shadow-card ${
                idx === 0
                  ? 'border-forest-400 dark:border-forest-700 ring-2 ring-forest-500/20'
                  : 'border-slate-200 dark:border-darkborder'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-darkborder">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center font-bold text-base shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {match.ngoName}
                      </h3>
                      {match.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-mint-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Charity
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>📍 {match.ngoAddress}</span>
                      <span>•</span>
                      <span><strong>{match.distanceKm} km</strong> transit distance</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <MatchScoreBadge score={match.matchScore} />
                  
                  {donation.status === 'LISTED' && (
                    <button
                      onClick={() => handleSelectNgo(match)}
                      className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      Assign to This NGO <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Score Breakdown Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-4 pb-3 text-xs border-b border-slate-100 dark:border-darkborder text-slate-600 dark:text-slate-400">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Distance</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{match.breakdown.distanceScore} / 25 pts</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Category</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{match.breakdown.categoryScore} / 20 pts</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Quantity</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{match.breakdown.quantityScore} / 20 pts</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Time Window</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{match.breakdown.timeScore} / 20 pts</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Demand</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{match.breakdown.demandScore} / 15 pts</span>
                </div>
              </div>

              {/* Match Reasons Explanation */}
              <div className="pt-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-forest-700 dark:text-mint-400 block mb-1.5">
                  Recommendation Factors:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {match.reasons.map((r, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
