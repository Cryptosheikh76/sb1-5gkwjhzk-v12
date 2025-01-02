import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface PreviewFeatureProps {
  title: string;
  description: string;
  demoUrl?: string;
  videoUrl?: string;
  screenshots?: string[];
}

export function PreviewFeature({
  title,
  description,
  demoUrl,
  videoUrl,
  screenshots = []
}: PreviewFeatureProps) {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        {videoUrl ? (
          <video 
            src={videoUrl}
            className="w-full h-full object-cover"
            controls
            playsInline
          />
        ) : screenshots.length > 0 ? (
          <>
            <img
              src={screenshots[currentImage]}
              alt={`${title} preview ${currentImage + 1}`}
              className="w-full h-full object-cover"
            />
            {screenshots.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImage ? 'bg-primary' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        {demoUrl && (
          <Button 
            as="a" 
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Try Demo
          </Button>
        )}
      </div>
    </Card>
  );
}