import { NextRequest, NextResponse } from 'next/server';
import { volunteerFormSchema } from '@/lib/validations';
import { insertVolunteer } from '@/lib/db';

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 submissions per hour per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Check honeypot field
    if (body.honeypot) {
      // Silent rejection - return success to fool bots
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Validate data with Zod
    const result = volunteerFormSchema.safeParse(body);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      });

      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // Insert data into Neon database
    const dbResult = await insertVolunteer({
      name: result.data.name,
      phone: result.data.phone,
      email: result.data.email,
      city: result.data.city,
      interest: result.data.interest,
      availability: result.data.availability,
    });

    // Also save to Google Sheets (non-blocking)
    try {
      const { appendVolunteerData } = await import('@/lib/googleSheets');
      await appendVolunteerData({
        name: result.data.name,
        phone: result.data.phone,
        email: result.data.email,
        city: result.data.city,
        interest: result.data.interest,
        availability: result.data.availability,
      });
    } catch (sheetsError) {
      console.error('Failed to sync to Google Sheets:', sheetsError);
      // Continue anyway - database save was successful
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for volunteering! We will contact you soon.',
        id: dbResult.id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing volunteer form:', error);

    return NextResponse.json(
      { error: 'Failed to process your request. Please try again later.' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
