import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CFormInput,
  CSpinner,
  CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilCheck, cilX, cilHome } from '@coreui/icons'
import API from '../../utils/api'

const Profil = () => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [idWarung, setIdWarung] = useState(null)

  // 1. STATE FORM
  const [profilUsaha, setProfilUsaha] = useState({
    nama_warung: '',
    pemilik: '',
    kota: '',
    kecamatan: '',
    status: 'Aktif'
  })

  const [tempProfil, setTempProfil] = useState({ ...profilUsaha })

  // 2. FUNGSI GET: Membaca ID Warung langsung dari enkripsi token JWT
  const fetchProfilData = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem('accessToken')
      if (!token) return

      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const payloadJWT = JSON.parse(window.atob(base64))
      
      const currentIdWarung = payloadJWT.id_warung
      setIdWarung(currentIdWarung)

      if (currentIdWarung) {
        const responseProfil = await API.get(`/warung/${currentIdWarung}`)
        const dataProfil = responseProfil.data.data || responseProfil.data

        if (dataProfil) {
          const dataBersih = {
            nama_warung: dataProfil.nama_warung || '',
            pemilik: dataProfil.pemilik || '',
            kota: dataProfil.kota || '',
            kecamatan: dataProfil.kecamatan || '',
            status: dataProfil.status || 'Aktif'
          }
          setProfilUsaha(dataBersih)
          setTempProfil(dataBersih)
        }
      }
    } catch (error) {
      console.error('Gagal menyinkronkan data profil warung:', error)
      alert('Gagal memuat profil warung dari database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfilData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTempProfil((prev) => ({ ...prev, [name]: value }))
  }

  // 3. FUNGSI PUT: Update data murni lolos uji warungPayloadSchema
  const handleSimpan = async () => {
    const payload = {
      nama_warung: tempProfil.nama_warung,
      pemilik: tempProfil.pemilik,
      kota: tempProfil.kota,
      kecamatan: tempProfil.kecamatan,
      status: tempProfil.status
    }

    try {
      await API.put(`/warung/${idWarung}`, payload)
      setProfilUsaha({ ...tempProfil })
      setIsEditMode(false)
      alert('Profil warung Anda berhasil diperbarui di database! 📝')
      fetchProfilData()
    } catch (error) {
      console.error('Gagal memperbarui records warung:', error)
      alert(error.response?.data?.message || 'Gagal menyimpan pembaruan ke server.')
    }
  }

  const handleBatal = () => {
    setTempProfil({ ...profilUsaha })
    setIsEditMode(false)
  }

  if (loading) {
    return (
      <div className="text-center my-5 p-5">
        <CSpinner color="primary" size="lg" />
        <p className="text-body-secondary mt-3 small">Menghubungkan ke database warung...</p>
      </div>
    )
  }

  return (
    <CRow className="justify-content-center">
      <CCol xs={12} md={8}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="d-flex justify-content-between align-items-center fw-bold fs-5 py-3 text-body bg-body-tertiary border-bottom">
            <div className="d-flex align-items-center gap-2">
              <CIcon icon={cilHome} size="lg" className="text-primary" />
              <span>Detail Informasi Warung {profilUsaha.nama_warung}</span>
            </div>
            
            {!isEditMode ? (
              <CButton color="primary" size="sm" onClick={() => setIsEditMode(true)}>
                <CIcon icon={cilPencil} className="me-2" /> Edit Profil
              </CButton>
            ) : (
              <div className="d-flex gap-2">
                <CButton color="secondary" size="sm" onClick={handleBatal}>
                  <CIcon icon={cilX} className="me-1" /> Batal
                </CButton>
                <CButton color="success" size="sm" className="text-white" onClick={handleSimpan}>
                  <CIcon icon={cilCheck} className="me-1" /> Simpan
                </CButton>
              </div>
            )}
          </CCardHeader>
          <CCardBody className="p-4">
            <CRow>
              <CCol md={6} className="mb-4">
                <label className="text-body-secondary small d-block mb-1 fw-semibold">Nama Usaha / Warung</label>
                {isEditMode ? (
                  <CFormInput name="nama_warung" value={tempProfil.nama_warung} onChange={handleInputChange} />
                ) : (
                  <h5 className="fw-bold text-body">{profilUsaha.nama_warung || 'Belum diisi'}</h5>
                )}
              </CCol>

              <CCol md={6} className="mb-4">
                <label className="text-body-secondary small d-block mb-1 fw-semibold">Nama Pemilik Bisnis</label>
                {isEditMode ? (
                  <CFormInput name="pemilik" value={tempProfil.pemilik} onChange={handleInputChange} />
                ) : (
                  <p className="fw-medium text-body mb-0 fs-5">{profilUsaha.pemilik || 'Belum diisi'}</p>
                )}
              </CCol>

              <CCol md={6} className="mb-4">
                <label className="text-body-secondary small d-block mb-1 fw-semibold">Kota</label>
                {isEditMode ? (
                  <CFormInput name="kota" value={tempProfil.kota} onChange={handleInputChange} />
                ) : (
                  <p className="text-body mb-0">{profilUsaha.kota || '-'}</p>
                )}
              </CCol>

              <CCol md={6} className="mb-4">
                <label className="text-body-secondary small d-block mb-1 fw-semibold">Kecamatan</label>
                {isEditMode ? (
                  <CFormInput name="kecamatan" value={tempProfil.kecamatan} onChange={handleInputChange} />
                ) : (
                  <p className="text-body mb-0">{profilUsaha.kecamatan || '-'}</p>
                )}
              </CCol>

              <CCol md={12} className="mb-2">
                <label className="text-body-secondary small d-block mb-1 fw-semibold">Status Kemitraan Aplikasi</label>
                <CBadge color={profilUsaha.status === 'Aktif' ? 'success' : 'secondary'} className="px-3 py-2 fs-6">
                  {profilUsaha.status}
                </CBadge>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Profil