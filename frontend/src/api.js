import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Create API Instance
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth Service
export const authService = {
  async login(email, password) {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    
    const response = await api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      const userRes = await this.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(userRes));
      return userRes;
    }
    return null;
  },

  async register(fullName, email, password, role = 'doctor') {
    const response = await api.post('/auth/register', {
      full_name: fullName,
      email,
      password,
      role
    });
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getUser() {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }
};

// Diagnosis Service
export const diagnosisService = {
  async analyzeScan(formData) {
    const response = await api.post('/predictions/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async getHistory(search = '', category = '', minConfidence = '') {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (minConfidence) params.min_confidence = minConfidence;
    
    const response = await api.get('/predictions/', { params });
    return response.data;
  },

  async getPredictionDetail(id) {
    const response = await api.get(`/predictions/${id}`);
    return response.data;
  }
};

// Analytics Service
export const analyticsService = {
  async getDashboardData() {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  }
};

// Admin Service
export const adminService = {
  async getActivityLogs() {
    const response = await api.get('/admin/logs');
    return response.data;
  },
  
  async getUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async updateMetrics(metricsData) {
    const response = await api.post('/admin/metrics', metricsData);
    return response.data;
  }
};
