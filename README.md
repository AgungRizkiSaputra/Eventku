# 🎟️ EVENTKU — Platform Event Discovery & E-Ticketing

<p align="center">
  <img src="public/images/events/nusantara-sound.jpg" alt="Eventku Platform Banner" width="100%" style="border-radius: 4px; max-height: 400px; object-fit: cover;" />
</p>

<p align="center">
  <strong>Platform penemuan acara modern, kurasi festival, dan sistem e-ticketing instan ber-QR code unik untuk konser, festival, konferensi, workshop, dan seminar di Indonesia.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15_(App_Router)-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Payment-Midtrans_%26_Xendit-orange?style=for-the-badge" alt="Payment Ready" />
</p>

---

## 📖 Tentang Eventku

**Eventku** adalah aplikasi web *end-to-end* yang mempertemukan penyelenggara acara (*event organizers*) dengan pencari pengalaman (*event attendees*). Website ini dirancang dengan standar arsitektur profesional dan filosofi visual **editorial anti-slop** — mengutamakan tipografi yang kuat, tata letak dinamis, fotografi beresolusi tinggi, dan komponen yang berkarakter tanpa dekorasi buatan (*AI-slop* seperti *gradient* berlebihan atau *glassmorphism* generik).

Platform ini mengakomodasi seluruh siklus tiket: dari penemuan acara, pemilihan tier tiket dan kuota, pemesanan multi-peserta, penerbitan tiket digital dengan **QR code dinamis yang dapat diverifikasi**, hingga alat pemindai tiket di pintu masuk (*gate scanner*) bagi staf acara.

---

## 🚀 Fitur Unggulan

### 1. 🌐 Pengalaman Pengguna (Public & Attendees)
- **Hero Editorial & Days Countdown:** Tajuk dinamis dengan penghitung hari otomatis (*countdown*) ke acara terdekat dan kolase poster acara.
- **Pencarian Cepat & Kategori Terarah:** Form pencarian instan dan navigasi kategori acara (*Konser, Festival, Seminar, Workshop, Konferensi, Pameran, Olahraga, Komunitas*).
- **Katalog Jelajahi Event (`/events`):** Filter multi-parameter dengan pencarian teks, pemilihan kategori, filter kota (Jakarta, Bandung, Bali, Yogyakarta, dll), rentang tanggal, batas harga, dan pengurutan (*sort*).
- **Halaman Detail Acara (`/events/[id]`):** Tampilan sinematik poster acara, deskripsi mendalam, rundown jadwal, lokasi venue, data penyelenggara, serta rekomendasi event terkait.
- **Alur Pemesanan 3 Langkah (`/events/[id]/booking`):**
  1. *Pilih Tiket:* Seleksi jenis tiket (Early Bird, Regular, VIP) dengan batas kuota dan kuantitas per pesanan.
  2. *Data Peserta:* Form identitas kontak pemesan dan rincian identitas tiap peserta (*attendee*).
  3. *Ringkasan & Konfirmasi:* Rincian pesanan, total biaya, dan konfirmasi transaksi.
- **E-Ticket Digital Resmi (`/tickets/[id]`):** Desain tiket perforasi dengan **QR code unik (SVG/Canvas)** yang memuat payload tiket terenkripsi, data peserta, kode pesanan, dan fitur cetak/unduh *print-friendly*.
- **Tiket Saya (`/tickets`):** Riwayat pemesanan pengguna dengan filter status (*Semua, Aktif, Terpakai, Dibatalkan*).

### 2. 🎪 Dashboard Penyelenggara (Organizer)
- **Statistik & Metrik Penjualan (`/dashboard`):** Total tiket terjual, omset kotor, persentase keterisian kuota (*occupancy rate*), dan daftar transaksi terbaru.
- **Kelola Acara (`/dashboard/events`):** Manajemen seluruh event aktif dan draf, pemantauan kuota tiket per tier, serta status tayang.
- **Buat Acara Baru (`/dashboard/events/new`):** Formulir lengkap pembuatan acara, jadwal, lokasi venue, dan penambahan kategori tiket multi-tier secara dinamis (nama, kuota, harga, dan ketentuan).
- **Gate QR Scanner & Validator (`/dashboard/scanner`):** Alat pemindai dan validasi tiket pintu masuk acara waktu-nyata untuk memverifikasi keaslian tiket, mendeteksi tiket ganda/sudah terpakai, dan konfirmasi *check-in*.

