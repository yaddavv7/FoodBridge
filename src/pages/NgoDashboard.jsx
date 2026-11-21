import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, Utensils, Clock, CheckCircle2, AlertTriangle, 
  ArrowRight, Search, ShieldCheck, Bike, Flame, Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import DonationCard from '../components/donations/DonationCard';
import UrgencyBadge from '../components/donations/UrgencyBadge';

export default function NgoDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { donations } = useData();

  // Incoming or matched donations for this NGO
  const myIncoming = donations.filter(
    d => d.matchedNgoId === currentUser?.id || d.matchedNgoName === currentUser?.organization
  );

  const awaitingPickup = myIncoming.filter(d => ['ACCEPTED', 'PICKUP_SCHEDULED'].includes(d.status));
  const inTransit = myIncoming.filter(d => d.status === 'PICKED_UP');
  const deliveredAwaitingConfirm = myIncoming.filter(d => d.status === 'DELIVERED');
  const verifiedHistory = myIncoming.filter(d => d.status === 'VERIFIED');

  // Urgent surplus recommendations
  const urgentListings = donations.filter(
    d => d.status === 'LISTED' && (d.category === 'Cooked meals' || d.estimatedPortions >= 60)
  ).slice(0, 3);

  const totalPortionsReceived = verifiedHistory.reduce((sum, d) => sum + (d.verifiedPortions || d.estimatedPortions || 0), 0) + 4890;

  return (
    <div className="py-8 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/60 text-blue-300 border border-blue-700">
              <Building2 className="w-3.5 h-3.5" />
              <span>Verified Food Bank & Community Shelter</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentUser?.organization || 'Green Hope Foundation'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 max-w-xl">
              Coordinating safe surplus meal intake for community food security. Daily intake capacity: <strong>350 Portions</strong>.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/browse"
              className="px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Browse Active Surplus
            </Link>
            <Link
              to="/map"
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
            >
              Live Map
            </Link>
          </div>
        </div>

        {/* Action Alert if courier is waiting at facility */}
        {deliveredAwaitingConfirm.length > 0 && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Courier Arrived! ({deliveredAwaitingConfirm.length} delivery pending confirmation)
                </h3>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  Please inspect delivered food containers and confirm portion verification.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/donations/${deliveredAwaitingConfirm[0].id}`)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap"
            >
              Confirm Receipt Now
            </button>
          </div>
        )}

        {/* 4 Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Portions Received</span>
              <Utensils className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalPortionsReceived.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
              Redistributed to shelter tables
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Incoming Rescues</span>
              <Bike className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {awaitingPickup.length + inTransit.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 inline-block">
              En route with volunteer couriers
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Daily Meal Quota</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              265 / 350
            </div>
            <span className="text-[11px] text-slate-500 mt-1 inline-block">
              75% of daily target met
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Status & Trust</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-base font-extrabold text-emerald-600 dark:text-mint-400 mt-1">
              Verified Non-Profit
            </div>
            <span className="text-[11px] text-slate-500 mt-1 inline-block">
              Commercial Storage Certified
            </span>
          </div>
        </div>

        {/* Incoming Rescues Tracking */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bike className="w-5 h-5 text-amber-500" />
              Incoming Food Rescues ({myIncoming.filter(d => d.status !== 'VERIFIED').length})
            </h2>
          </div>

          {myIncoming.filter(d => d.status !== 'VERIFIED').length === 0 ? (
            <div className="p-8 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder text-center space-y-2">
              <Utensils className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No active incoming deliveries right now
              </div>
              <p className="text-[11px] text-slate-400">
                Browse open catering and restaurant surplus listings to claim nutritious meals for today's distribution.
              </p>
              <Link
                to="/browse"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-blue-700"
              >
                Browse Open Donations
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myIncoming.filter(d => d.status !== 'VERIFIED').map(donation => (
                <DonationCard key={donation.id} donation={donation} />
              ))}
            </div>
          )}
        </div>

        {/* Urgent Recommended Surplus Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" />
                Urgent High-Volume Surplus Available for Claiming
              </h2>
              <p className="text-xs text-slate-400">
                Cooked meals and nutritious perishable items requiring immediate collection
              </p>
            </div>

            <Link
              to="/browse"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              View all ({donations.filter(d => d.status === 'LISTED').length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {urgentListings.map(donation => (
              <DonationCard key={donation.id} donation={donation} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
