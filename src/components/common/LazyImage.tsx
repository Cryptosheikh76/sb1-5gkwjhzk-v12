import { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { getOptimizedImageUrl } from '../../utils/performance';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blur?: boolean;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  blur = true,
  className,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true
  });

  const optimizedSrc = width ? getOptimizedImageUrl(src, width) : src;

  useEffect(() => {
    if (isVisible && !isLoaded) {
      const img = new Image();
      img.src = optimizedSrc;
      img.onload = () => setIsLoaded(true);
    }
  }, [isVisible, optimizedSrc, isLoaded]);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ aspectRatio: width && height ? width / height : undefined }}
    >
      <img
        src={isVisible ? optimizedSrc : ''}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className={`
          w-full h-full object-cover transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${blur && !isLoaded ? 'blur-sm' : ''}
        `}
        {...props}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
      )}
    </div>
  );
}