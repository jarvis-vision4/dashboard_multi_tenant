'use client';

import { useAuthStore } from '@/store/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Building2, Users, CreditCard, Activity } from 'lucide-react';
import { useTenants, useUsers, useSubscription, useJobs } from '@/hooks/useApi';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin());
  const { data: tenantsData } = useTenants();
  const { data: usersData } = useUsers(undefined);
  const { data: subscription } = useSubscription(user?.tenantId ?? '');
  const { data: jobsData } = useJobs(user?.tenantId ?? '');

  const stats = [
    {
      title: 'Tenants',
      value: isSuperAdmin ? (tenantsData?.meta?.total ?? '-') : '-',
      icon: Building2,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Users',
      value: usersData?.meta?.total ?? '-',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-100',
    },
    {
      title: 'Subscription',
      value: subscription?.status ?? '-',
      icon: CreditCard,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'Jobs',
      value: jobsData?.meta?.total ?? '-',
      icon: Activity,
      color: 'text-amber-600 bg-amber-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.firstName} {user?.lastName}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-md p-2 ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
