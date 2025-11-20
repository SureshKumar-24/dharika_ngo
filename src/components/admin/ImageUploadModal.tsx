'use client';

import { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (url: string) => void;
  currentImageUrl?: string;
  sectionName?: string;
  imageKey?: string;
}

export function ImageUploadModal({
  isOpen,
  onClose,
  onUploadComplete,
  currentImageUrl,
  sectionName,
  imageKey,
}: ImageUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Get section-specific instructions
  const getInstructions = () => {
    if (sectionName === 'hero_carousel') {
      return {
        title: 'Hero Carousel Image',
        aspectRatio: 'Landscape (16:9 or wider)',
        recommendedSize: '1920x1080px or larger',
        tips: [
          'Use high-quality landscape images',
          'Ensure important content is centered',
          'Avoid text-heavy images (text overlay is added)',
          'Image will be displayed full-width on all devices',
        ],
      };
    } else if (sectionName === 'food_drives' || sectionName === 'teaching_drives') {
      return {
        title: sectionName === 'food_drives' ? 'Food Drives Image' : 'Teaching Drives Image',
        aspectRatio: 'Square (1:1)',
        recommendedSize: '800x800px or larger',
        tips: [
          'Use square images for best display',
          'Show people and activities clearly',
          'Bright, well-lit photos work best',
          'Images display in a 2x2 grid on desktop',
        ],
      };
    }
    return {
      title: 'Section Image',
      aspectRatio: 'Any',
      recommendedSize: '1200x800px',
      tips: ['Use high-quality images', 'Ensure good lighting and clarity'],
    };
  };

  const instructions = getInstructions();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      onUploadComplete(data.url);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-maroon">Upload Image</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{instructions.title}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-red-50 rounded-full transition-all shrink-0 group"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center cursor-pointer hover:border-maroon transition-colors"
            >
              {previewUrl ? (
                <div className="space-y-4">
                  <div className="relative aspect-video w-full bg-gray-100 rounded-lg overflow-hidden group">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all opacity-90 hover:opacity-100 shadow-lg"
                      title="Remove image"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{selectedFile?.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile!.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-medium text-gray-900">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      JPEG, PNG, or WebP (max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Image Requirements */}
          <div className="p-4 bg-cream border border-gold/30 rounded-lg space-y-3">
            <div>
              <p className="text-sm font-semibold text-maroon mb-1">
                📐 Recommended Specifications
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Aspect Ratio:</strong> {instructions.aspectRatio}</li>
                <li>• <strong>Size:</strong> {instructions.recommendedSize}</li>
                <li>• <strong>Format:</strong> JPEG, PNG, or WebP</li>
                <li>• <strong>Max File Size:</strong> 10MB</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-maroon mb-1">💡 Tips</p>
              <ul className="text-sm text-gray-700 space-y-1">
                {instructions.tips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 hover:border-gray-400 rounded-lg transition-all text-sm sm:text-base font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-maroon text-white rounded-lg hover:bg-maroon/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base font-medium shadow-sm hover:shadow-md"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>
    </div>
  );
}