### 3. 🛡️ Panel Administrasi (Admin)
- **Ringkasan Platform (`/admin`):** Pantauan total pengguna, acara beredar, pesanan terkonfirmasi, dan GMV (*Gross Merchandise Value*).
- **Moderasi Acara (`/admin/events`):** Persetujuan tayang (*Approve*), penangguhan acara (*Draft/Suspend*), serta penyematan status unggulan (*Featured*).
- **Kelola Pengguna (`/admin/users`):** Pengawasan akun terdaftar dan pergantian hak akses peran (*Customer, Organizer, Admin*).
- **Taksonomi Kategori (`/admin/categories`):** Tambah dan atur kategori acara beserta ikon dan deskripsi.

---

## 💻 Teknologi & Library yang Digunakan

### Core Framework & Runtimes
| Teknologi | Versi | Peran & Kegunaan |
|---|---|---|
| **Next.js** | `15.1.0` (App Router) | Framework React modern untuk *server-side rendering*, optimasi rute dinamis, dan performa tinggi. |
| **React** | `19.0.0` | Library antarmuka komponen deklaratif. |
| **TypeScript** | `5.7.2` | Tipe data statis *strict mode* untuk keandalan dan pencegahan bug saat kompilasi. |
| **Node.js** | `>= 20` | Runtime environment server. |

### UI & Styling System
| Library | Peran & Kegunaan |
|---|---|
| **Tailwind CSS** | Styling berbasis utilitas dengan custom tokens (`ground`, `ink`, `accent`), display typography fluid clamps, dan animasi transisi. |
| **Lucide React** | Set ikon modern, konsisten, dan ringan (Calendar, Clock, MapPin, QrCode, Shield, dll). |
| **clsx & tailwind-merge** | Penggabungan kelas Tailwind dinamis tanpa konflik CSS. |
| **Google Fonts (DM Sans & Inter)** | Kombinasi font editorial display yang tegas dan body text berdaya baca tinggi. |

### Database, Auth & Backend Integration
| Layanan / Library | Peran & Kegunaan |
|---|---|
| **Supabase (PostgreSQL)** | Penyimpanan data relasional: `profiles`, `categories`, `events`, `ticket_types`, `orders`, `tickets`. |
| **Supabase Auth** | Autentikasi pengguna berbasis email/password dan role-based access control. |
| **Row Level Security (RLS)** | Keamanan data tingkat baris (hanya pemilik/admin yang dapat mengubah tiket dan event). |
| **QRCode Engine (`qrcode`)** | Pustaka generator QR Code lokal untuk merender SVG/Canvas QR tiket unik dengan payload terverifikasi. |
| **Midtrans & Xendit SDK Ready** | Spesifikasi kontrak pembayaran resmi untuk transaksi payment gateway Indonesia (Virtual Account, QRIS, Kartu Kredit). |

---

## 🛠️ Tools & Lingkungan Pengembangan (Development Tools)

