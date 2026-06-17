'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function SettingsContent() {
  const router = useRouter();

  // Profile Step-locking state
  const [profile, setProfile] = useState<any>(null);

  // Brand Theme Selector State
  const [themeColor, setThemeColor] = useState('indigo');
  const [themeSuccess, setThemeSuccess] = useState(false);

  // Active settings tab
  const [activeTab, setActiveTab] = useState<'social' | 'billing' | 'theme' | 'help'>('social');

  // Step-locking: Load profile, redirect to onboarding if missing
  useEffect(() => {
    const savedProfile = localStorage.getItem('adgravity_profile');
    if (!savedProfile) {
      router.replace('/dashboard/onboarding');
    } else {
      setProfile(JSON.parse(savedProfile));
      
      // Load theme color from localStorage if it exists
      const savedColor = localStorage.getItem('adgravity_theme_color');
      if (savedColor) {
        setThemeColor(savedColor);
      }
    }
  }, [router]);

  // Handle color preference change
  const handleColorChange = (color: string) => {
    setThemeColor(color);
    localStorage.setItem('adgravity_theme_color', color);
    setThemeSuccess(true);
    setTimeout(() => setThemeSuccess(false), 2000);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#07090e] text-gray-150 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-xs text-gray-500 font-sans">Checking settings security...</span>
        </div>
      </div>
    );
  }

  // Get color highlight class based on selection
  const getColorHex = () => {
    switch(themeColor) {
      case 'emerald': return '#10b981';
      case 'rose': return '#f43f5e';
      case 'amber': return '#f59e0b';
      case 'violet': return '#8b5cf6';
      default: return '#6366f1'; // indigo
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-12">
      {/* Top Navbar */}
      <header className="w-full bg-[#0c0f18]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center">
              <span className="text-base font-bold text-white">A</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white font-heading">
              AdGravity<span className="text-indigo-400">.AI</span> Settings
            </span>
          </div>

          <button 
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-all active:scale-95"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main Settings Panel */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 3 Cols: Sidebar selection */}
        <div className="lg:col-span-3 flex flex-col gap-2 bg-white/5 border border-white/10 p-3 rounded-2xl">
          <button
            onClick={() => setActiveTab('social')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
              activeTab === 'social' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span>🔗</span> Social Connections
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
              activeTab === 'billing' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span>💳</span> Billing & Invoice Tracker
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
              activeTab === 'theme' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span>🎨</span> Brand Color Preferences
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
              activeTab === 'help' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span>💬</span> Help & Legal Desk
          </button>
        </div>

        {/* Right 9 Cols: Content Panels */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          
          {/* PANEL 1: SOCIAL CONNECTIONS */}
          {activeTab === 'social' && (
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white">Social Media Connection Manager</h3>
                <p className="text-gray-400 text-xs mt-1">Bind and authorize your Meta and communication outreach pages.</p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Facebook Page status */}
                <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">f</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-white">Facebook Page integration</span>
                      <span className="text-[10px] text-emerald-400">✓ Connected Page: {profile.businessName}</span>
                    </div>
                  </div>
                  <button className="px-3 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/20 transition-all">Disconnect</button>
                </div>

                {/* Instagram status */}
                <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📸</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-white">Instagram Business Profile</span>
                      <span className="text-[10px] text-gray-500">Not connected yet</span>
                    </div>
                  </div>
                  <button className="px-3 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-bold border border-indigo-500/20 transition-all">Connect</button>
                </div>

                {/* WhatsApp Status */}
                <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💬</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-white">WhatsApp Business Link</span>
                      <span className="text-[10px] text-emerald-400">✓ Linked number: {profile.personalPhone || '+91 9876543210'}</span>
                    </div>
                  </div>
                  <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] font-bold border border-white/10 transition-all">Update</button>
                </div>
              </div>
            </div>
          )}

          {/* PANEL 2: BILLING & INVOICE TRACKER */}
          {activeTab === 'billing' && (
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white">Subscription & Billing Account Tracker</h3>
                <p className="text-gray-400 text-xs mt-1">Monitor subscription parameters and download paid statements.</p>
              </div>

              {/* Active Plan details */}
              <div className="bg-white/[0.01] p-4 border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 font-bold uppercase text-[9px]">Current Billing Package</span>
                  <span className="text-white font-semibold">AdGravity AI 7-Day Trial</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-gray-500 font-bold uppercase text-[9px]">Subscription Rate</span>
                  <span className="text-white font-semibold">₹1.00 (7-Days)</span>
                </div>
              </div>

              {/* Invoice Table */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-gray-400">Invoice History</span>
                <div className="overflow-x-auto border border-white/5 rounded-2xl bg-white/[0.01]">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-white/5 text-gray-500 uppercase tracking-wider font-semibold bg-white/[0.02]">
                        <th className="p-3">Payment Date</th>
                        <th className="p-3">Billing description</th>
                        <th className="p-3 font-mono">Invoice ID</th>
                        <th className="p-3">Charge Price</th>
                        <th className="p-3 text-right">Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-3 text-white">June 16, 2026</td>
                        <td className="p-3 text-gray-400">₹1 Trial Mandate fee</td>
                        <td className="p-3 font-mono text-gray-500">inv_bi872aa023</td>
                        <td className="p-3 font-semibold text-emerald-400">₹1.00 Success</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => alert('Downloading PDF invoice inv_bi872aa023.pdf...')}
                            className="text-indigo-400 hover:text-indigo-350 font-bold"
                          >
                            ⬇ PDF Invoice
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PANEL 3: BRAND COLOR PREFERENCES */}
          {activeTab === 'theme' && (
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white">Brand Color & Theme Preference Selector</h3>
                <p className="text-gray-400 text-xs mt-1">Update color tokens to dynamically style the branding canvas overlay.</p>
              </div>

              {/* Color Grid */}
              <div className="flex flex-col gap-4">
                <span className="text-xs font-semibold text-gray-400">Select Primary Brand Accent:</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {[
                    { id: 'indigo', name: 'Standard Indigo', hex: '#6366f1' },
                    { id: 'emerald', name: 'Fresh Emerald', hex: '#10b981' },
                    { id: 'rose', name: 'Premium Rose', hex: '#f43f5e' },
                    { id: 'amber', name: 'Luxury Amber', hex: '#f59e0b' },
                    { id: 'violet', name: 'Deep Violet', hex: '#8b5cf6' }
                  ].map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleColorChange(color.id)}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                        themeColor === color.id ? 'bg-white/10 border-white text-white font-bold' : 'bg-white/[0.01] border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full" style={{ backgroundColor: color.hex }} />
                      <span className="text-[10px]">{color.name}</span>
                    </button>
                  ))}
                </div>
                
                {/* Canvas preview snippet */}
                <div className="mt-4 border border-white/5 bg-white/[0.01] p-4 rounded-2xl flex items-center justify-between text-xs">
                  <span>Simulated Color Badge:</span>
                  <span className="px-3 py-1 rounded-full text-white text-[10px] font-bold" style={{ backgroundColor: getColorHex() }}>
                    {themeColor.toUpperCase()} SELECTED
                  </span>
                </div>
              </div>

              {themeSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl text-center">
                  ✓ Brand color preferences updated globally!
                </div>
              )}
            </div>
          )}

          {/* PANEL 4: HELP & LEGAL DESK */}
          {activeTab === 'help' && (
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white">Help & Legal Desk</h3>
                <p className="text-gray-400 text-xs mt-1">Get tutorials, support chat, and check legal terms compliance.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Video tutorial placeholder */}
                <div className="rounded-2xl border border-white/10 bg-black/60 aspect-video flex flex-col items-center justify-center p-6 gap-2 text-center relative overflow-hidden group">
                  <div className="w-12 h-12 rounded-full bg-white/15 hover:bg-indigo-600 transition-colors flex items-center justify-center text-white cursor-pointer shadow">
                    ▶
                  </div>
                  <span className="text-xs font-semibold text-white">How to Use AdGravity.AI</span>
                  <span className="text-[10px] text-gray-500">Video tutorial (3 min duration)</span>
                </div>

                {/* Support actions */}
                <div className="flex flex-col gap-4 justify-between">
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-semibold text-gray-400">Official Support Chat</span>
                    <a
                      href="https://wa.me/911234567890?text=I%2520need%252520support%252520with%252520AdGravity%252520AI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl bg-[#25d366]/10 hover:bg-[#25d366]/20 border border-[#25d366]/20 text-[#25d366] font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      💬 Chat on WhatsApp Business
                    </a>
                  </div>
                  
                  <div className="flex flex-col gap-2 border-t border-white/5 pt-3 text-xs text-gray-400">
                    <span className="font-semibold text-gray-500 text-[10px] uppercase">Compliance Documents</span>
                    <div className="flex justify-between">
                      <a href="#" className="hover:text-white transition-colors">Terms of Service Agreement</a>
                      <a href="#" className="hover:text-white transition-colors">Privacy Policy Statement</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07090e] text-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-xs text-gray-505">Loading Ad Settings...</span>
        </div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
