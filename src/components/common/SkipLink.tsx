import { useState } from 'react';
import { cn } from '../../utils/styles';

export function SkipLink() {
  const [focused, setFocused] = useState(false);

  return (
    <a
      href="#main-content"
      className={cn(
        'fixed top-0 left-0 p-2 bg-primary text-black',
        'transform transition-transform duration-200',
        focused ? 'translate-y-0' : '-translate-y-full'
      )}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      Skip to main content
    </a>
  );
}