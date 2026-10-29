import { Category, Event, TicketType, User, Order, Ticket, OrderItem } from '@/types';

// ─── Categories ────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Konser', slug: 'konser', description: 'Konser musik dari berbagai genre', icon: '🎵' },
  { id: 'cat-2', name: 'Festival', slug: 'festival', description: 'Festival seni, budaya, dan musik', icon: '🎪' },
  { id: 'cat-3', name: 'Seminar', slug: 'seminar', description: 'Seminar dan diskusi panel', icon: '🎤' },
  { id: 'cat-4', name: 'Workshop', slug: 'workshop', description: 'Workshop dan pelatihan praktis', icon: '🛠' },
  { id: 'cat-5', name: 'Konferensi', slug: 'konferensi', description: 'Konferensi industri dan teknologi', icon: '📡' },
  { id: 'cat-6', name: 'Pameran', slug: 'pameran', description: 'Pameran seni dan produk', icon: '🖼' },
  { id: 'cat-7', name: 'Olahraga', slug: 'olahraga', description: 'Event olahraga dan kompetisi', icon: '⚽' },
  { id: 'cat-8', name: 'Komunitas', slug: 'komunitas', description: 'Meetup dan acara komunitas', icon: '👥' },
];

export const CITIES = [
  'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali',
  'Semarang', 'Malang', 'Medan', 'Makassar', 'Solo',
];

// ─── Users ─────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'andi@example.com',
    full_name: 'Andi Pratama',
    role: 'user',
    phone: '081234567890',
    created_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 'org-1',
    email: 'organizer@soundwave.id',
    full_name: 'Soundwave Productions',
    role: 'organizer',
    phone: '082198765432',
    created_at: '2023-06-01T08:00:00Z',
  },
  {
    id: 'org-2',
    email: 'hello@techinasia.co',
    full_name: 'Tech In Asia',
    role: 'organizer',
    phone: '081377889900',
    created_at: '2023-03-10T08:00:00Z',
  },
  {
    id: 'admin-1',
    email: 'admin@eventku.id',
    full_name: 'Admin Eventku',
    role: 'admin',
    created_at: '2023-01-01T08:00:00Z',
  },
];

