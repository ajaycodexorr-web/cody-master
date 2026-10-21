import React from 'react';
import { MasterShell } from '@/components/layout/MasterShell';

export default function MasterLayout({ children }: { children: React.ReactNode }) {
  return <MasterShell>{children}</MasterShell>;
}
