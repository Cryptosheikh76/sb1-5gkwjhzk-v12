import { ImgHTMLAttributes } from 'react';
import { cn } from '../../utils/styles';

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg';
  fallback?: string;
}

export function Avatar({
  size = 'md',
  className,
  src,
  alt,
  fallback,
  ...props
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  if (!src) {
    return (
      <div
        className={cn(
          'bg-zinc-700 rounded-full flex items-center justify-center text-white font-medium',
          sizeClasses[size],
          className
        )}
      >
        {fallback?.[0]?.toUpperCase() || '?'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn('rounded-full object-cover', sizeClasses[size], className)}
      {...props}
    />
  );
}