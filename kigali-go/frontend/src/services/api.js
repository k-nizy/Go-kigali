import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
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

  // Vehicles
  vehicles: {
    getNearby: (lat, lng, radius = 1.0, type = null) => {
      let url = `/api/v1/vehicles/nearby?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&radius=${encodeURIComponent(radius)}`;
      if (type) url += `&type=${encodeURIComponent(type)}`;
      return api.get(url);
    },
  },

  // Zones and stops
  zones: {
    getAll: () => api.get('/api/v1/zones'),
  },
  stops: {
    getByZone: (zoneId) => api.get(`/api/v1/stops?zone_id=${encodeURIComponent(zoneId)}`),
    getAll: () => api.get('/api/v1/stops'),
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
