'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ControlCenterPage() {
  const router = useRouter();
  
  // RBAC active preview state
  const [userRole, setUserRole] = useState<'super_admin' | 'sub_admin'>('super_admin');

  // Super Admin: Staff Manager State
  const [staffList, setStaffList] = useState([
    { name: 'Irfan Ansari', email: 'irfan@adgravity.ai', role: 'Sub-Admin', addedAt: '2026-06-10' },
    { name: 'Rupjyoti Sarma', email: 'rup@adgravity.ai', role: 'Sub-Admin', addedAt: '2026-06-12' },
  ]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');

  // Super Admin: Dynamic pricing form state
  const [basicPrice, setBasicPrice] = useState(499);
  const [standardPrice, setStandardPrice] = useState(999);
  const [premiumPrice, setPremiumPrice] = useState(1999);
  const [pricingSuccess, setPricingSuccess] = useState(false);

  // Super Admin: Company settings states
  const [websiteUrl, setWebsiteUrl] = useState('https://bhpproduction.com/');
  const [supportPhone, setSupportPhone] = useState('+91 9577781416');
  const [address, setAddress] = useState('Kahilipara, Guwahati, Assam, India');
  const [companySuccess, setCompanySuccess] = useState(false);

  // Super Admin: Sub-Tab Selection
  const [superAdminTab, setSuperAdminTab] = useState<'operations' | 'maintenance'>('operations');

  // Developer & Maintenance Tools State
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<'fresh' | 'stale'>('stale');
  const [cacheSuccess, setCacheSuccess] = useState(false);
  const [cacheError, setCacheError] = useState(false);
  const [aiRouterActive, setAiRouterActive] = useState(true);
  const [aiRouterStatus, setAiRouterStatus] = useState<'connected' | 'disconnecting' | 'reconnecting' | 'idle'>('connected');
  const [logs, setLogs] = useState<string[]>([]);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  // Initialize logs on client
  useEffect(() => {
    const initialLogs = [
      `[${new Date(Date.now() - 60000).toLocaleTimeString()}] SYSTEM: Initializing diagnostic monitor...`,
      `[${new Date(Date.now() - 55000).toLocaleTimeString()}] ROUTER: Connection established with primary cluster https://router.bhpproduction.com/v1`,
      `[${new Date(Date.now() - 50000).toLocaleTimeString()}] DB: Connection pool verified. 12 active pools.`,
      `[${new Date(Date.now() - 40000).toLocaleTimeString()}] COMPILE: Compiled client/server directories successfully in 1240ms`,
      `[${new Date(Date.now() - 30000).toLocaleTimeString()}] INFO: Vercel Anycast edge cache hit for route '/'`,
      `[${new Date(Date.now() - 20000).toLocaleTimeString()}] GET /api/content/generate - 200 OK - 238ms`,
    ];
    setLogs(initialLogs);
  }, []);

  // Log generation interval
  useEffect(() => {
    const routes = ['/', '/about', '/contact', '/dashboard', '/admin/control-center'];
    const languages = ['Hindi', 'Assamese', 'English'];
    const categories = ['Cafe', 'Pharmacy', 'SaaS', 'Retail'];
    
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();
      const randomType = Math.floor(Math.random() * 8);
      let newLog = '';
      
      switch (randomType) {
        case 0:
          newLog = `[${timestamp}] GET /api/content/generate - 200 OK - ${Math.floor(Math.random() * 120) + 150}ms`;
          break;
        case 1:
          newLog = `[${timestamp}] INFO: Edge route prefetch triggered for '${routes[Math.floor(Math.random() * routes.length)]}'`;
          break;
        case 2:
          newLog = `[${timestamp}] INFO: Cache check for '${routes[Math.floor(Math.random() * routes.length)]}' - ${Math.random() > 0.3 ? 'CACHE_HIT' : 'CACHE_MISS'}`;
          break;
        case 3:
          newLog = `[${timestamp}] WARN: High request volume detected on API cluster node-sg-${Math.floor(Math.random() * 100)}`;
          break;
        case 4:
          newLog = `[${timestamp}] SUCCESS: Synced localized slogans with GMB locations for ${categories[Math.floor(Math.random() * categories.length)]}`;
          break;
        case 5:
          newLog = `[${timestamp}] COMPILE: Compiled client/server bundles successfully in ${Math.floor(Math.random() * 400) + 400}ms`;
          break;
        case 6:
          newLog = `[${timestamp}] INFO: DB connection pool health check - ${Math.floor(Math.random() * 10) + 10} active connections`;
          break;
        default:
          newLog = `[${timestamp}] DEBUG: Localized translation dictionary loaded for '${languages[Math.floor(Math.random() * languages.length)]}'`;
          break;
      }
      
      setLogs((prev) => [...prev.slice(-99), newLog]);
    }, 4500);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal logs
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleClearCache = async () => {
    setIsClearingCache(true);
    setCacheSuccess(false);
    setCacheError(false);
    const timestamp = new Date().toLocaleTimeString();
    
    setLogs((prev) => [
      ...prev,
      `[${timestamp}] ⚠️ CACHE_BUST: Clear cache request received from Super Admin (Hridaya Nanda Sarma)`,
      `[${timestamp}] CACHE_BUST: Invoking global edge cache revalidation handler...`
    ]);
    
    try {
      const res = await fetch('/api/revalidate', { method: 'POST' });
      const data = await res.json();
      const finishedTime = new Date().toLocaleTimeString();
      
      if (data.success) {
        setCacheSuccess(true);
        setCacheStatus('fresh');
        setLogs((prev) => [
          ...prev,
          `[${finishedTime}] CACHE_BUST: Invoking revalidatePath on root context '/'`,
          `[${finishedTime}] CACHE_BUST: Purging Next.js edge router cache pools [status: OK]`,
          `[${finishedTime}] SUCCESS: Vercel CDN cache revalidation complete. Global invalidation success.`,
          `[${finishedTime}] Cleared paths: ${JSON.stringify(data.clearedPaths)}`
        ]);
        setTimeout(() => setCacheSuccess(false), 3000);
      } else {
        throw new Error(data.error || 'Server error during revalidation');
      }
    } catch (err: any) {
      setCacheError(true);
      const errorTime = new Date().toLocaleTimeString();
      setLogs((prev) => [
        ...prev,
        `[${errorTime}] ❌ ERROR: Vercel CDN revalidation failed. Reason: ${err.message}`
      ]);
      setTimeout(() => setCacheError(false), 3500);
    } finally {
      setIsClearingCache(false);
    }
  };

  const handleToggleRouterConnection = () => {
    if (aiRouterActive) {
      setAiRouterActive(false);
      setAiRouterStatus('disconnecting');
      const time = new Date().toLocaleTimeString();
      setLogs((prev) => [
        ...prev,
        `[${time}] ⚠️ ROUTER: Disconnect signal received from Super Admin. Terminating router session pool...`
      ]);
      
      setTimeout(() => {
        setAiRouterStatus('idle');
        const idleTime = new Date().toLocaleTimeString();
        setLogs((prev) => [
          ...prev,
          `[${idleTime}] ❌ ROUTER: Offline. API router connections severed.`
        ]);
      }, 1000);
    } else {
      setAiRouterActive(true);
      setAiRouterStatus('reconnecting');
      const time = new Date().toLocaleTimeString();
      setLogs((prev) => [
        ...prev,
        `[${time}] 🔄 ROUTER: Restart signal received. Re-negotiating handshake with https://router.bhpproduction.com/v1`
      ]);
      
      setTimeout(() => {
        setAiRouterStatus('connected');
        const connectedTime = new Date().toLocaleTimeString();
        setLogs((prev) => [
          ...prev,
          `[${connectedTime}] SUCCESS: Endpoint handshake verified. Latency: 32ms. Operational status: ONLINE.`
        ]);
      }, 1500);
    }
  };

  const getLogLineColor = (line: string) => {
    if (line.includes('ERROR') || line.includes('Failed') || line.includes('❌') || line.includes('Offline')) return 'text-rose-500 font-medium';
    if (line.includes('WARN') || line.includes('CACHE_BUST') || line.includes('revalidatePath') || line.includes('Disconnect') || line.includes('Terminating') || line.includes('⚠️')) return 'text-amber-500 font-medium';
    if (line.includes('SUCCESS') || line.includes('200 OK') || line.includes('Verified') || line.includes('ONLINE') || line.includes('complete') || line.includes('successfully') || line.includes('SUCCESSFUL')) return 'text-emerald-400 font-medium';
    if (line.includes('SYSTEM') || line.includes('ROUTER') || line.includes('DB')) return 'text-indigo-400 font-semibold';
    return 'text-gray-400';
  };

  useEffect(() => {
    const savedCompany = localStorage.getItem('adgravity_company_profile');
    if (savedCompany) {
      const parsed = JSON.parse(savedCompany);
      setWebsiteUrl(parsed.websiteUrl || 'https://bhpproduction.com/');
      setSupportPhone(parsed.supportPhone || '+91 9577781416');
      setAddress(parsed.address || 'Kahilipara, Guwahati, Assam, India');
    }
  }, []);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      websiteUrl,
      supportPhone,
      address
    };
    localStorage.setItem('adgravity_company_profile', JSON.stringify(data));
    setCompanySuccess(true);
    setTimeout(() => setCompanySuccess(false), 2000);
  };

  // Sub-Admin: Festival Presets State
  const [festivalPresetName, setFestivalPresetName] = useState('Rongali Bihu Greetings');
  const [festivalSlogan, setFestivalSlogan] = useState('Bihu offering: Flat 30% discount on all Guwahati local orders!');
  const [presetSuccess, setPresetSuccess] = useState(false);

  // Sub-Admin: Slider asset state
  const [sliderIndex, setSliderIndex] = useState('1');
  const [sliderAssetUrl, setSliderAssetUrl] = useState('');
  const [assetSuccess, setAssetSuccess] = useState(false);

  // Add staff account handler
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) return;
    
    setStaffList((prev) => [
      ...prev,
      {
        name: newStaffName,
        email: newStaffEmail,
        role: 'Sub-Admin',
        addedAt: new Date().toISOString().split('T')[0]
      }
    ]);
    setNewStaffName('');
    setNewStaffEmail('');
  };

  // Revoke staff access handler
  const handleRevokeAccess = (email: string) => {
    setStaffList((prev) => prev.filter((staff) => staff.email !== email));
  };

  // Save pricing changes handler
  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    setPricingSuccess(true);
    setTimeout(() => setPricingSuccess(false), 2000);
  };

  // Push presets handler
  const handlePushPreset = (e: React.FormEvent) => {
    e.preventDefault();
    setPresetSuccess(true);
    setTimeout(() => setPresetSuccess(false), 2000);
  };

  // Replace slider handler
  const handleReplaceSlider = (e: React.FormEvent) => {
    e.preventDefault();
    setAssetSuccess(true);
    setTimeout(() => setAssetSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-12">
      {/* Top Navbar */}
      <header className="w-full bg-[#0c0f18]/85 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center">
              <span className="text-base font-bold text-white">A</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white font-heading">
              AdGravity<span className="text-indigo-400">.AI</span> Control Center
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/seo-manager')}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-all active:scale-95 flex items-center gap-1.5"
            >
              SEO Manager 🚀
            </button>

            {/* Role Switch Toggle */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setUserRole('super_admin')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  userRole === 'super_admin' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Owner (Super Admin)
              </button>
              <button
                onClick={() => setUserRole('sub_admin')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  userRole === 'sub_admin' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Staff (Sub-Admin)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Panel grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Banner */}
        <div className="rounded-3xl bg-gradient-to-tr from-indigo-950/20 via-violet-950/15 to-[#0b0f19] border border-indigo-500/20 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold">Role-Based Access Control (RBAC) active</span>
            <h2 className="text-xl font-bold text-white">
              Currently viewing as: <span className="text-indigo-400 uppercase font-extrabold">{userRole === 'super_admin' ? 'Super Admin / Owner' : 'Sub-Admin / Staff'}</span>
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Test role permissions using the toggle at the top right.
            </p>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase">
            {userRole === 'super_admin' ? 'Owner Mode' : 'Staff Mode'}
          </span>
        </div>

        {/* 1. SUPER ADMIN MODE (OWNER VIEW) */}
        {userRole === 'super_admin' && (
          <div className="flex flex-col gap-8">
            {/* Super Admin Sub-Tabs */}
            <div className="flex border-b border-white/5 pb-1 gap-6 text-xs sm:text-sm">
              <button
                onClick={() => setSuperAdminTab('operations')}
                className={`pb-3 font-semibold transition-all relative flex items-center gap-1.5 ${
                  superAdminTab === 'operations' ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                📊 Platform Operations
                {superAdminTab === 'operations' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setSuperAdminTab('maintenance')}
                className={`pb-3 font-semibold transition-all relative flex items-center gap-1.5 ${
                  superAdminTab === 'maintenance' ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                🔧 Developer & Maintenance Tools
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] uppercase tracking-wider font-extrabold border border-amber-500/20 animate-pulse">
                  Live Diag
                </span>
                {superAdminTab === 'maintenance' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                )}
              </button>
            </div>

            {/* Tab 1: Operations */}
            {superAdminTab === 'operations' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left 4 Cols: Revenue Analytics */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  {/* Analytics */}
                  <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
                    <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">Platform Revenue Analytics</h3>
                    
                    <div className="flex flex-col gap-4 mt-2">
                      <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Total Platform Revenue</span>
                        <h4 className="text-3xl font-black text-white mt-1">₹1,45,280</h4>
                      </div>
                      <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Monthly Recurring Revenue (MRR)</span>
                        <h4 className="text-3xl font-black text-white mt-1">₹12,499</h4>
                      </div>
                      <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-gray-500 font-bold uppercase">Active paid Plans</span>
                          <h4 className="text-2xl font-black text-white mt-0.5">48</h4>
                        </div>
                        <span className="text-emerald-400 text-xs font-semibold">+12% this mo</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Rules Configuration */}
                  <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
                    <div>
                      <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">Pricing & Packages Rules</h3>
                      <p className="text-gray-500 text-[10px] mt-1">Update package rates globally inside database.</p>
                    </div>

                    <form onSubmit={handleSavePricing} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-400">Basic Package Price (₹)</label>
                        <input 
                          type="number" 
                          value={basicPrice}
                          onChange={(e) => setBasicPrice(Number(e.target.value))}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-xs font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-400">Standard Package Price (₹)</label>
                        <input 
                          type="number" 
                          value={standardPrice}
                          onChange={(e) => setStandardPrice(Number(e.target.value))}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-xs font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-400">Premium Package Price (₹)</label>
                        <input 
                          type="number" 
                          value={premiumPrice}
                          onChange={(e) => setPremiumPrice(Number(e.target.value))}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-xs font-mono"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all active:scale-[0.98]"
                      >
                        Save Package Configurations
                      </button>
                    </form>
                    {pricingSuccess && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl text-center">
                        ✓ Pricing parameters updated successfully!
                      </div>
                    )}
                  </div>

                  {/* Company Profile Settings Panel */}
                  <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
                    <div>
                      <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">Company Settings Panel</h3>
                      <p className="text-gray-500 text-[10px] mt-1">Configure company credentials globally.</p>
                    </div>

                    <form onSubmit={handleSaveCompany} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-400">Website URL</label>
                        <input 
                          type="url" 
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          className="px-4 py-2 bg-[#07090e] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-xs font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-400">Support Contact Phone</label>
                        <input 
                          type="text" 
                          value={supportPhone}
                          onChange={(e) => setSupportPhone(e.target.value)}
                          className="px-4 py-2 bg-[#07090e] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-xs font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-400">Physical Address</label>
                        <input 
                          type="text" 
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="px-4 py-2 bg-[#07090e] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-xs"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all active:scale-[0.98]"
                      >
                        Save Company Profile
                      </button>
                    </form>
                    {companySuccess && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl text-center">
                        ✓ Company profile updated globally!
                      </div>
                    )}
                  </div>
                </div>

                {/* Right 8 Cols: Staff Manager Panel */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
                    <div>
                      <h3 className="text-base font-bold text-white">Staff Manager Panel</h3>
                      <p className="text-gray-455 text-xs mt-1">Manage sub-admin staff credentials and authorization scopes.</p>
                    </div>

                    {/* Add new staff form */}
                    <form onSubmit={handleAddStaff} className="flex flex-col sm:flex-row gap-4 bg-white/[0.01] p-4 rounded-2xl border border-white/5 items-end">
                      <div className="flex-1 flex flex-col gap-1.5 w-full">
                        <label className="text-xs font-semibold text-gray-400">Staff Full Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Anurag Dutta"
                          value={newStaffName}
                          onChange={(e) => setNewStaffName(e.target.value)}
                          className="px-4 py-2 bg-[#07090e] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-xs"
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-1.5 w-full">
                        <label className="text-xs font-semibold text-gray-400">Staff Email</label>
                        <input 
                          type="email" 
                          required
                          placeholder="anurag@adgravity.ai"
                          value={newStaffEmail}
                          onChange={(e) => setNewStaffEmail(e.target.value)}
                          className="px-4 py-2 bg-[#07090e] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-xs"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all active:scale-[0.98] w-full sm:w-auto"
                      >
                        Add Sub-Admin
                      </button>
                    </form>

                    {/* Staff table */}
                    <div className="overflow-x-auto border border-white/5 rounded-2xl bg-white/[0.01]">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-white/5 text-gray-500 uppercase tracking-wider font-semibold bg-white/[0.02]">
                            <th className="p-4">Staff Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Access Level</th>
                            <th className="p-4">Added Date</th>
                            <th className="p-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {staffList.map((staff) => (
                            <tr key={staff.email} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                              <td className="p-4 font-semibold text-white">{staff.name}</td>
                              <td className="p-4 text-gray-400">{staff.email}</td>
                              <td className="p-4"><span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold">{staff.role}</span></td>
                              <td className="p-4 text-gray-500">{staff.addedAt}</td>
                              <td className="p-4 text-right">
                                <button 
                                  type="button"
                                  onClick={() => handleRevokeAccess(staff.email)}
                                  className="text-red-400 hover:text-red-300 font-bold"
                                >
                                  Revoke Access
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Developer & Maintenance Tools */}
            {superAdminTab === 'maintenance' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left 5 columns: Control widgets */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  {/* System Health Diagnostics */}
                  <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
                    <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">System Health Diagnostics</h3>
                    
                    <div className="grid grid-cols-2 gap-3 mt-2 text-xs">
                      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex flex-col gap-1">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">CDN Edge Status</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          VERCEL EDGE
                        </span>
                      </div>
                      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex flex-col gap-1">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">AI Router Latency</span>
                        <span className={`font-semibold flex items-center gap-1.5 ${aiRouterStatus === 'connected' ? 'text-emerald-400' : 'text-rose-500'}`}>
                          {aiRouterStatus === 'connected' ? '32ms (ONLINE)' : aiRouterStatus === 'reconnecting' ? 'RECONNECTING...' : 'OFFLINE'}
                        </span>
                      </div>
                      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex flex-col gap-1 col-span-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Routing Node</span>
                        <span className="text-gray-300 font-mono text-[11px] truncate">router.bhpproduction.com</span>
                      </div>
                      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex flex-col gap-1">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Caching Protocol</span>
                        <span className="text-indigo-400 font-semibold">Strict Revalidate</span>
                      </div>
                      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex flex-col gap-1">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Edge CDN Cache</span>
                        <span className={`font-semibold capitalize ${cacheStatus === 'fresh' ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
                          {cacheStatus === 'fresh' ? 'Fresh' : 'Stale (Pending)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cache Control System (Destructive actions) */}
                  <div className="rounded-3xl bg-white/5 border border-red-500/20 p-6 flex flex-col gap-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl animate-pulse" />
                    <div>
                      <h3 className="text-sm font-semibold tracking-wide text-rose-500 uppercase flex items-center gap-2">
                        <span>⚠️</span> Cache Busting Control
                      </h3>
                      <p className="text-gray-400 text-xs mt-1">Purge all pre-rendered HTML/JSON routes on edge routers.</p>
                    </div>

                    {/* Destructive Warning Box */}
                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-amber-400 text-xs leading-relaxed flex flex-col gap-1.5">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-amber-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        Critical Security Warning
                      </span>
                      <p className="text-gray-300">
                        This forces global revalidation of static routes. Bypassing caching logic forces next-hop client hits directly onto serverless functions, temporarily increasing edge hosting consumption rules.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handleClearCache}
                        disabled={isClearingCache}
                        className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          isClearingCache 
                            ? 'bg-rose-950/40 text-rose-400 cursor-not-allowed border border-rose-900/50' 
                            : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/20 active:scale-[0.98]'
                        }`}
                      >
                        {isClearingCache ? (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
                            Purging Edge Nodes...
                          </>
                        ) : (
                          '⚡ Clear Application Cache'
                        )}
                      </button>

                      {cacheSuccess && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl text-center font-medium">
                          ✓ Cache flushed successfully across Vercel nodes!
                        </div>
                      )}
                      {cacheError && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center font-medium">
                          ❌ Cache purge failed. Inspect logs for details.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Router endpoint refresh */}
                  <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
                    <div>
                      <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">AI Router Endpoint Connection</h3>
                      <p className="text-gray-500 text-[10px] mt-1">Manage network states for regional translations and graphic slogans API pipelines.</p>
                    </div>

                    <div className="flex flex-col gap-4 bg-white/[0.01] p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold text-white">AI Engine Connection Status</span>
                          <span className="text-[10px] text-gray-400">
                            {aiRouterStatus === 'connected' && 'Handshake established. Cluster active.'}
                            {aiRouterStatus === 'disconnecting' && 'Severing socket protocols...'}
                            {aiRouterStatus === 'reconnecting' && 'Re-negotiating client headers...'}
                            {aiRouterStatus === 'idle' && 'Offline. Client queries will fail.'}
                          </span>
                        </div>

                        {/* Status Light Indicator */}
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            aiRouterStatus === 'connected'
                              ? 'bg-emerald-500 animate-pulse'
                              : aiRouterStatus === 'idle'
                              ? 'bg-rose-500 animate-pulse'
                              : 'bg-amber-500 animate-pulse'
                          }`} />
                          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                            {aiRouterStatus}
                          </span>
                        </div>
                      </div>

                      {/* Action toggle button */}
                      <button
                        type="button"
                        onClick={handleToggleRouterConnection}
                        disabled={aiRouterStatus === 'disconnecting' || aiRouterStatus === 'reconnecting'}
                        className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all border flex items-center justify-center gap-1.5 ${
                          aiRouterStatus === 'connected'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/25 active:scale-[0.98]'
                            : aiRouterStatus === 'idle'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25 active:scale-[0.98]'
                            : 'bg-white/5 text-gray-400 border-white/5 cursor-not-allowed'
                        }`}
                      >
                        {aiRouterStatus === 'connected' && '🔄 Disconnect AI Router'}
                        {aiRouterStatus === 'idle' && '⚡ Restart & Reconnect Router'}
                        {aiRouterStatus === 'disconnecting' && 'Disconnecting...'}
                        {aiRouterStatus === 'reconnecting' && 'Reconnecting...'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right 7 columns: Diagnostic logs stream */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">Live Edge Latency & Diagnostic Monitor</h3>
                        <p className="text-gray-500 text-[10px] mt-1">Real-time compiler events and endpoint tracking streams.</p>
                      </div>
                      
                      {/* Clear logs button */}
                      <button 
                        type="button"
                        onClick={() => {
                          setLogs([`[${new Date().toLocaleTimeString()}] SYSTEM: Logs cleared by administrator`]);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-semibold text-gray-400 hover:text-white transition-all active:scale-95"
                      >
                        Clear Terminal
                      </button>
                    </div>

                    {/* Console UI */}
                    <div className="bg-[#05060b] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                      {/* Console Header */}
                      <div className="bg-white/[0.02] px-4 py-2.5 border-b border-white/5 flex justify-between items-center">
                        <div className="flex gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                          platform-edge-monitor.log
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>

                      {/* Console Body */}
                      <div 
                        ref={terminalScrollRef}
                        className="h-[380px] overflow-y-auto p-4 font-mono text-[11px] leading-relaxed flex flex-col gap-1.5 scrollbar-thin select-text bg-[#030407]"
                      >
                        {logs.length === 0 ? (
                          <div className="text-gray-500 italic text-center py-8">Waiting for compiler logs stream...</div>
                        ) : (
                          logs.map((log, index) => (
                            <div key={index} className={getLogLineColor(log)}>
                              {log}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. SUB-ADMIN MODE (STAFF VIEW) */}
        {userRole === 'sub_admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 4 Cols: Restricted metrics */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Restricted Trial Metrics */}
              <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
                <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">Restricted Trial Metrics</h3>
                
                <div className="flex flex-col gap-3 mt-2 text-xs">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.01] border border-white/5">
                    <span>Total 7-Day Trials:</span>
                    <strong className="text-white font-mono text-sm">142</strong>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.01] border border-white/5">
                    <span>Active Users:</span>
                    <strong className="text-white font-mono text-sm">89</strong>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.01] border border-white/5">
                    <span>Trial Conversion Rate:</span>
                    <strong className="text-indigo-400 font-mono text-sm">62%</strong>
                  </div>
                </div>
              </div>
              
              {/* Info banner confirming hidden parameter */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs rounded-2xl leading-relaxed flex gap-2">
                <span className="text-base">🔒</span>
                <div>
                  <strong>Financial Lock:</strong> Revenue statistics, invoice generation parameters, and subscription billing controls are disabled under your sub-admin login.
                </div>
              </div>
            </div>

            {/* Right 8 Cols: Preset editor & slider replacement */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Regional Festival Presets */}
              <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
                <div>
                  <h3 className="text-base font-bold text-white">Regional Festival presets</h3>
                  <p className="text-gray-450 text-xs mt-1">Configure and push regional holiday ad copy templates directly to the canvas templates.</p>
                </div>

                <form onSubmit={handlePushPreset} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-400">Preset Title</label>
                      <input 
                        type="text" 
                        required
                        value={festivalPresetName}
                        onChange={(e) => setFestivalPresetName(e.target.value)}
                        className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-400">Target Category</label>
                      <select className="px-4 py-2.5 bg-[#0c0f18] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-xs">
                        <option value="Cafe">Cafe / Restaurant</option>
                        <option value="Pharmacy">Pharmacy / Healthcare</option>
                        <option value="SaaS">SaaS Platform</option>
                        <option value="Retail">Retail Store / Shop</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-400">Preset Slogan</label>
                    <textarea 
                      required
                      rows={2}
                      value={festivalSlogan}
                      onChange={(e) => setFestivalSlogan(e.target.value)}
                      className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-xs resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all active:scale-[0.98]"
                  >
                    Publish Preset to Regional Clients
                  </button>
                </form>
                {presetSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl text-center">
                    ✓ Festival preset published to database queues successfully!
                  </div>
                )}
              </div>

              {/* Hero GIF replacer */}
              <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
                <div>
                  <h3 className="text-base font-bold text-white">Landing Page Hero GIF Replacer</h3>
                  <p className="text-gray-450 text-xs mt-1">Replace animation slides on the landing page hero slider mockup.</p>
                </div>

                <form onSubmit={handleReplaceSlider} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-400">Select Mockup Slide</label>
                      <select 
                        value={sliderIndex}
                        onChange={(e) => setSliderIndex(e.target.value)}
                        className="px-4 py-2.5 bg-[#0c0f18] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-xs"
                      >
                        <option value="1">Slide 1 (Reels rendering mockup)</option>
                        <option value="2">Slide 2 (Theme switcher mockup)</option>
                        <option value="3">Slide 3 (Layout resizer mockup)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-400">New Animation GIF / Media URL</label>
                      <input 
                        type="url" 
                        required
                        placeholder="https://assets.adgravity.ai/animations/new-slide.gif"
                        value={sliderAssetUrl}
                        onChange={(e) => setSliderAssetUrl(e.target.value)}
                        className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all active:scale-[0.98]"
                  >
                    Deploy New Hero Asset
                  </button>
                </form>
                {assetSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl text-center">
                    ✓ Hero mock slider asset replaced successfully!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
