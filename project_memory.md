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

### **4. IMPLEMENTASI API AUTO-COMPLETE ORDER - 2024-06-26**
**❌ Root Cause:** Kebutuhan untuk menyelesaikan order secara otomatis berdasarkan kondisi tertentu
**❌ Impact:** Proses manual completion order memakan waktu dan rawan error
**❌ Symptoms:** Tidak ada endpoint untuk auto-complete order
**✅ Solusi:** Mengimplementasikan API auto-complete order sesuai contract specification
- Membuat endpoint POST /api/v1/orders/auto-complete (tanpa request body, hanya headers)
- Implementasi business logic validation (status, locations, documents, payments)
- Menggunakan database transactions untuk data consistency
- Debugging field names (`orderStatus` vs `statusOrder`) dan enum values (`DOCUMENT_DELIVERY` vs display text)
- Files: controller/order/order.controller.js, services/order/order.service.js, routes/v1/orders/order.js

### **5. IMPLEMENTASI API PPH TAX CALCULATION - 2024-06-26**
**❌ Root Cause:** Kebutuhan untuk menghitung pajak PPH 23 untuk entitas bisnis pada settlement
**❌ Impact:** Tidak ada sistem untuk menghitung pajak yang akurat sesuai regulasi
**❌ Symptoms:** Tidak ada endpoint untuk kalkulasi pajak PPH
**✅ Solusi:** Mengimplementasikan API PPH tax calculation dengan 6-step verification process
- Membuat modul settlement baru dengan endpoint POST /v1/settlement/calculate-pph-tax
- Implementasi business logic PPH 23 (2% tax rate) untuk transportation service
- Fallback mechanism jika tax configuration tidak ada di database
- Systematic debugging untuk module path errors dan import pattern consistency
- Files: controller/settlement/settlement.controller.js, services/settlement/settlement.service.js, routes/v1/settlement/settlement.js, validation/settlement/settlement.validation.js

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

### **5. ⚠️ CRITICAL LESSON: API CONTRACT COMPLIANCE - 2024-06-26**
- **MANDATORY WORKFLOW:** Selalu baca API contract di `ai/api_kontrak.md` secara LITERAL
- **FORBIDDEN:** Menambahkan field request/response yang tidak ada di contract
- **RULE:** Jika API contract tidak mention request body → TIDAK ADA request body
- **RULE:** Jika API contract tidak mention parameter → TIDAK ADA parameter  
- **VALIDATION:** Implementation harus 100% match dengan contract specification

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

### **5. ⚠️ CRITICAL: API CONTRACT INTERPRETATION - 2024-06-26**
- ❌ **KESALAHAN FATAL:** Menambahkan assumptions yang TIDAK ADA di API contract
- ❌ **ROOT CAUSE:** Mengutamakan "common sense" daripada "exact specification"
- ❌ **CONTOH KASUS:** Auto-complete endpoint - menambahkan request body `orderId` padahal API contract hanya specify headers
- ✅ **BENAR:** Membaca API contract secara LITERAL tanpa menambahkan assumption apapun
- 💡 **CRITICAL RULE:** **API Contract adalah Source of Truth - TIDAK BOLEH ditambah atau dikurangi**
- 🚨 **WARNING:** Selalu ikuti specification secara EXACT, jangan pernah "mengisi kekosongan" yang tidak ada

### **6. 🐛 DATABASE MODEL & ENUM DEBUGGING - 2024-06-26**
- ❌ **KESALAHAN UMUM:** Menggunakan field names dan enum values tanpa verifikasi dengan model
- ❌ **CONTOH ERROR 1:** `statusOrder` vs `orderStatus` - tidak membaca model definition
- ❌ **CONTOH ERROR 2:** Enum display values vs enum keys - `'Proses Pengiriman Dokumen'` vs `'DOCUMENT_DELIVERY'`
- ✅ **SYSTEMATIC DEBUGGING APPROACH:**
  1. Read error message completely
  2. Trace back to source (model/enum definition)
  3. Fix one error at a time
  4. Test incrementally
- 💡 **KEY INSIGHT:** Database errors always point to exact schema mismatch
- 🔧 **BEST PRACTICE:** Always verify field names from model before writing queries

### **7. 🏗️ ORM MODEL VALIDATION & CROSS-DATABASE CHALLENGES - 2024-06-26**
- ❌ **KESALAHAN BERULANG:** Assumption terhadap field existence tanpa membaca model
- ❌ **CONTOH KASUS AUTO-COMPLETE DEBUGGING:**
  - `UNLOAD` vs `DROPOFF` enum values in MTLocation model
  - `withShipping` field location: MTAdditionalService vs MTOrderAdditionalService  
  - `locationID` field tidak exist di MTOrderStatusHistory
  - `isActive` field tidak exist di MTOrderDriver
  - Cross-database issues: Payment service uses `dbPayment` vs `dbMuatTrans`
- ✅ **MANDATORY WORKFLOW SEBELUM CODING:**
  1. **READ MODEL FIRST:** Baca model definition di `src/models/` 
  2. **VERIFY FIELD NAMES:** Check exact field names dan data types
  3. **CHECK ENUMS:** Verify enum values dari enum files
  4. **VALIDATE ASSOCIATIONS:** Check model relationships dan aliases (`as: 'additionalService'`)
  5. **DATABASE SCOPE:** Pastikan semua models menggunakan database connection yang sama
