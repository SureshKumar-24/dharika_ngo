import { NextRequest, NextResponse } from 'next/server';

/**
 * Test endpoint to verify WhatsApp API credentials
 * This sends a simple text message without requiring templates
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { testMessage } = body;

        const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER;

        if (!accessToken || !phoneNumberId || !adminNumber) {
            return NextResponse.json(
                {
                    error: 'WhatsApp credentials not configured',
                    missing: {
                        accessToken: !accessToken,
                        phoneNumberId: !phoneNumberId,
                        adminNumber: !adminNumber,
                    },
                },
                { status: 400 }
            );
        }

        // Send a simple text message (works without templates for testing)
        const response = await fetch(
            `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: adminNumber,
                    type: 'text',
                    text: {
                        body: testMessage || '🧪 Test message from Dharika NGO!\n\nYour WhatsApp integration is working! ✅',
                    },
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('WhatsApp API error:', data);
            return NextResponse.json(
                {
                    success: false,
                    error: data.error?.message || 'Failed to send WhatsApp message',
                    details: data,
                },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'WhatsApp test message sent successfully!',
            messageId: data.messages?.[0]?.id,
            sentTo: adminNumber,
            data,
        });
    } catch (error) {
        console.error('Test WhatsApp error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'WhatsApp Test Endpoint',
        usage: 'Send POST request with optional { "testMessage": "your message" }',
        credentials: {
            accessToken: !!process.env.WHATSAPP_ACCESS_TOKEN,
            phoneNumberId: !!process.env.WHATSAPP_PHONE_NUMBER_ID,
            adminNumber: !!process.env.WHATSAPP_ADMIN_NUMBER,
        },
    });
}
