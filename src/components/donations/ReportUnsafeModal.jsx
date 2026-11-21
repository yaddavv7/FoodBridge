import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function ReportUnsafeModal({
  isOpen,
  onClose,
  donation,
}) {
  const { submitSafetyReport } = useData();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !donation) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return;

    setIsSubmitting(true);
    try {
      await submitSafetyReport({
        donationId: donation.id,
        donationTitle: donation.title,
        reason,
        details,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-darkborder flex items-center justify-between bg-rose-50/50 dark:bg-rose-950/20">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Report Food Safety Concern
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Listing: <span className="font-mono font-semibold">{donation.id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
            Safety reports immediately pause public distribution for this listing and notify Platform Administrators for priority investigation.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Primary Concern Category *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <option value="">Select a reason...</option>
              <option value="Temperature Abuse / Inadequate Chilling or Hot Holding">Temperature Abuse / Inadequate Chilling or Hot Holding</option>
              <option value="Suspected Spoilage / Off Odor or Discoloration">Suspected Spoilage / Off Odor or Discoloration</option>
              <option value="Packaging Compromised or Unsealed">Packaging Compromised or Unsealed</option>
              <option value="Undisclosed Severe Allergens">Undisclosed Severe Allergens</option>
              <option value="Expired Safe Collection Deadline">Expired Safe Collection Deadline</option>
              <option value="Incorrect Food Details or False Listing">Incorrect Food Details or False Listing</option>
              <option value="Other Safety Violation">Other Safety Violation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Observation / Evidence
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what you observed (smell, packaging status, temperature thermometer readings, etc.)..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Flag & Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
