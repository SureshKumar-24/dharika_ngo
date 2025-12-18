/**
 * Test script to verify Google Sheets setup and test data insertion
 */

import { appendStudentQueryData, appendFoodAlertData } from '../src/lib/googleSheets';

async function testGoogleSheets() {
  console.log('🧪 Testing Google Sheets Integration...\n');

  // Test 1: Student Query
  console.log('📝 Test 1: Inserting Student Query...');
  try {
    await appendStudentQueryData({
      name: 'Test Student',
      age: '15',
      city: 'Abohar',
      locality: 'Test Area',
      studentClass: '10',
      subject: 'Mathematics',
      topic: 'Quadratic Equations - Test Query',
      phone: '9876543210',
      email: 'test@example.com',
      attendingOfflineClasses: 'no',
    });
    console.log('✅ Student Query inserted successfully!\n');
  } catch (error) {
    console.error('❌ Student Query failed:', error);
    console.error('\n');
  }

  // Test 2: Food Alert
  console.log('📝 Test 2: Inserting Food Alert...');
  try {
    await appendFoodAlertData({
      donorType: 'restaurant',
      establishmentName: 'Test Restaurant',
      contactPersonName: 'Test Contact',
      phone: '9876543210',
      address: 'Test Address, Test Locality',
      city: 'Ambala',
      quantity: '50 people',
      preparedAt: '2:00 PM today',
      expiryEstimate: '4_hours',
      photoUrl: '',
    });
    console.log('✅ Food Alert inserted successfully!\n');
  } catch (error) {
    console.error('❌ Food Alert failed:', error);
    console.error('\n');
  }

  console.log('🎉 Test completed! Check your Google Sheet:');
  console.log('https://docs.google.com/spreadsheets/d/1tz65PQ71Ycvpadixd2EoC1teXD0MTs5SV11Y856wQG4/edit');
}

testGoogleSheets();
