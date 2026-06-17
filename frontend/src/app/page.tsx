'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '../components/ThemeToggle';

export default function LandingPage() {
  const router = useRouter();

  // State for Theme (to adapt inline simulator elements)
  const [activeTheme, setActiveTheme] = useState('bright');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const cls = document.documentElement.className;
      if (cls.includes('theme-light')) setActiveTheme('light');
      else if (cls.includes('theme-dark')) setActiveTheme('dark');
      else if (cls.includes('theme-standard')) setActiveTheme('standard');
      else setActiveTheme('bright');
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    // Initial check
    const currentCls = document.documentElement.className;
    if (currentCls.includes('theme-light')) setActiveTheme('light');
    else if (currentCls.includes('theme-dark')) setActiveTheme('dark');
    else if (currentCls.includes('theme-standard')) setActiveTheme('standard');
    else setActiveTheme('bright');

    return () => observer.disconnect();
  }, []);

  // Form & Auth States
  const [businessPrompt, setBusinessPrompt] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // Pricing Toggle
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Animation Simulator
  const [activeSimTab, setActiveSimTab] = useState<'reels' | 'theme' | 'resize'>('reels');
  const [reelsProgress, setReelsProgress] = useState(0);
  const [simColor, setSimColor] = useState<'blue' | 'green' | 'red' | 'yellow'>('blue');
  const [resizeLayout, setResizeLayout] = useState<'portrait' | 'square' | 'landscape'>('portrait');

  // Reels rendering loop
  useEffect(() => {
    if (activeSimTab !== 'reels') return;
    const interval = setInterval(() => {
      setReelsProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 450);
    return () => clearInterval(interval);
  }, [activeSimTab]);

  // Simulating auto color cycle
  useEffect(() => {
    if (activeSimTab !== 'theme') return;
    const colors: ('blue' | 'green' | 'red' | 'yellow')[] = ['blue', 'green', 'red', 'yellow'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % colors.length;
      setSimColor(colors[idx]);
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

  const handlePublicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessPrompt.trim()) return;
    // Block workflow and request login/register
    setShowAuthModal(true);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save prompt and mock login state
    localStorage.setItem('adgravity_temp_prompt', businessPrompt);
    const mockProfile = {
      personalName: authName || 'Google User',
      personalPhone: authPhone || '+91 99999 88888',
      businessName: 'My Startup',
      businessPhone: authPhone || '+91 99999 88888',
      address: 'Guwahati, Assam',
      category: 'Food & Hospitality',
      gmbLink: '',
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem('adgravity_profile', JSON.stringify(mockProfile));
    
    // Redirect to smart onboarding logo generator
    router.push('/dashboard/onboarding');
  };

  const partnerLogos = [
    { name: 'Prarthana Hospital', src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=64&h=64&q=80' },
    { name: 'Dreams Hospital', src: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=64&h=64&q=80' },
    { name: 'Sygnush Hospital', src: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=64&h=64&q=80' },
    { name: 'MedCity Care', src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=64&h=64&q=80' },
    { name: 'Assam Medical Centre', src: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=64&h=64&q=80' }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col transition-colors duration-300 pb-24 md:pb-0 font-urbanist">
      
      {/* Dynamic JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "@id": "https://bhpproduction.com/#application",
                "name": "AdGravity.AI",
                "url": "https://bhpproduction.com",
                "operatingSystem": "All",
                "applicationCategory": "BusinessApplication",
                "description": "Bespoke Google-style AI Social Media Ad Operations console for Indian MSMEs.",
                "offers": {
                  "@type": "AggregateOffer",
                  "priceCurrency": "INR",
                  "lowPrice": "499",
                  "highPrice": "1999",
                  "offerCount": "3",
                  "offers": [
                    { "@type": "Offer", "name": "Basic Plan", "price": "499" },
                    { "@type": "Offer", "name": "Standard Plan", "price": "999" },
                    { "@type": "Offer", "name": "Premium Plan", "price": "1999" }
                  ]
                },
                "author": {
                  "@type": "Person",
                  "name": "Hridaya Nanda Sarma",
                  "jobTitle": "Founder & Director"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "BHP Production",
                  "url": "https://bhpproduction.com/"
                }
              }
            ]
          })
        }}
      />

      {/* Top Navbar */}
      <header className="w-full bg-card-bg border-b border-border-custom sticky top-0 z-40 shadow-[0_10px_35px_rgba(0,0,0,0.05)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* Logo Branding */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-accent-custom flex items-center justify-center text-white font-extrabold text-lg shadow-sm shadow-accent-custom/20">
              A
            </div>
            <span className="text-xl font-black tracking-tight text-text-primary">
              <span className="text-blue-500">Ad</span>
              <span className="text-red-500">G</span>
              <span className="text-yellow-500">r</span>
              <span className="text-green-500">a</span>
              <span className="text-blue-500">v</span>
              <span className="text-green-500">ity</span>
              <span className="text-red-500">.AI</span>
            </span>
          </Link>

          {/* Links & Widget Actions */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle Widget */}
            <ThemeToggle />

            <Link 
              href="/admin"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-card-bg hover:bg-black/5 dark:hover:bg-white/5 border border-border-custom text-text-primary text-xs font-bold transition-all"
            >
              🔑 Admin Portal
            </Link>
            
            <Link 
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-accent-custom hover:bg-accent-custom/90 text-white text-xs font-bold transition-all shadow-md shadow-accent-custom/10 hover:scale-[1.02] active:scale-[0.98]"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Onboarding Prompt & Headline */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-center lg:text-left animate-fade-in">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-custom/10 border border-accent-custom/20 text-accent-custom text-xs font-bold self-center lg:self-start">
            🌈 Now with Google-Style Aesthetics & Active Themes
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-text-primary font-heading">
            Hyper-Local <span className="text-blue-600">AI Ads</span> for Indian <span className="text-green-600">MSMEs</span>
          </h1>

          <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
            Generate high-converting social media marketing banners, logos, and local slogans dynamically translated to Assamese, Hindi, and English with one-click device deployment.
          </p>

          {/* Public Prompt Box */}
          <div className="glass-panel rounded-3xl p-5 border border-border-custom shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col gap-4 mt-2 max-w-md mx-auto lg:mx-0 w-full bg-card-bg">
            <div className="flex flex-col gap-1 text-left">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Step 1: Describe Business Niches</span>
              <p className="text-xs text-text-primary font-bold">Describe your products or services to render initial drafts:</p>
            </div>
            
            <form onSubmit={handlePublicSubmit} className="flex flex-col gap-3">
              <textarea
                required
                rows={3}
                placeholder="e.g., A pharmacy clinic in Guwahati GS Road providing diagnostics tests and home delivery medicines..."
                value={businessPrompt}
                onChange={(e) => setBusinessPrompt(e.target.value)}
                className="w-full px-4 py-3 bg-bg-primary border border-border-custom rounded-2xl focus:border-accent-custom focus:outline-none text-text-primary text-xs font-medium placeholder-text-secondary resize-none transition-all"
              />
              
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-accent-custom hover:bg-accent-custom/95 text-white font-black text-xs transition-all active:scale-[0.98] shadow-md shadow-accent-custom/25 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🎨 Generate Business Logo</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Fluid Interactive Simulator */}
        <div className="lg:col-span-7 w-full flex flex-col gap-6">
          
          {/* Tabs controls */}
          <div className="flex gap-1.5 p-1 rounded-2xl bg-card-bg border border-border-custom self-center lg:self-end shadow-sm">
            <button 
              onClick={() => setActiveSimTab('reels')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSimTab === 'reels' 
                  ? 'bg-accent-custom text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              🎬 AI Reels Engine
            </button>
            <button 
              onClick={() => setActiveSimTab('theme')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSimTab === 'theme' 
                  ? 'bg-accent-custom text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              🎨 Theme Switcher
            </button>
            <button 
              onClick={() => setActiveSimTab('resize')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSimTab === 'resize' 
                  ? 'bg-accent-custom text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              📐 Layout Resizer
            </button>
          </div>

          {/* Device Mockup Canvas */}
          <div className="w-full aspect-[4/3] rounded-3xl bg-card-bg border border-border-custom p-6 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(26,115,232,0.06),transparent)] pointer-events-none" />

            {/* Window header */}
            <div className="flex justify-between items-center border-b border-border-custom pb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="text-[10px] text-text-secondary font-mono">simulation-preview-widget.mp4</span>
              <div className="w-4 h-4 rounded-full bg-black/5 dark:bg-white/5" />
            </div>

            {/* Simulated Content Viewport */}
            <div className="flex-1 flex items-center justify-center p-4 relative">
              
              {/* Simulator 1: Reels rendering loop */}
              {activeSimTab === 'reels' && (
                <div className="w-36 aspect-[9/16] rounded-2xl border border-border-custom bg-black/5 flex flex-col relative overflow-hidden shadow-lg animate-fade-in">
                  <Image 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&h=280&q=80"
                    alt="Simulator preview"
                    width={144}
                    height={256}
                    className="absolute inset-0 object-cover w-full h-full opacity-60 filter grayscale dark:filter-none"
                    priority
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 text-[7px] font-extrabold text-white px-1.5 py-0.5 rounded z-10 animate-pulse">
                    LIVE RENDERING
                  </div>
                  <div className="absolute bottom-3 inset-x-2 z-10 flex flex-col gap-2">
                    <div className="p-1.5 rounded bg-black/55 backdrop-blur-md border border-white/10 text-[7px] font-mono text-gray-200">
                      Generating MSME ad graphics slogan...
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[7px] text-white/80 font-bold">
                        <span>Compiling frames...</span>
                        <span>{reelsProgress}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-custom transition-all duration-300" style={{ width: `${reelsProgress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Simulator 2: Theme Switcher preview */}
              {activeSimTab === 'theme' && (
                <div className="flex flex-col gap-4 items-center animate-fade-in">
                  <div className={`w-64 h-36 rounded-2xl border-2 p-5 flex flex-col justify-between shadow-md transition-all duration-700 ${
                    simColor === 'blue' ? 'bg-blue-500/10 border-blue-500 text-blue-800 dark:text-blue-300' :
                    simColor === 'green' ? 'bg-green-500/10 border-green-500 text-green-800 dark:text-green-300' :
                    simColor === 'red' ? 'bg-red-500/10 border-red-500 text-red-800 dark:text-red-300' :
                    'bg-yellow-500/10 border-yellow-500 text-yellow-800 dark:text-yellow-300'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-xs">Simulated Brand Identity</h4>
                        <span className="text-[9px] opacity-75">Vibrant Google-Style colors</span>
                      </div>
                      <span className="text-sm">🎨</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded text-[8px] border border-current font-bold">Premium Layout</span>
                      <span className="px-2 py-0.5 rounded text-[8px] border border-current font-bold">Resizes dynamically</span>
                    </div>
                  </div>
                  
                  {/* Color dots controls */}
                  <div className="flex gap-3">
                    <button onClick={() => setSimColor('blue')} className={`w-5 h-5 rounded-full bg-blue-500 border-2 ${simColor === 'blue' ? 'border-text-primary' : 'border-transparent'}`} />
                    <button onClick={() => setSimColor('green')} className={`w-5 h-5 rounded-full bg-green-500 border-2 ${simColor === 'green' ? 'border-text-primary' : 'border-transparent'}`} />
                    <button onClick={() => setSimColor('red')} className={`w-5 h-5 rounded-full bg-red-500 border-2 ${simColor === 'red' ? 'border-text-primary' : 'border-transparent'}`} />
                    <button onClick={() => setSimColor('yellow')} className={`w-5 h-5 rounded-full bg-yellow-500 border-2 ${simColor === 'yellow' ? 'border-text-primary' : 'border-transparent'}`} />
                  </div>
                </div>
              )}

              {/* Simulator 3: Resizer viewport */}
              {activeSimTab === 'resize' && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 animate-fade-in">
                  <div className={`border border-border-custom bg-bg-primary rounded-2xl flex flex-col items-center justify-center p-3 transition-all duration-700 shadow-sm ${
                    resizeLayout === 'portrait' ? 'w-32 h-52' :
                    resizeLayout === 'square' ? 'w-44 h-44' :
                    'w-60 h-32'
                  }`}>
                    <div className="w-full h-full bg-accent-custom/5 border border-accent-custom/20 rounded-lg flex flex-col justify-between p-2">
                      <div className="flex justify-between items-center text-[7px] font-bold text-accent-custom uppercase">
                        <span>AdGravity AI</span>
                        <span className="text-text-secondary">
                          {resizeLayout === 'portrait' ? '9:16' : resizeLayout === 'square' ? '1:1' : '16:9'}
                        </span>
                      </div>
                      <div className="h-6 w-full rounded bg-accent-custom/10 animate-pulse" />
                      <div className="flex gap-1 self-end">
                        <div className="w-2 h-2 rounded-full bg-accent-custom/20" />
                        <div className="w-2 h-2 rounded-full bg-accent-custom/20" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5 flex-wrap">
                    <button onClick={() => setResizeLayout('portrait')} className={`px-2 py-1 rounded-lg text-[9px] font-bold border transition-all ${resizeLayout === 'portrait' ? 'bg-accent-custom border-accent-custom text-white' : 'border-border-custom text-text-secondary'}`}>9:16 Portrait</button>
                    <button onClick={() => setResizeLayout('square')} className={`px-2 py-1 rounded-lg text-[9px] font-bold border transition-all ${resizeLayout === 'square' ? 'bg-accent-custom border-accent-custom text-white' : 'border-border-custom text-text-secondary'}`}>1:1 Square</button>
                    <button onClick={() => setResizeLayout('landscape')} className={`px-2 py-1 rounded-lg text-[9px] font-bold border transition-all ${resizeLayout === 'landscape' ? 'bg-accent-custom border-accent-custom text-white' : 'border-border-custom text-text-secondary'}`}>16:9 Landscape</button>
                  </div>
                </div>
              )}

            </div>

            <div className="border-t border-border-custom pt-3 flex justify-between items-center text-[9px] text-text-secondary font-mono">
              <span>Simulation: Active</span>
              <span>Theme adaptation: Connected</span>
            </div>
          </div>
        </div>
      </main>

      {/* Trust scrolling marquee */}
      <section className="w-full bg-card-bg border-y border-border-custom py-10 overflow-hidden shadow-sm">
        <div className="max-w-7xl mx-auto px-6 mb-4">
          <p className="text-center text-[10px] uppercase tracking-widest text-text-secondary font-bold">
            Empowering regional partners and MSMEs across Guwahati and India
          </p>
        </div>
        <div className="relative w-full flex overflow-x-hidden">
          <div className="animate-scroll flex gap-16 items-center">
            {partnerLogos.concat(partnerLogos).map((logo, index) => (
              <div key={index} className="flex items-center gap-3 text-text-secondary hover:text-accent-custom transition-colors cursor-pointer select-none">
                <div className="w-7 h-7 rounded-lg overflow-hidden border border-border-custom relative shrink-0">
                  <Image 
                    src={logo.src || ''} 
                    alt={logo.name} 
                    width={28} 
                    height={28} 
                    className="object-cover w-full h-full filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <span className="text-sm font-extrabold tracking-tight font-heading">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Component: Monthly/Yearly toggle */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 flex flex-col gap-12 items-center">
        <div className="text-center flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight font-heading">
            Simple, Transparent Pricing Plan
          </h2>
          <p className="text-text-secondary text-xs md:text-sm max-w-xl mx-auto font-medium">
            Start with our 7-day trial subscription for just ₹1. Transition dynamically to standard packages.
          </p>
          
          {/* Toggle switcher */}
          <div className="flex items-center gap-1.5 bg-card-bg p-1 rounded-full border border-border-custom mt-2 self-center shadow-sm">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-4.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-accent-custom text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Monthly Tiers
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-4.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'yearly' ? 'bg-accent-custom text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Yearly Tiers (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Plan 1: Basic */}
          <div className="rounded-3xl bg-card-bg border border-border-custom p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col gap-4 text-xs">
              <span className="text-xs uppercase tracking-wider text-blue-500 font-bold">Basic Tier</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-text-primary">
                  ₹{billingCycle === 'monthly' ? '499' : '3999'}
                </span>
                <span className="text-[10px] text-text-secondary">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <p className="text-text-secondary leading-relaxed font-medium">
                Ideal for micro local shops testing social ad templates.
              </p>
              <hr className="border-border-custom" />
              <ul className="flex flex-col gap-3 font-medium text-text-secondary">
                <li className="flex items-center gap-2">✅ 10 English Caption Generations</li>
                <li className="flex items-center gap-2">✅ Aspect Ratio Canvas Overlays</li>
                <li className="flex items-center gap-2">❌ Regional Translation support</li>
                <li className="flex items-center gap-2">❌ Permanent Logo locking</li>
              </ul>
            </div>
            <button 
              onClick={() => { setShowAuthModal(true); }}
              className="w-full mt-8 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom text-text-primary font-bold text-xs transition-all hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
            >
              Subscribe Plan
            </button>
          </div>

          {/* Plan 2: Standard */}
          <div className="rounded-3xl bg-card-bg border-2 border-accent-custom/40 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-accent-custom text-[9px] font-black tracking-widest text-white uppercase shadow">
              Most Popular
            </span>
            <div className="flex flex-col gap-4 text-xs">
              <span className="text-xs uppercase tracking-wider text-green-600 font-bold">Standard Tier</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-text-primary">
                  ₹{billingCycle === 'monthly' ? '999' : '7999'}
                </span>
                <span className="text-[10px] text-text-secondary">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <p className="text-text-secondary leading-relaxed font-medium">
                Perfect for growing local brands needing bilingual creatives.
              </p>
              <hr className="border-border-custom" />
              <ul className="flex flex-col gap-3 font-medium text-text-secondary">
                <li className="flex items-center gap-2">✅ Unlimited Ad copy generators</li>
                <li className="flex items-center gap-2">✅ Assamese/Hindi translation filters</li>
                <li className="flex items-center gap-2">✅ 4 Logo Initial generations</li>
                <li className="flex items-center gap-2">❌ API Edge Diagnostic Access</li>
              </ul>
            </div>
            <button 
              onClick={() => { setShowAuthModal(true); }}
              className="w-full mt-8 py-3 rounded-xl bg-accent-custom hover:bg-accent-custom/95 text-white font-bold text-xs transition-all shadow-md shadow-accent-custom/15 cursor-pointer"
            >
              Start 7-Day Trial
            </button>
          </div>

          {/* Plan 3: Premium */}
          <div className="rounded-3xl bg-card-bg border border-border-custom p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col gap-4 text-xs">
              <span className="text-xs uppercase tracking-wider text-red-500 font-bold">Premium Tier</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-text-primary">
                  ₹{billingCycle === 'monthly' ? '1999' : '15999'}
                </span>
                <span className="text-[10px] text-text-secondary">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <p className="text-text-secondary leading-relaxed font-medium">
                Bespoke enterprise tier supporting multi-branch setups.
              </p>
              <hr className="border-border-custom" />
              <ul className="flex flex-col gap-3 font-medium text-text-secondary">
                <li className="flex items-center gap-2">✅ Complete diagnostic dashboard</li>
                <li className="flex items-center gap-2">✅ Custom design preset publisher</li>
                <li className="flex items-center gap-2">✅ Unlimited branding lock uploads</li>
                <li className="flex items-center gap-2">✅ Dedicated Support Desk</li>
              </ul>
            </div>
            <button 
              onClick={() => { setShowAuthModal(true); }}
              className="w-full mt-8 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom text-text-primary font-bold text-xs transition-all hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
            >
              Contact Sales
            </button>
          </div>

          {/* Boosting Card */}
          <div className="rounded-3xl bg-yellow-500/[0.03] border border-yellow-500/20 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/5 rounded-full blur-xl" />
            <div className="flex flex-col gap-4 text-xs">
              <span className="text-xs uppercase tracking-wider text-yellow-600 font-bold">Boosting Ads Package</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-text-primary">₹10,000</span>
                <span className="text-[10px] text-text-secondary">/ package</span>
              </div>
              <p className="text-text-secondary leading-relaxed font-medium">
                Includes custom local ads spend configuration, campaign optimization support, and clinical clinical review tags.
              </p>
              <hr className="border-yellow-500/10" />
              <ul className="flex flex-col gap-2.5 font-semibold text-text-secondary">
                <li className="flex items-center gap-1.5">🚀 Professional Campaign Manager</li>
                <li className="flex items-center gap-1.5">🚀 Direct WhatsApp Hotline Support</li>
                <li className="flex items-center gap-1.5">🚀 Targeted Lead Funnels</li>
              </ul>
            </div>
            
            <a 
              href="https://wa.me/919577781416?text=Hi%20AdGravity%20Team,%20I%20am%20interested%20in%20your%20Advertising%20Boosting%20Package!"
              target="_blank"
              rel="noreferrer"
              className="w-full mt-8 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-xs text-center transition-all shadow-md shadow-yellow-500/10 cursor-pointer"
            >
              Order via WhatsApp
            </a>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-card-bg border-t border-border-custom py-12 text-xs text-text-secondary font-medium">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-black text-text-primary tracking-tight font-heading">
              AdGravity<span className="text-accent-custom">.AI</span>
            </span>
            <p className="leading-relaxed">
              Google-Style ad operations platform built by BHP Production.
            </p>
            <span className="text-[10px] text-text-secondary">
              Founder & Director: Hridaya Nanda Sarma
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-text-primary uppercase tracking-widest text-[10px]">Headquarters</span>
            <span>Kahilipara, Guwahati</span>
            <span>Assam, India - 781019</span>
            <span>Support: +91 9577781416</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-bold text-text-primary uppercase tracking-widest text-[10px]">Corporate Legal</span>
            <Link href="/privacy-policy" className="hover:text-accent-custom transition-all">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-accent-custom transition-all">Terms of Service</Link>
            <Link href="/refund-policy" className="hover:text-accent-custom transition-all">Refund & Cancellations</Link>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-bold text-text-primary uppercase tracking-widest text-[10px]">Enterprise Identity</span>
            <span>Parent Org: BHP Production</span>
            <a href="https://bhpproduction.com/" target="_blank" rel="noreferrer" className="hover:text-accent-custom transition-all font-mono">
              https://bhpproduction.com/
            </a>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 border-t border-border-custom mt-8 pt-6 text-center text-[10px] text-text-secondary">
          &copy; {new Date().getFullYear()} AdGravity.AI / BHP Production. All rights reserved.
        </div>
      </footer>

      {/* Floating Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-border-custom py-3 px-6 flex justify-around items-center z-45 md:hidden shadow-[0_-10px_35px_rgba(0,0,0,0.06)]">
        <Link href="/" className="flex flex-col items-center gap-1 text-[10px] font-bold text-accent-custom">
          <span>🏠</span>
          <span>Home</span>
        </Link>
        <button onClick={() => { setShowAuthModal(true); }} className="flex flex-col items-center gap-1 text-[10px] font-bold text-text-secondary">
          <span>✨</span>
          <span>Features</span>
        </button>
        <button onClick={() => { router.push('/admin'); }} className="flex flex-col items-center gap-1 text-[10px] font-bold text-text-secondary">
          <span>🏷️</span>
          <span>Pricing</span>
        </button>
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-[10px] font-bold text-text-secondary">
          <span>📊</span>
          <span>Dashboard</span>
        </Link>
      </div>

      {/* 4. MODAL: REGISTRATION / LOGIN GATE */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-55 animate-fade-in">
          <div className="w-full max-w-md bg-card-bg border border-border-custom rounded-3xl p-8 shadow-2xl relative">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary text-sm p-1.5"
            >
              ✕
            </button>
            
            <div className="flex flex-col items-center gap-2 mb-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-accent-custom flex items-center justify-center text-white font-black text-lg">
                A
              </div>
              <h3 className="text-lg font-black text-text-primary font-heading mt-2">
                {authMode === 'register' ? 'Create Free Account' : 'Welcome Back'}
              </h3>
              <p className="text-text-secondary text-xs font-medium">
                {authMode === 'register' ? 'Register in 1-click to generate your logo Initial variations' : 'Log in to your branding workspace'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4 text-xs font-medium text-text-secondary">
              {authMode === 'register' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-text-primary font-bold">Your Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="John Doe"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-bg-primary border border-border-custom focus:border-accent-custom focus:outline-none text-text-primary transition-all placeholder-text-secondary"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-text-primary font-bold">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-bg-primary border border-border-custom focus:border-accent-custom focus:outline-none text-text-primary transition-all placeholder-text-secondary"
                />
              </div>

              {authMode === 'register' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-text-primary font-bold">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+91 95777 81416"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-bg-primary border border-border-custom focus:border-accent-custom focus:outline-none text-text-primary transition-all placeholder-text-secondary"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-text-primary font-bold">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-bg-primary border border-border-custom focus:border-accent-custom focus:outline-none text-text-primary transition-all placeholder-text-secondary"
                />
              </div>

              <button 
                type="submit"
                className="w-full mt-2 py-3.5 rounded-xl bg-accent-custom hover:bg-accent-custom/95 text-white font-bold transition-all active:scale-[0.98] cursor-pointer shadow-md shadow-accent-custom/10 text-xs"
              >
                {authMode === 'register' ? 'Sign Up & Continue' : 'Log In & Continue'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs">
              {authMode === 'register' ? (
                <span>
                  Already have an account?{' '}
                  <button onClick={() => setAuthMode('login')} className="text-accent-custom font-bold hover:underline cursor-pointer">
                    Log In
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button onClick={() => setAuthMode('register')} className="text-accent-custom font-bold hover:underline cursor-pointer">
                    Sign Up
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
