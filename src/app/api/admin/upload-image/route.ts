import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Check if user is authenticated
async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('admin_auth');
  return authToken?.value === process.env.ADMIN_SECRET_TOKEN;
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file size (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary with signed upload
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'Dharika/gallery';
    
    // Generate signature for secure upload
    const signature = await generateSignature(timestamp, folder);

    const uploadData = new URLSearchParams();
    uploadData.append('file', base64Image);
    uploadData.append('folder', folder);
    uploadData.append('timestamp', timestamp.toString());
    uploadData.append('api_key', process.env.CLOUDINARY_API_KEY!);
    uploadData.append('signature', signature);

    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: uploadData.toString(),
    });

    if (!cloudinaryResponse.ok) {
      const error = await cloudinaryResponse.text();
      console.error('Cloudinary error:', error);
      return NextResponse.json(
        { error: 'Failed to upload image to Cloudinary' },
        { status: 500 }
      );
    }

    const result = await cloudinaryResponse.json();

    return NextResponse.json(
      {
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

async function generateSignature(timestamp: number, folder: string): Promise<string> {
  const crypto = require('crypto');
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
  return crypto.createHash('sha1').update(paramsToSign).digest('hex');
}
