# POS Backend API (Point of Sale)

Backend API untuk sistem Kasir (Point of Sale) yang dibangun menggunakan Node.js, Express, dan Prisma ORM. Proyek ini dirancang dengan arsitektur **Layered Architecture** (Controller-Service-Repository) untuk skalabilitas, keamanan, dan kemudahan pemeliharaan.

## 🚀 Fitur Utama

### 🔐 Autentikasi & Keamanan
- **JWT Authentication:** Login aman menggunakan JSON Web Token.
- **Role-Based Access Control (RBAC):** Hak akses terpisah untuk **Admin** dan **Kasir**.
- **Rate Limiting:** Proteksi terhadap Brute Force (Login) dan Spam Request (API Global).
- **Secure Password:** Hashing password menggunakan `bcryptjs`.

### 📦 Manajemen Produk
- **CRUD Produk:** Tambah, edit, lihat, dan hapus produk.
- **Soft Delete:** Produk yang dihapus tidak hilang permanen demi integritas data transaksi.
- **Kategori & Slug:** Pengelompokan produk dan URL friendly.
- **Image Upload:** Upload gambar produk menggunakan `multer`.

### 💰 Transaksi & Stok
- **Atomic Transactions:** Menjamin konsistensi data stok dan keuangan menggunakan `prisma.$transaction`.
- **Validasi Stok:** Mencegah transaksi jika stok tidak mencukupi.
- **Snapshot Harga:** Menyimpan harga saat transaksi terjadi (aman terhadap perubahan harga di masa depan).
- **Export CSV:** Laporan transaksi periodik yang bisa didownload.

### ⚙️ Pengaturan Toko
- **Dynamic Settings:** Pengaturan nama toko, alamat, footer struk, dan ukuran printer (58mm/80mm) yang bisa diubah via API.

### 🛠 Utilitas
- **Centralized Error Handling:** Format error yang konsisten dan rapi.
- **Logging:** Pencatatan log sistem menggunakan `winston`.

---

## 💻 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Joi
- **Logging:** Winston
- **File Upload:** Multer

---

## ⚙️ Persyaratan Sistem

- Node.js (v18 atau lebih baru disarankan)
- PostgreSQL (atau Docker untuk menjalankan container DB)
- NPM / Yarn

---

## 🚀 Cara Instalasi & Menjalankan

### 1. Clone Repository
```bash
git clone [https://github.com/elfnc/pos-backend.git](https://github.com/elfnc/pos-backend.git)
cd pos-backend
````

### 2\. Install Dependencies

```bash
npm install
```

### 3\. Konfigurasi Environment Variable

Buat file `.env` di root folder dan sesuaikan dengan konfigurasi Anda:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/db_pos?schema=public"
JWT_SECRET="rahasia_super_aman_ganti_ini"
NODE_ENV="development"
```

### 4\. Setup Database (Migrasi & Seeding)

Jalankan perintah berikut untuk membuat tabel dan mengisi data awal (Admin & Produk Dummy):

```bash
# Membuat tabel database
npx prisma migrate dev --name init

# Mengisi data awal (Admin: admin/admin123, Kasir: kasir/kasir123)
npx prisma db seed
```

\*\*

### 5\. Jalankan Aplikasi

```bash
# Mode Development (dengan Nodemon)
npm run dev

# Mode Production
npm start
```

Aplikasi akan berjalan di `http://localhost:5000`.

-----

## 🐳 Menjalankan dengan Docker (Opsional)

Jika Anda ingin menjalankan database PostgreSQL menggunakan Docker:

```bash
docker-compose up -d
```

\*\*

-----

## 📖 Dokumentasi API

Dokumentasi lengkap endpoint API tersedia di file `dokumentasi_api.md`.

**Quick Overview:**

| Method | Endpoint | Deskripsi | Akses |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/login` | Login User | Public |
| GET | `/api/products` | List Produk | Admin, Kasir |
| POST | `/api/products` | Tambah Produk (+Gambar) | Admin |
| POST | `/api/transactions` | Buat Transaksi | Admin, Kasir |
| GET | `/api/transactions/export` | Export Laporan CSV | Admin |
| GET | `/api/settings` | Info Toko & Printer | Admin, Kasir |

-----

## 📂 Struktur Folder

```
src/
├── controllers/    # Logika penanganan request & response
├── services/       # Logika bisnis & interaksi database
├── routes/         # Definisi endpoint API
├── middlewares/    # Auth, Validation, Upload, Error Handling
├── validations/    # Schema validasi input (Joi)
├── utils/          # Helper functions (Logger, Password, JWT)
├── lib/            # Konfigurasi library (Prisma Client)
└── index.js        # Entry point aplikasi
```

-----

## 🛡️ Akun Demo (Seed)

Jika menggunakan `npm run seed`:

1.  **Admin**
      - Username: `admin`
      - Password: `admin123`
2.  **Kasir**
      - Username: `kasir`
      - Password: `kasir123`

-----

Built with ❤️ by [Eldevs]

```