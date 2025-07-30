'use client';

import React, { useState, useRef } from 'react';

interface CloudinaryImage {
  url: string;
  publicId: string;
  format?: string;
  width?: number;
  height?: number;
  size?: number;
}

interface FileUploaderProps {
  onUploadComplete: (imageData: CloudinaryImage) => void;
  onError?: (error: string) => void;
  className?: string;
  label?: string;
  acceptedFileTypes?: string;
}

export default function FileUploader({
  onUploadComplete,
  onError,
  className = '',
  label = 'Datei hochladen',
  acceptedFileTypes = 'image/*',
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    setProgress(10); // Start progress
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate progress (actual upload progress requires more complex handling)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.floor(Math.random() * 20);
          return newProgress > 90 ? 90 : newProgress; // Cap at 90% until complete
        });
      }, 500);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
      
      const data = await response.json();
      setProgress(100);
      
      if (data.success) {
        // Pass the full Cloudinary image data to the parent component
        onUploadComplete(data.data);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      if (onError) onError(error.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={acceptedFileTypes}
        />
        
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={uploading}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {label}
        </button>
        
        {uploading && (
          <div className="w-full mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {progress < 100 ? 'Uploading...' : 'Upload complete!'}
              {fileName && ` - ${fileName}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
