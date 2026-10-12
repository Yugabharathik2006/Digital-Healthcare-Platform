/**
 * Centralized API Client for Healthcare Platform
 * Automatically injects JWT Bearer tokens and handles responses & error normalization.
 */

const API_BASE = '/api';

export const getToken = () => localStorage.getItem('care_sync_token');
export const setToken = (token) => localStorage.setItem('care_sync_token', token);
export const removeToken = () => localStorage.removeItem('care_sync_token');

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('care_sync_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user) => {
  if (user) localStorage.setItem('care_sync_user', JSON.stringify(user));
  else localStorage.removeItem('care_sync_user');
};

async function apiRequest(endpoint, { method = 'GET', body, headers = {} } = {}) {
  const token = getToken();
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...headers
  };

  const config = {
    method,
    headers: defaultHeaders,
    ...(body ? { body: JSON.stringify(body) } : {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Authentication
  auth: {
    login: (email, password) => apiRequest('/auth/login', { method: 'POST', body: { email, password } }),
    register: (userData) => apiRequest('/auth/register', { method: 'POST', body: userData }),
  },

  // Doctors
  doctors: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams(params).toString();
      return apiRequest(`/doctors${searchParams ? `?${searchParams}` : ''}`);
    },
    getById: (id) => apiRequest(`/doctors/${id}`),
    getAvailability: (id, date) => apiRequest(`/doctors/${id}/availability?date=${date}`),
    updateAvailability: (data) => apiRequest('/doctors/availability', { method: 'PUT', body: data }),
  },

  // Appointments
  appointments: {
    book: (data) => apiRequest('/appointments', { method: 'POST', body: data }),
    getMy: () => apiRequest('/appointments/my'),
    cancel: (id, reason) => apiRequest(`/appointments/${id}/cancel`, { method: 'PATCH', body: { reason } }),
    complete: (id) => apiRequest(`/appointments/${id}/complete`, { method: 'PATCH' }),
  },

  // Consultations
  consultations: {
    create: (data) => apiRequest('/consultations', { method: 'POST', body: data }),
  },

  // Prescriptions
  prescriptions: {
    getMy: () => apiRequest('/prescriptions/my'),
    getById: (id) => apiRequest(`/prescriptions/${id}`),
    create: (data) => apiRequest('/prescriptions', { method: 'POST', body: data }),
  },

  // Admin
  admin: {
    getDashboard: () => apiRequest('/admin/dashboard'),
    getAppointments: () => apiRequest('/admin/appointments'),
  },

  // High-Level Design (HLD) Live Telemetry
  hld: {
    getArchitecture: () => apiRequest('/hld/architecture'),
  }
};
