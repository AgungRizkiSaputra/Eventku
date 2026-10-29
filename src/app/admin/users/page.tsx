'use client';

import { useState } from 'react';
import { AdminNav } from '@/components/admin/admin-nav';
import { MOCK_USERS } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, UserRole } from '@/types';
import { formatDateShort } from '@/lib/utils';
import { Check, Shield, Briefcase, User as UserIcon } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const changeRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          notify(`Peran pengguna "${u.full_name}" berhasil diubah menjadi ${newRole.toUpperCase()}.`);
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  return (
    <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-bold text-display-md">Kelola Pengguna</h1>
        <p className="text-body text-ink-muted mt-1">
          Daftar pengguna terdaftar, hak akses, dan pengaturan peran (Customer, Organizer, Admin).
        </p>
      </div>

      <AdminNav />

      {notification && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-body-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-success" />
          {notification}
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
                <div className="w-12 h-12 bg-ink text-ground flex items-center justify-center font-bold text-body-lg">
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
                  </div>
                  <p className="text-body-sm text-ink-muted mt-0.5">{usr.email}</p>
                  <p className="text-caption text-ink-faint mt-1">
                    Bergabung {formatDateShort(usr.created_at)} · ID: {usr.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-caption text-ink-faint mr-2">Ubah Peran:</span>
                <Button
                  variant={usr.role === 'user' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => changeRole(usr.id, 'user')}
                  className="gap-1"
                >
                  <UserIcon className="w-3.5 h-3.5" /> Peserta
                </Button>
                <Button
                  variant={usr.role === 'organizer' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => changeRole(usr.id, 'organizer')}
                  className="gap-1"
                >
                  <Briefcase className="w-3.5 h-3.5" /> Organizer
                </Button>
                <Button
                  variant={usr.role === 'admin' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => changeRole(usr.id, 'admin')}
                  className="gap-1"
                >
                  <Shield className="w-3.5 h-3.5" /> Admin
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

