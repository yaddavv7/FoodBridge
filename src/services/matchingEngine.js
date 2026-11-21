/**
 * FoodBridge - Smart Matching Engine
 * 
 * Transparent rule-based donor-to-NGO recommendation algorithm.
 * Evaluates NGO fitness against a donation based on:
 * 1. Geographic distance (25 pts)
 * 2. Category compatibility (20 pts)
 * 3. Quantity & capacity alignment (20 pts)
 * 4. Safe collection timeline feasibility (20 pts)
 * 5. NGO demand & community urgency (15 pts)
 * 
 * Total: 100 points
 */

import { calculateDistanceKm } from '../utils/helpers';
import { getTimeRemaining } from '../utils/dateUtils';

export function calculateNgoMatch(donation, ngo) {
  if (!donation || !ngo) return null;

  const reasons = [];
  let score = 0;

  // 1. Geographic Distance (Max 25 pts)
  const distanceKm = calculateDistanceKm(
    donation.lat,
    donation.lng,
    ngo.lat,
    ngo.lng
  );

  let distanceScore = 0;
  if (distanceKm <= 2.0) {
    distanceScore = 25;
    reasons.push(`Super close proximity (${distanceKm} km away)`);
  } else if (distanceKm <= 5.0) {
    distanceScore = 20;
    reasons.push(`Nearby location (${distanceKm} km away)`);
  } else if (distanceKm <= 10.0) {
    distanceScore = 14;
    reasons.push(`Within standard transit zone (${distanceKm} km away)`);
  } else if (distanceKm <= 20.0) {
    distanceScore = 8;
    reasons.push(`Within metropolitan boundary (${distanceKm} km away)`);
  } else {
    distanceScore = 2;
    reasons.push(`Longer transit distance (${distanceKm} km away)`);
  }
  score += distanceScore;

  // 2. Food Category Compatibility (Max 20 pts)
  let categoryScore = 0;
  const preferred = ngo.preferredCategories || [];
  const donationCategory = donation.category;

  if (preferred.includes(donationCategory)) {
    categoryScore = 20;
    reasons.push(`Requires & serves "${donationCategory}" regularly`);
  } else {
    // If NGO accepts general items or has wide pantry
    categoryScore = 10;
    reasons.push(`Accepts diversified shelf foods`);
  }
  score += categoryScore;

  // 3. Quantity & Portion Compatibility (Max 20 pts)
  let quantityScore = 0;
  const neededPortions = ngo.neededPortions || 50;
  const offeredPortions = donation.estimatedPortions || donation.quantity || 1;
  const ratio = Math.min(offeredPortions, neededPortions) / Math.max(offeredPortions, neededPortions);

  if (offeredPortions <= neededPortions && offeredPortions >= neededPortions * 0.4) {
    quantityScore = 20;
    reasons.push(`Portions offered (${offeredPortions}) align cleanly with current demand (${neededPortions})`);
  } else if (offeredPortions <= ngo.capacityPortions) {
    quantityScore = 15;
    reasons.push(`Facility has certified capacity for all ${offeredPortions} portions`);
  } else {
    quantityScore = 8;
    reasons.push(`Large batch may require partial distribution support`);
  }
  score += quantityScore;

  // 4. Safe Collection Timeline Feasibility (Max 20 pts)
  let timeScore = 0;
  const { hours, expired } = getTimeRemaining(donation.deadline);

  if (expired) {
    timeScore = 0;
    reasons.push(`Collection deadline has expired`);
  } else if (hours >= 3) {
    timeScore = 20;
    reasons.push(`Comfortable collection window (>3 hrs remaining)`);
  } else if (hours >= 1.5) {
    timeScore = 16;
    reasons.push(`Rapid courier dispatch feasible within remaining window`);
  } else {
    timeScore = 10;
    reasons.push(`Urgent pickup required (<1.5 hrs remaining)`);
  }
  score += timeScore;

  // 5. NGO Demand & Community Urgency (Max 15 pts)
  let demandScore = 0;
  const urgency = ngo.urgencyLevel || 'Medium';

  if (urgency === 'Critical') {
    demandScore = 15;
    reasons.push(`High community meal demand today (Critical need)`);
  } else if (urgency === 'High') {
    demandScore = 12;
    reasons.push(`Elevated meal distribution demand`);
  } else {
    demandScore = 8;
    reasons.push(`Steady routine daily distribution`);
  }
  score += demandScore;

  // Bonus/Deduction for Verification status
  if (!ngo.verified) {
    score = Math.max(0, score - 20);
    reasons.push(`Note: NGO verification documents are under administrator review`);
  } else {
    reasons.push(`Verified Community Food Bank`);
  }

  // Ensure score is capped 0 - 100
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  return {
    ngoId: ngo.id,
    ngoName: ngo.name,
    ngoAddress: ngo.address,
    ngoPhone: ngo.phone,
    ngoEmail: ngo.email,
    distanceKm,
    matchScore: finalScore,
    breakdown: {
      distanceScore,
      categoryScore,
      quantityScore,
      timeScore,
      demandScore,
    },
    reasons,
    verified: ngo.verified,
    storageFacilities: ngo.storageFacilities,
  };
}

export function rankNgoMatchesForDonation(donation, allNgos = []) {
  if (!donation || !allNgos.length) return [];

  const evaluated = allNgos
    .map(ngo => calculateNgoMatch(donation, ngo))
    .filter(Boolean);

  // Sort descending by match score
  return evaluated.sort((a, b) => b.matchScore - a.matchScore);
}
