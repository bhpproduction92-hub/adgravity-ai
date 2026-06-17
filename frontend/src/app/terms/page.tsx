import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms and Conditions | AdGravity.AI',
  description: 'Review the Terms of Service governing AdGravity.AI platform usage, billing trials, credit tiers, and publisher disclaimers.',
};

export default function TermsPage() {
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
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 md:py-16 flex flex-col gap-8">
        <div className="flex flex-col gap-2 border-b border-white/5 pb-6">
          <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold">Legal & Compliance</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white font-heading">Terms and Conditions</h1>
          <p className="text-gray-500 text-xs mt-1">Last Updated: June 17, 2026</p>
        </div>

        <div className="flex flex-col gap-6 text-xs text-gray-300 leading-relaxed">
          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-bold text-white">1. User Account & Abuse Protection</h2>
            <p>
              By accessing and initializing a subscription on AdGravity.AI (a software platform created by **BHP Production**), you agree to comply with our validation regulations:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1 text-red-350">
              <li><strong>Abuse Policy:</strong> Users are strictly limited to exactly **one (1) 7-day trial execution** per Unique IP Address or Unique User Profile.</li>
              <li>Attempting to register multiple mock accounts or bypass IP screening constraints to accumulate free ad credits will result in permanent device-level IP bans and immediate service termination.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-bold text-white">2. Automatic Billing and Mandates</h2>
            <p>
              AdGravity.AI utilizes payment gateway networks to process UPI Auto-Debit mandates (via Google Pay, PhonePe, Paytm, and other BHIM-compliant mobile apps):
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
              <li><strong>Trial Mandate Fee:</strong> A validation charge of **₹1.00** is debited at the time of mandate authorization.</li>
              <li><strong>Automatic Transition:</strong> If you do not trigger a cancellation before the end of the 7-day trial phase, the billing subscription will transition automatically into a recurring paid plan of **₹999.00/month**.</li>
              <li>Recurring mandate debits will be initiated automatically through your verified UPI address until cancel requests are logged.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-bold text-white">3. Service Limitations and Credit Thresholds</h2>
            <p>
              To maintain cloud generation speeds and database capacity, AdGravity.AI enforces specific monthly and daily generation caps based on subscription tiers:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
              <li><strong>Basic Tier (Rs. 499):</strong> 10 generation credits per day.</li>
              <li><strong>Standard Tier (Rs. 999):</strong> 50 generation credits per day.</li>
              <li><strong>Premium Tier (Rs. 1999):</strong> Unlimited daily generation credits subject to fair usage policies.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-bold text-white">4. Manual Native Sharing Disclaimer</h2>
            <p>
              AdGravity.AI serves as an asset generator and layout compiler. We pre-render designs, configure vernacular captions, and formulate deep links for WhatsApp, Instagram, and Facebook:
            </p>
            <p className="bg-white/5 border border-white/10 p-3.5 rounded-xl text-gray-300">
              <strong>User Execution Policy:</strong> The platform does *not* automatically submit posts directly to personal feeds without user intervention. Final sharing action, uploading, and submission rest exclusively under the manual execution of the user on their own mobile devices or web browsers via deep linking APIs.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-bold text-white">5. Governing Law and Disputes</h2>
            <p>
              These Terms and Conditions are governed by the laws of India. Any legal disputes arising out of usage of AdGravity.AI or services offered by BHP Production shall be subject to the exclusive jurisdiction of the courts located in Guwahati, Assam, India.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 text-center text-xs text-gray-600 bg-[#0c0f18]/30">
        <p>&copy; {new Date().getFullYear()} AdGravity.AI by BHP Production. All rights reserved.</p>
      </footer>
    </div>
  );
}
