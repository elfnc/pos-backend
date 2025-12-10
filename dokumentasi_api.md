````markdown
# Dokumentasi API POS Backend

## Informasi Umum
- **Base URL:** `http://localhost:5000/api`
- **Autentikasi:** Menggunakan Bearer Token (JWT).
- **Format Tanggal:** ISO 8601 (YYYY-MM-DD)

---

## 🛡️ Error Handling & Rate Limiting

API ini menggunakan standar kode status HTTP dan format respons error yang konsisten.

### Status Codes
- `200` OK - Request berhasil.
- `201` Created - Data berhasil dibuat.
- `400` Bad Request - Validasi input gagal.
- `401` Unauthorized - Token tidak ada atau invalid.
- `403` Forbidden - Role tidak diizinkan.
- `404` Not Found - Data tidak ditemukan.
- `409` Conflict - Data duplikat (misal: username/slug sudah ada).
- `429` Too Many Requests - Terlalu banyak request (Rate Limit).
- `500` Internal Server Error - Kesalahan server.

### Format Response Error
```json
{
  "message": "Deskripsi error yang user-friendly",
  "error": "Detail error teknis (opsional, biasanya saat validasi)"
}
````

### Batasan Request (Rate Limiting)

  - **Global API:** Maksimal 100 request per 15 menit per IP.
  - **Login:** Maksimal 5 percobaan gagal per 15 menit per IP (untuk mencegah brute-force).

-----

## 🔐 Autentikasi

### POST /auth/login

  - **Deskripsi:** Login user dan mendapatkan JWT token.
  - **Rate Limit:** Maks 5x percobaan / 15 menit.
  - **Body:**
    ```json
    {
      "username": "admin",
      "password": "password123"
    }
    ```
  - **Response (200):**
    ```json
    {
      "message": "Login successful",
      "data": {
        "user": { "id": "uuid", "username": "admin", "role": "ADMIN" },
        "token": "eyJhbGci..."
      }
    }
    ```

-----

## ⚙️ Pengaturan Toko (Settings)

### GET /settings

  - **Akses:** Admin, Kasir
  - **Deskripsi:** Mendapatkan informasi toko untuk header struk/aplikasi.
  - **Response (200):**
    ```json
    {
      "data": {
        "storeName": "Kopi Senja",
        "storeAddress": "Jl. Kenangan No. 99",
        "storePhone": "08123456789",
        "receiptFooter": "Terima kasih sudah mampir!",
        "printerWidth": 58
      }
    }
    ```

### PUT /settings

  - **Akses:** Admin
  - **Deskripsi:** Mengupdate informasi toko.
  - **Body:**
    ```json
    {
      "storeName": "Kopi Senja Baru",
      "storeAddress": "Jl. Baru No. 1",
      "storePhone": "08123456789",
      "receiptFooter": "Thank You",
      "printerWidth": 80
    }
    ```

-----

## 📂 Kategori

### GET /categories

  - **Akses:** Admin, Kasir
  - **Deskripsi:** Mendapatkan daftar kategori produk.
  - **Response (200):**
    ```json
    {
      "data": [
        { "id": "uuid", "name": "Minuman" },
        { "id": "uuid", "name": "Makanan" }
      ]
    }
    ```

### POST /categories

  - **Akses:** Admin
  - **Deskripsi:** Membuat kategori baru.
  - **Body:**
    ```json
    { "name": "Snack" }
    ```

-----

## 📦 Produk

### GET /products

  - **Akses:** Admin, Kasir
  - **Deskripsi:** Mendapatkan daftar produk aktif (tidak termasuk yang dihapus/soft-deleted).
  - **Query Params:**
      - `page` (default: 1)
      - `limit` (default: 10)
  - **Response (200):**
    ```json
    {
      "data": [
        {
          "id": "uuid",
          "name": "Kopi Susu",
          "slug": "kopi-susu",
          "price": 18000,
          "stock": 100,
          "image": "/uploads/products/171500-kopisusu.jpg",
          "category": { "name": "Minuman" }
        }
      ],
      "meta": { "total": 50, "page": 1, "limit": 10, "totalPages": 5 }
    }
    ```

### POST /products

  - **Akses:** Admin
  - **Deskripsi:** Menambah produk baru dengan gambar.
  - **Header:** `Content-Type: multipart/form-data`
  - **Body (Form Data):**
      - `name`: (text) "Kopi Gula Aren"
      - `price`: (text) 20000
      - `stock`: (text) 50
      - `categoryId`: (text) "uuid-kategori"
      - `image`: (file) *Upload file gambar (jpg/png, max 2MB)*

### PUT /products/:id

  - **Akses:** Admin
  - **Deskripsi:** Update produk.
  - **Body:** JSON (seperti POST, tanpa gambar) atau Form Data (jika update gambar).

### DELETE /products/:id

  - **Akses:** Admin
  - **Deskripsi:** Menghapus produk (Soft Delete). Produk tidak hilang dari database tapi ditandai sebagai `deleted`.
  - **Response (200):** `Product deleted successfully`

-----

## 💰 Transaksi

### POST /transactions

  - **Akses:** Admin, Kasir
  - **Deskripsi:** Mencatat transaksi baru & mengurangi stok.
  - **Body:**
    ```json
    {
      "items": [
        { "productId": "uuid-produk-1", "quantity": 2 },
        { "productId": "uuid-produk-2", "quantity": 1 }
      ],
      "paymentAmount": 100000
    }
    ```

### GET /transactions

  - **Akses:** Admin
  - **Deskripsi:** History transaksi.
  - **Query Params:** `page`, `limit`

### GET /transactions/export

  - **Akses:** Admin
  - **Deskripsi:** Download laporan transaksi dalam format CSV.
  - **Query Params:**
      - `startDate`: 2023-01-01
      - `endDate`: 2023-01-31
  - **Response:** File Download (`text/csv`)

### GET /transactions/:id

  - **Akses:** Admin, Kasir
  - **Deskripsi:** Detail satu transaksi (untuk cetak ulang struk).

-----

## 👥 User Management

### GET /users

  - **Akses:** Admin
  - **Deskripsi:** List semua user.

### POST /users

  - **Akses:** Admin
  - **Body:**
    ```json
    {
      "username": "kasir2",
      "password": "password123",
      "role": "CASHIER"
    }
    ```