'use client';

import { useState } from 'react';

export interface SimpleUploadProps {
  onUpload: (url: string) => void;
  folder: string;
}

export function SimpleUpload({ onUpload, folder }: SimpleUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert('No file selected');
      console.log('No file selected');
      return;
    }

    setIsUploading(true);
    alert('File selected: ' + file.name);
    console.log('File selected:', file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      alert('Sending upload request to /api/upload');
      console.log('Sending upload request to /api/upload');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      alert('Upload response status: ' + response.status);
      console.log('Upload response status:', response.status);
      console.log('Upload response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        alert('Upload error: ' + errorText);
        console.error('Upload error response:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      alert('Upload success! URL: ' + data.url);
      console.log('Upload success data:', data);
      
      if (data.url) {
        onUpload(data.url);
      } else {
        throw new Error('No URL returned from upload');
      }
    } catch (error) {
      alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-red-500 rounded-lg p-4 bg-yellow-50">
      <div style={{ color: 'red', fontWeight: 'bold', marginBottom: 8 }}>
        [DEBUG] Upload input is rendered. Select a file to test upload.
      </div>
      <label htmlFor="debug-upload-input" style={{ fontWeight: 'bold', color: 'blue' }}>
        Select Image to Upload:
      </label>
      <input
        id="debug-upload-input"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={isUploading}
        style={{ display: 'block', marginTop: 8 }}
      />
      {isUploading && (
        <div className="mt-2 text-sm text-blue-600">
          Uploading...
        </div>
      )}
    </div>
  );
} 