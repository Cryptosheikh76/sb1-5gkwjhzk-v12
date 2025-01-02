import { useState } from 'react';
import { VideoEditor } from './VideoEditor';
import { VideoTrimmer } from './VideoTrimmer';
import { VideoFilters } from './VideoFilters';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Tabs } from '../../../components/ui/Tabs';
import { useVideoUpload } from '../hooks/useVideoUpload';

export function VideoUploadFlow() {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<'upload' | 'edit' | 'publish'>('upload');
  const { uploadVideo, uploading, progress } = useVideoUpload();

  const tabs = [
    {
      label: 'Trim',
      content: file && <VideoTrimmer videoFile={file} onTrim={() => {}} />
    },
    {
      label: 'Filters',
      content: file && <VideoFilters onApplyFilters={() => {}} />
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
          
          {step === 'upload' && (
            <div className="text-center p-8 border-2 border-dashed border-zinc-700 rounded-lg">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFile(file);
                    setStep('edit');
                  }
                }}
                className="hidden"
                id="video-upload"
              />
              <label 
                htmlFor="video-upload"
                className="cursor-pointer text-blue-500 hover:text-blue-400"
              >
                Click to upload or drag and drop
              </label>
            </div>
          )}

          {step === 'edit' && file && (
            <div className="space-y-6">
              <Tabs tabs={tabs} />
              
              <div className="flex justify-end">
                <Button onClick={() => setStep('publish')}>
                  Continue to Publish
                </Button>
              </div>
            </div>
          )}

          {step === 'publish' && file && (
            <VideoEditor 
              file={file}
              onPublish={uploadVideo}
              uploading={uploading}
              progress={progress}
            />
          )}
        </div>
      </Card>
    </div>
  );
}