/**
 * Format utilities for KigaliGo frontend
 */

// Format distance in kilometers
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

// Format duration in minutes
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

// Format currency
export const formatCurrency = (amount, currency = 'RWF') => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(amount);
};

// Format time for display
export const formatTime = (date) => {
  return new Intl.DateTimeFormat('en-RW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date(date));
};

// Format date for display
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-RW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};
