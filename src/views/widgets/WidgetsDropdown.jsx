import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CRow, CCol, CWidgetStatsA, CSpinner } from '@coreui/react'
import API from '../../utils/api'

const WidgetsDropdown = (props) => {
  // 1. Siapkan state untuk menampung ringkasan kalkulasi nominal dari Backend
  const [summaryData, setSummaryData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getDashboardSummary = async () => {
      try {
        setLoading(true)
        // 2. Tembak endpoint /summary untuk mengambil hitungan SUM dari database backend
        const response = await API.get('/transactions/summary')
        setSummaryData(response.data.data)
      } catch (error) {
        console.error('Gagal memuat nominal ringkasan dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    getDashboardSummary()
  }, [])

  // Helper cerdas untuk mengubah angka murni dari MySQL menjadi format Rupiah rapi tanpa desimal sen
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(angka || 0)
  }

  // Tampilkan loading spinner bawaan CoreUI selama Axios mengambil data
  if (loading) {
    return (
      <div className="d-flex justify-content-center my-4">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      {/* 🟢 KOLOM 1: TOTAL PEMASUKAN */}
      <CCol sm={6} xl={4} xxl={3}>
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

      {/* 🔴 KOLOM 2: TOTAL PENGELUARAN */}
      <CCol sm={6} xl={4} xxl={3}>
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

      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
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