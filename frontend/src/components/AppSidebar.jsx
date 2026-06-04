import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom' // Ditambahkan untuk navigasi logout aman

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CButton, // <-- Pastikan CButton ter-import di sini
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons' // <-- Mengimport ikon gembok logout secara resmi

import { AppSidebarNav } from './AppSidebarNav'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate() // Hook untuk pindah halaman tanpa reload
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  // Perbarui fungsi handleLogout di AppSidebar.jsx kamu:

  const handleLogout = () => {
    console.log('User logged out from Sidebar, clearing token...')
    
    localStorage.removeItem('accessToken') 
    navigate('/', { replace: true }) 
  }

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/dashboard" className="text-decoration-none">
          {/* Teks Logo Aplikasi Utama saat Sidebar Terbuka */}
          <span className="sidebar-brand-full fs-5 fw-bold text-white">
            Keuangan<span className="text-info">UMKM</span>
          </span>
          
          {/* Teks Singkat saat Sidebar mengecil */}
          <span className="sidebar-brand-narrow fs-5 fw-bold text-info">
            KU
          </span>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      {/* Bagian Menu Navigasi Tengah */}
      <AppSidebarNav items={navigation} />

      {/* ==================== 2. FOOTER LOGOUT BARU KAMU ==================== */}
      <CSidebarFooter className="border-top p-2 d-flex">
        <CButton 
         
          variant="ghost" 
          className="w-100 d-flex align-items-center justify-content-start gap-3 py-2 px-3 text-start border-0"
          onClick={handleLogout}
        >
          <CIcon icon={cilLockLocked} size="lg" className="text-danger" />
          <span className="fw-semibold text-danger sidebar-brand-full">Keluar Aplikasi</span>
          <span className="fw-semibold text-danger sidebar-brand-narrow">Out</span>
        </CButton>
      </CSidebarFooter>

    </CSidebar>
  )
}

export default React.memo(AppSidebar)