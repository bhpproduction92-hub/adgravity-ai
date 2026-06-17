'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ThemeToggle from '../../components/ThemeToggle';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Dynamic imports to prevent hydration issues
const CategoryController = dynamic(() => import('./control-center/CategoryController'), {
  loading: () => (
    <div className="flex flex-col items-center justify-center p-12 border border-border-custom bg-card-bg rounded-3xl gap-3">
      <span className="w-6 h-6 border-2 border-accent-custom border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-text-secondary">Loading Category & Niche Controller...</span>
    </div>
  ),
  ssr: false,
});

const MaintenanceWorkspace = dynamic(() => import('./control-center/MaintenanceWorkspace'), {
  loading: () => (
    <div className="flex flex-col items-center justify-center p-12 border border-border-custom bg-card-bg rounded-3xl gap-3">
      <span className="w-6 h-6 border-2 border-accent-custom border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-text-secondary">Loading Diagnostic Monitor...</span>
    </div>
  ),
  ssr: false,
});

const AiIntelligence = dynamic(() => import('./control-center/AiIntelligence'), {
  loading: () => (
    <div className="flex flex-col items-center justify-center p-12 border border-border-custom bg-card-bg rounded-3xl gap-3">
      <span className="w-6 h-6 border-2 border-accent-custom border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-text-secondary">Loading AI Intelligence Co-Pilot...</span>
    </div>
  ),
  ssr: false,
});

const SEOManagerForm = dynamic(() => import('./seo-manager/SEOManagerForm'), {
  loading: () => (
    <div className="flex flex-col items-center justify-center p-12 border border-border-custom bg-card-bg rounded-3xl gap-3">
      <span className="w-6 h-6 border-2 border-accent-custom border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-text-secondary">Loading SEO Configuration Console...</span>
    </div>
  ),
  ssr: false,
});

