import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CCallout,
  CSpinner,
  CFormInput,
  CFormSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilGraph, cilWarning, cilChartPie, cilChevronTop, cilChevronBottom } from '@coreui/icons'
import API from '../../utils/api'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Scatter } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// ==========================================
// SUB-KOMPONEN: TABEL AUDIT TRANSAKSI
// ==========================================
const TableAudit = ({ dataRaw, isAnomalyTable }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('desc')
  const [rowLimit, setRowLimit] = useState(5)

  const dataFiltered = dataRaw.filter(trx => {
    const query = searchQuery.toLowerCase()
    return (
      String(trx.id_transaksi).toLowerCase().includes(query) ||
      String(trx.kategori).toLowerCase().includes(query)
    )
  })

  const dataSorted = [...dataFiltered].sort((a, b) => {
    const nomA = parseFloat(a.nominal) || 0
    const nomB = parseFloat(b.nominal) || 0
    return sortOrder === 'desc' ? nomB - nomA : nomA - nomB
  })

  const dataDisplayed = dataSorted.slice(0, rowLimit)

  return (
    <div className="mb-4 p-3 bg-body border rounded shadow-sm">
      {/* Kontrol Toolbar Atas Tabel */}
      <CRow className="g-2 mb-3 align-items-center">
        <CCol xs={12} sm={6} md={4}>
          <CFormInput
            type="text"
            placeholder="Cari ID atau Kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
          />
        </CCol>
        <CCol xs={6} sm={3} md={4} className="d-flex align-items-center gap-2">
          <span className="small text-muted text-nowrap">Urutan Kas:</span>
          <CButton
            color={sortOrder === 'desc' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="d-flex align-items-center gap-1"
          >
            <CIcon icon={sortOrder === 'desc' ? cilChevronBottom : cilChevronTop} />
            {sortOrder === 'desc' ? 'Terbesar' : 'Terkecil'}
          </CButton>
        </CCol>
        <CCol xs={6} sm={3} md={4} className="d-flex align-items-center justify-content-sm-end gap-2">
          <span className="small text-muted text-nowrap">Tampilkan:</span>
          <CFormSelect
            size="sm"
            style={{ width: '75px' }}
            value={rowLimit}
            onChange={(e) => setRowLimit(parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={dataSorted.length}>Semua</option>
          </CFormSelect>
        </CCol>
      </CRow>

      {/* Tampilan Utama Tabel */}
      <CTable align="middle" hover bordered responsive className="mb-0">
        <CTableHead color={isAnomalyTable ? 'danger' : 'light'}>
          <CTableRow>
            <CTableHeaderCell>ID Transaksi</CTableHeaderCell>
            <CTableHeaderCell>Kategori</CTableHeaderCell>
            <CTableHeaderCell>Nominal Pengeluaran</CTableHeaderCell>
            {/* DIPERBARUI: Menampilkan rasio vs baseline dan rata-rata 7 hari dari BE baru */}
            <CTableHeaderCell>Rasio vs Baseline</CTableHeaderCell>
            <CTableHeaderCell>Rata-rata 7 Hari</CTableHeaderCell>
            <CTableHeaderCell>Status Audit</CTableHeaderCell>
            <CTableHeaderCell>Hasil Analisis Model AI</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody className="text-body">
          {dataDisplayed.length > 0 ? (
            dataDisplayed.map((trx, index) => (
              <CTableRow key={index} className={isAnomalyTable ? 'table-danger' : ''}>
                <CTableDataCell className="small fw-semibold">{trx.id_transaksi}</CTableDataCell>
                <CTableDataCell><CBadge color="secondary">{trx.kategori}</CBadge></CTableDataCell>
                <CTableDataCell className="fw-bold">
                  Rp {(trx.nominal || 0).toLocaleString('id-ID')}
                </CTableDataCell>

                {/* DIPERBARUI: rasio_vs_baseline dari payload BE baru */}
                <CTableDataCell className="text-center">
                  <CBadge color={
                    parseFloat(trx.rasio_vs_baseline) >= 3 ? 'danger' :
                    parseFloat(trx.rasio_vs_baseline) >= 1.5 ? 'warning' : 'success'
                  }>
                    {parseFloat(trx.rasio_vs_baseline || 1).toFixed(2)}x
                  </CBadge>
                </CTableDataCell>

                {/* DIPERBARUI: rolling_mean_7d dari payload BE baru */}
                <CTableDataCell className="text-muted small">
                  Rp {(trx.rolling_mean_7d || 0).toLocaleString('id-ID')}
                </CTableDataCell>

                <CTableDataCell>
                  <CBadge color={isAnomalyTable ? 'danger' : 'success'}>
                    {isAnomalyTable ? 'ANOMALI' : 'NORMAL'}
                  </CBadge>
                </CTableDataCell>

                {/* DIPERBARUI: pesan / warning dari respons model AI */}
                <CTableDataCell className={`small ${isAnomalyTable ? 'fw-bold text-danger' : 'text-muted'}`}>
                  {trx.pesan || trx.warning || (isAnomalyTable
                    ? '⚠️ Pengeluaran melonjak tajam dari batas wajar harian!'
                    : 'Transaksi aman dan tercatat sesuai batas wajar.'
                  )}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center text-muted small py-3">
                Tidak ada data transaksi yang cocok dengan kriteria filter.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
      <div className="small text-muted mt-2 text-end">
        Menampilkan {dataDisplayed.length} dari {dataSorted.length} baris data transaksi.
      </div>
    </div>
  )
}

// ==========================================
// MAIN COMPONENT: ANALISIS LAPORAN DASHBOARD
// ==========================================
const AnalisisLaporan = () => {
  const [activeTab, setActiveTab] = useState('forecast')

  // State untuk Cash Flow Forecast
  const [dataAI, setDataAI] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  // State untuk BCG Matrix
  const [dataBCGResponse, setDataBCGResponse] = useState(null)
  const [loadingBCG, setLoadingBCG] = useState(false)
  const [errorBCG, setErrorBCG] = useState(null)

  // State untuk Anomaly Alert
  const [dataAnomaly, setDataAnomaly] = useState(null)
  const [loadingAnomaly, setLoadingAnomaly] = useState(false)
  const [errorAnomaly, setErrorAnomaly] = useState(null)

  // Helper Pembersihan Token JWT
  const getCleanToken = () => {
    const tokenRaw = localStorage.getItem('accessToken')
    if (!tokenRaw) return null
    return tokenRaw.replace(/^"(.*)"$/, '$1')
  }

  // INTERAKSI API 1: Cash Flow Forecast
  const ambilDataForecastAI = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const tokenBersih = getCleanToken()
      if (!tokenBersih) {
        setErrorMsg('Sesi login tidak ditemukan. Silakan logout lalu login kembali.')
        return
      }
      const respon = await API.get('/ai/cashflow-forecast')
      const dataFinal = respon.data.data || respon.data
      setDataAI(dataFinal)
    } catch (err) {
      console.error('Gagal mengambil ramalan AI:', err)
      setErrorMsg(err.response?.data?.message || 'Gagal memverifikasi akses autentikasi.')
    } finally {
      setLoading(false)
    }
  }

  // INTERAKSI API 2: BCG Matrix
  const ambilDataBCG = async () => {
    setLoadingBCG(true)
    setErrorBCG(null)
    try {
      const tokenBersih = getCleanToken()
      if (!tokenBersih) {
        setErrorBCG('Sesi login tidak ditemukan.')
        return
      }

      const respon = await API.get('/ai/bcg-matrix', {
        validateStatus: (status) => (status >= 200 && status < 300) || status === 400
      })

      if (respon.status === 400) {
        setErrorBCG(respon.data.message || 'Anda belum memiliki data produk.')
        setLoadingBCG(false)
        return
      }

      const dataFinal = respon.data.data || respon.data
      if (Array.isArray(dataFinal)) {
        setDataBCGResponse({ produk: dataFinal })
      } else {
        setDataBCGResponse(dataFinal)
      }
    } catch (err) {
      console.error('Gagal mengambil analisis BCG:', err)
      setErrorBCG(err.response?.data?.message || 'Gagal memuat analisis BCG Matrix.')
    } finally {
      setLoadingBCG(false)
    }
  }

  // ============================================================
  // INTERAKSI API 3: ANOMALY ALERT — DIPERBARUI SESUAI BE BARU
  // ============================================================
  const ambilDataAnomaly = async () => {
    setLoadingAnomaly(true)
    setErrorAnomaly(null)
    try {
      const tokenBersih = getCleanToken()
      if (!tokenBersih) {
        setErrorAnomaly('Sesi login tidak ditemukan.')
        return
      }

      const respon = await API.get('/ai/anomaly')

      // BE membungkus dengan utility response() → { status, message, data: {...} }
      const dataFinal = respon.data.data || respon.data

      // BE baru mengembalikan key 'anomali' yang sudah dinormalisasi.
      let listTransaksi = dataFinal?.anomali || []

      // Fallback: jika BE lama masih dipakai dan AI response lolos langsung ke FE
      // AI response memakai key 'hasil' dan is_anomaly integer (0/1)
      if (listTransaksi.length === 0 && dataFinal?.hasil) {
        listTransaksi = (dataFinal.hasil).map(item => ({
          ...item,
          rasio_vs_baseline : item.rasio_vs_baseline || 1,
          rolling_mean_7d   : item.rolling_mean_7d   || 0,
          status_audit      : Number(item.is_anomaly) === 1 ? 'ANOMALI' : 'NORMAL',
          pesan             : item.pesan_anomali || item.pesan || null,
        }))
      }

      setDataAnomaly({
        anomali          : listTransaksi,
        pesan_peringatan : dataFinal?.pesan_peringatan || [],
      })

    } catch (err) {
      console.error('Gagal memuat Anomaly Alert AI:', err)
      setErrorAnomaly(err.response?.data?.message || 'Gagal menampilkan deteksi kecurangan bisnis.')
    } finally {
      setLoadingAnomaly(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'forecast') ambilDataForecastAI()
    else if (activeTab === 'anomaly') ambilDataAnomaly()
    else if (activeTab === 'bcg') ambilDataBCG()
  }, [activeTab])

  // Helper status untuk Forecast
  const getStatusAnalisis = (status) => {
    if (status === 'positif') return { color: 'success', label: 'POSITIF' }
    return { color: 'danger', label: 'NEGATIF' }
  }

  const statusObj = dataAI ? getStatusAnalisis(dataAI.status) : { color: 'secondary', label: 'Menunggu' }

  // Konfigurasi Grafik Forecast
  const nilaiPrediksiBesok = dataAI?.prediksi_cashflow_besok ? parseFloat(dataAI.prediksi_cashflow_besok) : 0
  const dataHistorisRiil = dataAI?.historis_30_hari
    ? dataAI.historis_30_hari.slice(-4).map(val => parseFloat(val) || 0)
    : [0, 0, 0, 0]

  const dataForecast = {
    labels: ['Hari Ini - 3', 'Hari Ini - 2', 'Hari Ini - 1', 'Hari Ini', 'BESOK (Prediksi AI)'],
    datasets: [{
      label: 'Net Cash Flow Realistis & Prediksi (Rp)',
      data: [...dataHistorisRiil, nilaiPrediksiBesok],
      borderColor: dataAI?.status === 'negatif' ? '#e55353' : '#2eb85c',
      backgroundColor: dataAI?.status === 'negatif' ? 'rgba(229, 83, 83, 0.1)' : 'rgba(46, 184, 92, 0.1)',
      tension: 0.3,
      pointRadius: 6,
      pointBackgroundColor: ['#636f83', '#636f83', '#636f83', '#636f83', '#39f'],
    }]
  }

  const opsiForecast = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { callbacks: { label: (ctx) => `Net Arus Kas: Rp ${ctx.raw.toLocaleString('id-ID')}` } }
    },
    scales: {
      y: { ticks: { callback: (val) => `Rp ${val.toLocaleString('id-ID')}` } }
    }
  }

  // Konfigurasi Grafik BCG
  const listProdukBCG = dataBCGResponse?.produk || []

  const getProdukPerKuadran = (kuadran) =>
    listProdukBCG
      .filter(item => String(item.kuadran || '').toLowerCase().includes(kuadran.toLowerCase()))
      .map(item => ({
        x: Number(item.qty_terjual || 0),
        y: Number(item.margin_pct || 0),
        label: item.nama_produk
      }))

  const dataBCG = {
    datasets: [
      { label: 'Stars', data: getProdukPerKuadran('star'), backgroundColor: '#2eb85c', pointRadius: 10 },
      { label: 'Cash Cows', data: getProdukPerKuadran('cash cow'), backgroundColor: '#39f', pointRadius: 10 },
      { label: 'Question Marks', data: getProdukPerKuadran('question mark'), backgroundColor: '#f9b115', pointRadius: 10 },
      { label: 'Dogs', data: getProdukPerKuadran('dog'), backgroundColor: '#e55353', pointRadius: 10 }
    ]
  }

  const maxQtyData = Math.max(...listProdukBCG.map(p => p.qty_terjual || 100), 100)
  const maxMarginData = Math.max(...listProdukBCG.map(p => p.margin_pct || 50), 50)
  const thresholdX = dataBCGResponse?.median_qty || (maxQtyData / 2)
  const thresholdY = dataBCGResponse?.median_margin || (maxMarginData / 2)

  const opsiBCG = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw.label} (${ctx.dataset.label}) -> Qty: ${ctx.raw.x} pcs, Margin: ${ctx.raw.y}%`
        }
      }
    },
    scales: {
      x: {
        min: 0, max: maxQtyData + 20,
        title: { display: true, text: 'Volume Penjualan (Qty Terjual pcs)' },
        grid: {
          color: (ctx) => (ctx.tick.value >= thresholdX - 5 && ctx.tick.value <= thresholdX + 5 ? '#636f83' : 'rgba(0,0,0,0.05)'),
          lineWidth: (ctx) => (ctx.tick.value >= thresholdX - 5 && ctx.tick.value <= thresholdX + 5 ? 2 : 1)
        }
      },
      y: {
        min: 0, max: maxMarginData + 10,
        title: { display: true, text: 'Margin Keuntungan (Margin %)' },
        grid: {
          color: (ctx) => (ctx.tick.value >= thresholdY - 2 && ctx.tick.value <= thresholdY + 2 ? '#636f83' : 'rgba(0,0,0,0.05)'),
          lineWidth: (ctx) => (ctx.tick.value >= thresholdY - 2 && ctx.tick.value <= thresholdY + 2 ? 2 : 1)
        }
      }
    }
  }

  const getBadgeColorBCG = (kuadran) => {
    const text = String(kuadran || '').toLowerCase()
    if (text.includes('star')) return 'success'
    if (text.includes('cow')) return 'info'
    if (text.includes('question')) return 'warning'
    if (text.includes('dog')) return 'danger'
    return 'secondary'
  }

  const listHasilAnomalyAll = dataAnomaly?.anomali || []
  const arrayHanyaAnomali = listHasilAnomalyAll.filter(t => t.status_audit === 'ANOMALI')
  const arrayHanyaNormal = listHasilAnomalyAll.filter(t => t.status_audit === 'NORMAL')

  const totalNilaiAnomali = arrayHanyaAnomali.reduce((sum, t) => sum + (t.nominal || 0), 0)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="d-flex justify-content-between align-items-center py-3 bg-body-tertiary text-body border-bottom">
            <h5 className="fw-bold mb-0">Pusat Analisis & Laporan AI</h5>
          </CCardHeader>

          <CCardBody className="p-4">
            <CNav variant="tabs" className="mb-4 border-bottom-0">
              <CNavItem>
                <CNavLink href="#" active={activeTab === 'forecast'} onClick={(e) => { e.preventDefault(); setActiveTab('forecast') }} className="d-flex align-items-center gap-2">
                  <CIcon icon={cilGraph} className="text-primary" /> Cash Flow Forecast
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#" active={activeTab === 'anomaly'} onClick={(e) => { e.preventDefault(); setActiveTab('anomaly') }} className="d-flex align-items-center gap-2">
                  <CIcon icon={cilWarning} className="text-danger" /> Anomaly Alert
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#" active={activeTab === 'bcg'} onClick={(e) => { e.preventDefault(); setActiveTab('bcg') }} className="d-flex align-items-center gap-2">
                  <CIcon icon={cilChartPie} className="text-warning" /> BCG Matrix
                </CNavLink>
              </CNavItem>
            </CNav>

            <div className="tab-content-wrapper mt-2">

              {/* TAB 1: CASH FLOW FORECAST */}
              {activeTab === 'forecast' && (
                <div>
                  <h6 className="fw-bold text-body mb-1">Prediksi Arus Kas Mingguan (Time Series Model)</h6>
                  <p className="text-body-secondary small mb-4">Proyeksi pemasukan dan pengeluaran warung berdasarkan historis transaksi harian.</p>

                  {loading && <div className="text-center my-4"><CSpinner color="primary" /><p className="small text-muted mt-2">Model LSTM sedang menerawang transaksi warungmu...</p></div>}
                  {errorMsg && <CCallout color="danger" className="my-3">{errorMsg}</CCallout>}

                  {dataAI && !loading && (
                    <CCallout color={statusObj.color} className="bg-body-tertiary mb-4">
                      <div className={`fw-bold text-${statusObj.color} mb-1`}>Hasil Analisis Prediksi AI untuk Besok Hari</div>
                      <span className="text-body">
                        Besok diestimasikan kas warungmu bernilai <strong className="text-primary">Rp {dataAI.prediksi_cashflow_besok?.toLocaleString('id-ID')}</strong> dengan status performa <CBadge color={statusObj.color}>{statusObj.label}</CBadge>.
                        {dataAI.peringatan && <div className="mt-2 text-body small"><strong>💡 Catatan Penting:</strong> {dataAI.peringatan}</div>}
                      </span>
                    </CCallout>
                  )}

                  <div className="bg-body p-3 rounded border mb-4 shadow-sm" style={{ height: '320px' }}>
                    <Line data={dataForecast} options={opsiForecast} />
                  </div>

                  <CTable align="middle" hover bordered responsive>
                    <CTableHead color="light">
                      <CTableRow>
                        <CTableHeaderCell>Periode Hari</CTableHeaderCell>
                        <CTableHeaderCell>Proyeksi Kas Bersih Akhir</CTableHeaderCell>
                        <CTableHeaderCell>Status Finansial</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody className="text-body">
                      <CTableRow>
                        <CTableDataCell className="fw-medium">Besok Hari</CTableDataCell>
                        <CTableDataCell className={dataAI?.status === 'negatif' ? 'text-danger fw-bold' : 'text-success fw-bold'}>
                          Rp {dataAI ? dataAI.prediksi_cashflow_besok?.toLocaleString('id-ID') : '0'}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={dataAI?.status === 'negatif' ? 'danger' : 'success'}>
                            {dataAI ? dataAI.status.toUpperCase() : 'Menunggu'}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </div>
              )}

              {/* TAB 2: ANOMALY ALERT — DIPERBARUI SESUAI BE BARU */}
              {activeTab === 'anomaly' && (
                <div>
                  <h6 className="fw-bold text-body mb-1">Notifikasi Otomatis Anomali & Kecurangan Kasir</h6>
                  <p className="text-body-secondary small mb-4">
                    Sistem mendeteksi transaksi pengeluaran tidak wajar, lonjakan mendadak, atau potensi fraud
                    berdasarkan perbandingan rasio nominal vs. baseline rata-rata 7 hari per kategori.
                  </p>

                  {loadingAnomaly && (
                    <div className="text-center my-4">
                      <CSpinner color="danger" />
                      <p className="small text-muted mt-2">AI sedang mengaudit riwayat pengeluaran warungmu...</p>
                    </div>
                  )}

                  {errorAnomaly && <CCallout color="danger" className="my-3">{errorAnomaly}</CCallout>}

                  {!loadingAnomaly && !errorAnomaly && dataAnomaly && (
                    <>
                      {/* DIPERBARUI: Ringkasan statistik deteksi */}
                      <CRow className="g-3 mb-4">
                        <CCol xs={12} sm={4}>
                          <div className="p-3 border rounded text-center bg-body-tertiary">
                            <div className="small text-muted mb-1">Total Transaksi Dianalisis</div>
                            <div className="fw-bold fs-5">{listHasilAnomalyAll.length}</div>
                          </div>
                        </CCol>
                        <CCol xs={12} sm={4}>
                          <div className="p-3 border rounded text-center bg-danger bg-opacity-10">
                            <div className="small text-muted mb-1">Transaksi Anomali</div>
                            <div className="fw-bold fs-5 text-danger">{arrayHanyaAnomali.length}</div>
                          </div>
                        </CCol>
                        <CCol xs={12} sm={4}>
                          <div className="p-3 border rounded text-center bg-danger bg-opacity-10">
                            <div className="small text-muted mb-1">Total Nilai Anomali</div>
                            <div className="fw-bold fs-5 text-danger">Rp {totalNilaiAnomali.toLocaleString('id-ID')}</div>
                          </div>
                        </CCol>
                      </CRow>

                      {/* Callout peringatan jika ada anomali */}
                      {arrayHanyaAnomali.length > 0 && (
                        <CCallout color="danger" className="bg-body-tertiary mb-4">
                          <div className="fw-bold text-danger d-flex align-items-center gap-2 mb-1">
                            <CIcon icon={cilWarning} style={{ width: '18px' }} />
                            Perhatian: Terdeteksi {arrayHanyaAnomali.length} Transaksi Mencurigakan!
                          </div>
                          <span className="text-body small">
                            Sistem mendeteksi pengeluaran dengan rasio jauh melampaui baseline rata-rata
                            7 hari per kategori. Segera lakukan audit ulang internal pada baris tabel bertanda merah.
                          </span>
                          {dataAnomaly.pesan_peringatan?.length > 0 && (
                            <ul className="mt-2 mb-0 small text-danger">
                              {dataAnomaly.pesan_peringatan.map((msg, i) => (
                                <li key={i}>{msg}</li>
                              ))}
                            </ul>
                          )}
                        </CCallout>
                      )}

                      {/* Callout aman jika tidak ada anomali */}
                      {arrayHanyaAnomali.length === 0 && listHasilAnomalyAll.length > 0 && (
                        <CCallout color="success" className="bg-body-tertiary mb-4">
                          <div className="fw-bold text-success mb-1">✅ Semua Transaksi Terdeteksi Normal</div>
                          <span className="text-body small">
                            Tidak ditemukan anomali pada {listHasilAnomalyAll.length} transaksi pengeluaran yang dianalisis dalam 30 hari terakhir.
                          </span>
                        </CCallout>
                      )}

                      {/* TABEL 1: Data Anomali */}
                      <h6 className="fw-bold text-danger mb-2 d-flex align-items-center gap-2">
                        <span>🚨</span> Transaksi Terindikasi Anomali ({arrayHanyaAnomali.length} Data)
                      </h6>
                      <TableAudit dataRaw={arrayHanyaAnomali} isAnomalyTable={true} />

                      {/* TABEL 2: Data Normal */}
                      <h6 className="fw-bold text-success mt-4 mb-2 d-flex align-items-center gap-2">
                        <span>✅</span> Transaksi Terklasifikasi Wajar / Normal ({arrayHanyaNormal.length} Data)
                      </h6>
                      <TableAudit dataRaw={arrayHanyaNormal} isAnomalyTable={false} />
                    </>
                  )}
                </div>
              )}

              {/* TAB 3: BCG MATRIX */}
              {activeTab === 'bcg' && (
                <div>
                  <h6 className="fw-bold text-body mb-1">Profitability Dashboard: Pemetaan Klasifikasi BCG Matrix</h6>
                  <p className="text-body-secondary small mb-4">Produk warung dikelompokkan secara visual ke dalam 4 zona (Star, Cash Cow, Question Mark, Dog) berdasarkan volume perputaran kuantitas produk terjual.</p>

                  {loadingBCG && <div className="text-center my-4"><CSpinner color="warning" /><p className="small text-muted mt-2">AI sedang mengelompokkan profitabilitas produk UMKM-mu...</p></div>}
                  {errorBCG && <CCallout color="danger" className="my-3">{errorBCG}</CCallout>}

                  {!loadingBCG && !errorBCG && (
                    <>
                      <div className="bg-body p-3 rounded border mb-4 shadow-sm" style={{ height: '350px' }}>
                        <Scatter data={dataBCG} options={opsiBCG} />
                      </div>

                      <h6 className="fw-bold text-body mt-4 mb-2">Detail Tabel Klasifikasi Produk</h6>
                      <CTable align="middle" hover bordered responsive>
                        <CTableHead color="light">
                          <CTableRow>
                            <CTableHeaderCell>ID Produk</CTableHeaderCell>
                            <CTableHeaderCell>Nama Produk</CTableHeaderCell>
                            <CTableHeaderCell>Qty Terjual</CTableHeaderCell>
                            <CTableHeaderCell>Harga Jual</CTableHeaderCell>
                            <CTableHeaderCell>Zona Kuadran BCG</CTableHeaderCell>
                            <CTableHeaderCell>Rekomendasi</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody className="text-body">
                          {listProdukBCG.length > 0 ? (
                            listProdukBCG.map((prod, index) => (
                              <CTableRow key={index}>
                                <CTableDataCell>{prod.id_produk}</CTableDataCell>
                                <CTableDataCell className="fw-medium">{prod.nama_produk}</CTableDataCell>
                                <CTableDataCell>{prod.qty_terjual} pcs</CTableDataCell>
                                <CTableDataCell>Rp {(prod.harga_jual || 0).toLocaleString('id-ID')}</CTableDataCell>
                                <CTableDataCell>
                                  <CBadge color={getBadgeColorBCG(prod.kuadran)}>
                                    {(prod.kuadran || 'UNKNOWN').toUpperCase()}
                                  </CBadge>
                                </CTableDataCell>
                                <CTableDataCell>{prod.rekomendasi || <span className="text-muted italic">-</span>}</CTableDataCell>
                              </CTableRow>
                            ))
                          ) : (
                            <CTableRow>
                              <CTableDataCell colSpan="6" className="text-center text-muted small py-3">
                                Tidak ada data analisis produk yang tersedia.
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        </CTableBody>
                      </CTable>
                    </>
                  )}
                </div>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AnalisisLaporan
