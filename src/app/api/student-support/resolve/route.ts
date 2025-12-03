import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { StudentQueryResolvedEmail } from '@/lib/email-templates';
import { render } from '@react-email/render';
import React from 'react';

/**
 * Lightweight endpoint to send a resolution email to a student
 * once the coordinator / teacher has added a YouTube link in the
 * "Student Queries" sheet.
 *
 * This is meant to be called from Google Apps Script / Make / Zapier
 * with a simple POST body and does not touch the database.
 */
export async function POST(request: NextRequest) {
  console.log('📧 [Student Support Resolve] POST request received');
  try {
    const body = await request.json();
    console.log('📧 [Student Support Resolve] Body received:', { email: body.email, topic: body.topic });

    const { email, name, topic, videoUrl } = body || {};

    if (!email || !topic || !videoUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: email, topic, videoUrl' },
        { status: 400 }
      );
    }

    const html = await render(
      React.createElement(StudentQueryResolvedEmail, {
        name: name || 'Student',
        topic,
        videoUrl,
      })
    );

    console.log('📧 [Student Support Resolve] Sending email to:', email);
    
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Dharika <onboarding@resend.dev>',
      to: email,
      subject: 'Your learning video from Dharika is ready',
      html,
    });

    console.log('✅ [Student Support Resolve] Email sent successfully');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending student support resolution email:', error);

    return NextResponse.json(
      { error: 'Failed to send resolution email' },
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




