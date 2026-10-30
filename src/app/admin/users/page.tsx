'use client';

import { useState } from 'react';
import { AdminNav } from '@/components/admin/admin-nav';
import { useAppContext } from '@/lib/app-context';
import { useAuth } from '@/lib/auth-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';
import { formatDateShort } from '@/lib/utils';
import { Check, Shield, Briefcase, User as UserIcon } from 'lucide-react';

export default function AdminUsersPage() {
  const { users, updateUserRole } = useAppContext();
  const { user: activeUser, switchRole } = useAuth();
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleChangeRole = (userId: string, userName: string, newRole: UserRole) => {
    updateUserRole(userId, newRole);
    // If the changed user is currently the active logged-in user, synchronize session
    if (activeUser && activeUser.id === userId) {
      switchRole(newRole);
    }
    notify(`Peran pengguna "${userName}" berhasil diubah menjadi ${newRole.toUpperCase()}. Izin akses akun tersebut langsung diperbarui.`);
  };

  return (
    <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-bold text-display-md">Kelola Pengguna & Hak Akses</h1>
        <p className="text-body text-ink-muted mt-1">
          Daftar seluruh akun, kontrol peran (*Peserta, Organizer, Admin*), dan penegakan izin sistem.
        </p>
      </div>

      <AdminNav />

      {notification && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-body-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-success shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="bg-ground border border-ground-subtle overflow-hidden">
        <div className="divide-y divide-ground-subtle">
          {users.map((usr) => (
            <div
              key={usr.id}
              className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-ground-muted/20 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-ink text-ground flex items-center justify-center font-bold text-body-lg shrink-0">
                  {usr.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-body text-ink">{usr.full_name}</h3>
                    <Badge
                      variant={
                        usr.role === 'admin'
                          ? 'accent'
                          : usr.role === 'organizer'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {usr.role.toUpperCase()}
                    </Badge>
                    {activeUser?.id === usr.id && (
                      <span className="text-[10px] bg-accent text-white px-2 py-0.5 font-bold uppercase">
                        Akun Anda Saat Ini
                      </span>
                    )}
                  </div>
                  <p className="text-body-sm text-ink-muted mt-0.5">{usr.email}</p>
                  <p className="text-caption text-ink-faint mt-1">
                    Bergabung {formatDateShort(usr.created_at)} · ID: <span className="font-mono">{usr.id}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-caption text-ink-faint mr-2 font-medium">Ubah Izin Akses:</span>
                <Button
                  variant={usr.role === 'user' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => handleChangeRole(usr.id, usr.full_name, 'user')}
                  className="gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5" /> Jadikan Peserta
                </Button>
                <Button
                  variant={usr.role === 'organizer' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => handleChangeRole(usr.id, usr.full_name, 'organizer')}
                  className="gap-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5" /> Jadikan Organizer
                </Button>
                <Button
                  variant={usr.role === 'admin' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => handleChangeRole(usr.id, usr.full_name, 'admin')}
                  className="gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" /> Jadikan Admin
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
