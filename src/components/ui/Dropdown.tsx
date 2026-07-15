'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'end';
}

function Dropdown({ trigger, children, align = 'start' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={cn(
            'bg-popover absolute z-50 mt-1 min-w-[12rem] rounded-md border p-1 shadow-md',
            align === 'end' ? 'right-0' : 'left-0'
          )}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-md px-3 py-2 text-sm',
        className
      )}
    >
      {children}
    </button>
  );
}

export { Dropdown, DropdownItem };
