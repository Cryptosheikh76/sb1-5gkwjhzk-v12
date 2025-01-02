```tsx
import { useState } from 'react';
import { cn } from '../../utils/styles';

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Switch({ 
  checked = false, 
  onCheckedChange,
  disabled = false,
  className
}: SwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onCheckedChange?.(newValue);
  };

  return (
    <button
      role="switch"
      aria-checked={isChecked}
      onClick={handleChange}
      disabled={disabled}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        isChecked ? 'bg-primary' : 'bg-zinc-700',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
          isChecked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
}
```