/**
 * Date and Countdown Utilities for FoodBridge
 */

export function formatDateTime(isoString) {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return isoString;
  }
}

export function formatTime(isoString) {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return isoString;
  }
}

export function getTimeRemaining(deadlineIso) {
  if (!deadlineIso) return { expired: false, hours: 0, minutes: 0, seconds: 0, totalMs: 0, text: 'No deadline' };
  
  const target = new Date(deadlineIso).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { expired: true, hours: 0, minutes: 0, seconds: 0, totalMs: 0, text: 'Expired' };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  let text = '';
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    text = `${days}d ${hours % 24}h remaining`;
  } else if (hours > 0) {
    text = `${hours}h ${minutes}m remaining`;
  } else {
    text = `${minutes}m ${seconds}s remaining`;
  }

  return {
    expired: false,
    hours,
    minutes,
    seconds,
    totalMs: diff,
    text
  };
}

export function getUrgencyLevel(deadlineIso, category = 'Cooked meals') {
  if (!deadlineIso) return 'Normal';
  
  const { expired, totalMs } = getTimeRemaining(deadlineIso);
  if (expired) return 'Expired';

  const hoursRemaining = totalMs / (1000 * 60 * 60);

  // Cooked meals spoil faster, so tighter threshold
  const isCooked = category === 'Cooked meals' || category === 'Dairy products';

  if (hoursRemaining <= (isCooked ? 2.5 : 2.0)) {
    return 'Critical';
  } else if (hoursRemaining <= (isCooked ? 5.0 : 4.0)) {
    return 'High';
  } else if (hoursRemaining <= (isCooked ? 12.0 : 8.0)) {
    return 'Medium';
  }
  return 'Normal';
}
