'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Webhook,
  Briefcase,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tenants', label: 'Tenants', icon: Building2 },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/webhooks', label: 'Webhooks', icon: Webhook },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside
      className={cn(
        'bg-card flex flex-col border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-4">
        {!collapsed && (
          <span className="text-lg font-bold text-primary">Novanox</span>
        )}
        <button onClick={onToggle} className="hover:bg-accent rounded-md p-1.5">
          <ChevronLeft
            className={cn(
              'h-5 w-5 transition-transform',
              collapsed && 'rotate-180'
            )}
          />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-2">
        <button
          onClick={logout}
          className={cn(
            'text-muted-foreground hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export { Sidebar };
