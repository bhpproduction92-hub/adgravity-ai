'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState('billing');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API query log validation
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setName('');
    setEmail('');
    setCompanyName('');
    setMessage('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 5 Cols: Contact parameters */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
          <h3 className="text-base font-bold text-white">Direct Channels</h3>
          
          <div className="flex flex-col gap-4 text-xs">
            <div className="flex items-start gap-3 p-3 bg-white/[0.01] border border-white/5 rounded-xl">
              <span className="text-xl">✉️</span>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-white">General Inquiries</span>
                <a href="mailto:support@adgravity.ai" className="text-indigo-400 hover:underline">support@adgravity.ai</a>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/[0.01] border border-white/5 rounded-xl">
              <span className="text-xl">🏢</span>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-white">BHP Production Office</span>
                <a href="mailto:support@bhpproduction.com" className="text-indigo-400 hover:underline">support@bhpproduction.com</a>
                <span className="text-gray-550 text-[10px] mt-0.5">Guwahati, Assam, India</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/[0.01] border border-white/5 rounded-xl">
              <span className="text-xl">👤</span>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-white">Director Desk</span>
                <span className="text-gray-300">Hridaya Nanda Sarma</span>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Outreach */}
        <div className="rounded-3xl bg-emerald-500/10 border border-emerald-500/20 p-6 flex flex-col gap-4 shadow-xl">
          <h3 className="text-sm font-bold text-emerald-400">Prefer Instant Support?</h3>
          <p className="text-gray-300 text-xs leading-relaxed">
            Skip the queue and chat natively with our executive support desk on WhatsApp.
          </p>
          <a
            href="https://wa.me/911234567890?text=I%2520need%2520support%2520with%2520my%2520AdGravity%2520AI%2520Workspace"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/10"
          >
            💬 Chat on WhatsApp Business
          </a>
        </div>
      </div>

      {/* Right 7 Cols: Dynamic Inquiry Form Card */}
      <div className="lg:col-span-7">
        <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold text-white">Submit a Support Ticket</h3>
            <p className="text-gray-400 text-xs mt-1">Our compliance and billing desk will review your query within 24 hours.</p>
          </div>

          {isSuccess ? (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col items-center text-center gap-3 animate-fade-in">
              <span className="text-3xl">✓</span>
              <h4 className="text-sm font-bold text-white">Ticket Logged Successfully</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Thank you for reaching out. A confirmation query receipt has been recorded. Our support team will update you shortly.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-2 text-xs text-indigo-400 hover:underline font-semibold"
              >
                Submit another ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 font-semibold">Your Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-2.5 bg-[#07090e] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white placeholder-gray-600"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 font-semibold">Business Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@business.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-2.5 bg-[#07090e] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white placeholder-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 font-semibold">Business Name (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Cafe Delight"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="px-4 py-2.5 bg-[#07090e] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white placeholder-gray-600"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 font-semibold">Topic Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-2.5 bg-[#07090e] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white"
                  >
                    <option value="billing">Billing & UPI Autodebits</option>
                    <option value="trials">7-Day Trial Cancellation</option>
                    <option value="api">Facebook / Meta Page Linking</option>
                    <option value="credits">Credits & Limit Extension</option>
                    <option value="partnership">BHP Production Partnerships</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 font-semibold">Query Message Details</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Explain your request in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="px-4 py-2.5 bg-[#07090e] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white placeholder-gray-600 resize-none leading-relaxed"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/10"
              >
                {isSubmitting ? 'Logging ticket...' : 'Log Ticket Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
