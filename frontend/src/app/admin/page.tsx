'use client';

import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminDashboard() {
  // Login states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [is2FAVisible, setIs2FAVisible] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab state
  const [activeTab, setActiveTab] = useState<'metrics' | 'queue' | 'logs'>('metrics');

  // Backend data states
  const [metrics, setMetrics] = useState<any>({ totalUsers: 0, trialCount: 0, activeCount: 0, totalRevenue: 0 });
  const [pendingQueue, setPendingQueue] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal Editing states
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editCaptionEn, setEditCaptionEn] = useState('');
  const [editCaptionAs, setEditCaptionAs] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

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
      // Poll logs and metrics every 10 seconds for real-time tracking
      const interval = setInterval(loadDashboardData, 10000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Handle Login Credentials submission
  const handleVerifyCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (username === 'admin' && password === 'admin123') {
      setIs2FAVisible(true);
    } else {
      setLoginError('Invalid username or password. Try admin / admin123');
    }
  };

  // Handle 2FA verification code submission
  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (twoFactorCode.length === 6 && /^\d+$/.test(twoFactorCode)) {
      setIsLoggedIn(true);
    } else {
      setLoginError('Invalid 2FA code. Enter any 6-digit verification code.');
    }
  };

  // Parse JSON caption helpers
  const parseContent = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return { caption_en: jsonStr, caption_as: '' };
    }
  };

  // Quick Approval handler
  const handleApproveContent = async (itemId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/content-queue/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });

      if (res.ok) {
        // Refresh listings
        loadDashboardData();
      } else {
        alert('Failed to approve content item.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Edit action opener
  const openEditModal = (item: any) => {
    const parsed = parseContent(item.ai_content);
    setEditingItem(item);
    setEditCaptionEn(parsed.caption_en || '');
    setEditCaptionAs(parsed.caption_as || '');
  };

  // Save changes and approve content
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
          status: 'approved'
        })
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

  // Render Login Gate
  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--md-sys-color-background)',
        padding: '24px'
      }}>
        <div className="card card-elevated" style={{ maxWidth: '400px', width: '100%', border: '1px solid var(--md-sys-color-primary)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--md-shape-corner-medium)',
              backgroundColor: 'var(--md-sys-color-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--md-sys-color-on-primary)',
              fontWeight: 'bold',
              fontSize: '1.4rem',
              marginBottom: '12px'
            }}>
              A
            </div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--md-sys-color-primary)', fontFamily: 'var(--font-heading)' }}>
              AdGravity AI Portal
            </h2>
            <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.9rem', marginTop: '4px' }}>
              God View Administrative Access
            </p>
          </div>

          {!is2FAVisible ? (
            <form onSubmit={handleVerifyCredentials}>
              <div className="input-group">
                <label className="input-label">Username</label>
                <input 
                  type="text" 
                  className="input-control" 
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Password</label>
                <input 
                  type="password" 
                  className="input-control" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                Verify Credentials
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify2FA}>
              <div style={{
                backgroundColor: 'var(--md-sys-color-primary-container)',
                color: 'var(--md-sys-color-on-primary-container)',
                padding: '12px 16px',
                borderRadius: 'var(--md-shape-corner-medium)',
                fontSize: '0.85rem',
                marginBottom: '20px',
                lineHeight: 1.4
              }}>
                🔒 Credentials verified. Please enter the 6-digit Two-Factor Authentication (2FA) verification code.
              </div>
              <div className="input-group">
                <label className="input-label">2FA Code</label>
                <input 
                  type="text" 
                  className="input-control" 
                  maxLength={6}
                  placeholder="123456"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  required
                  style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.25rem' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn btn-outlined" onClick={() => setIs2FAVisible(false)} style={{ flex: 1 }}>
                  Back
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  Verify & Enter
                </button>
              </div>
            </form>
          )}

          {loginError && (
            <div style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: 'var(--md-sys-color-error-container)',
              color: 'var(--md-sys-color-on-error-container)',
              borderRadius: 'var(--md-shape-corner-small)',
              fontSize: '0.85rem',
              border: '1px solid var(--md-sys-color-error)',
              textAlign: 'center'
            }}>
              {loginError}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--md-sys-color-background)' }}>
      {/* Header bar */}
      <header style={{
        borderBottom: '1px solid var(--md-sys-color-outline-variant)',
        backgroundColor: 'var(--md-sys-color-surface)',
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 'bold',
              backgroundColor: 'var(--md-sys-color-error-container)',
              color: 'var(--md-sys-color-on-error-container)',
              padding: '3px 8px',
              borderRadius: 'var(--md-shape-corner-full)'
            }}>
              GOD VIEW
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--md-sys-color-primary)' }}>
              AdGravity AI <span style={{ fontWeight: 300, color: 'var(--md-sys-color-on-background)' }}>Console</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className="btn btn-outlined" onClick={loadDashboardData} style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <button className="btn btn-primary" onClick={() => setIsLoggedIn(false)} style={{ padding: '8px 16px', fontSize: '0.85rem', backgroundColor: 'var(--md-sys-color-outline)' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs navigation bar */}
      <div style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)', backgroundColor: 'var(--md-sys-color-surface-container)' }}>
        <div className="container" style={{ display: 'flex', gap: '8px', padding: '12px 24px' }}>
          <button 
            className={`btn ${activeTab === 'metrics' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('metrics')}
            style={{ borderRadius: 'var(--md-shape-corner-medium)', padding: '10px 20px' }}
          >
            Client Metrics Overview
          </button>
          <button 
            className={`btn ${activeTab === 'queue' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('queue')}
            style={{ borderRadius: 'var(--md-shape-corner-medium)', padding: '10px 20px' }}
          >
            Global Content Queue ({pendingQueue.length})
          </button>
          <button 
            className={`btn ${activeTab === 'logs' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('logs')}
            style={{ borderRadius: 'var(--md-shape-corner-medium)', padding: '10px 20px' }}
          >
            System Logs ({systemLogs.length})
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="container" style={{ padding: '40px 24px' }}>
        
        {/* Tab 1: Client Metrics Overview */}
        {activeTab === 'metrics' && (
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>Client Metrics Overview</h2>
            
            {/* Stats Cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              <div className="card card-elevated" style={{ borderLeft: '4px solid var(--md-sys-color-primary)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 500 }}>TOTAL REGISTERED USERS</span>
                <h3 style={{ fontSize: '2.5rem', marginTop: '8px', color: 'var(--md-sys-color-primary)' }}>{metrics.totalUsers}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-outline)', marginTop: '8px' }}>Synced from auth.users schemas</p>
              </div>

              <div className="card card-elevated" style={{ borderLeft: '4px solid var(--md-sys-color-tertiary)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 500 }}>ACTIVE 7-DAY TRIALS</span>
                <h3 style={{ fontSize: '2.5rem', marginTop: '8px', color: 'var(--md-sys-color-tertiary)' }}>{metrics.trialCount}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-outline)', marginTop: '8px' }}>Trial status (₹1 subscription logic)</p>
              </div>

              <div className="card card-elevated" style={{ borderLeft: '4px solid #ba1a1a' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 500 }}>MOCK REVENUE (INR)</span>
                <h3 style={{ fontSize: '2.5rem', marginTop: '8px', color: '#ba1a1a' }}>₹{metrics.totalRevenue.toFixed(2)}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-outline)', marginTop: '8px' }}>Mock sandbox collection total</p>
              </div>
            </div>

            {/* Simulated target metrics */}
            <div className="card">
              <h4 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Trial Pipeline Projections</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
                  <span>Simulated Conversions Goal (20% conversion rate)</span>
                  <strong>{Math.floor(metrics.trialCount * 0.20)} accounts</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
                  <span>Projected MRR (at ₹4,999/user standard plan)</span>
                  <strong style={{ color: 'var(--md-sys-color-primary)' }}>₹{Math.floor(metrics.trialCount * 0.20 * 4999).toLocaleString()} / month</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Global Content Queue (Pending) */}
        {activeTab === 'queue' && (
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>Global Content Queue</h2>
            <p style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '32px' }}>
              Pending client campaign copy creations requiring admin authorization.
            </p>

            {pendingQueue.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
                <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '1.05rem' }}>
                  🎉 No pending campaigns in queue. All clean!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {pendingQueue.map((item) => {
                  const parsed = parseContent(item.ai_content);
                  return (
                    <div key={item.id} className="card card-elevated">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', borderBottom: '1px solid var(--md-sys-color-outline-variant)', paddingBottom: '12px' }}>
                        <div>
                          <strong style={{ fontSize: '1.1rem', display: 'block', color: 'var(--md-sys-color-primary)' }}>
                            {item.users?.company_name || 'N/A Company'}
                          </strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-outline)' }}>
                            Client Email: {item.users?.email || 'N/A'} | ID: {item.id.slice(0, 8)}
                          </span>
                        </div>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: 'var(--md-sys-color-primary-container)',
                          color: 'var(--md-sys-color-on-primary-container)',
                          padding: '3px 10px',
                          borderRadius: 'var(--md-shape-corner-full)'
                        }}>
                          PENDING APPROVAL
                        </span>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--md-sys-color-outline)', display: 'block', marginBottom: '4px' }}>PROMPT</strong>
                        <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>"{item.prompt}"</p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container)', padding: '16px', borderRadius: 'var(--md-shape-corner-medium)' }}>
                          <strong style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-primary)', display: 'block', marginBottom: '6px' }}>ENGLISH CAPTION</strong>
                          <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{parsed.caption_en}</p>
                        </div>
                        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container)', padding: '16px', borderRadius: 'var(--md-shape-corner-medium)' }}>
                          <strong style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-tertiary)', display: 'block', marginBottom: '6px' }}>ASSAMESE TRANSCREATION</strong>
                          <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{parsed.caption_as}</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-outlined" onClick={() => openEditModal(item)} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                          Edit captions
                        </button>
                        <button className="btn btn-primary" onClick={() => handleApproveContent(item.id)} style={{ padding: '8px 24px', fontSize: '0.85rem' }}>
                          Approve post
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: System Logs stream */}
        {activeTab === 'logs' && (
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>System Logs</h2>
            <p style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '32px' }}>
              Real-time feed of events, payment gateways, and content authorization alerts.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#1e1e1e', color: '#eaeaea', fontFamily: 'monospace', padding: '24px', borderRadius: 'var(--md-shape-corner-large)', boxShadow: 'inset var(--md-elevation-1)', maxHeight: '600px', overflowY: 'auto' }}>
              {systemLogs.length === 0 ? (
                <div style={{ color: '#888', textAlign: 'center', padding: '24px' }}>No system logs recorded yet.</div>
              ) : (
                systemLogs.map((log) => {
                  let color = '#eaeaea'; // info/default
                  if (log.type === 'success') color = '#a3e635'; // green
                  if (log.type === 'error') color = '#f87171'; // red
                  if (log.type === 'warning') color = '#fbbf24'; // yellow

                  return (
                    <div key={log.id} style={{ display: 'flex', gap: '16px', padding: '6px 0', borderBottom: '1px solid #2e2e2e', fontSize: '0.9rem' }}>
                      <span style={{ color: '#888' }}>[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span style={{ color, fontWeight: 'bold' }}>[{log.type.toUpperCase()}]</span>
                      <span style={{ flex: 1, whiteSpace: 'pre-wrap' }}>{log.message}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>

      {/* Edit captions modal popup */}
      {editingItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card card-elevated" style={{ maxWidth: '600px', width: '90%', padding: '32px' }}>
            <h3 style={{ marginBottom: '8px', color: 'var(--md-sys-color-primary)', fontFamily: 'var(--font-heading)', fontSize: '1.5rem' }}>
              Edit & Approve Campaign
            </h3>
            <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Adjust the copies before final authorization and client dispatch.
            </p>

            <form onSubmit={handleSaveAndApprove}>
              <div className="input-group">
                <label className="input-label">English Social Caption</label>
                <textarea 
                  className="input-control" 
                  rows={4}
                  value={editCaptionEn}
                  onChange={(e) => setEditCaptionEn(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Assamese Local Translation</label>
                <textarea 
                  className="input-control" 
                  rows={4}
                  value={editCaptionAs}
                  onChange={(e) => setEditCaptionAs(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" className="btn btn-outlined" onClick={() => setEditingItem(null)} disabled={savingEdit}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingEdit}>
                  {savingEdit ? 'Saving & Approving...' : 'Save & Approve'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
