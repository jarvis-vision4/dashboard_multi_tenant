'use client';

import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useWebhook, useWebhookDeliveries } from '@/hooks/useApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import { formatDate, formatDateTime } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function WebhookDetailPage() {
  const params = useParams();
  const user = useAuthStore((s) => s.user);
  const tenantId = user?.tenantId ?? '';
  const id = params.id as string;
  const { data: webhook, isLoading, error } = useWebhook(tenantId, id);
  const { data: deliveries } = useWebhookDeliveries(tenantId, id);

  if (isLoading) return <Spinner />;
  if (error || !webhook)
    return <div className="text-destructive">Webhook not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/webhooks">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="max-w-md truncate text-2xl font-bold">
            {webhook.url}
          </h1>
          <p className="text-muted-foreground">Webhook Endpoint</p>
        </div>
        <Badge variant={webhook.isActive ? 'success' : 'secondary'}>
          {webhook.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-muted-foreground text-sm">URL</span>
              <p className="break-all font-mono text-sm">{webhook.url}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Description</span>
              <p>{webhook.description || '-'}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Created</span>
              <p>{formatDate(webhook.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscribed Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {webhook.events.map((event) => (
                <Badge key={event} variant="outline">
                  {event}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attempt</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Delivered At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries?.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.eventType}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        d.status === ('DELIVERED' as any)
                          ? 'success'
                          : d.status === ('FAILED' as any)
                            ? 'danger'
                            : 'warning'
                      }
                    >
                      {d.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {d.attempt}/{d.maxAttempts}
                  </TableCell>
                  <TableCell>{d.responseStatus || '-'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {d.deliveredAt ? formatDateTime(d.deliveredAt) : '-'}
                  </TableCell>
                </TableRow>
              ))}
              {(!deliveries || deliveries.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground py-8 text-center"
                  >
                    No deliveries yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
