import { NextResponse } from 'next/server';

// This route can be used to set cache headers for static assets
export async function GET() {
  return NextResponse.json(
    { message: 'Cache headers configured' },
    {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
}
