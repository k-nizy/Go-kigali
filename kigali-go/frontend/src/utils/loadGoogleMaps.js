/**
 * Google Maps loader utility
 * Ensures Google Maps is loaded before use
 */

let googleMapsPromise = null;

/**
 * Load Google Maps API script
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise} Promise that resolves when Google Maps is loaded
 */
export const loadGoogleMaps = (apiKey) => {
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  // Check if already loaded
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.google && window.google.maps) {
          resolve(window.google.maps);
        } else {
          reject(new Error('Google Maps failed to load'));
        }
      });
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,drawing`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps failed to load'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps script'));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

/**
 * Check if Google Maps is loaded
 * @returns {boolean}
 */
export const isGoogleMapsLoaded = () => {
  return !!(window.google && window.google.maps);
};



