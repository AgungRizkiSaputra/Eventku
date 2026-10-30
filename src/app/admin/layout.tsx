'use client';

import { ReactNode } from 'react';
import { RoleGuard } from '@/components/auth/role-guard';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin']} moduleName="Panel Administrasi (Admin)">
      {children}
    </RoleGuard>
  );
}

