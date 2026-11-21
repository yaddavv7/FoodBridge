import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sprout, MapPin, Search, PlusCircle, User, LogOut, Menu, X, 
  Sparkles, Shield, ChevronDown, BarChart3, Trophy, QrCode, Bike, Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import ThemeToggle from './ThemeToggle';
import GuidedDemoModal from './GuidedDemoModal';

export default function Navbar() {
  const { currentUser, logout, switchDemoRole, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleRoleSwitch = (role) => {
    switchDemoRole(role);
    setUserDropdownOpen(false);
    if (role === 'donor') navigate('/donor');
    else if (role === 'ngo') navigate('/ngo');
    else if (role === 'volunteer') navigate('/volunteer');
    else if (role === 'admin') navigate('/admin');
  };

  const getDashboardRoute = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'donor') return '/donor';
    if (currentUser.role === 'ngo') return '/ngo';
    if (currentUser.role === 'volunteer') return '/volunteer';
    if (currentUser.role === 'admin') return '/admin';
    return '/';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-darkcard/95 backdrop-blur-md border-b border-slate-200/80 dark:border-darkborder transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-forest-700 text-white flex items-center justify-center shadow-md group-hover:bg-forest-800 transition-colors">
                <Sprout className="w-5 h-5 text-mint-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                  Food<span className="text-forest-600 dark:text-mint-400">Bridge</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500 -mt-1 hidden sm:block">
                  Food Rescue Platform
                </span>
              </div>
            </Link>

            {/* Demo Mode Badge */}
            {isDemoMode && (
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Demo Mode
              </span>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Link
              to="/map"
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                isActive('/map')
                  ? 'bg-forest-50 dark:bg-forest-950/40 text-forest-800 dark:text-mint-300 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4 text-forest-600 dark:text-mint-400" />
              Live Map
            </Link>

            <Link
              to="/browse"
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                isActive('/browse')
                  ? 'bg-forest-50 dark:bg-forest-950/40 text-forest-800 dark:text-mint-300 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Search className="w-4 h-4 text-forest-600 dark:text-mint-400" />
              Browse Rescues
            </Link>

            <Link
              to="/impact"
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                isActive('/impact')
                  ? 'bg-forest-50 dark:bg-forest-950/40 text-forest-800 dark:text-mint-300 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-forest-600 dark:text-mint-400" />
              Impact Analytics
            </Link>

            <Link
              to="/leaderboard"
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                isActive('/leaderboard')
                  ? 'bg-forest-50 dark:bg-forest-950/40 text-forest-800 dark:text-mint-300 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4 text-warm-500" />
              Leaderboard
            </Link>

            {/* Role-Specific quick link */}
            {currentUser && (
              <Link
                to={getDashboardRoute()}
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 font-bold ${
                  isActive(getDashboardRoute())
                    ? 'bg-forest-600 text-white'
                    : 'text-forest-700 dark:text-mint-400 hover:bg-forest-50 dark:hover:bg-forest-950/50'
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            
            {/* Hackathon 10-Step Guide Pill */}
            <button
              onClick={() => setDemoModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-warm-50 border border-warm-200 text-warm-800 dark:bg-warm-950/40 dark:border-warm-900 dark:text-warm-300 hover:bg-warm-100 transition-all shadow-xs"
              title="Launch 10-Step Interactive Demo Walkthrough"
            >
              <Sparkles className="w-3.5 h-3.5 text-warm-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Hackathon Walkthrough</span>
            </button>

            {/* Quick List Food Button for Donors */}
            {currentUser?.role === 'donor' && (
              <Link
                to="/create-donation"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-forest-700 hover:bg-forest-800 text-white shadow-sm transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                List Food
              </Link>
            )}

            {/* QR Scan Button for Volunteers */}
            {currentUser?.role === 'volunteer' && (
              <Link
                to="/verify-qr"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-forest-700 hover:bg-forest-800 text-white shadow-sm transition-colors"
              >
                <QrCode className="w-4 h-4" />
                Scan Handover
              </Link>
            )}

            {/* In-app Notification Dropdown */}
            {currentUser && <NotificationDropdown />}

            {/* Light/Dark Mode Toggle */}
            <ThemeToggle />

            {/* User Profile / Login Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-forest-600 dark:text-mint-400">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile menu dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3 border-b border-slate-100 dark:border-darkborder mb-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {currentUser.organization || currentUser.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-forest-700 dark:text-mint-400 font-bold">
                        <span>Role: {currentUser.role.toUpperCase()}</span>
                        <span>⭐ {currentUser.impactPoints || 0} pts</span>
                      </div>
                    </div>

                    {/* Quick Demo Switcher Section */}
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Role View (Demo)
                    </div>
                    <div className="grid grid-cols-2 gap-1 mb-2 px-1">
                      <button
                        onClick={() => handleRoleSwitch('donor')}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium text-left flex items-center gap-1.5 ${
                          currentUser.role === 'donor'
                            ? 'bg-forest-100 dark:bg-forest-950/60 text-forest-800 dark:text-mint-300 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <User className="w-3.5 h-3.5" /> Donor
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('ngo')}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium text-left flex items-center gap-1.5 ${
                          currentUser.role === 'ngo'
                            ? 'bg-forest-100 dark:bg-forest-950/60 text-forest-800 dark:text-mint-300 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" /> NGO
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('volunteer')}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium text-left flex items-center gap-1.5 ${
                          currentUser.role === 'volunteer'
                            ? 'bg-forest-100 dark:bg-forest-950/60 text-forest-800 dark:text-mint-300 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Bike className="w-3.5 h-3.5" /> Courier
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('admin')}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium text-left flex items-center gap-1.5 ${
                          currentUser.role === 'admin'
                            ? 'bg-forest-100 dark:bg-forest-950/60 text-forest-800 dark:text-mint-300 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5" /> Admin
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-darkborder pt-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile & Badges
                      </Link>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-forest-700 hover:bg-forest-800 text-white shadow-sm transition-colors"
                >
                  Join FoodBridge
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-darkborder bg-white dark:bg-darkcard px-4 pt-3 pb-5 space-y-2">
            <Link
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <MapPin className="w-4 h-4 text-forest-600" /> Live Rescue Map
            </Link>
            <Link
              to="/browse"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Search className="w-4 h-4 text-forest-600" /> Browse Active Rescues
            </Link>
            <Link
              to="/impact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <BarChart3 className="w-4 h-4 text-forest-600" /> Impact Analytics
            </Link>
            <Link
              to="/leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Trophy className="w-4 h-4 text-warm-500" /> Leaderboard
            </Link>

            {currentUser && (
              <Link
                to={getDashboardRoute()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-forest-50 dark:bg-forest-950/60 text-forest-800 dark:text-mint-300"
              >
                Go to Role Dashboard ({currentUser.role.toUpperCase()})
              </Link>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setDemoModalOpen(true);
              }}
              className="w-full mt-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-warm-50 border border-warm-200 text-warm-800 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-warm-600" />
              Open 10-Step Hackathon Walkthrough
            </button>
          </div>
        )}
      </header>

      {/* Guided Walkthrough Modal */}
      <GuidedDemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </>
  );
}
