'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  
  // Onboarding Form States
  const [personalName, setPersonalName] = useState('');
  const [personalPhone, setPersonalPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gmbLink, setGmbLink] = useState('');
  const [category, setCategory] = useState('Cafe');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profile = {
      personalName,
      personalPhone,
      businessName,
      businessPhone,
      address,
      gmbLink,
      category,
      completedAt: new Date().toISOString()
    };
    
    // Save to localStorage to unlock the dashboard
    localStorage.setItem('adgravity_profile', JSON.stringify(profile));
    
    // Redirect back to the dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-155 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      {/* Background radial highlights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-xl bg-white/[0.02] border border-white/10 rounded-3xl p-8 shadow-2xl relative backdrop-blur-md">
        
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <span className="text-xl font-bold text-white">A</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white font-heading mt-2">
            AdGravity<span className="text-indigo-400">.AI</span> Profile Setup
          </h1>
          <p className="text-gray-400 text-xs">
            Complete your business metadata profile to unlock the branding workspace.
          </p>
        </div>

        {/* Onboarding Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Section: Personal Info */}
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">1. Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-gray-400">Your Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  value={personalName}
                  onChange={(e) => setPersonalName(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-xs transition-all placeholder-gray-650"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-gray-400">Personal Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+91 98765 43210"
                  value={personalPhone}
                  onChange={(e) => setPersonalPhone(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-xs transition-all placeholder-gray-650"
                />
              </div>
            </div>
          </div>

          {/* Section: Business Info */}
          <div>
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">2. Business Settings</h3>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-gray-400">Business Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Cafe Delight"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-xs transition-all placeholder-gray-650"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-gray-400">Business Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+91 361 234567"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-xs transition-all placeholder-gray-650"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-gray-400">Business Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-[#0c0f18] border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-xs transition-all"
                >
                  <option value="Cafe">Cafe / Restaurant</option>
                  <option value="Pharmacy">Pharmacy / Healthcare</option>
                  <option value="SaaS">SaaS Platform</option>
                  <option value="Retail">Retail Store / Shop</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-gray-400">Complete Address</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="G.S. Road, Christian Basti, Guwahati, Assam - 781005"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-xs transition-all resize-none placeholder-gray-650"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-semibold text-gray-400">Google My Business (GMB) Link</label>
                  <span className="text-[9px] text-gray-500">Optional</span>
                </div>
                <input 
                  type="url" 
                  placeholder="https://g.page/r/example..."
                  value={gmbLink}
                  onChange={(e) => setGmbLink(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-xs transition-all placeholder-gray-650"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2"
          >
            Save Profile & Open Workspace
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
}
