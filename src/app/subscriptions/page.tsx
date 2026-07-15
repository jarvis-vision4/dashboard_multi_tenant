'use client';

import { useAuthStore } from '@/store/auth';
import { useSubscription, cancelSubscription } from '@/hooks/useApi';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import { CreditCard } from 'lucide-react';

export default function SubscriptionsPage() {
  const user = useAuthStore((s) => s.user);
  const {
    data: subscription,
    isLoading,
    error,
    mutate,
  } = useSubscription(user?.tenantId ?? '');

  async function handleCancel() {
    if (!user?.tenantId) return;
    await cancelSubscription(user.tenantId);
    mutate();
  }

  if (isLoading) return <Spinner />;
  if (error)
    return <div className="text-destructive">Failed to load subscription</div>;

  if (!subscription) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Subscription</h1>
          <p className="text-muted-foreground">No active subscription found</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <CreditCard className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-lg font-medium">No Subscription</p>
            <p className="text-muted-foreground text-sm">
              Contact your tenant admin to set up a subscription plan.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusVariant =
    subscription.status === 'ACTIVE'
      ? 'success'
      : subscription.status === 'PAST_DUE'
        ? 'warning'
        : subscription.status === 'CANCELED'
          ? 'secondary'
          : 'default';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription plan</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Plan</CardTitle>
            <Badge variant={statusVariant as any}>{subscription.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Period Start</p>
              <p className="font-medium">
                {formatDate(subscription.currentPeriodStart)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Period End</p>
              <p className="font-medium">
                {formatDate(subscription.currentPeriodEnd)}
              </p>
            </div>
            {subscription.trialEnd && (
              <div>
                <p className="text-muted-foreground text-sm">Trial Ends</p>
                <p className="font-medium">
                  {formatDate(subscription.trialEnd)}
                </p>
              </div>
            )}
            {subscription.cancelAtPeriodEnd && (
              <div>
                <p className="text-muted-foreground text-sm">Cancels At</p>
                <p className="font-medium">
                  {formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="gap-3">
          {!subscription.cancelAtPeriodEnd &&
            subscription.status !== 'CANCELED' && (
              <Button variant="outline" onClick={handleCancel}>
                Cancel Subscription
              </Button>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
