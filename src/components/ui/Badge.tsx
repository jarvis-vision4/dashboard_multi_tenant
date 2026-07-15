import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        {
          'bg-primary text-primary-foreground': variant === 'default',
          'bg-secondary text-secondary-foreground': variant === 'secondary',
          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100':
            variant === 'success',
          'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100':
            variant === 'warning',
          'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100':
            variant === 'danger',
          'border border-input bg-background text-foreground':
            variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
