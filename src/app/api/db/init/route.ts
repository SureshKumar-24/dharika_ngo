import { NextResponse } from 'next/server';
import { initializeDatabase, testConnection } from '@/lib/db';

/**
 * Initialize database tables
 * Call this endpoint once to set up the database schema
 */
export async function GET() {
  try {
    // Test connection first
    const connectionTest = await testConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: connectionTest.error 
        },
        { status: 500 }
      );
    }

    // Initialize tables
    await initializeDatabase();

    return NextResponse.json(
      {
        success: true,
        message: 'Database initialized successfully',
        timestamp: connectionTest.timestamp,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error initializing database:', error);

    return NextResponse.json(
      {
        error: 'Failed to initialize database',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
