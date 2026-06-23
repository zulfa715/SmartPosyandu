# API Endpoints Documentation - Smart Posyandu

Dokumentasi API endpoints untuk implementasi backend Smart Posyandu.

**Base URL:** `https://api.smartposyandu.id/v1`

---

## Authentication

### POST /auth/login
Login user (Kader atau Orang Tua)

**Request:**
```json
{
  "username": "kader1",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "username": "kader1",
      "nama": "Ibu Siti Aminah",
      "email": "siti@posyandu.id",
      "role": "kader"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Username atau password salah"
}
```

### POST /auth/logout
Logout user

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

### GET /auth/me
Get current user data

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "username": "kader1",
    "nama": "Ibu Siti Aminah",
    "email": "siti@posyandu.id",
    "role": "kader"
  }
}
```

---

## Orang Tua

### GET /orangtua
Get all orang tua (Kader only)

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ot1",
      "nama_ayah": "Ahmad Dahlan",
      "nama_ibu": "Siti Nurhaliza",
      "alamat": "Jl. Melati No. 123, Jakarta",
      "telepon": "081234567890",
      "user_id": "2",
      "created_at": "2026-01-15T08:00:00Z"
    }
  ]
}
```

### POST /orangtua
Create new orang tua (Kader only)

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "nama_ayah": "Budi Santoso",
  "nama_ibu": "Ani Wijaya",
  "alamat": "Jl. Mawar No. 45, Jakarta",
  "telepon": "081298765432"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data orang tua berhasil ditambahkan",
  "data": {
    "id": "ot2",
    "nama_ayah": "Budi Santoso",
    "nama_ibu": "Ani Wijaya",
    "alamat": "Jl. Mawar No. 45, Jakarta",
    "telepon": "081298765432"
  }
}
```

---

## Balita

### GET /balita
Get all balita

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `search` (optional): Search by nama or NIK
- `orangtua_id` (optional): Filter by orang tua ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "b1",
      "nama": "Aisyah Putri Dahlan",
      "tanggal_lahir": "2023-03-15",
      "jenis_kelamin": "P",
      "nik": "3175012345670001",
      "orangtua_id": "ot1",
      "orangtua": {
        "nama_ayah": "Ahmad Dahlan",
        "nama_ibu": "Siti Nurhaliza"
      },
      "created_at": "2026-01-01T08:00:00Z"
    }
  ]
}
```

### GET /balita/:id
Get balita by ID

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "b1",
    "nama": "Aisyah Putri Dahlan",
    "tanggal_lahir": "2023-03-15",
    "jenis_kelamin": "P",
    "nik": "3175012345670001",
    "orangtua_id": "ot1",
    "orangtua": {
      "id": "ot1",
      "nama_ayah": "Ahmad Dahlan",
      "nama_ibu": "Siti Nurhaliza",
      "alamat": "Jl. Melati No. 123, Jakarta",
      "telepon": "081234567890"
    }
  }
}
```

### POST /balita
Create new balita (Kader only)

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "nama": "Muhammad Rizki Santoso",
  "tanggal_lahir": "2022-08-20",
  "jenis_kelamin": "L",
  "nik": "3175012345670002",
  "orangtua_id": "ot2"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data balita berhasil ditambahkan",
  "data": {
    "id": "b2",
    "nama": "Muhammad Rizki Santoso",
    "tanggal_lahir": "2022-08-20",
    "jenis_kelamin": "L",
    "nik": "3175012345670002",
    "orangtua_id": "ot2"
  }
}
```

### PUT /balita/:id
Update balita (Kader only)

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "nama": "Muhammad Rizki Santoso Updated",
  "nik": "3175012345670002"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data balita berhasil diperbarui",
  "data": {
    "id": "b2",
    "nama": "Muhammad Rizki Santoso Updated",
    "tanggal_lahir": "2022-08-20",
    "jenis_kelamin": "L",
    "nik": "3175012345670002",
    "orangtua_id": "ot2"
  }
}
```

### DELETE /balita/:id
Delete balita (Kader only)

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Data balita berhasil dihapus"
}
```

---

## Pemeriksaan

