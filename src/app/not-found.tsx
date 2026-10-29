import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center page-padding text-center">
      <div className="max-w-md">
        <span className="text-display-lg font-display font-bold text-accent block">404</span>
        <h1 className="font-display font-bold text-display-sm text-ink mt-2">Halaman Tidak Ditemukan</h1>
        <p className="text-body text-ink-muted mt-3">
          Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button>Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

