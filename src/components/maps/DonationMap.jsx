import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { MapPin, Filter, Search, ShieldAlert, Eye, Navigation, Layers } from 'lucide-react';
import { evaluateDonationPriority } from '../../services/urgencyEngine';
import { obfuscateAddress } from '../../utils/helpers';

// Helper to create custom SVG marker icons
function createSvgMarker(type = 'donation', urgency = 'Normal') {
  let bgColor = '#15803d'; // forest green
  let strokeColor = '#ffffff';
  let iconSvg = '';

  if (type === 'ngo') {
    bgColor = '#0284c7'; // ocean blue
    iconSvg = `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>`;
  } else if (type === 'volunteer') {
    bgColor = '#ea580c'; // warm orange
    iconSvg = `<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>`;
  } else {
    // Donation
    if (urgency === 'Critical') bgColor = '#e11d48'; // rose
    else if (urgency === 'High') bgColor = '#d97706'; // amber
    iconSvg = `<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/>`;
  }

  const svgHtml = `
    <div style="
      position: relative;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${bgColor};
      border: 2.5px solid ${strokeColor};
      border-radius: 50%;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      cursor: pointer;
      transform: translate(-50%, -50%);
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        ${iconSvg}
      </svg>
      ${urgency === 'Critical' ? `<span style="position: absolute; top: -2px; right: -2px; width: 10px; height: 10px; background: #ff0055; border: 2px solid #fff; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>` : ''}
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-map-pin',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

export default function DonationMap({
  donations = [],
  ngos = [],
  selectedId = null,
  height = '500px',
  showFilters = true,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const navigate = useNavigate();

  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'DONATIONS' | 'NGOS'
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    const map = L.map(mapContainerRef.current, {
      center: [40.7180, -74.0020],
      zoom: 13,
      zoomControl: false,
    });

    // Clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers based on filters
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Render Donations
    if (filterType === 'ALL' || filterType === 'DONATIONS') {
      donations.forEach(donation => {
        if (filterCategory !== 'ALL' && donation.category !== filterCategory) return;
        if (searchQuery && !donation.title.toLowerCase().includes(searchQuery.toLowerCase())) return;

        const priority = evaluateDonationPriority(donation);
        const icon = createSvgMarker('donation', priority.priority);

        const marker = L.marker([donation.lat, donation.lng], { icon });

        // Privacy compliant address display
        const displayAddress = obfuscateAddress(donation.pickupAddress, donation.publicApproxLocation);

        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 font-sans max-w-xs';
        popupContent.innerHTML = `
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #15803d; margin-bottom: 2px;">
            Food Rescue Listing • ${donation.category}
          </div>
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: #0f172a;">
            ${donation.title}
          </div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 8px;">
            📍 ${displayAddress}
          </div>
          <div style="display: flex; gap: 8px; margin-bottom: 10px; font-size: 11px;">
            <span style="background: #ecfdf5; color: #047857; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
              ${donation.estimatedPortions} Portions
            </span>
            <span style="background: #f1f5f9; color: #334155; padding: 2px 6px; border-radius: 4px;">
              ${priority.countdownText || 'Active'}
            </span>
          </div>
          <div style="font-size: 10px; color: #94a3b8; margin-bottom: 8px; border-top: 1px solid #f1f5f9; padding-top: 4px;">
            🔒 Exact street & contact details unlocked upon acceptance.
          </div>
          <button id="btn-view-${donation.id}" style="
            width: 100%;
            background: #15803d;
            color: #ffffff;
            border: none;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
          ">
            View Rescue Details
          </button>
        `;

        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-view-${donation.id}`);
          if (btn) {
            btn.onclick = () => {
              navigate(`/donations/${donation.id}`);
            };
          }
        });

        markersLayerRef.current.addLayer(marker);
      });
    }

    // 2. Render NGOs
    if (filterType === 'ALL' || filterType === 'NGOS') {
      ngos.forEach(ngo => {
        if (searchQuery && !ngo.name.toLowerCase().includes(searchQuery.toLowerCase())) return;

        const icon = createSvgMarker('ngo');
        const marker = L.marker([ngo.lat, ngo.lng], { icon });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 font-sans max-w-xs';
        popupContent.innerHTML = `
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #0284c7; margin-bottom: 2px;">
            Verified NGO Receiver
          </div>
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: #0f172a;">
            ${ngo.name}
          </div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 6px;">
            📍 ${ngo.address}
          </div>
          <div style="font-size: 11px; color: #0369a1; background: #f0f9ff; padding: 4px 8px; border-radius: 6px; margin-bottom: 8px;">
            Needs: <strong>${ngo.neededPortions || 50} portions</strong> daily
          </div>
          <div style="font-size: 11px; color: #64748b;">
            Facilities: ${ngo.storageFacilities || 'Standard Storage'}
          </div>
        `;

        marker.bindPopup(popupContent);
        markersLayerRef.current.addLayer(marker);
      });
    }
  }, [donations, ngos, filterCategory, filterType, searchQuery, navigate]);

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-darkborder bg-white dark:bg-darkcard shadow-card">
      {/* Top Filter Bar */}
      {showFilters && (
        <div className="p-4 border-b border-slate-100 dark:border-darkborder flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search food listings, caterers, or NGOs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">Show All Pins</option>
              <option value="DONATIONS">Food Listings Only</option>
              <option value="NGOS">Verified NGOs Only</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Cooked meals">Cooked meals</option>
              <option value="Bakery products">Bakery products</option>
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Dairy products">Dairy products</option>
              <option value="Packaged food">Packaged food</option>
            </select>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="relative w-full" style={{ height }}>
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 dark:bg-darkcard/95 backdrop-blur-sm p-3 rounded-xl border border-slate-200 dark:border-darkborder shadow-md text-[11px] space-y-1.5 pointer-events-auto">
          <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5" /> Map Legend
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-forest-600 border border-white"></span>
            <span>Active Food Listing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 border border-white"></span>
            <span>Critical Urgent Rescue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-600 border border-white"></span>
            <span>Verified NGO Hub</span>
          </div>
        </div>
      </div>

      {/* Privacy Notice Footer */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-darkborder flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-mint-400 shrink-0" />
        <span>
          <strong>Privacy Safeguard:</strong> Exact pickup addresses are obfuscated on public maps to preserve donor privacy until a verified NGO accepts the rescue task.
        </span>
      </div>
    </div>
  );
}
