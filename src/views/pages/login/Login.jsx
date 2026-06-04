import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import API from '../../../utils/api'

const Login = () => {
  const navigate = useNavigate() 
  
  // State untuk menampung input kredensial user
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const [loginError, setLoginError] = useState(null);
  //untuk memproses AJAX kiriman login
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoginError(null)
    const payload = {
      username: loginData.username,
      password: loginData.password,
    }

    try {
      localStorage.removeItem('accessToken')
      const response = await API.post('/authentication', payload)
      if (response.data.status === 'fail') {
        setLoginError(response.data.message);
        return;
      }
      const token = response?.data?.data?.accessToken

      if (token) {
        localStorage.setItem('accessToken', token)
        navigate('/dashboard')
      } else {
        setLoginError(response?.data?.message || 'Gagal mengambil akses token dari server.')
      }
      
    } catch (error) {
      //console.error('Error saat login:', error)
      //const pesanError = error.response?.data?.message || 'Gagal masuk. Periksa kembali username dan password kamu!';
      //setLoginError(pesanError);
      setLoginError('Terjadi kesalahan sistem pada server.');
    }
  }

  

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={8} xl={7}>
            <CCardGroup>
              
              {/* ===FORM LOGIN ==== */}
              <CCard className="p-4">
                <CCardBody>
                 <CForm 
                  onSubmit={(e) => {
                    e.preventDefault(); // Mengunci reload di level komponen langsung
                    handleLoginSubmit(e);
                  }}
                >
                    <h2 className="fw-bold text-dark mb-1">Login</h2>
                    <p className="text-muted mb-4">Masuk ke dashboard keuangan warung kamu</p>
                    {loginError && (
                      <div className="alert alert-danger p-2 small mb-3 border-start border-danger border-3 rounded-1 d-flex align-items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamatation-triangle-fill text-danger flex-shrink-0" viewBox="0 0 16 16">
                          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                        </svg>
                        <div>{loginError}</div>
                      </div>
                    )}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        name="username"
                        placeholder="Username"
                        value={loginData.username}
                        onChange={handleInputChange}
                        required
                      />
                    </CInputGroup>
                    
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </CInputGroup>
                    
                    <CRow>
                      <CCol xs={12}>
                        <CButton color="primary" type="submit" className="px-4 w-100 fw-bold">
                          Masuk Aplikasi
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              
              {/* ==== AJAKAN DAFTAR === */}
              <CCard className="text-white bg-primary py-5" style={{ minHeight: '100%' }}>
                <CCardBody className="text-center d-flex align-items-center justify-content-center">
                  <div>
                    <h3 className="fw-bold mb-2">Belum Punya Akun?</h3>
                    <p className="small opacity-75 mb-4">
                      Daftarkan diri dan usaha warung kamu sekarang untuk menikmati analisis keuangan berbasis kecerdasan buatan.
                    </p>
                    <Link to="/register">
                      <CButton color="light" className="mt-3 active fw-bold text-primary w-100 w-md-auto" tabIndex={-1}>
                        Daftar Warung Baru
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login