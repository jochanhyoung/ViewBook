import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { recordVisit } from '@/lib/stats';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? req.headers.get('x-real-ip')
    ?? '0.0.0.0';
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);

  try {
    recordVisit(ipHash);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
