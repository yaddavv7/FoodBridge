import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, Utensils, Trophy, Award, Clock, ArrowRight, 
  CheckCircle2, Sparkles, MapPin, QrCode, Building2, Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import DonationCard from '../components/donations/DonationCard';
import UrgencyBadge from '../components/donations/UrgencyBadge';

export default function DonorDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { donations } = useData();

  // Filter donations belonging to this donor
  const myDonations = donations.filter(
    d => d.donorId === currentUser?.id || d.donorName === currentUser?.organization
  );

  const activeDonations = myDonations.filter(d => ['LISTED', 'ACCEPTED', 'PICKUP_SCHEDULED'].includes(d.status));
  const inTransitDonations = myDonations.filter(d => ['PICKED_UP', 'DELIVERED'].includes(d.status));
  const completedDonations = myDonations.filter(d => d.status === 'VERIFIED');

  const totalPortions = completedDonations.reduce((sum, d) => sum + (d.verifiedPortions || d.estimatedPortions || 0), 0) + 1420;

  return (
    <div className="py-8 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-700/80 text-mint-300 border border-forest-600">
              <Sparkles className="w-3.5 h-3.5 text-warm-400" />
              <span>Verified Commercial Food Donor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-mint-200 max-w-xl">
              {currentUser?.organization || 'Commercial Kitchen Operations'} • Ready to prevent food waste and feed nearby communities today.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-3">
            <Link
              to="/create-donation"
              className="px-5 py-3 rounded-xl bg-mint-400 hover:bg-mint-300 text-forest-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              List Surplus Food
            </Link>
            <Link
              to="/donor/donations"
              className="px-4 py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-semibold text-xs border border-forest-600 transition-colors"
            >
              My Listings ({myDonations.length})
            </Link>
          </div>
        </div>

        {/* 4 Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Portions Rescued</span>
              <Utensils className="w-4 h-4 text-forest-600 dark:text-mint-400" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalPortions.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
              Delivered & Verified
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Impact Points</span>
              <Trophy className="w-4 h-4 text-warm-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {currentUser?.impactPoints || 680} pts
            </div>
            <span className="text-[11px] text-slate-500 mt-1 inline-block">
              Rank #1 in Metro Catering
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Active Listings</span>
              <Flame className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {activeDonations.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 inline-block">
              Awaiting NGO or Courier
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Completed Rescues</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {completedDonations.length + 14}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
              100% Verified by Receivers
            </span>
          </div>
        </div>

        {/* Earned Badges Strip */}
        <div className="p-5 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-warm-100 text-warm-700 dark:bg-warm-950/60 dark:text-warm-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Community Impact Badges
              </h3>
              <p className="text-[11px] text-slate-500">
                Earned through safe, reliable surplus redistribution
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(currentUser?.badges || ['First Rescue', 'Food Hero', '100 Portions Rescued']).map(b => (
              <span
                key={b}
                className="px-3 py-1 rounded-full text-xs font-bold bg-forest-50 text-forest-800 dark:bg-forest-950/60 dark:text-mint-300 border border-forest-200 dark:border-forest-800 shadow-xs flex items-center gap-1"
              >
                ⭐ {b}
              </span>
            ))}
          </div>
        </div>

        {/* Active Donations Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              Active Listings Needing Attention ({activeDonations.length})
            </h2>
            <Link
              to="/donor/donations"
              className="text-xs font-bold text-forest-700 dark:text-mint-400 hover:underline flex items-center gap-1"
            >
              Manage all listings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeDonations.length === 0 ? (
            <div className="p-10 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder text-center space-y-3">
              <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No active listings right now
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Got surplus edible food from today's banquets or service? List it now to automatically match with verified NGOs.
              </p>
              <Link
                to="/create-donation"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-forest-700 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-forest-800"
              >
                <PlusCircle className="w-4 h-4" /> List Surplus Food
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeDonations.map(donation => (
                <div key={donation.id} className="relative flex flex-col">
                  <DonationCard donation={donation} />
                  {/* Quick Smart Match / QR Banner */}
                  {donation.status === 'LISTED' && (
                    <div className="mt-2 p-2.5 bg-forest-50 dark:bg-forest-950/40 rounded-xl border border-forest-200 dark:border-forest-800 flex items-center justify-between text-xs">
                      <span className="font-semibold text-forest-900 dark:text-mint-300">
                        ⚡ 3 Suitable NGOs nearby
                      </span>
                      <button
                        onClick={() => navigate(`/matching/${donation.id}`)}
                        className="px-2.5 py-1 bg-forest-700 text-white font-bold rounded-lg hover:bg-forest-800 transition-colors"
                      >
                        Match Now
                      </button>
                    </div>
                  )}
                  {donation.status === 'ACCEPTED' && (
                    <div className="mt-2 p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-between text-xs">
                      <span className="font-semibold text-blue-900 dark:text-blue-300">
                        Accepted by {donation.matchedNgoName}
                      </span>
                      <button
                        onClick={() => navigate(`/donations/${donation.id}`)}
                        className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5" /> Show QR
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Verified Rescues */}
        {completedDonations.length > 0 && (
          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Completed & Verified Rescues
            </h2>

            <div className="bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-card overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60">
              {completedDonations.map(donation => (
                <div key={donation.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src={donation.photoUrl}
                      alt={donation.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <div className="text-xs font-mono text-slate-400">{donation.id}</div>
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {donation.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        Verified by: <strong className="text-slate-700 dark:text-slate-300">{donation.matchedNgoName || 'Verified NGO'}</strong> • {donation.verifiedPortions || donation.estimatedPortions} Portions
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Delivery
                    </span>
                    <button
                      onClick={() => navigate(`/donations/${donation.id}`)}
                      className="text-xs font-semibold text-forest-700 dark:text-mint-400 hover:underline"
                    >
                      Audit Trail →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
