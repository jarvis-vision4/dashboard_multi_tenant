'use client';

import { useAuthStore } from '@/store/auth';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { getRoleColor } from '@/lib/utils';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar
              firstName={user?.firstName}
              lastName={user?.lastName}
              size="lg"
            />
            <div>
              <p className="text-lg font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
            </div>
            {user?.role && (
              <Badge variant={getRoleColor(user.role) as any}>
                {user.role}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="firstName"
              label="First Name"
              value={user?.firstName ?? ''}
              readOnly
            />
            <Input
              id="lastName"
              label="Last Name"
              value={user?.lastName ?? ''}
              readOnly
            />
          </div>
          <Input id="email" label="Email" value={user?.email ?? ''} readOnly />
          <Button variant="outline" disabled>
            Edit Profile (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
