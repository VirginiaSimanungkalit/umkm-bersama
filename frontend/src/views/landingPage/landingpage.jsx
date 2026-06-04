import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CCard,
  CCardBody,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilGraph, cilWarning, cilChartPie, cilArrowRight } from '@coreui/icons'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-body min-vh-100 text-body overflow-x-hidden">
      
      {/* 1. NAVBAR MINI */}
      <nav className="navbar border-bottom py-3 shadow-sm sticky-top bg-body">
        <CContainer fluid="md" className="d-flex justify-content-between align-items-center">
          <span className="navbar-brand fw-bold text-primary fs-4 mb-0 d-flex align-items-center gap-2">
            <img 
              src="/icon.ico" 
              alt="Logo UMKM Bersama" 
              style={{ width: '48px', height: '48px', objectFit: 'contain' }} 
            />
            <span className="text-body">UMKM Bersama</span>
          </span>
          <CButton color="primary" className="fw-semibold" onClick={() => navigate('/login')}>
            Masuk Aplikasi
          </CButton>
        </CContainer>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="py-5 border-bottom">
        <CContainer fluid="md" className="py-5 text-center text-md-start">
          <CRow className="align-items-center g-5">
            <CCol md={7}>
              <h1 className="display-4 fw-extrabold text-body mb-3" style={{ lineHeight: '1.2' }}>
                Bawa Warung Kelontongmu <br />
                <span className="text-primary">Naik Kelas dengan AI</span>
              </h1>
              <p className="lead text-body-secondary mb-4 fs-5">
                UMKM Bersama adalah platform manajemen keuangan cerdas yang membantu pemilik warung mengelola pembukuan, meramal kas masa depan, hingga mendeteksi kecurangan kasir secara otomatis menggunakan kecerdasan buatan.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-md-start">
                <CButton color="primary" size="lg" className="d-flex align-items-center justify-content-center gap-2 fw-bold px-4 py-3" onClick={() => navigate('/login')}>
                  Mulai Kelola Sekarang <CIcon icon={cilArrowRight} />
                </CButton>
              </div>
            </CCol>
            
            <CCol md={5} className="text-center d-none d-md-block position-relative">
              {/* Bingkai Luar Mockup Aplikasi */}
              <div 
                className="bg-body border rounded-4 shadow-lg p-3 mx-auto text-start position-relative overflow-hidden" 
                style={{ width: '380px', transform: 'rotate(-2deg)', transition: 'transform 0.3s' }}
              >
                {/* Header Mini Mockup (Titik Window Mac Style) */}
                <div className="d-flex gap-1.5 mb-3 border-bottom pb-2">
                  <span className="bg-danger rounded-circle d-inline-block" style={{ width: '10px', height: '10px' }}></span>
                  <span className="bg-warning rounded-circle d-inline-block" style={{ width: '10px', height: '10px', marginLeft: '4px' }}></span>
                  <span className="bg-success rounded-circle d-inline-block" style={{ width: '10px', height: '10px', marginLeft: '4px' }}></span>
                  <span className="text-body-secondary small ms-2" style={{ fontSize: '10px', transform: 'translateY(-3px)' }}>umkm-bersama-dashboard</span>
                </div>

                {/* Konten Utama Mockup Dashboard Mini */}
                <div className="row g-2">
                  {/* Kartu Finansial Mini */}
                  <div className="col-12">
                    <div className="p-2 border rounded-3 bg-body-tertiary">
                      <div className="text-body-secondary small" style={{ fontSize: '10px' }}>Total Pendapatan Warung</div>
                      <div className="fw-bold text-success d-flex align-items-center gap-1" style={{ fontSize: '14px' }}>
                        Rp 14.250.000 <span className="text-success" style={{ fontSize: '10px' }}>↑ 12%</span>
                      </div>
                    </div>
                  </div>

                  {/* Replikasi Grafik Forecast Mini */}
                  <div className="col-12">
                    <div className="p-2 border rounded-3 bg-body">
                      <div className="text-body-secondary small mb-2" style={{ fontSize: '10px' }}>📊 Cash Flow Forecast (LSTM)</div>
                      <div className="d-flex align-items-end justify-content-between pt-2 px-1" style={{ height: '70px' }}>
                        <div className="bg-primary rounded-top opacity-25" style={{ width: '12%', height: '40%' }}></div>
                        <div className="bg-primary rounded-top opacity-50" style={{ width: '12%', height: '60%' }}></div>
                        <div className="bg-primary rounded-top opacity-50" style={{ width: '12%', height: '55%' }}></div>
                        <div className="bg-primary rounded-top opacity-75" style={{ width: '12%', height: '75%' }}></div>
                        <div className="bg-primary rounded-top" style={{ width: '12%', height: '95%' }}></div>
                        <div className="bg-primary rounded-top border-2 border-primary-emphasis" style={{ width: '12%', height: '85%', borderStyle: 'dashed' }}></div>
                        <div className="bg-primary rounded-top border-2 border-primary-emphasis" style={{ width: '12%', height: '90%', borderStyle: 'dashed' }}></div>
                      </div>
                      <div className="text-center text-primary fw-semibold mt-1" style={{ fontSize: '9px' }}>Prediksi Kas Esok Hari</div>
                    </div>
                  </div>

                  {/* Replikasi Alert Anomali Mini */}
                  <div className="col-12">
                    <div className="p-2 border border-danger-subtle bg-danger bg-opacity-10 rounded-3 text-danger d-flex align-items-center justify-content-between shadow-sm">
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: '14px' }}>🚨</span>
                        <div>
                          <div className="fw-bold" style={{ fontSize: '10px' }}>Anomaly Alert (Isolation Forest)</div>
                          <div style={{ fontSize: '9px', opacity: 0.8 }}>Overhead: Biaya Operasional Bengkak</div>
                        </div>
                      </div>
                      <span className="badge bg-danger text-white rounded-pill" style={{ fontSize: '8px' }}>Fraud Terdeteksi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ornamen Lingkaran Estetik di Belakang Mockup */}
              <div 
                className="position-absolute bg-primary bg-opacity-10 rounded-circle z-n1" 
                style={{ width: '300px', height: '300px', top: '10%', right: '10%', filter: 'blur(20px)' }}
              ></div>
            </CCol>
          </CRow>
        </CContainer>
      </header>

      {/* 3. FITUR UTAMA AI SECTION */}
      <section className="py-5 bg-body-tertiary">
        <CContainer fluid="md" className="py-4">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <h2 className="fw-bold text-body mb-2">Tiga Otak AI untuk Bisnis Anda</h2>
            <p className="text-body-secondary small">Integrasi data kueri cerdas dan permodelan machine learning canggih di genggaman Anda.</p>
          </div>

          <CRow className="g-4">
            {/* FITUR 1 */}
            <CCol md={4}>
              <CCard className="h-100 border-0 bg-body shadow-sm rounded-4">
                <CCardBody className="p-4 text-center text-md-start">
                  <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3 d-inline-block mb-3">
                    <CIcon icon={cilGraph} size="xl" />
                  </div>
                  <h5 className="fw-bold text-body mb-2">Cash Flow Forecast</h5>
                  <p className="text-body-secondary small mb-0">
                    Menggunakan model waktu berantai (Time Series LSTM) untuk menerawang proyeksi kas bersih warung besok hari berdasarkan historis transaksi harian secara akurat.
                  </p>
                </CCardBody>
              </CCard>
            </CCol>

            {/* FITUR 2 */}
            <CCol md={4}>
              <CCard className="h-100 border-0 bg-body shadow-sm rounded-4">
                <CCardBody className="p-4 text-center text-md-start">
                  <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-3 d-inline-block mb-3">
                    <CIcon icon={cilWarning} size="xl" />
                  </div>
                  <h5 className="fw-bold text-body mb-2">Anomaly Alert</h5>
                  <p className="text-body-secondary small mb-0">
                    Sistem audit digital berbasis Isolation Forest. Otomatis mendeteksi pembengkakan biaya, pengeluaran tidak wajar, hingga potensi fraud/kecurangan kasir secara real-time.
                  </p>
                </CCardBody>
              </CCard>
            </CCol>

            {/* FITUR 3 */}
            <CCol md={4}>
              <CCard className="h-100 border-0 bg-body shadow-sm rounded-4">
                <CCardBody className="p-4 text-center text-md-start">
                  <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-3 d-inline-block mb-3">
                    <CIcon icon={cilChartPie} size="xl" />
                  </div>
                  <h5 className="fw-bold text-body mb-2">BCG Matrix</h5>
                  <p className="text-body-secondary small mb-0">
                    Dashboard profitabilitas otomatis yang mengelompokkan stok produk warung Anda ke dalam 4 kuadran dinamis (Star, Cash Cow, Question Mark, Dog) untuk strategi restock terbaik.
                  </p>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-body border-top py-4 text-center">
        <CContainer fluid="md">
          <p className="text-body-secondary small mb-0">
            &copy; 2026 <strong>UMKM Bersama Dashboard</strong>. Capstone Project. All Rights Reserved.
          </p>
        </CContainer>
      </footer>
    </div>
  )
}

export default LandingPage