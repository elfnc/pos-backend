# Dokumentasi API POS Backend

## Autentikasi

### POST /api/auth/login
- **Deskripsi:** Login user dan mendapatkan JWT token
- **Body:**
  - `username` (string)
  - `password` (string)
- **Response:**
  - 200: `{ token, user }`
  - 401: `Unauthorized`

### POST /api/auth/register
- **Deskripsi:** Register user baru
- **Body:**
  - `username` (string)
  - `password` (string)
  - `role` (string)
- **Response:**
  - 201: `{ user }`
  - 400: `Bad Request`

## User

### GET /api/users
- **Deskripsi:** Mendapatkan daftar user (hanya admin)
- **Header:**
  - `Authorization: Bearer <token>`
- **Response:**
  - 200: `[ { id, username, role } ]`
  - 403: `Forbidden`

### GET /api/users/:id
- **Deskripsi:** Mendapatkan detail user
- **Header:**
  - `Authorization: Bearer <token>`
- **Response:**
  - 200: `{ id, username, role }`
  - 404: `Not Found`

## Produk

### GET /api/products
- **Deskripsi:** Mendapatkan daftar produk
- **Response:**
  - 200: `[ { id, name, price, stock } ]`

### POST /api/products
- **Deskripsi:** Menambah produk baru (hanya admin)
- **Header:**
  - `Authorization: Bearer <token>`
- **Body:**
  - `name` (string)
  - `price` (number)
  - `stock` (number)
- **Response:**
  - 201: `{ product }`
  - 403: `Forbidden`

### PUT /api/products/:id
- **Deskripsi:** Update produk (hanya admin)
- **Header:**
  - `Authorization: Bearer <token>`
- **Body:**
  - `name` (string, optional)
  - `price` (number, optional)
  - `stock` (number, optional)
- **Response:**
  - 200: `{ product }`
  - 404: `Not Found`

### DELETE /api/products/:id
- **Deskripsi:** Hapus produk (hanya admin)
- **Header:**
  - `Authorization: Bearer <token>`
- **Response:**
  - 204: `No Content`
  - 404: `Not Found`

## Transaksi

### GET /api/transactions
- **Deskripsi:** Mendapatkan daftar transaksi (hanya admin)
- **Header:**
  - `Authorization: Bearer <token>`
- **Response:**
  - 200: `[ { id, userId, total, createdAt } ]`

### POST /api/transactions
- **Deskripsi:** Membuat transaksi baru
- **Header:**
  - `Authorization: Bearer <token>`
- **Body:**
  - `items`: array of `{ productId, quantity }`
- **Response:**
  - 201: `{ transaction }`
  - 400: `Bad Request`

---

**Catatan:**
- Semua endpoint yang membutuhkan autentikasi harus mengirimkan header `Authorization: Bearer <token>`.
- Role yang tersedia: `admin`, `kasir`.
- Hanya admin yang dapat mengelola user dan produk.
