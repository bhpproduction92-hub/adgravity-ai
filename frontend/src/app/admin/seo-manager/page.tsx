'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const SEOManagerForm = dynamic(() => import('./SEOManagerForm'), {
  loading: () => (
    <div className="flex-1 flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-400">Loading SEO Configuration Console...</span>
      </div>
    </div>
  ),
  ssr: false, // Client-only component as it accesses localStorage on mount
});

export default function SEOManagerPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-150 flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-12">
      {/* Top Navbar */}
      <header className="w-full bg-[#0c0f18]/85 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center">
              <span className="text-base font-bold text-white">A</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white font-heading">
              AdGravity<span className="text-indigo-400">.AI</span> Master SEO
            </span>
          </div>

          <button 
            onClick={() => router.push('/admin/control-center')}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-all"
          >
            ← Admin Control
          </button>
        </div>
      </header>

      {/* Dynamic Form Component */}
      <SEOManagerForm />
    </div>
  );
}
