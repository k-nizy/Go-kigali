/**
 * Error handling utilities for KigaliGo frontend
 */

// Error types and their user-friendly messages
export const ERROR_MESSAGES = {
  NETWORK: {
    title: 'Network Error',
    message: 'Unable to connect to the server. Please check your internet connection.',
    action: 'Please try again later.'
  },
  TIMEOUT: {
    title: 'Request Timeout',
    message: 'The request took too long to complete.',
    action: 'Please check your connection and try again.'
  },
  SERVER_ERROR: {
    title: 'Server Error',
    message: 'Something went wrong on our end.',
    action: 'Please try again in a few minutes.'
  },
  NOT_FOUND: {
    title: 'Not Found',
    message: 'The requested resource was not found.',
    action: 'Please check the information and try again.'
  },
  UNAUTHORIZED: {
    title: 'Authentication Required',
    message: 'You need to be logged in to access this feature.',
    action: 'Please log in to continue.'
  },
  FORBIDDEN: {
    title: 'Access Denied',
    message: 'You don\'t have permission to perform this action.',
    action: 'Contact support if you believe this is an error.'
  },
  VALIDATION: {
    title: 'Invalid Input',
    message: 'Please check your input and try again.',
    action: 'Make sure all required fields are filled correctly.'
  },
  RATE_LIMIT: {
    title: 'Too Many Requests',
    message: 'You\'ve made too many requests. Please wait.',
    action: 'Try again in a few moments.'
  },
  UNKNOWN: {
    title: 'Unexpected Error',
    message: 'An unexpected error occurred.',
    action: 'Please try again or contact support.'
  }
};

// Get error type from HTTP status code
export const getErrorType = (status) => {
  if (!status) return 'NETWORK';
  
  switch (status) {
    case 400: return 'VALIDATION';
    case 401: return 'UNAUTHORIZED';
    case 403: return 'FORBIDDEN';
    case 404: return 'NOT_FOUND';
    case 429: return 'RATE_LIMIT';
    case 500:
    case 502:
    case 503:
    case 504: return 'SERVER_ERROR';
    default: return 'UNKNOWN';
  }
};

// Get user-friendly error message
export const getErrorMessage = (error) => {
  // Handle network errors
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return ERROR_MESSAGES.TIMEOUT;
    }
    return ERROR_MESSAGES.NETWORK;
  }
  
  // Handle HTTP errors
  const status = error.response.status;
  const errorType = getErrorType(status);
  const baseMessage = ERROR_MESSAGES[errorType];
  
  // Try to get more specific message from server response
  const serverMessage = error.response.data?.message;
  const serverSuggestion = error.response.data?.suggestion;
  
  return {
    ...baseMessage,
    details: serverMessage,
    suggestion: serverSuggestion || baseMessage.action,
    status,
    request_id: error.response.data?.request_id
  };
};

// Log errors for debugging
export const logError = (error, context = {}) => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    context,
    message: error.message,
    stack: error.stack,
    response: error.response ? {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    } : null,
    config: error.config ? {
      url: error.config.url,
      method: error.config.method,
      headers: error.config.headers
    } : null
  };
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', errorInfo);
  }
  
  // In production, you might want to send this to a logging service
  // For example: Sentry, LogRocket, etc.
  return errorInfo;
};

// Show user-friendly error notification
export const showErrorNotification = (error, toast) => {
  const errorMessage = getErrorMessage(error);
  
  // Log error for debugging
  logError(error);
  
  // Show user-friendly notification
  toast.error(errorMessage.title, {
    description: `${errorMessage.message}. ${errorMessage.suggestion}`,
    duration: 5000,
    position: 'top-right'
  });
  
  return errorMessage;
};

// Retry failed requests with exponential backoff
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};
