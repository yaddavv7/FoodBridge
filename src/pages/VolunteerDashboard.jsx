import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bike, Trophy, Award, MapPin, QrCode, CheckCircle2, 
  Clock, ArrowRight, ShieldCheck, Flame, Compass 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { tasks, claimTask } = useData();

  // Tasks claimed by this courier
  const myTasks = tasks.filter(
    t => t.assignedVolunteerId === currentUser?.id || t.assignedVolunteerName === currentUser?.name
  );

  const activeTasks = myTasks.filter(t => ['ASSIGNED', 'PICKED_UP'].includes(t.status));
  const completedTasks = myTasks.filter(t => t.status === 'DELIVERED');

  // Open tasks available to be claimed
  const openTasks = tasks.filter(t => t.status === 'AVAILABLE');

  const handleClaim = async (taskId) => {
    try {
      await claimTask(taskId);
      navigate(`/volunteer/delivery/${taskId}`);
    } catch {
      // toast handles error
    }
  };

  return (
    <div className="py-8 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-900/60 text-amber-300 border border-amber-700">
              <Bike className="w-3.5 h-3.5" />
              <span>Certified Volunteer Eco-Courier</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-amber-200 max-w-xl">
              Equipped with {currentUser?.vehicleType || 'Electric Cargo Bike / Thermal Carrier'} • Transporting surplus nutrition to city soup kitchens.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/verify-qr"
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              Scan Handover QR
            </Link>
            <Link
              to="/map"
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
            >
              Route Map
            </Link>
          </div>
        </div>

        {/* 4 Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Deliveries Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {currentUser?.deliveriesCompleted || 38}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
              100% verified handovers
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Transit Distance</span>
              <Compass className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              142.5 km
            </div>
            <span className="text-[11px] text-slate-500 mt-1 inline-block">
              Zero-emission courier travel
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Courier Points</span>
              <Trophy className="w-4 h-4 text-warm-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {currentUser?.impactPoints || 450} pts
            </div>
            <span className="text-[11px] text-slate-500 mt-1 inline-block">
              Rank #1 Eco-Courier
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Active Deliveries</span>
              <Bike className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {activeTasks.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 inline-block">
              Claimed and en route
            </span>
          </div>
        </div>

        {/* Active Claimed Deliveries */}
        {activeTasks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bike className="w-5 h-5 text-amber-500" />
              Active En Route Tasks ({activeTasks.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTasks.map(t => (
                <div key={t.id} className="p-5 bg-white dark:bg-darkcard rounded-2xl border border-amber-200 dark:border-amber-900/60 shadow-card space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                      STATUS: {t.status}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Est. {t.distanceKm} km transit
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {t.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t.estimatedPortions} Portions • {t.category}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-darkborder">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 shrink-0">Pickup:</span>
                      <strong className="truncate">{t.donorName} ({t.pickupAddress})</strong>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 shrink-0">Dropoff:</span>
                      <strong className="truncate">{t.ngoName} ({t.deliveryAddress})</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/volunteer/delivery/${t.id}`)}
                      className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors text-center"
                    >
                      View Turn-by-Turn Route
                    </button>
                    <Link
                      to={`/donations/${t.donationId}`}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Handover
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Open Tasks to Claim */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" />
                Available Food Rescue Tasks Near You
              </h2>
              <p className="text-xs text-slate-400">
                Claim a transit task to collect food from kitchens and deliver to verified pantries
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {openTasks.length} tasks ready
            </span>
          </div>

          {openTasks.length === 0 ? (
            <div className="p-8 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder text-center space-y-2">
              <Bike className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                All nearby tasks are currently claimed!
              </div>
              <p className="text-[11px] text-slate-400">
                Check back shortly as NGOs accept incoming catering listings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {openTasks.map(task => (
                <div key={task.id} className="p-5 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-card flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-mint-400 px-2.5 py-0.5 rounded-full border border-forest-200 dark:border-forest-800">
                        {task.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-600">
                        {task.distanceKm} km away
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {task.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {task.estimatedPortions} Portions
                      </p>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 text-[11px]">
                      <div>📍 From: <strong>{task.donorName}</strong></div>
                      <div>🎯 To: <strong>{task.ngoName}</strong></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-darkborder">
                    <button
                      onClick={() => handleClaim(task.id)}
                      className="w-full py-2.5 px-3 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      Claim This Delivery Task <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
