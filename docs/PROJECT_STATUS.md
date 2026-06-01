# AndikaKost PoC — Status & Next Steps (per 27 May 2026)

Dokumen ini merangkum posisi project saat ini, keputusan scope PoC, dan rencana langkah berikutnya berdasarkan PRD + development plan.

## 1) Tujuan PoC

Validasi bahwa sistem sederhana bisa:

- Mengurangi operasional manual (catatan, spreadsheet, WhatsApp chat).
- Memberi visibilitas status kamar/tenant/pembayaran/complaint secara terpusat.
- Memudahkan tenant (gen-Z/younger) untuk cek tagihan & komplain.
- Membantu admin/pemilik (cenderung older) dengan UI yang jelas, tidak ribet, dan mudah dipakai.

## 2) Yang Sudah Selesai (Scope PoC)

### Backend (FastAPI + PostgreSQL)

- Auth JWT: login + `/auth/me`, role `admin` dan `tenant`.
- Admin dashboard summary: kamar/tenant/pembayaran/complaints (+ booking requests).
- Room management: CRUD + status + soft delete.
- Tenant management: admin create tenant account + assign/unassign room (room auto jadi `occupied`).
- Payment flow:
  - Admin create bill manual.
  - Tenant upload payment proof (PNG/JPG/PDF).
  - Admin approve/reject.
- Complaint flow:
  - Tenant submit complaint (+ optional photo).
  - Admin update status + add response.
- Public booking:
  - Public overview + list available rooms.
  - Public create booking request (tanpa login).
  - Admin review booking list + update status.

### Frontend (React + Vite + Tailwind)

- Aksesibel & sederhana: ukuran teks default besar, fokus terlihat jelas, navigasi jelas.
- Login page + role-based routing.
- Admin area:
  - Dashboard, Rooms, Tenants, Payments, Complaints, Bookings.
- Tenant area:
  - Dashboard, My Room, My Bills + Upload proof, My Complaints + Submit complaint.
- Public area (tanpa login):
  - `/` overview
  - `/rooms` list available rooms + request booking

### Run-time / Deploy Local

Satu `docker-compose.yml` untuk menjalankan:

- `db` (Postgres)
- `backend` (FastAPI; auto `alembic upgrade head` + seed admin)
- `frontend` (Vite dev server)

## 3) Masalah User yang Harus Di-address (Problem Discovery)

### Tenant: “WhatsApp sudah cukup, jangan dipersulit”

Fakta saat ini:

- Banyak tenant lebih nyaman via WhatsApp: cepat, familiar, tidak perlu login.
- Kekurangan WhatsApp: info tercecer, status pembayaran tidak jelas, proof hilang, response time pemilik lambat, tidak ada tracking komplain.

Target solusi platform:

- Tenant tetap bisa “self-service” tanpa banyak friction.
- Sistem membantu transparansi (status tagihan/komplain) tanpa memaksa semua interaksi pindah total dari WhatsApp.

**Hipotesis**: tenant mau pakai web kalau manfaatnya nyata (cek status, upload bukti, tracking komplain) dan prosesnya minim hambatan.

### Pemilik/Admin: “Tidak mau chat satu-satu, pengen push invoice/notif”

Fakta saat ini:

- Pemilik/admin capek ngechat per tenant untuk reminder/invoice.
- Keterlambatan pembayaran sering karena tenant lupa/komunikasi tidak konsisten.

Target solusi platform:

- Admin bisa broadcast reminder/invoice terstruktur.
- Ada status “unpaid / pending_verification / paid / rejected” yang jelas.
- Notifikasi otomatis (WhatsApp/email/in-app) untuk mengurangi manual chat.

## 4) Arah Pengembangan (Roadmap yang Disarankan)

### Phase A — Research & Discovery (wajib sebelum build besar)

Kita perlu temuin masalah real dari:

- Tenant (baru & existing)
- Pemilik/admin kost

Output yang diincar:

- Daftar pain points prioritas (top 5 tenant + top 5 admin).
- Workflow harian admin (berapa lama handle tagihan/komplain/room turnover).
- Minimum notif yang paling berguna (reminder H-3, H, H+3?).
- Preferensi tenant: link tanpa login? OTP? login normal? semua via WA?

### Phase B — “Low-friction tenant”

Opsi yang bisa dipilih (prioritas dari paling simple):

1) **Magic link** (tanpa password): tenant klik link dari WA → langsung masuk halaman “My Bills/My Complaints”.
2) **OTP via WhatsApp/SMS**: login tanpa password.
3) Tetap email/password, tapi hanya untuk tenant yang butuh self-service intens.

Catatan: Phase ini perlu integrasi pesan/OTP (WhatsApp provider) atau email provider.

### Phase C — WhatsApp-first untuk Admin (push notif)

Target fitur:

- Admin create bill → sistem generate template pesan WA (copy/paste) minimal.
- Setelah itu: integrasi WhatsApp API untuk kirim otomatis (broadcast + reminder terjadwal).
- Log pengiriman (sukses/gagal) agar admin tidak bingung.

### Phase D — Billing Automation (setelah PoC tervalidasi)

- Auto-generate monthly bills.
- Due date reminders.
- Late fee rules (opsional, bisa belakangan).

## 5) Prinsip UX (Tenant vs Admin)

- Tenant (younger): cepat, mobile-friendly, fokus ke “cek status & action 1-2 klik”.
- Admin/pemilik (older): navigasi sederhana, label jelas, minim istilah teknis, form tidak bertele-tele, konfirmasi sebelum aksi destruktif.

## 6) Batasan Saat Ini (Known Gaps)

- Booking request yang di-approve sekarang otomatis convert menjadi tenant account dan room langsung berubah ke status `occupied`.
- Tidak ada integrasi WhatsApp/email notification (masih PoC).
- Tidak ada payment gateway; verifikasi manual via upload proof (sesuai PoC).
- Tidak ada multi-property (out of scope PoC).

## 7) Next Action yang Paling Masuk Akal

Kalau mau lanjut setelah PoC:

1) Sesi interview singkat (5–10 tenant + 3–5 admin/pemilik) → rangkum pain points.
2) Pilih 1 approach “tenant tanpa ribet” (magic link vs OTP).
3) Implement “push invoice to WhatsApp” tahap 1: generate message template + satu tombol copy.
4) Baru setelah itu integrasi WhatsApp API dan reminder terjadwal.


## 8) Recent Implementation Update (31 May 2026)

- Booking approval now auto-converts booking into active tenant + room status `occupied`.
- Frontend received two UI passes:
  - logo-inspired modernization,
  - cleanup pass to fix button contrast/active-state visibility and simplify layout.

Detailed reference:

- `docs/RECENT_CHANGES_AND_NEXT_STEPS.md`

## 9) Recent Security Hardening Update (1 June 2026)

Upload endpoints sekarang dibatasi untuk mencegah VPS storage bloat dan abuse:

- Max upload size: `1 MB` per file.
- Allowed MIME types only: `image/jpeg`, `image/png`, `application/pdf`.
- Auth: upload flow tetap harus user login tenant (JWT + `require_tenant`).
- Path safety: backend tidak lagi memakai nama file dari user; nama file dibuat acak di server.
- Rate limit upload: maksimal `2` request upload per `60` detik per IP.
- Saat limit terlewati: request di-block (`HTTP 429`, code `RATE_LIMITED`).
