'use client';

import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useJob } from '@/hooks/useApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
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

export default function JobDetailPage() {
  const params = useParams();
  const user = useAuthStore((s) => s.user);
  const id = params.id as string;
  const { data: job, isLoading, error } = useJob(user?.tenantId ?? '', id);

  if (isLoading) return <Spinner />;
  if (error || !job)
    return <div className="text-destructive">Job not found</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/jobs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{job.type}</h1>
          <p className="text-muted-foreground">Job Detail</p>
        </div>
        <Badge variant={statusVariant[job.status] ?? 'default'}>
          {job.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Status</p>
              <p className="font-medium">{job.status}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Priority</p>
              <p className="font-medium">{job.priority}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Attempts</p>
              <p className="font-medium">
                {job.attempts} / {job.maxAttempts}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Created</p>
              <p className="font-medium">{formatDateTime(job.createdAt)}</p>
            </div>
            {job.startedAt && (
              <div>
                <p className="text-muted-foreground text-sm">Started</p>
                <p className="font-medium">{formatDateTime(job.startedAt)}</p>
              </div>
            )}
            {job.completedAt && (
              <div>
                <p className="text-muted-foreground text-sm">Completed</p>
                <p className="font-medium">{formatDateTime(job.completedAt)}</p>
              </div>
            )}
          </div>
          {job.error && (
            <div>
              <p className="text-muted-foreground mb-1 text-sm">Error</p>
              <pre className="bg-destructive/10 text-destructive whitespace-pre-wrap rounded-md p-3 text-sm">
                {job.error}
              </pre>
            </div>
          )}
          {job.result && (
            <div>
              <p className="text-muted-foreground mb-1 text-sm">Result</p>
              <pre className="bg-muted whitespace-pre-wrap rounded-md p-3 text-sm">
                {typeof job.result === 'string'
                  ? job.result
                  : JSON.stringify(job.result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
