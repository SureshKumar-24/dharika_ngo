import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllSectionImages, updateSectionImage } from '@/lib/db';

// Check if user is authenticated
async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('admin_auth');
  return authToken?.value === process.env.ADMIN_SECRET_TOKEN;
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
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

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, image_url, alt_text, display_order } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    await updateSectionImage(id, {
      image_url,
      alt_text,
      display_order,
    });

    return NextResponse.json(
      { success: true, message: 'Image updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating section image:', error);
    return NextResponse.json(
      { error: 'Failed to update section image' },
      { status: 500 }
    );
  }
}
