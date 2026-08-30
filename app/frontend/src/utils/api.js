import axios from 'axios';

// In production on Vercel, requests to '/api/...' go directly to the same origin serverless function.
// In local development, VITE_API_URL points to 'http://127.0.0.1:8000' or default.
const BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Format local Date object to YYYY-MM-DD string without UTC timezone skew
 */
export const formatLocalDate = (date) => {
  if (!date) return '';
  if (typeof date === 'string') {
    // If it's already YYYY-MM-DD, return it
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const api = {
  formatLocalDate,

  // Check appointment slot availability for a specific date
  checkAvailability: async (date) => {
    const dateStr = formatLocalDate(date);
    const response = await apiClient.get(`/api/appointments/check-availability?date=${encodeURIComponent(dateStr)}`);
    return response.data;
  },

  // Book a new appointment
  bookAppointment: async (formData) => {
    const response = await apiClient.post('/api/appointments', formData);
    return response.data;
  },

  // Get all appointments (optional password check)
  getAppointments: async (password = 'doctor123') => {
    const url = password ? `/api/appointments?password=${encodeURIComponent(password)}` : '/api/appointments';
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get appointments for a specific date
  getAppointmentsByDate: async (date) => {
    const dateStr = formatLocalDate(date);
    const response = await apiClient.get(`/api/appointments/date/${encodeURIComponent(dateStr)}`);
    return response.data;
  },

  // Delete an appointment by ID
  deleteAppointment: async (id) => {
    const response = await apiClient.delete(`/api/appointments/${id}`);
    return response.data;
  },

  // Status check ping
  checkStatus: async () => {
    const response = await apiClient.get('/api/status');
    return response.data;
  },
};

export default api;

