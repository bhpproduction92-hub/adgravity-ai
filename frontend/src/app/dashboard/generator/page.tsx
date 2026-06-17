'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Translation Dictionaries for Category-based Vernacular content
const translations: Record<string, Record<string, { slogan: string; copy: string; tags: string }>> = {
  Cafe: {
    en: {
      slogan: 'Fresh Brewed Coffee Daily',
      copy: 'Start your morning with our premium, fresh brewed coffee. Hand-picked beans, roasted to perfection!',
      tags: '#GuwahatiCafe #FreshCoffee #MorningBrew #AdGravity'
    },
    as: {
      slogan: 'প্ৰতিদিনে সতেজকৈ প্ৰস্তুত কৰা কফি',
      copy: 'আমাৰ প্ৰিমিয়াম, সতেজকৈ প্ৰস্তুত কৰা কফিৰে আপোনাৰ ৰাতিপুৱাটো আৰম্ভ কৰক। হাতেৰে নিৰ্বাচিত আৰু নিখুঁতভাৱে ভজা কফি গুটি!',
      tags: '#গুৱাহাটীকফি #সতেজকফি #ৰাতিপুৱাৰকফি #এডগ্ৰেভিটি'
    },
    hi: {
      slogan: 'हर दिन ताज़ा बनी हुई कॉफ़ी',
      copy: 'हमारी प्रीमियम, ताज़ा बनी हुई कॉफ़ी के साथ अपने सुबह की शुरुआत करें। हाथों से चुनी गई और पूरी तरह से भुनी हुई कॉफ़ी बीन्स!',
      tags: '#गुवाहाटीकॉफ़ी #ताज़ाकॉफ़ी #सुबहकीकॉफ़ी #एडग्रेविटी'
    }
  },
  Pharmacy: {
    en: {
      slogan: 'Your Health, Our Priority',
      copy: 'Get authentic medicines and health supplements at your doorstep. Safe, verified, and reliable care.',
      tags: '#Healthcare #AuthenticMedicines #AssamHealth #AdGravity'
    },
    as: {
      slogan: 'আপোনাৰ স্বাস্থ্য, আপোনাৰ যত্ন',
      copy: 'আপোনাৰ দুৱাৰমুখতে লাভ কৰক প্ৰকৃত ঔষধ আৰু স্বাস্থ্য সেৱা সামগ্ৰী। সুৰক্ষিত, প্ৰমাণিত আৰু নিৰ্ভৰযোগ্য যত্ন।',
      tags: '#স্বাস্থ্যসেৱা #প্ৰকৃতঔষধ #অসমস্বাস্থ্য #এডগ্ৰেভিটি'
    },
    hi: {
      slogan: 'आपका स्वास्थ्य, हमारी प्राथमिकता',
      copy: 'अपने घर पर ही असली दवाएं और स्वास्थ्य पूरक प्राप्त करें। सुरक्षित, सत्यापित और विश्वसनीय देखभाल।',
      tags: '#स्वास्थ्यसेवा #असलीदवाएं #असमस्वास्थ्य #एडग्रेविटी'
    }
  },
  SaaS: {
    en: {
      slogan: 'Automate Your Workflow Today',
      copy: 'Empower your operations with next-generation automation tools. Simplify work, scale output effortlessly.',
      tags: '#SaaS #WorkflowAutomation #BusinessGrowth #AdGravity'
    },
    as: {
      slogan: 'আজি আপোনাৰ কাম স্বয়ংক্ৰিয় কৰক',
      copy: 'পৰৱৰ্তী প্ৰজন্মৰ স্বয়ংক্ৰিয় সঁজুলিৰ সৈতে আপোনাৰ ব্যৱসায়িক কাৰ্যক্ষমতা বৃদ্ধি কৰক। কাম সৰল কৰক, উৎপাদন সহজে বৃদ্ধি কৰক।',
      tags: '#ছাচ #স্বয়ংক্ৰিয়কাম #ব্যৱসায়বৃদ্ধি #এডগ্ৰেভিটি'
    },
    hi: {
      slogan: 'आज ही अपने वर्कफ़्लो को स्वचालित करें',
      copy: 'अगली पीढ़ी के स्वचालन उपकरणों के साथ अपने कार्यों को सशक्त बनाएं। काम को सरल बनाएं, उत्पादन को आसानी से बढ़ाएं।',
      tags: '#सास #स्वचालितकार्य #व्यवसायवृद्धि #एडग्रेविटी'
    }
  },
  Retail: {
    en: {
      slogan: 'Exclusive Weekend Discounts',
      copy: 'Shop the best collections in town with exclusive discounts this weekend. Limited stock available!',
      tags: '#RetailShop #WeekendSale #ShopLocal #AdGravity'
    },
    as: {
      slogan: 'বিশেষ সপ্তাহান্তৰ ৰেহাই',
      copy: 'এই সপ্তাহান্তত বিশেষ ৰেহাইৰ সৈতে চহৰৰ শ্ৰেষ্ঠ সংগ্ৰহসমূহৰ পৰা বজাৰ কৰক। সীমিত সামগ্ৰী উপলব্ধ!',
      tags: '#বজাৰকৰক #সপ্তাহান্তৰৰেহাই #স্থানীয়বজাৰ #এডগ্ৰেভিটি'
    },
    hi: {
      slogan: 'विशेष सप्ताहांत छूट',
      copy: 'इस सप्ताहांत विशेष छूट के साथ शहर के सबसे बेहतरीन संग्रहों से खरीदारी करें। सीमित स्टॉक उपलब्ध!',
      tags: '#रिटेलशॉप #सप्ताहांतछूट #स्थानीयखरीदारी #एडग्रेविटी'
    }
  }
};

