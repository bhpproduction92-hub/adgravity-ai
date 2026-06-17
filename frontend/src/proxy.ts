import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  if (url.pathname === '/') {
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