### GET /pemeriksaan
Get all pemeriksaan

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `balita_id` (optional): Filter by balita ID
- `start_date` (optional): Filter start date (YYYY-MM-DD)
- `end_date` (optional): Filter end date (YYYY-MM-DD)
- `limit` (optional): Limit results (default: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "p1",
      "balita_id": "b1",
      "balita": {
        "id": "b1",
        "nama": "Aisyah Putri Dahlan",
        "jenis_kelamin": "P"
      },
      "tanggal": "2026-01-15",
      "berat_badan": 12.5,
      "tinggi_badan": 85.0,
      "lingkar_kepala": 46.0,
      "keluhan": null,
      "diagnosa": null,
      "catatan": "Perkembangan baik",
      "imunisasi": "DPT 3",
      "vitamin": "Vitamin A",
      "created_at": "2026-01-15T10:00:00Z"
    }
  ]
}
```

### GET /pemeriksaan/:id
Get pemeriksaan by ID

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "p1",
    "balita_id": "b1",
    "balita": {
      "id": "b1",
      "nama": "Aisyah Putri Dahlan",
      "tanggal_lahir": "2023-03-15",
      "jenis_kelamin": "P"
    },
    "tanggal": "2026-01-15",
    "berat_badan": 12.5,
    "tinggi_badan": 85.0,
    "lingkar_kepala": 46.0,
    "keluhan": null,
    "diagnosa": null,
    "catatan": "Perkembangan baik",
    "imunisasi": "DPT 3",
    "vitamin": "Vitamin A"
  }
}
```

### POST /pemeriksaan
Create new pemeriksaan (Kader only)

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "balita_id": "b1",
  "tanggal": "2026-05-14",
  "berat_badan": 13.5,
  "tinggi_badan": 88.0,
  "lingkar_kepala": 47.5,
  "keluhan": "Batuk ringan",
  "diagnosa": "ISPA ringan",
  "catatan": "Diberi obat batuk",
  "imunisasi": null,
  "vitamin": "Vitamin C"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data pemeriksaan berhasil ditambahkan",
  "data": {
    "id": "p5",
    "balita_id": "b1",
    "tanggal": "2026-05-14",
    "berat_badan": 13.5,
    "tinggi_badan": 88.0,
    "lingkar_kepala": 47.5,
    "keluhan": "Batuk ringan",
    "diagnosa": "ISPA ringan",
    "catatan": "Diberi obat batuk",
    "imunisasi": null,
    "vitamin": "Vitamin C"
  }
}
```

### GET /pemeriksaan/balita/:balita_id/grafik
Get data for growth chart

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "tanggal": "2026-01-15",
      "berat_badan": 12.5,
      "tinggi_badan": 85.0,
      "lingkar_kepala": 46.0
    },
    {
      "tanggal": "2026-02-15",
      "berat_badan": 12.8,
      "tinggi_badan": 86.0,
      "lingkar_kepala": 46.5
    }
  ]
}
```

---

## Jadwal Posyandu

### GET /jadwal
Get all jadwal posyandu

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `upcoming` (optional): true/false (filter upcoming only)
- `month` (optional): Month number (1-12)
- `year` (optional): Year (YYYY)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "j1",
      "tanggal": "2026-05-20",
      "waktu": "08:00 - 12:00",
      "lokasi": "Balai RW 05, Kelurahan Melati",
      "keterangan": "Pemeriksaan rutin dan imunisasi",
      "created_at": "2026-05-01T08:00:00Z"
    }
  ]
}
```

### POST /jadwal
Create new jadwal (Kader only)

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "tanggal": "2026-06-15",
  "waktu": "08:00 - 12:00",
  "lokasi": "Balai RW 05, Kelurahan Melati",
  "keterangan": "Pemeriksaan rutin dan pemberian vitamin A"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Jadwal berhasil ditambahkan",
  "data": {
    "id": "j2",
    "tanggal": "2026-06-15",
    "waktu": "08:00 - 12:00",
    "lokasi": "Balai RW 05, Kelurahan Melati",
    "keterangan": "Pemeriksaan rutin dan pemberian vitamin A"
  }
}
```

