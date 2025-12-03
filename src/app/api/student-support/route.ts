import { NextRequest, NextResponse } from 'next/server';
import { studentQueryFormSchema } from '@/lib/validations';
import { appendStudentQueryData } from '@/lib/googleSheets';
import { resend } from '@/lib/resend';
import { StudentQueryReceivedEmail } from '@/lib/email-templates';
import { render } from '@react-email/render';
import React from 'react';
import { sendStudentQueryAlert } from '@/lib/whatsapp';

// Simple in-memory rate limiting (per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
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

    const parsed = studentQueryFormSchema.safeParse(body);

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

    // 1) Append to Google Sheets
    await appendStudentQueryData({
      name: data.name,
      age: data.age,
      city: data.city,
      locality: data.locality,
      studentClass: data.studentClass,
      subject: data.subject,
      topic: data.topic,
      phone: data.phone,
      email: data.email,
      attendingOfflineClasses: data.attendingOfflineClasses,
    });

    // 2) Fire-and-forget WhatsApp alert to coordinator
    void sendStudentQueryAlert({
      name: data.name,
      studentClass: data.studentClass,
      subject: data.subject,
      topic: data.topic,
      sheetLink: process.env.STUDENT_QUERIES_SHEET_URL,
    });

    // 3) Email acknowledgement to student (blocking so we can surface errors)
    try {
      const subjectLabelMap: Record<string, string> = {
        maths: 'Maths',
        english: 'English',
        hindi: 'Hindi',
        science: 'Science',
        other: 'Other',
      };

      const emailHtml = await render(
        React.createElement(StudentQueryReceivedEmail, {
          name: data.name,
          subjectLabel: subjectLabelMap[data.subject] || 'Your chosen subject',
          topic: data.topic,
        })
      );

      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'Dharika <onboarding@resend.dev>',
        to: data.email,
        subject: 'We’ve received your learning query',
        html: emailHtml,
      });
    } catch (error) {
      console.error('❌ Failed to send student query acknowledgement email', error);
      // Do not fail the request if email sending fails
    }

    return NextResponse.json(
      {
        success: true,
        message:
          'Your question has been submitted. You will receive a video solution within 12 hours.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing student support query:', error);

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




