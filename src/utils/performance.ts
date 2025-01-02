```typescript
// Image optimization
export function getOptimizedImageUrl(url: string, width: number): string {
  if (!url) return '';
  
  // If already using a CDN, append size parameters
  if (url.includes('imagedelivery.net')) {
    return `${url}/w=${width}`;
  }
  
  // For local images, use responsive images
  return `${url}?width=${width}`;
}

// Lazy loading helper
export function shouldLoadImage(element: Element): boolean {
  if ('loading' in HTMLImageElement.prototype) {
    return true; // Browser supports native lazy loading
  }
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}

// Performance monitoring
export function measurePageLoad(): void {
  if (window.performance) {
    const timing = window.performance.timing;
    const pageLoad = timing.loadEventEnd - timing.navigationStart;
    console.log(`Page Load Time: ${pageLoad}ms`);
  }
}

// Resource hints
export function addResourceHints(): void {
  const hints = [
    { rel: 'dns-prefetch', href: 'https://api.example.com' },
    { rel: 'preconnect', href: 'https://api.example.com' },
    { rel: 'preload', href: '/fonts/inter.woff2', as: 'font' }
  ];

  hints.forEach(({ rel, href, as }) => {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (as) link.setAttribute('as', as);
    document.head.appendChild(link);
  });
}
```