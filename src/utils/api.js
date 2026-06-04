// src/utils/api.js
import axios from 'axios';

const API = axios.create({
 // baseURL: 'http://localhost:5000/api', // sesuaikan dengan base URL backend-mu
 baseURL: import.meta.env.VITE_API_URL || 'project-umkmb-backend-production.up.railway.app/api'
});

// 1. Request Interceptor: Otomatis menyisipkan token ke setiap request BE
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. Response Interceptor: 🔥 MENANGKAP TOKEN EXPIRED SECARA OTOMATIS
API.interceptors.response.use(
  (response) => response, // Jika request sukses, teruskan saja
  (error) => {
    // 💡 CEK: Apakah error ini berasal dari rute /authentication (Login)?
    // Jika iya, jangan ditendang ke /login agar pesan salah password bisa muncul!
    const isRouteLogin = error.config?.url?.includes('/authentication');

    if (!isRouteLogin && error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Sesi Anda telah berakhir (Token Expired). Mengalihkan ke halaman login...');
      
      localStorage.removeItem('accessToken'); 
      localStorage.removeItem('user');  
      
      window.location.href = '/login'; 
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default API;