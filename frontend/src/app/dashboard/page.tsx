'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import ThemeToggle from '../../components/ThemeToggle';

const DashboardMetricsCard = dynamic(() => import('./DashboardMetrics').then(mod => mod.DashboardMetricsCard), {
  loading: () => (
    <div className="w-full h-32 bg-card-bg border border-border-custom rounded-3xl animate-pulse flex items-center justify-center text-xs text-text-secondary">
      Loading Credit Status...
    </div>
  ),
  ssr: false,
});

const DashboardCalendarCard = dynamic(() => import('./DashboardMetrics').then(mod => mod.DashboardCalendarCard), {
  loading: () => (
    <div className="w-full h-[320px] bg-card-bg border border-border-custom rounded-3xl animate-pulse flex items-center justify-center text-xs text-text-secondary">
      Loading History Calendar...
    </div>
  ),
  ssr: false,
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function DashboardContent() {
  const router = useRouter();
  
  // Profile state for Step-locking logic
  const [profile, setProfile] = useState<any>(null);
  
  // Form states (synced with profile metadata)
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState('Cafe');
  const [metaPageToken, setMetaPageToken] = useState('EAAbwY7b43...mocktoken');

  // AI Logo Generator States
  const [finalizedLogo, setFinalizedLogo] = useState<string | null>(null);
  const [selectedLogoIndex, setSelectedLogoIndex] = useState<number | null>(null);
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | null>(null);

  // Credit state
  const [credits, setCredits] = useState(1);
  const [maxCredits, setMaxCredits] = useState(1);

  // Subscription / Payment states
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'success'>('idle');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [selectedUpiMethod, setSelectedUpiMethod] = useState<'gpay' | 'phonepe' | null>(null);
  const [upiAddress, setUpiAddress] = useState('');

  // AI Content Generator states
  const [offerDetails, setOfferDetails] = useState('');
  const [generatingContent, setGeneratingContent] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState<any>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isOAuthOpen, setIsOAuthOpen] = useState(false);
  const [oauthStep, setOauthStep] = useState<'login' | 'select_page'>('login');

  // Content Queue state
  const [queueItems, setQueueItems] = useState<any[]>([]);
  const [loadingQueue, setLoadingQueue] = useState(false);

  // Initialize simulated user ID
  useEffect(() => {
    setUserId('user_' + Math.random().toString(36).substring(2, 9));
  }, []);

  // Step-locking: Redirect to onboarding if profile is missing
  useEffect(() => {
    const savedProfile = localStorage.getItem('adgravity_profile');
    if (!savedProfile) {
      router.replace('/dashboard/onboarding');
    } else {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      setCompanyName(parsed.businessName);
      setCategory(parsed.category);
      setFullName(parsed.personalName);
      setEmail(parsed.address);
      setUpiAddress(parsed.personalPhone ? `${parsed.personalPhone}@okaxis` : '9876543210@okaxis');
      
      // Load saved finalized logo if it exists
      const savedLogo = localStorage.getItem('adgravity_logo');
      if (savedLogo) {
        setFinalizedLogo(savedLogo);
      }
    }
  }, [router]);

  // Fetch status & queue on request
  const fetchStatus = async () => {
    if (!userId) return;
    setLoadingQueue(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/${userId}/status`);
      if (res.ok) {
        const data = await res.json();
        if (data.subscription) {
          setResponse({ subscription: data.subscription });
          if (data.subscription.status === 'Trial' || data.subscription.status === 'active') {
            setCredits(10);
            setMaxCredits(10);
          }
        }
      }
      
      const qRes = await fetch(`${API_BASE_URL}/api/content-queue/${userId}`);
      if (qRes.ok) {
        const qData = await qRes.json();
        setQueueItems(qData.queue || []);
      }
    } catch (err) {
      console.error('Failed to fetch status/queue', err);
    } finally {
      setLoadingQueue(false);
    }
  };

  useEffect(() => {
    if (userId && profile) {
      fetchStatus();
    }
  }, [userId, profile]);

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (credits <= 0) {
      setGenerationError('Out of daily credits. Please activate your ₹1 trial subscription.');
      return;
    }
    
    setGeneratingContent(true);
    setGenerationError(null);
    setGenerationSuccess(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/content/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          businessType: category,
          businessName: companyName || 'My Business',
          offerDetails
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setGenerationSuccess(data.content);
      setOfferDetails('');
      setCredits((prev) => Math.max(0, prev - 1));
      fetchStatus();
    } catch (err: any) {
      setGenerationError(err.message || 'Error communicating with server.');
    } finally {
      setGeneratingContent(false);
    }
  };

  const parseContent = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return { caption_en: jsonStr, caption_as: '' };
    }
  };

  // UPI Autodebit payment flow
  const handleRegisterTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    setPaymentStep('processing');

    try {
      setPaymentMessage('Verifying UPI Auto-Debit Autopay mandate...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPaymentMessage('Processing ₹1.00 verification fee via GPay/PhonePe...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPaymentMessage('Securing recurring mandate authorization...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const res = await fetch(`${API_BASE_URL}/api/subscriptions/trial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          businessName: companyName,
          businessDetails: {
            email: profile.email || 'partner@example.com',
            fullName: profile.personalName,
            category: profile.category,
            metaPageToken,
            activatedAt: new Date().toISOString()
          }
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResponse(data);
      setPaymentStep('success');
      setCredits(10);
      setMaxCredits(10);
      setShowSubscriptionPopup(false);
      fetchStatus();
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend server. Make sure it is running on Render.');
      setPaymentStep('idle');
    } finally {
      setLoading(false);
    }
  };

  // Logo uploader
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedLogoUrl(reader.result as string);
        setSelectedLogoIndex(null); // Deselect AI logo
      };
      reader.readAsDataURL(file);
    }
  };

  // Lock selected logo
  const handleFinalizeLogo = () => {
    let logoValue = '';
    if (uploadedLogoUrl) {
      logoValue = uploadedLogoUrl;
    } else if (selectedLogoIndex !== null) {
      logoValue = `AI_LOGO_${selectedLogoIndex}`;
    } else {
      alert('Please select an AI logo or upload your own to finalize!');
      return;
    }

    setFinalizedLogo(logoValue);
    localStorage.setItem('adgravity_logo', logoValue);
    
    if (!response?.subscription) {
      setShowSubscriptionPopup(true);
    }
  };

  // Helper to generate initials for SVG logos
  const getInitials = () => {
    if (!companyName) return 'AG';
    return companyName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  // Vector Logo render templates
  const renderLogoSVG = (index: number) => {
    const initials = getInitials();
    const isSelected = selectedLogoIndex === index && !uploadedLogoUrl;

    const baseClass = `w-full h-full p-5 flex flex-col items-center justify-center border border-border-custom rounded-2xl cursor-pointer transition-all duration-300 select-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] ${
      isSelected 
        ? 'bg-accent-custom/10 border-accent-custom text-accent-custom' 
        : 'bg-card-bg text-text-primary hover:border-text-secondary/35'
    }`;

    let innerIcon = (
      <svg className="w-8 h-8 text-accent-custom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );

    if (category === 'Cafe') {
      innerIcon = <span className="text-3xl">☕</span>;
    } else if (category === 'Pharmacy') {
      innerIcon = <span className="text-3xl">🩺</span>;
    } else if (category === 'SaaS') {
      innerIcon = <span className="text-3xl">💻</span>;
    } else if (category === 'Retail') {
      innerIcon = <span className="text-3xl">🛍️</span>;
    }

    if (index === 1) {
      return (
        <div onClick={() => { setSelectedLogoIndex(1); setUploadedLogoUrl(null); }} className={baseClass}>
          <div className="w-14 h-14 rounded-full bg-accent-custom/10 flex items-center justify-center mb-2">
            {innerIcon}
          </div>
          <span className="text-xs font-bold tracking-widest">{initials}</span>
          <span className="text-[9px] text-text-secondary uppercase mt-0.5 font-semibold">Minimalist</span>
        </div>
      );
    }

    if (index === 2) {
      return (
        <div onClick={() => { setSelectedLogoIndex(2); setUploadedLogoUrl(null); }} className={baseClass}>
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border-2 border-indigo-500/25 flex items-center justify-center mb-2 rotate-45 group hover:rotate-90 transition-transform duration-500">
            <div className="-rotate-45 font-bold text-text-primary text-sm">{initials}</div>
          </div>
          <span className="text-[9px] text-text-secondary uppercase mt-1.5 font-semibold">Shield/Badge</span>
        </div>
      );
    }

    if (index === 3) {
      return (
        <div onClick={() => { setSelectedLogoIndex(3); setUploadedLogoUrl(null); }} className={baseClass}>
          <div className="w-14 h-14 bg-gradient-to-tr from-accent-custom to-indigo-500 rounded-3xl flex items-center justify-center mb-2 shadow-sm">
            <span className="text-white text-base font-black">{initials}</span>
          </div>
          <span className="text-[9px] text-text-secondary uppercase mt-0.5 font-semibold">Modern Tech</span>
        </div>
      );
    }

    return (
      <div onClick={() => { setSelectedLogoIndex(4); setUploadedLogoUrl(null); }} className={baseClass}>
        <div className="w-14 h-14 border-2 border-dashed border-border-custom hover:border-text-secondary/50 rounded-full flex items-center justify-center mb-2">
          <span className="text-text-primary text-base font-serif italic">{initials[0]}</span>
        </div>
        <span className="text-xs font-semibold text-text-primary truncate max-w-full">{companyName.slice(0, 10)}</span>
        <span className="text-[9px] text-text-secondary uppercase mt-0.5 font-semibold">Typographic</span>
      </div>
    );
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-secondary flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-accent-custom/20 border-t-accent-custom rounded-full animate-spin" />
          <span className="text-xs font-semibold">Checking profile configuration...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-text-primary flex flex-col font-sans selection:bg-accent-custom selection:text-white pb-12 transition-colors duration-300">
      {/* Top Navbar */}
      <header className="w-full bg-card-bg/80 backdrop-blur-xl border-b border-border-custom sticky top-0 z-40 shadow-[0_10px_35px_rgba(0,0,0,0.05)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 rounded-xl bg-accent-custom flex items-center justify-center shadow-sm">
              <span className="text-base font-bold text-white">A</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-text-primary font-heading">
              AdGravity<span className="text-accent-custom">.AI</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={() => router.push('/dashboard/generator')}
              className="px-3.5 py-2 rounded-xl bg-card-bg hover:bg-bg-primary text-text-primary font-semibold text-xs border border-border-custom transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm select-none"
            >
              Creative Editor 🎨
            </button>
            <button 
              onClick={() => router.push('/dashboard/settings')}
              className="px-3.5 py-2 rounded-xl bg-card-bg hover:bg-bg-primary text-text-primary font-semibold text-xs border border-border-custom transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm select-none"
            >
              Settings ⚙️
            </button>
            <button 
              onClick={() => router.push('/admin/control-center')}
              className="px-3.5 py-2 rounded-xl bg-card-bg hover:bg-bg-primary text-text-primary font-semibold text-xs border border-border-custom transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm select-none"
            >
              Admin Control 🔑
            </button>

            {response?.subscription ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Trial
              </span>
            ) : (
              <button
                onClick={() => setShowSubscriptionPopup(true)}
                className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 text-amber-600 dark:text-amber-400 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              >
                ⚠️ Start ₹1 Trial
              </button>
            )}

            <button 
              onClick={fetchStatus}
              className="px-3.5 py-2 rounded-xl bg-card-bg hover:bg-bg-primary text-text-primary font-semibold text-xs border border-border-custom transition-all active:scale-95 cursor-pointer shadow-sm select-none"
            >
              Refresh Status 🔄
            </button>

            {/* Top navbar theme selector */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 4 Cols: Subscription Status & Branding Profile */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Visual Profile & Locked Logo */}
          <div className="bg-white shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-slate-100/80 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
            <div className="flex justify-between items-center border-b border-border-custom pb-3">
              <h3 className="text-xs font-bold tracking-wider text-text-secondary uppercase">My Brand Workspace</h3>
              <span className="text-[10px] text-accent-custom uppercase font-extrabold">Active</span>
            </div>
            
            <div className="flex flex-col gap-2.5 text-xs text-text-secondary">
              <div className="flex justify-between">
                <span>Personal Name:</span>
                <strong className="text-text-primary">{profile.personalName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Business Name:</span>
                <strong className="text-text-primary">{profile.businessName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <strong className="text-text-primary">{profile.businessPhone}</strong>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <strong className="text-text-primary">{profile.category}</strong>
              </div>
            </div>

            {/* Logo display container */}
            <div className="border border-border-custom bg-bg-primary rounded-2xl p-4 flex flex-col items-center gap-3">
              <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Locked Logo Asset</span>
              {finalizedLogo ? (
                <div className="flex flex-col items-center gap-2">
                  {finalizedLogo.startsWith('AI_LOGO_') ? (
                    <div className="w-16 h-16 rounded-2xl bg-accent-custom/10 flex items-center justify-center border border-accent-custom/25 shadow-sm">
                      <span className="text-accent-custom font-black text-xl">{getInitials()}</span>
                    </div>
                  ) : (
                    <Image 
                      src={finalizedLogo} 
                      alt="Finalized Logo" 
                      width={64} 
                      height={64} 
                      className="rounded-2xl object-cover border border-border-custom" 
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMWYyZSIvPjwvc3ZnPg=="
                    />
                  )}
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    🔒 Logo Locked & Finalized
                  </span>
                </div>
              ) : (
                <div className="text-center py-4 flex flex-col items-center gap-1 select-none">
                  <span className="text-2xl">🔓</span>
                  <span className="text-[10px] text-text-secondary">No finalized logo found. Lock one below.</span>
                </div>
              )}
            </div>
          </div>

          <DashboardMetricsCard credits={credits} maxCredits={maxCredits} />
        </div>

        {/* Right 8 Cols: AI Logo generator, AI ad Generator, Calendar Grid */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* AI Logo Generator System Panel */}
          <div className="bg-white shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-slate-100/80 rounded-2xl p-6 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
            <div>
              <h3 className="text-lg font-bold text-text-primary font-heading">AI Logo Generator System</h3>
              <p className="text-text-secondary text-xs mt-1">
                Select one AI logo design vector or upload your custom logo to finalize branding.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {renderLogoSVG(1)}
              {renderLogoSVG(2)}
              {renderLogoSVG(3)}
              {renderLogoSVG(4)}
            </div>

            {/* Custom Logo Uploader */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between border-t border-border-custom pt-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-text-primary">Custom Upload</span>
                <span className="text-[10px] text-text-secondary">Upload your own .png or .jpg brand mark</span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="file" 
                  accept="image/*"
                  id="logo-upload"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <label 
                  htmlFor="logo-upload"
                  className="px-4 py-2 rounded-xl bg-card-bg hover:bg-bg-primary border border-border-custom cursor-pointer text-xs font-semibold transition-all active:scale-95 text-text-primary shadow-sm select-none"
                >
                  Choose Custom File
                </label>
                {uploadedLogoUrl && (
                  <div className="w-10 h-10 rounded border border-border-custom overflow-hidden relative">
                    <Image 
                      src={uploadedLogoUrl} 
                      alt="custom logo preview" 
                      width={40} 
                      height={40} 
                      className="w-full h-full object-cover" 
                      unoptimized 
                    />
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleFinalizeLogo}
              className="w-full py-3.5 rounded-xl bg-accent-custom hover:opacity-90 text-white font-semibold text-sm transition-all active:scale-[0.98] shadow-sm cursor-pointer select-none"
            >
              Finalize Logo & Connect Workspace
            </button>
          </div>

          {/* AI Ad Generator Section */}
          <div className="bg-white shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-slate-100/80 rounded-2xl p-6 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
            <div>
              <h3 className="text-lg font-bold text-text-primary font-heading">Core AI Content Engine</h3>
              <p className="text-text-secondary text-xs mt-1">
                Generate bilingual localized ad campaigns using Gemini 1.5 Flash.
              </p>
            </div>

            <form onSubmit={handleGenerateContent} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">Business Category</label>
                <input 
                  type="text" 
                  disabled
                  value={category}
                  className="px-4 py-2.5 rounded-xl bg-bg-primary border border-border-custom text-text-secondary text-sm focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">Promotion / Offer Details</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="e.g. Get a flat 30% discount on all Guwahati local delivery orders this Sunday!"
                  value={offerDetails}
                  onChange={(e) => setOfferDetails(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-card-bg border border-border-custom focus:border-accent-custom focus:outline-none text-text-primary text-sm transition-all resize-none placeholder-text-secondary/50"
                />
              </div>

              <button 
                type="submit" 
                disabled={generatingContent}
                className="w-full py-3.5 rounded-xl bg-accent-custom hover:opacity-90 disabled:opacity-50 text-white font-semibold text-sm transition-all active:scale-[0.98] shadow-sm cursor-pointer select-none"
              >
                {generatingContent ? 'Generating captions via Gemini...' : 'Generate Bilingual Ad Copy'}
              </button>
            </form>

            {/* Generation Output Success */}
            {generationSuccess && (
              <div className="p-5 bg-accent-custom/5 border border-border-custom rounded-2xl flex flex-col gap-4">
                <h4 className="text-sm font-bold text-accent-custom">✨ Generated Localized Captions:</h4>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-accent-custom font-extrabold">English Caption</span>
                    <p className="text-sm leading-relaxed text-text-primary font-sans">{generationSuccess.caption_en}</p>
                  </div>
                  <div className="border-t border-border-custom pt-3 flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-indigo-500 font-extrabold">Assamese Transcreation</span>
                    <p className="text-sm leading-relaxed text-text-primary font-sans">{generationSuccess.caption_as}</p>
                  </div>
                </div>
                {/* Visual Resize Link */}
                <div className="border-t border-border-custom pt-4 flex justify-end">
                  <button
                    onClick={() => router.push('/dashboard/generator')}
                    className="px-4 py-2 rounded-xl bg-accent-custom hover:opacity-90 text-white font-semibold text-xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer shadow-sm select-none"
                  >
                    🎨 Open in Creative Editor (Resize Layouts)
                  </button>
                </div>
              </div>
            )}

            {/* Generation Error */}
            {generationError && (
              <div className="p-4 bg-red-550/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-2xl">
                <strong>Error:</strong> {generationError}
              </div>
            )}
          </div>

          <DashboardCalendarCard />

          {/* Content Queue List */}
          <div className="bg-white shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-slate-100/80 rounded-2xl p-6 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
            <div>
              <h3 className="text-lg font-bold text-text-primary font-heading">AI Content Queue</h3>
              <p className="text-text-secondary text-xs mt-1">
                View posts pending approval or scheduled to your Meta feed.
              </p>
            </div>

            {queueItems.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border-custom rounded-2xl flex flex-col items-center gap-3">
                <span className="text-text-secondary text-xs">No active items in the queue for user ID: {userId?.slice(0, 10)}...</span>
                <button 
                  onClick={fetchStatus} 
                  disabled={loadingQueue}
                  className="px-4 py-2 rounded-xl bg-card-bg hover:bg-bg-primary text-text-primary font-semibold text-xs border border-border-custom transition-all cursor-pointer shadow-sm select-none"
                >
                  {loadingQueue ? 'Fetching queue...' : 'Mock Check Queue'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {queueItems.map((item: any) => (
                  <div key={item.id} className="rounded-2xl bg-bg-primary border border-border-custom p-5 flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-secondary font-mono">ID: {item.id.slice(0, 8)}...</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'pending' 
                            ? 'bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400' 
                            : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-text-secondary font-bold">Prompt</span>
                        <p className="text-text-primary italic">"{item.prompt}"</p>
                      </div>

                      <div className="flex flex-col gap-3 mt-1">
                        {(() => {
                          const parsed = parseContent(item.ai_content);
                          return (
                            <>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-wider text-accent-custom font-extrabold">English Caption</span>
                                <p className="text-xs text-text-primary leading-relaxed">{parsed.caption_en}</p>
                              </div>
                              {parsed.caption_as && (
                                <div className="flex flex-col gap-1 border-t border-border-custom pt-2">
                                  <span className="text-[10px] uppercase tracking-wider text-indigo-500 font-extrabold">Assamese Version</span>
                                  <p className="text-xs text-text-primary leading-relaxed">{parsed.caption_as}</p>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="flex gap-3 border-t border-border-custom pt-4">
                      <button className="flex-1 py-2 rounded-xl bg-card-bg hover:bg-bg-primary text-text-primary font-bold text-xs border border-border-custom transition-all cursor-pointer shadow-sm">Approve</button>
                      <button className="flex-1 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/15 text-red-600 dark:text-red-400 font-bold text-xs border border-red-500/20 transition-all cursor-pointer">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mock Payment Processing Overlay */}
      {paymentStep === 'processing' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[3000]">
          <div className="rounded-3xl bg-card-bg border border-border-custom p-8 flex flex-col items-center gap-6 max-w-sm w-[90%] text-center shadow-xl">
            <div className="w-12 h-12 border-4 border-accent-custom/20 border-t-accent-custom rounded-full animate-spin" />
            <div>
              <h3 className="text-lg font-bold text-accent-custom font-heading">Secure Payment Gateway</h3>
              <p className="text-text-secondary text-xs leading-relaxed mt-2 min-h-[32px]">{paymentMessage}</p>
            </div>
            <span className="text-[9px] text-text-secondary tracking-wider font-semibold">₹1.00 INR SECURE SANDBOX TRANSACTION</span>
          </div>
        </div>
      )}

      {/* Mock Facebook Connection Popup */}
      {isOAuthOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000]">
          <div className="rounded-3xl bg-card-bg border border-border-custom p-6 max-w-md w-[90%] flex flex-col gap-6 shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-bold text-lg">f</div>
              <h3 className="text-lg font-bold text-[#1877f2] font-heading">Meta Login Secure Connection</h3>
            </div>

            {oauthStep === 'login' ? (
              <div className="flex flex-col gap-6">
                <p className="text-xs text-text-secondary leading-relaxed">
                  AdGravity AI requests permissions to read and publish posts on your behalf.
                </p>
                <div className="flex flex-col gap-2.5">
                  <button 
                    onClick={() => setOauthStep('select_page')}
                    className="w-full py-3 rounded-xl bg-[#1877f2] hover:opacity-90 text-white font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer shadow-sm"
                  >
                    Continue as Meta Partner User
                  </button>
                  <button 
                    onClick={() => setIsOAuthOpen(false)}
                    className="w-full py-3 rounded-xl bg-card-bg hover:bg-bg-primary text-text-primary font-semibold text-xs border border-border-custom transition-all cursor-pointer shadow-sm"
                  >
                    Cancel Connection
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <span className="text-xs text-text-secondary font-semibold">Select a Facebook Page to connect:</span>
                <div className="flex flex-col gap-2.5">
                  {[
                    { name: 'Cafe Delight Guwahati', category: 'Cafe', token: 'EAAbwY7b43_page_token_cafe_delight_guwahati' },
                    { name: 'Assam Medicose', category: 'Pharmacy', token: 'EAAbwY7b43_page_token_assam_medicose' },
                    { name: 'AdGravity AI Tech Page', category: 'SaaS', token: 'EAAbwY7b43_page_token_adgravity_ai_tech' }
                  ].map((page) => (
                    <button
                      key={page.name}
                      onClick={() => {
                        setMetaPageToken(page.token);
                        setCompanyName(page.name);
                        setCategory(page.category);
                        setIsOAuthOpen(false);
                        setOauthStep('login');
                      }}
                      className="w-full flex justify-between items-center px-4 py-3 rounded-xl bg-card-bg hover:bg-bg-primary text-left border border-border-custom transition-all text-xs cursor-pointer shadow-sm text-text-primary"
                    >
                      <span className="font-semibold">{page.name}</span>
                      <span className="text-[9px] text-text-secondary uppercase font-bold">{page.category}</span>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setOauthStep('login')}
                  className="w-full py-2.5 rounded-xl bg-card-bg hover:bg-bg-primary text-text-secondary font-semibold text-xs border border-border-custom transition-all cursor-pointer shadow-sm"
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* UPI Autodebit 7-Day Trial Popup Framework */}
      {showSubscriptionPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1500]">
          <div className="rounded-3xl bg-card-bg border border-border-custom p-6 max-w-md w-[90%] flex flex-col gap-6 shadow-xl relative">
            <button 
              onClick={() => setShowSubscriptionPopup(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary text-lg font-bold cursor-pointer"
            >
              ✕
            </button>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-accent-custom font-extrabold">Subscription Mandate</span>
              <h3 className="text-lg font-extrabold text-text-primary font-heading">Activate 7-Day Trial for ₹1</h3>
              <p className="text-text-secondary text-xs leading-relaxed">
                Setup an Auto-Debit UPI mandate. Authorize ₹1 today; recurring ₹999/month starts automatically in 7 days. Cancel anytime inside settings.
              </p>
            </div>

            {/* UPI Selection Buttons */}
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setSelectedUpiMethod('gpay')}
                className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  selectedUpiMethod === 'gpay' 
                    ? 'bg-accent-custom/5 border-accent-custom text-accent-custom font-bold' 
                    : 'bg-card-bg border-border-custom text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="text-2xl">📱</span>
                <span className="text-xs font-semibold">Google Pay</span>
              </button>
              <button 
                type="button"
                onClick={() => setSelectedUpiMethod('phonepe')}
                className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  selectedUpiMethod === 'phonepe' 
                    ? 'bg-accent-custom/5 border-accent-custom text-accent-custom font-bold' 
                    : 'bg-card-bg border-border-custom text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="text-2xl">💜</span>
                <span className="text-xs font-semibold">PhonePe</span>
              </button>
            </div>

            {selectedUpiMethod && (
              <div className="flex flex-col gap-4 border-t border-border-custom pt-4 bg-bg-primary p-4 rounded-2xl border border-border-custom">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary font-semibold">UPI Mandate Address:</span>
                  <span className="text-accent-custom font-extrabold uppercase tracking-wider">{selectedUpiMethod}</span>
                </div>
                
                <input 
                  type="text"
                  value={upiAddress}
                  onChange={(e) => setUpiAddress(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-card-bg border border-border-custom focus:border-accent-custom focus:outline-none text-text-primary text-xs font-mono"
                />

                <div className="flex gap-4 items-center mt-2 border-t border-border-custom pt-3">
                  <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center shrink-0 border border-border-custom">
                    <svg className="w-full h-full text-black" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 3h8v8H3zm2 2v4h4V5zm8-2h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm13-1h3v2h-3zm-3 3h3v3h-3zm3 0h3v-2h-3zm-3-3h3v2h-3zm3 5h3v-2h-3zm-3-5h1v1h-1zm2 1h1v1h-1zm-1 2h1v1h-1zm-4-3h1v1h-1zm1 1h1v1h-1zm-1 2h1v1h-1zm4-3h1v1h-1zm1 1h1v1h-1z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1 text-[10px] text-text-secondary">
                    <span>Scan QR Code to pay ₹1 & set up the recurring mandate on your mobile GPay / PhonePe app.</span>
                    <span className="text-text-primary font-bold mt-0.5">UPI ID: adgravity.autodebit@hdfc</span>
                  </div>
                </div>

                <form onSubmit={handleRegisterTrial}>
                  <button 
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all active:scale-[0.98] shadow-sm cursor-pointer select-none"
                  >
                    Authorize Mandate (₹1.00)
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-primary text-text-secondary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-accent-custom/20 border-t-accent-custom rounded-full animate-spin" />
          <span className="text-xs font-semibold">Loading AdGravity Dashboard...</span>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
