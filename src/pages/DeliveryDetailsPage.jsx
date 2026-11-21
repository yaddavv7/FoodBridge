import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Bike, MapPin, Phone, Clock, QrCode, 
  CheckCircle2, ShieldCheck, Thermometer, Navigation, ArrowRight 
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import QRCodeScannerModal from '../components/qr/QRCodeScannerModal';

export default function DeliveryDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser } = useAuth();
  const { tasks, verifyPickup, verifyDelivery } = useData();

  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerMode, setScannerMode] = useState('pickup'); // 'pickup' | 'delivery'

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Delivery task not found</h2>
        <Link to="/volunteer" className="text-xs font-bold text-amber-600 hover:underline">
          Return to Courier Dashboard
        </Link>
      </div>
    );
  }

  const handleVerifyScan = async (token) => {
    if (scannerMode === 'pickup') {
      await verifyPickup(task.donationId, token);
      toast.success('Pickup verified! Proceed to NGO dropoff.');
    } else {
      await verifyDelivery(task.donationId, token);
      toast.success('Delivery completed! NGO notified.');
    }
  };

  return (
    <div className="py-8 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate('/volunteer')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Courier Tasks
        </button>

        {/* Header Hero */}
        <div className="p-6 bg-white dark:bg-darkcard rounded-3xl border border-slate-200 dark:border-darkborder shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-slate-400">
                TASK: {task.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                task.status === 'DELIVERED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : task.status === 'PICKED_UP'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {task.status}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {task.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Estimated Transit Distance: <strong>{task.distanceKm} km</strong> • {task.estimatedPortions} Portions ({task.category})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/donations/${task.donationId}`}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-darkborder text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              View Full Food Safety Log
            </Link>
          </div>
        </div>

        {/* Courier Turn-by-Turn Route Visualizer */}
        <div className="p-6 bg-white dark:bg-darkcard rounded-3xl border border-slate-200 dark:border-darkborder shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-forest-600 dark:text-mint-400" />
              Turn-by-Turn Courier Route
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              ⚡ Thermal bag required
            </span>
          </div>

          <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            
            {/* Pickup Waypoint */}
            <div className="relative">
              <div className="absolute -left-8 top-0 w-7 h-7 rounded-full bg-forest-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                A
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-forest-700 dark:text-mint-400">
                  Pickup Location (Kitchen)
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {task.donorName}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  📍 {task.pickupAddress}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                    Handover Token: {task.pickupToken}
                  </span>
                  {task.status === 'ASSIGNED' && (
                    <button
                      onClick={() => {
                        setScannerMode('pickup');
                        setScannerOpen(true);
                      }}
                      className="px-3 py-1 bg-forest-700 text-white rounded-lg text-xs font-bold hover:bg-forest-800 flex items-center gap-1"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Scan Donor QR
                    </button>
                  )}
                  {['PICKED_UP', 'DELIVERED'].includes(task.status) && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Picked Up
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Dropoff Waypoint */}
            <div className="relative">
              <div className="absolute -left-8 top-0 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                B
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-blue-700 dark:text-blue-400">
                  Delivery Destination (Community Shelter)
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {task.ngoName}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  📍 {task.deliveryAddress}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                    Dropoff Token: {task.deliveryToken}
                  </span>
                  {task.status === 'PICKED_UP' && (
                    <button
                      onClick={() => {
                        setScannerMode('delivery');
                        setScannerOpen(true);
                      }}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center gap-1"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Confirm Delivery
                    </button>
                  )}
                  {task.status === 'DELIVERED' && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Delivery Completed
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Courier Handling Guidelines */}
        <div className="p-5 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-2">
          <div className="font-bold flex items-center gap-1.5">
            <Thermometer className="w-4 h-4" />
            Courier Food Safety Handling Rules
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
            <li>Always keep thermal cargo zippers sealed during transit to prevent temperature loss.</li>
            <li>Do not place cold produce/dairy together in the same compartment as hot cambros.</li>
            <li>In case of container seal compromise or accidental spills, log a safety report immediately.</li>
          </ul>
        </div>

      </div>

      {/* Handover Scanner */}
      <QRCodeScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onVerify={handleVerifyScan}
        expectedToken={scannerMode === 'pickup' ? task.pickupToken : task.deliveryToken}
        expectedType={scannerMode}
        donationId={task.donationId}
      />
    </div>
  );
}
