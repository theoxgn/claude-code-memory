# PROJECT MEMORY

## CURRENT STATUS
**Project:** MuaTrans
**Last Updated:** 2024-06-25
**Status:** Development

**Deskripsi Proyek:** 
MuaTrans adalah aplikasi transportasi logistik untuk pengiriman barang yang menghubungkan pengguna dengan penyedia transportasi (transporter). Sistem ini mengelola pemesanan truk, pengelolaan muatan, pembayaran, dan pelacakan pengiriman.

**Teknologi Utama:**
- Node.js dengan Express.js
- PostgreSQL dengan Sequelize ORM
- Redis untuk caching
- AWS S3 untuk penyimpanan file
- Xendit untuk pembayaran
- Elasticsearch untuk pencarian

## MASALAH & SOLUSI
### **1. MASALAH DATABASE MIGRATION - 2024-06-24**
**❌ Root Cause:** Perlu mengelola banyak tabel dan relasi dalam sistem multi-database
**❌ Impact:** Kompleksitas dalam mengelola struktur data dan migrasi
**❌ Symptoms:** Kesulitan dalam menerapkan perubahan skema secara konsisten
**✅ Solusi:** Menggunakan Sequelize CLI dengan konfigurasi multi-database
- Membuat file konfigurasi terpisah untuk setiap database (.sequelize.database.*)
- Menjalankan migrasi dengan parameter database yang spesifik
- Files: migration.txt, database/migrations/

### **2. IMPLEMENTASI API REVIEW DRIVER - 2024-06-25**
**❌ Root Cause:** Kebutuhan untuk menampilkan dan mengelola review driver dari pesanan
**❌ Impact:** Pengguna tidak dapat melihat review yang telah diberikan untuk driver
**❌ Symptoms:** Fitur review tidak lengkap dalam aplikasi
**✅ Solusi:** Mengimplementasikan API untuk mendapatkan review driver berdasarkan orderId
- Membuat endpoint GET /api/v1/orders/{orderId}/reviews
- Menambahkan method getOrderDriverReviews di controller dan service
- Files: controller/order/review.controller.js, services/order/review.service.js, routes/v1/orders/order.js, validation/order/order.validation.js

### **3. REFAKTOR KODE REVIEW DRIVER - 2024-06-25**
**❌ Root Cause:** Duplikasi kode antara orderService dan reviewService untuk fitur review
**❌ Impact:** Potensi inkonsistensi dan kesulitan pemeliharaan
**❌ Symptoms:** Dua implementasi yang hampir identik untuk fitur yang sama
**✅ Solusi:** Refaktor kode untuk memisahkan tanggung jawab dengan jelas
- Memindahkan logika review dari orderController/orderService ke reviewController/reviewService
- Menggunakan reviewController di route untuk endpoint review
- Menambahkan validasi yang sesuai untuk endpoint review
- Files: controller/order/review.controller.js, services/order/review.service.js, routes/v1/orders/order.js

## SPESIFIKASI & RULES  
### **1. STRUKTUR DATABASE - 2024-06-24**
- Sistem menggunakan beberapa database terpisah:
  - muattrans: Database utama untuk aplikasi transportasi
  - backoffice: Database untuk manajemen admin
  - admin-session: Database untuk sesi admin

### **2. API VERSIONING - 2024-06-24**
- API menggunakan versioning (v1, v2) untuk mendukung pengembangan berkelanjutan
- Setiap versi memiliki router terpisah di src/routes/

### **3. MODUL UTAMA - 2024-06-24**
- Order: Manajemen pemesanan transportasi
- Cargo: Pengelolaan data muatan
- Payment: Integrasi dengan gateway pembayaran (Xendit)
- User: Manajemen pengguna dan autentikasi
- Location: Pelacakan dan manajemen lokasi

### **4. FITUR REVIEW DRIVER - 2024-06-25**
- Pengguna dapat melihat review yang telah diberikan untuk driver
- Informasi review mencakup rating (1-5), komentar, dan waktu review
- Sistem menampilkan ringkasan statistik rating (rata-rata dan distribusi)
- Status canReview menunjukkan apakah pengguna masih dapat memberikan review
- API endpoint: GET /api/v1/orders/{orderId}/reviews
- Response format sesuai dengan standar aplikasi (Message, Data, Type)

## LESSONS LEARNED
### **1. MANAJEMEN MULTI-DATABASE**
- ❌ **SALAH:** Menggunakan konfigurasi database tunggal untuk semua lingkungan
- ✅ **BENAR:** Membuat file konfigurasi terpisah untuk setiap database dan lingkungan
- 💡 **Insight:** Penggunaan flag dan parameter CLI Sequelize memungkinkan manajemen migrasi yang lebih terstruktur

### **2. STRUKTUR ROUTER**
- ❌ **SALAH:** Meletakkan semua rute dalam satu file
- ✅ **BENAR:** Memisahkan rute berdasarkan domain dan menggunakan sistem pemuatan otomatis
- 💡 **Insight:** Pendekatan modular memudahkan pemeliharaan dan pengembangan fitur baru

### **3. IMPLEMENTASI FITUR REVIEW**
- ❌ **SALAH:** Membuat controller dan service terpisah untuk fitur yang masih terkait dengan entitas utama
- ✅ **BENAR:** Memperluas controller dan service yang sudah ada untuk menambahkan fitur terkait
- 💡 **Insight:** Mengikuti pola desain yang konsisten memudahkan integrasi dan pemeliharaan kode

### **4. REFAKTOR KODE UNTUK PEMISAHAN TANGGUNG JAWAB**
- ❌ **SALAH:** Duplikasi kode dan logika bisnis di beberapa service
- ✅ **BENAR:** Memisahkan tanggung jawab dengan jelas dan menggunakan controller/service khusus untuk fitur spesifik
- 💡 **Insight:** Prinsip Single Responsibility membantu meningkatkan maintainability dan testability kode

## CURRENT TASKS
### **1. PENGEMBANGAN API**
- Implementasi fitur order dan pembayaran
- Integrasi dengan layanan pihak ketiga (peta, pembayaran)
- Pengujian dan optimasi performa API
- ✅ Implementasi API review driver

### **2. MIGRASI DATABASE**
- Menerapkan skema terbaru untuk semua database
- Memastikan konsistensi data antar lingkungan

### **3. DOKUMENTASI**
- Melengkapi dokumentasi API dengan Swagger
- Memperbarui dokumentasi ERD dan alur bisnis