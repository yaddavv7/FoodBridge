import React from 'react';
import { ShieldCheck, AlertTriangle, Thermometer, Clock, HeartHandshake, CheckCircle2 } from 'lucide-react';

export default function TermsGuidelinesPage() {
  return (
    <div className="py-12 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-800 dark:bg-forest-950/60 dark:text-mint-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Health & Safety Compliance Standard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Terms of Service & Food Safety Protocols
          </h1>
          <p className="text-xs text-slate-400">
            Mandatory Standards for All Food Donors, Charitable Receivers, and Volunteer Couriers
          </p>
        </div>

        <div className="bg-white dark:bg-darkcard p-8 rounded-3xl border border-slate-200 dark:border-darkborder shadow-card space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 space-y-1">
            <strong className="block font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Critical Food Safety Disclosure:
            </strong>
            <p className="text-xs">
              FoodBridge is an intelligent coordination platform. The platform does <strong>not</strong> perform automated biological laboratory certifications. The primary responsibility for initial food hygiene, sanitary preparation, and accurate temperature maintenance rests with the donating commercial food establishment.
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-forest-600" />
              1. Temperature Control Thresholds
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Hot Prepared Meals:</strong> Must be held and staged at or above <strong>60°C (140°F)</strong> continuously prior to courier pickup, and transferred in insulated thermal carriers.</li>
              <li><strong>Cold & Perishable Foods:</strong> Dairy, dressings, and sliced meats must be maintained at or below <strong>4°C (40°F)</strong>.</li>
              <li><strong>Danger Zone Prohibition:</strong> Cooked food left in the ambient danger zone (4°C to 60°C) for more than 2 hours is strictly ineligible for platform redistribution and must be responsibly composted.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-forest-600" />
              2. Strict Safe Collection Deadlines
            </h2>
            <p>
              Every donation listing requires an explicit safe collection deadline configured by the donor kitchen manager. When this deadline passes, the system <strong>automatically marks the listing as EXPIRED</strong>. Under no circumstances does the system extend deadlines automatically, and expired listings cannot be accepted or picked up.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-forest-600" />
              3. Good Samaritan Food Donation Act Protection
            </h2>
            <p>
              Donors and non-profits who donate or distribute apparently wholesome food in good faith are protected from civil liability under federal and regional Good Samaritan Food Donation statutes. FoodBridge assists in maintaining this protection by providing an immutable electronic audit trail, preparation timestamps, and physical inspection receipts.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-forest-600" />
              4. Packaging & Mandatory Allergen Disclosure
            </h2>
            <p>
              Food must be packaged in clean, leak-resistant, food-grade disposable containers or reusable catering cambros. Donors must disclose all major allergens (gluten, dairy, eggs, peanuts, tree nuts, soy, shellfish, mustard) during listing creation to protect vulnerable shelter beneficiaries.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              5. Unsafe Food Reporting & Halting Protocol
            </h2>
            <p>
              Any courier or NGO partner has the right and duty to inspect food prior to acceptance. If signs of spoilage, container tampering, or temperature abuse are observed, users can immediately trigger the <strong>"Report Food Safety Concern"</strong> button. This places an immediate administrative freeze on the donation and escalates the incident to Platform Compliance.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
