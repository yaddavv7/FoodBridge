import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, Search, Filter, Utensils, Clock, CheckCircle2, 
  ArrowRight, QrCode, AlertTriangle, ArrowUpDown 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import DonationCard from '../components/donations/DonationCard';

export default function MyDonationsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { donations } = useData();

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter for this donor
  const myDonations = donations.filter(
    d => d.donorId === currentUser?.id || d.donorName === currentUser?.organization
  );

  const filtered = myDonations.filter(d => {
    if (activeTab === 'LISTED' && d.status !== 'LISTED') return false;
    if (activeTab === 'IN_TRANSIT' && !['ACCEPTED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'DELIVERED'].includes(d.status)) return false;
    if (activeTab === 'VERIFIED' && d.status !== 'VERIFIED') return false;
    if (activeTab === 'EXPIRED' && d.status !== 'EXPIRED') return false;
    if (searchQuery && !d.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="py-8 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              My Food Rescue Listings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track active, in-transit and verified donations from your kitchen
            </p>
          </div>

          <Link
            to="/create-donation"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-sm transition-colors self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            List Surplus Food
          </Link>
        </div>

        {/* Filter Bar & Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-darkcard p-3 rounded-2xl border border-slate-200 dark:border-darkborder shadow-card">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {[
              { id: 'ALL', label: 'All Listings', count: myDonations.length },
              { id: 'LISTED', label: 'Awaiting Match', count: myDonations.filter(d => d.status === 'LISTED').length },
              { id: 'IN_TRANSIT', label: 'In Transit', count: myDonations.filter(d => ['ACCEPTED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'DELIVERED'].includes(d.status)).length },
              { id: 'VERIFIED', label: 'Verified Rescues', count: myDonations.filter(d => d.status === 'VERIFIED').length },
              { id: 'EXPIRED', label: 'Expired', count: myDonations.filter(d => d.status === 'EXPIRED').length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-forest-100 text-forest-800 dark:bg-forest-950/80 dark:text-mint-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Listings Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder text-center space-y-3">
            <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
              No matching listings found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are no food donations matching your active filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(donation => (
              <DonationCard key={donation.id} donation={donation} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
