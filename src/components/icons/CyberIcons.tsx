```typescript
// Add to existing CyberIcons.tsx
export function CyberUploadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path 
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="glow-stroke"
      />
    </svg>
  );
}
```