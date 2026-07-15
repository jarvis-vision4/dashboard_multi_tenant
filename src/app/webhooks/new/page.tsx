'use client';

import { useAuthStore } from '@/store/auth';
import { WebhookForm } from '@/components/forms/WebhookForm';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';

export default function NewWebhookPage() {
  const user = useAuthStore((s) => s.user);
  const tenantId = user?.tenantId ?? '';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Webhook</h1>
        <p className="text-muted-foreground">Add a new webhook endpoint</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Webhook Details</CardTitle>
          <CardDescription>
            Configure the endpoint and events to subscribe to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WebhookForm tenantId={tenantId} />
        </CardContent>
      </Card>
    </div>
  );
}
