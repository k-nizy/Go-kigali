/**
 * Report Notification System
 * 
 * Provides friendly, conversational notification messages for report submissions.
 * Randomly selects from a pool of encouraging messages to make users feel
 * appreciated for contributing to better transport in Kigali.
 * 
 * @module reportNotifications
 */

import { toast } from 'react-hot-toast';

/**
 * Array of friendly success messages for report submissions.
 * Each message is designed to be warm, encouraging, and action-oriented.
 */
const SUCCESS_MESSAGES = [
  "Thanks for speaking up! We're checking your report right now.",
  "Got it! We'll look into your report as soon as possible.",
  "Your report just made Kigali's roads a little better!",
  "Report sent 🚀 We'll update you once it's reviewed.",
  "Thanks for helping us keep transport smooth for everyone.",
  "Nice one! Your report's on its way to our team 🚴‍♂️.",
  "Appreciate it! Every report helps keep Kigali moving safely.",
  "All set! We've received your report and are already checking it out.",
  "Thanks a ton! Your voice helps improve transport for everyone.",
  "Good job! You just made KigaliGo a bit smarter today 🤝.",
];

/**
 * Error message displayed when report submission fails.
 */
const ERROR_MESSAGE = "Oops! Something went wrong while sending your report. Please try again.";

/**
 * Randomly selects a success message from the pool.
 * 
 * @returns {string} A randomly selected success message
 */
const getRandomSuccessMessage = () => {
  const randomIndex = Math.floor(Math.random() * SUCCESS_MESSAGES.length);
  return SUCCESS_MESSAGES[randomIndex];
};

/**
 * Displays a success notification with a random friendly message.
 * Uses React Hot Toast with custom styling for a polished look.
 * 
 * Features:
 * - Random message selection for variety
 * - Auto-dismiss after 3 seconds
 * - Green accent with success icon
 * - Smooth fade-in/out animation
 * - Accessible ARIA labels
 * 
 * @example
 * showReportSuccessNotification();
 * // Displays: "Thanks for speaking up! We're checking your report right now."
 */
export const showReportSuccessNotification = () => {
  const message = getRandomSuccessMessage();
  
  toast.success(message, {
    duration: 3000,
    position: 'top-center',
    icon: '✅',
    style: {
      background: '#10B981',
      color: '#fff',
      fontWeight: '500',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
    },
    ariaProps: {
      role: 'status',
      'aria-live': 'polite',
    },
  });
};

/**
 * Displays an error notification when report submission fails.
 * Uses React Hot Toast with error styling.
 * 
 * Features:
 * - Clear error message
 * - Auto-dismiss after 4 seconds (longer for errors)
 * - Red accent with error icon
 * - Smooth fade-in/out animation
 * - Accessible ARIA labels
 * 
 * @example
 * showReportErrorNotification();
 * // Displays: "Oops! Something went wrong while sending your report. Please try again."
 */
export const showReportErrorNotification = () => {
  toast.error(ERROR_MESSAGE, {
    duration: 4000,
    position: 'top-center',
    icon: '❌',
    style: {
      background: '#EF4444',
      color: '#fff',
      fontWeight: '500',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
    },
    ariaProps: {
      role: 'alert',
      'aria-live': 'assertive',
    },
  });
};

/**
 * Handles report submission response and displays appropriate notification.
 * Checks HTTP status code and triggers success or error notification accordingly.
 * 
 * @param {Response} response - Fetch API response object
 * @returns {boolean} True if successful (2xx status), false otherwise
 * 
 * @example
 * const response = await fetch('/api/v1/reports', { method: 'POST', ... });
 * const success = handleReportResponse(response);
 * if (success) {
 *   // Reset form, update UI, etc.
 * }
 */
export const handleReportResponse = (response) => {
  // Check if response status is in the 2xx range (success)
  if (response.ok) {
    showReportSuccessNotification();
    return true;
  } else {
    showReportErrorNotification();
    return false;
  }
};

/**
 * Alternative notification function using custom toast options.
 * Useful for special cases or custom styling needs.
 * 
 * @param {string} message - Custom message to display
 * @param {Object} options - Custom toast options (optional)
 * 
 * @example
 * notifyReportSuccess("Custom success message!", { duration: 5000 });
 */
export const notifyReportSuccess = (message = null, options = {}) => {
  const displayMessage = message || getRandomSuccessMessage();
  
  toast.success(displayMessage, {
    duration: 3000,
    position: 'top-center',
    icon: '✅',
    ...options,
  });
};

/**
 * Alternative error notification function with custom message support.
 * 
 * @param {string} message - Custom error message (optional)
 * @param {Object} options - Custom toast options (optional)
 * 
 * @example
 * notifyReportError("Network error. Please check your connection.");
 */
export const notifyReportError = (message = ERROR_MESSAGE, options = {}) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-center',
    icon: '❌',
    ...options,
  });
};

// Export all messages for testing or custom implementations
export { SUCCESS_MESSAGES, ERROR_MESSAGE };
