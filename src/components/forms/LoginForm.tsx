'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api, setTokens } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import type { LoginResponse, ApiResponse } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm({ tenantId }: { tenantId?: string }) {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setError('');
    try {
      const response = await api.post<ApiResponse<LoginResponse>>(
        '/auth/login',
        data,
        tenantId
      );
      const { user, accessToken, refreshToken } = response.data.data;
      setTokens({ accessToken, refreshToken });
      setUser(user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Login failed');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
          {error}
        </div>
      )}
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Sign In
      </Button>
    </form>
  );
}

export { LoginForm };
