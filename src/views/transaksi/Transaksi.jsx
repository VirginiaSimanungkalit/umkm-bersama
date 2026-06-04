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
  CFormTextarea,
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

const Transaksi = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [displayLimit, setDisplayLimit] = useState(10) 
  const [sortConfig, setSortConfig] = useState({ key: 'tanggal', direction: 'desc' }) 

  // 1. State Input Form Utama
  const [formData, setFormData] = useState({
    jenis: 'Pemasukan',
    tanggal: new Date().toISOString().split('T')[0], 
    kategori: 'Penjualan',
    id_produk: '',
    catatan: '',
    qty: 0,
    hargaSatuan: 0, 
    nominal: 0,
    metode_bayar: 'Cash'
  })

  const [daftarTransaksi, setDaftarTransaksi] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditingId, setIsEditingId] = useState(null)
  const [opsiProduk, setOpsiProduk] = useState([])

  // 2. Ambil Riwayat Transaksi dari Database
  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await API.get('/transactions')
      const dataDariBE = response.data.data || response.data

      if (dataDariBE && Array.isArray(dataDariBE.transaksi)) {
        setDaftarTransaksi(dataDariBE.transaksi) 
      } else {
        setDaftarTransaksi([])
      }
    } catch (error) {
      console.error('Gagal memuat riwayat transaksi:', error)
      setDaftarTransaksi([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  // 3. Ambil Opsi Produk Dinamis untuk Pilihan Dropdown
  const fetchOpsiProduk = async () => {
    try {
      const response = await API.get('/produk') 
      const dataDariBE = response.data.data || response.data

      if (dataDariBE && Array.isArray(dataDariBE.produk)) {
        setOpsiProduk(dataDariBE.produk)
      } else if (dataDariBE && Array.isArray(dataDariBE.products)) {
        setOpsiProduk(dataDariBE.products)
      } else if (Array.isArray(dataDariBE)) {
        setOpsiProduk(dataDariBE)
      }
    } catch (error) {
      console.error('Gagal mengambil daftar opsi produk untuk transaksi:', error)
    }
  }

  useEffect(() => {
    fetchOpsiProduk()
  }, [])

  // 4. Tangani Ketikan Form & Otomatisasi Harga Satuan
  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => {
      let updatedData = { ...prev, [name]: value }

      // Logika Otomatisasi: Isi harga satuan secara instan jika produk dipilih
      if (name === 'id_produk') {
        if (value === '') {
          updatedData.hargaSatuan = 0
        } else {
          const produkTerpilih = opsiProduk.find((prod) => prod.id_produk === value)
          if (produkTerpilih) {
            updatedData.hargaSatuan = produkTerpilih.harga_jual
          }
        }
      }

      return updatedData
    })
  }

  // 5. Perhitungan Kalkulasi Nominal Otomatis secara Real-Time
  const hitungHargaSatuan = parseInt(formData.hargaSatuan, 10) || 0
  const hitungQty = parseInt(formData.qty, 10) || 0
  const totalNominalOtomatis = hitungHargaSatuan * hitungQty

  // 6. Tarik Data ke Form saat Mode Edit Aktif
  const handleEdit = (item) => {
    setIsEditingId(item.id_transaksi) 
    
    const qtyDbd = item.qty || 0
    const hargaSatuanDbd = qtyDbd > 0 ? item.nominal / qtyDbd : item.nominal

    setFormData({
      jenis: item.jenis,
      tanggal: item.tanggal ? item.tanggal.split('T')[0] : new Date().toISOString().split('T')[0],
      kategori: item.kategori,
      id_produk: item.id_produk || '',
      catatan: item.catatan || '',
      qty: qtyDbd,
      hargaSatuan: hargaSatuanDbd,
      nominal: item.nominal, 
      metode_bayar: item.metode_bayar || 'Cash'
    })
  }

  // 7. Simpan Transaksi Berhasil Tanpa Eror Typo
  const handleSimpan = async (e) => {
    e.preventDefault()
    const sekarang = new Date()
    
    const jamTransaksi = sekarang.toTimeString().split(' ')[0]

    // Jika totalNominalOtomatis bernilai lebih dari 0, prioritaskan nilai kalkulasi tersebut
    const nilaiNominalFinal = totalNominalOtomatis > 0 ? totalNominalOtomatis : (parseInt(formData.nominal, 10) || 0)

    const payload = {
      jenis: formData.jenis,
      tanggal: formData.tanggal,
      jam_transaksi: jamTransaksi,
      kategori: formData.kategori,
      id_produk: formData.id_produk || null,
      qty: formData.jenis === 'Pengeluaran' ? null : (parseInt(formData.qty, 10) || 0),
      nominal: nilaiNominalFinal,
      metode_bayar: formData.metode_bayar,
      catatan: formData.catatan || null
    }

    try {
      if (isEditingId) {
        await API.put(`/transactions/${isEditingId}`, payload)
        alert('Transaksi berhasil diperbarui! 📝')
      } else {
        await API.post('/transactions', payload)
        alert('Transaksi berhasil disimpan ke database! 🌟')
      }
      handleBatal()
      fetchTransactions() 
    } catch (error) {
      console.error('Gagal menyimpan transaksi:', error)
      alert(error.response?.data?.message || 'Terjadi kesalahan sistem backend.')
    }
  }

  const handleBatal = () => {
    setIsEditingId(null)
    setFormData({
      jenis: 'Pemasukan',
      tanggal: new Date().toISOString().split('T')[0],
      kategori: 'Penjualan',
      id_produk: '',
      catatan: '',
      qty: 0,
      hargaSatuan: 0,
      nominal: 0,
      metode_bayar: 'Cash'
    })
  }

  const handleHapus = async (id) => {
    if (window.confirm('Apakah kamu yakin ingin menghapus data transaksi ini?')) {
      try {
        await API.delete(`/transactions/${id}`)
        alert('Transaksi berhasil dihapus! 🗑️')
        fetchTransactions() 
      } catch (error) {
        console.error('Gagal menghapus transaksi:', error)
        alert('Gagal menghapus data dari server. Periksa endpoint backend.')
      }
    }
  }

  return (
    <CRow>
      {/* ==================== 1. FORM TAMBAH TRANSAKSI ==================== */}
      <CCol xs={12} lg={5} className="mb-4">
        <CCard>
          <CCardHeader className="fw-bold fs-5">
            {isEditingId ? 'Edit Data Transaksi' : 'Tambah Transaksi Baru'}
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSimpan}>
              
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Jenis Transaksi</CFormLabel>
                  <CFormSelect 
                    name="jenis" 
                    value={formData.jenis} 
                    onChange={handleInputChange}
                  >
                    <option value="Pemasukan">Pemasukan</option>
                    <option value="Pengeluaran">Pengeluaran</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Tanggal</CFormLabel>
                  <CFormInput 
                    type="date" 
                    name="tanggal" 
                    value={formData.tanggal} 
                    onChange={handleInputChange} 
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Kategori Keuangan</CFormLabel>
                  <CFormSelect 
                    name="kategori" 
                    value={formData.kategori} 
                    onChange={handleInputChange}
                  >
                    <option value="Penjualan">Penjualan</option>
                    <option value="HPP">HPP (Harga Pokok Penjualan)</option>
                    <option value="Operasional">Operasional</option>
                    <option value="Overhead">Overhead</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Metode Bayar</CFormLabel>
                  <CFormSelect 
                    name="metode_bayar" 
                    value={formData.metode_bayar} 
                    onChange={handleInputChange}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Transfer">Transfer</option>
                    <option value="QRIS">QRIS</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <div className="mb-3">
                <CFormLabel>Pilih Produk</CFormLabel>
                <CFormSelect 
                  name="id_produk" 
                  value={formData.id_produk} 
                  onChange={handleInputChange}
                >
                  <option value="">-- Pilih Produk (Jika Ada) --</option>
                  {opsiProduk.map((produk) => (
                    <option key={produk.id_produk} value={produk.id_produk}>
                      {produk.nama_produk} ({produk.kategori_produk}) - Rp {parseInt(produk.harga_jual, 10).toLocaleString('id-ID')}
                    </option>
                  ))}
                </CFormSelect>
              </div>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Jumlah (Qty)</CFormLabel>
                  <CFormInput 
                    type="number" 
                    name="qty" 
                    value={formData.qty} 
                    onChange={handleInputChange} 
                    min="0"
                    disabled={formData.jenis === 'Pengeluaran'}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Harga Satuan (Rp)</CFormLabel>
                  <CFormInput 
                    type="number" 
                    name="hargaSatuan" 
                    value={formData.hargaSatuan} 
                    onChange={handleInputChange} 
                    min="0"
                  />
                </CCol>
              </CRow>

              <div className="mb-3">
                <CFormLabel>Nominal Transaksi (Rp)</CFormLabel>
                <CFormInput 
                  type="number" 
                  name="nominal" 
                  value={totalNominalOtomatis > 0 ? totalNominalOtomatis : formData.nominal} 
                  onChange={handleInputChange} 
                  required
                />
              </div>

              <div className="mb-4">
                <CFormLabel>Catatan / Keterangan</CFormLabel>
                <CFormTextarea 
                  name="catatan" 
                  rows={2} 
                  placeholder="Isi keterangan tambahan transaksi di sini..."
                  value={formData.catatan}
                  onChange={handleInputChange}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <CButton type="button" color="secondary" onClick={handleBatal}>
                  {isEditingId ? 'Batal Edit' : 'Batal'}
                </CButton>
                <CButton type="submit" color={isEditingId ? 'warning' : 'primary'}>
                  {isEditingId ? 'Perbarui Transaksi' : 'Simpan Transaksi'}
                </CButton>
              </div>

            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* ==================== 2. DAFTAR RIWAYAT TRANSAKSI ==================== */}
      <CCol xs={12} lg={7}>
        <CCard>
          <CCardHeader className="fw-bold fs-5 d-flex justify-content-between align-items-center">
            <span>Daftar Riwayat Transaksi</span>
            {daftarTransaksi.length > 0 && (
              <CBadge color="secondary" shape="pill">
                Total: {daftarTransaksi.length} Data
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
                    <option value={100}>100 Baris</option>
                    <option value="all">Semua Data</option>
                  </CFormSelect>
                </div>
              </CCol>
              <CCol xs={12} sm={8}>
                <CFormInput
                  type="text"
                  size="sm"
                  placeholder="Cari berdasarkan kategori atau catatan transaksi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CCol>
            </CRow>

            {loading ? (
              <div className="text-center my-4">
                <CSpinner color="primary" />
                <p className="text-muted mt-2 small">Memuat riwayat transaksi warung...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <CTable align="middle" hover bordered>
                  <CTableHead color="light">
                    <CTableRow style={{ cursor: 'pointer' }}>
                      <CTableHeaderCell onClick={() => {
                        const direction = sortConfig.key === 'tanggal' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                        setSortConfig({ key: 'tanggal', direction })
                      }}>
                        Tanggal {sortConfig.key === 'tanggal' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={() => {
                        const direction = sortConfig.key === 'jenis' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                        setSortConfig({ key: 'jenis', direction })
                      }}>
                        Jenis {sortConfig.key === 'jenis' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={() => {
                        const direction = sortConfig.key === 'kategori' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                        setSortConfig({ key: 'kategori', direction })
                      }}>
                        Kategori {sortConfig.key === 'kategori' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell>Catatan</CTableHeaderCell>
                      <CTableHeaderCell>Qty</CTableHeaderCell>
                      <CTableHeaderCell onClick={() => {
                        const direction = sortConfig.key === 'nominal' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                        setSortConfig({ key: 'nominal', direction })
                      }}>
                        Nominal {sortConfig.key === 'nominal' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Aksi</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {(() => {
                      let dataProses = daftarTransaksi.filter((item) => {
                        const matchKategori = item.kategori?.toLowerCase().includes(searchTerm.toLowerCase())
                        const matchCatatan = item.catatan?.toLowerCase().includes(searchTerm.toLowerCase())
                        return matchKategori || matchCatatan
                      })

                      dataProses.sort((a, b) => {
                        let nilaiA = a[sortConfig.key]
                        let nilaiB = b[sortConfig.key]

                        if (sortConfig.key === 'nominal') {
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
                              Tidak ada data transaksi yang cocok dengan kriteria pencarian.
                            </CTableDataCell>
                          </CTableRow>
                        )
                      }

                      return dataProses.map((item) => (
                        <CTableRow key={item.id_transaksi}>
                          <CTableDataCell className="text-nowrap">
                            {item.tanggal ? item.tanggal.split('T')[0] : '-'}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={item.jenis === 'Pemasukan' ? 'success' : 'danger'}>
                              {item.jenis}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{item.kategori}</CTableDataCell>
                          <CTableDataCell>{item.catatan || '-'}</CTableDataCell>
                          <CTableDataCell>{item.qty !== null && item.qty !== 0 ? item.qty : '-'}</CTableDataCell>
                          <CTableDataCell className="fw-semibold">
                            Rp {(item.nominal || 0).toLocaleString('id-ID')}
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-1 justify-content-center">
                              <CButton color="info" size="sm" className="text-white" onClick={() => handleEdit(item)}>
                                Edit
                              </CButton>
                              <CButton color="danger" size="sm" className="text-white" onClick={() => handleHapus(item.id_transaksi)}>
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

export default Transaksi