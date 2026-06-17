'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  
  // State for Onboarding Input
  const [businessName, setBusinessName] = useState('');
  
  // State for Pricing Toggle
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  // State for Animation Slider/Simulation
  const [activeSimTab, setActiveSimTab] = useState<'reels' | 'theme' | 'resize'>('reels');
  const [reelsProgress, setReelsProgress] = useState(0);
  const [themeColor, setThemeColor] = useState<'indigo' | 'emerald' | 'amber'>('indigo');
  const [resizeLayout, setResizeLayout] = useState<'portrait' | 'square' | 'landscape'>('portrait');

  // Onboarding Submit
  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    router.push(`/dashboard?businessName=${encodeURIComponent(businessName)}`);
  };

  // Simulating reels rendering progress loop
  useEffect(() => {
    if (activeSimTab !== 'reels') return;
    const interval = setInterval(() => {
      setReelsProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 400);
    return () => clearInterval(interval);
  }, [activeSimTab]);

  // Simulating auto color cycle
  useEffect(() => {
    if (activeSimTab !== 'theme') return;
    const colors: ('indigo' | 'emerald' | 'amber')[] = ['indigo', 'emerald', 'amber'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % colors.length;
      setThemeColor(colors[idx]);
    }, 1500);
    return () => clearInterval(interval);
  }, [activeSimTab]);

  // Simulating auto resize layout cycle
  useEffect(() => {
    if (activeSimTab !== 'resize') return;
    const layouts: ('portrait' | 'square' | 'landscape')[] = ['portrait', 'square', 'landscape'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % layouts.length;
      setResizeLayout(layouts[idx]);
    }, 2000);
    return () => clearInterval(interval);
  }, [activeSimTab]);

  const partnerLogos = [
    { name: 'Prarthana Hospital', icon: '🏥' },
    { name: 'Dreams Hospital', icon: '🩺' },
    { name: 'Sygnush Hospital', icon: '🧬' },
    { name: 'MedCity Care', icon: '❤️' },
    { name: 'Assam Medical Centre', icon: '🔬' }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 flex flex-col selection:bg-indigo-500 selection:text-white pb-24 md:pb-0">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-xl font-bold text-white">A</span>
          </div>
          <span className="text-xl font-semibold tracking-tight text-white font-heading">
            AdGravity<span className="text-indigo-400">.AI</span>
          </span>
        </div>
        
        <button 
          onClick={() => router.push('/dashboard')}
          className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all border border-white/10 hover:border-white/20 active:scale-95"
        >
          Go to Dashboard
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Pitch */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold self-center lg:self-start">
            ✨ Phase 1 Live: Enterprise Ready
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
            Scale Ads with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400">
              Gravity Defying
            </span>{' '}
            AI
          </h1>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
            Automatically generate high-performance social ad creatives, translate them to local vernaculars like Assamese, and publish to Facebook with one-click approval operations.
          </p>

          {/* Onboarding Box */}
          <form onSubmit={handleOnboardingSubmit} className="mt-4 flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
            <input 
              type="text" 
              required
              placeholder="Enter your Business Name..." 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-white placeholder-gray-500 text-sm flex-1 transition-all"
            />
            <button 
              type="submit" 
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm transition-all active:scale-95 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              Get Started
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </form>
        </div>

        {/* Right Side: Dynamic Interactive Simulator */}
        <div className="lg:col-span-7 w-full flex flex-col gap-6">
          {/* Simulator Tabs */}
          <div className="flex gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 self-center lg:self-end">
            <button 
              onClick={() => setActiveSimTab('reels')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeSimTab === 'reels' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              🎬 AI Reels Engine
            </button>
            <button 
              onClick={() => setActiveSimTab('theme')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeSimTab === 'theme' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              🎨 Theme Colorizer
            </button>
            <button 
              onClick={() => setActiveSimTab('resize')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeSimTab === 'resize' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              📐 Layout Resizer
            </button>
          </div>

          {/* Device Mockup Wrapper */}
          <div className="w-full aspect-[4/3] rounded-3xl bg-gradient-to-b from-[#131722] to-[#0d0f17] border border-white/10 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(99,102,241,0.1),transparent)] pointer-events-none" />

            {/* Simulated Window Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-gray-500 font-mono">adgravity-ai-preview.mp4</span>
              <div className="w-4 h-4 rounded-full bg-white/10" />
            </div>

            {/* Interactive Simulation Viewport */}
            <div className="flex-1 flex items-center justify-center p-4 relative">
              {/* TAB 1: REELS GENERATOR */}
              {activeSimTab === 'reels' && (
                <div className="w-40 aspect-[9/16] rounded-2xl border border-white/10 bg-black/60 overflow-hidden flex flex-col relative shadow-xl">
                  {/* Mock Video content */}
                  <div className="flex-1 bg-gradient-to-b from-indigo-950 via-[#0B0F19] to-indigo-950 flex flex-col justify-end p-3 gap-2">
                    {/* Live overlay */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-[8px] font-bold text-white px-1.5 py-0.5 rounded">
                      <span className="w-1 h-1 rounded-full bg-white animate-pulse" /> LIVE PREVIEW
                    </div>
                    {/* Text box */}
                    <div className="h-6 w-full rounded bg-white/10 animate-pulse" />
                    <div className="h-4 w-4/5 rounded bg-white/10 animate-pulse" />
                    
                    {/* Render status */}
                    <div className="mt-2 flex flex-col gap-1.5">
                      <div className="flex justify-between text-[8px] text-gray-400">
                        <span>Rendering Video...</span>
                        <span>{reelsProgress}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${reelsProgress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: THEME CUSTOMIZER */}
              {activeSimTab === 'theme' && (
                <div className="flex flex-col gap-4 items-center">
                  <div className={`w-64 h-36 rounded-2xl border transition-all duration-700 flex flex-col justify-between p-4 ${
                    themeColor === 'indigo' ? 'bg-indigo-950/80 border-indigo-500/40 text-indigo-200' :
                    themeColor === 'emerald' ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' :
                    'bg-amber-950/80 border-amber-500/40 text-amber-200'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-xs">AdGravity AI Color Theme</h4>
                        <span className="text-[10px] opacity-75">Click toggle to switch manually</span>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        themeColor === 'indigo' ? 'bg-indigo-500 text-white' :
                        themeColor === 'emerald' ? 'bg-emerald-500 text-white' :
                        'bg-amber-500 text-white'
                      }`}>💡</div>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded text-[8px] border border-current">Premium</span>
                      <span className="px-2 py-0.5 rounded text-[8px] border border-current">High Converting</span>
                    </div>
                  </div>
                  {/* Selector nodes */}
                  <div className="flex gap-3">
                    <button onClick={() => setThemeColor('indigo')} className={`w-5 h-5 rounded-full bg-indigo-600 border-2 ${themeColor === 'indigo' ? 'border-white' : 'border-transparent'}`} />
                    <button onClick={() => setThemeColor('emerald')} className={`w-5 h-5 rounded-full bg-emerald-600 border-2 ${themeColor === 'emerald' ? 'border-white' : 'border-transparent'}`} />
                    <button onClick={() => setThemeColor('amber')} className={`w-5 h-5 rounded-full bg-amber-600 border-2 ${themeColor === 'amber' ? 'border-white' : 'border-transparent'}`} />
                  </div>
                </div>
              )}

              {/* TAB 3: LAYOUT RESIZER */}
              {activeSimTab === 'resize' && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  {/* Responsive Container */}
                  <div className={`border border-white/20 bg-white/5 rounded-2xl flex flex-col items-center justify-center p-3 transition-all duration-700 ${
                    resizeLayout === 'portrait' ? 'w-32 h-56' :
                    resizeLayout === 'square' ? 'w-48 h-48' :
                    'w-64 h-36'
                  }`}>
                    <div className="w-full h-full bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex flex-col justify-between p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] text-indigo-300 uppercase tracking-wider font-semibold">AdGravity</span>
                        <span className="text-[8px] text-gray-500">
                          {resizeLayout === 'portrait' ? '9:16' : resizeLayout === 'square' ? '1:1' : '16:9'}
                        </span>
                      </div>
                      <div className="h-6 w-full rounded bg-white/10 animate-pulse" />
                      <div className="flex gap-1.5 self-end">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                      </div>
                    </div>
                  </div>
                  {/* Selector Controls */}
                  <div className="flex gap-2">
                    <button onClick={() => setResizeLayout('portrait')} className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border ${resizeLayout === 'portrait' ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-white/10 text-gray-400'}`}>9:16 Portrait</button>
                    <button onClick={() => setResizeLayout('square')} className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border ${resizeLayout === 'square' ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-white/10 text-gray-400'}`}>1:1 Square</button>
                    <button onClick={() => setResizeLayout('landscape')} className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border ${resizeLayout === 'landscape' ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-white/10 text-gray-400'}`}>16:9 Landscape</button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Status bar */}
            <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[10px] text-gray-500 font-mono">
              <span>Layout Engine: Active</span>
              <span>Aspect Ratio Check: Passed</span>
            </div>
          </div>
        </div>
      </main>

      {/* Trust Component: Logo Marquee */}
      <section className="w-full bg-white/[0.02] border-y border-white/5 py-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-4">
          <p className="text-center text-xs uppercase tracking-widest text-gray-500 font-semibold">
            Trusted by top healthcare providers and organizations
          </p>
        </div>
        <div className="relative w-full flex overflow-x-hidden">
          {/* Duplicate row for infinite scrolling loop */}
          <div className="animate-scroll flex gap-16 items-center">
            {partnerLogos.concat(partnerLogos).map((logo, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-400 hover:text-indigo-300 transition-colors cursor-pointer select-none">
                <span className="text-2xl">{logo.icon}</span>
                <span className="text-base font-bold tracking-tight font-heading">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Matrix */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 flex flex-col gap-12 items-center">
        <div className="text-center flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Simple, Predictable Pricing</h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Choose the package that aligns with your ad outreach goals. Upgrade or downgrade anytime.
          </p>
          
          {/* Monthly/Yearly toggle */}
          <div className="flex items-center gap-3 bg-white/5 p-1 rounded-full border border-white/10 mt-2 self-center">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${billingCycle === 'yearly' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Basic Card */}
          <div className="rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/30 p-6 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5">
            <div className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">Basic</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  ₹{billingCycle === 'monthly' ? '499' : '399'}
                </span>
                <span className="text-xs text-gray-500">/ month</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Perfect for small local niches starting to test automated social ad copy templates.
              </p>
              <hr className="border-white/5" />
              <ul className="flex flex-col gap-3 text-xs text-gray-300">
                <li className="flex items-center gap-2">✅ 10 English Caption Generations</li>
                <li className="flex items-center gap-2">✅ Basic Niche Customization</li>
                <li className="flex items-center gap-2">❌ Local Vernacular Translations</li>
                <li className="flex items-center gap-2">❌ Auto-publishing to Meta</li>
              </ul>
            </div>
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full mt-8 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-all"
            >
              Get Started
            </button>
          </div>

          {/* Standard Card */}
          <div className="rounded-3xl bg-indigo-950/20 border-2 border-indigo-600/50 p-6 flex flex-col justify-between transition-all hover:-translate-y-1 relative shadow-lg shadow-indigo-500/5">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-indigo-600 text-[10px] font-bold tracking-widest text-white uppercase shadow">
              Most Popular
            </span>
            <div className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">Standard</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  ₹{billingCycle === 'monthly' ? '999' : '799'}
                </span>
                <span className="text-xs text-gray-500">/ month</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Empower your regional campaigns with dynamic bilingual caption generations.
              </p>
              <hr className="border-indigo-500/10" />
              <ul className="flex flex-col gap-3 text-xs text-gray-300">
                <li className="flex items-center gap-2">✅ Unlimited English Captions</li>
                <li className="flex items-center gap-2">✅ Assamese Translation Adaptation</li>
                <li className="flex items-center gap-2">✅ Local Audience Tone Controls</li>
                <li className="flex items-center gap-2">❌ Auto-publishing to Meta</li>
              </ul>
            </div>
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full mt-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-500/25"
            >
              Start Free Trial
            </button>
          </div>

          {/* Premium Card */}
          <div className="rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/30 p-6 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5">
            <div className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">Premium</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  ₹{billingCycle === 'monthly' ? '1999' : '1599'}
                </span>
                <span className="text-xs text-gray-500">/ month</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Complete automated publishing engine with direct Facebook Page API integration.
              </p>
              <hr className="border-white/5" />
              <ul className="flex flex-col gap-3 text-xs text-gray-300">
                <li className="flex items-center gap-2">✅ Everything in Standard plan</li>
                <li className="flex items-center gap-2">✅ Connect Facebook Pages (OAuth)</li>
                <li className="flex items-center gap-2">✅ Automated Feed Publishing</li>
                <li className="flex items-center gap-2">✅ Full Analytics Dashboard</li>
              </ul>
            </div>
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full mt-8 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-all"
            >
              Get Started
            </button>
          </div>

          {/* Custom Package Card */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-950/20 via-violet-950/15 to-[#0b0f19] border border-violet-500/30 p-6 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/5">
            <div className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-wider text-violet-400 font-bold">Custom</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">Boosting Ads</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Need enterprise features, high-volume caption generation, or multi-page management?
              </p>
              <hr className="border-violet-500/10" />
              <ul className="flex flex-col gap-3 text-xs text-gray-300">
                <li className="flex items-center gap-2">👥 Dedicated Account Manager</li>
                <li className="flex items-center gap-2">📈 High-volume credit plans</li>
                <li className="flex items-center gap-2">💬 24/7 WhatsApp Support</li>
                <li className="flex items-center gap-2">🛠️ Custom API Integrations</li>
              </ul>
            </div>
            <a 
              href="https://wa.me/911234567890?text=I%20am%20interested%20in%20the%20AdGravity%20AI%20Custom%20Boosting%20Ads%20Package"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all text-center flex items-center justify-center gap-2"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Floating Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-black/60 backdrop-blur-xl border border-white/15 rounded-full px-6 py-4 flex justify-between items-center z-50 shadow-2xl">
        <a href="#" className="flex flex-col items-center gap-1 text-indigo-400 transition-colors">
          <span className="text-base">🏠</span>
          <span className="text-[10px] font-medium">Home</span>
        </a>
        <a href="#features" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
          <span className="text-base">✨</span>
          <span className="text-[10px] font-medium">Features</span>
        </a>
        <a href="#pricing" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
          <span className="text-base">💳</span>
          <span className="text-[10px] font-medium">Pricing</span>
        </a>
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-base">📊</span>
          <span className="text-[10px] font-medium">Dashboard</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <span>&copy; {new Date().getFullYear()} AdGravity AI. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Support Desk</a>
        </div>
      </footer>
    </div>
  );
}
