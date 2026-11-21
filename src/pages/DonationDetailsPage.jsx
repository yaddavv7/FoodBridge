import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Utensils, Calendar, Clock, MapPin, Phone, 
  ShieldCheck, AlertTriangle, QrCode, CheckCircle2, User, 
  Building2, Bike, Sparkles, ChevronRight, Check 
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatDateTime, getTimeRemaining } from '../utils/dateUtils';
import { obfuscateAddress } from '../utils/helpers';
import UrgencyBadge from '../components/donations/UrgencyBadge';
import SafetyChecklist from '../components/donations/SafetyChecklist';
import QRCodeGenerator from '../components/qr/QRCodeGenerator';
import QRCodeScannerModal from '../components/qr/QRCodeScannerModal';
import ReportUnsafeModal from '../components/donations/ReportUnsafeModal';

export default function DonationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser } = useAuth();
  const { 
    donations, acceptDonation, verifyPickup, 
    verifyDelivery, confirmReceipt 
  } = useData();

  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerType, setScannerType] = useState('pickup'); // 'pickup' | 'delivery'
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // NGO verification form state
  const [verifiedPortionsInput, setVerifiedPortionsInput] = useState('');
  const [safetyCheckPassed, setSafetyCheckPassed] = useState(true);
  const [feedbackNotes, setFeedbackNotes] = useState('');

  const donation = donations.find(d => d.id === id);

  if (!donation) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Donation listing not found</h2>
        <Link to="/browse" className="text-xs font-bold text-forest-700 hover:underline">
          Return to browse
        </Link>
      </div>
    );
  }

  const isOwner = currentUser?.id === donation.donorId;
  const isNgo = currentUser?.role === 'ngo';
  const isVolunteer = currentUser?.role === 'volunteer';
  const isAdmin = currentUser?.role === 'admin';

  // Only authorized participants see the precise address!
  const isAuthorized = isOwner || isAdmin || 
    (isNgo && donation.matchedNgoId === currentUser?.id) ||
    (isVolunteer && donation.assignedVolunteerId === currentUser?.id);

  const displayAddress = isAuthorized
    ? donation.pickupAddress
    : obfuscateAddress(donation.pickupAddress, donation.publicApproxLocation);

  // Workflow steps definition
  const steps = [
    { key: 'LISTED', label: '1. Food Listed', done: true },
    { key: 'ACCEPTED', label: '2. NGO Accepted', done: ['ACCEPTED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'DELIVERED', 'VERIFIED'].includes(donation.status) },
    { key: 'PICKUP_SCHEDULED', label: '3. Courier Assigned', done: ['PICKUP_SCHEDULED', 'PICKED_UP', 'DELIVERED', 'VERIFIED'].includes(donation.status) },
    { key: 'PICKED_UP', label: '4. Picked Up (QR Scanned)', done: ['PICKED_UP', 'DELIVERED', 'VERIFIED'].includes(donation.status) },
    { key: 'DELIVERED', label: '5. Delivered to NGO', done: ['DELIVERED', 'VERIFIED'].includes(donation.status) },
    { key: 'VERIFIED', label: '6. Verified by Receiver', done: donation.status === 'VERIFIED' },
  ];

  // Actions
  const handleAcceptByNgo = async () => {
    try {
      await acceptDonation(donation.id);
    } catch {
      // toast handles error
    }
  };

  const handleVerifyHandover = async (scannedToken) => {
    if (scannerType === 'pickup') {
      await verifyPickup(donation.id, scannedToken);
    } else {
      await verifyDelivery(donation.id, scannedToken);
    }
  };

  const handleConfirmFinalReceipt = async (e) => {
    e.preventDefault();
    try {
      await confirmReceipt(donation.id, {
        verifiedPortions: Number(verifiedPortionsInput || donation.estimatedPortions),
        safetyInspectionPassed: safetyCheckPassed,
        feedbackNotes,
      });
    } catch {
      // toast handles error
    }
  };

  return (
    <div className="py-8 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Listings
          </button>

          <button
            onClick={() => setReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Report Safety Concern
          </button>
        </div>

        {/* Safety flag banner if reported */}
        {donation.safetyFlagged && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900 rounded-2xl flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Listing Under Platform Review</strong>
              A food safety concern was logged: <em>"{donation.safetyFlagReason}"</em>. An administrator is investigating.
            </div>
          </div>
        )}

        {/* Top Hero Card */}
        <div className="bg-white dark:bg-darkcard rounded-3xl border border-slate-200 dark:border-darkborder shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Photo Column */}
          <div className="lg:col-span-5 relative min-h-[280px] bg-slate-100 dark:bg-slate-800">
            <img
              src={donation.photoUrl}
              alt={donation.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white">
                {donation.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600/90 backdrop-blur-md text-white">
                {donation.dietaryType}
              </span>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-slate-400">
                  REF: {donation.id}
                </span>
                <UrgencyBadge donation={donation} />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
                {donation.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {donation.description}
              </p>

              {/* Primary Key Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-darkborder text-xs mb-6">
                <div>
                  <span className="text-slate-400 text-[11px] block">Portions Rescued</span>
                  <span className="font-extrabold text-base text-forest-700 dark:text-mint-400">
                    {donation.estimatedPortions} Portions
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Prepared At</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {formatDateTime(donation.prepTime)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Safe Collection By</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    {formatDateTime(donation.deadline)}
                  </span>
                </div>
              </div>
            </div>

            {/* Donor Entity Info */}
            <div className="pt-4 border-t border-slate-100 dark:border-darkborder flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest-100 text-forest-700 dark:bg-forest-950 dark:text-mint-400 flex items-center justify-center font-bold">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {donation.donorName}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    📍 {displayAddress}
                  </div>
                </div>
              </div>

              {/* Primary Context Actions */}
              <div className="flex items-center gap-2">
                {isOwner && donation.status === 'LISTED' && (
                  <button
                    onClick={() => navigate(`/matching/${donation.id}`)}
                    className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-warm-400" />
                    Match Verified NGOs
                  </button>
                )}

                {isNgo && donation.status === 'LISTED' && (
                  <button
                    onClick={handleAcceptByNgo}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5"
                  >
                    Accept Donation Rescue
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* 6-Step Visual Lifecycle Tracker */}
        <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-slate-200 dark:border-darkborder shadow-card">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4">
            Live Handover Progression Lifecycle
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {steps.map((st, idx) => (
              <div
                key={st.key}
                className={`p-3 rounded-xl border text-center transition-colors flex flex-col items-center gap-1.5 ${
                  st.done
                    ? 'bg-forest-50 border-forest-300 text-forest-900 dark:bg-forest-950/60 dark:text-mint-300 dark:border-forest-800'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-darkborder text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    st.done
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {st.done ? '✓' : idx + 1}
                </div>
                <span className="text-[11px] font-bold leading-tight">
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Section: QR Code / Handover actions & Detailed Audit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: QR Verification & Handover Action Box */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* If Accepted or In Transit: Render QR Code */}
            {['ACCEPTED', 'PICKUP_SCHEDULED'].includes(donation.status) && (
              <div className="space-y-4">
                <QRCodeGenerator
                  donation={donation}
                  type="pickup"
                />

                {/* Courier Scanner Button */}
                {(isVolunteer || isAdmin) && (
                  <button
                    onClick={() => {
                      setScannerType('pickup');
                      setScannerOpen(true);
                    }}
                    className="w-full py-3 px-4 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    Scan Pickup Handover QR (Volunteer Courier)
                  </button>
                )}
              </div>
            )}

            {/* If Picked Up: Render Delivery QR */}
            {donation.status === 'PICKED_UP' && (
              <div className="space-y-4">
                <QRCodeGenerator
                  donation={donation}
                  type="delivery"
                />

                {/* Handover Delivery Confirmation Button */}
                {(isVolunteer || isNgo || isAdmin) && (
                  <button
                    onClick={() => {
                      setScannerType('delivery');
                      setScannerOpen(true);
                    }}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    Scan Delivery Handover QR
                  </button>
                )}
              </div>
            )}

            {/* If Delivered: NGO Final Receipt & Portion Inspection */}
            {donation.status === 'DELIVERED' && (
              <div className="p-6 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-card space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-mint-400">
                  <ShieldCheck className="w-4 h-4" />
                  NGO Delivery Receipt Confirmation
                </div>
                <p className="text-xs text-slate-500">
                  Courier has arrived at facility. Please inspect portions, verify food temperature, and confirm receipt.
                </p>

                <form onSubmit={handleConfirmFinalReceipt} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Verified Portions Count
                    </label>
                    <input
                      type="number"
                      defaultValue={donation.estimatedPortions}
                      onChange={(e) => setVerifiedPortionsInput(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={safetyCheckPassed}
                        onChange={(e) => setSafetyCheckPassed(e.target.checked)}
                        className="rounded text-forest-600"
                      />
                      <span>Physical inspection passed (wholesome & sanitary)</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Receiver Feedback / Community Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Distributed to evening shelter dinner"
                      value={feedbackNotes}
                      onChange={(e) => setFeedbackNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
                  >
                    Confirm Verified Receipt & Award Points
                  </button>
                </form>
              </div>
            )}

            {/* If Verified: Success Badge */}
            {donation.status === 'VERIFIED' && (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                  Rescue Verified & Completed!
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  Verified by <strong>{donation.matchedNgoName}</strong>. All {donation.verifiedPortions || donation.estimatedPortions} portions successfully redistributed to community members.
                </p>
                <div className="text-[11px] font-mono text-emerald-800 dark:text-emerald-300 bg-white dark:bg-darkcard p-2 rounded-lg border border-emerald-200 dark:border-emerald-900">
                  Verified Timestamp: {formatDateTime(donation.verifiedTimestamp)}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Complete Food Safety & Logistics Audit */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Food Safety Checklist */}
            <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-slate-200 dark:border-darkborder shadow-card space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-mint-400" />
                Donor Certified Safety Standard
              </h3>
              <SafetyChecklist
                checklist={donation.safetyChecklist}
                readOnly={true}
              />
            </div>

            {/* Storage & Allergen Breakdown */}
            <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-slate-200 dark:border-darkborder shadow-card space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Storage & Allergen Breakdown
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-darkborder">
                  <span className="text-slate-400 text-[11px] block mb-1">Temperature Staging</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {donation.storageCondition}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-darkborder">
                  <span className="text-slate-400 text-[11px] block mb-1">Declared Allergens</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(donation.allergens || ['None']).map(a => (
                      <span key={a} className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-semibold text-[11px]">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Matched NGO & Courier Entity Details */}
            {(donation.matchedNgoName || donation.assignedVolunteerName) && (
              <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-slate-200 dark:border-darkborder shadow-card space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Assigned Ecosystem Participants
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {donation.matchedNgoName && (
                    <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900">
                      <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300 mb-1">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        Matched NGO Receiver
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 font-semibold">{donation.matchedNgoName}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{donation.matchedNgoPhone || '+1 (555) 345-6789'}</div>
                    </div>
                  )}

                  {donation.assignedVolunteerName && (
                    <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900">
                      <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 mb-1">
                        <Bike className="w-4 h-4 text-amber-600" />
                        Assigned Volunteer Courier
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 font-semibold">{donation.assignedVolunteerName}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">Electric Cargo Bike • Insulated Carrier</div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* QR Scanner Handover Modal */}
      <QRCodeScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onVerify={handleVerifyHandover}
        expectedToken={scannerType === 'pickup' ? donation.pickupToken : donation.deliveryToken}
        expectedType={scannerType}
        donationId={donation.id}
      />

      {/* Safety Report Modal */}
      <ReportUnsafeModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        donation={donation}
      />
    </div>
  );
}
