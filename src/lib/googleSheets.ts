import { google } from 'googleapis';
import type { VolunteerSubmission, SuggestionSubmission } from '@/types/forms';

/**
 * Initialize Google Sheets API client
 * Hardcoded credentials to avoid environment variable issues on Vercel
 */
function getGoogleSheetsClient() {
  try {
    console.log('🔧 [Google Sheets] Initializing client with hardcoded credentials...');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: 'dharika-ngo@valuebet-geocoding.iam.gserviceaccount.com',
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCf476Go9mZEXY3\nVKQo5qlg1hq2xB+7RKLM4dzaE+5A4iBAA/aF+2JtNOcRgTkO/yKbr+ftcnhplDjK\nzf5/ZeHIUYGfSbXiIKWLoEE6PqKs7OoEq+J3zY699cfyTNa2YD79LDlOKjH+MnAk\nR0TER2P3mp2MhHBihjVdmVIYVuZ+NdB7y5q0638vUc94nVBRJpWFw+YyL57mQFb1\ntwVrnqEl6PgR254x6/MbQ5MoyRU+KYgcZsHMPn+56qd/3kLOYK5GKenfd6YiXoB1\n9Pib1DIM9eGIWyvPI9zLWwhjpykFwORYRKiQ4NQmA1H+pHPORVae4I4Uu8rOlXag\nP+MakVGPAgMBAAECggEAAwoYyUVxxwD3ztXLPcMjbXr/IgH4xR4TvDJU+POlCqhh\nyuW9uM6juzC6GHFCQkCOX12eL+YxAiIhButDOcJtjYR4eCyLX8OVcgyMq4yc72Ly\nOz7V53IfEwm05dcZGSQbk8N/SWGa9q/txXrHWgsuDCXCdfU0j7g+aSDs2G1FJMQI\nbmIvOqK92ZiLU04iBjxiFJNi0DFyWRNVo8tSf3wZ42J4rv/PC57vcr1FFUiWGKyw\nG5pXkMRqPUr+nZURE1YSSyrG1/C3y5s4k5E0y9p/35fWl2RqpxKdoUf6ArW6XYnE\nYAXe0Ow9fqSRzzslMC+XALtPUNweZeA7toAYdm9YJQKBgQDNIALsCvMPxfOeg+di\nHY0nW/Wau2u7EWohgPDcXnV4aoO17My5fWUSTiiuC3MjFlrpXHkXm0q5jkRYlgvD\nBT49YWTlfcBTm2MaY03bEjFuwT9WrL+KAp/eyREImFHJgpVXGbKyoQNaW26RSqat\n5gHGkkaphRduS3MO4oF1RwluIwKBgQDHi5qYpUAVehF1cpQpyO/6LO3kztSg6EB4\nAb6ZoNmPTmFf1+ZwG2BEW2SQRcgMinv1ByOjdMzvor+izc369akKjB9k4XsZ4j+M\nRKFbCKrd/WE6bn5o4bpncaPWwv8fWK0PMDRK6cqw2eBhiTm5B9n5H3nLC815UMN8\nuJyiY9InpQKBgE8UkkvSBNcF5+Aq1h+baPnNmChpLSVXl2UHQtSSjhM4bULL4jl4\nwGiIPWKsA115lt70ybJyKiLTWEIWxr4O3WnojG91RZp2A4T+19snbmtWkUanHsjk\nLiJDvg9kOdPIRi7oN15qeNJzAXN+JjhQvkqBxkBAkUHyUI9if6ppEpelAoGBALJb\nU9lwizEnJIfH3CrlEaqZkiFbxa31KfqaBJUoso1mz55tSemWbptq3R4fYUnkVhuT\nQAWQFsVywLtyHNRd07Q7vqva5r8h/Q8RIPBPdPpqygcCUDbK3GQtrPX+4S5Rgo36\n1iLHiYY9mFNV5qQ+IlSMD76vU/9FcxX9pPN5KZSJAoGAHpQjQDq9UagYE1+ERGqv\np/WBvnMaVxMSY4w7fzC7xzOMD3+4PYTF41BJzqfKTv02UiEipxTHgXysISPdW01S\n8+/nt1VvgL0dNax53cyKrxy/dWVbSpa7yWlGevgA/ACN+Ax29/OKbzk4vN7In1+u\nC/bl8VvIgKhzBF//3A//TYA=\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    console.log('✅ [Google Sheets] Client initialized successfully');
    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('❌ [Google Sheets] Error initializing client:', error);
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
    // Hardcoded sheet ID to avoid environment variable issues
    const sheetId = '1tz65PQ71Ycvpadixd2EoC1teXD0MTs5SV11Y856wQG4';
    
    if (!sheetId) {
      console.warn('⚠️  [Google Sheets] GOOGLE_SHEET_ID not configured, skipping sync');
      return;
    }

    console.log('📊 [Google Sheets] Sheet ID:', sheetId);
    console.log('📊 [Google Sheets] Initializing client...');
    const sheets = getGoogleSheetsClient();
    console.log('✅ [Google Sheets] Client initialized');
    
    // Format timestamp in Indian format: DD/MM/YYYY HH:MM:SS
    const now = new Date();
    const timestamp = now.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata'
    });

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
      insertDataOption: 'INSERT_ROWS',
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
    
    // Format timestamp in Indian format: DD/MM/YYYY HH:MM:SS
    const now = new Date();
    const timestamp = now.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata'
    });

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
      insertDataOption: 'INSERT_ROWS',
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
