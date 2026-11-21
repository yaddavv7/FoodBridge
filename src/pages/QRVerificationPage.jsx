import React, { useState } from 'react';
import { 
  QrCode, ShieldCheck, Camera, Key, CheckCircle2, 
  AlertCircle, Sparkles, ArrowRight, Clock, User 
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function QRVerificationPage() {
  const toast = useToast();
  const { currentUser } = useAuth();
  const { donations, verifyPickup, verifyDelivery } = useData();

  const [inputToken, setInputToken] = useState('');
  const [selectedDonationId, setSelectedDonationId] = useState('');
  const [verificationType, setVerificationType] = useState('pickup'); // 'pickup' | 'delivery'
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);

  // Active donations that have pending tokens
  const pendingPickup = donations.filter(d => ['ACCEPTED', 'PICKUP_SCHEDULED'].includes(d.status));
  const pendingDelivery = donations.filter(d => d.status === 'PICKED_UP');

  const handleVerify = async (tokenToTest, donId, type) => {
    const finalToken = (tokenToTest || inputToken).trim().toUpperCase();
    const finalDonId = donId || selectedDonationId;
    const finalType = type || verificationType;

    if (!finalToken) {
      toast.error('Please enter or select a verification token.');
      return;
    }
    if (!finalDonId) {
      toast.error('Please specify which donation this token applies to.');
      return;
    }

    setIsVerifying(true);
    setResult(null);

    try {
      if (finalType === 'pickup') {
        const updated = await verifyPickup(finalDonId, finalToken);
        setResult({
          status: 'success',
          message: `Pickup Handover Verified for ${finalDonId}! Token has been marked as consumed. Courier is authorized for transit.`,
          donation: updated,
        });
      } else {
        const updated = await verifyDelivery(finalDonId, finalToken);
        setResult({
          status: 'success',
          message: `Delivery Handover Verified for ${finalDonId}! Food safely arrived at NGO destination.`,
          donation: updated,
        });
      }
    } catch (err) {
      setResult({
        status: 'error',
        message: err.message || 'Token verification failed or token already consumed.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="py-8 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-800 dark:bg-forest-950/60 dark:text-mint-300">
            <QrCode className="w-3.5 h-3.5" />
            <span>Digital Chain of Custody</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            QR Handover & Token Verification Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Secure single-use handover verification preventing token reuse and forging of pickup or delivery confirmations.
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-white dark:bg-darkcard p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-darkborder shadow-card space-y-6">
          
          {/* Handover type selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select Handover Step
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setVerificationType('pickup');
                  if (pendingPickup.length) {
                    setSelectedDonationId(pendingPickup[0].id);
                    setInputToken(pendingPickup[0].pickupToken);
                  }
                }}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                  verificationType === 'pickup'
                    ? 'bg-forest-50 border-forest-600 text-forest-900 dark:bg-forest-950/60 dark:text-mint-300 font-bold'
                    : 'border-slate-200 dark:border-darkborder text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-5 h-5 text-forest-600 dark:text-mint-400" />
                <span className="text-xs">Pickup Handover (Donor → Courier)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setVerificationType('delivery');
                  if (pendingDelivery.length) {
                    setSelectedDonationId(pendingDelivery[0].id);
                    setInputToken(pendingDelivery[0].deliveryToken);
                  }
                }}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                  verificationType === 'delivery'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 dark:bg-emerald-950/60 dark:text-mint-300 font-bold'
                    : 'border-slate-200 dark:border-darkborder text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-mint-400" />
                <span className="text-xs">Delivery Handover (Courier → NGO)</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Pre-selected Handover Candidates */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-darkborder">
            <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
              Ready for Verification in Demo State:
            </span>
            <div className="space-y-2">
              {(verificationType === 'pickup' ? pendingPickup : pendingDelivery).length === 0 ? (
                <div className="text-xs text-slate-400 italic">
                  No donations currently waiting for this handover step.
                </div>
              ) : (
                (verificationType === 'pickup' ? pendingPickup : pendingDelivery).map(d => {
                  const token = verificationType === 'pickup' ? d.pickupToken : d.deliveryToken;
                  const isSelected = selectedDonationId === d.id;
                  return (
                    <div
                      key={d.id}
                      onClick={() => {
                        setSelectedDonationId(d.id);
                        setInputToken(token);
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-white dark:bg-darkcard border-forest-500 shadow-xs'
                          : 'bg-white/60 dark:bg-darkcard/60 border-slate-200 dark:border-slate-800 hover:bg-white'
                      }`}
                    >
                      <div>
                        <strong className="text-slate-800 dark:text-slate-100">{d.title}</strong>
                        <div className="text-[11px] text-slate-400">
                          Ref: <span className="font-mono">{d.id}</span> • Status: {d.status}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-forest-700 dark:text-mint-400 block">
                          {token}
                        </span>
                        <span className="text-[10px] text-slate-400">Click to Select</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Token input form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Selected Donation Reference
              </label>
              <input
                type="text"
                value={selectedDonationId}
                onChange={(e) => setSelectedDonationId(e.target.value)}
                placeholder="e.g. FB-2026-0001"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enter or Scan Handover Token Code
              </label>
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value.toUpperCase())}
                placeholder="e.g. FB-PICK-9941"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-center font-mono text-lg font-extrabold tracking-widest text-forest-800 dark:text-mint-300"
              />
            </div>

            <button
              onClick={() => handleVerify()}
              disabled={isVerifying || !inputToken || !selectedDonationId}
              className="w-full py-3.5 px-4 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isVerifying ? 'Validating Token & Preventing Replay...' : `Verify ${verificationType === 'pickup' ? 'Pickup' : 'Delivery'} Token`}
            </button>
          </div>

          {/* Result Alert */}
          {result && (
            <div
              className={`p-4 rounded-2xl border text-xs font-medium flex items-start gap-3 ${
                result.status === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800'
              }`}
            >
              {result.status === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold">{result.status === 'success' ? 'Verification Succeeded!' : 'Verification Failed'}</div>
                <div>{result.message}</div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
