import { NextRequest, NextResponse } from 'next/server';
import { foodAlertFormSchema } from '@/lib/validations';
import { appendFoodAlertData } from '@/lib/googleSheets';
import { sendFoodAlertNotification } from '@/lib/whatsapp';

// Simple in-memory rate limiting (per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 30 * 60 * 1000; // 30 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;

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
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    if (body.honeypot) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const parsed = foodAlertFormSchema.safeParse(body);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      });

      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 1) Save to database
    try {
      const { insertFoodAlert } = await import('@/lib/db');
      await insertFoodAlert({
        donorType: data.donorType,
        establishmentName: data.establishmentName,
        contactPersonName: data.contactPersonName,
        phone: data.phone,
        address: data.address,
        city: data.city,
        quantity: data.quantity,
        preparedAt: data.preparedAt,
        expiryEstimate: data.expiryEstimate,
        photoUrl: data.photoUrl,
      });
    } catch (dbError) {
      console.error('❌ Failed to save food alert to database:', dbError);
      // Continue even if database save fails
    }

    // 2) Append to Google Sheets
    await appendFoodAlertData({
      donorType: data.donorType,
      establishmentName: data.establishmentName,
      contactPersonName: data.contactPersonName,
      phone: data.phone,
      address: data.address,
      city: data.city,
      quantity: data.quantity,
      preparedAt: data.preparedAt,
      expiryEstimate: data.expiryEstimate,
      photoUrl: data.photoUrl,
      pickupPhotoUrl: '',
      deliveryPhotoUrl: '',
    });

    // 3) Fire-and-forget WhatsApp alert for admin / coordinator
    void sendFoodAlertNotification({
      donorName: data.contactPersonName,
      establishment: data.establishmentName,
      address: `${data.address}, ${data.city}`,
      quantity: data.quantity,
      sheetLink: process.env.FOOD_ALERTS_SHEET_URL,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          'Thank you for your generosity. Our team will assign a volunteer to coordinate pickup shortly.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing food alert:', error);

    return NextResponse.json(
      { error: 'Failed to process your request. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}