// ─── Events ────────────────────────────────────────────────
export const MOCK_EVENTS: Event[] = [
  {
    id: 'evt-1',
    title: 'Nusantara Sound Festival 2027',
    slug: 'nusantara-sound-festival-2027',
    description: `Nusantara Sound Festival kembali hadir untuk edisi ketiga. Festival musik terbesar di Asia Tenggara yang menghadirkan lebih dari 60 artis dari seluruh dunia dalam tiga panggung megah selama tiga hari.

Tahun ini, festival mengusung tema "Roots & Futures" — menggabungkan musik tradisional Nusantara dengan sound elektronik kontemporer. Dari gamelan yang bertemu synthesizer, hingga dangdut yang berkolaborasi dengan techno Berlin.

Lineup utama mencakup nama-nama besar dari kancah lokal dan internasional. Area festival dilengkapi dengan zona kuliner yang menghadirkan 40 tenant makanan dari berbagai daerah, area seni instalasi, dan camping ground untuk pengalaman festival yang lengkap.

Festival berlangsung di Garuda Wisnu Kencana Cultural Park, Bali — latar panggung yang megah dengan patung GWK sebagai backdrop ikonik.`,
    short_description: 'Festival musik terbesar Asia Tenggara. 60+ artis, 3 panggung, 3 hari. Tema "Roots & Futures" menggabungkan tradisi dan elektronik.',
    category_id: 'cat-2',
    organizer_id: 'org-1',
    poster_url: '/images/events/nusantara-sound.jpg',
    venue_name: 'Garuda Wisnu Kencana Cultural Park',
    venue_address: 'Jl. Raya Uluwatu, Ungasan',
    city: 'Bali',
    start_date: '2027-03-14',
    end_date: '2027-03-16',
    start_time: '14:00',
    end_time: '23:00',
    timezone: 'Asia/Makassar',
    status: 'published',
    is_featured: true,
    tags: ['musik', 'festival', 'outdoor', 'elektronik', 'tradisional'],
    created_at: '2026-09-01T08:00:00Z',
    updated_at: '2026-10-20T08:00:00Z',
  },
  {
    id: 'evt-2',
    title: 'Jakarta International Jazz Festival',
    slug: 'jakarta-international-jazz-festival',
    description: `Jakarta International Jazz Festival (JakJazz) adalah perayaan jazz terbesar di Indonesia yang telah memasuki tahun ke-12. Festival ini mempertemukan musisi jazz papan atas dari Lima benua dalam satu panggung spektakuler.

Tahun ini menghadirkan 45 pertunjukan di empat panggung berbeda. Dari smooth jazz yang menenangkan hingga experimental jazz yang menantang batas, setiap penonton akan menemukan sesuatu yang istimewa.

Venue: Jakarta International Expo menawarkan pengalaman indoor yang nyaman dengan akustik kelas dunia. Area lounge eksklusif tersedia untuk pemegang tiket VIP dan VVIP.`,
    short_description: 'Perayaan jazz terbesar Indonesia. 45 pertunjukan, 4 panggung, musisi dari 5 benua. Indoor di JIExpo.',
    category_id: 'cat-1',
    organizer_id: 'org-1',
    poster_url: '/images/events/jakjazz.jpg',
    venue_name: 'Jakarta International Expo (JIExpo)',
    venue_address: 'Jl. Haji Agus Salim, Kemayoran',
    city: 'Jakarta',
    start_date: '2027-02-20',
    end_date: '2027-02-22',
    start_time: '16:00',
    end_time: '23:30',
    timezone: 'Asia/Jakarta',
    status: 'published',
    is_featured: true,
    tags: ['jazz', 'musik', 'internasional', 'indoor'],
    created_at: '2026-08-15T08:00:00Z',
    updated_at: '2026-10-18T08:00:00Z',
  },
  {
    id: 'evt-3',
    title: 'Tech Summit Indonesia 2027',
    slug: 'tech-summit-indonesia-2027',
    description: `Tech Summit Indonesia adalah konferensi teknologi premier yang mempertemukan lebih dari 3.000 profesional teknologi, startup founder, dan investor dari seluruh Asia Tenggara.

Dua hari penuh dengan keynote dari pemimpin industri, panel diskusi mendalam tentang AI, blockchain, fintech, dan green tech. Ditambah startup showcase yang mempertemukan 50 startup terpilih dengan investor ternama.

Networking dinner eksklusif untuk pemegang tiket Executive memberikan akses langsung ke pembicara dan investor.`,
    short_description: 'Konferensi teknologi premier Asia Tenggara. 3.000+ peserta, keynote dari pemimpin industri, startup showcase.',
    category_id: 'cat-5',
    organizer_id: 'org-2',
    poster_url: '/images/events/tech-summit.jpg',
    venue_name: 'The Ritz-Carlton Pacific Place',
    venue_address: 'Jl. Jend. Sudirman Kav. 52-53, SCBD',
    city: 'Jakarta',
    start_date: '2027-04-10',
    end_date: '2027-04-11',
    start_time: '08:30',
    end_time: '18:00',
    timezone: 'Asia/Jakarta',
    status: 'published',
    is_featured: true,
    tags: ['teknologi', 'startup', 'AI', 'konferensi'],
    created_at: '2026-10-01T08:00:00Z',
    updated_at: '2026-10-25T08:00:00Z',
  },
  {
    id: 'evt-4',
    title: 'Workshop Fotografi Jalanan',
    slug: 'workshop-fotografi-jalanan',
    description: `Belajar seni street photography langsung dari fotografer pemenang World Press Photo. Workshop intensif dua hari ini akan membawa peserta menjelajahi gang-gang Yogyakarta sambil belajar teknik komposisi, pencahayaan alami, dan storytelling visual.

Hari pertama: teori dan review portfolio. Hari kedua: photo walk di Malioboro, Prawirotaman, dan Kotagede, diakhiri review bersama.

Peserta dibatasi 20 orang untuk memastikan pembelajaran yang personal. Kamera apapun diterima — dari DSLR hingga smartphone.`,
    short_description: 'Street photography intensif di Yogyakarta. 2 hari bersama fotografer World Press Photo. Maks 20 peserta.',
    category_id: 'cat-4',
    organizer_id: 'org-2',
    poster_url: '/images/events/street-photo.jpg',
    venue_name: 'Rumah Budaya Tembi',
    venue_address: 'Jl. Parangtritis Km 8.4, Tembi',
    city: 'Yogyakarta',
    start_date: '2027-01-25',
    end_date: '2027-01-26',
    start_time: '09:00',
    end_time: '17:00',
    timezone: 'Asia/Jakarta',
    status: 'published',
    is_featured: false,
    tags: ['fotografi', 'workshop', 'seni', 'street-photography'],
    created_at: '2026-10-05T08:00:00Z',
    updated_at: '2026-10-22T08:00:00Z',
  },
  {
    id: 'evt-5',
    title: 'Bandung Design Week 2027',
    slug: 'bandung-design-week-2027',
    description: `Bandung Design Week adalah festival desain tahunan terbesar di Indonesia yang mempertemukan desainer grafis, interior, fashion, dan produk dari seluruh Nusantara.

Selama lima hari, nikmati pameran dari 120 desainer dan studio, talk series dari tokoh desain dunia, workshop hands-on, dan design market. Tahun ini mengusung tema "Design for Tomorrow" — bagaimana desain bisa menjawab tantangan keberlanjutan.

Lokasi tersebar di beberapa venue ikonik di Bandung: Gedung Sate (pameran utama), Braga (design market), dan Selasar Sunaryo (instalasi seni).`,
    short_description: 'Festival desain terbesar Indonesia. 120 desainer, pameran, talks, workshop, design market. 5 hari di Bandung.',
    category_id: 'cat-6',
    organizer_id: 'org-2',
    poster_url: '/images/events/bdg-design.jpg',
    venue_name: 'Gedung Sate & Multi-venue',
    venue_address: 'Jl. Diponegoro No. 22',
    city: 'Bandung',
    start_date: '2027-05-05',
    end_date: '2027-05-09',
    start_time: '10:00',
    end_time: '21:00',
    timezone: 'Asia/Jakarta',
    status: 'published',
    is_featured: true,
    tags: ['desain', 'pameran', 'seni', 'kreatif'],
    created_at: '2026-09-20T08:00:00Z',
    updated_at: '2026-10-24T08:00:00Z',
  },
  {
    id: 'evt-6',
    title: 'Seminar Keuangan Digital',
    slug: 'seminar-keuangan-digital',
    description: `Seminar satu hari yang membahas transformasi lanskap keuangan Indonesia. Dari e-wallet hingga DeFi, dari neobank hingga embedded finance — pahami tren yang mengubah cara Indonesia bertransaksi.

Pembicara mencakup CEO dari perusahaan fintech unicorn Indonesia, regulator OJK, dan akademisi ekonomi digital.

Termasuk lunch networking dan akses ke materi presentasi pasca-seminar.`,
    short_description: 'Tren keuangan digital Indonesia. Pembicara dari fintech unicorn dan OJK. Termasuk lunch networking.',
    category_id: 'cat-3',
    organizer_id: 'org-2',
    poster_url: '/images/events/fintech-seminar.jpg',
    venue_name: 'Fairmont Jakarta',
    venue_address: 'Jl. Asia Afrika No. 8, Senayan',
    city: 'Jakarta',
    start_date: '2027-02-05',
    end_date: '2027-02-05',
    start_time: '09:00',
    end_time: '16:00',
    timezone: 'Asia/Jakarta',
    status: 'published',
    is_featured: false,
    tags: ['fintech', 'keuangan', 'digital', 'seminar'],
    created_at: '2026-10-10T08:00:00Z',
    updated_at: '2026-10-20T08:00:00Z',
  },
  {
    id: 'evt-7',
    title: 'Surabaya Marathon 2027',
    slug: 'surabaya-marathon-2027',
    description: `Surabaya Marathon memasuki tahun ke-8 sebagai ajang lari terbesar di Jawa Timur. Rute melewati landmark ikonik kota pahlawan: Tugu Pahlawan, Jembatan Suramadu, dan pesisir Kenjeran.

Kategori: Full Marathon (42K), Half Marathon (21K), 10K Fun Run, dan 5K Family Run. Setiap finisher mendapatkan medali eksklusif dan sertifikat digital.

Total hadiah untuk pemenang kategori elite mencapai Rp 500 juta. Early bird registration dibuka hingga 31 Desember 2026.`,
    short_description: 'Marathon terbesar Jawa Timur. 4 kategori, rute ikonik Surabaya, total hadiah Rp 500 juta.',
    category_id: 'cat-7',
    organizer_id: 'org-1',
    poster_url: '/images/events/sby-marathon.jpg',
    venue_name: 'Tugu Pahlawan (Start/Finish)',
    venue_address: 'Jl. Pahlawan, Alun-alun Contong',
    city: 'Surabaya',
    start_date: '2027-06-15',
    end_date: '2027-06-15',
    start_time: '05:00',
    end_time: '12:00',
    timezone: 'Asia/Jakarta',
    status: 'published',
    is_featured: false,
    tags: ['marathon', 'lari', 'olahraga', 'outdoor'],
    created_at: '2026-09-15T08:00:00Z',
    updated_at: '2026-10-21T08:00:00Z',
  },
  {
    id: 'evt-8',
    title: 'Ubud Writers & Readers Festival',
    slug: 'ubud-writers-readers-festival',
    description: `Festival sastra paling bergengsi di Asia Tenggara. Selama empat hari, Ubud menjadi titik temu bagi penulis, penyair, jurnalis, dan pembaca dari 30 negara.

Program meliputi panel diskusi, pembacaan puisi, peluncuran buku, workshop penulisan kreatif, dan pertunjukan seni. Tema tahun ini: "Words That Move Worlds" — kekuatan kata dalam menggerakkan perubahan sosial.

Venue utama di Indus Restaurant dan beberapa lokasi budaya di Ubud, dikelilingi sawah dan hutan tropis.`,
    short_description: 'Festival sastra premier Asia Tenggara. 4 hari di Ubud, penulis dari 30 negara, diskusi, dan workshop.',
    category_id: 'cat-2',
    organizer_id: 'org-1',
    poster_url: '/images/events/ubud-writers.jpg',
    venue_name: 'Indus Restaurant & Multi-venue Ubud',
    venue_address: 'Jl. Raya Sanggingan, Ubud',
    city: 'Bali',
    start_date: '2027-07-10',
    end_date: '2027-07-13',
    start_time: '09:00',
    end_time: '21:00',
    timezone: 'Asia/Makassar',
    status: 'published',
    is_featured: false,
    tags: ['sastra', 'festival', 'penulisan', 'budaya'],
    created_at: '2026-10-12T08:00:00Z',
    updated_at: '2026-10-26T08:00:00Z',
  },
  {
    id: 'evt-9',
    title: 'Malang Creative Meetup',
    slug: 'malang-creative-meetup',
    description: `Meetup bulanan komunitas kreatif Malang. Bulan ini membahas "Building in Public" — bagaimana membagikan proses kreatif secara terbuka untuk membangun audiens dan kredibilitas.

Tiga pembicara dari kalangan ilustrator, content creator, dan indie game developer berbagi pengalaman mereka. Diikuti sesi networking dan open mic.

Gratis dan terbuka untuk umum. Kapasitas terbatas 80 orang.`,
    short_description: 'Meetup komunitas kreatif Malang. Tema: Building in Public. 3 pembicara, networking, open mic. Gratis.',
    category_id: 'cat-8',
    organizer_id: 'org-2',
    poster_url: '/images/events/malang-creative.jpg',
    venue_name: 'Kopi Cak Wang',
    venue_address: 'Jl. Tugu No. 1, Klojen',
    city: 'Malang',
    start_date: '2027-01-18',
    end_date: '2027-01-18',
    start_time: '14:00',
    end_time: '17:00',
    timezone: 'Asia/Jakarta',
    status: 'published',
    is_featured: false,
    tags: ['komunitas', 'kreatif', 'meetup', 'gratis'],
    created_at: '2026-10-15T08:00:00Z',
    updated_at: '2026-10-27T08:00:00Z',
  },
  {
    id: 'evt-10',
    title: 'Solo Batik Carnival 2027',
    slug: 'solo-batik-carnival-2027',
    description: `Solo Batik Carnival adalah perayaan warisan budaya batik Indonesia dalam format karnaval kontemporer. Lebih dari 1.000 peserta mengenakan kostum batik spektakuler, menari menyusuri jalan-jalan bersejarah kota Solo.

Selain karnaval utama, acara ini menghadirkan pameran batik dari 50 perajin, fashion show batik kontemporer, workshop membatik untuk pemula, dan bazaar produk batik.

Puncak acara: Parade malam dengan kostum batik LED yang menakjubkan, diakhiri konser musik tradisional di Alun-alun Utara Keraton Surakarta.`,
    short_description: 'Karnaval batik terbesar Indonesia. 1.000+ peserta, pameran 50 perajin, fashion show, workshop membatik.',
    category_id: 'cat-2',
    organizer_id: 'org-1',
    poster_url: '/images/events/solo-batik.jpg',
    venue_name: 'Jl. Slamet Riyadi & Keraton Surakarta',
    venue_address: 'Jl. Slamet Riyadi, Laweyan',
    city: 'Solo',
    start_date: '2027-08-20',
    end_date: '2027-08-22',
    start_time: '08:00',
    end_time: '22:00',
    timezone: 'Asia/Jakarta',
    status: 'published',
    is_featured: true,
    tags: ['batik', 'karnaval', 'budaya', 'fashion'],
    created_at: '2026-09-25T08:00:00Z',
    updated_at: '2026-10-23T08:00:00Z',
  },
];

