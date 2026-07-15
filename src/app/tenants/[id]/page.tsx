'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTenant } from '@/hooks/useApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { TenantForm } from '@/components/forms/TenantForm';
import { formatDate, getStatusColor } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: tenant, isLoading, error } = useTenant(id);

  if (isLoading) return <Spinner />;
  if (error || !tenant)
    return <div className="text-destructive">Tenant not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tenants">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{tenant.name}</h1>
          <p className="text-muted-foreground">{tenant.slug}</p>
        </div>
        <Badge variant={getStatusColor(tenant.status) as any}>
          {tenant.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-muted-foreground text-sm">Domain</span>
              <p>{tenant.domain || '-'}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Created</span>
              <p>{formatDate(tenant.createdAt)}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Users</span>
              <p>{tenant._count?.users ?? 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edit Tenant</CardTitle>
          </CardHeader>
          <CardContent>
            <TenantForm
              initialData={tenant}
              onSuccess={() => router.refresh()}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
