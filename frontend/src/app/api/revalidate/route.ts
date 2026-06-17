import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Revalidate critical routes to invalidate caches at edge network/CDN levels
    revalidatePath('/', 'layout');
    revalidatePath('/about');
    revalidatePath('/contact');
    revalidatePath('/admin/control-center');
    revalidatePath('/dashboard');
    
    return NextResponse.json({
      success: true,
      message: 'Global edge cache invalidated successfully across Vercel and Next.js CDN routing pools.',
      timestamp: new Date().toISOString(),
      clearedPaths: ['/', '/about', '/contact', '/admin/control-center', '/dashboard']
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error occurred during cache revalidation.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