// ─── Ticket Types ──────────────────────────────────────────
export const MOCK_TICKET_TYPES: TicketType[] = [
  // Nusantara Sound Festival
  { id: 'tt-1', event_id: 'evt-1', name: 'Daily Pass', description: 'Akses 1 hari ke semua panggung', price: 450000, currency: 'IDR', quota: 5000, sold: 3200, max_per_order: 5, sale_start: '2026-10-01', sale_end: '2027-03-13', status: 'available' },
  { id: 'tt-2', event_id: 'evt-1', name: '3-Day Pass', description: 'Akses penuh 3 hari ke semua panggung', price: 1100000, currency: 'IDR', quota: 3000, sold: 2100, max_per_order: 4, sale_start: '2026-10-01', sale_end: '2027-03-13', status: 'available' },
  { id: 'tt-3', event_id: 'evt-1', name: 'VIP 3-Day', description: 'Akses VIP 3 hari: area eksklusif, welcome drink, fast lane', price: 2500000, currency: 'IDR', quota: 500, sold: 480, max_per_order: 2, sale_start: '2026-10-01', sale_end: '2027-03-13', status: 'available' },

  // JakJazz
  { id: 'tt-4', event_id: 'evt-2', name: 'Regular', description: 'Akses ke semua panggung per hari', price: 350000, currency: 'IDR', quota: 4000, sold: 2800, max_per_order: 6, sale_start: '2026-09-01', sale_end: '2027-02-19', status: 'available' },
  { id: 'tt-5', event_id: 'evt-2', name: 'Festival Pass', description: 'Akses 3 hari penuh', price: 850000, currency: 'IDR', quota: 2000, sold: 1500, max_per_order: 4, sale_start: '2026-09-01', sale_end: '2027-02-19', status: 'available' },
  { id: 'tt-6', event_id: 'evt-2', name: 'VIP Lounge', description: 'Akses VIP lounge, welcome cocktail, meet & greet', price: 2000000, currency: 'IDR', quota: 200, sold: 200, max_per_order: 2, sale_start: '2026-09-01', sale_end: '2027-02-19', status: 'sold_out' },

  // Tech Summit
  { id: 'tt-7', event_id: 'evt-3', name: 'General', description: 'Akses semua sesi keynote dan panel', price: 1500000, currency: 'IDR', quota: 2000, sold: 1200, max_per_order: 5, sale_start: '2026-11-01', sale_end: '2027-04-09', status: 'available' },
  { id: 'tt-8', event_id: 'evt-3', name: 'Startup', description: 'Akses semua sesi + startup showcase booth', price: 3500000, currency: 'IDR', quota: 50, sold: 35, max_per_order: 1, sale_start: '2026-11-01', sale_end: '2027-04-09', status: 'available' },
  { id: 'tt-9', event_id: 'evt-3', name: 'Executive', description: 'Akses semua sesi + networking dinner + 1-on-1 investor meeting', price: 7500000, currency: 'IDR', quota: 100, sold: 72, max_per_order: 2, sale_start: '2026-11-01', sale_end: '2027-04-09', status: 'available' },

  // Workshop Fotografi
  { id: 'tt-10', event_id: 'evt-4', name: 'Peserta', description: 'Akses workshop 2 hari, materi, sertifikat', price: 1200000, currency: 'IDR', quota: 20, sold: 14, max_per_order: 2, sale_start: '2026-10-15', sale_end: '2027-01-24', status: 'available' },

  // Bandung Design Week
  { id: 'tt-11', event_id: 'evt-5', name: 'Day Pass', description: 'Akses 1 hari ke pameran dan talks', price: 75000, currency: 'IDR', quota: 3000, sold: 800, max_per_order: 8, sale_start: '2026-12-01', sale_end: '2027-05-08', status: 'available' },
  { id: 'tt-12', event_id: 'evt-5', name: 'Full Pass', description: 'Akses 5 hari + workshop + design market', price: 250000, currency: 'IDR', quota: 1500, sold: 600, max_per_order: 4, sale_start: '2026-12-01', sale_end: '2027-05-08', status: 'available' },

  // Seminar Fintech
  { id: 'tt-13', event_id: 'evt-6', name: 'Reguler', description: 'Akses seminar, lunch, materi', price: 500000, currency: 'IDR', quota: 500, sold: 280, max_per_order: 5, sale_start: '2026-11-01', sale_end: '2027-02-04', status: 'available' },
  { id: 'tt-14', event_id: 'evt-6', name: 'Mahasiswa', description: 'Akses seminar, lunch (tunjukkan KTM)', price: 200000, currency: 'IDR', quota: 100, sold: 65, max_per_order: 3, sale_start: '2026-11-01', sale_end: '2027-02-04', status: 'available' },

  // Surabaya Marathon
  { id: 'tt-15', event_id: 'evt-7', name: 'Full Marathon 42K', description: 'Kategori 42K, race pack, medali finisher', price: 400000, currency: 'IDR', quota: 3000, sold: 1800, max_per_order: 1, sale_start: '2026-10-01', sale_end: '2027-06-01', status: 'available' },
  { id: 'tt-16', event_id: 'evt-7', name: 'Half Marathon 21K', description: 'Kategori 21K, race pack, medali finisher', price: 300000, currency: 'IDR', quota: 5000, sold: 3200, max_per_order: 1, sale_start: '2026-10-01', sale_end: '2027-06-01', status: 'available' },
  { id: 'tt-17', event_id: 'evt-7', name: '10K Fun Run', description: 'Kategori 10K, race pack', price: 200000, currency: 'IDR', quota: 5000, sold: 2500, max_per_order: 3, sale_start: '2026-10-01', sale_end: '2027-06-01', status: 'available' },
  { id: 'tt-18', event_id: 'evt-7', name: '5K Family Run', description: 'Kategori 5K, race pack, untuk keluarga', price: 150000, currency: 'IDR', quota: 3000, sold: 1500, max_per_order: 5, sale_start: '2026-10-01', sale_end: '2027-06-01', status: 'available' },

  // Ubud Writers
  { id: 'tt-19', event_id: 'evt-8', name: 'Festival Pass', description: 'Akses 4 hari semua sesi dan workshop', price: 600000, currency: 'IDR', quota: 1000, sold: 450, max_per_order: 4, sale_start: '2026-12-01', sale_end: '2027-07-09', status: 'available' },
  { id: 'tt-20', event_id: 'evt-8', name: 'Single Session', description: 'Akses 1 sesi pilihan', price: 100000, currency: 'IDR', quota: 500, sold: 200, max_per_order: 10, sale_start: '2026-12-01', sale_end: '2027-07-09', status: 'available' },

  // Malang Creative (free)
  { id: 'tt-21', event_id: 'evt-9', name: 'Free Admission', description: 'Gratis, reservasi tempat', price: 0, currency: 'IDR', quota: 80, sold: 52, max_per_order: 2, sale_start: '2026-12-01', sale_end: '2027-01-17', status: 'available' },

  // Solo Batik Carnival
  { id: 'tt-22', event_id: 'evt-10', name: 'Penonton', description: 'Akses area penonton karnaval dan pameran', price: 50000, currency: 'IDR', quota: 10000, sold: 4500, max_per_order: 10, sale_start: '2026-12-01', sale_end: '2027-08-21', status: 'available' },
  { id: 'tt-23', event_id: 'evt-10', name: 'VIP Tribune', description: 'Tempat duduk tribune VIP + welcome kit', price: 250000, currency: 'IDR', quota: 500, sold: 180, max_per_order: 4, sale_start: '2026-12-01', sale_end: '2027-08-21', status: 'available' },
  { id: 'tt-24', event_id: 'evt-10', name: 'Workshop Membatik', description: 'Sesi workshop membatik 3 jam + bahan', price: 150000, currency: 'IDR', quota: 40, sold: 28, max_per_order: 2, sale_start: '2026-12-01', sale_end: '2027-08-21', status: 'available' },
];

