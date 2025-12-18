import { NextResponse } from 'next/server';
import { getFoodAlerts } from '@/lib/db';

export async function GET() {
  try {
    const alerts = await getFoodAlerts();
    return NextResponse.json({ alerts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching food alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch food alerts' },
      { status: 500 }
    );
  }
}
