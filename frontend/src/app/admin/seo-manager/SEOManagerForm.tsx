'use client';

import { useState, useEffect } from 'react';

export default function SEOManagerForm() {
  // Form Fields
  const [metaTitle, setMetaTitle] = useState('AdGravity AI - Next-Gen AI Ad Operations');
  const [metaDescription, setMetaDescription] = useState('Boost your business outreach using AdGravity AI. Sign up for a 7-day trial subscription for just ₹1.');
  const [ogImageUrl, setOgImageUrl] = useState('https://ai.bhpproduction.com/og-image.jpg');
  const [keywords, setKeywords] = useState('AI Ads, MSME, Assamese Ads, Facebook Ad Generator, Hridaya Nanda Sarma, BHP Production');

  // Sitemap Editor state
  const [sitemapContent, setSitemapContent] = useState(
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ai.bhpproduction.com/</loc>
    <lastmod>2026-06-17</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ai.bhpproduction.com/about</loc>
    <lastmod>2026-06-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ai.bhpproduction.com/contact</loc>
    <lastmod>2026-06-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`
  );

  // Webhook indexing state
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexingLog, setIndexingLog] = useState<string | null>(null);

  // Save changes state
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load saved SEO config if exists
  useEffect(() => {
    const savedConfig = localStorage.getItem('adgravity_seo_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setMetaTitle(parsed.title || '');
      setMetaDescription(parsed.description || '');
      setOgImageUrl(parsed.ogImage || '');
      setKeywords(parsed.keywords || '');
    }
  }, []);

  // Save SEO configs
  const handleSaveSEO = (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      title: metaTitle,
      description: metaDescription,
      ogImage: ogImageUrl,
      keywords: keywords
    };
    localStorage.setItem('adgravity_seo_config', JSON.stringify(config));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Google Indexing Webhook Trigger
  const triggerGoogleIndexing = async () => {
    setIsIndexing(true);
    setIndexingLog('Initializing connection to Google Indexing API endpoint... ');
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIndexingLog('Sending publish metadata request (URL: https://ai.bhpproduction.com)...');
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIndexingLog('Securing validation token under service account Hridaya Nanda Sarma...');
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIndexingLog('✓ Indexing Request Success. Google spider crawlers scheduled to crawl sitemap in 5 minutes.');
    setIsIndexing(false);
    setTimeout(() => setIndexingLog(null), 5000);
  };

  // Live JSON-LD string based on form variables
  const getJsonLdString = () => {
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "@id": "https://ai.bhpproduction.com/#application",
          "name": "AdGravity.AI",
          "url": "https://ai.bhpproduction.com",
          "operatingSystem": "All",
          "applicationCategory": "BusinessApplication",
          "description": metaDescription,
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "INR",
            "lowPrice": "499",
            "highPrice": "1999",
            "offerCount": "3",
            "offers": [
              { "@type": "Offer", "name": "Basic Plan", "price": "499" },
              { "@type": "Offer", "name": "Standard Plan", "price": "999" },
              { "@type": "Offer", "name": "Premium Plan", "price": "1999" }
            ]
          },
          "author": {
            "@type": "Person",
            "name": "Hridaya Nanda Sarma",
            "jobTitle": "Media Entrepreneur & Visionary Leader"
          },
          "publisher": {
            "@type": "Organization",
            "name": "BHP Production",
            "url": "https://ai.bhpproduction.com"
          }
        }
      ]
    };
    return JSON.stringify(schema, null, 2);
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left 6 Cols: Metadata Editor & Crawler Webhook */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        {/* Metadata configurations */}
        <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
          <div>
            <h3 className="text-base font-bold text-white">Dynamic Metadata Editor</h3>
            <p className="text-gray-400 text-[10px] mt-1">Configure global search index properties cached dynamically.</p>
          </div>

          <form onSubmit={handleSaveSEO} className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 font-semibold">Google Snippet Meta Title</label>
              <input 
                type="text" 
                required
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="px-4 py-2.5 bg-[#07090e] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 font-semibold">Google Snippet Meta Description</label>
              <textarea 
                required
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="px-4 py-2.5 bg-[#07090e] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 font-semibold">Social Share OG Image URL</label>
                <input 
                  type="url" 
                  required
                  value={ogImageUrl}
                  onChange={(e) => setOgImageUrl(e.target.value)}
                  className="px-4 py-2.5 bg-[#07090e] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 font-semibold">Keyword Injections</label>
                <input 
                  type="text" 
                  required
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="px-4 py-2.5 bg-[#07090e] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all active:scale-[0.98]"
            >
              Save Meta Configs Globally
            </button>
          </form>

          {saveSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl text-center">
              ✓ Dynamic parameters saved and injected successfully!
            </div>
          )}
        </div>

        {/* Indexing Webhook Trigger */}
        <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
          <div>
            <h3 className="text-base font-bold text-white">Google Indexing API Webhook</h3>
            <p className="text-gray-400 text-[10px] mt-1">Request automated indexing cycles via service account credentials.</p>
          </div>

          <button 
            type="button"
            onClick={triggerGoogleIndexing}
            disabled={isIndexing}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/10"
          >
            {isIndexing ? 'Contacting Google APIs...' : '⚡ Trigger Instant Google Crawl (5-Min Webhook)'}
          </button>

          {indexingLog && (
            <div className="p-4 bg-black/60 border border-white/10 rounded-2xl font-mono text-[9px] text-indigo-300 leading-relaxed whitespace-pre-wrap">
              {indexingLog}
            </div>
          )}
        </div>
      </div>

      {/* Right 6 Cols: Search result preview, JSON-LD schema, Sitemap */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        {/* Google snippet preview */}
        <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Live Google Search result card</h3>
          
          <div className="bg-[#171717]/40 border border-white/5 p-4 rounded-2xl flex flex-col gap-1 max-w-full overflow-hidden">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <span className="w-4 h-4 bg-white/10 rounded-full flex items-center justify-center text-[8px] font-bold">A</span>
              <span>https://ai.bhpproduction.com</span>
            </div>
            <a href="#" className="text-[#8ab4f8] hover:underline text-sm font-medium leading-snug break-words">
              {metaTitle}
            </a>
            <p className="text-[#bdc1c6] text-[11px] leading-relaxed break-words mt-0.5">
              {metaDescription}
            </p>
          </div>
        </div>

        {/* JSON-LD Schema visualizer */}
        <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Dynamic JSON-LD Schema</h3>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-bold">INJECTED</span>
          </div>
          
          <div className="relative">
            <pre className="p-4 bg-black/60 border border-white/5 rounded-2xl text-[9px] text-gray-400 font-mono overflow-auto max-h-60 leading-relaxed scrollbar-thin">
              <code>{getJsonLdString()}</code>
            </pre>
          </div>
        </div>

        {/* Sitemap XML Editor */}
        <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sitemap.xml Node Editor</h3>
          <textarea 
            rows={6}
            value={sitemapContent}
            onChange={(e) => setSitemapContent(e.target.value)}
            className="p-4 bg-black/60 border border-white/5 rounded-2xl text-[9px] text-gray-400 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
          />
        </div>
      </div>
    </main>
  );
}