// ─── Sample orders and tickets for logged in user ──────────
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1',
    order_code: 'EVT-X7K2M9PL',
    user_id: 'user-1',
    event_id: 'evt-1',
    total_amount: 2200000,
    currency: 'IDR',
    status: 'paid',
    payment_method: 'bank_transfer',
    paid_at: '2026-10-20T10:30:00Z',
    expires_at: '2026-10-20T11:00:00Z',
    created_at: '2026-10-20T10:00:00Z',
  },
  {
    id: 'ord-2',
    order_code: 'EVT-A3B5N8YQ',
    user_id: 'user-1',
    event_id: 'evt-4',
    total_amount: 1200000,
    currency: 'IDR',
    status: 'paid',
    payment_method: 'e_wallet',
    paid_at: '2026-10-22T14:15:00Z',
    expires_at: '2026-10-22T15:00:00Z',
    created_at: '2026-10-22T14:00:00Z',
  },
];

export const MOCK_ORDER_ITEMS: OrderItem[] = [
  { id: 'oi-1', order_id: 'ord-1', ticket_type_id: 'tt-2', quantity: 2, unit_price: 1100000, subtotal: 2200000 },
  { id: 'oi-2', order_id: 'ord-2', ticket_type_id: 'tt-10', quantity: 1, unit_price: 1200000, subtotal: 1200000 },
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'tix-1',
    order_id: 'ord-1',
    order_item_id: 'oi-1',
    ticket_type_id: 'tt-2',
    event_id: 'evt-1',
    user_id: 'user-1',
    attendee_name: 'Andi Pratama',
    attendee_email: 'andi@example.com',
    ticket_code: 'TIX-N5F7A2K9B3',
    qr_data: 'eyJjb2RlIjoiVElYLU41RjdBMks5QjMiLCJldmVudCI6ImV2dC0xIiwidHMiOjE3Mjk0MTgyMDAwMDAsInYiOjF9',
    status: 'valid',
    created_at: '2026-10-20T10:30:00Z',
  },
  {
    id: 'tix-2',
    order_id: 'ord-1',
    order_item_id: 'oi-1',
    ticket_type_id: 'tt-2',
    event_id: 'evt-1',
    user_id: 'user-1',
    attendee_name: 'Rina Wulandari',
    attendee_email: 'rina@example.com',
    ticket_code: 'TIX-M8H3J6P4W2',
    qr_data: 'eyJjb2RlIjoiVElYLU04SDNKUVA0VzIiLCJldmVudCI6ImV2dC0xIiwidHMiOjE3Mjk0MTgyMDAwMDAsInYiOjF9',
    status: 'valid',
    created_at: '2026-10-20T10:30:00Z',
  },
  {
    id: 'tix-3',
    order_id: 'ord-2',
    order_item_id: 'oi-2',
    ticket_type_id: 'tt-10',
    event_id: 'evt-4',
    user_id: 'user-1',
    attendee_name: 'Andi Pratama',
    attendee_email: 'andi@example.com',
    ticket_code: 'TIX-R4T9V6X1L8',
    qr_data: 'eyJjb2RlIjoiVElYLVI0VDlWNlgxTDgiLCJldmVudCI6ImV2dC00IiwidHMiOjE3Mjk0MTgyMDAwMDAsInYiOjF9',
    status: 'valid',
    created_at: '2026-10-22T14:15:00Z',
  },
];

