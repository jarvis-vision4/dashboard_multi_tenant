'use client';

import { useAuthStore } from '@/store/auth';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { LogOut, User } from 'lucide-react';
import Link from 'next/link';

function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="bg-card flex h-14 items-center justify-end gap-4 border-b px-6">
      <Dropdown
        trigger={
          <button className="hover:bg-accent flex items-center gap-2 rounded-md p-1">
            <Avatar
              firstName={user?.firstName}
              lastName={user?.lastName}
              size="sm"
            />
            <span className="hidden text-sm font-medium sm:inline">
              {user?.firstName} {user?.lastName}
            </span>
          </button>
        }
        align="end"
      >
        <DropdownItem onClick={() => {}}>
          <Link href="/settings" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </Link>
        </DropdownItem>
        <DropdownItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownItem>
      </Dropdown>
    </header>
  );
}

export { Header };
