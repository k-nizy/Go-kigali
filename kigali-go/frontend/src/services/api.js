import axios from 'axios';
import { getErrorMessage, logError, retryRequest } from '../utils/errorHandler';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    logError(error, { context: 'request_interceptor' });
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log error for debugging
    logError(error, { context: 'response_interceptor' });
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      // Don't redirect immediately, let the component handle it
      // This prevents redirect loops during API calls
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const apiService = {
  // Auth endpoints
  auth: {
    register: (data) => api.post('/api/v1/auth/register', data),
    login: (data) => api.post('/api/v1/auth/login', data),
    getProfile: () => api.get('/api/v1/auth/profile'),
    updateProfile: (data) => api.put('/api/v1/auth/profile', data),
    changePassword: (data) => api.post('/api/v1/auth/change-password', data),
  },

  // Trip planning
  routes: {
    plan: (origin, destination) => 
      api.get(`/api/v1/routes/plan?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`),
  },
  tripPlanning: {
    plan: (data) => api.post('/api/v1/trip-planning/plan', data),
    compare: (data) => api.post('/api/v1/trip-planning/compare', data),
  },
  
  // Saved locations
  savedLocations: {
    getAll: () => api.get('/api/v1/saved-locations/'),
    create: (data) => api.post('/api/v1/saved-locations/', data),
    update: (id, data) => api.put(`/api/v1/saved-locations/${id}`, data),
    delete: (id) => api.delete(`/api/v1/saved-locations/${id}`),
  },

  // Vehicles
  vehicles: {
    getNearby: (lat, lng, radius = 5.0, type = null) => {
      let url = `/api/v1/map/vehicles/nearby?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&radius=${encodeURIComponent(radius)}`;
      if (type) url += `&type=${encodeURIComponent(type)}`;
      return api.get(url);
    },
    getById: (id, lat = null, lng = null) => {
      let url = `/api/v1/map/vehicles/${id}`;
      if (lat && lng) {
        url += `?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`;
      }
      return api.get(url);
    },
    getRealtime: (lat, lng, radius = 5.0, type = null, since = null) => {
      let url = `/api/v1/realtime/vehicles/realtime?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&radius=${encodeURIComponent(radius)}`;
      if (type) url += `&type=${encodeURIComponent(type)}`;
      if (since) url += `&since=${encodeURIComponent(since)}`;
      return api.get(url);
    },
  },

  // User location
  location: {
    update: (data) => api.post('/api/v1/map/user/location', data),
  },

  // Zones and stops
  zones: {
    getAll: () => api.get('/api/v1/zones'),
  },
  stops: {
    getByZone: (zoneId) => api.get(`/api/v1/stops?zone_id=${encodeURIComponent(zoneId)}`),
    getAll: () => api.get('/api/v1/stops'),
    getNearby: (lat, lng, radius = 2.0, type = null) => {
      let url = `/api/v1/map/stops/nearby?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&radius=${encodeURIComponent(radius)}`;
      if (type) url += `&type=${encodeURIComponent(type)}`;
      return api.get(url);
    },
    getWithETA: (lat, lng, radius = 2.0, type = null) => {
      let url = `/api/v1/realtime/stops/eta?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&radius=${encodeURIComponent(radius)}`;
      if (type) url += `&stop_type=${encodeURIComponent(type)}`;
      return api.get(url);
    },
  },

  // Fare estimation
  fare: {
    estimate: (distance, duration, mode) =>
      api.get(`/api/v1/fare/estimate?distance_km=${encodeURIComponent(distance)}&duration_minutes=${encodeURIComponent(duration)}&mode=${encodeURIComponent(mode)}`),
  },

  // Reports
  reports: {
    create: (data) => api.post('/api/v1/reports', data),
    getAll: (params = {}) => api.get('/api/v1/reports', { params }),
  },

  // Statistics
  statistics: {
    get: () => api.get('/api/v1/statistics'),
  },

  // Admin endpoints
  admin: {
    getDashboard: () => api.get('/api/v1/admin/dashboard'),
    getVehicles: (params = {}) => api.get('/api/v1/admin/vehicles', { params }),
    updateVehicle: (id, data) => api.put(`/api/v1/admin/vehicles/${id}`, data),
    getReports: (params = {}) => api.get('/api/v1/admin/reports', { params }),
    updateReport: (id, data) => api.put(`/api/v1/admin/reports/${id}`, data),
    seedData: () => api.post('/api/v1/admin/seed'),
    simulateMovement: () => api.post('/api/v1/admin/vehicles/simulate'),
  },
};

export default api;
