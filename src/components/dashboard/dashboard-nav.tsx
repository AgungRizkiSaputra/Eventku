'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, PlusCircle, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardNav() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Ringkasan', icon: LayoutDashboard },
    { href: '/dashboard/events', label: 'Kelola Event', icon: Calendar },
    { href: '/dashboard/events/new', label: 'Buat Event', icon: PlusCircle },
    { href: '/dashboard/scanner', label: 'Validasi Tiket (QR)', icon: QrCode },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-ground-subtle pb-4 mb-8 overflow-x-auto">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-body-sm font-medium whitespace-nowrap transition-colors',
              isActive
                ? 'bg-ink text-ground'
                : 'text-ink-muted hover:text-ink hover:bg-ground-muted',
            )}
          >
            <Icon className="w-4 h-4" />
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

