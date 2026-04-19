import { NextResponse } from 'next/server';
import { getStats } from '@/lib/stats';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(getStats(), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
