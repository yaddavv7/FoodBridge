import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, CheckCircle2, ChevronRight, X, RotateCcw, 
  User, Building2, Bike, Shield, ArrowRight, Award, Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function GuidedDemoModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { currentUser, switchDemoRole } = useAuth();
  const { donations, resetDemoData } = useData();
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const demoSteps = [
    {
      step: 1,
      role: 'donor',
      title: 'Donor Restaurant Sign-in',
      desc: 'Log in as Chef Marcus (Royal Spice Caterers & Banquets).',
      actionText: 'Switch to Donor Role',
      route: '/donor',
      action: () => switchDemoRole('donor'),
    },
    {
      step: 2,
      role: 'donor',
      title: 'List 100 Portions Surplus Food',
      desc: 'Create an intelligent food rescue listing with food safety declaration and pickup timeline.',
      actionText: 'Go to Create Donation Form',
      route: '/create-donation',
      action: () => {
        switchDemoRole('donor');
        navigate('/create-donation');
        onClose();
      },
    },
    {
      step: 3,
      role: 'donor',
      title: 'Smart Donor-to-NGO Matching',
      desc: 'Smart matching engine calculates multi-criteria compatibility score (Distance, Category, Capacity, Urgency).',
      actionText: 'Open Smart Matching Engine',
      route: '/matching/FB-2026-0001',
      action: () => {
        switchDemoRole('donor');
        navigate('/matching/FB-2026-0001');
        onClose();
      },
    },
    {
      step: 4,
      role: 'ngo',
      title: 'NGO Review & Acceptance',
      desc: 'Log in as Elena Rostova (Green Hope Foundation) and accept the matched donation.',
      actionText: 'Switch to NGO & Browse',
      route: '/browse',
      action: () => {
        switchDemoRole('ngo');
        navigate('/browse');
        onClose();
      },
    },
    {
      step: 5,
      role: 'volunteer',
      title: 'Volunteer Courier Task Claim',
      desc: 'Log in as Eco-Courier David Kim and claim the newly generated transit task.',
      actionText: 'Switch to Courier & View Tasks',
      route: '/volunteer',
      action: () => {
        switchDemoRole('volunteer');
        navigate('/volunteer');
        onClose();
      },
    },
    {
      step: 6,
      role: 'volunteer',
      title: 'Handover Pickup QR Verification',
      desc: 'Volunteer arrives at kitchen and scans donor QR code to register pickup & consume token.',
      actionText: 'Open QR Verification Portal',
      route: '/verify-qr',
      action: () => {
        switchDemoRole('volunteer');
        navigate('/verify-qr');
        onClose();
      },
    },
    {
      step: 7,
      role: 'volunteer',
      title: 'Transit & Delivery Handover',
      desc: 'Courier transports food in thermal insulated carrier and registers delivery completion.',
      actionText: 'View Courier Deliveries',
      route: '/volunteer',
      action: () => {
        switchDemoRole('volunteer');
        navigate('/volunteer');
        onClose();
      },
    },
    {
      step: 8,
      role: 'ngo',
      title: 'NGO Receipt & Safety Verification',
      desc: 'NGO inspects food condition, verifies portions, and confirms final safe arrival.',
      actionText: 'Confirm as NGO Receiver',
      route: '/ngo',
      action: () => {
        switchDemoRole('ngo');
        navigate('/ngo');
        onClose();
      },
    },
    {
      step: 9,
      role: 'public',
      title: 'Live Impact Transparency Updates',
      desc: 'Aggregated rescued meal counts, carbon metrics, and public safety ledger update in real time.',
      actionText: 'View Public Impact Dashboard',
      route: '/impact',
      action: () => {
        navigate('/impact');
        onClose();
      },
    },
    {
      step: 10,
      role: 'donor',
      title: 'Impact Points & Gamification',
      desc: 'Donor and courier earn contribution points, community rank, and unlock achievement badges.',
      actionText: 'View Leaderboard & Badges',
      route: '/leaderboard',
      action: () => {
        switchDemoRole('donor');
        navigate('/leaderboard');
        onClose();
      },
    },
  ];

  const activeStepObj = demoSteps.find(s => s.step === currentStep) || demoSteps[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-forest-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-mint-500/20 text-mint-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                Hackathon Presentation Walkthrough
                <span className="text-[10px] font-normal uppercase bg-forest-800 text-mint-300 px-2 py-0.5 rounded-full border border-forest-700">
                  10-Step Interactive Workflow
                </span>
              </h3>
              <p className="text-xs text-mint-200">
                Explore the end-to-end food rescue journey from listing to verified community plate.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-forest-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10-Step Navigation Strip */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-darkborder overflow-x-auto flex gap-1.5 scrollbar-thin">
          {demoSteps.map(s => {
            const isCurrent = s.step === currentStep;
            return (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-forest-700 text-white shadow-xs'
                    : 'bg-white dark:bg-darkcard text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-darkborder hover:bg-slate-100'
                }`}
              >
                <span>Step {s.step}</span>
              </button>
            );
          })}
        </div>

        {/* Step Detail Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-mint-400">
              Step {activeStepObj.step} of 10 • Role: {activeStepObj.role.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Active: {currentUser?.name} ({currentUser?.role})
            </span>
          </div>

          <div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {activeStepObj.title}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeStepObj.desc}
            </p>
          </div>

          {/* Quick Role Switchers */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-darkborder">
            <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
              1-Click Demo Profile Switcher
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => switchDemoRole('donor')}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentUser?.role === 'donor'
                    ? 'bg-forest-100 border-forest-400 text-forest-900 dark:bg-forest-950/60 dark:text-mint-300 dark:border-forest-700'
                    : 'bg-white dark:bg-darkcard border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <User className="w-3.5 h-3.5 text-forest-600" />
                Donor
              </button>

              <button
                onClick={() => switchDemoRole('ngo')}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentUser?.role === 'ngo'
                    ? 'bg-blue-100 border-blue-400 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700'
                    : 'bg-white dark:bg-darkcard border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                NGO
              </button>

              <button
                onClick={() => switchDemoRole('volunteer')}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentUser?.role === 'volunteer'
                    ? 'bg-amber-100 border-amber-400 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700'
                    : 'bg-white dark:bg-darkcard border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Bike className="w-3.5 h-3.5 text-amber-600" />
                Volunteer
              </button>

              <button
                onClick={() => switchDemoRole('admin')}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentUser?.role === 'admin'
                    ? 'bg-purple-100 border-purple-400 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-700'
                    : 'bg-white dark:bg-darkcard border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Footer with Execute & Navigation */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-darkborder flex items-center justify-between">
          <button
            onClick={resetDemoData}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo Data
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl disabled:opacity-40"
            >
              Previous
            </button>

            <button
              onClick={activeStepObj.action}
              className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
            >
              {activeStepObj.actionText} <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentStep(prev => Math.min(10, prev + 1))}
              disabled={currentStep === 10}
              className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl disabled:opacity-40"
            >
              Next Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
