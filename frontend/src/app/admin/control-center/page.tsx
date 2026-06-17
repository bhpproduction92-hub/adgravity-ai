'use client';

import { useState } from 'react';
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
            </div>

            {/* Right 8 Cols: Staff Manager Panel */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
                <div>
                  <h3 className="text-base font-bold text-white">Staff Manager Panel</h3>
                  <p className="text-gray-450 text-xs mt-1">Manage sub-admin staff credentials and authorization scopes.</p>
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
                              onClick={() => handleRevokeAccess(staff.email)}
                              className="text-red-400 hover:text-red-350 font-bold"
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
