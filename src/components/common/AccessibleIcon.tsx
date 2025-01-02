```typescript
import { forwardRef } from 'react';

interface AccessibleIconProps extends React.SVGProps<SVGSVGElement> {
  label: string;
}

export const AccessibleIcon = forwardRef<SVGSVGElement, AccessibleIconProps>(
  ({ label, children, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        role="img"
        aria-label={label}
        {...props}
      >
        {children}
      </svg>
    );
  }
);

AccessibleIcon.displayName = 'AccessibleIcon';
```