// ─── Helpers ───────────────────────────────────────────────
export function getEventById(id: string): Event | undefined {
  return MOCK_EVENTS.find(e => e.id === id);
}

export function getEventBySlug(slug: string): Event | undefined {
  return MOCK_EVENTS.find(e => e.slug === slug);
}

export function getTicketTypesForEvent(eventId: string): TicketType[] {
  return MOCK_TICKET_TYPES.filter(tt => tt.event_id === eventId);
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(c => c.id === id);
}

export function getOrganizerById(id: string): User | undefined {
  return MOCK_USERS.find(u => u.id === id);
}

export function getOrdersForUser(userId: string): Order[] {
  return MOCK_ORDERS.filter(o => o.user_id === userId);
}

export function getTicketsForUser(userId: string): Ticket[] {
  return MOCK_TICKETS.filter(t => t.user_id === userId);
}

export function getTicketsForOrder(orderId: string): Ticket[] {
  return MOCK_TICKETS.filter(t => t.order_id === orderId);
}

export function getOrderItemsForOrder(orderId: string): OrderItem[] {
  return MOCK_ORDER_ITEMS.filter(oi => oi.order_id === orderId);
}

export function getEventWithDetails(eventId: string) {
  const event = getEventById(eventId);
  if (!event) return null;

  const category = getCategoryById(event.category_id);
  const organizer = getOrganizerById(event.organizer_id);
  const ticket_types = getTicketTypesForEvent(event.id);

  return {
    ...event,
    category: category!,
    organizer: organizer!,
    ticket_types,
    total_tickets: ticket_types.reduce((sum, tt) => sum + tt.quota, 0),
    tickets_sold: ticket_types.reduce((sum, tt) => sum + tt.sold, 0),
  };
}

