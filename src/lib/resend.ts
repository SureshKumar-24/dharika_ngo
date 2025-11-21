import { Resend } from 'resend';

console.log('📧 [Resend] Initializing email client...');
console.log('📧 [Resend] API Key present:', !!process.env.RESEND_API_KEY);
console.log('📧 [Resend] EMAIL_FROM:', process.env.EMAIL_FROM || 'Dharika <onboarding@resend.dev>');

if (!process.env.RESEND_API_KEY) {
  console.error('❌ [Resend] RESEND_API_KEY is not defined in environment variables');
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);
console.log('✅ [Resend] Email client initialized successfully');

export const EMAIL_FROM = process.env.EMAIL_FROM || 'Dharika <onboarding@resend.dev>';
