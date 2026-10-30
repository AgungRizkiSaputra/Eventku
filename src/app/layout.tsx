import type { Metadata } from 'next';
import { Inter, DM_Sans } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { AppProvider } from '@/lib/app-context';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Eventku — Temukan Event Luar Biasa',
    template: '%s — Eventku',
  },
  description: 'Platform event discovery dan e-ticketing untuk konser, festival, seminar, workshop, dan konferensi di seluruh Indonesia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${dmSans.variable}`}>
      <body className="font-body bg-ground text-ink min-h-screen flex flex-col">
        <AuthProvider>
          <AppProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

