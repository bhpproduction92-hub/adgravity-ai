import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | AdGravity.AI',
  description: 'Learn how AdGravity.AI and BHP Production protect your business profile details, asset uploads, and credentials.',
};

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-white font-heading">Privacy Policy</h1>
          <p className="text-gray-500 text-xs mt-1">Last Updated: June 17, 2026</p>
        </div>

        <div className="flex flex-col gap-6 text-xs text-gray-300 leading-relaxed">
          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-bold text-white">1. Scope of Data Collection</h2>
            <p>
              AdGravity.AI (operated by **BHP Production**) collects necessary user and business profile parameters to customize branding configurations, including:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
              <li>Personal identifiers (Name, Email Address, Contact Phone Numbers).</li>
              <li>Business configurations (Business Name, Business Phone, Business Category, Address, GMB Links).</li>
              <li>Uploaded assets (Brand Logos, vector marks, shop photos, advertising media).</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-bold text-white">2. Meta API and Social Integration</h2>
            <p>
              To support direct campaign submissions, AdGravity.AI integrates with Meta Services using the **Facebook Graph API** and **Instagram Graph API**. 
            </p>
            <p className="bg-white/5 border border-white/10 p-3.5 rounded-xl text-gray-300">
              <strong>Zero Credentials Retention:</strong> We do not ask for, read, or store your personal Facebook or Instagram login passwords. All authentication takes place directly via Meta secure login portals. The temporary page authorization tokens generated are stored locally or within secure database environments solely to facilitate API posting operations.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-bold text-white">3. UPI Trial Authorization & Anti-Fraud Logs</h2>
            <p>
              To validate authenticity and protect the platform against systemic trial abuse, we enforce the following security logs during the **₹1 7-Day Trial Setup**:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
              <li><strong>Transaction Logging:</strong> Details of UPI Auto-debit mandates verified through gateways (GPay, PhonePe, Paytm).</li>
              <li><strong>Network & Location Integrity:</strong> Logged IP addresses and network geographic parameters are processed to restrict accounts to one active trial per unique user or unique IP configuration, preventing automated spoofing or double-trial registrations.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-bold text-white">4. Data Storage & Security Measures</h2>
            <p>
              We run all data processing operations on secure servers. Assets like logos are stored in encrypted buckets. Any client-side cookies or caching used to optimize generation preferences (such as saved brand colors) are stored locally in the browser context to ensure user-controlled privacy.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-bold text-white">5. Contact and Compliance Officer</h2>
            <p>
              For privacy concerns or to request account deletion, please contact our compliance desk supervised by our Director:
            </p>
            <div className="mt-1 bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col gap-1 font-mono text-[10px] text-gray-400">
              <span className="text-white font-sans font-bold">BHP Production Compliance Officer</span>
              <span>Officer: Hridaya Nanda Sarma</span>
              <span>Email: support@bhpproduction.com</span>
              <span>Website: https://bhpproduction.com/</span>
              <span>Support Contact: +91 9577781416</span>
              <span>Headquarters Address: Kahilipara, Guwahati, Assam, India</span>
            </div>
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
