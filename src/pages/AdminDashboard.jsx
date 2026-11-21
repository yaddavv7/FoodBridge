import React, { useState } from 'react';
import { 
  Shield, Users, Building2, Utensils, AlertTriangle, 
  CheckCircle2, XCircle, Download, Search, Filter, 
  FileText, QrCode, RotateCcw, ArrowRight, Eye 
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { exportToCsv } from '../utils/helpers';
import { formatDateTime } from '../utils/dateUtils';

export default function AdminDashboard() {
  const toast = useToast();
  const { currentUser } = useAuth();
  const { 
    donations, ngos, safetyReports, updateNgoVerification, 
    resolveSafetyReport, resetDemoData 
  } = useData();

  const [activeTab, setActiveTab] = useState('verifications'); // 'verifications' | 'donations' | 'safety' | 'logs'
  const [searchQuery, setSearchQuery] = useState('');
  const [resolutionInput, setResolutionInput] = useState('');

  // Metrics
  const pendingNgos = ngos.filter(n => !n.verified || n.verificationStatus === 'pending');
  const activeDonations = donations.filter(d => ['LISTED', 'ACCEPTED', 'PICKUP_SCHEDULED', 'PICKED_UP'].includes(d.status));
  const completedDonations = donations.filter(d => d.status === 'VERIFIED');
  const openSafetyReports = safetyReports.filter(r => r.status === 'investigating');

  // CSV Exporters
  const handleExportDonationsCsv = () => {
    exportToCsv('FoodBridge_Donations_Report', donations);
    toast.success('Donations CSV downloaded');
  };

  const handleExportNgosCsv = () => {
    exportToCsv('FoodBridge_NGO_Registry', ngos);
    toast.success('NGO Registry CSV downloaded');
  };

  const handleExportSafetyCsv = () => {
    exportToCsv('FoodBridge_Safety_Audit_Log', safetyReports);
    toast.success('Safety Audit CSV downloaded');
  };

  return (
    <div className="py-8 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-900/60 text-purple-300 border border-purple-700">
              <Shield className="w-3.5 h-3.5" />
              <span>Platform Operations & Regulatory Oversight</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Administrator Control Center
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
              Audit entity verifications, investigate food safety flags, monitor live QR transactions, and export platform compliance reports.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleExportDonationsCsv}
              className="px-4 py-2.5 bg-purple-800 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export Donations CSV
            </button>
            <button
              onClick={resetDemoData}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Reset sample records to initial state"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
            </button>
          </div>
        </div>

        {/* 4 Metric Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Pending Verifications</span>
              <Building2 className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {pendingNgos.length}
            </div>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">
              Requires document review
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Safety Reports</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-extrabold text-rose-600">
              {openSafetyReports.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 inline-block">
              Under priority investigation
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Active Donations</span>
              <Utensils className="w-4 h-4 text-forest-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {activeDonations.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 inline-block">
              In matching or transit
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Verified Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {completedDonations.length}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
              Successful closed rescues
            </span>
          </div>
        </div>

        {/* Tab Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-darkcard p-3 rounded-2xl border border-slate-200 dark:border-darkborder shadow-card">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {[
              { id: 'verifications', label: 'NGO Verifications', count: pendingNgos.length },
              { id: 'safety', label: 'Safety Reports', count: openSafetyReports.length },
              { id: 'donations', label: 'All Donation Records', count: donations.length },
              { id: 'logs', label: 'QR Handover Audit', count: completedDonations.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 font-bold'
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
              placeholder="Search admin records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* TAB 1: NGO VERIFICATIONS */}
        {activeTab === 'verifications' && (
          <div className="bg-white dark:bg-darkcard rounded-3xl border border-slate-200 dark:border-darkborder shadow-card overflow-hidden">
            <div className="p-4 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-100 dark:border-darkborder text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Registered Charities Awaiting Approval</span>
              <button
                onClick={handleExportNgosCsv}
                className="text-purple-600 hover:underline flex items-center gap-1 text-[11px]"
              >
                <Download className="w-3 h-3" /> Export Registry
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {ngos.map(ngo => (
                <div key={ngo.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {ngo.name}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ngo.verified
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {ngo.verificationStatus?.toUpperCase() || (ngo.verified ? 'APPROVED' : 'PENDING')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Contact: {ngo.contactPerson} ({ngo.email} • {ngo.phone})
                    </div>
                    <div className="text-xs text-slate-400">
                      📍 {ngo.address} • Daily Capacity: {ngo.capacityPortions} Portions
                    </div>
                    {ngo.verificationDoc && (
                      <div className="text-[11px] text-purple-600 font-mono flex items-center gap-1 mt-1">
                        <FileText className="w-3.5 h-3.5" /> Document: {ngo.verificationDoc}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {!ngo.verified ? (
                      <>
                        <button
                          onClick={() => updateNgoVerification(ngo.id, 'approved')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve NGO
                        </button>
                        <button
                          onClick={() => updateNgoVerification(ngo.id, 'rejected')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Fully Certified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SAFETY REPORTS */}
        {activeTab === 'safety' && (
          <div className="bg-white dark:bg-darkcard rounded-3xl border border-slate-200 dark:border-darkborder shadow-card overflow-hidden">
            <div className="p-4 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-100 dark:border-darkborder text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Logged Food Safety Concerns</span>
              <button
                onClick={handleExportSafetyCsv}
                className="text-purple-600 hover:underline flex items-center gap-1 text-[11px]"
              >
                <Download className="w-3 h-3" /> Export Audit Log
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {safetyReports.map(rep => (
                <div key={rep.id} className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {rep.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rep.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {rep.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {rep.reason}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        Target Listing: <strong className="font-mono">{rep.donationId}</strong> • Logged by: {rep.reporterName}
                      </p>
                    </div>

                    <span className="text-xs text-slate-400 shrink-0">
                      {formatDateTime(rep.createdAt)}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs text-slate-600 dark:text-slate-300">
                    <strong>Reported Evidence:</strong> {rep.details}
                  </div>

                  {rep.adminNotes && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                      <strong>Admin Resolution Note:</strong> {rep.adminNotes}
                    </div>
                  )}

                  {rep.status === 'investigating' && (
                    <div className="pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Resolution notes (e.g. Inspected with kitchen manager, holding temperature verified)..."
                        onChange={(e) => setResolutionInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs"
                      />
                      <button
                        onClick={() => resolveSafetyReport(rep.id, resolutionInput || 'Inspected and cleared by Platform Operations.')}
                        className="px-3 py-1.5 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-xl text-xs transition-colors whitespace-nowrap"
                      >
                        Resolve & Clear Listing
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ALL DONATIONS */}
        {activeTab === 'donations' && (
          <div className="bg-white dark:bg-darkcard rounded-3xl border border-slate-200 dark:border-darkborder shadow-card overflow-hidden">
            <div className="p-4 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-100 dark:border-darkborder text-xs font-bold text-slate-700 dark:text-slate-300">
              All Database Listings ({donations.length})
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-darkborder text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Title & Category</th>
                    <th className="p-3">Portions</th>
                    <th className="p-3">Donor Entity</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Matched NGO</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {donations.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="p-3 font-mono font-bold text-slate-600 dark:text-slate-400">{d.id}</td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {d.title}
                        <span className="block text-[10px] text-slate-400 font-normal">{d.category}</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-forest-700 dark:text-mint-400">{d.estimatedPortions}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{d.donorName}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800">
                          {d.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{d.matchedNgoName || 'Unassigned'}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => window.open(`/donations/${d.id}`, '_self')}
                          className="text-purple-600 hover:underline font-semibold"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: QR AUDIT LOG */}
        {activeTab === 'logs' && (
          <div className="bg-white dark:bg-darkcard rounded-3xl border border-slate-200 dark:border-darkborder shadow-card overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60">
            <div className="p-4 bg-slate-50/70 dark:bg-slate-900/40 text-xs font-bold text-slate-700 dark:text-slate-300">
              Cryptographic QR Chain-of-Custody Transaction Ledger
            </div>

            {completedDonations.map(d => (
              <div key={d.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-forest-600" />
                    <span>{d.title} ({d.id})</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Pickup Token: <strong className="font-mono">{d.pickupToken}</strong> • Delivery Token: <strong className="font-mono">{d.deliveryToken}</strong>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Courier: {d.assignedVolunteerName || 'David Kim'} → Receiver: {d.matchedNgoName}
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Audit Sealed ✓
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    {formatDateTime(d.verifiedTimestamp || d.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
