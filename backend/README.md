# 💻 UMKM Bersama - Backend API

Selamat datang di repositori pusat logika *Back-End* (Server & Database) untuk platform manajemen keuangan cerdas **UMKM Bersama**. Sistem ini dibangun menggunakan **Node.js** dan **Express.js** dengan arsitektur modern (*Production-Ready*), dirancang khusus untuk melayani request data dari frontend serta menjembatani pipa data menuju *AI Service*.

---

## 🛠️ Teknologi & Fitur Utama
- **Runtime Environment:** Node.js v18+ (ES Modules - `type: "module"`)
- **Framework:** Express.js v5+
- **Database Driver:** MySQL 2 (`mysql2`) 
- **Skema Validasi:** Joi Validator untuk keamanan input data
- **Sistem Autentikasi:** Keamanan berlapis menggunakan skema *Access Token* & *Refresh Token* berbasis JSON Web Token (JWT)

---

## 🏗️ Alur Perjalanan Request (Arsitektur Folder)

Aplikasi ini menggunakan pendekatan **Separation of Concerns** (pemisahan tanggung jawab) agar kolaborasi antar pengembang berjalan rapi tanpa bentrok. 
Berikut adalah peta alur bagaimana sebuah *request* dari React Client diproses hingga menghasilkan data:

```text
[ React Client ] 
       │
       ▼
 1. src/server.js               --> Entry point, menyalakan port server (listen)
       │
       ▼
 2. src/server/server-bersama.js --> Konfigurasi Express, pasang CORS & middleware global
       │
       ▼
 3. src/routes/route-bersama.js  --> Gerbang utama routing (menampung semua jalur URL besar)
       │
       ▼
 4. src/middlewares/auth.js      --> [Satpam] Mengecek validasi token JWT di Header
       │   └─► Memanggil `src/security/token-manager.js` (Untuk verifikasi token)
       │   └─► Jika gagal, melempar error ke `src/exceptions/auth-error.js`
       │
       ▼
 5. src/services/product/        --> [Pusat Fitur] Logika fitur per halaman bisnis
       ├── routes.js             --> Menerima request aman, mengarah ke Controller
       ├── validator.js          --> Memvalidasi format input user menggunakan Joi
       ├── controller.js         --> Otak fitur, mengatur logika bisnis halaman
       └── repositories.js       --> Kurir Database, satu-satunya yang menyentuh MySQL
       │
       ▼
 6. src/utils/response.js        --> Pembungkus bungkusan akhir standar API ({ code, status, message, data })
```
## 🚀 Panduan Instalasi & Menjalankan Lokal

1. Masuk ke Direktori Backend
Pastikan Anda berada di dalam folder backend sebelum menjalankan perintah:
``` cd backend ```

3. Instalasi Dependencies
Pasang semua paket/pustaka Node.js yang diperlukan oleh server:
``` npm install ```

3. Konfigurasi Environment Variables (.env)
Buat sebuah file baru bernama .env tepat di dalam folder backend/, lalu lengkapi variabel berikut sesuai konfigurasi server (lokal maupun cloud):
```
HOST=localhost
PORT=5000

# Konfigurasi Database Baru Mengarah ke Aiven Cloud
MYSQLHOST=localhost
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=
MYSQLDATABASE=railway

# Kunci Rahasia Keamanan JWT Token
ACCESS_TOKEN_KEY=kunci_rahasia_access_token_umkm_2026
REFRESH_TOKEN_KEY=kunci_rahasia_refresh_token_umkm_2026
```
4. Menjalankan Server Aplikasi
Pilih salah satu perintah di bawah ini yang sesuai dengan kebutuhan Anda:
-> Mode Pengembangan (Auto-Reload via Nodemon): ``` npm run start:dev ```
-> Mode Produksi (Standard Node.js): ``` npm run start ```
