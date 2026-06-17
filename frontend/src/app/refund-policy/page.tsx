import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | AdGravity.AI',
  description: 'Understand subscription cancellation terms, refund regulations, and active trial termination on AdGravity.AI.',
};

export default function RefundPolicyPage() {
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-white font-heading">Refund & Cancellation Policy</h1>
          <p className="text-gray-500 text-xs mt-1">Last Updated: June 17, 2026</p>
        </div>

        <div className="flex flex-col gap-6 text-xs text-gray-300 leading-relaxed">
          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-bold text-white">1. Initial 7-Day Testing Environment</h2>
            <p>
              AdGravity.AI offers a **7-Day Trial for ₹1.00** to allow users to fully test creative ad designs, branding parameters, regional language transcreations, and dashboard configurations.
            </p>
            <p>
              During this 7-day period, users have full access to standard generation assets to evaluate if the application meets their advertising objectives.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-bold text-white">2. One-Click Cancellation Protocol</h2>
            <p>
              You may terminate your active trial subscription or automated monthly recurring mandate at any time. There are absolutely no lock-in periods or termination penalties.
            </p>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-2.5">
              <span className="text-white font-semibold">How to cancel your subscription:</span>
              <ol className="list-decimal pl-5 flex flex-col gap-1.5 text-gray-300">
                <li>Log in to your **AdGravity.AI Client Dashboard** (`/dashboard`).</li>
                <li>Click on the **Settings ⚙️** icon in the top navigation header to open your settings dashboard.</li>
                <li>Select the **Billing & Invoice Tracker 💳** panel from the sidebar menu.</li>
                <li>Under the active plan details box, click on the **"Cancel Mandate"** / **"Cancel Plan"** action button.</li>
                <li>Your subscription will immediately update to status <em>"Cancelled"</em>, and the recurring autodebit instruction will be revoked across payment networks.</li>
              </ol>
            </div>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-bold text-white">3. Automated Subscription Cycles & Renewals</h2>
            <p>
              If a subscription is not cancelled before the end of the 7-day trial period, the mandate automatically updates to active status and triggers a monthly billing rate of **₹999.00/month**. 
            </p>
            <p>
              Once a renewal fee is automatically processed, it is non-refundable. However, cancelling the subscription after a billing cycle has run will prevent any future charges, and your dashboard usage will remain active until the end of the current paid billing term.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-bold text-white">4. Refund Regulations for Unused Credits</h2>
            <p>
              Since AdGravity.AI provides digital, instantly downloadable graphics, slogans, and copy outputs, we do not support partial refunds for unused credits or standard billing cycles.
            </p>
            <p>
              If a technical error on our backend prevents you from utilizing generation tools, or if a double-billing occurrence happens via payment networks, please immediately contact our helpdesk.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-bold text-white">5. Direct Assistance & Support</h2>
            <p>
              To report gateway anomalies or request direct verification of a cancelled mandate, please email **support@adgravity.ai** or connect with us on the WhatsApp support channel.
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
