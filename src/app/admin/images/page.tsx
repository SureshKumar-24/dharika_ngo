'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { ImageUploadModal } from '@/components/admin/ImageUploadModal';

interface SectionImage {
  id: number;
  section_name: string;
  image_key: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
}

interface GroupedImages {
  [key: string]: SectionImage[];
}

export default function AdminImagesPage() {
  const router = useRouter();
  const [sections, setSections] = useState<GroupedImages>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<SectionImage | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/admin/section-images');
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await response.json();
      setSections(data.sections || {});
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = (image: SectionImage) => {
    setCurrentImage(image);
    setUploadModalOpen(true);
  };

  const handleUploadComplete = async (url: string) => {
    setUploadModalOpen(false);
    // Auto-save after upload
    if (currentImage) {
      setSaving(true);
      try {
        const response = await fetch('/api/admin/section-images', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: currentImage.id,
            image_url: url,
            alt_text: currentImage.alt_text, // Keep existing alt text
          }),
        });

        if (response.ok) {
          await fetchImages();
          setCurrentImage(null);
        } else {
          alert('Failed to update image');
        }
      } catch (error) {
        console.error('Error saving image:', error);
        alert('Error saving image');
      } finally {
        setSaving(false);
      }
    }
  };

  const getSectionTitle = (sectionName: string) => {
    const titles: Record<string, string> = {
      food_drives: 'Food Drives',
      teaching_drives: 'Teaching Drives',
      hero_carousel: 'Hero Carousel',
    };
    return titles[sectionName] || sectionName;
  };

  const getSortedSections = () => {
    const order = ['hero_carousel', 'food_drives', 'teaching_drives'];
    return order
      .filter(key => sections[key])
      .map(key => [key, sections[key]] as [string, SectionImage[]]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-maroon">Manage Section Images</h1>
              <p className="mt-1 text-sm text-gray-600">
                Update images for different sections of the website
              </p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="w-full sm:w-auto px-4 py-2 bg-maroon text-white rounded-lg hover:bg-maroon/90 transition-colors text-sm sm:text-base"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {getSortedSections().map(([sectionName, images]) => (
          <div key={sectionName} className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              {getSectionTitle(sectionName)}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {/* Image Preview */}
                  <div className="relative aspect-square bg-gray-100">
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || 'Section image'}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Image Details */}
                  <div className="p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {image.image_key}
                      </p>
                      <p className="text-xs text-gray-500 mb-3 truncate" title={image.alt_text || 'No alt text'}>
                        {image.alt_text || 'No alt text'}
                      </p>
                      <button
                        onClick={() => handleUploadClick(image)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-maroon text-white rounded-md hover:bg-maroon/90 transition-colors text-sm"
                      >
                        <Upload className="w-4 h-4" />
                        Update Image
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <ImageUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
        currentImageUrl={currentImage?.image_url}
        sectionName={currentImage?.section_name}
        imageKey={currentImage?.image_key}
      />
    </div>
  );
}
