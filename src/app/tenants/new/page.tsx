'use client';

import { TenantForm } from '@/components/forms/TenantForm';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';

export default function NewTenantPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Tenant</h1>
        <p className="text-muted-foreground">
          Add a new tenant to the platform
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tenant Details</CardTitle>
          <CardDescription>
            Enter the details for the new tenant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TenantForm />
        </CardContent>
      </Card>
    </div>
  );
}
