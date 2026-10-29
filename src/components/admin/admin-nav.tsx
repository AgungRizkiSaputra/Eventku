'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, CalendarCheck, Users, Tags } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Ringkasan Platform', icon: Shield },
    { href: '/admin/events', label: 'Moderasi Event', icon: CalendarCheck },
    { href: '/admin/users', label: 'Kelola Pengguna', icon: Users },
    { href: '/admin/categories', label: 'Kategori Acara', icon: Tags },
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

