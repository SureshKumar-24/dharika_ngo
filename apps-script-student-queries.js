/**
 * Google Apps Script for Student Queries Sheet
 * 
 * This script automatically sends an email to students when a YouTube video link
 * is pasted into the "Response Link" column.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Student Queries sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste this entire code
 * 4. Replace YOUR_DOMAIN below with your actual website URL (e.g., https://dharika.org)
 * 5. Click Save
 * 6. Click Run → Authorize the script
 * 7. Test by adding a YouTube URL to the Response Link column
 */

const BASE_URL = 'YOUR_DOMAIN'; // ⚠️ REPLACE THIS with your actual domain, e.g., https://dharika.org

// Sheet name - change this if your sheet tab has a different name
// Update this to match your actual sheet tab name (e.g., 'Sheet1', 'Student Queries')
var SHEET_NAME = 'Sheet1';

/**
 * Helper function to find sheet by name (case-insensitive, flexible matching)
 */
function findSheetByName(name) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const allSheets = spreadsheet.getSheets();
  
  // Try exact match first (case-insensitive)
  for (let i = 0; i < allSheets.length; i++) {
    if (allSheets[i].getName().toLowerCase().trim() === name.toLowerCase().trim()) {
      return allSheets[i];
    }
  }
  
  // Try partial match (contains the name)
  for (let i = 0; i < allSheets.length; i++) {
    const sheetName = allSheets[i].getName().toLowerCase().trim();
    if (sheetName.includes('student') && sheetName.includes('quer')) {
      return allSheets[i];
    }
  }
  
  return null;
}

/**
 * Debug function - Lists all available sheets in the spreadsheet
 * Run this first to see what sheets are available
 */
function listAllSheets() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const allSheets = spreadsheet.getSheets();
  
  Logger.log('📋 Available sheets in this spreadsheet:');
  for (let i = 0; i < allSheets.length; i++) {
    Logger.log('  ' + (i + 1) + '. "' + allSheets[i].getName() + '"');
  }
  Logger.log('');
  Logger.log('💡 Update SHEET_NAME constant in the script to match one of these names.');
}

function onEdit(e) {
  // Handle manual execution (when Run button is clicked)
  if (!e || !e.source) {
    Logger.log('⚠️ onEdit called manually. Use testSendResolutionEmail() function to test, or edit a cell in the sheet.');
    return;
  }

  const sheet = e.source.getActiveSheet();
  
  // Only run on the target sheet (case-insensitive check)
  const currentSheetName = sheet.getName().toLowerCase().trim();
  const targetSheetName = SHEET_NAME.toLowerCase().trim();
  if (currentSheetName !== targetSheetName && !currentSheetName.includes('student')) return;

  const editedRange = e.range;
  const headerRow = 1;
  const row = editedRange.getRow();

  // Ignore header row
  if (row === headerRow) return;

  // Find column indexes by header name (case-insensitive search)
  const headers = sheet.getRange(headerRow, 1, 1, sheet.getLastColumn()).getValues()[0];
  const colEmail = headers.findIndex(h => h && h.toString().toLowerCase().includes('email')) + 1;
  const colName = headers.findIndex(h => h && h.toString().toLowerCase().includes('name')) + 1;
  const colTopic = headers.findIndex(h => h && h.toString().toLowerCase().includes('topic')) + 1;
  const colResponseLink = headers.findIndex(h => h && h.toString().toLowerCase().includes('response')) + 1;

  // If columns not found, log and exit
  if (!colEmail || !colResponseLink) {
    Logger.log('⚠️ Could not find required columns (Email or Response Link)');
    return;
  }

  // Only react when "Response Link" cell is edited
  if (editedRange.getColumn() !== colResponseLink) return;

  const videoUrl = sheet.getRange(row, colResponseLink).getValue();
  if (!videoUrl || videoUrl.trim() === '') return; // Empty cell, do nothing

  const email = sheet.getRange(row, colEmail).getValue();
  const name = sheet.getRange(row, colName).getValue() || 'Student';
  const topic = sheet.getRange(row, colTopic).getValue() || 'Your topic';

  if (!email || email.trim() === '') {
    Logger.log('⚠️ No email found for row ' + row);
    return;
  }

  const payload = {
    email: email.trim(),
    name: name.trim(),
    topic: topic.trim(),
    videoUrl: videoUrl.trim(),
  };

  // Remove trailing slash from BASE_URL if present, then add API path
  const baseUrl = BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  const url = baseUrl + '/api/student-support/resolve';

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    Logger.log('📧 Sending resolution email to: ' + email);
    Logger.log('🔗 Video URL: ' + videoUrl);
    
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log('📬 API Response Code: ' + responseCode);
    Logger.log('📬 API Response: ' + responseText);
    
    if (responseCode === 200) {
      Logger.log('✅ Successfully sent resolution email to ' + email);
    } else {
      Logger.log('❌ Failed to send email. Status: ' + responseCode);
      Logger.log('Response: ' + responseText);
    }
  } catch (error) {
    Logger.log('❌ Error calling API: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
  }
}

