'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Ticket, User as UserIcon, LayoutDashboard, LogOut, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const isDark = pathname === '/' && !scrolled;

  const navLinks = [
    { href: '/events', label: 'Jelajahi' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-ground/95 backdrop-blur-sm border-b border-ground-subtle'
          : isDark
            ? 'bg-transparent'
            : 'bg-ground',
      )}
    >
      <nav className="page-padding flex items-center justify-between h-16 md:h-20 max-w-wide mx-auto">
        <Link
          href="/"
          className={cn(
            'font-display font-bold text-xl md:text-2xl tracking-tight transition-colors',
            isDark ? 'text-ground' : 'text-ink',
          )}
        >
          EVENTKU
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-body font-medium transition-colors relative',
                isDark ? 'text-ground/80 hover:text-ground' : 'text-ink-muted hover:text-ink',
                pathname === link.href && (isDark ? 'text-ground' : 'text-ink'),
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent" />
              )}
            </Link>
          ))}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={cn(
                  'flex items-center gap-2 text-body font-medium transition-colors',
                  isDark ? 'text-ground/80 hover:text-ground' : 'text-ink-muted hover:text-ink',
                )}
              >
                <span className="w-8 h-8 bg-accent text-white flex items-center justify-center text-body-sm font-bold">
                  {user.full_name.charAt(0).toUpperCase()}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-ground border border-ground-subtle py-2 z-50">
                    <div className="px-4 py-2 border-b border-ground-subtle">
                      <p className="text-body-sm font-medium text-ink truncate">{user.full_name}</p>
                      <p className="text-caption text-ink-faint truncate">{user.email}</p>
                    </div>
                    <Link href="/tickets" className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-ink hover:bg-ground-muted transition-colors">
                      <Ticket className="w-4 h-4" /> Tiket Saya
                    </Link>
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-ink hover:bg-ground-muted transition-colors">
                      <UserIcon className="w-4 h-4" /> Profil
                    </Link>
                    {(user.role === 'organizer' || user.role === 'admin') && (
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-ink hover:bg-ground-muted transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-ink hover:bg-ground-muted transition-colors">
                        <Shield className="w-4 h-4" /> Admin
                      </Link>
                    )}
                    <div className="border-t border-ground-subtle mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-body-sm text-error hover:bg-ground-muted transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Keluar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className={cn(
                  'text-body font-medium transition-colors',
                  isDark ? 'text-ground/80 hover:text-ground' : 'text-ink-muted hover:text-ink',
                )}
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="bg-accent text-white px-5 py-2.5 text-body-sm font-medium hover:bg-accent-hover transition-colors press-scale"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>

        <button
          className={cn('md:hidden p-2', isDark ? 'text-ground' : 'text-ink')}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-ground z-30 overflow-y-auto">
          <div className="page-padding py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-display-sm font-display font-bold text-ink">
                {link.label}
              </Link>
            ))}
            <div className="border-t border-ground-subtle pt-6 mt-2">
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-10 h-10 bg-accent text-white flex items-center justify-center text-body font-bold">
                      {user.full_name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-body font-medium">{user.full_name}</p>
                      <p className="text-body-sm text-ink-muted">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/tickets" className="text-body text-ink py-2">Tiket Saya</Link>
                  <Link href="/profile" className="text-body text-ink py-2">Profil</Link>
                  {(user.role === 'organizer' || user.role === 'admin') && (
                    <Link href="/dashboard" className="text-body text-ink py-2">Dashboard</Link>
                  )}
                  {user.role === 'admin' && (
                    <Link href="/admin" className="text-body text-ink py-2">Admin</Link>
                  )}
                  <button onClick={logout} className="text-body text-error py-2 text-left">Keluar</button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/auth/login" className="text-body font-medium text-ink py-2">Masuk</Link>
                  <Link href="/auth/register" className="bg-accent text-white px-6 py-3 text-body font-medium text-center hover:bg-accent-hover transition-colors">
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
