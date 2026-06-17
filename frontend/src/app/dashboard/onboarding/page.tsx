'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../../../components/ThemeToggle';
import { DEFAULT_CATEGORIES, CategoryItem } from '../../admin/control-center/CategoryController';

type OnboardingStep = 'profile' | 'logo_generation' | 'trial_payment';

export default function OnboardingPage() {
  const router = useRouter();

  // Onboarding Steps
  const [step, setStep] = useState<OnboardingStep>('profile');

  // Form States
  const [personalName, setPersonalName] = useState('');
  const [personalPhone, setPersonalPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gmbLink, setGmbLink] = useState('');
  
  // Custom searchable category list states
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [category, setCategory] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Logo selection
  const [logoOption, setLogoOption] = useState<string>('ai_1');
  const [customLogoUrl, setCustomLogoUrl] = useState<string>('');
  const [isFinalizingLogo, setIsFinalizingLogo] = useState(false);

  // Trial payment
  const [upiOption, setUpiOption] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('gpay');
  const [upiNumber, setUpiNumber] = useState('');
  const [isProcessingUPI, setIsProcessingUPI] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('adgravity_categories');
    let loaded: CategoryItem[] = [];
    if (saved) {
      try {
        loaded = JSON.parse(saved);
      } catch (err) {
        loaded = DEFAULT_CATEGORIES;
      }
    } else {
      loaded = DEFAULT_CATEGORIES;
    }
    setCategories(loaded);
    if (loaded.length > 0) {
      setCategory(loaded[0].name);
    }
  }, []);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    
    // Move to logo generator step
    setStep('logo_generation');
  };

  // Extract monogram from business name
  const getMonogram = () => {
    if (!businessName) return 'AD';
    const parts = businessName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return businessName.slice(0, 2).toUpperCase();
  };

  const handleFinalizeLogo = () => {
    setIsFinalizingLogo(true);
    setTimeout(() => {
      let finalizedUrl = '';
      if (logoOption === 'custom' && customLogoUrl) {
        finalizedUrl = customLogoUrl;
      } else {
        finalizedUrl = `mock_ai_logo_${logoOption}`;
      }
      
      // Save logo preferences
      localStorage.setItem('adgravity_brand_logo', finalizedUrl);
      setIsFinalizingLogo(false);
      setStep('trial_payment');
    }, 1200);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingUPI(true);
    
    setTimeout(() => {
      // Save full profile and mark complete
      const profile = {
        personalName,
        personalPhone,
        businessName,
        businessPhone,
        address,
        gmbLink,
        category,
        logoUrl: localStorage.getItem('adgravity_brand_logo') || `mock_ai_logo_ai_1`,
        trialActivated: true,
        trialStartedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };
      
      localStorage.setItem('adgravity_profile', JSON.stringify(profile));
      setIsProcessingUPI(false);
      setPaymentSuccess(true);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }, 2000);
  };

  // Filter categories based on search input
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.vertical.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered categories by their Indian Vertical category
  const groupedCategories = filteredCategories.reduce((acc, cat) => {
    if (!acc[cat.vertical]) {
      acc[cat.vertical] = [];
    }
    acc[cat.vertical].push(cat);
    return acc;
  }, {} as Record<string, CategoryItem[]>);

  const monogram = getMonogram();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-sans transition-colors duration-300 font-urbanist pb-12">
      {/* Top Navbar */}
      <header className="w-full bg-card-bg border-b border-border-custom sticky top-0 z-40 shadow-[0_10px_35px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 rounded-xl bg-accent-custom flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
              A
            </div>
            <span className="text-lg font-black tracking-tight text-text-primary font-heading">
              AdGravity<span className="text-accent-custom">.AI</span> Profile
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 mt-4">
        
        {/* Step 1: PROFILE SETUP */}
        {step === 'profile' && (
          <div className="w-full max-w-xl bg-card-bg border border-border-custom rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] animate-fade-in">
            <div className="flex flex-col items-center gap-2 mb-8 text-center">
              <span className="text-[10px] uppercase tracking-widest text-accent-custom font-extrabold">Step 1 of 3</span>
              <h1 className="text-2xl font-black text-text-primary font-heading">
                Business Profile Setup
              </h1>
              <p className="text-text-secondary text-xs font-medium">
                Complete your business details to unlock logo generation & creative features.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5 text-xs font-bold text-text-secondary">
              
              {/* Section: Personal */}
              <div className="border-b border-border-custom pb-4 flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-widest text-accent-custom">1. Personal Coordinates</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-text-primary">Your Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="John Doe"
                      value={personalName}
                      onChange={(e) => setPersonalName(e.target.value)}
                      className="px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary transition-all placeholder-text-secondary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-text-primary">Personal Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 99999 88888"
                      value={personalPhone}
                      onChange={(e) => setPersonalPhone(e.target.value)}
                      className="px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary transition-all placeholder-text-secondary"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Business */}
              <div className="flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-widest text-accent-custom">2. Business Settings</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-text-primary">Business Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Cafe Delight"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary transition-all placeholder-text-secondary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-text-primary">Business Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 361 234567"
                      value={businessPhone}
                      onChange={(e) => setBusinessPhone(e.target.value)}
                      className="px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary transition-all placeholder-text-secondary"
                    />
                  </div>
                </div>

                {/* Custom Category selector */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-text-primary">Business Category</label>
                  
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-custom focus:border-accent-custom focus:outline-none text-text-primary flex justify-between items-center text-left"
                  >
                    <span className="truncate">{category || 'Select a Category'}</span>
                    <svg className={`w-4 h-4 text-text-secondary transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-card-bg border border-border-custom rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-64 animate-fade-in">
                        
                        <div className="p-3 border-b border-border-custom bg-bg-primary flex items-center gap-2">
                          <input 
                            type="text"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent text-text-primary text-xs focus:outline-none placeholder-text-secondary"
                            autoFocus
                          />
                        </div>

                        <div className="overflow-y-auto flex-1 p-2 max-h-48">
                          {Object.keys(groupedCategories).length === 0 ? (
                            <div className="p-4 text-center text-text-secondary italic">
                              No categories found
                            </div>
                          ) : (
                            Object.entries(groupedCategories).map(([verticalName, items]) => (
                              <div key={verticalName} className="mb-2">
                                <div className="px-2 py-0.5 text-[8px] font-black text-accent-custom uppercase tracking-wider bg-accent-custom/5 rounded mb-1">
                                  {verticalName}
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  {items.map((item) => (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => {
                                        setCategory(item.name);
                                        setDropdownOpen(false);
                                        setSearchQuery('');
                                      }}
                                      className={`w-full px-2.5 py-1.5 text-left rounded-lg text-xs transition-colors flex justify-between items-center ${
                                        category === item.name 
                                          ? 'bg-accent-custom/10 text-accent-custom font-extrabold border border-accent-custom/25' 
                                          : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                                      }`}
                                    >
                                      <span>{item.name}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-text-primary">Complete Address</label>
                  <textarea 
                    required
                    rows={2}
                    placeholder="G.S. Road, Christian Basti, Guwahati, Assam - 781005"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-bg-primary border border-border-custom focus:border-accent-custom focus:outline-none text-text-primary resize-none placeholder-text-secondary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-text-primary">GMB Location link (Optional)</label>
                    <span className="text-[10px] text-text-secondary font-medium">Optional</span>
                  </div>
                  <input 
                    type="url" 
                    placeholder="https://g.page/r/example..."
                    value={gmbLink}
                    onChange={(e) => setGmbLink(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-bg-primary border border-border-custom focus:border-accent-custom focus:outline-none text-text-primary transition-all placeholder-text-secondary"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-4 py-3.5 rounded-xl bg-accent-custom hover:bg-accent-custom/95 text-white font-bold text-xs transition-all active:scale-[0.98] shadow-md shadow-accent-custom/15 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Save Coordinates & Proceed</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
              </button>
            </form>
          </div>
        )}

        {/* Step 2: AI LOGO GENERATION */}
        {step === 'logo_generation' && (
          <div className="w-full max-w-2xl bg-card-bg border border-border-custom rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] animate-fade-in">
            <div className="flex flex-col items-center gap-2 mb-8 text-center">
              <span className="text-[10px] uppercase tracking-widest text-accent-custom font-extrabold">Step 2 of 3</span>
              <h1 className="text-2xl font-black text-text-primary font-heading">
                AI Logo Generator Desk
              </h1>
              <p className="text-text-secondary text-xs font-medium max-w-md">
                We've generated 4 custom vector monograms for <strong className="text-text-primary">"{businessName}"</strong> based on category: <strong className="text-text-primary">"{category}"</strong>.
              </p>
            </div>

            {/* Logo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              
              {/* Option 1: Blue clean monogram */}
              <button
                onClick={() => setLogoOption('ai_1')}
                className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-4 transition-all duration-300 relative hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${
                  logoOption === 'ai_1' 
                    ? 'border-blue-500 bg-blue-500/5' 
                    : 'border-border-custom hover:border-text-secondary/50 bg-card-bg'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-black shadow-sm">
                  {monogram}
                </div>
                <span className="text-[10px] text-text-secondary font-bold mt-3">Classic Gradient</span>
                {logoOption === 'ai_1' && <span className="absolute top-2 right-2 text-xs">✅</span>}
              </button>

              {/* Option 2: Green Minimal circle */}
              <button
                onClick={() => setLogoOption('ai_2')}
                className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-4 transition-all duration-300 relative hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${
                  logoOption === 'ai_2' 
                    ? 'border-green-500 bg-green-500/5' 
                    : 'border-border-custom hover:border-text-secondary/50 bg-card-bg'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl font-black shadow-sm">
                  {monogram}
                </div>
                <span className="text-[10px] text-text-secondary font-bold mt-3">Emerald Badge</span>
                {logoOption === 'ai_2' && <span className="absolute top-2 right-2 text-xs">✅</span>}
              </button>

              {/* Option 3: Golden retro monogram */}
              <button
                onClick={() => setLogoOption('ai_3')}
                className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-4 transition-all duration-300 relative hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${
                  logoOption === 'ai_3' 
                    ? 'border-yellow-500 bg-yellow-500/5' 
                    : 'border-border-custom hover:border-text-secondary/50 bg-card-bg'
                }`}
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white text-2xl font-black shadow-sm">
                  {monogram}
                </div>
                <span className="text-[10px] text-text-secondary font-bold mt-3">Retro Gold</span>
                {logoOption === 'ai_3' && <span className="absolute top-2 right-2 text-xs">✅</span>}
              </button>

              {/* Option 4: Cyberpunk Red monogram */}
              <button
                onClick={() => setLogoOption('ai_4')}
                className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-4 transition-all duration-300 relative hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${
                  logoOption === 'ai_4' 
                    ? 'border-red-500 bg-red-500/5' 
                    : 'border-border-custom hover:border-text-secondary/50 bg-card-bg'
                }`}
              >
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white text-2xl font-black shadow-sm">
                  {monogram}
                </div>
                <span className="text-[10px] text-text-secondary font-bold mt-3">Cyberpunk Rose</span>
                {logoOption === 'ai_4' && <span className="absolute top-2 right-2 text-xs">✅</span>}
              </button>

            </div>

            {/* Custom Logo Upload fallback */}
            <div className="p-4 bg-bg-primary border border-border-custom rounded-2xl flex flex-col gap-3 mb-8 text-xs font-bold text-text-secondary">
              <div className="flex items-center gap-2">
                <input 
                  type="radio" 
                  id="opt-custom" 
                  name="logo-opt"
                  checked={logoOption === 'custom'}
                  onChange={() => setLogoOption('custom')}
                  className="cursor-pointer"
                />
                <label htmlFor="opt-custom" className="text-text-primary cursor-pointer">Or upload custom business brand logo URL</label>
              </div>
              
              {logoOption === 'custom' && (
                <input 
                  type="url"
                  placeholder="e.g. https://mycompany.com/assets/logo.png"
                  value={customLogoUrl}
                  onChange={(e) => setCustomLogoUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-card-bg border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary font-mono"
                />
              )}
            </div>

            {/* Finalization buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setStep('profile')}
                disabled={isFinalizingLogo}
                className="flex-1 py-3.5 rounded-xl border border-border-custom text-text-primary hover:bg-black/5 font-bold text-xs transition-all cursor-pointer"
              >
                ← Edit Coordinates
              </button>
              
              <button
                onClick={handleFinalizeLogo}
                disabled={isFinalizingLogo || (logoOption === 'custom' && !customLogoUrl)}
                className="flex-[2] py-3.5 rounded-xl bg-accent-custom hover:bg-accent-custom/95 text-white font-bold text-xs transition-all active:scale-[0.98] shadow-md shadow-accent-custom/10 cursor-pointer flex items-center justify-center gap-2"
              >
                {isFinalizingLogo ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Locking Logo Emblem...</span>
                  </>
                ) : (
                  <>
                    <span>Lock Brand Logo & Continue</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: ₹1 UPI TRIAL SUBSCRIPTION */}
        {step === 'trial_payment' && (
          <div className="w-full max-w-md bg-card-bg border border-border-custom rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] animate-fade-in">
            <div className="flex flex-col items-center gap-2 mb-6 text-center">
              <span className="text-[10px] uppercase tracking-widest text-accent-custom font-extrabold">Step 3 of 3</span>
              <h1 className="text-2xl font-black text-text-primary font-heading">
                7-Day Trial Authorization
              </h1>
              <p className="text-text-secondary text-xs font-medium">
                Authorize ₹1.00 mandate to lock features. Cancel anytime in Settings.
              </p>
            </div>

            {/* Mandate instructions warning box */}
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/25 rounded-2xl flex flex-col gap-2.5 mb-6 text-xs text-yellow-800 dark:text-yellow-300">
              <span className="font-bold flex items-center gap-1.5">
                <span>⚠️</span> UPI Auto-Debit Authorization terms
              </span>
              <ul className="list-disc pl-4 flex flex-col gap-1.5 font-medium leading-relaxed">
                <li>You will be charged a one-time refundable ₹1.00 testing deposit.</li>
                <li>Trial completes in exactly 7 days.</li>
                <li>If not cancelled, standard billing of <strong>₹999.00 / month</strong> applies.</li>
              </ul>
            </div>

            {/* Mock QR Scan overlay */}
            <div className="flex flex-col items-center gap-4 bg-bg-primary p-5 rounded-2xl border border-border-custom mb-6">
              <div className="w-32 h-32 bg-white p-2 rounded-xl border border-border-custom relative flex items-center justify-center">
                {/* Simulated QR block */}
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,#111_40%,transparent_45%)] bg-[length:8px_8px] opacity-80" />
                {isProcessingUPI && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                    <span className="w-6 h-6 border-2 border-accent-custom border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">Scan mock mandate barcode</span>
            </div>

            {/* UPI Option selector */}
            <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4 text-xs font-bold text-text-secondary">
              <div className="flex flex-col gap-1.5">
                <label className="text-text-primary">Select Payment App</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setUpiOption('gpay')}
                    className={`py-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      upiOption === 'gpay' ? 'border-blue-500 bg-blue-500/5 text-blue-600' : 'border-border-custom bg-bg-primary hover:bg-black/5'
                    }`}
                  >
                    Google Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiOption('phonepe')}
                    className={`py-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      upiOption === 'phonepe' ? 'border-purple-500 bg-purple-500/5 text-purple-600' : 'border-border-custom bg-bg-primary hover:bg-black/5'
                    }`}
                  >
                    PhonePe
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiOption('paytm')}
                    className={`py-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      upiOption === 'paytm' ? 'border-sky-500 bg-sky-500/5 text-sky-600' : 'border-border-custom bg-bg-primary hover:bg-black/5'
                    }`}
                  >
                    Paytm
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-text-primary">Enter UPI ID (VPA)</label>
                <input 
                  type="text" 
                  required
                  placeholder="username@okaxis..."
                  value={upiNumber}
                  onChange={(e) => setUpiNumber(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-bg-primary border border-border-custom focus:border-accent-custom focus:outline-none text-text-primary font-mono placeholder-text-secondary"
                />
              </div>

              {paymentSuccess ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-center rounded-xl font-bold animate-pulse">
                  ✓ UPI Mandate Approved! Activating dashboard...
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isProcessingUPI}
                  className="w-full mt-2 py-4 rounded-xl bg-accent-custom hover:bg-accent-custom/95 text-white font-bold text-xs transition-all active:scale-[0.98] shadow-md shadow-accent-custom/15 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessingUPI ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Securing UPI Mandate...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹1 & Authorize Auto-Debit</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                    </>
                  )}
                </button>
              )}
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
