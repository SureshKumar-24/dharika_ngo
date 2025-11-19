import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * Webhook endpoint for on-demand revalidation
 * Triggered by Notion when content is updated
 */
export async function POST(request: NextRequest) {
  try {
    // Get the secret from query params or body
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret');

    // Verify the secret
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Parse request body to get specific paths to revalidate
    let paths: string[] = ['/'];
    
    try {
      const body = await request.json();
      if (body.paths && Array.isArray(body.paths)) {
        paths = body.paths;
      }
    } catch {
      // If no body or invalid JSON, just revalidate home page
    }

    // Revalidate the specified paths
    for (const path of paths) {
      revalidatePath(path);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Revalidated ${paths.length} path(s)`,
        paths,
        revalidatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in revalidation:', error);

    return NextResponse.json(
      {
        error: 'Failed to revalidate',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (for testing)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: 'Invalid secret' },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      message: 'Revalidation endpoint is working',
      usage: 'POST to this endpoint with secret query param to trigger revalidation',
      example: '/api/revalidate?secret=YOUR_SECRET',
    },
    { status: 200 }
  );
}
