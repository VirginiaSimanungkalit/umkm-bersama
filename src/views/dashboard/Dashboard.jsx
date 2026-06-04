import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CBadge,
  CSpinner,
  CCallout
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilWarning } from '@coreui/icons'
import API from '../../utils/api' // Adjust path if needed (e.g., '../utils/api' or '../../utils/api')

import WidgetsBrand from '../widgets/WidgetsBrand'

const Dashboard = () => {
  // State untuk Advisory AI
  const [dataAdvisory, setDataAdvisory] = useState(null)
  const [loadingAdvisory, setLoadingAdvisory] = useState(false)
  const [errorAdvisory, setErrorAdvisory] = useState(null)

  // Fungsi Fetch Data dari Backend Express kamu
  const ambilDataAdvisory = async () => {
    setLoadingAdvisory(true)
    setErrorAdvisory(null)
    try {
      const respon = await API.get('/ai/advisory')
      const dataFinal = respon.data.data
      setDataAdvisory(dataFinal)
    } catch (err) {
      console.error('Gagal memuat Advisory AI di Dashboard:', err)
      setErrorAdvisory(err.response?.data?.message || 'Gagal menampilkan rekomendasi bisnis otomatis.')
    } finally {
      setLoadingAdvisory(false)
    }
  }

  // Pemicu otomatis saat halaman Dashboard pertama kali dibuka oleh Pemilik Warung
  useEffect(() => {
    ambilDataAdvisory()
  }, [])

  // Mengatur warna badge berdasarkan prioritas tindakan dari AI
  const getBadgeColor = (prioritas) => {
    const p = String(prioritas || '').toLowerCase()
    if (p.includes('tinggi') || p.includes('high') || p.includes('danger')) return 'danger'
    if (p.includes('normal') || p.includes('aman')) return 'success'
    return 'warning' // fallback untuk prioritas sedang/medium
  }

  return (
    <>
      {loadingAdvisory && (
        <CCard className="mb-4 shadow-sm border-0">
          <CCardBody className="text-center py-4">
            <CSpinner color="success" />
            <p className="small text- mb-0 mt-2">Kecerdasan Buatan sedang merangkum strategi warungmu hari ini...</p>
          </CCardBody>
        </CCard>
      )}

      {errorAdvisory && (
        <CCallout color="danger" className="mb-4 bg-body">
          <div className="fw-bold text-danger mb-1">⚠️ Sistem AI Terkendala</div>
          <span className="small text-muted">{errorAdvisory}</span>
        </CCallout>
      )}

      {!loadingAdvisory && dataAdvisory && (
        <CCard className="mb-4 border-start border-success border-4 shadow-sm bg-body">
          <CCardBody className="p-4">
            <CRow className="align-items-start gap-3 gap-md-0">
              {/* Sektor Kiri: Judul & Keterangan Status */}
              <CCol md={8}>
                <h5 className="fw-bold text-body mb-1">Strategi Solusi Bisnis AI Hari Ini</h5>
                <p className="text-muted small mb-0">
                  Model penalaran mendeteksi status arus kas akhir bermutu{' '}
                  <strong className="text-primary">{dataAdvisory.status_kas}</strong> dengan indeks tindakan:{' '}
                  <CBadge color={getBadgeColor(dataAdvisory.prioritas)} className="ms-1 text-uppercase px-2 py-1">
                    {dataAdvisory.prioritas || 'NORMAL'}
                  </CBadge>
                </p>
              </CCol>

              {/* Sektor Kanan: Kotak Finansial Ringkas */}
              <CCol md={4} className="text-md-end">
                <div className="bg-body-tertiary p-2 px-3 rounded border d-inline-block text-start text-md-end w-100 w-md-auto">
                  <span className="text-muted small d-block">Estimasi Kas Esok Hari</span>
                  <strong className="text-success fs-5">
                    Rp {dataAdvisory.prediksi_kas?.toLocaleString('id-ID')}
                  </strong>
                </div>
              </CCol>
            </CRow>

            <hr className="my-3 text-muted opacity-25" />

            {/* Sektor Bawah: List Rekomendasi Riil Hasil Olahan Gabungan */}
            <div className="mt-2">
              <h6 className="fw-bold text-body mb-3">Rekomendasi Tindakan Operasional:</h6>
              {dataAdvisory.rekomendasi?.map((item, idx) => (
                <div key={idx} className="d-flex align-items-start gap-2 mb-2 text-body small">
                  <span className="fw-medium">{item}</span>
                </div>
              ))}
            </div>
          </CCardBody>
        </CCard>
      )}

      {/* Widget grafik bawaan diletakkan tepat di bawah banner AI */}
      <WidgetsBrand className="mb-4" withCharts />
    </>
  )
}

export default Dashboard