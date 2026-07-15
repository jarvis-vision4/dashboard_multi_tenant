'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { useWebhooks, deleteWebhook } from '@/hooks/useApi';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { WebhookEndpoint } from '@/types';

export default function WebhooksPage() {
  const user = useAuthStore((s) => s.user);
  const tenantId = user?.tenantId ?? '';
  const { data: webhooks, isLoading, error, mutate } = useWebhooks(tenantId);
  const [deleteTarget, setDeleteTarget] = useState<WebhookEndpoint | null>(
    null
  );

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteWebhook(tenantId, deleteTarget.id);
      mutate();
    } finally {
      setDeleteTarget(null);
    }
  }

  if (isLoading) return <Spinner />;
  if (error)
    return <div className="text-destructive">Failed to load webhooks</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Webhooks</h1>
          <p className="text-muted-foreground">Manage webhook endpoints</p>
        </div>
        <Link href="/webhooks/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Webhook
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deliveries</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks?.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="max-w-[200px] truncate font-medium">
                    <Link
                      href={`/webhooks/${webhook.id}`}
                      className="hover:underline"
                    >
                      {webhook.url}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.slice(0, 3).map((event) => (
                        <Badge
                          key={event}
                          variant="outline"
                          className="text-xs"
                        >
                          {event}
                        </Badge>
                      ))}
                      {webhook.events.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{webhook.events.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={webhook.isActive ? 'success' : 'secondary'}>
                      {webhook.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{webhook._count?.deliveries ?? 0}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(webhook.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(webhook)}
                    >
                      <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!webhooks || webhooks.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground py-8 text-center"
                  >
                    No webhooks configured
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Webhook"
        description="Are you sure you want to delete this webhook endpoint?"
      >
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
