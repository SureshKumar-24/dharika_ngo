import { NextResponse } from 'next/server';
import { testConnection, getVolunteers, getSuggestions } from '@/lib/db';

/**
 * Test database connection and query data
 */
export async function GET() {
  try {
    // Test connection
    const connectionTest = await testConnection();

    if (!connectionTest.success) {
      return NextResponse.json(
        {
          error: 'Database connection failed',
          details: connectionTest.error,
        },
        { status: 500 }
      );
    }

    // Get recent data
    const volunteers = await getVolunteers(5) as any[];
    const suggestions = await getSuggestions(5) as any[];

    return NextResponse.json(
      {
        success: true,
        message: 'Database connection successful',
        timestamp: connectionTest.timestamp,
        data: {
          volunteers: {
            count: volunteers.length,
            recent: volunteers,
          },
          suggestions: {
            count: suggestions.length,
            recent: suggestions,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error testing database:', error);

    return NextResponse.json(
      {
        error: 'Database test failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