const gradientThemes = [
  { name: 'Cyberpunk Neon', class: 'from-purple-900 via-[#0e1014] to-pink-900', textClass: 'text-pink-300' },
  { name: 'Royal Gold', class: 'from-amber-950 via-[#0a0c10] to-[#07090e]', textClass: 'text-amber-400' },
  { name: 'Ocean Wave', class: 'from-sky-900 via-[#06080e] to-teal-900', textClass: 'text-teal-300' },
  { name: 'Mint Fresh', class: 'from-emerald-900 via-[#080a0e] to-indigo-950', textClass: 'text-emerald-300' }
];

function GeneratorContent() {
  const router = useRouter();

  // Profile Step-locking state
  const [profile, setProfile] = useState<any>(null);
  const [finalizedLogo, setFinalizedLogo] = useState<string | null>(null);

  // Editor States
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16' | '16:9'>('1:1');
  const [language, setLanguage] = useState<'en' | 'as' | 'hi'>('en');
  const [slogan, setSlogan] = useState('');
  const [copywriterText, setCopywriterText] = useState('');
  const [tagsText, setTagsText] = useState('');
  
  // Theme Background cycling state
  const [themeIndex, setThemeIndex] = useState(0);

  // Copy success indicator
  const [copySuccess, setCopySuccess] = useState(false);

  // Step-locking: Load profile, redirect to onboarding if missing
  useEffect(() => {
    const savedProfile = localStorage.getItem('adgravity_profile');
    if (!savedProfile) {
      router.replace('/dashboard/onboarding');
    } else {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      
      // Load savedized logo
      const savedLogo = localStorage.getItem('adgravity_logo');
      if (savedLogo) {
        setFinalizedLogo(savedLogo);
      }

      // Initialize default slogan and copy text based on category
      const categoryKey = parsed.category || 'Cafe';
      const defaults = translations[categoryKey]?.['en'] || translations['Cafe']['en'];
      setSlogan(defaults.slogan);
      setCopywriterText(defaults.copy);
      setTagsText(defaults.tags);
    }
  }, [router]);

  // Translate content when language changes
  useEffect(() => {
    if (!profile) return;
    const categoryKey = profile.category || 'Cafe';
    const localized = translations[categoryKey]?.[language] || translations['Cafe'][language];
    setSlogan(localized.slogan);
    setCopywriterText(localized.copy);
    setTagsText(localized.tags);
  }, [language, profile]);

  // Cycle alternative background themes
  const handleRegenerateTheme = () => {
    setThemeIndex((prev) => (prev + 1) % gradientThemes.length);
  };

  const handleCopyText = () => {
    const textToCopy = `${copywriterText}\n\n${tagsText}`;
    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Manual Deep-linking shares
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${slogan}\n\n${copywriterText}\n\n${tagsText}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    // Facebook sharing on desktop requires URL target
    const mockSharedUrl = encodeURIComponent('https://ai.bhpproduction.com');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${mockSharedUrl}`, '_blank');
  };

  const handleShareInstagram = () => {
    // Copy tags and launch Instagram
    handleCopyText();
    window.open('https://www.instagram.com', '_blank');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#07090e] text-gray-150 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-xs text-gray-500 font-sans">Verifying editor security...</span>
        </div>
      </div>
    );
  }

  const activeTheme = gradientThemes[themeIndex];
  const initials = profile.businessName ? profile.businessName.split(' ').map((w: any) => w[0]).join('').substring(0, 2).toUpperCase() : 'AG';

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
              AdGravity<span className="text-indigo-400">.AI</span> Editor
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

      {/* Main Workspace Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 5 Cols: Editor Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-white">Ad Generator Tools</h3>
              <p className="text-gray-400 text-xs mt-1">
                Customize dimensions, copy content, and local languages.
              </p>
            </div>

            {/* Step 1: Aspect Ratio Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-400">1. Aspect Ratio Dimensions</span>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setAspectRatio('1:1')}
                  className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    aspectRatio === '1:1' ? 'bg-indigo-600/10 border-indigo-500 text-white font-semibold' : 'bg-white/[0.01] border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm">⏹️</span>
                  <span className="text-[10px]">Square (1:1)</span>
                </button>
                <button
                  onClick={() => setAspectRatio('9:16')}
                  className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    aspectRatio === '9:16' ? 'bg-indigo-600/10 border-indigo-500 text-white font-semibold' : 'bg-white/[0.01] border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm">📱</span>
                  <span className="text-[10px]">Vertical (9:16)</span>
                </button>
                <button
                  onClick={() => setAspectRatio('16:9')}
                  className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    aspectRatio === '16:9' ? 'bg-indigo-600/10 border-indigo-500 text-white font-semibold' : 'bg-white/[0.01] border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm">📺</span>
                  <span className="text-[10px]">Landscape (16:9)</span>
                </button>
              </div>
            </div>

            {/* Step 2: Language Vernacular Toggle */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-400">2. Regional Vernacular Locale</span>
              <div className="grid grid-cols-3 gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setLanguage('en')}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all ${language === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('as')}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all ${language === 'as' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                  Assamese
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all ${language === 'hi' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                  Hindi
                </button>
              </div>
            </div>

            {/* Step 3: Slogan Editor & 80-char Constraint */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-400">3. Canvas Slogan Text</span>
                <span className={`font-mono text-[10px] ${slogan.length >= 70 ? 'text-red-400' : slogan.length >= 50 ? 'text-yellow-400' : 'text-gray-500'}`}>
                  {slogan.length} / 80 Chars Max
                </span>
              </div>
              <input
                type="text"
                maxLength={80}
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="Enter canvas slogan..."
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-xs transition-all font-sans"
              />
            </div>

            {/* Step 4: Alternative AI Themes */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-400">4. AI Aesthetic Themes</span>
              <button
                onClick={handleRegenerateTheme}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                🔄 Cycle Design Style ({activeTheme.name})
              </button>
            </div>
          </div>

          {/* Copywriting Preview & Copy Panel */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Copywriter Copy & Tags</h4>
              <button 
                onClick={handleCopyText}
                className="text-[10px] font-bold text-gray-400 hover:text-white flex items-center gap-1"
              >
                📋 {copySuccess ? 'Copied!' : 'Copy All'}
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
              <div>
                <span className="text-[10px] text-gray-500 font-semibold uppercase block mb-1">Body Text</span>
                <p className="text-gray-300 leading-relaxed font-sans">{copywriterText}</p>
              </div>
              <div className="border-t border-white/5 pt-2">
                <span className="text-[10px] text-gray-500 font-semibold uppercase block mb-1">Hashtags</span>
                <p className="text-gray-400 font-mono">{tagsText}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Canvas Mockup & Share Triggers */}
        <div className="lg:col-span-7 flex flex-col gap-8 items-center w-full">
          
          {/* Dynamic Graphic Canvas container */}
          <div className="w-full bg-black/60 rounded-3xl border border-white/10 p-8 flex items-center justify-center shadow-2xl min-h-[420px]">
            {/* The responsive ratio box */}
            <div 
              className={`rounded-2xl bg-gradient-to-tr ${activeTheme.class} border border-white/15 p-6 flex flex-col justify-between transition-all duration-700 relative shadow-lg shadow-indigo-500/5 ${
                aspectRatio === '1:1' ? 'w-64 h-64' :
                aspectRatio === '9:16' ? 'w-48 h-80' :
                'w-80 h-48'
              }`}
            >
              {/* Corner Logo */}
              <div className="flex justify-between items-center w-full">
                {finalizedLogo ? (
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                    {finalizedLogo.startsWith('AI_LOGO_') ? (
                      <span className="text-white text-[9px] font-black">{initials}</span>
                    ) : (
                      <img src={finalizedLogo} alt="brand logo" className="w-full h-full object-cover rounded-lg" />
                    )}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-[10px]">{initials}</div>
                )}
                <span className="text-[7px] text-gray-500 uppercase tracking-widest font-mono">AdGravity.AI</span>
              </div>

              {/* Slogan Text Canvas Overlay */}
              <div className="my-auto py-2 text-center">
                <h2 className={`font-heading font-black tracking-tight text-white leading-tight ${
                  aspectRatio === '9:16' ? 'text-sm' :
                  aspectRatio === '1:1' ? 'text-base' :
                  'text-lg'
                }`}>
                  {slogan || 'Your Ad Copy Here'}
                </h2>
              </div>

              {/* Sub-label */}
              <div className="flex justify-between items-center text-[7px] text-gray-400 font-medium border-t border-white/5 pt-2">
                <span>{profile.businessName}</span>
                <span className="uppercase">{profile.category}</span>
              </div>
            </div>
          </div>

          {/* Approve & Manual Deep-link Sharing Engine */}
          <div className="w-full rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
            <div>
              <h3 className="text-base font-bold text-white">Approve & Share Module</h3>
              <p className="text-gray-450 text-xs mt-1">
                Bypass auto-publishing and trigger native device apps with pre-loaded assets.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* WhatsApp */}
              <button
                onClick={handleShareWhatsApp}
                className="py-3 px-4 rounded-xl bg-[#25d366]/10 hover:bg-[#25d366]/20 border border-[#25d366]/20 text-[#25d366] font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span className="text-base">💬</span>
                WhatsApp Business
              </button>
              
              {/* Facebook */}
              <button
                onClick={handleShareFacebook}
                className="py-3 px-4 rounded-xl bg-[#1877f2]/10 hover:bg-[#1877f2]/20 border border-[#1877f2]/20 text-[#1877f2] font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span className="text-base">👥</span>
                Share to Facebook
              </button>

              {/* Instagram */}
              <button
                onClick={handleShareInstagram}
                className="py-3 px-4 rounded-xl bg-[#c13584]/10 hover:bg-[#c13584]/20 border border-[#c13584]/20 text-[#c13584] font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span className="text-base">📸</span>
                Copy & Open Instagram
              </button>
            </div>
            
            <div className="text-[10px] text-gray-500 font-sans leading-relaxed border-t border-white/5 pt-4 text-center">
              ⚠️ <strong>Note:</strong> Clicking Instagram/Facebook triggers copies your copywriting to your clipboard automatically. You can paste it directly when the native app opens.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07090e] text-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-xs text-gray-505">Loading Ad Editor...</span>
        </div>
      </div>
    }>
      <GeneratorContent />
    </Suspense>
  );
}
