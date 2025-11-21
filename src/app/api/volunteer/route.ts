import { NextRequest, NextResponse } from 'next/server';
import { volunteerFormSchema } from '@/lib/validations';
import { insertVolunteer, checkVolunteerExists } from '@/lib/db';
import { appendVolunteerData } from '@/lib/googleSheets';
import { resend, EMAIL_FROM } from '@/lib/resend';
import { AdminNotificationEmail } from '@/lib/email-templates';
import { render } from '@react-email/render';
import React from 'react';

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
  // FORCE LOG - This should ALWAYS appear
  console.log('🚀🚀🚀 VOLUNTEER API CALLED - Build Time: 2025-01-21T18:30:00Z 🚀🚀🚀');
  console.log('Request received at:', new Date().toISOString());
  
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    console.log('Client IP:', ip);

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

    // Check for duplicate phone or email
    const duplicate = await checkVolunteerExists(result.data.phone, result.data.email);

    if (duplicate.exists) {
      let errorMessage = '';
      if (duplicate.field === 'both') {
        errorMessage = 'This phone number and email are already registered by another volunteer. Please use different contact details.';
      } else if (duplicate.field === 'phone') {
        errorMessage = 'This phone number is already registered by another volunteer. Please use a different phone number.';
      } else {
        errorMessage = 'This email address is already registered by another volunteer. Please use a different email.';
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: 409 }
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

    // Debug: Log environment variables status
    console.log('=== Environment Variables Check ===');
    console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID ? '✅ Set' : '❌ Missing');
    console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ Set' : '❌ Missing');
    console.log('GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? '✅ Set (length: ' + process.env.GOOGLE_PRIVATE_KEY.length + ')' : '❌ Missing');
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM || '❌ Missing');
    console.log('ADMIN_EMAIL_TO:', process.env.ADMIN_EMAIL_TO || '❌ Missing');
    console.log('ADMIN_EMAIL_CC:', process.env.ADMIN_EMAIL_CC || '(not set)');
    console.log('===================================');

    // Sync to Google Sheets (wait for completion)
    console.log('📊 Attempting to sync to Google Sheets...');
    try {
      await appendVolunteerData({
        name: result.data.name,
        phone: result.data.phone,
        email: result.data.email,
        city: result.data.city,
        interest: result.data.interest,
        availability: result.data.availability,
      });
      console.log('✅ Google Sheets sync completed successfully');
    } catch (error) {
      console.error('❌ Failed to sync to Google Sheets:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
        });
      }
      // Don't fail the request if Sheets sync fails - continue anyway
    }

    // Send notification email to admin only (non-blocking)
    console.log('📧 Attempting to send admin notification email...');
    try {
      // Hardcoded admin email - no environment variable needed
      const adminEmailTo = 'dharika.co@gmail.com';
      const adminEmailCc = process.env.ADMIN_EMAIL_CC;

      console.log('Email config:', {
        from: 'Dharika <onboarding@resend.dev>',
        to: adminEmailTo,
        cc: adminEmailCc || '(none)',
      });

      if (adminEmailTo) {
        console.log('🔨 Rendering email template...');
        const adminEmailHtml = await render(
          React.createElement(AdminNotificationEmail, {
            volunteerName: result.data.name,
            phone: result.data.phone,
            email: result.data.email,
            city: result.data.city,
            interest: result.data.interest,
            availability: result.data.availability,
          })
        );
        console.log('✅ Email template rendered successfully');

        const emailOptions: any = {
          from: 'Dharika <onboarding@resend.dev>',
          to: adminEmailTo,
          subject: `New Volunteer Registration: ${result.data.name}`,
          html: adminEmailHtml,
        };

        // Add CC if provided
        if (adminEmailCc && adminEmailCc.trim()) {
          emailOptions.cc = adminEmailCc;
        }

        console.log('📤 Sending email via Resend...');
        const emailResult = await resend.emails.send(emailOptions);
        console.log('✅ Email sent successfully!', emailResult);
        console.log('Admin notification email sent to:', adminEmailTo);
        if (adminEmailCc) {
          console.log('CC:', adminEmailCc);
        }
      }
    } catch (error) {
      console.error('❌ Failed to send admin notification email');
      if (error instanceof Error) {
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else {
        console.error('Unknown error:', error);
      }
      if (error && typeof error === 'object' && 'response' in error) {
        console.error('API Response:', (error as any).response);
      }
      // Don't fail the request if email fails
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
  console.log('🚀 GET request to volunteer API - Build: 2025-01-21T18:30:00Z');
  return NextResponse.json(
    { 
      error: 'Method not allowed',
      debug: {
        buildTime: '2025-01-21T18:30:00Z',
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasGoogleSheetId: !!process.env.GOOGLE_SHEET_ID,
        hasAdminEmail: !!process.env.ADMIN_EMAIL_TO,
      }
    },
    { status: 405 }
  );
}
