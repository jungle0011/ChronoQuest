// Universal CloudinaryUpload component for all image uploads across the app.
// Usage: <CloudinaryUpload onUpload={fn} folder="logos" [accept="image/*"] [maxSizeMB={4}] [showPreview] />
// Handles file selection, upload, loading, error/success toasts, and optional preview.

'use client';
import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

export interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  folder: string;
  userId?: string;
  accept?: string;
  maxSizeMB?: number;
  showPreview?: boolean;
}

export function CloudinaryUpload({
  onUpload,
  folder,
  userId,
  accept = 'image/*',
  maxSizeMB = 4,
  showPreview = true,
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: `Max size is ${maxSizeMB}MB.`,
        variant: 'destructive',
      });
      return;
    }
    if (showPreview) {
      setPreviewUrl(URL.createObjectURL(file));
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      if (userId) formData.append('userId', userId);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: 'Upload failed',
          description: errorData.error || 'Upload failed',
          variant: 'destructive',
        });
        setIsUploading(false);
        return;
      }
      const data = await response.json();
      onUpload(data.url);
      toast({
        title: 'Upload successful',
        description: 'Image uploaded successfully!',
      });
      if (showPreview) setPreviewUrl(data.url);
    } catch (error) {
      toast({
        title: 'Upload error',
        description: error instanceof Error ? error.message : 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <input
        type="file"
        accept={accept}
        onChange={handleUpload}
        disabled={isUploading}
        className="hidden"
        id={`image-upload-${folder}`}
        ref={inputRef}
      />
      <Button
        type="button"
        disabled={isUploading}
        className="w-full"
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </Button>
      {showPreview && previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="mt-2 rounded-lg object-cover border border-gray-200"
          style={{ width: 64, height: 64 }}
        />
      )}
    </div>
  );
} 