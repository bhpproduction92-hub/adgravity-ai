import type { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | AdGravity.AI Support Desk',
  description: 'Reach out to the support desk of AdGravity.AI and BHP Production for billing cancellations, API setup assistance, and queries.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-gray-150 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
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

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col gap-10">
        <div className="flex flex-col gap-2 text-center max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold">Get In Touch</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white font-heading">Support & Inquiry Desk</h1>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed mt-1">
            Have questions regarding payments, API integration workflows, or partnership mandates with **BHP Production**? Submit a ticket below or connect on WhatsApp.
          </p>
        </div>

        {/* Dynamic form wrapper */}
        <ContactForm />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 text-center text-xs text-gray-600 bg-[#0c0f18]/30">
        <p>&copy; {new Date().getFullYear()} AdGravity.AI by BHP Production. All rights reserved.</p>
      </footer>
    </div>
  );
}
