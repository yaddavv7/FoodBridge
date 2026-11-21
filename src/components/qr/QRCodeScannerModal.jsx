import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Camera, CheckCircle2, AlertCircle, X, Sparkles, Key } from 'lucide-react';

export default function QRCodeScannerModal({
  isOpen,
  onClose,
  onVerify,
  expectedToken = '',
  expectedType = 'pickup', // 'pickup' | 'delivery'
  donationId = '',
}) {
  const [activeTab, setActiveTab] = useState('simulated'); // 'simulated' | 'camera' | 'manual'
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState(null); // 'success' | 'error' | null
  const [statusMessage, setStatusMessage] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setScanStatus(null);
      setStatusMessage('');
      setManualCode('');
      setIsScanning(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1-Click Simulated Scan for Demo
  const handleSimulatedScan = () => {
    setIsScanning(true);
    setScanStatus(null);
    setStatusMessage('Aligning viewfinder with FoodBridge QR code...');

    setTimeout(() => {
      setIsScanning(false);
      try {
        onVerify(expectedToken);
        setScanStatus('success');
        setStatusMessage(`Successfully scanned & verified ${expectedToken}!`);
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (err) {
        setScanStatus('error');
        setStatusMessage(err.message || 'Verification token rejected');
      }
    }, 1200);
  };

  // Manual Token Verification
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    try {
      onVerify(manualCode.trim());
      setScanStatus('success');
      setStatusMessage(`Token ${manualCode.trim()} successfully verified!`);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setScanStatus('error');
      setStatusMessage(err.message || 'Token verification failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-darkborder flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-mint-50 dark:bg-mint-950/40 text-forest-700 dark:text-mint-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {expectedType === 'pickup' ? 'Scan Pickup Handover QR' : 'Scan Delivery Handover QR'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Donation Reference: <span className="font-mono font-semibold">{donationId}</span>
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

        {/* Tab switcher */}
        <div className="flex border-b border-slate-100 dark:border-darkborder text-xs font-semibold bg-slate-50/50 dark:bg-slate-900/30">
          <button
            onClick={() => setActiveTab('simulated')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'simulated'
                ? 'border-forest-600 text-forest-700 dark:text-mint-400 bg-white dark:bg-darkcard'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-warm-500" />
            1-Click Demo Scan
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'manual'
                ? 'border-forest-600 text-forest-700 dark:text-mint-400 bg-white dark:bg-darkcard'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Key className="w-4 h-4" />
            Enter Token Code
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {activeTab === 'simulated' && (
            <div className="flex flex-col items-center text-center">
              {/* Simulated camera target box */}
              <div className="relative w-56 h-56 rounded-2xl border-2 border-dashed border-forest-400 dark:border-mint-600 bg-forest-50/30 dark:bg-mint-950/20 flex flex-col items-center justify-center p-4 overflow-hidden mb-5">
                {/* Viewfinder corner lines */}
                <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-forest-600 dark:border-mint-400 rounded-tl"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-forest-600 dark:border-mint-400 rounded-tr"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-forest-600 dark:border-mint-400 rounded-bl"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-forest-600 dark:border-mint-400 rounded-br"></div>

                {isScanning ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-4 border-forest-600 border-t-transparent animate-spin"></div>
                    <span className="text-xs font-medium text-forest-700 dark:text-mint-300">
                      Reading QR payload...
                    </span>
                  </div>
                ) : scanStatus === 'success' ? (
                  <div className="flex flex-col items-center gap-2 text-emerald-600 animate-in zoom-in-75 duration-200">
                    <CheckCircle2 className="w-14 h-14" />
                    <span className="text-xs font-bold">QR Confirmed!</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Camera className="w-12 h-12 stroke-[1.5]" />
                    <span className="text-xs">Laser Ready</span>
                    <span className="text-[11px] font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      Target: {expectedToken}
                    </span>
                  </div>
                )}
              </div>

              {scanStatus && (
                <div
                  className={`w-full p-3 rounded-xl text-xs font-medium mb-4 flex items-center justify-center gap-2 ${
                    scanStatus === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                >
                  {scanStatus === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {statusMessage}
                </div>
              )}

              <button
                type="button"
                onClick={handleSimulatedScan}
                disabled={isScanning || scanStatus === 'success'}
                className="w-full py-3 px-4 bg-forest-700 hover:bg-forest-800 text-white rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <QrCode className="w-5 h-5" />
                {isScanning ? 'Verifying...' : `Simulate Instant Camera Scan (${expectedToken})`}
              </button>
              <p className="text-[11px] text-slate-400 mt-2">
                Simulates real camera hardware scan without requiring browser webcam permissions.
              </p>
            </div>
          )}

          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Input Verification Token
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                    placeholder={`e.g. ${expectedToken || 'FB-PICK-XXXX'}`}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-center font-mono text-lg font-bold tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-forest-500"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Expected demo token for this handover is: <strong className="font-mono text-forest-700 dark:text-mint-400">{expectedToken}</strong>
                </p>
              </div>

              {scanStatus && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    scanStatus === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                >
                  {scanStatus === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{statusMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!manualCode.trim() || scanStatus === 'success'}
                className="w-full py-3 px-4 bg-forest-700 hover:bg-forest-800 text-white rounded-xl font-semibold shadow-md transition-all disabled:opacity-50"
              >
                Verify Token Code
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
