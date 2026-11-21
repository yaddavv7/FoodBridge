/**
 * FoodBridge - Food Rescue Priority Engine
 * Computes urgency triage levels and dynamic countdown statuses.
 */

import { getTimeRemaining } from '../utils/dateUtils';

export function evaluateDonationPriority(donation) {
  if (!donation) return { priority: 'Normal', color: 'blue', badgeText: 'Normal' };

  if (donation.status === 'VERIFIED') {
    return { priority: 'Completed', color: 'emerald', badgeText: 'Completed' };
  }
  if (donation.status === 'EXPIRED') {
    return { priority: 'Expired', color: 'slate', badgeText: 'Expired' };
  }

  const { expired, hours, minutes, text } = getTimeRemaining(donation.deadline);

  if (expired) {
    return {
      priority: 'Expired',
      color: 'slate',
      badgeText: 'Expired',
      countdownText: 'Safe window ended',
      isUrgent: false,
    };
  }

  const isCooked = donation.category === 'Cooked meals' || donation.category === 'Dairy products';
  const totalHours = hours + (minutes / 60);

  // Critical: cooked meals < 2 hrs or any item < 1 hr
  if (totalHours <= 1.5 || (isCooked && totalHours <= 2.2)) {
    return {
      priority: 'Critical',
      color: 'rose',
      badgeText: 'CRITICAL RESCUE',
      countdownText: text,
      isUrgent: true,
      alertNote: 'High rescue priority: Pickup required immediately to preserve fresh warmth/chilling.',
    };
  }

  // High: < 4 hrs
  if (totalHours <= 4.0) {
    return {
      priority: 'High',
      color: 'amber',
      badgeText: 'HIGH URGENCY',
      countdownText: text,
      isUrgent: true,
      alertNote: 'Expedited collection recommended within the next few hours.',
    };
  }

  // Medium: < 12 hrs
  if (totalHours <= 12.0) {
    return {
      priority: 'Medium',
      color: 'emerald',
      badgeText: 'MODERATE',
      countdownText: text,
      isUrgent: false,
      alertNote: 'Standard scheduled pickup window.',
    };
  }

  // Normal: > 12 hrs (packaged, dry goods, fresh produce)
  return {
    priority: 'Normal',
    color: 'teal',
    badgeText: 'STANDARD',
    countdownText: text,
    isUrgent: false,
    alertNote: 'Flexible collection timeline.',
  };
}
