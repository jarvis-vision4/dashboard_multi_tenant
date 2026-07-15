import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  firstName?: string;
  lastName?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function Avatar({
  firstName,
  lastName,
  src,
  size = 'md',
  className,
}: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName ?? ''} ${lastName ?? ''}`}
        className={cn(
          'rounded-full object-cover',
          {
            'h-8 w-8': size === 'sm',
            'h-10 w-10': size === 'md',
            'h-14 w-14': size === 'lg',
          },
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primary font-medium text-primary-foreground',
        {
          'h-8 w-8 text-xs': size === 'sm',
          'h-10 w-10 text-sm': size === 'md',
          'h-14 w-14 text-lg': size === 'lg',
        },
        className
      )}
    >
      {getInitials(firstName ?? '', lastName ?? '')}
    </div>
  );
}

export { Avatar };
