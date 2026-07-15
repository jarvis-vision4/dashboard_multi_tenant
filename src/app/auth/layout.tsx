import { ReactNode } from 'react';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function AuthPageLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
