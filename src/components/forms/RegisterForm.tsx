'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { api, setTokens } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { UserRole } from '@/types';
import type { LoginResponse, ApiResponse } from '@/types';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.nativeEnum(UserRole),
});

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterForm({ tenantId }: { tenantId?: string }) {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: UserRole.MEMBER },
  });

  async function onSubmit(data: RegisterFormData) {
    setError('');
    try {
      const response = await api.post<ApiResponse<LoginResponse>>(
        '/auth/register',
        data,
        tenantId
      );
      const { user, accessToken, refreshToken } = response.data.data;
      setTokens({ accessToken, refreshToken });
      setUser(user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Registration failed');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="firstName"
          label="First Name"
          placeholder="John"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          id="lastName"
          label="Last Name"
          placeholder="Doe"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>
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
        placeholder="Create a password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Select
        id="role"
        label="Role"
        options={[
          { value: UserRole.MEMBER, label: 'Member' },
          { value: UserRole.TENANT_ADMIN, label: 'Tenant Admin' },
          { value: UserRole.VIEWER, label: 'Viewer' },
        ]}
        error={errors.role?.message}
        {...register('role')}
      />
      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Create Account
      </Button>
    </form>
  );
}

export { RegisterForm };
