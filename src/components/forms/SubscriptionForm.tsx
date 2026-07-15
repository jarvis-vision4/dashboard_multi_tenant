'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { updateSubscription } from '@/hooks/useApi';
import { SubscriptionStatus } from '@/types';

const subscriptionSchema = z.object({
  status: z.nativeEnum(SubscriptionStatus),
  cancelAtPeriodEnd: z.boolean().optional(),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  tenantId: string;
  initialData?: { status: SubscriptionStatus; cancelAtPeriodEnd?: boolean };
  onSuccess?: () => void;
}

function SubscriptionForm({
  tenantId,
  initialData,
  onSuccess,
}: SubscriptionFormProps) {
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: initialData ?? { status: SubscriptionStatus.ACTIVE },
  });

  async function onSubmit(data: SubscriptionFormData) {
    setError('');
    try {
      await updateSubscription(tenantId, data);
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
      <Select
        id="status"
        label="Status"
        options={[
          { value: SubscriptionStatus.ACTIVE, label: 'Active' },
          { value: SubscriptionStatus.PAST_DUE, label: 'Past Due' },
          { value: SubscriptionStatus.CANCELED, label: 'Canceled' },
          { value: SubscriptionStatus.TRIALING, label: 'Trialing' },
          { value: SubscriptionStatus.INCOMPLETE, label: 'Incomplete' },
        ]}
        error={errors.status?.message}
        {...register('status')}
      />
      <div className="flex justify-end gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          Update Subscription
        </Button>
      </div>
    </form>
  );
}

export { SubscriptionForm };
