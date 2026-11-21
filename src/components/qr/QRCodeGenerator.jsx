import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function QRCodeGenerator({
  donation,
  type = 'pickup', // 'pickup' | 'delivery'
  className = '',
}) {
  const toast = useToast();
  const [copied, setCopied] = React.useState(false);

  if (!donation) return null;

  const isPickup = type === 'pickup';
  const token = isPickup ? donation.pickupToken : donation.deliveryToken;
  const qrPayload = JSON.stringify({
    system: 'FoodBridge',
    version: '1.0',
    donationId: donation.id,
    action: isPickup ? 'CONFIRM_PICKUP' : 'CONFIRM_DELIVERY',
    token: token,
    validUntil: donation.deadline,
    isDemo: true,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    toast.info(`Token ${token} copied to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`p-6 bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-card flex flex-col items-center text-center ${className}`}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-forest-700 dark:text-mint-400 mb-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-mint-400" />
        {isPickup ? 'Secure Pickup Handover QR' : 'Secure Delivery Handover QR'}
      </div>

      <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
        {donation.title}
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
        {isPickup
          ? 'Present this QR code to the volunteer courier during food handover.'
          : 'Volunteer courier will present this QR code to the NGO receiver.'}
      </p>

      {/* QR Code Canvas */}
      <div className="p-4 bg-white rounded-xl shadow-inner border border-slate-200 inline-block mb-4">
        <QRCodeSVG
          value={qrPayload}
          size={180}
          level="H"
          includeMargin={false}
          imageSettings={{
            src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2315803d"%3E%3Cpath d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/%3E%3C/svg%3E',
            x: undefined,
            y: undefined,
            height: 28,
            width: 28,
            excavate: true,
          }}
        />
      </div>

      {/* Manual Verification Token Box */}
      <div className="w-full max-w-xs bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between mb-3">
        <div className="text-left">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
            Verification Token
          </span>
          <span className="text-base font-mono font-bold text-forest-800 dark:text-mint-300">
            {token}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 text-slate-500 hover:text-forest-700 dark:hover:text-mint-300 transition-colors rounded-lg hover:bg-white dark:hover:bg-slate-800"
          title="Copy Token"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <div className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs">
        Donation Ref: <strong className="font-mono text-slate-600 dark:text-slate-300">{donation.id}</strong> • Single-use token. Replay prevention active.
      </div>
    </div>
  );
}