export default function AdminDashboard() {
  const router = useRouter();

  // Login states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [is2FAVisible, setIs2FAVisible] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // RBAC active preview state
  const [userRole, setUserRole] = useState<'super_admin' | 'sub_admin'>('super_admin');

  // Super Admin: Sub-Tab Selection
  const [superAdminTab, setSuperAdminTab] = useState<'operations' | 'category' | 'ai_intelligence' | 'seo_manager' | 'maintenance' | 'queue'>('operations');

  // Sub-Admin: Sub-Tab Selection
  const [subAdminTab, setSubAdminTab] = useState<'operations' | 'category' | 'seo_manager' | 'queue'>('operations');

  // Backend data states (original API metrics)
  const [metrics, setMetrics] = useState<any>({ totalUsers: 0, trialCount: 0, activeCount: 0, totalRevenue: 0 });
  const [pendingQueue, setPendingQueue] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal Editing states for campaigns queue
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editCaptionEn, setEditCaptionEn] = useState('');
  const [editCaptionAs, setEditCaptionAs] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

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

  // Super Admin: Company settings states with verified fallbacks
  const [founderName, setFounderName] = useState('Hridaya Nanda Sarma');
  const [parentCompany, setParentCompany] = useState('BHP Production');
  const [websiteUrl, setWebsiteUrl] = useState('https://bhpproduction.com/');
  const [supportPhone, setSupportPhone] = useState('+91 9577781416');
  const [address, setAddress] = useState('Kahilipara, Guwahati, Assam, India');
  const [companySuccess, setCompanySuccess] = useState(false);

  // Sub-Admin: Festival Presets State
  const [festivalPresetName, setFestivalPresetName] = useState('Rongali Bihu Greetings');
  const [festivalSlogan, setFestivalSlogan] = useState('Bihu offering: Flat 30% discount on all Guwahati local orders!');
  const [presetSuccess, setPresetSuccess] = useState(false);

  // Sub-Admin: Slider asset state
  const [sliderIndex, setSliderIndex] = useState('1');
  const [sliderAssetUrl, setSliderAssetUrl] = useState('');
  const [assetSuccess, setAssetSuccess] = useState(false);

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch metrics
      const metricsRes = await fetch(`${API_BASE_URL}/api/admin/metrics`);
      if (metricsRes.ok) {
        const mData = await metricsRes.json();
        setMetrics(mData);
      }

      // 2. Fetch pending queue
      const queueRes = await fetch(`${API_BASE_URL}/api/admin/content-queue/pending`);
      if (queueRes.ok) {
        const qData = await queueRes.json();
        setPendingQueue(qData.queue || []);
      }

      // 3. Fetch system logs
      const logsRes = await fetch(`${API_BASE_URL}/api/admin/system-logs`);
      if (logsRes.ok) {
        const lData = await logsRes.json();
        setSystemLogs(lData.logs || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadDashboardData();
      const interval = setInterval(loadDashboardData, 10000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const savedCompany = localStorage.getItem('adgravity_company_profile');
    if (savedCompany) {
      const parsed = JSON.parse(savedCompany);
      setWebsiteUrl(parsed.websiteUrl || 'https://bhpproduction.com/');
      setSupportPhone(parsed.supportPhone || '+91 9577781416');
      setAddress(parsed.address || 'Kahilipara, Guwahati, Assam, India');
      setFounderName(parsed.founderName || 'Hridaya Nanda Sarma');
      setParentCompany(parsed.parentCompany || 'BHP Production');
    }

    // Load pricing rules from localStorage
    const savedPricing = localStorage.getItem('adgravity_pricing_rules');
    if (savedPricing) {
      const parsed = JSON.parse(savedPricing);
      if (parsed.basic) setBasicPrice(parsed.basic);
      if (parsed.premium) setPremiumPrice(parsed.premium);
    }

    // Custom events listeners for AI transitions
    const handlePricingUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.basic) setBasicPrice(customEvent.detail.basic);
      if (customEvent.detail.premium) setPremiumPrice(customEvent.detail.premium);
    };

    const handleRevokeStaff = (e: Event) => {
      const customEvent = e as CustomEvent;
      const emailToRevoke = customEvent.detail;
      setStaffList((prev) => prev.filter((staff) => staff.email !== emailToRevoke));
    };

    window.addEventListener('adgravity_pricing_updated', handlePricingUpdate);
    window.addEventListener('adgravity_revoke_staff', handleRevokeStaff);

    return () => {
      window.removeEventListener('adgravity_pricing_updated', handlePricingUpdate);
      window.removeEventListener('adgravity_revoke_staff', handleRevokeStaff);
    };
  }, []);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      founderName,
      parentCompany,
      websiteUrl,
      supportPhone,
      address,
    };
    localStorage.setItem('adgravity_company_profile', JSON.stringify(data));
    setCompanySuccess(true);
    setTimeout(() => setCompanySuccess(false), 2000);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) return;
    
    setStaffList((prev) => [
      ...prev,
      {
        name: newStaffName,
        email: newStaffEmail,
        role: 'Sub-Admin',
        addedAt: new Date().toISOString().split('T')[0],
      }
    ]);
    setNewStaffName('');
    setNewStaffEmail('');
  };

  const handleRevokeAccess = (email: string) => {
    setStaffList((prev) => prev.filter((staff) => staff.email !== email));
  };

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    const pricingData = {
      basic: basicPrice,
      premium: premiumPrice,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('adgravity_pricing_rules', JSON.stringify(pricingData));
    setPricingSuccess(true);
    setTimeout(() => setPricingSuccess(false), 2000);
  };

  const handlePushPreset = (e: React.FormEvent) => {
    e.preventDefault();
    setPresetSuccess(true);
    setTimeout(() => setPresetSuccess(false), 2000);
  };

  const handleReplaceSlider = (e: React.FormEvent) => {
    e.preventDefault();
    setAssetSuccess(true);
    setTimeout(() => setAssetSuccess(false), 2000);
  };

  const handleVerifyCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (username === 'admin' && password === 'admin123') {
      setIs2FAVisible(true);
    } else {
      setLoginError('Invalid username or password. Try admin / admin123');
    }
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (twoFactorCode.length === 6 && /^\d+$/.test(twoFactorCode)) {
      setIsLoggedIn(true);
    } else {
      setLoginError('Invalid 2FA code. Enter any 6-digit verification code.');
    }
  };

  const handleApproveContent = async (itemId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/content-queue/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (res.ok) {
        loadDashboardData();
      } else {
        alert('Failed to approve content item.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (item: any) => {
    const parsed = parseContent(item.ai_content);
    setEditingItem(item);
    setEditCaptionEn(parsed.caption_en || '');
    setEditCaptionAs(parsed.caption_as || '');
  };

  const handleSaveAndApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSavingEdit(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/content-queue/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption_en: editCaptionEn,
          caption_as: editCaptionAs,
          status: 'approved',
        }),
      });

      if (res.ok) {
        setEditingItem(null);
        loadDashboardData();
      } else {
        alert('Failed to save edited captions.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingEdit(false);
    }
  };

  const parseContent = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return { caption_en: jsonStr, caption_as: '' };
    }
  };

  // 1. RENDER LOGIN GATE
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white relative font-urbanist">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(26,115,232,0.08),transparent_50%)] pointer-events-none" />
        
        <div className="w-full max-w-md bg-card-bg border border-border-custom rounded-3xl p-8 shadow-xl relative backdrop-blur-md">
          <div className="flex flex-col items-center gap-2 mb-8 text-center">
            <div className="w-11 h-11 rounded-xl bg-accent-custom flex items-center justify-center text-white font-extrabold text-lg shadow-sm shadow-accent-custom/10">
              A
            </div>
            <h2 className="text-xl font-extrabold text-text-primary font-heading mt-2">
              AdGravity<span className="text-accent-custom">.AI</span> Admin Portal
            </h2>
            <p className="text-text-secondary text-xs mt-1 font-medium">
              Secure Administrative Access Gate.
            </p>
          </div>

          {!is2FAVisible ? (
            <form onSubmit={handleVerifyCredentials} className="flex flex-col gap-4 text-xs font-semibold text-text-secondary">
              <div className="flex flex-col gap-1.5">
                <label className="text-text-primary">Username</label>
                <input 
                  type="text" 
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-bg-primary border border-border-custom focus:border-accent-custom focus:outline-none text-text-primary transition-all placeholder-text-secondary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-text-primary">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-bg-primary border border-border-custom focus:border-accent-custom focus:outline-none text-text-primary transition-all placeholder-text-secondary"
                />
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 py-3 rounded-xl bg-accent-custom hover:bg-accent-custom/95 text-white font-bold transition-all active:scale-[0.98] cursor-pointer shadow-md shadow-accent-custom/10"
              >
                Verify Credentials
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify2FA} className="flex flex-col gap-4 text-xs font-semibold text-text-secondary">
              <div className="bg-accent-custom/10 border border-accent-custom/25 text-accent-custom p-3 rounded-xl leading-relaxed">
                🔒 Credentials verified. Please enter the 6-digit Two-Factor Authentication (2FA) verification code.
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-text-primary text-center">2FA Code</label>
                <input 
                  type="text" 
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-bg-primary border border-border-custom focus:border-accent-custom focus:outline-none text-text-primary text-center text-lg font-mono tracking-[8px] transition-all placeholder-text-secondary"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => setIs2FAVisible(false)}
                  className="flex-1 py-3 rounded-xl bg-bg-primary border border-border-custom text-text-primary font-bold transition-all cursor-pointer"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-3 rounded-xl bg-accent-custom hover:bg-accent-custom/95 text-white font-bold transition-all active:scale-[0.98] cursor-pointer shadow-md shadow-accent-custom/10"
                >
                  Verify & Enter
                </button>
              </div>
            </form>
          )}

          {loginError && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-center rounded-xl font-medium text-xs">
              {loginError}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. RENDER MASTER DASHBOARD
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-12 transition-colors duration-300 font-urbanist">
      {/* Top Navbar */}
      <header className="w-full bg-card-bg border-b border-border-custom sticky top-0 z-40 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 rounded-xl bg-accent-custom flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
              A
            </div>
            <span className="text-lg font-black tracking-tight text-text-primary font-heading">
              AdGravity<span className="text-accent-custom">.AI</span> Control Center
            </span>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Theme Toggle widget */}
            <ThemeToggle />

            {/* Role Switch Toggle */}
            <div className="flex bg-bg-primary p-1 rounded-xl border border-border-custom text-xs">
              <button
                onClick={() => setUserRole('super_admin')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  userRole === 'super_admin' ? 'bg-accent-custom text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Owner (Super Admin)
              </button>
              <button
                onClick={() => setUserRole('sub_admin')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  userRole === 'sub_admin' ? 'bg-accent-custom text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Staff (Sub-Admin)
              </button>
            </div>

            <button
              onClick={() => setIsLoggedIn(false)}
              className="px-3.5 py-2 rounded-xl bg-bg-primary hover:bg-black/5 border border-border-custom text-text-primary text-xs font-bold transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Panel grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Banner */}
        <div className="rounded-3xl bg-gradient-to-tr from-accent-custom/5 via-accent-custom/10 to-transparent border border-accent-custom/20 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-accent-custom font-extrabold">Role-Based Access Control (RBAC) active</span>
            <h2 className="text-xl font-bold text-text-primary">
              Currently viewing as: <span className="text-accent-custom uppercase font-extrabold">{userRole === 'super_admin' ? 'Super Admin / Owner' : 'Sub-Admin / Staff'}</span>
            </h2>
            <p className="text-text-secondary text-xs mt-1 font-medium">
              Verify distinct views and parameters using the toggle at the top right.
            </p>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-accent-custom/10 border border-accent-custom/20 text-accent-custom text-xs font-bold uppercase">
            {userRole === 'super_admin' ? 'Owner Mode' : 'Staff Mode'}
          </span>
        </div>

        {/* 1. SUPER ADMIN MODE (OWNER VIEW) */}
        {userRole === 'super_admin' && (
          <div className="flex flex-col gap-8 animate-fade-in">
            {/* Super Admin Sub-Tabs */}
            <div className="flex border-b border-border-custom pb-1 gap-6 text-xs sm:text-sm overflow-x-auto no-scrollbar font-bold">
              <button
                onClick={() => setSuperAdminTab('operations')}
                className={`pb-3 transition-all relative flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  superAdminTab === 'operations' ? 'text-text-primary font-black' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                📊 Platform Operations
                {superAdminTab === 'operations' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-custom rounded-full" />
                )}
              </button>
              <button
                onClick={() => setSuperAdminTab('category')}
                className={`pb-3 transition-all relative flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  superAdminTab === 'category' ? 'text-text-primary font-black' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                🏷️ Category Manager
                {superAdminTab === 'category' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-custom rounded-full" />
                )}
              </button>
              <button
                onClick={() => setSuperAdminTab('ai_intelligence')}
                className={`pb-3 transition-all relative flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  superAdminTab === 'ai_intelligence' ? 'text-accent-custom font-black' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                🤖 AI Intelligence
                {superAdminTab === 'ai_intelligence' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-custom rounded-full shadow-[0_0_8px_rgba(26,115,232,0.5)]" />
                )}
              </button>
              <button
                onClick={() => setSuperAdminTab('seo_manager')}
                className={`pb-3 transition-all relative flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  superAdminTab === 'seo_manager' ? 'text-text-primary font-black' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                🚀 SEO Manager
                {superAdminTab === 'seo_manager' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-custom rounded-full" />
                )}
              </button>
              <button
                onClick={() => setSuperAdminTab('queue')}
                className={`pb-3 transition-all relative flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  superAdminTab === 'queue' ? 'text-text-primary font-black' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                📋 Client Content Queue ({pendingQueue.length})
                {superAdminTab === 'queue' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-custom rounded-full" />
                )}
              </button>
              <button
                onClick={() => setSuperAdminTab('maintenance')}
                className={`pb-3 transition-all relative flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  superAdminTab === 'maintenance' ? 'text-text-primary font-black' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                🔧 Developer Tools
                {superAdminTab === 'maintenance' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-custom rounded-full" />
                )}
              </button>
            </div>

            {/* Tab 1: Operations */}
            {superAdminTab === 'operations' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                {/* Left 4 Cols: Revenue Analytics */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  {/* Analytics */}
                  <div className="rounded-3xl bg-card-bg border border-border-custom p-6 flex flex-col gap-4 shadow-sm">
                    <h3 className="text-sm font-extrabold tracking-wide text-text-secondary uppercase">Platform Revenue Analytics</h3>
                    
                    <div className="flex flex-col gap-4 mt-2">
                      <div className="bg-bg-primary border border-border-custom p-4 rounded-2xl">
                        <span className="text-[10px] text-text-secondary font-bold uppercase">Total Platform Revenue</span>
                        <h4 className="text-3xl font-black text-text-primary mt-1">₹1,45,280</h4>
                      </div>
                      <div className="bg-bg-primary border border-border-custom p-4 rounded-2xl">
                        <span className="text-[10px] text-text-secondary font-bold uppercase">Monthly Recurring Revenue (MRR)</span>
                        <h4 className="text-3xl font-black text-text-primary mt-1">₹12,499</h4>
                      </div>
                      <div className="bg-bg-primary border border-border-custom p-4 rounded-2xl flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-text-secondary font-bold uppercase">Active paid Plans</span>
                          <h4 className="text-2xl font-black text-text-primary mt-0.5">48</h4>
                        </div>
                        <span className="text-emerald-500 text-xs font-bold">+12% this mo</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Rules Configuration */}
                  <div className="rounded-3xl bg-card-bg border border-border-custom p-6 flex flex-col gap-6 shadow-sm">
                    <div>
                      <h3 className="text-sm font-extrabold tracking-wide text-text-secondary uppercase">Pricing & Packages Rules</h3>
                      <p className="text-text-secondary text-[10px] mt-1 font-medium">Update package rates globally inside database.</p>
                    </div>

                    <form onSubmit={handleSavePricing} className="flex flex-col gap-4 text-xs font-bold text-text-secondary">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-text-primary">Basic Package Price (₹)</label>
                        <input 
                          type="number" 
                          value={basicPrice}
                          onChange={(e) => setBasicPrice(Number(e.target.value))}
                          className="px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-text-primary">Standard Package Price (₹)</label>
                        <input 
                          type="number" 
                          value={standardPrice}
                          onChange={(e) => setStandardPrice(Number(e.target.value))}
                          className="px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-text-primary">Premium Package Price (₹)</label>
                        <input 
                          type="number" 
                          value={premiumPrice}
                          onChange={(e) => setPremiumPrice(Number(e.target.value))}
                          className="px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary font-mono"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3 rounded-xl bg-accent-custom hover:bg-accent-custom/90 text-white font-bold transition-all active:scale-[0.98] cursor-pointer"
                      >
                        Save Package Configurations
                      </button>
                    </form>
                    {pricingSuccess && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs rounded-xl text-center font-bold">
                        ✓ Pricing parameters updated successfully!
                      </div>
                    )}
                  </div>

                  {/* Company Profile Settings Panel */}
                  <div className="rounded-3xl bg-card-bg border border-border-custom p-6 flex flex-col gap-6 shadow-sm">
                    <div>
                      <h3 className="text-sm font-extrabold tracking-wide text-text-secondary uppercase">Company Settings Panel</h3>
                      <p className="text-text-secondary text-[10px] mt-1 font-medium">Configure company credentials globally.</p>
                    </div>

                    <form onSubmit={handleSaveCompany} className="flex flex-col gap-4 text-xs font-bold text-text-secondary">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-text-primary">Founder & Director</label>
                        <input 
                          type="text" 
                          value={founderName}
                          onChange={(e) => setFounderName(e.target.value)}
                          className="px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-text-primary">Parent Company</label>
                        <input 
                          type="text" 
                          value={parentCompany}
                          onChange={(e) => setParentCompany(e.target.value)}
                          className="px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-text-primary">Website URL</label>
                        <input 
                          type="url" 
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          className="px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-text-primary">Support Contact Phone</label>
                        <input 
                          type="text" 
                          value={supportPhone}
                          onChange={(e) => setSupportPhone(e.target.value)}
                          className="px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-text-primary">Physical Address</label>
                        <input 
                          type="text" 
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3 rounded-xl bg-accent-custom hover:bg-accent-custom/90 text-white font-bold transition-all active:scale-[0.98] cursor-pointer"
                      >
                        Save Company Profile
                      </button>
                    </form>
                    {companySuccess && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs rounded-xl text-center font-bold">
                        ✓ Company profile updated globally!
                      </div>
                    )}
                  </div>
                </div>

                {/* Right 8 Cols: Staff Manager Panel */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="rounded-3xl bg-card-bg border border-border-custom p-6 flex flex-col gap-6 shadow-sm">
                    <div>
                      <h3 className="text-base font-bold text-text-primary">Staff Manager Panel</h3>
                      <p className="text-text-secondary text-xs mt-1 font-medium">Manage sub-admin staff credentials and authorization scopes.</p>
                    </div>

                    {/* Add new staff form */}
                    <form onSubmit={handleAddStaff} className="flex flex-col sm:flex-row gap-4 bg-bg-primary p-4 rounded-2xl border border-border-custom items-end text-xs font-bold text-text-secondary">
                      <div className="flex-1 flex flex-col gap-1.5 w-full">
                        <label className="text-text-primary font-bold">Staff Full Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Anurag Dutta"
                          value={newStaffName}
                          onChange={(e) => setNewStaffName(e.target.value)}
                          className="px-4 py-2.5 bg-card-bg border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary"
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-1.5 w-full">
                        <label className="text-text-primary font-bold">Staff Email</label>
                        <input 
                          type="email" 
                          required
                          placeholder="anurag@adgravity.ai"
                          value={newStaffEmail}
                          onChange={(e) => setNewStaffEmail(e.target.value)}
                          className="px-4 py-2.5 bg-card-bg border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary font-mono"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="py-3 px-6 rounded-xl bg-accent-custom hover:bg-accent-custom/90 text-white font-bold transition-all active:scale-[0.98] w-full sm:w-auto cursor-pointer"
                      >
                        Add Sub-Admin
                      </button>
                    </form>

                    {/* Staff table */}
                    <div className="overflow-x-auto border border-border-custom rounded-2xl bg-bg-primary shadow-inner">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-border-custom text-text-secondary uppercase tracking-wider font-extrabold bg-black/5 dark:bg-white/5">
                            <th className="p-4">Staff Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Access Level</th>
                            <th className="p-4">Added Date</th>
                            <th className="p-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {staffList.map((staff) => (
                            <tr key={staff.email} className="border-b border-border-custom hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium">
                              <td className="p-4 font-bold text-text-primary">{staff.name}</td>
                              <td className="p-4 text-text-secondary font-mono">{staff.email}</td>
                              <td className="p-4">
                                <span className="px-2 py-0.5 rounded bg-accent-custom/10 text-accent-custom text-[10px] font-bold border border-accent-custom/25">
                                  {staff.role}
                                </span>
                              </td>
                              <td className="p-4 text-text-secondary">{staff.addedAt}</td>
                              <td className="p-4 text-right">
                                <button 
                                  type="button"
                                  onClick={() => handleRevokeAccess(staff.email)}
                                  className="text-red-500 hover:text-red-600 font-bold cursor-pointer"
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

            {/* Tab 2: Category Manager */}
            {superAdminTab === 'category' && (
              <CategoryController />
            )}

            {/* Tab 3: AI Intelligence */}
            {superAdminTab === 'ai_intelligence' && (
              <AiIntelligence />
            )}

            {/* Tab 4: SEO Manager */}
            {superAdminTab === 'seo_manager' && (
              <SEOManagerForm />
            )}

            {/* Tab 5: Client Content Queue */}
            {superAdminTab === 'queue' && renderQueueWorkspace()}

            {/* Tab 6: Maintenance Tools */}
            {superAdminTab === 'maintenance' && (
              <MaintenanceWorkspace />
            )}
          </div>
        )}

        {/* 2. SUB-ADMIN MODE (STAFF VIEW) */}
        {userRole === 'sub_admin' && (
          <div className="flex flex-col gap-8 animate-fade-in">
            {/* Sub-Admin Sub-Tabs */}
            <div className="flex border-b border-border-custom pb-1 gap-6 text-xs sm:text-sm overflow-x-auto no-scrollbar font-bold">
              <button
                onClick={() => setSubAdminTab('operations')}
                className={`pb-3 transition-all relative flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  subAdminTab === 'operations' ? 'text-text-primary font-black' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                📋 Staff Operations
                {subAdminTab === 'operations' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-custom rounded-full" />
                )}
              </button>
              <button
                onClick={() => setSubAdminTab('category')}
                className={`pb-3 transition-all relative flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  subAdminTab === 'category' ? 'text-text-primary font-black' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                🏷️ Category Manager
                {subAdminTab === 'category' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-custom rounded-full" />
                )}
              </button>
              <button
                onClick={() => setSubAdminTab('seo_manager')}
                className={`pb-3 transition-all relative flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  subAdminTab === 'seo_manager' ? 'text-text-primary font-black' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                🚀 SEO Manager
                {subAdminTab === 'seo_manager' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-custom rounded-full" />
                )}
              </button>
              <button
                onClick={() => setSubAdminTab('queue')}
                className={`pb-3 transition-all relative flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  subAdminTab === 'queue' ? 'text-text-primary font-black' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                📋 Client Content Queue ({pendingQueue.length})
                {subAdminTab === 'queue' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-custom rounded-full" />
                )}
              </button>
            </div>

            {subAdminTab === 'operations' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                {/* Left 4 Cols: Restricted metrics */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  {/* Restricted Trial Metrics */}
                  <div className="rounded-3xl bg-card-bg border border-border-custom p-6 flex flex-col gap-4 shadow-sm">
                    <h3 className="text-sm font-extrabold tracking-wide text-text-secondary uppercase">Restricted Trial Metrics</h3>
                    
                    <div className="flex flex-col gap-3 mt-2 text-xs font-semibold">
                      <div className="flex justify-between items-center p-3 rounded-xl bg-bg-primary border border-border-custom">
                        <span>Total 7-Day Trials:</span>
                        <strong className="text-text-primary font-mono text-sm">142</strong>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-bg-primary border border-border-custom">
                        <span>Active Users:</span>
                        <strong className="text-text-primary font-mono text-sm">89</strong>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-bg-primary border border-border-custom">
                        <span>Trial Conversion Rate:</span>
                        <strong className="text-accent-custom font-mono text-sm">62%</strong>
                      </div>
                    </div>
                  </div>
                  
                  {/* Info banner confirming hidden parameter */}
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-800 dark:text-yellow-300 text-xs rounded-2xl leading-relaxed flex gap-2 font-medium">
                    <span className="text-base">🔒</span>
                    <div>
                      <strong>Financial Lock:</strong> Revenue statistics, invoice generation parameters, and subscription billing controls are disabled under your sub-admin login.
                    </div>
                  </div>
                </div>

                {/* Right 8 Cols: Preset editor & slider replacement */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  {/* Regional Festival Presets */}
                  <div className="rounded-3xl bg-card-bg border border-border-custom p-6 flex flex-col gap-6 shadow-sm">
                    <div>
                      <h3 className="text-base font-bold text-text-primary">Regional Festival presets</h3>
                      <p className="text-text-secondary text-xs mt-1 font-medium">Configure and push regional holiday ad copy templates directly to the canvas templates.</p>
                    </div>

                    <form onSubmit={handlePushPreset} className="flex flex-col gap-4 text-xs font-bold text-text-secondary">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-text-primary">Preset Title</label>
                          <input 
                            type="text" 
                            required
                            value={festivalPresetName}
                            onChange={(e) => setFestivalPresetName(e.target.value)}
                            className="px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-text-primary">Target Category</label>
                          <select className="px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary">
                            <option value="Cafe">Cafe / Restaurant</option>
                            <option value="Pharmacy">Pharmacy / Healthcare</option>
                            <option value="SaaS">SaaS Platform</option>
                            <option value="Retail">Retail Store / Shop</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-text-primary">Preset Slogan</label>
                        <textarea 
                          required
                          rows={2}
                          value={festivalSlogan}
                          onChange={(e) => setFestivalSlogan(e.target.value)}
                          className="px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary resize-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3 rounded-xl bg-accent-custom hover:bg-accent-custom/90 text-white font-bold transition-all active:scale-[0.98] cursor-pointer"
                      >
                        Publish Preset to Regional Clients
                      </button>
                    </form>
                    {presetSuccess && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs rounded-xl text-center font-bold">
                        ✓ Festival preset published to database queues successfully!
                      </div>
                    )}
                  </div>

                  {/* Hero GIF replacer */}
                  <div className="rounded-3xl bg-card-bg border border-border-custom p-6 flex flex-col gap-6 shadow-sm">
                    <div>
                      <h3 className="text-base font-bold text-text-primary">Landing Page Hero GIF Replacer</h3>
                      <p className="text-text-secondary text-xs mt-1 font-medium">Replace animation slides on the landing page hero slider mockup.</p>
                    </div>

                    <form onSubmit={handleReplaceSlider} className="flex flex-col gap-4 text-xs font-bold text-text-secondary">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-text-primary">Select Mockup Slide</label>
                          <select 
                            value={sliderIndex}
                            onChange={(e) => setSliderIndex(e.target.value)}
                            className="px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary"
                          >
                            <option value="1">Slide 1 (Reels rendering mockup)</option>
                            <option value="2">Slide 2 (Theme switcher mockup)</option>
                            <option value="3">Slide 3 (Layout resizer mockup)</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-text-primary">New Animation GIF / Media URL</label>
                          <input 
                            type="url" 
                            required
                            placeholder="https://assets.adgravity.ai/animations/new-slide.gif"
                            value={sliderAssetUrl}
                            onChange={(e) => setSliderAssetUrl(e.target.value)}
                            className="px-4 py-2.5 bg-bg-primary border border-border-custom rounded-xl focus:border-accent-custom focus:outline-none text-text-primary font-mono"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3 rounded-xl bg-accent-custom hover:bg-accent-custom/90 text-white font-bold transition-all active:scale-[0.98] cursor-pointer"
                      >
                        Deploy New Hero Asset
                      </button>
                    </form>
                    {assetSuccess && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs rounded-xl text-center font-bold">
                        ✓ Hero mock slider asset replaced successfully!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {subAdminTab === 'category' && (
              <CategoryController />
            )}

            {subAdminTab === 'seo_manager' && (
              <SEOManagerForm />
            )}

            {subAdminTab === 'queue' && renderQueueWorkspace()}
          </div>
        )}
      </main>

      {/* Edit captions modal popup */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-55 animate-fade-in">
          <div className="w-full max-w-2xl bg-card-bg border border-border-custom rounded-3xl p-8 shadow-xl relative">
            <h3 className="text-lg font-bold text-text-primary font-heading mb-2">
              Edit & Approve Campaign
            </h3>
            <p className="text-text-secondary text-xs mb-6 font-medium">
              Adjust the copies before final authorization and client dispatch.
            </p>

            <form onSubmit={handleSaveAndApprove} className="flex flex-col gap-4 text-xs font-bold text-text-secondary">
              <div className="flex flex-col gap-1.5">
                <label className="text-text-primary">English Social Caption</label>
                <textarea 
                  className="px-4 py-2.5 rounded-xl bg-bg-primary border border-border-custom focus:border-accent-custom focus:outline-none text-text-primary text-xs resize-none" 
                  rows={4}
                  value={editCaptionEn}
                  onChange={(e) => setEditCaptionEn(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-text-primary">Assamese Local Translation</label>
                <textarea 
                  className="px-4 py-2.5 rounded-xl bg-bg-primary border border-border-custom focus:border-accent-custom focus:outline-none text-text-primary text-xs resize-none" 
                  rows={4}
                  value={editCaptionAs}
                  onChange={(e) => setEditCaptionAs(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button 
                  type="button" 
                  onClick={() => setEditingItem(null)} 
                  disabled={savingEdit}
                  className="px-4 py-2.5 rounded-xl bg-bg-primary border border-border-custom text-text-primary font-bold transition-all cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={savingEdit}
                  className="px-5 py-2.5 rounded-xl bg-accent-custom hover:bg-accent-custom/90 text-white font-bold transition-all active:scale-[0.98] cursor-pointer text-xs"
                >
                  {savingEdit ? 'Saving & Approving...' : 'Save & Approve'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // 3. RENDER CONTENT QUEUE TAB WORKSPACE
  function renderQueueWorkspace() {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Global Client Content Queue</h3>
          <p className="text-text-secondary text-xs mt-1 font-medium">Pending client campaign copy creations requiring admin authorization.</p>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="rounded-3xl border border-border-custom bg-card-bg p-12 text-center text-text-secondary italic text-xs font-semibold">
            🎉 No pending campaigns in queue. All clean!
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {pendingQueue.map((item) => {
              const parsed = parseContent(item.ai_content);
              return (
                <div key={item.id} className="rounded-3xl bg-card-bg border border-border-custom p-6 flex flex-col gap-5 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start flex-wrap gap-4 border-b border-border-custom pb-4">
                    <div>
                      <strong className="text-sm font-bold text-text-primary block">
                        {item.users?.company_name || 'N/A Company'}
                      </strong>
                      <span className="text-[10px] text-text-secondary font-mono">
                        Email: {item.users?.email || 'N/A'} | ID: {item.id.slice(0, 8)}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 text-[10px] font-bold uppercase tracking-wide">
                      AWAITING APPROVAL
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-text-secondary">
                    <strong className="text-text-primary font-bold uppercase tracking-wider block mb-1">Prompt</strong>
                    <p className="italic">"{item.prompt}"</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-text-secondary">
                    <div className="bg-bg-primary p-4 rounded-xl border border-border-custom">
                      <strong className="text-accent-custom font-bold block mb-2">ENGLISH CAPTION</strong>
                      <p className="text-text-primary leading-relaxed">{parsed.caption_en}</p>
                    </div>
                    <div className="bg-bg-primary p-4 rounded-xl border border-border-custom">
                      <strong className="text-purple-600 dark:text-purple-300 font-bold block mb-2">ASSAMESE TRANSCREATION</strong>
                      <p className="text-text-primary leading-relaxed">{parsed.caption_as}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button 
                      onClick={() => openEditModal(item)} 
                      className="px-4 py-2 rounded-xl bg-bg-primary hover:bg-black/5 border border-border-custom text-text-primary font-bold text-xs cursor-pointer transition-all"
                    >
                      Edit Captions
                    </button>
                    <button 
                      onClick={() => handleApproveContent(item.id)} 
                      className="px-4 py-2 rounded-xl bg-accent-custom hover:bg-accent-custom/90 text-white font-bold text-xs cursor-pointer transition-all shadow-sm"
                    >
                      Approve Post
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* System Logs console */}
        <div className="rounded-3xl bg-card-bg border border-border-custom p-6 flex flex-col gap-6 shadow-sm">
          <div>
            <h4 className="text-base font-bold text-text-primary">System Events Log Stream</h4>
            <p className="text-text-secondary text-xs mt-1 font-medium">Real-time feed of events, payment gateways, and content authorization alerts.</p>
          </div>

          <div className="flex flex-col gap-1.5 bg-[#030508] text-gray-300 font-mono text-[10px] p-5 rounded-2xl max-h-[300px] overflow-y-auto border border-white/5">
            {systemLogs.length === 0 ? (
              <div className="text-gray-500 italic text-center py-6">No system logs recorded yet.</div>
            ) : (
              systemLogs.map((log) => {
                let color = 'text-gray-400';
                if (log.type === 'success') color = 'text-emerald-400';
                if (log.type === 'error') color = 'text-red-400';
                if (log.type === 'warning') color = 'text-amber-400';

                return (
                  <div key={log.id} className="flex gap-3 py-1 border-b border-white/[0.02] last:border-0">
                    <span className="text-gray-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className={`font-bold ${color}`}>[{log.type.toUpperCase()}]</span>
                    <span className="flex-1 whitespace-pre-wrap">{log.message}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }
}
