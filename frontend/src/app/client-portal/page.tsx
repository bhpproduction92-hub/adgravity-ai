'use client';

import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Home() {
  // Form states
  const [userId, setUserId] = useState('user_' + Math.random().toString(36).substring(2, 9));
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState('Cafe');
  const [metaPageToken, setMetaPageToken] = useState('EAAbwY7b43...mocktoken');
  
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

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
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
      // Automatically refresh the queue/status details
      fetchStatus();
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend server. Make sure it is running on port 4000.');
      setPaymentStep('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Premium Navbar */}
      <header style={{
        borderBottom: '1px solid var(--md-sys-color-outline-variant)',
        backgroundColor: 'var(--md-sys-color-surface)',
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--md-shape-corner-small)',
              backgroundColor: 'var(--md-sys-color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--md-sys-color-on-primary)',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}>
              A
            </div>
            <span style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--md-sys-color-primary)' }}>
              AdGravity <span style={{ fontWeight: 300, color: 'var(--md-sys-color-on-background)' }}>AI</span>
            </span>
          </div>
          <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <a href="#trial-form" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Setup Trial</a>
            <a href="#queue-preview" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Content Queue</a>
            <button className="btn btn-outlined" onClick={fetchStatus} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Refresh Status</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '60px 0 40px 0', background: 'radial-gradient(circle at 90% 10%, var(--md-sys-color-primary-container) 0%, transparent 60%)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--md-sys-color-primary-container)',
              color: 'var(--md-sys-color-on-primary-container)',
              padding: '6px 16px',
              borderRadius: 'var(--md-shape-corner-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '24px'
            }}>
              🚀 Verified Supabase Connection
            </div>
            <h1 style={{ fontSize: '3.2rem', lineHeight: 1.1, marginBottom: '20px', color: 'var(--md-sys-color-primary)' }}>
              Target Local Buyers Automatically.
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.6, marginBottom: '32px' }}>
              Select your business sector (Cafe, Pharmacy, etc.), import your Meta page token, and view pending AI content and generated images inside the admin approval queue.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#trial-form" className="btn btn-primary">Start Trial for ₹1</a>
              <a href="#queue-preview" className="btn btn-secondary">Review Content Queue</a>
            </div>
          </div>

          <div className="card card-elevated" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Active Database Rules</h3>
            <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.9rem', marginBottom: '24px' }}>
              PostgreSQL schema status
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: 'var(--md-shape-corner-small)', backgroundColor: 'var(--md-sys-color-surface-container)' }}>
                <span>users Table</span>
                <span style={{ fontWeight: 600, color: 'var(--md-sys-color-primary)', fontSize: '0.85rem' }}>RLS Enabled</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: 'var(--md-shape-corner-small)', backgroundColor: 'var(--md-sys-color-surface-container)' }}>
                <span>subscriptions Table</span>
                <span style={{ fontWeight: 600, color: 'var(--md-sys-color-primary)', fontSize: '0.85rem' }}>₹1 Trial Configured</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: 'var(--md-shape-corner-small)', backgroundColor: 'var(--md-sys-color-surface-container)' }}>
                <span>content_queue Table</span>
                <span style={{ fontWeight: 600, color: 'var(--md-sys-color-tertiary)', fontSize: '0.85rem' }}>Admin Approvals Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trial Activation Area */}
      <section id="trial-form" style={{ padding: '60px 0', backgroundColor: 'var(--md-sys-color-surface-container)' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <div className="card card-elevated" style={{ border: '1px solid var(--md-sys-color-primary)' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--md-sys-color-primary)' }}>AdGravity AI Setup Form</h2>
              <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.95rem' }}>
                Create your user profile, register your business, and activate your 7-day trial.
              </p>
            </div>

            <form onSubmit={handleRegisterTrial}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">User ID (Simulated Auth)</label>
                  <input 
                    type="text" 
                    className="input-control" 
                    value={userId} 
                    onChange={(e) => setUserId(e.target.value)} 
                    required 
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">User Full Name</label>
                  <input 
                    type="text" 
                    className="input-control" 
                    placeholder="Jane Doe" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <input 
                    type="email" 
                    className="input-control" 
                    placeholder="jane@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Business Category</label>
                  <select 
                    className="input-control" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Cafe">Cafe / Restaurant</option>
                    <option value="Pharmacy">Pharmacy / Health Store</option>
                    <option value="SaaS">SaaS Platform</option>
                    <option value="Retail">Retail Shop</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Company Name</label>
                <input 
                  type="text" 
                  className="input-control" 
                  placeholder="Green Cafe & Co" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="input-label" style={{ margin: 0 }}>Meta Page Access Token</label>
                  <button 
                    type="button" 
                    className="btn btn-outlined" 
                    onClick={() => setIsOAuthOpen(true)}
                    style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--md-shape-corner-small)' }}
                  >
                    Connect Facebook
                  </button>
                </div>
                <input 
                  type="text" 
                  className="input-control" 
                  value={metaPageToken}
                  onChange={(e) => setMetaPageToken(e.target.value)}
                  required
                />
              </div>

              <div style={{
                backgroundColor: 'var(--md-sys-color-surface-container)',
                padding: '16px',
                borderRadius: 'var(--md-shape-corner-medium)',
                marginBottom: '24px',
                border: '1px dashed var(--md-sys-color-outline-variant)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>7-Day Trial Subscription Access</span>
                  <strong>₹1.00</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  <span>Currency / Billing Code</span>
                  <span>INR (₹)</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '16px' }}
                disabled={loading}
              >
                {loading ? 'Processing payment...' : 'Start Trial for ₹1'}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: 'var(--md-sys-color-error-container)',
                color: 'var(--md-sys-color-on-error-container)',
                borderRadius: 'var(--md-shape-corner-medium)',
                fontSize: '0.9rem',
                border: '1px solid var(--md-sys-color-error)'
              }}>
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Success Message */}
            {response && (
              <div style={{
                marginTop: '24px',
                padding: '20px',
                backgroundColor: 'var(--md-sys-color-tertiary-container)',
                color: 'var(--md-sys-color-on-tertiary-container)',
                borderRadius: 'var(--md-shape-corner-medium)',
                fontSize: '0.95rem',
                border: '1px solid var(--md-sys-color-tertiary)'
              }}>
                <h4 style={{ marginBottom: '8px', color: 'var(--md-sys-color-on-tertiary-container)' }}>🎉 Trial Activated & Connected!</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', marginTop: '12px' }}>
                  <div><strong>Subscription ID:</strong> {response.subscription.id}</div>
                  <div><strong>Plan type:</strong> {response.subscription.plan_type}</div>
                  <div><strong>Status:</strong> {response.subscription.status}</div>
                  <div><strong>Next Billing Date:</strong> {new Date(response.subscription.next_billing_date).toLocaleDateString()}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI Ad Copy Generator Form */}
      <section id="ad-generator" style={{ padding: '60px 0', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <div className="card card-elevated">
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--md-sys-color-primary)' }}>Core AI Content Engine</h2>
              <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.95rem' }}>
                Generate bilingual ad campaigns with Gemini 1.5 Flash.
              </p>
            </div>

            <form onSubmit={handleGenerateContent}>
              <div className="input-group">
                <label className="input-label">Niche / Category</label>
                <input 
                  type="text" 
                  className="input-control" 
                  value={category} 
                  disabled 
                  style={{ backgroundColor: 'var(--md-sys-color-surface-container)', color: 'var(--md-sys-color-outline)' }}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-outline)', marginTop: '4px' }}>
                  Category is linked to your business profile above.
                </span>
              </div>

              <div className="input-group">
                <label className="input-label">Promotion / Offer Details</label>
                <textarea 
                  className="input-control" 
                  rows={4}
                  placeholder="e.g. 50% discount on all cakes this Friday afternoon from 2 PM to 5 PM!"
                  value={offerDetails}
                  onChange={(e) => setOfferDetails(e.target.value)}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '16px' }}
                disabled={generatingContent}
              >
                {generatingContent ? 'Generating captions via Gemini...' : 'Generate AI Ad Captions'}
              </button>
            </form>

            {/* Generation Success Banner */}
            {generationSuccess && (
              <div style={{
                marginTop: '24px',
                padding: '20px',
                backgroundColor: 'var(--md-sys-color-primary-container)',
                color: 'var(--md-sys-color-on-primary-container)',
                borderRadius: 'var(--md-shape-corner-medium)',
                border: '1px solid var(--md-sys-color-primary)'
              }}>
                <h4 style={{ marginBottom: '12px', color: 'var(--md-sys-color-on-primary-container)' }}>✨ Generated Captions:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--md-sys-color-primary)', marginBottom: '4px' }}>English version:</strong>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{generationSuccess.caption_en}</p>
                  </div>
                  <div style={{ borderTop: '1px dashed var(--md-sys-color-outline-variant)', paddingTop: '12px' }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--md-sys-color-tertiary)', marginBottom: '4px' }}>Assamese transcreation:</strong>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{generationSuccess.caption_as}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Generation Error Banner */}
            {generationError && (
              <div style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: 'var(--md-sys-color-error-container)',
                color: 'var(--md-sys-color-on-error-container)',
                borderRadius: 'var(--md-shape-corner-medium)',
                fontSize: '0.9rem',
                border: '1px solid var(--md-sys-color-error)'
              }}>
                <strong>Error generating content:</strong> {generationError}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Queue Approval Queue Dashboard */}
      <section id="queue-preview" style={{ padding: '60px 0 100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--md-sys-color-primary)' }}>AI Content Queue Approval List</h2>
            <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              Review the posts and images compiled by the AdGravity AI engine.
            </p>
          </div>

          {queueItems.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <p style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '16px' }}>
                No active items found in the queue for User: <code>{userId}</code>.
              </p>
              <button className="btn btn-outlined" onClick={fetchStatus} disabled={loadingQueue}>
                {loadingQueue ? 'Fetching queue...' : 'Mock Query Queue'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {queueItems.map((item: any) => (
                <div key={item.id} className="card card-elevated" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-outline)' }}>ID: {item.id.slice(0, 8)}...</span>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        backgroundColor: item.status === 'pending' ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-tertiary-container)',
                        color: item.status === 'pending' ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-tertiary-container)',
                        padding: '2px 8px',
                        borderRadius: 'var(--md-shape-corner-full)'
                      }}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 style={{ marginBottom: '8px' }}>Prompt:</h4>
                    <p style={{ fontSize: '0.9rem', marginBottom: '16px', fontStyle: 'italic' }}>"{item.prompt}"</p>
                    <h4 style={{ marginBottom: '8px' }}>AI Generated Copy:</h4>
                    {(() => {
                      const parsed = parseContent(item.ai_content);
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                          <div>
                            <strong style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-primary)', display: 'block', marginBottom: '2px' }}>English Caption:</strong>
                            <p style={{ fontSize: '0.95rem', color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.5 }}>
                              {parsed.caption_en}
                            </p>
                          </div>
                          {parsed.caption_as && (
                            <div>
                              <strong style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-tertiary)', display: 'block', marginBottom: '2px' }}>Assamese transcreation:</strong>
                              <p style={{ fontSize: '0.95rem', color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.5 }}>
                                {parsed.caption_as}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    {item.image_url && (
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ marginBottom: '8px' }}>Generated Image Link:</h4>
                        <a href={item.image_url} target="_blank" rel="noreferrer" style={{ color: 'var(--md-sys-color-primary)', fontSize: '0.9rem', textDecoration: 'underline' }}>
                          View Image Asset
                        </a>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px', borderTop: '1px solid var(--md-sys-color-outline-variant)', paddingTop: '16px' }}>
                    <button className="btn btn-primary" style={{ flex: 1, padding: '10px' }}>Approve</button>
                    <button className="btn btn-outlined" style={{ flex: 1, padding: '10px' }}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 0',
        backgroundColor: 'var(--md-sys-color-surface)',
        borderTop: '1px solid var(--md-sys-color-outline-variant)',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: 'var(--md-sys-color-on-surface-variant)'
      }}>
        <div className="container">
          <p>© 2026 AdGravity AI. All rights reserved. Powered by Google Material Design 3 theme.</p>
        </div>
      </footer>

      {/* Mock Payment Overlay */}
      {paymentStep === 'processing' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(14, 16, 20, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}>
          <div className="card card-elevated" style={{
            maxWidth: '420px',
            width: '90%',
            textAlign: 'center',
            padding: '40px 32px',
            backgroundColor: 'var(--md-sys-color-surface)',
            border: '2px solid var(--md-sys-color-primary)',
            boxShadow: 'var(--md-elevation-3)'
          }}>
            {/* Spinning Loader Animation */}
            <div style={{
              width: '56px',
              height: '56px',
              border: '5px solid var(--md-sys-color-primary-container)',
              borderTop: '5px solid var(--md-sys-color-primary)',
              borderRadius: '50%',
              margin: '0 auto 28px auto',
              animation: 'spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite'
            }} />
            
            <h3 style={{ marginBottom: '12px', fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--md-sys-color-primary)' }}>
              Mock Gateway Processing
            </h3>
            <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.95rem', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {paymentMessage}
            </p>
            
            <div style={{
              marginTop: '32px',
              fontSize: '0.8rem',
              color: 'var(--md-sys-color-outline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              Secure sandbox transaction of ₹1.00 INR
            </div>
          </div>
        </div>
      )}

      {/* Mock Facebook OAuth Popup */}
      {isOAuthOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(14, 16, 20, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div className="card card-elevated" style={{
            maxWidth: '460px',
            width: '90%',
            padding: '32px',
            backgroundColor: 'var(--md-sys-color-surface)',
            border: '2px solid #1877f2',
            boxShadow: 'var(--md-elevation-3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#1877f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                fontFamily: 'sans-serif'
              }}>
                f
              </div>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: '#1877f2' }}>
                Meta Login Connection
              </h3>
            </div>

            {oauthStep === 'login' ? (
              <div>
                <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.5 }}>
                  AdGravity AI is requesting permissions to view and publish posts on behalf of your Facebook Pages.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    type="button" 
                    className="btn" 
                    onClick={() => {
                      setOauthStep('select_page');
                    }}
                    style={{ backgroundColor: '#1877f2', color: 'white', padding: '14px' }}
                  >
                    Continue as Meta User
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outlined" 
                    onClick={() => setIsOAuthOpen(false)}
                    style={{ padding: '12px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.9rem', marginBottom: '16px' }}>
                  Select the Page you want to link to AdGravity AI:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {[
                    { name: 'Cafe Delight Guwahati', category: 'Cafe', token: 'EAAbwY7b43_page_token_cafe_delight_guwahati' },
                    { name: 'Assam Medicose', category: 'Pharmacy', token: 'EAAbwY7b43_page_token_assam_medicose' },
                    { name: 'AdGravity AI Tech Page', category: 'SaaS', token: 'EAAbwY7b43_page_token_adgravity_ai_tech' }
                  ].map((page) => (
                    <button
                      key={page.name}
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setMetaPageToken(page.token);
                        setCompanyName(page.name);
                        setCategory(page.category);
                        setIsOAuthOpen(false);
                        setOauthStep('login');
                      }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: 'var(--md-shape-corner-medium)',
                        textAlign: 'left'
                      }}
                    >
                      <span>{page.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-outline)' }}>
                        {page.category}
                      </span>
                    </button>
                  ))}
                </div>
                <button 
                  type="button" 
                  className="btn btn-outlined" 
                  onClick={() => setOauthStep('login')}
                  style={{ width: '100%', padding: '10px' }}
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
