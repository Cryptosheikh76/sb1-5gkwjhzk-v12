import { cn } from '../../utils/styles';
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  className?: string;
}

export function Alert({ type = 'info', title, message, className }: AlertProps) {
  const icons = {
    info: InformationCircleIcon,
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon
  };

  const styles = {
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        styles[type],
        className
      )}
    >
      <div className="flex">
        <Icon className="h-5 w-5 shrink-0" />
        <div className="ml-3">
          {title && (
            <h3 className="font-medium">{title}</h3>
          )}
          <p className={cn('text-sm', title && 'mt-1')}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}