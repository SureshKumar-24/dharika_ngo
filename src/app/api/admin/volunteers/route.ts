import { NextResponse } from 'next/server';
import { getVolunteers } from '@/lib/db';

export async function GET() {
  try {
    const volunteers = await getVolunteers(1000);
    
    return NextResponse.json(
      { volunteers },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch volunteers' },
      { status: 500 }
    );
  }
}
