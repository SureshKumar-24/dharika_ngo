import { NextRequest, NextResponse } from 'next/server';
import { getAllSectionImages, getSectionImages } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (section) {
      // Get images for specific section
      const images = await getSectionImages(section);
      return NextResponse.json({ images }, { status: 200 });
    }

    // Get all section images
    const images = await getAllSectionImages();
    
    // Group by section
    const grouped = images.reduce((acc, image) => {
      if (!acc[image.section_name]) {
        acc[image.section_name] = [];
      }
      acc[image.section_name].push(image);
      return acc;
    }, {} as Record<string, typeof images>);

    return NextResponse.json({ sections: grouped }, { status: 200 });
  } catch (error) {
    console.error('Error fetching section images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch section images' },
      { status: 500 }
    );
  }
}
