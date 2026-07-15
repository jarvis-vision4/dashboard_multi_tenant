'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { useJobs } from '@/hooks/useApi';
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
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { formatDate, formatDateTime } from '@/lib/utils';
import Link from 'next/link';

const statusVariant: Record<
  string,
  'success' | 'warning' | 'danger' | 'secondary' | 'default'
> = {
  COMPLETED: 'success',
  PROCESSING: 'warning',
  PENDING: 'secondary',
  FAILED: 'danger',
  DELAYED: 'warning',
};

export default function JobsPage() {
  const [page, setPage] = useState(1);
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, error } = useJobs(user?.tenantId ?? '', page);

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-destructive">Failed to load jobs</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Jobs</h1>
        <p className="text-muted-foreground">
          Background job processing status
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    <Link href={`/jobs/${job.id}`} className="hover:underline">
                      {job.type}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[job.status] ?? 'default'}>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {job.attempts}/{job.maxAttempts}
                  </TableCell>
                  <TableCell>{job.priority}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(job.createdAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.completedAt ? formatDateTime(job.completedAt) : '-'}
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground py-8 text-center"
                  >
                    No jobs found
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
    </div>
  );
}
