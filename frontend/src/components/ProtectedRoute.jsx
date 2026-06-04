// src/components/ProtectedRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'

// Mengambil "children" (yaitu <DefaultLayout /> yang dikirim dari App.jsx)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken')

  // 1. Jika token kosong/tidak ada, langsung tendang balik ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // 2. Jika token ada, loloskan dan tampilkan halaman internalnya
  return children
}

export default ProtectedRoute