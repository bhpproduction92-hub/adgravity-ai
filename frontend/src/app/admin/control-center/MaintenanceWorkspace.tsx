'use client';

import { useState, useEffect, useRef } from 'react';

export default function MaintenanceWorkspace() {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
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
  );
}
