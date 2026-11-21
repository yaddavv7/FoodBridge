import React, { useState } from 'react';
import { 
  Search, Filter, Utensils, MapPin, Sparkles, Flame, 
  Clock, ShieldAlert, ArrowUpDown 
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import DonationCard from '../components/donations/DonationCard';
import { evaluateDonationPriority } from '../services/urgencyEngine';

export default function BrowseDonationsPage() {
  const { donations } = useData();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDiet, setSelectedDiet] = useState('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');
  const [sortBy, setSortBy] = useState('urgency'); // 'urgency' | 'portions' | 'newest'

  // Filter available donations
  const filtered = donations.filter(d => {
    // Show LISTED and in-progress items
    if (d.status === 'EXPIRED') return false;

    if (searchQuery && !d.title.toLowerCase().includes(searchQuery.toLowerCase()) && !d.donorName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (selectedCategory !== 'ALL' && d.category !== selectedCategory) {
      return false;
    }

    if (selectedDiet !== 'ALL' && d.dietaryType !== selectedDiet) {
      return false;
    }

    if (selectedUrgency !== 'ALL') {
      const priority = evaluateDonationPriority(d);
      if (priority.priority !== selectedUrgency) return false;
    }

    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'portions') {
      return (b.estimatedPortions || 0) - (a.estimatedPortions || 0);
    }
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // Urgency sort: Critical & High first
    const pA = evaluateDonationPriority(a).priority;
    const pB = evaluateDonationPriority(b).priority;
    const scoreMap = { Critical: 4, High: 3, Medium: 2, Normal: 1, Completed: 0, Expired: -1 };
    return (scoreMap[pB] || 0) - (scoreMap[pA] || 0);
  });

  const categories = [
    'ALL',
    'Cooked meals',
    'Bakery products',
    'Fruits',
    'Vegetables',
    'Packaged food',
    'Dairy products',
  ];

  return (
    <div className="py-8 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Browse Surplus Food Donations
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Active edible rescues from restaurants, catering banquets, and commercial kitchens
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Showing <strong>{sorted.length}</strong> available rescues
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white dark:bg-darkcard p-4 rounded-2xl border border-slate-200 dark:border-darkborder shadow-card space-y-3">
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search food title, caterer, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>

            {/* Dietary */}
            <select
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs font-medium focus:outline-none"
            >
              <option value="ALL">All Dietary Types</option>
              <option value="Vegetarian">🌱 Vegetarian Only</option>
              <option value="Non-vegetarian">🍗 Non-Vegetarian</option>
            </select>

            {/* Urgency */}
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs font-medium focus:outline-none"
            >
              <option value="ALL">All Urgencies</option>
              <option value="Critical">🔥 Critical (&lt;2h)</option>
              <option value="High">⚡ High Urgency (&lt;4h)</option>
              <option value="Medium">Moderate</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs font-medium focus:outline-none"
            >
              <option value="urgency">Sort by Urgency</option>
              <option value="portions">Sort by Portions</option>
              <option value="newest">Sort by Newest</option>
            </select>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-darkborder scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-forest-700 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

        </div>

        {/* Listings Grid */}
        {sorted.length === 0 ? (
          <div className="p-16 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder text-center space-y-3">
            <Utensils className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              No matching surplus food listings found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your dietary or urgency filters, or check back soon as new kitchen batches are published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map(donation => (
              <DonationCard key={donation.id} donation={donation} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
