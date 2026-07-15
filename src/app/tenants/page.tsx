'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTenants, deleteTenant } from '@/hooks/useApi';
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
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';
import type { Tenant } from '@/types';

export default function TenantsPage() {
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Tenant | null>(null);
  const { data, isLoading, error } = useTenants(page);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteTenant(deleteTarget.id);
    } finally {
      setDeleteTarget(null);
    }
  }

  if (isLoading) return <Spinner />;
  if (error)
    return <div className="text-destructive">Failed to load tenants</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tenants</h1>
          <p className="text-muted-foreground">
            Manage all tenants in the platform
          </p>
        </div>
        <Link href="/tenants/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Tenant
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <Link
                      href={`/tenants/${tenant.id}`}
                      className="font-medium hover:underline"
                    >
                      {tenant.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {tenant.slug}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(tenant.status) as any}>
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{tenant._count?.users ?? 0}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(tenant.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/tenants/${tenant.id}`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(tenant)}
                      >
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground py-8 text-center"
                  >
                    No tenants found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {data?.meta && (
        <Pagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
        />
      )}

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Tenant"
        description="Are you sure you want to delete this tenant? This action cannot be undone."
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
