import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

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
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.post('/auth/change-password', data),
  },

  // Trip planning
  routes: {
    plan: (origin, destination) => 
      api.get(`/routes/plan?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`),
  },

  // Vehicles
  vehicles: {
    getNearby: (lat, lng, radius = 1.0, type = null) => {
      let url = `/vehicles/nearby?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&radius=${encodeURIComponent(radius)}`;
      if (type) url += `&type=${encodeURIComponent(type)}`;
      return api.get(url);
    },
  },

  // Zones and stops
  zones: {
    getAll: () => api.get('/zones'),
  },
  stops: {
    getByZone: (zoneId) => api.get(`/stops?zone_id=${encodeURIComponent(zoneId)}`),
    getAll: () => api.get('/stops'),
  },

  // Fare estimation
  fare: {
    estimate: (distance, duration, mode) =>
      api.get(`/fare/estimate?distance_km=${encodeURIComponent(distance)}&duration_minutes=${encodeURIComponent(duration)}&mode=${encodeURIComponent(mode)}`),
  },

  // Reports
  reports: {
    create: (data) => api.post('/reports', data),
    getAll: (params = {}) => api.get('/reports', { params }),
  },

  // Statistics
  statistics: {
    get: () => api.get('/statistics'),
  },

  // Admin endpoints
  admin: {
    getDashboard: () => api.get('/admin/dashboard'),
    getVehicles: (params = {}) => api.get('/admin/vehicles', { params }),
    updateVehicle: (id, data) => api.put(`/admin/vehicles/${id}`, data),
    getReports: (params = {}) => api.get('/admin/reports', { params }),
    updateReport: (id, data) => api.put(`/admin/reports/${id}`, data),
    seedData: () => api.post('/admin/seed'),
    simulateMovement: () => api.post('/admin/vehicles/simulate'),
  },
};

export default api;
