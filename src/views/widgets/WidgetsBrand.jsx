import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CRow, CCol, CWidgetStatsA, CSpinner } from '@coreui/react'
import API from '../../utils/api'

const WidgetsDropdown = (props) => {
  const [summaryData, setSummaryData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getDashboardSummary = async () => {
      try {
        setLoading(true)
        const response = await API.get('/transactions/summary')
        setSummaryData(response.data.data)
      } catch (error) {
        console.error('Gagal memuat data ringkasan widget dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    getDashboardSummary()
  }, [])

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(angka || 0)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-4">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    // Menggunakan pembagian grid xl={4} agar setiap baris berisi tepat 3 kotak sama rata (12 / 4 = 3)
    <CRow className={props.className} xs={{ gutter: 4 }}>
      
      {/* ================= BARIS 1: NOMINAL KEUANGAN ================= */}
      
      {/* 🟢 KOTAK 1: TOTAL PEMASUKAN */}
      <CCol sm={6} md={4} xl={4}>
        <CWidgetStatsA
          color="success"
          value={
            <div className="fs-4 fw-semibold">
              {formatRupiah(summaryData?.total_pemasukan)}
            </div>
          }
          title="Total Pemasukan"
        />
      </CCol>

      {/* 🔴 KOTAK 2: TOTAL PENGELUARAN */}
      <CCol sm={6} md={4} xl={4}>
        <CWidgetStatsA
          color="danger"
          value={
            <div className="fs-4 fw-semibold">
              {formatRupiah(summaryData?.total_pengeluaran)}
            </div>
          }
          title="Total Pengeluaran"
        />
      </CCol>

      {/* 🔵 KOTAK 3: ARUS KAS BERSIH */}
      <CCol sm={6} md={4} xl={4}>
        <CWidgetStatsA
          color="info"
          value={
            <div className="fs-4 fw-semibold">
              {formatRupiah(summaryData?.saldo)}
            </div>
          }
          title="Arus Kas Bersih"
        />
      </CCol>
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
}

export default WidgetsDropdown