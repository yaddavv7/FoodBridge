import React from 'react';
import { Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Utensils, Clock, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import UrgencyBadge from './UrgencyBadge';
import { obfuscateAddress } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function DonationCard({ donation }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { acceptDonation } = useData();

  if (!donation) return null;

  const isOwner = currentUser?.id === donation.donorId;
  const isNgo = currentUser?.role === 'ngo';
  const displayAddress = obfuscateAddress(donation.pickupAddress, donation.publicApproxLocation);

  const statusStyles = {
    LISTED: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300',
    ACCEPTED: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300',
    PICKUP_SCHEDULED: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300',
    PICKED_UP: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300',
    DELIVERED: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300',
    VERIFIED: 'bg-emerald-100 text-forest-800 border-emerald-300 dark:bg-forest-900/50 dark:text-mint-300',
    EXPIRED: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
  }[donation.status] || 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <div className="group bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={donation.photoUrl}
          alt={donation.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white">
            {donation.category}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-md ${
              donation.dietaryType === 'Vegetarian'
                ? 'bg-emerald-600/90 text-white'
                : 'bg-amber-600/90 text-white'
            }`}
          >
            {donation.dietaryType}
          </span>
        </div>

        {/* Status Pill */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md ${statusStyles}`}>
            {donation.status}
          </span>
        </div>

        {/* Quantity Overlay */}
        <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-darkcard/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm border border-slate-200 dark:border-darkborder flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
          <Utensils className="w-3.5 h-3.5 text-forest-600 dark:text-mint-400" />
          <span>{donation.estimatedPortions || donation.quantity} Portions</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <UrgencyBadge donation={donation} />
        </div>

        <h3
          onClick={() => navigate(`/donations/${donation.id}`)}
          className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1 hover:text-forest-700 dark:hover:text-mint-400 cursor-pointer transition-colors mb-1"
        >
          {donation.title}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed flex-1">
          {donation.description}
        </p>

        {/* Metadata info */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-darkborder text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">Donor Entity:</span>
            <span className="font-semibold truncate max-w-[170px]">{donation.donorName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">Location:</span>
            <span className="truncate max-w-[170px] text-slate-500 dark:text-slate-400" title={displayAddress}>
              {displayAddress}
            </span>
          </div>

          {donation.matchedNgoName && (
            <div className="flex items-center justify-between text-forest-700 dark:text-mint-400 font-medium">
              <span className="text-[11px]">Matched NGO:</span>
              <span className="truncate max-w-[170px]">{donation.matchedNgoName}</span>
            </div>
          )}
        </div>

        {/* Card Action Footers */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-darkborder flex items-center gap-2">
          <button
            onClick={() => navigate(`/donations/${donation.id}`)}
            className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-darkborder hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors text-center"
          >
            View Details
          </button>

          {isOwner && donation.status === 'LISTED' && (
            <button
              onClick={() => navigate(`/matching/${donation.id}`)}
              className="py-2 px-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
            >
              Smart Match <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {isNgo && donation.status === 'LISTED' && (
            <button
              onClick={() => acceptDonation(donation.id)}
              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
            >
              Accept Rescue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
