import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Utensils, Calendar, Clock, MapPin, ShieldCheck, AlertCircle, 
  Upload, Camera, Check, ArrowRight, Info, AlertTriangle, Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import SafetyChecklist from '../components/donations/SafetyChecklist';

const SAMPLE_PHOTO_PRESETS = [
  {
    label: 'Biryani / Rice Dishes',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Fresh Bread & Bakery',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Deli Wraps & Sandwiches',
    url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Fresh Produce / Vegetables',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Curry / Dal / Warm Meals',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Packaged / Dry Goods',
    url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281781?w=800&auto=format&fit=crop&q=80',
  },
];

const ALLERGEN_OPTIONS = [
  'Gluten / Wheat',
  'Dairy / Lactose',
  'Eggs',
  'Tree Nuts',
  'Peanuts',
  'Soy',
  'Shellfish / Seafood',
  'Mustard / Sesame',
  'None / Allergen-Free',
];

export default function CreateDonationPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createDonation } = useData();

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Cooked meals');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState(SAMPLE_PHOTO_PRESETS[0].url);
  const [quantity, setQuantity] = useState(100);
  const [quantityUnit, setQuantityUnit] = useState('portions');
  const [estimatedPortions, setEstimatedPortions] = useState(100);
  
  // Safe deadline defaults: now + 4 hours
  const defaultPrep = new Date().toISOString().slice(0, 16);
  const defaultDeadline = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [prepTime, setPrepTime] = useState(defaultPrep);
  const [deadline, setDeadline] = useState(defaultDeadline);
  const [storageCondition, setStorageCondition] = useState('Hot-held above 60°C / Insulated food warmers');
  const [dietaryType, setDietaryType] = useState('Vegetarian');
  const [selectedAllergens, setSelectedAllergens] = useState(['None / Allergen-Free']);
  const [pickupAddress, setPickupAddress] = useState(currentUser?.address || '452 Grand Culinary Blvd, Metro City');
  const [pickupAvailability, setPickupAvailability] = useState('Immediate pickup available. Call dock upon arrival.');

  const [safetyChecklist, setSafetyChecklist] = useState({
    freshlyPrepared: true,
    safeTemperatureMaintained: true,
    foodGradePackaging: true,
    cleanHygienicHandling: true,
    noExpiredIngredients: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const toggleAllergen = (allergen) => {
    if (allergen === 'None / Allergen-Free') {
      setSelectedAllergens(['None / Allergen-Free']);
      return;
    }
    const filtered = selectedAllergens.filter(a => a !== 'None / Allergen-Free');
    if (filtered.includes(allergen)) {
      const next = filtered.filter(a => a !== allergen);
      setSelectedAllergens(next.length ? next : ['None / Allergen-Free']);
    } else {
      setSelectedAllergens([...filtered, allergen]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Verify all safety checks are confirmed
    const allPassed = Object.values(safetyChecklist).every(Boolean);
    if (!allPassed) {
      setError('You must confirm all mandatory food safety checklist items prior to publishing surplus food.');
      return;
    }

    // Verify deadline is in the future
    if (new Date(deadline).getTime() <= new Date().getTime()) {
      setError('The safe collection deadline must be set in the future.');
      return;
    }

    setSubmitting(true);
    try {
      const newListing = await createDonation({
        title,
        category,
        description,
        photoUrl,
        quantity: Number(quantity),
        quantityUnit,
        estimatedPortions: Number(estimatedPortions),
        prepTime,
        deadline,
        storageCondition,
        dietaryType,
        allergens: selectedAllergens,
        pickupAddress,
        pickupAvailability,
        publicApproxLocation: `${pickupAddress.split(',')[0]} vicinity`,
        lat: currentUser?.lat || 40.7128,
        lng: currentUser?.lng || -74.0060,
        safetyConfirmed: true,
        safetyChecklist,
      });

      // Jump directly to Smart Matching screen for this new listing!
      navigate(`/matching/${newListing.id}`);
    } catch (err) {
      setError(err.message || 'Failed to list donation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-800 dark:bg-forest-950/60 dark:text-mint-300 mb-2">
            <Utensils className="w-3.5 h-3.5" />
            <span>Commercial Food Donor Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            List Surplus Food for Rescue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Publish edible surplus with full food safety disclosures to instantly calculate matching NGOs.
          </p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium">{error}</div>
            </div>
          )}

          {/* Section 1: Food Details */}
          <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-slate-200 dark:border-darkborder shadow-card space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-forest-100 text-forest-800 dark:bg-forest-900/60 dark:text-mint-400 text-xs flex items-center justify-center font-bold">1</span>
              Food Details & Classification
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Listing Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 100 Portions Gourmet Vegetable Biryani & Raita"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Food Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                >
                  <option value="Cooked meals">Cooked meals</option>
                  <option value="Bakery products">Bakery products</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Packaged food">Packaged food</option>
                  <option value="Dairy products">Dairy products</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dietary Classification *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDietaryType('Vegetarian')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      dietaryType === 'Vegetarian'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-darkborder text-slate-600'
                    }`}
                  >
                    🌱 Vegetarian
                  </button>
                  <button
                    type="button"
                    onClick={() => setDietaryType('Non-vegetarian')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      dietaryType === 'Non-vegetarian'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'border-slate-200 dark:border-darkborder text-slate-600'
                    }`}
                  >
                    🍗 Non-Vegetarian
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description & Packaging Condition *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe how the food was prepared, its packaging containers, and safe transport notes..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>

            {/* Food Photograph Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Food Photograph Preview (Select preset or provide URL)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                {SAMPLE_PHOTO_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhotoUrl(p.url)}
                    className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all ${
                      photoUrl === p.url
                        ? 'border-forest-600 ring-2 ring-forest-500/30'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    {photoUrl === p.url && (
                      <div className="absolute inset-0 bg-forest-900/40 flex items-center justify-center text-white">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Or paste an image URL..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Quantity & Portion Metrics */}
          <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-slate-200 dark:border-darkborder shadow-card space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-forest-100 text-forest-800 dark:bg-forest-900/60 dark:text-mint-400 text-xs flex items-center justify-center font-bold">2</span>
              Quantity & Portions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    if (quantityUnit === 'portions') setEstimatedPortions(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity Unit *
                </label>
                <select
                  value={quantityUnit}
                  onChange={(e) => setQuantityUnit(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                >
                  <option value="portions">portions / meals</option>
                  <option value="kg">kilograms (kg)</option>
                  <option value="units">units / items</option>
                  <option value="trays">catering trays</option>
                  <option value="boxes">boxes / crates</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Meals Rescued *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={estimatedPortions}
                  onChange={(e) => setEstimatedPortions(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none font-mono font-bold text-forest-700 dark:text-mint-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Time Windows & Food Safety Handling */}
          <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-slate-200 dark:border-darkborder shadow-card space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-forest-100 text-forest-800 dark:bg-forest-900/60 dark:text-mint-400 text-xs flex items-center justify-center font-bold">3</span>
              Timeline & Temperature Conditions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preparation Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Safe Collection Deadline *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none font-bold text-rose-600 dark:text-rose-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Storage Condition & Temperature Staging *
              </label>
              <select
                value={storageCondition}
                onChange={(e) => setStorageCondition(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
              >
                <option value="Hot-held above 60°C / Insulated food warmers">Hot-held above 60°C / Insulated food warmers</option>
                <option value="Chilled between 2°C - 4°C in walk-in commercial refrigerator">Chilled between 2°C - 4°C in walk-in commercial refrigerator</option>
                <option value="Cool dry ambient room temperature (produce / bakery)">Cool dry ambient room temperature (produce / bakery)</option>
                <option value="Deep frozen below -18°C">Deep frozen below -18°C</option>
              </select>
            </div>

            {/* Allergen Disclosure */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Allergen Disclosure (Select all applicable) *
              </label>
              <div className="flex flex-wrap gap-2">
                {ALLERGEN_OPTIONS.map(a => {
                  const selected = selectedAllergens.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAllergen(a)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                        selected
                          ? 'bg-forest-100 border-forest-500 text-forest-900 dark:bg-forest-950/80 dark:text-mint-300 font-bold'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-darkborder text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {selected && '✓ '}
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 4: Pickup Logistics */}
          <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-slate-200 dark:border-darkborder shadow-card space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-forest-100 text-forest-800 dark:bg-forest-900/60 dark:text-mint-400 text-xs flex items-center justify-center font-bold">4</span>
              Pickup Logistics
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Exact Kitchen Pickup Address (Loading Dock / Access Point) *
              </label>
              <input
                type="text"
                required
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="e.g. 452 Grand Culinary Blvd, Bay 3"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pickup Availability & Courier Instructions *
              </label>
              <input
                type="text"
                required
                value={pickupAvailability}
                onChange={(e) => setPickupAvailability(e.target.value)}
                placeholder="e.g. Loading bay open until 17:30. Ask for Kitchen Manager."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 5: Mandatory Food Safety Declaration */}
          <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-slate-200 dark:border-darkborder shadow-card space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-forest-100 text-forest-800 dark:bg-forest-900/60 dark:text-mint-400 text-xs flex items-center justify-center font-bold">5</span>
              Donor Food Safety Certification
            </h2>

            <SafetyChecklist
              checklist={safetyChecklist}
              onChange={setSafetyChecklist}
              readOnly={false}
            />
          </div>

          {/* Submit Button */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-darkborder flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              ⚡ Upon listing, our <strong>Smart Matching Engine</strong> will automatically score and rank nearby verified NGOs.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-warm-400" />
              {submitting ? 'Publishing & Computing Matches...' : 'Publish Surplus & Find Matches'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
