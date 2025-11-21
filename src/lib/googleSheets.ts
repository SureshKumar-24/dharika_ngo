import { google } from 'googleapis';
import type { VolunteerSubmission, SuggestionSubmission } from '@/types/forms';

/**
 * Initialize Google Sheets API client
 */
function getGoogleSheetsClient() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('Error initializing Google Sheets client:', error);
    throw new Error('Failed to initialize Google Sheets client');
  }
}

/**
 * Append volunteer data to Google Sheets
 */
export async function appendVolunteerData(
  data: Omit<VolunteerSubmission, 'timestamp' | 'source'>
): Promise<void> {
  try {
    console.log('📊 [Google Sheets] Starting sync...');
    const sheetId = process.env.GOOGLE_SHEET_ID;
    
    if (!sheetId) {
      console.warn('⚠️  [Google Sheets] GOOGLE_SHEET_ID not configured, skipping sync');
      return;
    }

    console.log('📊 [Google Sheets] Sheet ID:', sheetId);
    console.log('📊 [Google Sheets] Initializing client...');
    const sheets = getGoogleSheetsClient();
    console.log('✅ [Google Sheets] Client initialized');
    
    const timestamp = new Date().toISOString();

    // Prepare row data matching the column structure
    const row = [
      data.name,
      data.phone,
      data.email,
      data.city,
      data.interest,
      data.availability,
      timestamp,
    ];

    console.log('📊 [Google Sheets] Appending row:', row);
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Volunteer List!A:G',
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    });

    console.log('✅ [Google Sheets] Volunteer data appended successfully');
  } catch (error) {
    console.error('❌ [Google Sheets] Error appending volunteer data:', error);
    if (error instanceof Error) {
      console.error('❌ [Google Sheets] Error details:', {
        message: error.message,
        name: error.name,
      });
    }
    if (error && typeof error === 'object') {
      console.error('❌ [Google Sheets] Additional error info:', {
        code: (error as any).code,
        status: (error as any).status,
      });
    }
    // Don't throw error - allow the request to succeed even if Sheets fails
  }
}

/**
 * Append suggestion data to Google Sheets
 */
export async function appendSuggestionData(
  data: Omit<SuggestionSubmission, 'timestamp' | 'source'>
): Promise<void> {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    
    if (!sheetId) {
      console.warn('GOOGLE_SHEET_ID not configured, skipping Google Sheets sync');
      return;
    }

    const sheets = getGoogleSheetsClient();
    const timestamp = new Date().toISOString();

    // Prepare row data matching the column structure
    const row = [
      timestamp,
      data.name || '',
      data.email || '',
      data.message,
      'website',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Suggestions!A:E',
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    });

    console.log('Suggestion data appended successfully to Google Sheets');
  } catch (error) {
    console.error('Error appending suggestion data to Google Sheets:', error);
    // Don't throw error - allow the request to succeed even if Sheets fails
  }
}

/**
 * Check if Google Sheets is properly configured
 */
export function isGoogleSheetsConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_SHEET_ID
  );
}

/**
 * Initialize Google Sheets with headers (run this once to set up the sheets)
 */
export async function initializeVolunteerSheet(): Promise<void> {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID_VOLUNTEER;
    
    if (!sheetId) {
      throw new Error('GOOGLE_SHEET_ID_VOLUNTEER not configured');
    }

    const sheets = getGoogleSheetsClient();
    
    const headers = [
      'Name',
      'Phone',
      'Email',
      'City',
      'Interest',
      'Availability',
      'Timestamp',
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1:G1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers],
      },
    });

    console.log('Volunteer sheet initialized with headers');
  } catch (error) {
    console.error('Error initializing volunteer sheet:', error);
    throw error;
  }
}

/**
 * Initialize Suggestion Sheet with headers (run this once to set up the sheets)
 */
export async function initializeSuggestionSheet(): Promise<void> {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID_SUGGESTION;
    
    if (!sheetId) {
      throw new Error('GOOGLE_SHEET_ID_SUGGESTION not configured');
    }

    const sheets = getGoogleSheetsClient();
    
    const headers = [
      'Timestamp',
      'Name',
      'Email',
      'Message',
      'Source',
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1:E1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers],
      },
    });

    console.log('Suggestion sheet initialized with headers');
  } catch (error) {
    console.error('Error initializing suggestion sheet:', error);
    throw error;
  }
}
