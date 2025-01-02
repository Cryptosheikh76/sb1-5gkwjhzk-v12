import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/styles';

interface BaseInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'as'> {
  error?: string;
  label?: string;
}

interface TextareaProps extends Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'as'> {
  error?: string;
  label?: string;
  as: 'textarea';
  rows?: number;
}

type InputProps = BaseInputProps | TextareaProps;

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(({
  className,
  error,
  label,
  as,
  ...props
}, ref) => {
  const inputClasses = cn(
    'w-full px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    'placeholder:text-zinc-400',
    error && 'border-red-500 focus:ring-red-500',
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-200">
          {label}
        </label>
      )}
      
      {as === 'textarea' ? (
        <textarea
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          className={inputClasses}
          {...(props as TextareaProps)}
        />
      ) : (
        <input
          ref={ref as React.RefObject<HTMLInputElement>}
          className={inputClasses}
          {...(props as BaseInputProps)}
        />
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';