'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Pre-fill business name from landing page onboarding input if present
  const businessNameQuery = searchParams.get('businessName') || '';

  // Form states
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState(businessNameQuery || '');
  const [category, setCategory] = useState('Cafe');
  const [metaPageToken, setMetaPageToken] = useState('EAAbwY7b43...mocktoken');
  
  // Credit state
  const [credits, setCredits] = useState(1);
  const [maxCredits, setMaxCredits] = useState(1);

  // Loading & status states
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'success'>('idle');
  const [paymentMessage, setPaymentMessage] = useState('');

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
          // If trial/active, set credits higher or unlimited
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
    if (userId) {
      fetchStatus();
    }
  }, [userId]);

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

  const handleRegisterTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    setPaymentStep('processing');

    try {
      // Simulate 3-second secure payment gateway connection
      setPaymentMessage('Connecting to secure payment gateway...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPaymentMessage('Processing ₹1 transaction via sandbox...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPaymentMessage('Authorizing 7-day trial subscription details...');
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
            email,
            fullName,
            category,
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
      fetchStatus();
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend server. Make sure it is running on Render.');
      setPaymentStep('idle');
    } finally {
      setLoading(false);
    }
  };

  // Mock Calendar Posts Data
  const calendarPosts = [
    { day: 12, name: 'Assam Medicose Ad', status: 'published', type: 'Vernacular' },
    { day: 16, name: 'Cafe Guwahati Intro', status: 'published', type: 'Bilingual' },
    { day: 17, name: 'Special Weekend Discount', status: 'pending', type: 'Reel' },
    { day: 24, name: 'Monsoon Mega Sale', status: 'scheduled', type: 'Image' }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-12">
      {/* Top Navbar */}
      <header className="w-full bg-[#0c0f18]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center">
              <span className="text-base font-bold text-white">A</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white font-heading">
              AdGravity<span className="text-indigo-400">.AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {response?.subscription ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Trial
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                ⚠️ Unsubscribed
              </span>
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
        
        {/* Left 4 Cols: Subscription Status & Credits tracker */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Credit Tracker Card */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">Visual Credit Tracker</h3>
              <span className="text-xs text-indigo-400 font-bold">Daily Reset</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-5xl font-black text-white">{credits}</span>
              <span className="text-lg text-gray-500 font-medium">/ {maxCredits}</span>
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500" 
                  style={{ width: `${(credits / maxCredits) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 mt-1">
                {credits > 0 ? 'Use your credit to generate bilingual ad copies below.' : 'Credits depleted. Start a ₹1 trial to get more credits!'}
              </span>
            </div>
          </div>

          {/* Trial Form Card */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-white">Setup 7-Day Trial</h3>
              <p className="text-gray-400 text-xs mt-1">
                Create user profile and unlock ₹1 trial access.
              </p>
            </div>

            <form onSubmit={handleRegisterTrial} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400">User ID (Simulated Auth)</label>
                <input 
                  type="text" 
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400">Company Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Green Cafe Guwahati"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400">Business Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-[#0c0f18] border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm transition-all"
                >
                  <option value="Cafe">Cafe / Restaurant</option>
                  <option value="Pharmacy">Pharmacy / Health</option>
                  <option value="SaaS">SaaS Platform</option>
                  <option value="Retail">Retail Store</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-400 font-sans">Meta Page Token</label>
                  <button 
                    type="button" 
                    onClick={() => setIsOAuthOpen(true)}
                    className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300"
                  >
                    Connect Facebook
                  </button>
                </div>
                <input 
                  type="text" 
                  required
                  value={metaPageToken}
                  onChange={(e) => setMetaPageToken(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm transition-all"
                />
              </div>

              <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 flex flex-col gap-2 mt-2 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>7-Day Trial Price</span>
                  <strong className="text-white">₹1.00</strong>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Billing Currency</span>
                  <span>INR (₹)</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-indigo-650 disabled:to-violet-650 text-white font-semibold text-sm transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2"
              >
                {loading ? 'Processing ₹1 payment...' : 'Activate Trial for ₹1'}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-2xl leading-relaxed">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Success Message */}
            {response && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-2xl flex flex-col gap-2">
                <h4 className="font-bold text-sm">🎉 Subscription Registered!</h4>
                <div className="flex flex-col gap-1 opacity-90 mt-1">
                  <div><strong>ID:</strong> {response.subscription.id.slice(0, 12)}...</div>
                  <div><strong>Plan:</strong> {response.subscription.plan_type}</div>
                  <div><strong>Status:</strong> {response.subscription.status}</div>
                  <div><strong>End:</strong> {new Date(response.subscription.trial_end_date).toLocaleDateString()}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 8 Cols: AI Generator & Queue & Calendar Grid */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* AI Content Engine */}
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
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm transition-all resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={generatingContent}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 text-white font-semibold text-sm transition-all active:scale-[0.98] shadow-md shadow-indigo-500/10"
              >
                {generatingContent ? 'Generating captions via Gemini...' : 'Generate Bilingual Ad Copy'}
              </button>
            </form>

            {/* Generation Output Success */}
            {generationSuccess && (
              <div className="p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex flex-col gap-4">
                <h4 className="text-sm font-bold text-indigo-300">✨ Generated Localized Captions:</h4>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold">English Caption</span>
                    <p className="text-sm leading-relaxed text-gray-200">{generationSuccess.caption_en}</p>
                  </div>
                  <div className="border-t border-white/5 pt-3 flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-violet-400 font-bold">Assamese Transcreation</span>
                    <p className="text-sm leading-relaxed text-gray-200">{generationSuccess.caption_as}</p>
                  </div>
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
                Track your active, pending, and scheduled social campaigns.
              </p>
            </div>

            {/* Calendar Layout */}
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
                {/* Weekday headers */}
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                  <div key={day} className="text-gray-500 font-bold py-1">{day}</div>
                ))}
                
                {/* Days 1 to 30 with dummy offsets */}
                {Array.from({ length: 30 }).map((_, index) => {
                  const day = index + 1;
                  const activePost = calendarPosts.find((p) => p.day === day);
                  
                  return (
                    <div 
                      key={day} 
                      className={`aspect-square rounded-lg flex flex-col items-center justify-between p-1.5 relative border ${
                        activePost?.status === 'published' ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' :
                        activePost?.status === 'pending' ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' :
                        activePost?.status === 'scheduled' ? 'bg-indigo-950/20 border-indigo-500/30 text-indigo-300' :
                        'bg-white/[0.01] border-white/5 text-gray-500 hover:bg-white/5'
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
                        <span className="text-gray-500 font-semibold">Prompt</span>
                        <p className="text-gray-300 italic">"{item.prompt}"</p>
                      </div>

                      <div className="flex flex-col gap-3 mt-1">
                        {(() => {
                          const parsed = parseContent(item.ai_content);
                          return (
                            <>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold">English Caption</span>
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
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[1000]">
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
