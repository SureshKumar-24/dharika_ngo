/**
 * WhatsApp notification helper using Meta Business API.
 *
 * Uses the official Meta WhatsApp Business API format:
 * https://developers.facebook.com/docs/whatsapp/cloud-api
 */

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_ADMIN_NUMBER = process.env.WHATSAPP_ADMIN_NUMBER;

const META_API_BASE = 'https://graph.facebook.com/v21.0';

interface MetaWhatsAppPayload {
  messaging_product: 'whatsapp';
  to: string;
  type: 'template';
  template: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text?: string;
      }>;
    }>;
  };
}

async function sendMetaWhatsAppTemplate(
  to: string,
  templateName: string,
  parameters: string[]
): Promise<void> {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ADMIN_NUMBER) {
    console.warn(
      '⚠️ [WhatsApp] Missing configuration (WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ADMIN_NUMBER). Skipping WhatsApp notification.'
    );
    return;
  }

  try {
    const payload: MetaWhatsAppPayload = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: 'en',
        },
        components: parameters.length > 0
          ? [
              {
                type: 'body',
                parameters: parameters.map((text) => ({
                  type: 'text',
                  text,
                })),
              },
            ]
          : undefined,
      },
    };

    const url = `${META_API_BASE}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('❌ [WhatsApp] Meta API responded with non-OK status', {
        status: res.status,
        statusText: res.statusText,
        body: text,
      });
    } else {
      const result = await res.json().catch(() => ({}));
      console.log('✅ [WhatsApp] Message sent successfully', result);
    }
  } catch (error) {
    console.error('❌ [WhatsApp] Failed to send notification:', error);
  }
}

export async function sendStudentQueryAlert(params: {
  name: string;
  studentClass: string;
  subject: string;
  topic: string;
  sheetLink?: string;
}) {
  const { name, studentClass, subject, topic, sheetLink } = params;

  // Format message for template parameters
  // Template "studentqueryform" should have parameters: {{1}} = name, {{2}} = class, {{3}} = subject, {{4}} = topic, {{5}} = sheetLink
  const message = `New Student Query Received\n\nName: ${name}\nClass: ${studentClass}\nSubject: ${subject}\nTopic: ${topic}${sheetLink ? `\nSheet: ${sheetLink}` : ''}`;

  // For Meta API, we send parameters that match your template structure
  // Adjust parameter order based on your actual template setup
  await sendMetaWhatsAppTemplate(
    WHATSAPP_ADMIN_NUMBER || '',
    'studentqueryform', // Your template name
    [name, studentClass, subject, topic, sheetLink || 'N/A']
  );
}

export async function sendFoodAlertNotification(params: {
  donorName: string;
  establishment: string;
  address: string;
  quantity: string;
  sheetLink?: string;
}) {
  const { donorName, establishment, address, quantity, sheetLink } = params;

  // Template "foodalert" should have parameters matching your template structure
  // Adjust parameter order based on your actual template setup
  await sendMetaWhatsAppTemplate(
    WHATSAPP_ADMIN_NUMBER || '',
    'foodalert', // Your template name
    [
      donorName,
      establishment,
      address,
      quantity,
      sheetLink || 'N/A',
      'Assign volunteer',
    ]
  );
}




