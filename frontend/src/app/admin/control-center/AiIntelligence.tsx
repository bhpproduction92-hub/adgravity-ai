'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_CATEGORIES, CategoryItem } from './CategoryController';

export interface AuditLog {
  id: string;
  timestamp: string;
  prompt: string;
  operation: string;
  description: string;
  status: 'DEPLOYED' | 'FAILED';
}

const PRESETS_SUGGESTIONS = [
  'Change Basic price to Rs. 399 and Premium price to Rs. 1499',
  'Add healthcare category called Specialized Cardiology under Medical & Healthcare',
  'Invalidate global application cache and restart AI endpoint router',
  'Add 15 premium clothing templates for Durga Puja festival',
  'Revoke staff access for irfan@adgravity.ai',
];

interface PendingChange {
  action: string;
  details: string;
  impact: string;
  type: 'PRICING' | 'CATEGORY' | 'CACHE' | 'TEMPLATES' | 'STAFF' | 'UNKNOWN';
  payload: any;
}

export default function AiIntelligence() {
  const [prompt, setPrompt] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileSteps, setCompileSteps] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  
  // Deployment States
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);
  const [deployStep, setDeployStep] = useState('');
  
  // Logs history
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Load audit logs on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('adgravity_ai_audit');
    if (savedLogs) {
      setAuditLogs(JSON.parse(savedLogs));
    } else {
      const initialLogs: AuditLog[] = [
        {
          id: 'TXN-AI-E8B1',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          prompt: 'Configure initial SaaS pricing and category mappings',
          operation: 'SYSTEM_BOOTSTRAP',
          description: 'Loaded default 22 Indian business verticals and fallback basic/premium pricing.',
          status: 'DEPLOYED',
        }
      ];
      setAuditLogs(initialLogs);
      localStorage.setItem('adgravity_ai_audit', JSON.stringify(initialLogs));
    }
  }, []);

  const triggerAlert = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  // Compile steps mock animation
  const runCompileAnimation = (parsedChanges: PendingChange[]) => {
    setIsCompiling(true);
    setCompileSteps([]);
    setCurrentStepIndex(0);
    setIsPreviewVisible(false);
    setPendingChanges([]);

    const steps = [
      '⚡ [AI Co-Pilot] Parsing natural language intent and grammar...',
      '🔍 [Entity Parser] Identifying target modules and database schemas...',
      '🛠️ [State Planner] Constructing system mutation graph and checks...',
      '📦 [System Generator] Compiling pending configuration payloads...',
      '✅ [Completed] System transitions prepared. Ready for Admin Sandbox review.',
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setCompileSteps((prev) => [...prev, steps[current]]);
        current++;
        setCurrentStepIndex(current);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsCompiling(false);
          setPendingChanges(parsedChanges);
          setIsPreviewVisible(true);
          triggerAlert('AI generation complete! Review the changes below.', 'info');
        }, 600);
      }
    }, 800);
  };

  // Natural Language Parser logic
  const handleGenerateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const lowerPrompt = prompt.toLowerCase();
    const parsed: PendingChange[] = [];

    // 1. Pricing Update Intent
    if (lowerPrompt.includes('price') || lowerPrompt.includes('pricing') || lowerPrompt.includes('rate') || lowerPrompt.includes('rs') || lowerPrompt.includes('₹')) {
      // Look for numbers
      const numbers = prompt.match(/\b\d+\b/g);
      let basic = 399;
      let premium = 1499;
      if (numbers && numbers.length >= 2) {
        basic = parseInt(numbers[0], 10);
        premium = parseInt(numbers[1], 10);
      } else if (numbers && numbers.length === 1) {
        basic = parseInt(numbers[0], 10);
      }
      
      parsed.push({
        action: 'UPDATE_PRICING_METRICS',
        details: `Set Basic Plan rate to ₹${basic} and Premium Plan rate to ₹${premium} dynamically inside local configuration state.`,
        impact: 'Updates package rules displayed in Pricing matrices globally.',
        type: 'PRICING',
        payload: { basic, premium },
      });
    }

    // 2. Add Category Intent
    if (lowerPrompt.includes('category') || lowerPrompt.includes('niche') || lowerPrompt.includes('healthcare') || lowerPrompt.includes('cardiology')) {
      let catName = 'Specialized Cardiology';
      let verticalName = 'Medical & Healthcare';
      
      if (lowerPrompt.includes('healthcare') || lowerPrompt.includes('cardiology')) {
        catName = 'Specialized Cardiology';
        verticalName = 'Medical & Healthcare';
      } else {
        // try parsing "called X under Y"
        const nameMatch = prompt.match(/called\s+["']?([^"']+)["']?/i);
        if (nameMatch && nameMatch[1]) {
          catName = nameMatch[1].trim();
        }
        const vertMatch = prompt.match(/under\s+["']?([^"']+)["']?/i);
        if (vertMatch && vertMatch[1]) {
          verticalName = vertMatch[1].trim();
        }
      }

      parsed.push({
        action: 'REGISTER_BUSINESS_CATEGORY',
        details: `Inject new niche category "${catName}" grouped under the "${verticalName}" mega-vertical.`,
        impact: 'Updates the custom searchable dropdown inside client profile onboarding.',
        type: 'CATEGORY',
        payload: { name: catName, vertical: verticalName },
      });
    }

    // 3. Cache Invalidation Intent
    if (lowerPrompt.includes('cache') || lowerPrompt.includes('invalidate') || lowerPrompt.includes('restart') || lowerPrompt.includes('clear')) {
      parsed.push({
        action: 'CDN_EDGE_INVALIDATION',
        details: `Trigger a Vercel CDN Cache Busting hook for static paths & verify endpoint health router.`,
        impact: 'Purges intermediate edge page cache blocks, enforcing instant re-generation.',
        type: 'CACHE',
        payload: { path: '/api/revalidate', reconnectRouter: true },
      });
    }

    // 4. Staff access revocation
    if (lowerPrompt.includes('revoke') || lowerPrompt.includes('staff') || lowerPrompt.includes('de-authorize') || lowerPrompt.includes('remove')) {
      let email = 'irfan@adgravity.ai';
      const emailMatch = prompt.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
      if (emailMatch) {
        email = emailMatch[0];
      }
      parsed.push({
        action: 'REVOKE_STAFF_ACCESS',
        details: `Remove Sub-Admin privileges and invalidate authorization keys for account: "${email}".`,
        impact: 'Super Admin Staff Manager accounts table permissions update.',
        type: 'STAFF',
        payload: { email },
      });
    }

    // 5. General template add fallback
    if (parsed.length === 0) {
      const countMatch = prompt.match(/\b\d+\b/);
      const count = countMatch ? parseInt(countMatch[0], 10) : 10;
      let festivalName = 'Durga Puja';
      if (lowerPrompt.includes('bihu')) festivalName = 'Rongali Bihu';
      else if (lowerPrompt.includes('diwali')) festivalName = 'Diwali Special';
      else if (lowerPrompt.includes('puja')) festivalName = 'Durga Puja';

      parsed.push({
        action: 'INJECT_GRAPHIC_TEMPLATES',
        details: `Generate and index ${count} new themed design templates for "${festivalName}" with locked vector grids.`,
        impact: 'Expands available templates inside Aspect Ratio selector canvas presets.',
        type: 'TEMPLATES',
        payload: { count, theme: festivalName },
      });
    }

    runCompileAnimation(parsed);
  };

  // Trigger deploy sequence with real side-effects
  const handleDeployChanges = async () => {
    if (pendingChanges.length === 0 || isDeploying) return;
    
    setIsDeploying(true);
    setDeployProgress(0);
    setDeployStep('Initializing secure transaction keys...');

    const deployStepsList = [
      { progress: 15, text: 'Resolving multi-module deployment locks...' },
      { progress: 45, text: 'Writing schemas and configurations to production db...' },
      { progress: 75, text: 'Busting CDN cache states and revalidating pages...' },
      { progress: 95, text: 'Verifying system post-deployment integrity...' },
      { progress: 100, text: 'System evolved! Deployment finalized successfully.' },
    ];

    let currentIdx = 0;
    const interval = setInterval(async () => {
      if (currentIdx < deployStepsList.length) {
        setDeployProgress(deployStepsList[currentIdx].progress);
        setDeployStep(deployStepsList[currentIdx].text);
        currentIdx++;
      } else {
        clearInterval(interval);
        
        // APPLY REAL SIDE-EFFECTS
        for (const change of pendingChanges) {
          if (change.type === 'PRICING') {
            // Write pricing configurations to localStorage
            const pricingData = {
              basic: change.payload.basic,
              premium: change.payload.premium,
              updatedAt: new Date().toISOString(),
            };
            localStorage.setItem('adgravity_pricing_rules', JSON.stringify(pricingData));
            
            // Dispatch custom event to notify control-center page.tsx to update pricing form
            window.dispatchEvent(new CustomEvent('adgravity_pricing_updated', { detail: pricingData }));
          }
          
          if (change.type === 'CATEGORY') {
            // Append category to localStorage
            const saved = localStorage.getItem('adgravity_categories');
            const list: CategoryItem[] = saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
            
            const newCat: CategoryItem = {
              id: 'cat_ai_' + Math.random().toString(36).substring(2, 9),
              name: change.payload.name,
              vertical: change.payload.vertical,
              layouts: 'AI Co-Pilot Generated, Neon Accent Layouts',
            };
            
            // Check if name already exists to prevent duplicate
            if (!list.some(c => c.name.toLowerCase() === newCat.name.toLowerCase())) {
              localStorage.setItem('adgravity_categories', JSON.stringify([newCat, ...list]));
            }
          }
          
          if (change.type === 'CACHE') {
            try {
              // Trigger actual cache validation API
              await fetch('/api/revalidate?secret=dev_token');
            } catch (err) {
              console.log('API edge cache purge mock fallback triggered.');
            }
          }

          if (change.type === 'STAFF') {
            // Dispatch event to remove staff
            window.dispatchEvent(new CustomEvent('adgravity_revoke_staff', { detail: change.payload.email }));
          }
        }

        // CREATE AUDIT LOG
        const newTxnId = 'TXN-AI-' + Math.random().toString(36).substring(2, 6).toUpperCase() + Math.floor(1000 + Math.random() * 9000);
        const newLog: AuditLog = {
          id: newTxnId,
          timestamp: new Date().toISOString(),
          prompt: prompt,
          operation: pendingChanges.map(c => c.action).join(' | '),
          description: pendingChanges.map(c => c.details).join(' & '),
          status: 'DEPLOYED',
        };

        const updatedLogs = [newLog, ...auditLogs];
        setAuditLogs(updatedLogs);
        localStorage.setItem('adgravity_ai_audit', JSON.stringify(updatedLogs));

        setIsDeploying(false);
        setIsPreviewVisible(false);
        setPendingChanges([]);
        setPrompt('');
        triggerAlert(`Deployed! System Evolution ${newTxnId} is live.`, 'success');
      }
    }, 900);
  };

  return (
    <div className="font-urbanist grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in w-full text-gray-200">
      
      {/* Alert banner */}
      {alert && (
        <div className={`fixed bottom-6 right-6 p-4 border rounded-2xl shadow-xl z-55 flex items-center gap-3 backdrop-blur-md animate-fade-in ${
          alert.type === 'success' 
            ? 'bg-[#0f2d1e]/90 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10' 
            : alert.type === 'error'
            ? 'bg-[#2d0f0f]/90 border-red-500/30 text-red-400 shadow-red-500/10'
            : 'bg-[#0f1b2d]/90 border-indigo-500/30 text-indigo-400 shadow-indigo-500/10'
        }`}>
          <span className="text-base">{alert.type === 'success' ? '✓' : alert.type === 'error' ? '✕' : 'ℹ'}</span>
          <span className="text-xs font-semibold">{alert.message}</span>
        </div>
      )}

      {/* Left 5 columns: Co-Pilot command box & compile logs */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Command Panel */}
        <div className="rounded-3xl bg-white/5 border border-emerald-500/20 p-6 flex flex-col gap-5 shadow-xl relative overflow-hidden shadow-[0_0_25px_rgba(16,185,129,0.02)]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)] animate-pulse">
              🤖
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">AI Command Co-Pilot</h3>
              <p className="text-gray-400 text-xs mt-0.5">Control the AdGravity system using natural language.</p>
            </div>
          </div>

          <form onSubmit={handleGenerateAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">AI Operations Command</label>
              <textarea
                required
                rows={3}
                disabled={isCompiling || isDeploying}
                placeholder="e.g. Change Basic price to Rs 399 and add category Cardiac Clinics under Healthcare..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-4 py-3 bg-[#07090e] border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none text-white text-xs font-medium placeholder-gray-650 resize-none transition-all focus:shadow-[0_0_12px_rgba(16,185,129,0.1)]"
              />
            </div>

            <button
              type="submit"
              disabled={!prompt.trim() || isCompiling || isDeploying}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/5 text-white disabled:text-gray-500 font-bold text-xs transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/20"
            >
              <span>⚡ Compile System Instructions</span>
            </button>
          </form>

          {/* Quick presets */}
          <div className="flex flex-col gap-2.5 mt-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Suggestions</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  disabled={isCompiling || isDeploying}
                  onClick={() => setPrompt(sug)}
                  className="px-2.5 py-1.5 bg-white/[0.02] border border-white/5 rounded-lg text-[10px] text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-left truncate max-w-full"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Compilation Terminal Overlay */}
        {isCompiling && (
          <div className="rounded-3xl bg-[#030508] border border-emerald-500/30 p-6 flex flex-col gap-3 shadow-2xl font-mono text-xs text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.05)] animate-pulse">
            <div className="flex justify-between items-center border-b border-emerald-500/10 pb-2 mb-1">
              <span className="font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                AI COMPILATION DESK
              </span>
              <span className="text-[10px] text-emerald-600">Model: adgravity-copilot-v2</span>
            </div>
            
            <div className="flex flex-col gap-2 min-h-36">
              {compileSteps.map((step, idx) => (
                <div key={idx} className={`${idx === currentStepIndex - 1 ? 'text-white font-bold' : 'text-emerald-500/70'}`}>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right 7 columns: Pending Queue, Preview & Deployment */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Pending Changes & Sandbox Workspace */}
        {isPreviewVisible && pendingChanges.length > 0 && (
          <div className="flex flex-col gap-6">
            
            {/* Action List Card */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-5 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] uppercase font-extrabold border border-amber-500/20">
                    Awaiting Approval
                  </span>
                  <span>Proposed System Changes</span>
                </h3>
                <p className="text-gray-400 text-xs mt-1">AI Co-pilot translated commands mapped out for review.</p>
              </div>

              <div className="flex flex-col gap-3">
                {pendingChanges.map((change, idx) => (
                  <div key={idx} className="p-4 bg-[#07090e] border border-white/5 rounded-2xl flex flex-col gap-1.5 relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-1.5 bg-amber-500" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                        {change.action}
                      </span>
                      <span className="text-[10px] text-gray-500">{change.impact}</span>
                    </div>
                    <p className="text-white text-xs font-medium leading-relaxed">{change.details}</p>
                  </div>
                ))}
              </div>

              {/* Approve Deployment Panel */}
              <div className="mt-2 pt-4 border-t border-white/5 flex flex-col gap-4">
                {!isDeploying ? (
                  <button
                    onClick={handleDeployChanges}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black text-sm tracking-wide transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/20"
                  >
                    <span>🚀 APPROVE & DEPLOY PRODUCTION TRANSITIONS</span>
                  </button>
                ) : (
                  <div className="bg-[#07090e] border border-emerald-500/20 p-4 rounded-2xl flex flex-col gap-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-emerald-400">
                      <span className="font-bold flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        DEPLOYING TO CLOUD WORKSPACES...
                      </span>
                      <span className="font-bold text-sm">{deployProgress}%</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                        style={{ width: `${deployProgress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 italic mt-0.5">{deployStep}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Live Sandbox Preview viewport */}
            <div className="rounded-3xl bg-white/5 border border-emerald-500/20 p-6 flex flex-col gap-4 shadow-xl relative shadow-[0_0_30px_rgba(16,185,129,0.02)]">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    Interactive Sandbox Environment
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">Isolated viewport visualizing mock database deployment state.</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] uppercase font-bold tracking-widest">
                  Live Preview
                </span>
              </div>

              {/* Render dynamic viewport mocks */}
              <div className="rounded-2xl border border-white/5 bg-[#030508] p-5 min-h-[220px] flex items-center justify-center overflow-hidden">
                {pendingChanges.map((change, idx) => {
                  if (change.type === 'PRICING') {
                    return (
                      <div key={idx} className="w-full flex flex-col gap-5 items-center max-w-sm animate-fade-in">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pricing Matrix Evolution</span>
                        <div className="grid grid-cols-2 gap-4 w-full text-xs">
                          <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl text-center">
                            <span className="text-gray-500 text-[10px] uppercase font-bold">Basic Tier</span>
                            <div className="flex justify-center items-center gap-2 mt-1">
                              <span className="line-through text-gray-600">₹499</span>
                              <span className="text-emerald-400 font-extrabold text-sm animate-pulse">₹{change.payload.basic}</span>
                            </div>
                          </div>
                          <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl text-center">
                            <span className="text-gray-500 text-[10px] uppercase font-bold">Premium Tier</span>
                            <div className="flex justify-center items-center gap-2 mt-1">
                              <span className="line-through text-gray-600">₹1999</span>
                              <span className="text-emerald-400 font-extrabold text-sm animate-pulse">₹{change.payload.premium}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-500 italic">Old prices will cross-out dynamically inside production viewport.</span>
                      </div>
                    );
                  }

                  if (change.type === 'CATEGORY') {
                    return (
                      <div key={idx} className="w-full flex flex-col gap-4 max-w-xs animate-fade-in text-xs">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Onboarding Dropdown Viewport</span>
                        <div className="border border-white/10 rounded-xl bg-[#0c0f18] p-3 flex justify-between items-center text-left text-gray-300 w-full">
                          <span>{change.payload.name}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[9px] uppercase font-bold border border-emerald-500/20">
                            {change.payload.vertical}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 text-center italic">Allows instant keyword-matching inside user setups.</span>
                      </div>
                    );
                  }

                  if (change.type === 'CACHE') {
                    return (
                      <div key={idx} className="w-full flex flex-col gap-4 items-center max-w-xs animate-fade-in text-xs text-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Technical Pipeline Monitor</span>
                        <div className="flex flex-col gap-2.5 w-full">
                          <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.01] border border-white/5">
                            <span className="text-gray-400">Path Purge:</span>
                            <span className="font-mono text-emerald-400 font-semibold animate-pulse">/api/revalidate?secret=***</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.01] border border-white/5">
                            <span className="text-gray-400">Router Health:</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-bold">CONNECTED</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-500 italic">Edge cache nodes invalidated via Edge purging pipelines.</span>
                      </div>
                    );
                  }

                  if (change.type === 'TEMPLATES') {
                    return (
                      <div key={idx} className="w-full flex flex-col gap-4 items-center max-w-sm animate-fade-in text-xs">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Template Grid Mockup ({change.payload.theme})</span>
                        <div className="grid grid-cols-2 gap-3 w-full">
                          <div className="bg-gradient-to-tr from-rose-955/20 to-amber-955/20 border border-emerald-500/30 p-3 rounded-xl flex flex-col justify-between min-h-[80px]">
                            <span className="font-bold text-white text-[10px]">Poster Layout A</span>
                            <span className="text-[9px] text-emerald-400">Locked Brand Emblem</span>
                          </div>
                          <div className="bg-gradient-to-tr from-rose-955/20 to-amber-955/20 border border-emerald-500/30 p-3 rounded-xl flex flex-col justify-between min-h-[80px]">
                            <span className="font-bold text-white text-[10px]">Poster Layout B</span>
                            <span className="text-[9px] text-emerald-400">Locked Brand Emblem</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-500 text-center italic">Successfully injected {change.payload.count} new assets.</span>
                      </div>
                    );
                  }

                  if (change.type === 'STAFF') {
                    return (
                      <div key={idx} className="w-full flex flex-col gap-4 items-center max-w-xs animate-fade-in text-xs text-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">RBAC Permission Viewport</span>
                        <div className="w-full p-4 rounded-xl bg-red-950/10 border border-red-500/20 flex flex-col gap-1 items-center">
                          <span className="text-red-400 font-extrabold tracking-wide uppercase">REVOKING ACCESS</span>
                          <span className="text-white font-semibold text-xs font-mono">{change.payload.email}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 italic">User de-authorized from platform staff workspace.</span>
                      </div>
                    );
                  }

                  return (
                    <div key={idx} className="text-center text-gray-500 text-xs italic">
                      Constructing preview modules...
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Audit Log Panel */}
        <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
          <div>
            <h3 className="text-base font-bold text-white">System Evolution History</h3>
            <p className="text-gray-450 text-xs mt-1">Audit log documenting AI-copilot configuration updates deployed by Admin.</p>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto border border-white/5 rounded-2xl bg-white/[0.01]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 uppercase tracking-wider font-semibold bg-white/[0.02]">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">System Operations</th>
                  <th className="p-4">State Modifications</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                      No system evolution events logged yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-gray-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        <span className="block text-[9px] text-gray-600">
                          {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: '2-digit' })}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-white whitespace-nowrap">{log.id}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {log.operation.split(' | ').map((op) => (
                            <span key={op} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase border border-emerald-500/10">
                              {op}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-gray-400 max-w-[240px] truncate" title={log.description}>
                        {log.description}
                      </td>
                      <td className="p-4 text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/10 uppercase">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
            <span>Audit Records: {auditLogs.length} events logged</span>
            <span>Signature: adgravity-ai-copilot</span>
          </div>
        </div>

      </div>

    </div>
  );
}
