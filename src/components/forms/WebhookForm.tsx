'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { createWebhook } from '@/hooks/useApi';
import { WebhookEventType } from '@/types';

const webhookSchema = z.object({
  url: z.string().url('Must be a valid URL'),
  events: z.string().min(1, 'At least one event is required'),
  description: z.string().optional(),
});

type WebhookFormData = z.infer<typeof webhookSchema>;

const eventOptions = Object.values(WebhookEventType);

interface WebhookFormProps {
  tenantId: string;
  onSuccess?: () => void;
}

function WebhookForm({ tenantId, onSuccess }: WebhookFormProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
  });

  function toggleEvent(event: string) {
    const next = selectedEvents.includes(event)
      ? selectedEvents.filter((e) => e !== event)
      : [...selectedEvents, event];
    setSelectedEvents(next);
    setValue('events', next.join(','));
  }

  async function onSubmit(data: WebhookFormData) {
    setError('');
    try {
      await createWebhook(tenantId, {
        url: data.url,
        events: data.events.split(',').filter(Boolean) as WebhookEventType[],
        description: data.description,
      });
      router.push('/webhooks');
      onSuccess?.();
    } catch (err: any) {
      setError(
        err?.response?.data?.error?.message || 'Failed to create webhook'
      );
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
        id="url"
        label="Endpoint URL"
        placeholder="https://example.com/webhook"
        error={errors.url?.message}
        {...register('url')}
      />
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none">Events</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {eventOptions.map((event) => (
            <button
              key={event}
              type="button"
              onClick={() => toggleEvent(event)}
              className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                selectedEvents.includes(event)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'hover:bg-accent border-input bg-background'
              }`}
            >
              {event}
            </button>
          ))}
        </div>
        {errors.events && (
          <p className="text-destructive text-sm">{errors.events.message}</p>
        )}
      </div>
      <input type="hidden" {...register('events')} />
      <Textarea
        id="description"
        label="Description (optional)"
        placeholder="What is this webhook for?"
        error={errors.description?.message}
        {...register('description')}
      />
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Create Webhook
        </Button>
      </div>
    </form>
  );
}

export { WebhookForm };
