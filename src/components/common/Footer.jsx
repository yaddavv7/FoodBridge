import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-forest-700 text-white flex items-center justify-center">
                <Sprout className="w-4 h-4 text-mint-300" />
              </div>
              <span className="text-base font-extrabold text-white">
                Food<span className="text-mint-400">Bridge</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              Rescue surplus edible food from banquets, restaurants, and grocers. Real-time matching, safe courier handovers, and transparent community redistribution.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Good Samaritan Act Compliant Workflows</span>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/map" className="hover:text-mint-400 transition-colors">
                  Interactive Live Rescue Map
                </Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-mint-400 transition-colors">
                  Browse Active Food Rescues
                </Link>
              </li>
              <li>
                <Link to="/create-donation" className="hover:text-mint-400 transition-colors">
                  List Surplus Food (Donors)
                </Link>
              </li>
              <li>
                <Link to="/verify-qr" className="hover:text-mint-400 transition-colors">
                  QR Handover Verification
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-mint-400 transition-colors">
                  Live Impact Transparency Ledger
                </Link>
              </li>
            </ul>
          </div>

          {/* User Ecosystem */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Ecosystem Roles
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/donor" className="hover:text-mint-400 transition-colors">
                  Commercial Food Donors
                </Link>
              </li>
              <li>
                <Link to="/ngo" className="hover:text-mint-400 transition-colors">
                  Verified Food Banks & NGOs
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="hover:text-mint-400 transition-colors">
                  Eco-Courier Volunteer Hub
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-mint-400 transition-colors">
                  Platform Operations & Admin
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-mint-400 transition-colors">
                  Community Impact Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Trust & Governance
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-mint-400 transition-colors">
                  About FoodBridge
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-mint-400 transition-colors">
                  Food Safety Guidelines & Terms
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-mint-400 transition-colors">
                  Privacy Policy & Data Security
                </Link>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-[11px] leading-snug text-slate-300">
              💡 <strong>Safety Standard:</strong> FoodBridge mandates strict donor preparation declarations, allergen disclosures, and temperature-safe timelines.
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} FoodBridge Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            Built for Social Impact with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by Senior Software Engineers.
          </div>
        </div>
      </div>
    </footer>
  );
}
