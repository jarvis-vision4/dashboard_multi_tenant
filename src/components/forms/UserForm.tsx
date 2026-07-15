'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { createUser, updateUser } from '@/hooks/useApi';
import { UserRole } from '@/types';
import type { User } from '@/types';

const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Minimum 6 characters')
    .optional()
    .or(z.literal('')),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.nativeEnum(UserRole),
  isActive: z.boolean().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  tenantId: string;
  initialData?: User;
  onSuccess?: () => void;
}

function UserForm({ tenantId, initialData, onSuccess }: UserFormProps) {
  const [error, setError] = useState('');
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData
      ? {
          email: initialData.email,
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          role: initialData.role,
          isActive: initialData.isActive,
          password: '',
        }
      : { role: UserRole.MEMBER, isActive: true },
  });

  async function onSubmit(data: UserFormData) {
    setError('');
    try {
      const payload: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        isActive: data.isActive,
      };
      if (!isEditing) {
        payload.email = data.email;
        payload.password = data.password;
      }
      if (isEditing && initialData) {
        await updateUser(tenantId, initialData.id, payload);
      } else {
        await createUser(tenantId, payload);
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Operation failed');
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
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          id="lastName"
          label="Last Name"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>
      <Input
        id="email"
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      {!isEditing && (
        <Input
          id="password"
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
      )}
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
      <div className="flex justify-end gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}

export { UserForm };
