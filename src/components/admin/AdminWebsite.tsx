import React, { useState } from 'react';
import { 
  Globe, 
  Sparkles, 
  Search, 
  Layers, 
  Save, 
  Check, 
  AlertCircle,
  Eye,
  Megaphone
} from 'lucide-react';
import { WebsiteContent, SiteSettings } from '../../types';
import { updateWebsiteContent, updateSettings } from '../../utils/api';

interface AdminWebsiteProps {
  initialContent?: WebsiteContent;
  settings: SiteSettings;
  onSaved: () => void;
}

export function AdminWebsite({ initialContent, settings, onSaved }: AdminWebsiteProps) {
  const [subTab, setSubTab] = useState<'homepage' | 'navigation' | 'footer' | 'seo'>('homepage');

  const [content, setContent] = useState<WebsiteContent>({
    heroHeadline: initialContent?.heroHeadline || "Professional On-Site Computer Support in Peshawar",
    heroSubheadline: initialContent?.heroSubheadline || "Don't disconnect cables and waste hours in traffic. We come to your home or office with diagnostic tools, Windows setup media, SSD upgrades, and honest solutions.",
    announcementActive: initialContent?.announcementActive !== false,
    announcementText: initialContent?.announcementText || "⚡ Urgent same-day on-site computer diagnostics available across University Town, Hayatabad, Cantt & Saddar.",
    ctaButtonText: initialContent?.ctaButtonText || "Book On-Site Service",
    metaTitle: initialContent?.metaTitle || "Peshawar On-Site Computer Support | Windows & PC Troubleshooting",
    metaDescription: initialContent?.metaDescription || "Professional on-site computer support, Windows setup, SSD upgrades, BSOD troubleshooting, and data recovery assistance delivered at your home or office in Peshawar.",
    metaKeywords: initialContent?.metaKeywords || "computer repair peshawar, windows installation peshawar, ssd upgrade, on-site pc technician hayatabad, university town",
    footerBio: initialContent?.footerBio || "Independent on-site technical assistance by Safiullah — Computer Science & Cybersecurity practitioner in Peshawar.",
    disclaimerText: initialContent?.disclaimerText || "Windows is a registered trademark of Microsoft Corporation. We operate as an independent on-site computer support provider in Peshawar."
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      await updateWebsiteContent(content);
      setSuccessMsg("Website content and settings successfully saved!");
      onSaved();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save website content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />
            Website & CMS Content Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Modify text, banners, footers and search engine tags dynamically without editing code.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSubTab('homepage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              subTab === 'homepage' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Homepage
          </button>
          <button
            onClick={() => setSubTab('navigation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              subTab === 'navigation' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Navigation
          </button>
          <button
            onClick={() => setSubTab('footer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              subTab === 'footer' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Footer
          </button>
          <button
            onClick={() => setSubTab('seo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              subTab === 'seo' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            SEO
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: HOMEPAGE */}
        {subTab === 'homepage' && (
          <div className="space-y-6">
            {/* Urgent Announcement Banner */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Top Urgent Announcement Banner</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.announcementActive}
                    onChange={(e) => setContent({ ...content, announcementActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-xs font-medium text-slate-300">
                    {content.announcementActive ? 'Visible on site' : 'Hidden'}
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Banner Announcement Text</label>
                <input
                  type="text"
                  value={content.announcementText || ''}
                  onChange={(e) => setContent({ ...content, announcementText: e.target.value })}
                  placeholder="e.g. ⚡ Urgent same-day on-site computer diagnostics available across Peshawar"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {content.announcementActive && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                  <span className="font-bold">Live Preview:</span> {content.announcementText}
                </div>
              )}
            </div>

            {/* Hero Section Copy */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                Hero Section Headline & Subtitle
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Main Headline</label>
                  <input
                    type="text"
                    value={content.heroHeadline || ''}
                    onChange={(e) => setContent({ ...content, heroHeadline: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Subheadline</label>
                  <textarea
                    rows={3}
                    value={content.heroSubheadline || ''}
                    onChange={(e) => setContent({ ...content, heroSubheadline: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Primary CTA Button Label</label>
                    <input
                      type="text"
                      value={content.ctaButtonText || ''}
                      onChange={(e) => setContent({ ...content, ctaButtonText: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Visit Fee Starting Rate</label>
                    <input
                      type="text"
                      value={settings.visitFeeStarting || ''}
                      onChange={(e) => updateSettings({ visitFeeStarting: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NAVIGATION */}
        {subTab === 'navigation' && (
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-400" />
              Header Navigation & Brand Identity
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Display Business Name</label>
                <input
                  type="text"
                  value={settings.businessName || ''}
                  onChange={(e) => updateSettings({ businessName: e.target.value })}
                  placeholder="Peshawar On-Site Computer Support"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Navbar Tagline</label>
                <input
                  type="text"
                  value={settings.tagline || ''}
                  onChange={(e) => updateSettings({ tagline: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-2">
                <div className="font-semibold text-slate-300">Public Page Links Configured:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                  <span className="p-2 rounded bg-slate-900">/services</span>
                  <span className="p-2 rounded bg-slate-900">/how-it-works</span>
                  <span className="p-2 rounded bg-slate-900">/why-on-site</span>
                  <span className="p-2 rounded bg-slate-900">/who-we-serve</span>
                  <span className="p-2 rounded bg-slate-900">/bulk-windows</span>
                  <span className="p-2 rounded bg-slate-900">/technician</span>
                  <span className="p-2 rounded bg-slate-900">/faq</span>
                  <span className="p-2 rounded bg-slate-900">/contact</span>
                </div>
                <p className="text-[11px] text-slate-500">All public links are interconnected and automatically respect active services and FAQ counts.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FOOTER */}
        {subTab === 'footer' && (
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Footer Copy & Legal Disclaimers</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Footer Short Bio</label>
                <textarea
                  rows={3}
                  value={content.footerBio || ''}
                  onChange={(e) => setContent({ ...content, footerBio: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Independent Trademark Disclaimer</label>
                <textarea
                  rows={2}
                  value={content.disclaimerText || ''}
                  onChange={(e) => setContent({ ...content, disclaimerText: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SEO */}
        {subTab === 'seo' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-400" />
                Search Engine Optimization (SEO) Meta Tags
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Page Title</label>
                  <input
                    type="text"
                    value={content.metaTitle || ''}
                    onChange={(e) => setContent({ ...content, metaTitle: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Recommended length: 50–60 characters ({content.metaTitle?.length || 0} chars)</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Description</label>
                  <textarea
                    rows={3}
                    value={content.metaDescription || ''}
                    onChange={(e) => setContent({ ...content, metaDescription: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Recommended length: 140–160 characters ({content.metaDescription?.length || 0} chars)</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Keywords (Comma separated)</label>
                  <input
                    type="text"
                    value={content.metaKeywords || ''}
                    onChange={(e) => setContent({ ...content, metaKeywords: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Google Search Live Preview */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Eye className="h-4 w-4 text-blue-400" />
                Google Search Result Preview
              </div>
              <div className="p-4 rounded-xl bg-white text-slate-900 max-w-xl space-y-1 shadow-md">
                <div className="text-[11px] text-emerald-800">https://peshawartechsupport.pk › on-site-pc</div>
                <div className="text-base text-blue-800 hover:underline font-medium cursor-pointer leading-snug">
                  {content.metaTitle || 'Peshawar On-Site Computer Support'}
                </div>
                <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {content.metaDescription || 'Professional on-site computer support in Peshawar.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving changes...' : 'Save Website Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
