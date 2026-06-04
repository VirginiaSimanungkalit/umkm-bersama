import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilLockLocked, cilHome, cilLocationPin } from '@coreui/icons'
import API from '../../../utils/api'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  // State menampung seluruh data gabungan akun user & warung (Sesuai Skema DS & BE)
  const [registerData, setRegisterData] = useState({
    // 1. Data untuk Tabel User
    username: '',
    password: '',
    confirmPassword: '',

    // 2. Data untuk Tabel Warung (Sesuai skema DS)
    nama_warung: '',
    pemilik: '', // Nama Pemilik Warung
    kota: '',
    kecamatan: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    
    if (registerData.password !== registerData.confirmPassword) {
      alert('Password dan Konfirmasi Password tidak cocok!')
      return
    }

    // Payload JSON bersih yang akan dikirim ke REST API Backend
    const payload = {
      username: registerData.username,
      password: registerData.password,
      nama_warung: registerData.nama_warung,
      pemilik: registerData.pemilik,
      kota: registerData.kota,
      kecamatan: registerData.kecamatan
    }
    setLoading(true)

    try {
      console.log('Mengirim data registrasi ke BE:', payload)
      
      // Mengarahkan ke instance API Axios yang mengarah ke backend kamu
      const response = await API.post('/register', payload)
      
      alert('Registrasi akun dan warung berhasil! Silakan login.')
      navigate('/login') // Lempar user ke halaman login setelah sukses
    } catch (error) {
      console.error('Gagal registrasi:', error)
      alert(error.response?.data?.message || 'Gagal melakukan registrasi, silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
<div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">      
  <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleRegisterSubmit}>
                  <h3 className="fw-bold text-center mb-1">Mulai Langkah UMKM</h3>
                  <p className="text-muted text-center mb-4">Daftarkan akun dan warung kamu dalam satu langkah mudah</p>

                  {/* ================= SEKAT 1: DATA AKUN USER ================= */}
                  <h6 className="text-info fw-bold mb-3 border-bottom pb-2">1. Informasi Akun Pengguna</h6>
                  
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput 
                      name="username"
                      placeholder="Username akun" 
                      value={registerData.username}
                      onChange={handleInputChange}
                      required 
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol md={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                        <CFormInput
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={registerData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol md={6}>
                      <CInputGroup className="mb-4">
                        <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                        <CFormInput
                          type="password"
                          name="confirmPassword"
                          placeholder="Ulangi password"
                          value={registerData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  {/* ================= SEKAT 2: DATA WARUNG (SKEMA DS) ================= */}
                  <h6 className="text-info fw-bold mb-3 border-bottom pb-2">2. Informasi Detail Warung / Usaha</h6>

                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilHome} /></CInputGroupText>
                    <CFormInput 
                      name="nama_warung"
                      placeholder="Nama Warung / Toko (Contoh: Warung Salamah)" 
                      value={registerData.nama_warung}
                      onChange={handleInputChange}
                      required 
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput 
                      name="pemilik"
                      placeholder="Nama Lengkap Pemilik (Untuk analisis data)" 
                      value={registerData.pemilik}
                      onChange={handleInputChange}
                      required 
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol md={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText><CIcon icon={cilLocationPin} /></CInputGroupText>
                        <CFormInput 
                          name="kota"
                          placeholder="Kota Operasional" 
                          value={registerData.kota}
                          onChange={handleInputChange}
                          required 
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol md={6}>
                      <CInputGroup className="mb-4">
                        <CInputGroupText><CIcon icon={cilLocationPin} /></CInputGroupText>
                        <CFormInput 
                          name="kecamatan"
                          placeholder="Kecamatan Toko" 
                          value={registerData.kecamatan}
                          onChange={handleInputChange}
                          required 
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  {/* BUTTON DAFTAR */}
                  <div className="d-grid mt-2">
                    <CButton color="success" type="submit" className="text-white fw-bold py-2">
                      Buat Akun &amp; Daftarkan Warung
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register