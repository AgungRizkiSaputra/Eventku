import Link from 'next/link';
import { CATEGORIES } from '@/lib/mock-data';

export function Footer() {
  return (
    <footer className="bg-ground-dark text-ground">
      <div className="page-padding max-w-wide mx-auto py-section-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="font-display font-bold text-display-md tracking-tight">
              EVENTKU
            </Link>
            <p className="text-body text-ground/60 mt-4 max-w-xs">
              Platform event discovery dan e-ticketing untuk konser, festival, seminar, workshop, dan konferensi di seluruh Indonesia.
            </p>
          </div>

          {/* Platform links */}
          <div className="md:col-span-2 md:col-start-6">
            <h3 className="text-body font-medium mb-4">Platform</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/events" className="text-body-sm text-ground/60 hover:text-ground transition-colors">Jelajahi Event</Link></li>
              <li><Link href="/auth/register" className="text-body-sm text-ground/60 hover:text-ground transition-colors">Buat Event</Link></li>
              <li><Link href="/tickets" className="text-body-sm text-ground/60 hover:text-ground transition-colors">Tiket Saya</Link></li>
            </ul>
          </div>

          {/* Kategori */}
          <div className="md:col-span-3">
            <h3 className="text-body font-medium mb-4">Kategori</h3>
            <ul className="flex flex-col gap-3">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/events?category=${cat.id}`}
                    className="text-body-sm text-ground/60 hover:text-ground transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h3 className="text-body font-medium mb-4">Dukungan</h3>
            <ul className="flex flex-col gap-3">
              <li><span className="text-body-sm text-ground/60">Bantuan</span></li>
              <li><span className="text-body-sm text-ground/60">Syarat & Ketentuan</span></li>
              <li><span className="text-body-sm text-ground/60">Kebijakan Privasi</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-6 border-t border-ground/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-caption text-ground/40">
            © 2027 Eventku. Seluruh hak dilindungi.
          </p>
          <p className="text-caption text-ground/40">
            Dibuat di Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}

