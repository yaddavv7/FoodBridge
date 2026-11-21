import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, ArrowRight, ShieldCheck, HeartHandshake, Sparkles, 
  MapPin, Clock, Utensils, CheckCircle2, ChevronRight, Award, 
  Users, Building2, Bike, Shield, Flame
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import DonationCard from '../components/donations/DonationCard';

export default function LandingPage() {
  const navigate = useNavigate();
  const { donations, impactMetrics } = useData();
  const { currentUser, switchDemoRole } = useAuth();

  // Get active listed donations for live preview
  const activeDonations = donations.filter(d => d.status === 'LISTED').slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-forest-50/60 via-offwhite to-white dark:from-darkbg dark:via-darkcard/50 dark:to-darkbg">
        {/* Subtle background ambient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-mint-300/30 dark:bg-mint-900/20 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-10 w-80 h-80 bg-warm-200/30 dark:bg-warm-900/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Trust Banner Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-forest-100 text-forest-800 dark:bg-forest-950/60 dark:text-mint-300 border border-forest-200 dark:border-forest-800 mb-6 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
            <Sparkles className="w-4 h-4 text-warm-500" />
            <span>Next-Generation Intelligent Food Rescue Platform</span>
            <span className="text-slate-400">•</span>
            <span className="font-bold">Zero-Waste Community</span>
          </div>

          {/* Main Headline & Subtitle */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Good Food Deserves a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 via-emerald-600 to-mint-500 dark:from-mint-400 dark:to-emerald-300">
              Second Chance.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect surplus food with communities that need it. Rescue food, reduce waste and create a measurable social impact.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <Link
              to="/create-donation"
              className="w-full sm:w-auto px-7 py-3.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl font-bold shadow-lg shadow-forest-900/10 hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Utensils className="w-4 h-4" />
              Donate Surplus Food
            </Link>

            <Link
              to="/browse"
              className="w-full sm:w-auto px-7 py-3.5 bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
            >
              <MapPin className="w-4 h-4 text-forest-600 dark:text-mint-400" />
              Find Food Donations
            </Link>
          </div>

          {/* Live Metric Ticker Cards */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
            <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Portions Rescued</span>
                <Utensils className="w-4 h-4 text-forest-600 dark:text-mint-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {(impactMetrics?.totalPortionsRescued || 12450).toLocaleString()}+
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                ↑ Estimated portions delivered
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Verified NGOs</span>
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {impactMetrics?.verifiedNgos || 18}+
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Audited community shelters
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Active Donors</span>
                <Users className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {impactMetrics?.activeDonors || 32}+
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Caterers, hotels & grocers
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Rescue Success Rate</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {impactMetrics?.successRate || 96}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Safe QR handover verified
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* HOW FOODBRIDGE WORKS */}
      <section className="py-20 bg-white dark:bg-darkcard/50 border-y border-slate-100 dark:border-darkborder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-forest-700 dark:text-mint-400 mb-2">
              Transparent Rescue Lifecycle
            </h2>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              From Commercial Kitchen to Community Table in 4 Steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-darkcard border border-slate-200 dark:border-darkborder relative">
              <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 dark:bg-forest-950/80 dark:text-mint-300 font-extrabold text-sm flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                1. Food Listed
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Donor publishes food portions, category, preparation time, safe collection deadline, and safety checklist.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-darkcard border border-slate-200 dark:border-darkborder relative">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 font-extrabold text-sm flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                2. Smart NGO Match
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Matching engine scores distance, capacity, urgency, and dietary category to recommend verified NGOs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-darkcard border border-slate-200 dark:border-darkborder relative">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 font-extrabold text-sm flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                3. Courier Pickup & QR
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Eco-courier claims task, confirms handover with secure single-use QR scan, and transports safely in thermal bags.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-darkcard border border-slate-200 dark:border-darkborder relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-mint-300 font-extrabold text-sm flex items-center justify-center mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                4. Verified Delivery
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                NGO confirms portions, inspects food safety, and closes transaction. Impact ledger and donor score update instantly.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* LIVE DONATION PREVIEW */}
      <section className="py-20 bg-offwhite dark:bg-darkbg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-mint-400 mb-1">
                <Flame className="w-4 h-4 text-warm-500" /> Real-Time Rescue Stream
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Active Surplus Food Ready for Pickup
              </h2>
            </div>

            <Link
              to="/browse"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 dark:text-mint-400 hover:text-forest-800 hover:underline"
            >
              View all active donations ({donations.length}) <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeDonations.map(donation => (
              <DonationCard key={donation.id} donation={donation} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/map"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder text-xs font-bold text-slate-800 dark:text-slate-100 shadow-card hover:bg-slate-50 transition-colors"
            >
              <MapPin className="w-4 h-4 text-forest-600 dark:text-mint-400" />
              Explore Interactive Donation & NGO Map
            </Link>
          </div>

        </div>
      </section>

      {/* ECOSYSTEM ROLES: DONORS, NGOS, VOLUNTEERS */}
      <section className="py-20 bg-white dark:bg-darkcard/40 border-t border-slate-100 dark:border-darkborder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-mint-400 mb-2">
              Who We Empower
            </h2>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              Built for Every Stakeholder in the Rescue Chain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* For Donors */}
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-darkcard border border-slate-200 dark:border-darkborder flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-700 dark:bg-forest-950/80 dark:text-mint-400 flex items-center justify-center mb-5">
                  <Utensils className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Food Donors
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  Restaurants, wedding banquets, hotel kitchens, corporate dining, and produce grocers.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    List 100+ surplus portions in under 60 seconds
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Automated smart matching with certified nearby NGOs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Good Samaritan legal & food safety compliance tracking
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-darkborder">
                <button
                  onClick={() => {
                    switchDemoRole('donor');
                    navigate('/donor');
                  }}
                  className="w-full py-2.5 px-4 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  Explore as Donor <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* For NGOs */}
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-darkcard border border-slate-200 dark:border-darkborder flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-400 flex items-center justify-center mb-5">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  NGOs & Shelters
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  Community soup kitchens, youth homes, elderly assistance centres, and emergency food banks.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Pre-set daily dietary and quantity requirements
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Real-time urgency notifications for hot cooked meals
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Verified digital handover and portion audit records
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-darkborder">
                <button
                  onClick={() => {
                    switchDemoRole('ngo');
                    navigate('/ngo');
                  }}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  Explore as NGO <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* For Volunteers */}
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-darkcard border border-slate-200 dark:border-darkborder flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400 flex items-center justify-center mb-5">
                  <Bike className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Eco-Courier Volunteers
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  Community couriers, cargo cyclists, and civic drivers providing thermal transit.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Turn-by-turn route details with thermal transit bags
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Instant QR scan confirmation prevents token reuse
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Earn courier reputation points and monthly rescue badges
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-darkborder">
                <button
                  onClick={() => {
                    switchDemoRole('volunteer');
                    navigate('/volunteer');
                  }}
                  className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  Explore as Courier <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SAMPLE SUCCESS STORIES & TESTIMONIALS (CLEARLY LABELED AS SAMPLE/DEMO CONTENT) */}
      <section className="py-20 bg-slate-50 dark:bg-darkbg border-t border-slate-200 dark:border-darkborder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-2 inline-block">
              Sample Case Studies • Demo Content
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Measurable Impact in Metro City
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-card flex flex-col justify-between">
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed mb-4">
                "Our banquet hall frequently had 80 to 120 unserved portions from wedding receptions. FoodBridge connects us to Green Hope Foundation in under 15 minutes, with couriers arriving with insulated bags before food temperature drops."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-darkborder">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&auto=format&fit=crop&q=80"
                  alt="Marcus Vance"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Chef Marcus Vance</div>
                  <div className="text-[11px] text-slate-400">Head Chef, Royal Spice Banquets</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-card flex flex-col justify-between">
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed mb-4">
                "As an NGO shelter serving 350 meals daily, reliability and strict hygiene are vital. FoodBridge's mandatory safety checklist and allergen disclosures give our kitchen crew absolute peace of mind."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-darkborder">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80"
                  alt="Elena Rostova"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Elena Rostova</div>
                  <div className="text-[11px] text-slate-400">Director, Green Hope Foundation</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-card flex flex-col justify-between">
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed mb-4">
                "The single-use QR handover is so clean. I scan the chef's phone when loading my cargo bike, and scan the NGO receiver's phone at dropoff. Zero paperwork, completely traceable."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-darkborder">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="David Kim"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">David Kim</div>
                  <div className="text-[11px] text-slate-400">Certified Volunteer Eco-Courier</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-16 bg-forest-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to Prevent Food Waste in Your City?
          </h2>
          <p className="text-base text-mint-200 max-w-xl mx-auto mb-8 leading-relaxed">
            Join restaurants, banquets, and charitable foundations actively rescuing edible nutrition every single day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/create-donation"
              className="px-6 py-3 bg-mint-400 hover:bg-mint-300 text-forest-950 font-bold rounded-xl text-xs shadow-md transition-colors"
            >
              Start Donating Food Now
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-forest-800 hover:bg-forest-700 text-white font-bold rounded-xl text-xs border border-forest-600 transition-colors"
            >
              Register Your Organization
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