/**
 * Test function - Run this manually to test the email sending functionality
 * Replace the row number with an actual row that has data
 */
function testSendResolutionEmail() {
  // First, try to find the sheet
  let sheet = findSheetByName(SHEET_NAME);
  
  if (!sheet) {
    Logger.log('❌ Could not find sheet named "' + SHEET_NAME + '"');
    Logger.log('');
    Logger.log('🔍 Run listAllSheets() function first to see available sheets.');
    Logger.log('💡 Then update the SHEET_NAME constant at the top of this script.');
    return;
  }
  
  Logger.log('✅ Found sheet: "' + sheet.getName() + '"');
  Logger.log('');

  const headerRow = 1;
  const headers = sheet.getRange(headerRow, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  Logger.log('📋 Column Headers Found:');
  for (let i = 0; i < headers.length; i++) {
    if (headers[i]) {
      Logger.log('  Column ' + (i + 1) + ': "' + headers[i] + '"');
    }
  }
  Logger.log('');

  const colEmail = headers.findIndex(h => h && h.toString().toLowerCase().includes('email')) + 1;
  const colName = headers.findIndex(h => h && h.toString().toLowerCase().includes('name')) + 1;
  const colTopic = headers.findIndex(h => h && h.toString().toLowerCase().includes('topic')) + 1;
  const colResponseLink = headers.findIndex(h => h && h.toString().toLowerCase().includes('response')) + 1;

  Logger.log('🔍 Column Positions:');
  Logger.log('  Email column: ' + (colEmail || 'NOT FOUND'));
  Logger.log('  Name column: ' + (colName || 'NOT FOUND'));
  Logger.log('  Topic column: ' + (colTopic || 'NOT FOUND'));
  Logger.log('  Response Link column: ' + (colResponseLink || 'NOT FOUND'));
  Logger.log('');

  if (!colEmail || !colResponseLink) {
    Logger.log('❌ Could not find required columns (Email or Response Link)');
    Logger.log('💡 Make sure your sheet has columns named "Email" and "Response Link"');
    return;
  }

  // Find first row with data (skip header row)
  let testRow = 2;
  const lastRow = sheet.getLastRow();
  
  Logger.log('📊 Checking rows 2 to ' + lastRow + ' for data...');
  
  // Try to find a row with both email and response link
  let foundRow = null;
  for (let row = 2; row <= lastRow; row++) {
    const email = sheet.getRange(row, colEmail).getValue();
    const videoUrl = sheet.getRange(row, colResponseLink).getValue();
    
    if (email && email.toString().trim() !== '') {
      Logger.log('  Row ' + row + ': Has email = "' + email + '"');
      if (videoUrl && videoUrl.toString().trim() !== '') {
        Logger.log('  Row ' + row + ': Has Response Link = "' + videoUrl + '" ✅');
        foundRow = row;
        break;
      } else {
        Logger.log('  Row ' + row + ': Missing Response Link');
      }
    }
  }
  Logger.log('');

  if (!foundRow) {
    Logger.log('⚠️ No row found with both email and Response Link.');
    Logger.log('💡 Add a YouTube URL to the "Response Link" column for a row that has an email.');
    return;
  }

  testRow = foundRow;
  Logger.log('✅ Using row ' + testRow + ' for testing');

  const email = sheet.getRange(testRow, colEmail).getValue();
  const name = sheet.getRange(testRow, colName).getValue() || 'Student';
  const topic = sheet.getRange(testRow, colTopic).getValue() || 'Your topic';
  const videoUrl = sheet.getRange(testRow, colResponseLink).getValue();

  Logger.log('🧪 Test Data:');
  Logger.log('  Row: ' + testRow);
  Logger.log('  Email: ' + email);
  Logger.log('  Name: ' + name);
  Logger.log('  Topic: ' + topic);
  Logger.log('  Video URL: ' + videoUrl);
  Logger.log('');

  const payload = {
    email: email.trim(),
    name: name.trim(),
    topic: topic.trim(),
    videoUrl: videoUrl.trim(),
  };

  // Remove trailing slash from BASE_URL if present, then add API path
  const baseUrl = BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  const url = baseUrl + '/api/student-support/resolve';

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    Logger.log('📤 Sending request to: ' + url);
    
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log('📬 API Response Code: ' + responseCode);
    Logger.log('📬 API Response: ' + responseText);
    
    if (responseCode === 200) {
      Logger.log('✅ Successfully sent resolution email to ' + email);
    } else {
      Logger.log('❌ Failed to send email. Status: ' + responseCode);
      Logger.log('Response: ' + responseText);
    }
  } catch (error) {
    Logger.log('❌ Error calling API: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
  }
}