### PUT /jadwal/:id
Update jadwal (Kader only)

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "waktu": "08:30 - 12:30",
  "keterangan": "Pemeriksaan rutin, imunisasi, dan vitamin A"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Jadwal berhasil diperbarui",
  "data": {
    "id": "j2",
    "tanggal": "2026-06-15",
    "waktu": "08:30 - 12:30",
    "lokasi": "Balai RW 05, Kelurahan Melati",
    "keterangan": "Pemeriksaan rutin, imunisasi, dan vitamin A"
  }
}
```

### DELETE /jadwal/:id
Delete jadwal (Kader only)

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Jadwal berhasil dihapus"
}
```

---

## Laporan

### GET /laporan/export
Export laporan to PDF

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `balita_id` (optional): Filter by balita ID
- `start_date` (optional): Start date (YYYY-MM-DD)
- `end_date` (optional): End date (YYYY-MM-DD)

**Response:**
- Content-Type: application/pdf
- Binary PDF file

### GET /laporan/statistik
Get statistics for dashboard

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_balita": 25,
    "balita_laki": 12,
    "balita_perempuan": 13,
    "pemeriksaan_bulan_ini": 18,
    "pemeriksaan_total": 156,
    "jadwal_terdekat": {
      "id": "j1",
      "tanggal": "2026-05-20",
      "waktu": "08:00 - 12:00",
      "lokasi": "Balai RW 05, Kelurahan Melati"
    }
  }
}
```

---

## Error Handling

All endpoints return errors in this format:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "nama": ["Nama harus diisi"],
    "tanggal_lahir": ["Format tanggal tidak valid"]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized. Token tidak valid atau telah expired"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden. Anda tidak memiliki akses untuk resource ini"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Data tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Terjadi kesalahan pada server"
}
```

---

## Rate Limiting

- **Rate Limit:** 100 requests per minute per user
- **Headers:**
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when the limit resets (Unix timestamp)

**Response when limit exceeded:**
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

---

## Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_items": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## Implementation Examples

### Laravel Example

```php
// routes/api.php
Route::post('/auth/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('balita', BalitaController::class);
    Route::apiResource('pemeriksaan', PemeriksaanController::class);
});

// BalitaController.php
public function index(Request $request)
{
    $query = Balita::with('orangtua');
    
    if ($request->has('search')) {
        $query->where('nama', 'like', '%' . $request->search . '%');
    }
    
    $balita = $query->paginate(20);
    
    return response()->json([
        'success' => true,
        'data' => $balita
    ]);
}
```

### Node.js + Express Example

```javascript
// routes/balita.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Balita = require('../models/Balita');

router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query.nama = { $regex: search, $options: 'i' };
    }
    
    const balita = await Balita.find(query)
      .populate('orangtua')
      .limit(20);
    
    res.json({
      success: true,
      data: balita
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
```

---

## Testing

### Using cURL

```bash
# Login
curl -X POST https://api.smartposyandu.id/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"kader1","password":"password123"}'

# Get balita list
curl -X GET https://api.smartposyandu.id/v1/balita \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create pemeriksaan
curl -X POST https://api.smartposyandu.id/v1/pemeriksaan \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "balita_id": "b1",
    "tanggal": "2026-05-14",
    "berat_badan": 13.5,
    "tinggi_badan": 88.0,
    "lingkar_kepala": 47.5
  }'
```

### Using Postman

1. Import the API collection
2. Set environment variable `base_url` = `https://api.smartposyandu.id/v1`
3. Login to get token
4. Set environment variable `token` with the received token
5. Test other endpoints

---

## Security Best Practices

1. **Always use HTTPS** in production
2. **Validate all inputs** on the server side
3. **Use prepared statements** to prevent SQL injection
4. **Hash passwords** with bcrypt (min 10 rounds)
5. **Implement JWT expiry** (recommended: 24 hours)
6. **Use refresh tokens** for better security
7. **Log all sensitive operations** (create, update, delete)
8. **Implement CORS** properly
9. **Rate limit** all endpoints
10. **Sanitize** all user inputs

---

## Support

For API support and questions:
- Email: api@smartposyandu.id
- Documentation: https://docs.smartposyandu.id
- Status Page: https://status.smartposyandu.id
