import { NextResponse } from 'next/server';
import { getSuggestions } from '@/lib/db';

export async function GET() {
  try {
    const suggestions = await getSuggestions(1000);
    
    return NextResponse.json(
      { suggestions },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}
