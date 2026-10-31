import axios from 'axios';

// Alamat backend diatur lewat variabel lingkungan (.env), bukan ditulis langsung (hardcode).
// Pas development (di komputer sendiri), kalau VITE_API_URL tidak diisi, otomatis pakai localhost.
// Pas deploy, alamat ini diisi lewat environment variable di platform hosting (Vercel/Railway).
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
