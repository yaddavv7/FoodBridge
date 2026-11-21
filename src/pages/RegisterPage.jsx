import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, User, Building2, Bike, Mail, Lock, Phone, 
  MapPin, ShieldCheck, AlertCircle, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();

  const [role, setRole] = useState('donor'); // 'donor' | 'ngo' | 'volunteer'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [donorType, setDonorType] = useState('Restaurant');
  const [ngoType, setNgoType] = useState('Community Kitchen');
  const [vehicleType, setVehicleType] = useState('Electric Cargo Bike');
  const [agreedToGuidelines, setAgreedToGuidelines] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreedToGuidelines) {
      setError('You must acknowledge the Food Safety and Good Samaritan donation guidelines to register.');
      return;
    }

    setLoading(true);
    try {
      const newUser = await register({
        name,
        email,
        password,
        role,
        organization: organization || name,
        phone,
        address,
        donorType: role === 'donor' ? donorType : null,
        ngoType: role === 'ngo' ? ngoType : null,
        vehicleType: role === 'volunteer' ? vehicleType : null,
      });

      toast.success(`Account registered successfully as ${role.toUpperCase()}!`);
      if (role === 'donor') navigate('/donor');
      else if (role === 'ngo') navigate('/ngo');
      else if (role === 'volunteer') navigate('/volunteer');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 flex flex-col justify-center bg-offwhite dark:bg-darkbg px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto space-y-6">
        
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Join the Food Rescue Ecosystem
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Choose your entity type to get started with verified food redistribution
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-darkcard p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-darkborder shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Role Selection Tabs (ADMIN IS STRICTLY EXCLUDED PER SECURITY RULE) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                1. Select Account Type *
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole('donor')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    role === 'donor'
                      ? 'bg-forest-50 border-forest-600 text-forest-900 dark:bg-forest-950/60 dark:text-mint-300 dark:border-mint-500 shadow-xs'
                      : 'border-slate-200 dark:border-darkborder text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-5 h-5 text-forest-600 dark:text-mint-400" />
                  <span className="text-xs font-bold">Food Donor</span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    Caterer, Restaurant, Hotel
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('ngo')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    role === 'ngo'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-500 shadow-xs'
                      : 'border-slate-200 dark:border-darkborder text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold">NGO / Shelter</span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    Charity, Soup Kitchen
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('volunteer')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    role === 'volunteer'
                      ? 'bg-amber-50 border-amber-600 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500 shadow-xs'
                      : 'border-slate-200 dark:border-darkborder text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Bike className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold">Volunteer Courier</span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    Transit & Handover
                  </span>
                </button>
              </div>

              <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500 italic">
                🛡️ Security note: Administrator roles are delegated exclusively by verified platform trustees.
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-darkborder">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                2. Contact & Identity Information
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chef Marcus Vance"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Organization / Trading Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder={role === 'volunteer' ? 'Independent Eco-Courier' : 'e.g. Royal Spice Caterers'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.org"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Physical Base / Facility Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, City, District"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Role-Specific Fields */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-darkborder">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                3. Entity Details
              </label>

              {role === 'donor' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Donor Establishment Category
                  </label>
                  <select
                    value={donorType}
                    onChange={(e) => setDonorType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  >
                    <option value="Catering Service">Catering Service & Banquet</option>
                    <option value="Restaurant / Cafe">Restaurant / Cafe</option>
                    <option value="Hotel Kitchen">Hotel Kitchen</option>
                    <option value="Bakery / Patisserie">Bakery / Patisserie</option>
                    <option value="Grocery / Supermarket">Grocery / Supermarket</option>
                    <option value="Corporate Dining Hall">Corporate Dining Hall</option>
                    <option value="Individual Donor">Individual Donor</option>
                  </select>
                </div>
              )}

              {role === 'ngo' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Charity / NGO Facility Focus
                    </label>
                    <select
                      value={ngoType}
                      onChange={(e) => setNgoType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Community Kitchen">Community Kitchen & Meal Service</option>
                      <option value="Homeless Shelter">Homeless Shelter & Temporary Refuge</option>
                      <option value="Food Bank & Pantry">Food Bank & Emergency Pantry</option>
                      <option value="Youth Welfare Center">Youth & Orphan Welfare Center</option>
                      <option value="Senior Living Assistance">Senior Living Assistance</option>
                    </select>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-900 dark:text-blue-300">
                    ℹ️ Note: NGOs can immediately browse donations. Prior to claiming high-volume hot meals, the administration office will review standard non-profit registration documentation.
                  </div>
                </div>
              )}

              {role === 'volunteer' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Courier Transit Mode
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Electric Cargo Bike">Electric Cargo Bike (with insulated boxes)</option>
                    <option value="Bicycle Courier">Bicycle Courier (thermal backpack)</option>
                    <option value="Electric Scooter">Electric Scooter</option>
                    <option value="Car / Station Wagon">Car / Station Wagon</option>
                    <option value="Foot Courier">Foot Courier (local block perimeter)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Food Safety Declaration Checkbox */}
            <div className="pt-2 border-t border-slate-100 dark:border-darkborder">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToGuidelines}
                  onChange={(e) => setAgreedToGuidelines(e.target.checked)}
                  className="mt-0.5 rounded text-forest-600 focus:ring-forest-500"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                  I acknowledge the <Link to="/terms" className="font-bold text-forest-700 dark:text-mint-400 hover:underline">FoodBridge Food Safety Guidelines</Link> and agree that all food offered or transported conforms to Good Samaritan handling standards.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agreedToGuidelines}
              className="w-full py-3 px-4 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Creating Entity Account...' : 'Complete Registration'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-darkborder text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-forest-700 dark:text-mint-400 hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
