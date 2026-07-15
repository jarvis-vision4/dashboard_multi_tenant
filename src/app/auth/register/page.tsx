'use client';

import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import { RegisterForm } from '@/components/forms/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get('tenantId') || undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Sign up for a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm tenantId={tenantId} />
        <p className="text-muted-foreground mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
