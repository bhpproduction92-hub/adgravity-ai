import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | AdGravity.AI',
  description: 'Learn about BHP Production, the parent organization behind AdGravity.AI, and our Founder & Director Hridaya Nanda Sarma.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar Header */}
      <header className="w-full bg-[#0c0f18]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center">
              <span className="text-base font-bold text-white">A</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white font-heading">
              AdGravity<span className="text-indigo-400">.AI</span>
            </span>
          </Link>

          <Link 
            href="/"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-all"
          >
            ← Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-12">
        <div className="flex flex-col gap-4 text-center">
          <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold">Our Story & Mission</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-heading">
            Democratizing Localized Marketing
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            AdGravity.AI is the proprietary social marketing automation platform developed by <strong>BHP Production</strong>, built to empower micro, small, and medium enterprises (MSMEs) across India.
          </p>
        </div>

        {/* Corporate Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
            <span className="text-2xl">⚡</span>
            <h3 className="text-lg font-bold text-white">The Cost Problem</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Traditional social media management and ad agency services charge between **Rs. 10,000 to Rs. 15,000 per month**. For local pharmacies, cafes, and small retail stores, this cost barrier keeps digital growth out of reach.
            </p>
          </div>

          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
            <span className="text-2xl">✨</span>
            <h3 className="text-lg font-bold text-white">Our Automated Solution</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              AdGravity.AI eliminates overhead by delivering 100% automated AI-generated graphics, local language vernacular slogans (including Assamese, Hindi, and English), trending video reels, and seamless mobile deep-sharing widgets.
            </p>
          </div>
        </section>

        {/* Founder Profile */}
        <section className="rounded-3xl bg-gradient-to-tr from-indigo-950/20 via-violet-950/15 to-[#0b0f19] border border-indigo-500/20 p-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-4xl text-white shadow-lg shrink-0">
            👤
          </div>
          <div className="flex flex-col gap-3 text-center md:text-left">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold">Founder & Director</span>
              <h2 className="text-xl font-bold text-white mt-0.5">Hridaya Nanda Sarma</h2>
            </div>
            <p className="text-gray-350 text-xs leading-relaxed">
              As a media entrepreneur and tech innovator, Hridaya Nanda Sarma founded **BHP Production** and launched **AdGravity.AI** to solve localized publicity hurdles. By leveraging modern AI and automated workflows, the platform bridges the gap between regional business owners and advanced social advertising platforms.
            </p>
            <div className="flex gap-4 justify-center md:justify-start text-[10px] text-gray-500 font-mono mt-1">
              <span>Parent Org: BHP Production</span>
              <span>•</span>
              <span>Platform: AdGravity.AI</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 text-center text-xs text-gray-600 bg-[#0c0f18]/30">
        <p>&copy; {new Date().getFullYear()} AdGravity.AI by BHP Production. All rights reserved.</p>
      </footer>
    </div>
  );
}
