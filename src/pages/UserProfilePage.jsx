import React, { useState } from 'react';
import { 
  User, Building2, Phone, MapPin, Award, Trophy, 
  ShieldCheck, Check, Sparkles, Mail, Bike 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function UserProfilePage() {
  const { currentUser, updateProfile, switchDemoRole } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(currentUser?.name || '');
  const [organization, setOrganization] = useState(currentUser?.organization || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      organization,
      phone,
      address,
    });
    setIsEditing(false);
    toast.success('Profile details updated successfully');
  };

  return (
    <div className="py-8 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Hero */}
        <div className="p-6 sm:p-8 bg-white dark:bg-darkcard rounded-3xl border border-slate-200 dark:border-darkborder shadow-card flex flex-col sm:flex-row items-center gap-6">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt={currentUser?.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-forest-100 dark:border-forest-900 shadow-md shrink-0"
          />

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {currentUser?.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-100 text-forest-800 dark:bg-forest-950/80 dark:text-mint-300">
                {currentUser?.role}
              </span>
              {currentUser?.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {currentUser?.organization}
            </p>
            <p className="text-xs text-slate-400">
              Member since {currentUser?.joinedDate || 'Jan 2026'} • Role Access: Certified
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-darkborder text-center shrink-0">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Impact Points
            </div>
            <div className="text-2xl font-extrabold text-forest-700 dark:text-mint-400 mt-0.5 font-mono">
              {currentUser?.impactPoints || 0} pts
            </div>
            <span className="text-[10px] text-amber-600 font-bold">Top Contributor</span>
          </div>
        </div>

        {/* Profile Information & Edit Form */}
        <div className="bg-white dark:bg-darkcard p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-darkborder shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Account Information
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-forest-700 dark:text-mint-400 hover:underline"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Organization / Entity
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address (Verified)
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || ''}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-darkborder rounded-xl text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Facility / Base Address
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>

            {isEditing && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Earned Badges Section */}
        <div className="bg-white dark:bg-darkcard p-6 rounded-3xl border border-slate-200 dark:border-darkborder shadow-card space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Award className="w-5 h-5 text-warm-500" />
            <span>Earned Achievements & Badges</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(currentUser?.badges || ['First Rescue', 'Food Hero', '100 Portions Rescued']).map(badge => (
              <div
                key={badge}
                className="p-3 bg-forest-50/50 dark:bg-forest-950/40 rounded-2xl border border-forest-200 dark:border-forest-900 text-center space-y-1"
              >
                <div className="text-2xl">⭐</div>
                <div className="text-xs font-bold text-forest-900 dark:text-mint-300">{badge}</div>
                <div className="text-[10px] text-slate-400">Verified Rescue Tier</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
