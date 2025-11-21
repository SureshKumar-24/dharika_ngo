import { config } from 'dotenv';
import { google } from 'googleapis';

// Load environment variables
config({ path: '.env.local' });

async function initializeGoogleSheets() {
  try {
    console.log('🚀 Initializing Google Sheets...\n');

    // Check environment variables
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!sheetId || !serviceAccountEmail || !privateKey) {
      throw new Error(
        'Missing required environment variables. Please check GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, and GOOGLE_PRIVATE_KEY in .env.local'
      );
    }

    console.log('✅ Environment variables found');
    console.log(`📊 Spreadsheet ID: ${sheetId}`);
    console.log(`📧 Service Account: ${serviceAccountEmail}\n`);

    // Initialize Google Sheets client
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Initialize Volunteer List sheet
    console.log('📝 Setting up "Volunteer List" sheet...');
    const volunteerHeaders = [
      'Name',
      'Phone',
      'Email',
      'City',
      'Interest',
      'Availability',
      'Timestamp',
    ];

    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Volunteer List!A1:G1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [volunteerHeaders],
        },
      });
      console.log('✅ "Volunteer List" sheet initialized with headers\n');
    } catch (error: any) {
      if (error.message?.includes('Unable to parse range')) {
        console.log('⚠️  Sheet "Volunteer List" not found. Please create it manually in your spreadsheet.\n');
      } else {
        throw error;
      }
    }

    // Initialize Suggestions sheet
    console.log('📝 Setting up "Suggestions" sheet...');
    const suggestionHeaders = ['Timestamp', 'Name', 'Email', 'Message', 'Source'];

    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Suggestions!A1:E1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [suggestionHeaders],
        },
      });
      console.log('✅ "Suggestions" sheet initialized with headers\n');
    } catch (error: any) {
      if (error.message?.includes('Unable to parse range')) {
        console.log('⚠️  Sheet "Suggestions" not found. Please create it manually in your spreadsheet.\n');
      } else {
        throw error;
      }
    }

    console.log('🎉 Google Sheets initialization complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Make sure you have shared the spreadsheet with:', serviceAccountEmail);
    console.log('2. Give the service account "Editor" permissions');
    console.log('3. Verify the sheet tabs are named "Volunteer List" and "Suggestions"');
    console.log('\n✨ Your volunteer form submissions will now sync to Google Sheets!');
  } catch (error) {
    console.error('❌ Error initializing Google Sheets:', error);
    process.exit(1);
  }
}

initializeGoogleSheets();
