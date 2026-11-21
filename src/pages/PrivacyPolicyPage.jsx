import React from 'react';
import { ShieldCheck, Lock, EyeOff, UserCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-800 dark:bg-forest-950/60 dark:text-mint-300">
            <Lock className="w-3.5 h-3.5" />
            <span>Data Protection Standard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Privacy Policy & Address Obfuscation
          </h1>
          <p className="text-xs text-slate-400">
            Effective Date: January 1, 2026 • FoodBridge Transparency Framework
          </p>
        </div>

        <div className="bg-white dark:bg-darkcard p-8 rounded-3xl border border-slate-200 dark:border-darkborder shadow-card space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-forest-600" />
              1. Residential & Kitchen Address Privacy
            </h2>
            <p>
              FoodBridge protects commercial kitchens, caterers, and private venues by strictly obfuscating precise street addresses and suite numbers on all public interactive maps. Public viewers and unauthenticated users see only general neighborhood vicinities (approx. 300-500 meters radius). Full pickup bay instructions and donor contact details are securely unlocked exclusively to verified NGOs and assigned couriers once a donation match is mutually accepted.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-forest-600" />
              2. Single-Use Verification Tokens
            </h2>
            <p>
              Pickup and delivery handover tokens (e.g. FB-PICK-XXXX and FB-DELV-XXXX) are dynamically generated per transaction. Once a courier scans the donor's QR code, the token is permanently consumed on the platform ledger to prevent replay, duplication, or false delivery claims.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-forest-600" />
              3. Data Ownership & Non-Commercialization
            </h2>
            <p>
              FoodBridge is a social impact redistribution network. We do not sell, rent, or monetize personal donor information, volunteer location trails, or non-profit recipient data to advertising networks. Aggregated community data displayed on the public impact dashboard is fully anonymized.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-forest-600" />
              4. Role-Based Database Security
            </h2>
            <p>
              Our database architecture incorporates strict security rules. Users cannot modify or elevate their own role privileges. Only certified Platform Administrators can approve NGO tax-exempt verification certificates or modify completed transaction ledgers.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
