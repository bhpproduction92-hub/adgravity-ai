'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function DashboardContent() {
  const router = useRouter();
  
  // Profile state for Step-locking logic
  const [profile, setProfile] = useState<any>(null);
  const [themeColor, setThemeColor] = useState('indigo');
  
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
      setEmail(parsed.address); // fallback to complete address or default
      setUpiAddress(parsed.personalPhone ? `${parsed.personalPhone}@okaxis` : '9876543210@okaxis');
      
      // Load saved finalized logo if it exists
      const savedLogo = localStorage.getItem('adgravity_logo');
      if (savedLogo) {
        setFinalizedLogo(savedLogo);
      }

      // Load theme color from localStorage if it exists
      const savedColor = localStorage.getItem('adgravity_theme_color');
      if (savedColor) {
        setThemeColor(savedColor);
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
          // If trial/active, upgrade credits
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
    
    // Once finalized, immediately prompt subscription popup if user does not have active subscription
    if (!response?.subscription) {
      setShowSubscriptionPopup(true);
    }
  };

  // Helper to generate initials for SVG logos
  const getInitials = () => {
    if (!companyName) return 'AG';
    return companyName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  // Get hex color code for dynamic style properties based on theme color selection
  const getColorHex = () => {
    switch (themeColor) {
      case 'emerald': return '#10b981';
      case 'rose': return '#f43f5e';
      case 'amber': return '#f59e0b';
      case 'violet': return '#8b5cf6';
      default: return '#6366f1'; // indigo
    }
  };

  // Get tailwind classes for theme styling
  const getThemeClasses = () => {
    switch (themeColor) {
      case 'emerald':
        return {
          bg: 'bg-emerald-600 hover:bg-emerald-500',
          bgLight: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          text: 'text-emerald-400',
          textHover: 'hover:text-emerald-350',
          accent: 'emerald',
          gradient: 'from-emerald-600 to-teal-500',
          focus: 'focus:border-emerald-500',
          border: 'border-emerald-500/30',
          shadow: 'shadow-emerald-500/15'
        };
      case 'rose':
        return {
          bg: 'bg-rose-600 hover:bg-rose-500',
          bgLight: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
          text: 'text-rose-400',
          textHover: 'hover:text-rose-350',
          accent: 'rose',
          gradient: 'from-rose-600 to-pink-500',
          focus: 'focus:border-rose-500',
          border: 'border-rose-500/30',
          shadow: 'shadow-rose-500/15'
        };
      case 'amber':
        return {
          bg: 'bg-amber-600 hover:bg-amber-500',
          bgLight: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          text: 'text-amber-400',
          textHover: 'hover:text-amber-350',
          accent: 'amber',
          gradient: 'from-amber-600 to-orange-500',
          focus: 'focus:border-amber-500',
          border: 'border-amber-500/30',
          shadow: 'shadow-amber-500/15'
        };
      case 'violet':
        return {
          bg: 'bg-violet-600 hover:bg-violet-500',
          bgLight: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
          text: 'text-violet-400',
          textHover: 'hover:text-violet-350',
          accent: 'violet',
          gradient: 'from-violet-600 to-fuchsia-500',
          focus: 'focus:border-violet-500',
          border: 'border-violet-500/30',
          shadow: 'shadow-violet-500/15'
        };
      default:
        return {
          bg: 'bg-indigo-600 hover:bg-indigo-500',
          bgLight: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
          text: 'text-indigo-400',
          textHover: 'hover:text-indigo-350',
          accent: 'indigo',
          gradient: 'from-indigo-600 to-violet-500',
          focus: 'focus:border-indigo-500',
          border: 'border-indigo-500/30',
          shadow: 'shadow-indigo-500/15'
        };
    }
  };

  // Vector Logo render templates
  const renderLogoSVG = (index: number) => {
    const initials = getInitials();
    const isSelected = selectedLogoIndex === index && !uploadedLogoUrl;
    const theme = getThemeClasses();

    const baseClass = `w-full h-full p-6 flex flex-col items-center justify-center border-2 rounded-2xl cursor-pointer transition-all ${
      isSelected ? `bg-${theme.accent}-600/10 border-${theme.accent}-500` : 'bg-white/[0.01] border-white/5 hover:border-white/20'
    }`;

    // Customize icons based on category
    let innerIcon = (
      <svg className={`w-8 h-8 text-${theme.accent}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );

    if (category === 'Cafe') {
      innerIcon = (
        <span className="text-3xl">☕</span>
      );
    } else if (category === 'Pharmacy') {
      innerIcon = (
        <span className="text-3xl">🩺</span>
      );
    } else if (category === 'SaaS') {
      innerIcon = (
        <span className="text-3xl">💻</span>
      );
    } else if (category === 'Retail') {
      innerIcon = (
        <span className="text-3xl">🛍️</span>
      );
    }

    if (index === 1) {
      return (
        <div onClick={() => { setSelectedLogoIndex(1); setUploadedLogoUrl(null); }} className={baseClass}>
          <div className={`w-16 h-16 rounded-full bg-${theme.accent}-500/10 flex items-center justify-center mb-2`}>
            {innerIcon}
          </div>
          <span className="text-xs font-bold tracking-widest text-white">{initials}</span>
          <span className="text-[8px] text-gray-500 uppercase mt-0.5">Minimalist</span>
        </div>
      );
    }

    if (index === 2) {
      return (
        <div onClick={() => { setSelectedLogoIndex(2); setUploadedLogoUrl(null); }} className={baseClass}>
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border-2 border-violet-500/20 flex items-center justify-center mb-2 rotate-45 group hover:rotate-90 transition-transform duration-500">
            <div className="-rotate-45 font-bold text-white text-lg">{initials}</div>
          </div>
          <span className="text-[8px] text-gray-500 uppercase mt-1">Shield/Badge</span>
        </div>
      );
    }

    if (index === 3) {
      return (
        <div onClick={() => { setSelectedLogoIndex(3); setUploadedLogoUrl(null); }} className={baseClass}>
          <div className={`w-16 h-16 bg-gradient-to-tr ${theme.gradient} rounded-3xl flex items-center justify-center mb-2 shadow-lg ${theme.shadow}`}>
            <span className="text-white text-xl font-black">{initials}</span>
          </div>
          <span className="text-[8px] text-gray-500 uppercase mt-0.5">Modern Tech</span>
        </div>
      );
    }

    return (
      <div onClick={() => { setSelectedLogoIndex(4); setUploadedLogoUrl(null); }} className={baseClass}>
        <div className="w-16 h-16 border-2 border-dashed border-gray-700 hover:border-gray-500 rounded-full flex items-center justify-center mb-2">
          <span className="text-gray-400 text-lg font-serif italic">{initials[0]}</span>
        </div>
        <span className="text-xs font-heading font-semibold text-gray-300">{companyName.slice(0, 10)}</span>
        <span className="text-[8px] text-gray-500 uppercase mt-0.5">Typographic</span>
      </div>
    );
  };

  // Mock Calendar Posts Data
  const calendarPosts = [
    { day: 12, name: 'Assam Medicose Ad', status: 'published', type: 'Vernacular' },
    { day: 16, name: 'Cafe Guwahati Intro', status: 'published', type: 'Bilingual' },
    { day: 17, name: 'Special Weekend Discount', status: 'pending', type: 'Reel' },
    { day: 24, name: 'Monsoon Mega Sale', status: 'scheduled', type: 'Image' }
  ];

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#07090e] text-gray-150 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-xs text-gray-500 font-sans">Checking profile configuration...</span>
        </div>
      </div>
    );
  }

  const theme = getThemeClasses();

  return (
    <div className={`min-h-screen bg-[#07090e] text-gray-100 flex flex-col font-sans selection:bg-${theme.accent}-500 selection:text-white pb-12`}>
      {/* Top Navbar */}
      <header className="w-full bg-[#0c0f18]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${theme.gradient} flex items-center justify-center`}>
              <span className="text-base font-bold text-white">A</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white font-heading">
              AdGravity<span className={`text-${theme.accent}-400`}>.AI</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={() => router.push('/dashboard/generator')}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-all active:scale-95 flex items-center gap-1.5"
            >
              Creative Editor 🎨
            </button>
            <button 
              onClick={() => router.push('/dashboard/settings')}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-all active:scale-95 flex items-center gap-1.5"
            >
              Settings ⚙️
            </button>
            <button 
              onClick={() => router.push('/admin/control-center')}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-all active:scale-95 flex items-center gap-1.5"
            >
              Admin Control 🔑
            </button>

            {response?.subscription ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Trial
              </span>
            ) : (
              <button
                onClick={() => setShowSubscriptionPopup(true)}
                className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/20 hover:border-amber-500/40 text-amber-400 text-xs font-semibold transition-all active:scale-95"
              >
                ⚠️ Start ₹1 Trial
              </button>
            )}
            <button 
              onClick={fetchStatus}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-all active:scale-95"
            >
              Refresh Status
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 4 Cols: Subscription Status & Branding Profile */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Visual Profile & Locked Logo */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">My Brand Workspace</h3>
              <span className={`text-[10px] ${theme.text} uppercase font-semibold`}>Active</span>
            </div>
            
            {/* Display profile metadata */}
            <div className="flex flex-col gap-2.5 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Personal Name:</span>
                <strong className="text-white">{profile.personalName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Business Name:</span>
                <strong className="text-white">{profile.businessName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <strong className="text-white">{profile.businessPhone}</strong>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <strong className="text-white">{profile.category}</strong>
              </div>
            </div>

            {/* Logo display container */}
            <div className="border border-white/5 bg-white/[0.01] rounded-2xl p-4 flex flex-col items-center gap-3">
              <span className="text-[10px] text-gray-500 uppercase font-semibold">Locked Logo Asset</span>
              {finalizedLogo ? (
                <div className="flex flex-col items-center gap-2">
                  {finalizedLogo.startsWith('AI_LOGO_') ? (
                    <div className={`w-20 h-20 rounded-2xl bg-${theme.accent}-500/10 flex items-center justify-center border ${theme.border}`}>
                      <span className="text-white font-black text-xl">{getInitials()}</span>
                    </div>
                  ) : (
                    <img src={finalizedLogo} alt="Finalized Logo" className="w-20 h-20 rounded-2xl object-cover border border-white/10" />
                  )}
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    🔒 Logo Locked & Finalized
                  </span>
                </div>
              ) : (
                <div className="text-center py-4 flex flex-col items-center gap-1">
                  <span className="text-lg">🔓</span>
                  <span className="text-[10px] text-gray-400">No finalized logo found. Use the editor to lock one.</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">Visual Credit Tracker</h3>
              <span className={`text-xs ${theme.text} font-bold`}>Daily Reset</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-5xl font-black text-white">{credits}</span>
              <span className="text-lg text-gray-500 font-medium">/ {maxCredits}</span>
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500" 
                  style={{ width: `${(credits / maxCredits) * 100}%`, backgroundColor: getColorHex() }}
                />
              </div>
              <span className="text-[10px] text-gray-455 mt-1">
                {credits > 0 ? 'Use your credit to generate bilingual ad copies.' : 'Credits depleted. Start a ₹1 trial to replenish!'}
              </span>
            </div>
          </div>
        </div>

        {/* Right 8 Cols: AI Logo generator, AI ad Generator, Calendar Grid */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* AI Logo Generator System Panel (Shows if logo not finalized, or allows updates) */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-white">AI Logo Generator System</h3>
              <p className="text-gray-400 text-xs mt-1">
                Select one AI logo design vector or upload your custom logo to finalize branding.
              </p>
            </div>

            {/* 2x2 Grid of Logo variations */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {renderLogoSVG(1)}
              {renderLogoSVG(2)}
              {renderLogoSVG(3)}
              {renderLogoSVG(4)}
            </div>

            {/* Custom Logo Uploader */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between border-t border-white/5 pt-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-white">Custom Upload</span>
                <span className="text-[10px] text-gray-500">Upload your own .png or .jpg brand mark</span>
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
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer text-xs font-semibold transition-all active:scale-95"
                >
                  Choose Custom File
                </label>
                {uploadedLogoUrl && (
                  <div className="w-10 h-10 rounded border border-white/10 overflow-hidden relative">
                    <img src={uploadedLogoUrl} alt="custom logo preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Finalize Logo button */}
            <button 
              onClick={handleFinalizeLogo}
              className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${theme.gradient} hover:opacity-90 text-white font-semibold text-sm transition-all active:scale-[0.98] shadow-md`}
            >
              Finalize Logo & Connect Workspace
            </button>
          </div>

          {/* AI Ad Generator Section */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-white">Core AI Content Engine</h3>
              <p className="text-gray-400 text-xs mt-1">
                Generate bilingual localized ad campaigns using Gemini 1.5 Flash.
              </p>
            </div>

            <form onSubmit={handleGenerateContent} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400">Business Category</label>
                <input 
                  type="text" 
                  disabled
                  value={category}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 text-sm focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400">Promotion / Offer Details</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="e.g. Get a flat 30% discount on all Guwahati local delivery orders this Sunday!"
                  value={offerDetails}
                  onChange={(e) => setOfferDetails(e.target.value)}
                  className={`px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-${theme.accent}-500 focus:outline-none text-white text-sm transition-all resize-none`}
                />
              </div>

              <button 
                type="submit" 
                disabled={generatingContent}
                className={`w-full py-3.5 rounded-xl bg-${theme.accent}-600 hover:bg-${theme.accent}-500 disabled:opacity-50 text-white font-semibold text-sm transition-all active:scale-[0.98] shadow-md`}
              >
                {generatingContent ? 'Generating captions via Gemini...' : 'Generate Bilingual Ad Copy'}
              </button>
            </form>

            {/* Generation Output Success */}
            {generationSuccess && (
              <div className={`p-5 bg-${theme.accent}-500/10 border border-${theme.accent}-500/20 rounded-2xl flex flex-col gap-4`}>
                <h4 className={`text-sm font-bold ${theme.text}`}>✨ Generated Localized Captions:</h4>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className={`text-[10px] uppercase tracking-wider ${theme.text} font-bold`}>English Caption</span>
                    <p className="text-sm leading-relaxed text-gray-200">{generationSuccess.caption_en}</p>
                  </div>
                  <div className="border-t border-white/5 pt-3 flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-violet-400 font-bold">Assamese Transcreation</span>
                    <p className="text-sm leading-relaxed text-gray-200">{generationSuccess.caption_as}</p>
                  </div>
                </div>
                {/* Visual Resize Link */}
                <div className="border-t border-white/5 pt-4 flex justify-end">
                  <button
                    onClick={() => router.push('/dashboard/generator')}
                    className={`px-4 py-2 rounded-xl bg-${theme.accent}-600 hover:bg-${theme.accent}-500 text-white font-semibold text-xs transition-all active:scale-[0.98] flex items-center gap-1.5`}
                  >
                    🎨 Open in Creative Editor (Resize Layouts)
                  </button>
                </div>
              </div>
            )}

            {/* Generation Error */}
            {generationError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-2xl">
                <strong>Error:</strong> {generationError}
              </div>
            )}
          </div>

          {/* Post History Calendar Grid */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-white">Post History Calendar</h3>
              <p className="text-gray-400 text-xs mt-1">
                Track your active, pending, and scheduled campaigns.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-xs text-gray-400 font-semibold px-2">
                <span>June 2026</span>
                <span className="flex gap-4">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Published</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Pending</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Scheduled</span>
                </span>
              </div>

              {/* Grid 7 Columns for Days */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                  <div key={day} className="text-gray-500 font-bold py-1">{day}</div>
                ))}
                
                {Array.from({ length: 30 }).map((_, index) => {
                  const day = index + 1;
                  const activePost = calendarPosts.find((p) => p.day === day);
                  
                  return (
                    <div 
                      key={day} 
                      className={`aspect-square rounded-lg flex flex-col items-center justify-between p-1.5 relative border ${
                        activePost?.status === 'published' ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' :
                        activePost?.status === 'pending' ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' :
                        activePost?.status === 'scheduled' ? `bg-${theme.accent}-950/20 border-${theme.accent}-500/30 text-${theme.accent}-300` :
                        'bg-white/[0.01] border-white/5 text-gray-505 hover:bg-white/5'
                      }`}
                    >
                      <span className="font-semibold self-start text-[10px]">{day}</span>
                      {activePost && (
                        <div className="w-1.5 h-1.5 rounded-full bg-current absolute bottom-1.5 right-1.5" title={activePost.name} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Queue List */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-white">AI Content Queue</h3>
              <p className="text-gray-400 text-xs mt-1">
                View posts pending approval or scheduled to your Meta feed.
              </p>
            </div>

            {queueItems.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl flex flex-col items-center gap-3">
                <span className="text-gray-500 text-xs">No active items in the queue for user ID: {userId?.slice(0, 10)}...</span>
                <button 
                  onClick={fetchStatus} 
                  disabled={loadingQueue}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-all"
                >
                  {loadingQueue ? 'Fetching queue...' : 'Mock Check Queue'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {queueItems.map((item: any) => (
                  <div key={item.id} className="rounded-2xl bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-mono">ID: {item.id.slice(0, 8)}...</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'pending' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' :
                          'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-gray-505 font-semibold">Prompt</span>
                        <p className="text-gray-300 italic">"{item.prompt}"</p>
                      </div>

                      <div className="flex flex-col gap-3 mt-1">
                        {(() => {
                          const parsed = parseContent(item.ai_content);
                          return (
                            <>
                              <div className="flex flex-col gap-1">
                                <span className={`text-[10px] uppercase tracking-wider ${theme.text} font-bold`}>English Caption</span>
                                <p className="text-xs text-gray-300 leading-relaxed">{parsed.caption_en}</p>
                              </div>
                              {parsed.caption_as && (
                                <div className="flex flex-col gap-1 border-t border-white/5 pt-2">
                                  <span className="text-[10px] uppercase tracking-wider text-violet-400 font-bold">Assamese Version</span>
                                  <p className="text-xs text-gray-300 leading-relaxed">{parsed.caption_as}</p>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="flex gap-3 border-t border-white/5 pt-4">
                      <button className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-all">Approve</button>
                      <button className="flex-1 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/15 text-red-400 font-semibold text-xs border border-red-500/20 transition-all">Reject</button>
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
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[3000]">
          <div className="rounded-3xl bg-[#0c0f18] border-2 border-indigo-600 p-8 flex flex-col items-center gap-6 max-w-sm w-[90%] text-center shadow-2xl">
            <div className="w-12 h-12 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin" />
            <div>
              <h3 className="text-lg font-bold text-indigo-400">Secure Payment Gateway</h3>
              <p className="text-gray-400 text-xs leading-relaxed mt-2 min-h-[32px]">{paymentMessage}</p>
            </div>
            <span className="text-[9px] text-gray-600 tracking-wider">₹1.00 INR SECURE SANDBOX TRANSACTION</span>
          </div>
        </div>
      )}

      {/* Mock Facebook Connection Popup */}
      {isOAuthOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[2000]">
          <div className="rounded-3xl bg-[#0c0f18] border-2 border-[#1877f2] p-6 max-w-md w-[90%] flex flex-col gap-6 shadow-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-bold text-lg">f</div>
              <h3 className="text-lg font-bold text-[#1877f2]">Meta Login Secure Connection</h3>
            </div>

            {oauthStep === 'login' ? (
              <div className="flex flex-col gap-6">
                <p className="text-xs text-gray-350 leading-relaxed">
                  AdGravity AI requests permissions to read and publish posts on your behalf.
                </p>
                <div className="flex flex-col gap-2.5">
                  <button 
                    onClick={() => setOauthStep('select_page')}
                    className="w-full py-3 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold text-xs transition-all active:scale-[0.98]"
                  >
                    Continue as Meta Partner User
                  </button>
                  <button 
                    onClick={() => setIsOAuthOpen(false)}
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs border border-white/10 transition-all"
                  >
                    Cancel Connection
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <span className="text-xs text-gray-400 font-medium">Select a Facebook Page to connect:</span>
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
                      className="w-full flex justify-between items-center px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-left border border-white/5 transition-all text-xs"
                    >
                      <span className="font-semibold text-white">{page.name}</span>
                      <span className="text-[10px] text-gray-500 uppercase">{page.category}</span>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setOauthStep('login')}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 font-semibold text-xs border border-white/5 transition-all"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1500]">
          <div className="rounded-3xl bg-[#0c0f18] border border-white/10 p-6 max-w-md w-[90%] flex flex-col gap-6 shadow-2xl relative">
            {/* Close button */}
            <button 
              onClick={() => setShowSubscriptionPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white text-lg font-bold"
            >
              ✕
            </button>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold">Subscription Mandate</span>
              <h3 className="text-lg font-extrabold text-white">Activate 7-Day Trial for ₹1</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Setup an Auto-Debit UPI mandate. Authorize ₹1 today; recurring ₹999/month starts automatically in 7 days. Cancel anytime inside settings.
              </p>
            </div>

            {/* UPI Selection Buttons */}
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setSelectedUpiMethod('gpay')}
                className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  selectedUpiMethod === 'gpay' ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-white/[0.01] border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <span className="text-2xl">📱</span>
                <span className="text-xs font-semibold">Google Pay</span>
              </button>
              <button 
                type="button"
                onClick={() => setSelectedUpiMethod('phonepe')}
                className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  selectedUpiMethod === 'phonepe' ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-white/[0.01] border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <span className="text-2xl">💜</span>
                <span className="text-xs font-semibold">PhonePe</span>
              </button>
            </div>

            {/* If UPI method selected */}
            {selectedUpiMethod && (
              <div className="flex flex-col gap-4 border-t border-white/5 pt-4 bg-white/[0.01] p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">UPI Mandate Address:</span>
                  <span className="text-indigo-400 font-bold uppercase tracking-wider">{selectedUpiMethod}</span>
                </div>
                
                <input 
                  type="text"
                  value={upiAddress}
                  onChange={(e) => setUpiAddress(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-[#07090e] border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-xs font-mono"
                />

                <div className="flex gap-4 items-center mt-2 border-t border-white/5 pt-3">
                  {/* Mock QR Code */}
                  <div className="w-20 h-20 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-full h-full text-black" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 3h8v8H3zm2 2v4h4V5zm8-2h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm13-1h3v2h-3zm-3 3h3v3h-3zm3 0h3v-2h-3zm-3-3h3v2h-3zm3 5h3v-2h-3zm-3-5h1v1h-1zm2 1h1v1h-1zm-1 2h1v1h-1zm-4-3h1v1h-1zm1 1h1v1h-1zm-1 2h1v1h-1zm4-3h1v1h-1zm1 1h1v1h-1z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1 text-[10px] text-gray-400">
                    <span>Scan QR Code to pay ₹1 & set up the recurring mandate on your mobile GPay / PhonePe app.</span>
                    <span className="text-gray-650 font-semibold mt-1">UPI ID: adgravity.autodebit@hdfc</span>
                  </div>
                </div>

                <form onSubmit={handleRegisterTrial}>
                  <button 
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/15"
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
      <div className="min-h-screen bg-[#07090e] text-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-xs text-gray-500">Loading AdGravity Dashboard...</span>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
