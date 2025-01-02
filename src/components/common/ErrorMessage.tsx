import { cn } from '../../utils/styles';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div className={cn('text-red-500 text-sm', className)}>
      {message}
    </div>
  );
}