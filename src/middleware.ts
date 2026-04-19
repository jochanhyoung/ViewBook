import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/teacher')) {
    const auth = req.headers.get('authorization');
    const expected = 'Basic ' + Buffer.from(`admin:${process.env.TEACHER_PASSWORD ?? 'changeme'}`).toString('base64');
    if (auth !== expected) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Teacher Area"' },
      });
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/teacher/:path*'] };
