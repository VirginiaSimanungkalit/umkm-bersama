import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CSpinner
} from '@coreui/react'
import API from '../../utils/api'

const Produk = () => {
  // 1. STATE FILTRASI & LAYOUT TABEL
  const [searchTerm, setSearchTerm] = useState('')
  const [displayLimit, setDisplayLimit] = useState(10)
  const [sortConfig, setSortConfig] = useState({ key: 'id_produk', direction: 'asc' })
  const [isEditingId, setIsEditingId] = useState(null)
  const [loading, setLoading] = useState(true)

  // 2. STATE FORM INPUT
  const [formData, setFormData] = useState({
    nama_produk: '',
    harga_jual: 0,
    harga_pokok: 0,
    kategori_produk: 'Sembako',
    status: 'Aktif'
  })

  // 3. STATE DAFTAR PRODUK (MURNI DARI DATABASE) 
  const [daftarProduk, setDaftarProduk] = useState([])

  // 4. FUNGSI GET
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await API.get('/produk') 
      const dataDariBE = response.data.data || response.data
      
      if (dataDariBE && Array.isArray(dataDariBE.produk)) {
        setDaftarProduk(dataDariBE.produk)
      } else if (dataDariBE && Array.isArray(dataDariBE.products)) {
        setDaftarProduk(dataDariBE.products)
      } else if (Array.isArray(dataDariBE)) {
        setDaftarProduk(dataDariBE)
      } else {
        setDaftarProduk([])
      }
    } catch (error) {
      console.error('Gagal memuat daftar produk dari MySQL:', error)
      setDaftarProduk([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // 5. LOGIKA PERHITUNGAN MARGIN PRODUK (MURNI UNTUK TAMPILAN HELPER)
  const jual = Number(formData.harga_jual) || 0
  const pokok = Number(formData.harga_pokok) || 0
  const estimasiKeuntungan = jual - pokok
  const marginPct = jual > 0 ? ((estimasiKeuntungan / jual) * 100).toFixed(1) : 0

  // 6. FUNGSI AKSI KETIKAN & SUBMIT API
  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'harga_jual' || name === 'harga_pokok' 
        ? (value === '' ? 0 : Math.round(Number(value))) 
        : value
    }))
  }

  const handleEdit = (item) => {
    setIsEditingId(item.id_produk)
    setFormData({
      nama_produk: item.nama_produk,
      harga_jual: Math.round(Number(item.harga_jual)),
      harga_pokok: Math.round(Number(item.harga_pokok)),
      kategori_produk: item.kategori_produk,
      status: item.status
    })
  }

  const handleSimpan = async (e) => {
    e.preventDefault()

    const payload = {
      nama_produk: formData.nama_produk,
      harga_jual: Math.round(Number(formData.harga_jual)) || 0,
      harga_pokok: Math.round(Number(formData.harga_pokok)) || 0,
      kategori_produk: formData.kategori_produk,
      status: formData.status
    }


    try {
      if (isEditingId) {
        await API.put(`/produk/${isEditingId}`, payload)
        alert('Data produk berhasil diperbarui di database! 📝')
      } else {
        await API.post('/produk', payload)
        alert('Produk baru berhasil disimpan ke MySQL! 🌟')
      }
      handleBatal()
      fetchProducts() 
    } catch (error) {
      console.error('Gagal memproses data produk:', error)
      alert(error.response?.data?.message || 'Terjadi kesalahan hak akses atau sistem API.')
    }
  }

  const handleHapus = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini dari database?')) {
      try {
        await API.delete(`/produk/${id}`)
        alert('Produk berhasil dihapus dari database! 🗑️')
        fetchProducts() 
        if (isEditingId === id) handleBatal()
      } catch (error) {
        console.error('Gagal menghapus produk:', error)
        alert(error.response?.data?.message || 'Gagal menghapus data dari server.')
      }
    }
  }

  const handleBatal = () => {
    setIsEditingId(null)
    setFormData({
      nama_produk: '',
      harga_jual: 0,
      harga_pokok: 0,
      kategori_produk: 'Sembako',
      status: 'Aktif'
    })
  }

  return (
    <CRow>
      {/* ==================== 1. FORM PRODUK ==================== */}
      <CCol xs={12} lg={4} className="mb-4">
        <CCard>
          <CCardHeader className="fw-bold fs-5">
            {isEditingId ? 'Edit Data Produk' : 'Form Input Produk'}
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSimpan}>
              
              <div className="mb-3">
                <CFormLabel>Nama Produk</CFormLabel>
                <CFormInput
                  type="text"
                  name="nama_produk"
                  placeholder="Contoh: Kripik Pisang Balado"
                  value={formData.nama_produk}
                  onChange={handleInputChange}
                  required
                />
                <div className="form-text text-muted small">Akan dijadikan label visual pada Scatter Plot BCG.</div>
              </div>

              <div className="mb-3">
                <CFormLabel>Kategori Produk</CFormLabel>
                <CFormSelect
                  name="kategori_produk"
                  value={formData.kategori_produk}
                  onChange={handleInputChange}
                >
                  <option value="Sembako">Sembako</option>
                  <option value="Mie & Snack">Mie & Snack</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Kebersihan">Kebersihan</option>
                  <option value="Gas & Energi">Gas & Energi</option>
                  <option value="Rokok">Rokok</option>
                </CFormSelect>
              </div>

              <CRow className="mb-3">
                <CCol md={6}>
                 <CFormLabel>Harga Pokok</CFormLabel>
                    <CFormInput
                      type="text" 
                      inputMode="numeric" 
                      name="harga_pokok"
                      placeholder="Modal Rp"
                      value={formData.harga_pokok}
                      onChange={handleInputChange}
                      required
                    />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Harga Jual</CFormLabel>
                    <CFormInput
                      type="text" 
                      inputMode="numeric" 
                      name="harga_jual"
                      placeholder="Jual Rp"
                      value={formData.harga_jual}
                      onChange={handleInputChange}
                      required
                    />
                </CCol>
              </CRow>

              {/* Informational Profit Widget Helper */}
              {jual > 0 && pokok > 0 && (
                <div className="p-2 mb-3 bg-success rounded border text-white small">
                  <strong>Analisis Profit:</strong> Untung Rp {estimasiKeuntungan.toLocaleString('id-ID')} ({marginPct}% Margin)
                </div>
              )}

              <div className="mb-4">
                <CFormLabel>Status Distribusi</CFormLabel>
                <CFormSelect
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </CFormSelect>
                <div className="form-text text-danger small">Produk "Nonaktif" otomatis dieksklusi dari pemrosesan AI clustering.</div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <CButton type="button" color="secondary" onClick={handleBatal}>
                  {isEditingId ? 'Batal Edit' : 'Batal'}
                </CButton>
                <CButton type="submit" color={isEditingId ? 'warning' : 'primary'}>
                  {isEditingId ? 'Perbarui Produk' : 'Simpan Produk'}
                </CButton>
              </div>

            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* ==================== 2. TABLE DAFTAR PRODUK ==================== */}
      <CCol xs={12} lg={8}>
        <CCard>
          <CCardHeader className="fw-bold fs-5 d-flex justify-content-between align-items-center">
            <span>Daftar Produk Terdaftar</span>
            {daftarProduk.length > 0 && (
              <CBadge color="secondary" shape="pill">
                Total: {daftarProduk.length} Item
              </CBadge>
            )}
          </CCardHeader>
          <CCardBody>
            
            <CRow className="mb-3 g-2">
              <CCol xs={12} sm={4}>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-nowrap small text-muted">Tampilkan:</span>
                  <CFormSelect 
                    size="sm" 
                    value={displayLimit} 
                    onChange={(e) => setDisplayLimit(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  >
                    <option value={10}>10 Baris</option>
                    <option value={25}>25 Baris</option>
                    <option value={50}>50 Baris</option>
                    <option value="all">Semua Data</option>
                  </CFormSelect>
                </div>
              </CCol>
              <CCol xs={12} sm={8}>
                <CFormInput
                  type="text"
                  size="sm"
                  placeholder="Cari berdasarkan nama produk atau kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CCol>
            </CRow>

            {loading ? (
              <div className="text-center my-4">
                <CSpinner color="primary" />
                <p className="text-muted mt-2 small">Memuat data produk warung...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <CTable align="middle" hover bordered>
                  <CTableHead color="light">
                    <CTableRow style={{ cursor: 'pointer' }}>
                      <CTableHeaderCell onClick={() => {
                        const direction = sortConfig.key === 'id_produk' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                        setSortConfig({ key: 'id_produk', direction })
                      }}>
                        ID Produk {sortConfig.key === 'id_produk' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={() => {
                        const direction = sortConfig.key === 'nama_produk' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                        setSortConfig({ key: 'nama_produk', direction })
                      }}>
                        Nama Produk {sortConfig.key === 'nama_produk' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={() => {
                        const direction = sortConfig.key === 'kategori_produk' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                        setSortConfig({ key: 'kategori_produk', direction })
                      }}>
                        Kategori {sortConfig.key === 'kategori_produk' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={() => {
                        const direction = sortConfig.key === 'harga_pokok' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                        setSortConfig({ key: 'harga_pokok', direction })
                      }}>
                        Harga Pokok {sortConfig.key === 'harga_pokok' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={() => {
                        const direction = sortConfig.key === 'harga_jual' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                        setSortConfig({ key: 'harga_jual', direction })
                      }}>
                        Harga Jual {sortConfig.key === 'harga_jual' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell>Status AI</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Aksi</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {(() => {
                      let dataProses = daftarProduk.filter((item) => {
                        const matchNama = item.nama_produk?.toLowerCase().includes(searchTerm.toLowerCase())
                        const matchKategori = item.kategori_produk?.toLowerCase().includes(searchTerm.toLowerCase())
                        return matchNama || matchKategori
                      })

                      dataProses.sort((a, b) => {
                        let nilaiA = a[sortConfig.key]
                        let nilaiB = b[sortConfig.key]

                        if (sortConfig.key === 'harga_jual' || sortConfig.key === 'harga_pokok') {
                          return sortConfig.direction === 'asc' ? nilaiA - nilaiB : nilaiB - nilaiA
                        }

                        nilaiA = nilaiA ? nilaiA.toString().toLowerCase() : ''
                        nilaiB = nilaiB ? nilaiB.toString().toLowerCase() : ''

                        if (nilaiA < nilaiB) return sortConfig.direction === 'asc' ? -1 : 1
                        if (nilaiA > nilaiB) return sortConfig.direction === 'asc' ? 1 : -1
                        return 0
                      })

                      if (displayLimit !== 'all') {
                        dataProses = dataProses.slice(0, displayLimit)
                      }

                      if (dataProses.length === 0) {
                        return (
                          <CTableRow>
                            <CTableDataCell colSpan={7} className="text-center text-muted py-3 small">
                              Tidak ada item produk yang cocok dengan kriteria pencarian Anda.
                            </CTableDataCell>
                          </CTableRow>
                        )
                      }

                      return dataProses.map((produk) => (
                        <CTableRow key={produk.id_produk}>
                          <CTableDataCell className="text-monospace small">{produk.id_produk}</CTableDataCell>
                          <CTableDataCell className="fw-semibold">{produk.nama_produk}</CTableDataCell>
                          <CTableDataCell>{produk.kategori_produk}</CTableDataCell>
                          <CTableDataCell>Rp {Math.round(Number(produk.harga_pokok)).toLocaleString('id-ID')}</CTableDataCell>
                          <CTableDataCell>Rp {Math.round(Number(produk.harga_jual)).toLocaleString('id-ID')}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={produk.status === 'Aktif' ? 'success' : 'secondary'}>
                              {produk.status}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-1 justify-content-center">
                              <CButton color="info" size="sm" className="text-white" onClick={() => handleEdit(produk)}>
                                Edit
                              </CButton>
                              <CButton color="danger" size="sm" className="text-white" onClick={() => handleHapus(produk.id_produk)}>
                                Hapus
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    })()}
                  </CTableBody>
                </CTable>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Produk