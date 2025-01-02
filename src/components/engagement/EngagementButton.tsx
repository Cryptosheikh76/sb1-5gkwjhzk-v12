import { ComponentProps } from 'react';
import { cn } from '../../utils/styles';

interface EngagementButtonProps extends ComponentProps<'button'> {
  icon: React.ReactNode;
  count?: number;
  label?: string;
}

export function EngagementButton({ 
  icon, 
  count, 
  label,
  className,
  ...props 
}: EngagementButtonProps) {
  return (
    <button 
      className={cn("group flex flex-col items-center", className)}
      {...props}
    >
      <div className="p-3 rounded-full bg-zinc-800/80 group-hover:bg-zinc-700/80 transition-colors">
        {icon}
      </div>
      {(count !== undefined || label) && (
        <span className="text-sm mt-1">{label || count}</span>
      )}
    </button>
  );
}