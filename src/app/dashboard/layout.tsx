'use client';

import { ReactNode } from 'react';
import { RoleGuard } from '@/components/auth/role-guard';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['organizer', 'admin']} moduleName="Dashboard Penyelenggara (Organizer)">
      {children}
    </RoleGuard>
  );
}

