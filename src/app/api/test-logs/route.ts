import { NextResponse } from 'next/server';

export async function GET() {
  console.log('='.repeat(80));
  console.log('🧪 TEST LOGS ENDPOINT CALLED');
  console.log('Build Time: 2025-01-21T18:30:00Z');
  console.log('Current Time:', new Date().toISOString());
  console.log('='.repeat(80));
  
  console.log('\n📋 Environment Variables Check:');
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ SET' : '❌ MISSING');
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM || '❌ MISSING');
  console.log('ADMIN_EMAIL_TO:', process.env.ADMIN_EMAIL_TO || '❌ MISSING');
  console.log('ADMIN_EMAIL_CC:', process.env.ADMIN_EMAIL_CC || '(not set)');
  console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID ? '✅ SET' : '❌ MISSING');
  console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ SET' : '❌ MISSING');
  console.log('GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? `✅ SET (${process.env.GOOGLE_PRIVATE_KEY.length} chars)` : '❌ MISSING');
  
  console.log('\n✅ Test logs completed successfully!');
  console.log('='.repeat(80));

  return NextResponse.json({
    success: true,
    message: 'Test logs printed to console. Check Vercel function logs.',
    buildTime: '2025-01-21T18:30:00Z',
    timestamp: new Date().toISOString(),
    env: {
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasEmailFrom: !!process.env.EMAIL_FROM,
      hasAdminEmail: !!process.env.ADMIN_EMAIL_TO,
      hasGoogleSheetId: !!process.env.GOOGLE_SHEET_ID,
      hasServiceAccount: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length || 0,
    }
  });
}