1. **Package Manager:** `npm` (atau `pnpm` / `yarn`).
2. **Database Engine:** PostgreSQL via [Supabase Studio](https://supabase.com).
3. **QR Code Verification:** Modul encode/decode Base64 & cryptographic timestamp verifier.
4. **Code Quality:** Next.js Compiler, TypeScript Compiler (`tsc`), dan Tailwind PostCSS Autoprefixer.
5. **Testing & Sandbox:** Midtrans Sandbox Environment (`https://app.sandbox.midtrans.com/snap/v1/transactions`).

---

## 📂 Struktur Direktori Proyek

```text
platform-event-&-e-ticketing/
├── public/
│   └── images/
│       └── events/               # Aset fotografi resolusi tinggi untuk poster acara
├── src/
│   ├── app/                      # Next.js App Router Pages
│   │   ├── admin/                # Admin Panel (Overview, Events, Users, Categories)
│   │   │   ├── categories/page.tsx
│   │   │   ├── events/page.tsx
│   │   │   ├── users/page.tsx
│   │   │   └── page.tsx
│   │   ├── auth/                 # Halaman Autentikasi (Login & Register)
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/            # Organizer Dashboard & Ticket Validator
│   │   │   ├── events/           # Manajemen Event Organizer & Form Event Baru
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── scanner/page.tsx  # Gate QR Code Ticket Scanner & Check-in
│   │   │   └── page.tsx          # Dashboard Overview & Penjualan
│   │   ├── events/               # Event Discovery & Checkout Flow
│   │   │   ├── [id]/
│   │   │   │   ├── booking/page.tsx  # Alur Pemesanan 3 Langkah
│   │   │   │   └── page.tsx          # Detail Acara Sinematik
│   │   │   └── page.tsx          # Katalog Filter Acara
│   │   ├── profile/page.tsx      # Profil Pengguna & Demo Role Switcher
│   │   ├── tickets/              # E-Ticket Digital & Riwayat Tiket
│   │   │   ├── [id]/page.tsx     # E-Ticket dengan QR Code Scannable & Cetak
│   │   │   └── page.tsx          # Daftar Tiket Pengguna
│   │   ├── globals.css           # Styling dasar, animasi, dan reset
│   │   ├── layout.tsx            # Root layout, font loader, dan AuthProvider
│   │   └── page.tsx              # Homepage Editorial
│   ├── components/               # Komponen UI Reusable
│   │   ├── admin/admin-nav.tsx
│   │   ├── dashboard/dashboard-nav.tsx
│   │   ├── layout/navbar.tsx     # Navigasi utama adaptif desktop & mobile
│   │   ├── layout/footer.tsx     # Footer editorial
│   │   └── ui/                   # Tombol, input, select, badge, modal, search bar
│   ├── lib/
│   │   ├── auth-context.tsx      # Manajemen state autentikasi & role switching
│   │   ├── mock-data.ts          # Dataset acara realistis Indonesia, tiket, kategori
│   │   ├── payment.ts            # Kontrak integrasi resmi Payment Gateway Midtrans & Xendit
│   │   ├── supabase.ts           # Client Supabase
│   │   └── utils.ts              # Generator kode tiket, QR payload, format rupiah & tanggal
│   └── types/                    # TypeScript Interfaces & Domain Models
├── supabase/
│   └── schema.sql                # Skema lengkap PostgreSQL, RLS Policies & Triggers
├── .env.example                  # Panduan variabel lingkungan
├── next.config.js                # Konfigurasi Next.js
├── tailwind.config.js            # Konfigurasi tema dan skala desain
├── tsconfig.json                 # Konfigurasi TypeScript
└── README.md                     # Dokumentasi Proyek
```

---

## ⚡ Panduan Instalasi & Menjalankan

### 1. Kloning Repositori
```bash
git clone https://github.com/username/platform-event-e-ticketing.git
cd platform-event-e-ticketing
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables (Opsional untuk Supabase & Payment)
Salin `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Isi variabel dengan kredensial project Anda jika menghubungkan ke Supabase langsung:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxx
```
*(Catatan: Aplikasi telah dilengkapi dataset mock dan simulasi bawaan sehingga dapat langsung dijalankan tanpa setup database eksternal terlebih dahulu).*

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban di `http://localhost:3000`.

### 5. Menjalankan Build Produksi
```bash
npm run build
npm start
```

---

## 🔐 Akun & Peran Pengujian (Demo Accounts)

Untuk mempermudah pengujian seluruh alur sistem:
| Peran | Akun Email | Password | Akses Fitur |
|---|---|---|---|
| **Peserta (User)** | `andi@example.com` | *password bebas* | Pemesanan tiket, riwayat tiket, e-ticket QR. |
| **Penyelenggara (Organizer)** | `organizer@soundwave.id` | *password bebas* | Buat event baru, kelola kuota, pantau omset, gate QR scanner. |
| **Administrator (Admin)** | `admin@eventku.id` | *password bebas* | Moderasi event, ubah peran pengguna, kelola kategori platform. |

> 💡 **Tips Pengujian Instan:** Kunjungi halaman **[`/profile`](http://localhost:3000/profile)** setelah login untuk mencoba fitur **Demo Role Switcher** yang memungkinkan pergantian peran (Customer ↔ Organizer ↔ Admin) dalam satu kali klik.

---

## 📜 Lisensi & Kontribusi
Proyek ini dibuat untuk keperluan portofolio platform event discovery dan e-ticketing modern. Bebas dimodifikasi dan dikembangkan untuk kebutuhan komersial maupun pembelajaran.
