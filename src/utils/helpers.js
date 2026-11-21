/**
 * General helper utilities for FoodBridge
 */

// Haversine formula to compute great-circle distance between two points in km
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 2.5; // fallback estimate
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

// Generate unique sequential or random secure IDs
export function generateDonationId(existingDonations = []) {
  const year = new Date().getFullYear();
  const nextNum = existingDonations.length + 1;
  const padded = String(nextNum).padStart(4, '0');
  return `FB-${year}-${padded}`;
}

export function generateToken(prefix = 'FB-PICK') {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}

// Export dataset to CSV download
export function exportToCsv(filename, rows) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Obfuscate full residential address for privacy on public views
export function obfuscateAddress(fullAddress, approxLocation) {
  if (approxLocation) return approxLocation;
  if (!fullAddress) return 'Metro City Area';
  // Strip street numbers and suites: e.g. "452 Grand Blvd, Suite 2" -> "Grand Blvd Area, Metro City"
  const parts = fullAddress.split(',');
  if (parts.length > 1) {
    const street = parts[0].replace(/^\d+[\s-]+/, '').trim();
    return `${street} vicinity, ${parts[1].trim()}`;
  }
  return fullAddress.replace(/^\d+[\s-]+/, 'Near ');
}

// Points and Gamification calculator
export function calculateImpactPoints({ portions, completedCount = 1 }) {
  // 10 base pts per completed rescue + 1 pt per 2 portions
  const portionPoints = Math.round((portions || 10) / 2);
  const basePoints = 15;
  return basePoints + portionPoints;
}

// Badges eligibility checker
export function getEarnedBadges({ completedCount, totalPortions }) {
  const badges = [];
  if (completedCount >= 1) badges.push('First Rescue');
  if (completedCount >= 5) badges.push('Reliable Partner');
  if (completedCount >= 10) badges.push('Community Champion');
  if (totalPortions >= 100) badges.push('100 Portions Rescued');
  if (totalPortions >= 500) badges.push('Food Hero');
  if (totalPortions >= 1000) badges.push('Zero-Waste Pioneer');
  return badges;
}
