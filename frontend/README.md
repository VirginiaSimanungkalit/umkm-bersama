# 💻 UMKM Bersama - Frontend Application

Selamat datang di repositori pusat antarmuka pengguna (*Front-End*) untuk platform manajemen keuangan cerdas **UMKM Bersama**. Aplikasi ini dibangun menggunakan **React.js** dan bundler **Vite**, serta memanfaatkan framework komponen **CoreUI** untuk menyajikan dashboard finansial yang responsif dan mendukung mode gelap otomatis (*Dark Mode ready*).

---

## 🛠️ Teknologi & Fitur Utama
- **Library Utama:** React.js (v18+)
- **Build Tool / Bundler:** Vite (ES Modules)
- **UI Framework:** CoreUI untuk React (dengan kustomisasi tema adaptif)
- **State Management:** React Context / Redux Store *(Sesuaikan dengan struktur store.js kamu)*
- **HTTP Client:** Axios (untuk komunikasi terpusat ke Backend API)
- **Routing:** React Router DOM (v6) dilengkapi dengan *Protected Routes*

---

## 🏗️ Fitur & Tampilan Aplikasi (Sesuai Dashboard)
Aplikasi ini memuat berbagai halaman interaktif yang langsung terhubung ke database dan model AI:
1. **Landing Page:** Halaman depan informatif yang responsif terhadap perubahan tema sistem.
2. **Dashboard Finansial:** Ringkasan grafik total pendapatan, arus kas, dan pintasan analitik.
3. **Cash Flow Forecast:** Visualisasi grafik prediksi sisa kas bersih warung esok hari berbasis model AI LSTM.
4. **Anomaly Alert:** Halaman deteksi dini pembengkakan biaya operasional dan potensi kecurangan kasir berbasis Isolation Forest.
5. **BCG Matrix Dashboard:** Pengelompokan stok produk warung ke dalam 4 kuadran dinamis (*Star, Cash Cow, Question Mark, Dog*) untuk strategi *restock*.
6. **Manajemen Produk & Transaksi:** Halaman CRUD data stok serta pencatatan penjualan harian.

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

### 1. Masuk ke Direktori Frontend
Pastikan Anda berada di dalam folder frontend sebelum menjalankan perintah terminal:
```cd frontend```
### 2. Instalasi Dependencies
Pasang semua paket/pustaka Node.js yang diperlukan oleh aplikasi React:```npm install```
### 3. Jalankan Aplikasi di Mode Pengembangan
Untuk menyalakan server lokal Vite dengan fitur Hot Module Replacement (HMR):```npm run dev```
Aplikasi frontend akan aktif dan bisa diakses melalui browser di alamat http://localhost:5173 (atau port default Vite lainnya).