- 💡 **CRITICAL INSIGHT:** Setiap error database menunjuk ke schema mismatch yang spesifik
- 🚨 **MEMORY RULE:** **JANGAN PERNAH ASSUME - SELALU VERIFIKASI DENGAN MODEL DEFINITION**
- 🔧 **BEST PRACTICE:** Gunakan ORM models dan relationships, bukan raw queries manual

### **8. 🎯 PROMPT EFFECTIVENESS & RULE COMPLIANCE - 2024-06-26**
- ❌ **KESALAHAN FUNDAMENTAL:** Mencoba membuat workflow baru padahal sudah ada di rules
- ❌ **ROOT CAUSE:** Tidak mengikuti File Inclusion Priority yang MANDATORY di CLAUDE.md
- ❌ **SYMPTOM:** Prompt menjadi complex dan verbose karena duplikasi aturan yang sudah ada
- ✅ **CRITICAL REALIZATION:** 
  - CLAUDE.md line 95-99: File Inclusion Priority sudah comprehensive
  - claude_backend_rules.md: Backend workflow sudah complete
  - project_memory.md: Context dan lessons learned sudah tersedia
- 💡 **OPTIMAL PROMPT DISCOVERY:** 
  - **Simple prompt:** `"implementasi /v1/orders/auto-complete"` 
  - **Sudah cukup** karena system akan auto-follow existing rules
  - **Problem bukan di prompt complexity** tapi di **rule compliance discipline**
- 🚨 **KEY INSIGHT:** **TRUST THE SYSTEM - Rules sudah comprehensive, enforcement yang kurang**
- 🔧 **SOLUTION:** Follow File Inclusion Priority dengan strict discipline, bukan create new workflow
- 📋 **USER EXPECTATION UNDERSTANDING:** 
  - User ingin **efficiency**: 1-3 prompt untuk completion
  - User percaya **existing rules sudah adequate**
  - User butuh **consistent execution**, bukan new methodology
- 🎯 **LESSON:** Effective prompting = Simple request + Trust existing comprehensive rules

### **9. 🚨 SYSTEMATIC DEBUGGING METHODOLOGY - 2024-06-26**
- ❌ **KESALAHAN UMUM:** Module path assumptions tanpa verifikasi file actual
- ❌ **CONTOH ERROR:** `Cannot find module '../../../middleware/authentication_muattrans'`
- ❌ **ROOT CAUSE:** Menggunakan assumption daripada checking existing patterns
- ✅ **DEBUGGING PROTOCOL YANG PROVEN EFFECTIVE:**
  1. **Read error message completely** - jangan skip detail apapun
  2. **Use Glob/Grep untuk verify file paths** sebelum menulis imports
  3. **Check existing route files** untuk melihat import patterns yang established
  4. **Fix ONE error at a time** - systematic approach beats guessing
  5. **Test after each fix** - incremental validation prevents cascade errors
- 🛡️ **DEFENSIVE PROGRAMMING PRINCIPLES:**
  - **Fallback mechanisms** untuk database configurations (contoh: default tax rate 2%)
  - **Graceful degradation** instead of hard errors untuk missing data
  - **Import pattern consistency** check dengan existing codebase
- 🔧 **KEY INSIGHT:** `authentication_muatparts` vs `authentication_muattrans` - nama file harus exact match
- 💡 **MEMORY RULE:** **NEVER ASSUME - ALWAYS VERIFY** dengan source files actual
- 📋 **SUCCESS PATTERN:** Glob → Read existing examples → Copy exact patterns → Test incrementally

### **10. 🎯 PPH TAX IMPLEMENTATION SUCCESS FACTORS - 2024-06-26**
- ✅ **6-STEP VERIFICATION PROCESS TERBUKTI EFEKTIF:**
  1. File inclusion priority (mandatory files read)
  2. API contract interpretation (100% literal)
  3. Business rules discovery (KO documents)
  4. Comprehensive verification (models, enums, services)
  5. Implementation execution (Route → Controller → Service → Validation)
  6. Validation & testing (systematic debugging)
- ✅ **BUSINESS LOGIC COMPLIANCE:**
  - PPH 23 tax type untuk transportation service
  - 2% tax rate sesuai regulasi
  - Calculation method: GROSS_AMOUNT
  - Fallback ke default rate jika database config kosong
- 🔧 **TECHNICAL IMPLEMENTATION SUCCESS:**
  - Endpoint: `POST /v1/settlement/calculate-pph-tax`
  - Authentication: JWT dengan `authMuatpartsRequired`
  - Response format: 100% sesuai API contract specification
  - Error handling: Comprehensive dengan fallback mechanisms

## CURRENT TASKS
### **1. PENGEMBANGAN API**
- Implementasi fitur order dan pembayaran
- Integrasi dengan layanan pihak ketiga (peta, pembayaran)
- Pengujian dan optimasi performa API
- ✅ Implementasi API review driver
- ✅ Implementasi API auto-complete order (POST /v1/orders/auto-complete)
- ✅ Implementasi API PPH tax calculation (POST /v1/settlement/calculate-pph-tax)

### **2. MIGRASI DATABASE**
- Menerapkan skema terbaru untuk semua database
- Memastikan konsistensi data antar lingkungan

### **3. DOKUMENTASI**
- Melengkapi dokumentasi API dengan Swagger
- Memperbarui dokumentasi ERD dan alur bisnis