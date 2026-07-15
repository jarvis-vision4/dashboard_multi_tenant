'use client';

import { useState } from 'react';
import { useUsers, deleteUser } from '@/hooks/useApi';
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
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate, getRoleColor } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import type { User } from '@/types';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const { data, isLoading, error } = useUsers(undefined, page);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.tenantId, deleteTarget.id);
    } finally {
      setDeleteTarget(null);
    }
  }

  if (isLoading) return <Spinner />;
  if (error)
    return <div className="text-destructive">Failed to load users</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage all users across tenants</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        firstName={user.firstName}
                        lastName={user.lastName}
                        size="sm"
                      />
                      <span className="font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleColor(user.role) as any}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'success' : 'secondary'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(user)}
                    >
                      <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground py-8 text-center"
                  >
                    No users found
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
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
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
