'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { createTenant, updateTenant } from '@/hooks/useApi';
import { TenantStatus } from '@/types';
import type { Tenant } from '@/types';

const tenantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
  domain: z.string().optional(),
  status: z.nativeEnum(TenantStatus).optional(),
});

type TenantFormData = z.infer<typeof tenantSchema>;

interface TenantFormProps {
  initialData?: Tenant;
  onSuccess?: () => void;
}

function TenantForm({ initialData, onSuccess }: TenantFormProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          domain: initialData.domain ?? '',
          status: initialData.status,
        }
      : { status: TenantStatus.ACTIVE },
  });

  async function onSubmit(data: TenantFormData) {
    setError('');
    try {
      if (isEditing && initialData) {
        await updateTenant(initialData.id, data);
      } else {
        await createTenant(data);
        router.push('/tenants');
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
      <Input
        id="name"
        label="Tenant Name"
        placeholder="Acme Corp"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        id="slug"
        label="Slug"
        placeholder="acme-corp"
        error={errors.slug?.message}
        {...register('slug')}
      />
      <Input
        id="domain"
        label="Domain (optional)"
        placeholder="acme.com"
        error={errors.domain?.message}
        {...register('domain')}
      />
      {isEditing && (
        <Select
          id="status"
          label="Status"
          options={[
            { value: TenantStatus.ACTIVE, label: 'Active' },
            { value: TenantStatus.INACTIVE, label: 'Inactive' },
            { value: TenantStatus.SUSPENDED, label: 'Suspended' },
            { value: TenantStatus.TRIAL, label: 'Trial' },
          ]}
          error={errors.status?.message}
          {...register('status')}
        />
      )}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? 'Update Tenant' : 'Create Tenant'}
        </Button>
      </div>
    </form>
  );
}

export { TenantForm };
