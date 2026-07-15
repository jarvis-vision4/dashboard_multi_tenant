'use client';

import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import { LoginForm } from '@/components/forms/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get('tenantId') || undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm tenantId={tenantId} />
        <p className="text-muted-foreground mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