export function searchEvents(filters: {
  search?: string;
  category?: string;
  city?: string;
  date_from?: string;
  date_to?: string;
  price_min?: number;
  price_max?: number;
  sort?: string;
}): Event[] {
  let results = [...MOCK_EVENTS].filter(e => e.status === 'published');

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.short_description.toLowerCase().includes(q) ||
      e.venue_name.toLowerCase().includes(q) ||
      e.city.toLowerCase().includes(q)
    );
  }

  if (filters.category) {
    results = results.filter(e => e.category_id === filters.category);
  }

  if (filters.city) {
    results = results.filter(e => e.city === filters.city);
  }

  if (filters.date_from) {
    results = results.filter(e => e.start_date >= filters.date_from!);
  }

  if (filters.date_to) {
    results = results.filter(e => e.start_date <= filters.date_to!);
  }

  if (filters.price_min !== undefined || filters.price_max !== undefined) {
    results = results.filter(e => {
      const tts = getTicketTypesForEvent(e.id);
      const minPrice = Math.min(...tts.map(t => t.price));
      if (filters.price_min !== undefined && minPrice < filters.price_min) return false;
      if (filters.price_max !== undefined && minPrice > filters.price_max) return false;
      return true;
    });
  }

  switch (filters.sort) {
    case 'date_asc':
      results.sort((a, b) => a.start_date.localeCompare(b.start_date));
      break;
    case 'date_desc':
      results.sort((a, b) => b.start_date.localeCompare(a.start_date));
      break;
    case 'price_asc':
      results.sort((a, b) => {
        const priceA = Math.min(...getTicketTypesForEvent(a.id).map(t => t.price));
        const priceB = Math.min(...getTicketTypesForEvent(b.id).map(t => t.price));
        return priceA - priceB;
      });
      break;
    case 'price_desc':
      results.sort((a, b) => {
        const priceA = Math.min(...getTicketTypesForEvent(a.id).map(t => t.price));
        const priceB = Math.min(...getTicketTypesForEvent(b.id).map(t => t.price));
        return priceB - priceA;
      });
      break;
    default:
      results.sort((a, b) => a.start_date.localeCompare(b.start_date));
  }

  return results;
}

