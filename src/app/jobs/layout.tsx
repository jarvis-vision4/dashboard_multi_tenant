'use client';

import { ReactNode } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function JobsLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
