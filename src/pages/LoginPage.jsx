import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, Lock, Mail, ArrowRight, User, Building2, Bike, 
  Shield, AlertCircle, Sparkles, Check 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DEMO_USERS } from '../data/demoData';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, switchDemoRole } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'donor') navigate('/donor');
      else if (user.role === 'ngo') navigate('/ngo');
      else if (user.role === 'volunteer') navigate('/volunteer');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Try 1-click demo accounts below.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role) => {
    const user = switchDemoRole(role);
    if (user) {
      toast.success(`Logged in as demo ${user.role.toUpperCase()}: ${user.name}`);
      if (role === 'donor') navigate('/donor');
      else if (role === 'ngo') navigate('/ngo');
      else if (role === 'volunteer') navigate('/volunteer');
      else if (role === 'admin') navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen py-12 flex flex-col justify-center bg-offwhite dark:bg-darkbg px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-forest-700 text-white flex items-center justify-center shadow-md">
              <Sprout className="w-5 h-5 text-mint-300" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Food<span className="text-forest-600 dark:text-mint-400">Bridge</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Sign In to Food Rescue Portal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access your role dashboard and rescue logs
          </p>
        </div>

        {/* 1-Click Demo Accounts Quick Selector for Hackathon Presentation */}
        <div className="p-4 bg-gradient-to-br from-mint-50 to-forest-50/50 dark:from-darkcard dark:to-forest-950/20 rounded-2xl border border-forest-200 dark:border-darkborder shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-forest-900 dark:text-mint-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-warm-500" />
              1-Click Demo Logins (Hackathon Mode)
            </span>
            <span className="text-[10px] font-semibold text-forest-700 dark:text-mint-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-forest-200 dark:border-forest-800">
              Instant Access
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('donor')}
              className="p-2.5 bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder rounded-xl text-left hover:border-forest-500 transition-all flex flex-col group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-forest-700">
                <User className="w-3.5 h-3.5 text-forest-600" /> Donor
              </div>
              <span className="text-[10px] text-slate-400 truncate mt-0.5">
                Chef Marcus (Caterer)
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ngo')}
              className="p-2.5 bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder rounded-xl text-left hover:border-blue-500 transition-all flex flex-col group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-700">
                <Building2 className="w-3.5 h-3.5 text-blue-600" /> NGO
              </div>
              <span className="text-[10px] text-slate-400 truncate mt-0.5">
                Elena (Green Hope)
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('volunteer')}
              className="p-2.5 bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder rounded-xl text-left hover:border-amber-500 transition-all flex flex-col group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-700">
                <Bike className="w-3.5 h-3.5 text-amber-600" /> Volunteer
              </div>
              <span className="text-[10px] text-slate-400 truncate mt-0.5">
                David Kim (Eco-Courier)
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="p-2.5 bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder rounded-xl text-left hover:border-purple-500 transition-all flex flex-col group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-700">
                <Shield className="w-3.5 h-3.5 text-purple-600" /> Admin
              </div>
              <span className="text-[10px] text-slate-400 truncate mt-0.5">
                Sarah Jenkins (Ops Lead)
              </span>
            </button>
          </div>
        </div>

        {/* Standard Credentials Form */}
        <div className="bg-white dark:bg-darkcard p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-darkborder shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. donor@foodbridge.org"
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Demo: password123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In with Email'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-darkborder text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-forest-700 dark:text-mint-400 hover:underline">
              Create an Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
