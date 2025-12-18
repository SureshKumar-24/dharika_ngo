import { NextResponse } from 'next/server';
import { getStudentQueries } from '@/lib/db';

export async function GET() {
  try {
    const queries = await getStudentQueries();
    return NextResponse.json({ queries }, { status: 200 });
  } catch (error) {
    console.error('Error fetching student queries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student queries' },
      { status: 500 }
    );
  }
}
