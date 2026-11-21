import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, ShieldCheck, HeartHandshake, Award, Target, 
  Sparkles, CheckCircle2, ArrowRight, Users, Globe2, Leaf
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-12 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-800 dark:bg-forest-950/60 dark:text-mint-300">
            <Sprout className="w-3.5 h-3.5" />
            <span>Our Mission & Technology</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Bridging the Surplus Divide
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Every day, thousands of kilograms of gourmet, edible food are prepared for events, hotels, and corporate buffets but go unconsumed. FoodBridge provides the software logistics to redistribute this food safely and swiftly.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-card">
            <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-700 dark:bg-forest-950 dark:text-mint-400 flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Hyper-Local Smart Matching
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Our transparent 100-point compatibility engine pairs commercial kitchens with nearby verified charities based on real-time transit distance, dietary needs, and storage capacity.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-card">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-mint-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Food Safety & Trust Standard
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We never guess food safety. Every listing requires donor temperature declarations, preparation timestamps, allergen disclosures, and physical handoff verification.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-card">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center mb-4">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Measurable Transparency
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every completed rescue transaction updates our public community impact ledger with verifiable portion metrics, zero fabricated claims, and complete donor privacy protection.
            </p>
          </div>
        </div>

        {/* Legal & Good Samaritan Protection */}
        <div className="p-8 bg-forest-900 text-white rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-mint-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            Good Samaritan Food Protection Framework
          </div>
          <h2 className="text-2xl font-bold">
            Protecting Food Donors and Charitable Partners
          </h2>
          <p className="text-xs sm:text-sm text-mint-100 leading-relaxed">
            Under Good Samaritan food donation legislation, businesses and non-profits that donate apparently wholesome food in good faith are protected from civil and criminal liability. FoodBridge codifies this protection by establishing clear electronic chain-of-custody, preparation logs, and temperature checklists before any volunteer transit occurs.
          </p>
        </div>

        {/* CTA */}
        <div className="p-8 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-card text-center space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Join the FoodBridge Movement
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Whether you manage an industrial hotel kitchen, operate a community pantry, or want to deliver meals on your cargo bike, there is a place for you.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold shadow-sm transition-colors"
            >
              Register Your Entity
            </Link>
            <Link
              to="/map"
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-darkborder text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Explore Live Map
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
