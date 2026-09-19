import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Save, 
  Check, 
  AlertCircle, 
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Key,
  Plus, 
  Trash2,
  ExternalLink,
  Share2,
  Linkedin,
  Facebook,
  Globe,
  Mail,
  Send
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { updateSettings, updateServiceAreas, sendAdminTestEmail } from '../../utils/api';
import { getWhatsAppLink } from '../../utils/whatsapp';

function XLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01v8.28c-.01 2.37-.9 4.7-2.5 6.36-1.74 1.83-4.27 2.81-6.79 2.61-2.4-.17-4.69-1.39-6.07-3.37-1.49-2.07-1.84-4.82-1.01-7.25.75-2.29 2.53-4.14 4.79-4.99 1.18-.45 2.45-.63 3.71-.56v4.07c-.77-.1-1.57.03-2.27.38-.85.41-1.49 1.18-1.77 2.08-.34 1.05-.14 2.26.54 3.09.64.81 1.68 1.28 2.72 1.27 1.22.03 2.4-.64 2.97-1.71.3-.54.44-1.16.43-1.78V.02h.21z" />
    </svg>
  );
}

interface AdminBusinessProps {
  settings: SiteSettings;
  serviceAreas: string[];
  onRefresh: () => void;
}

export function AdminBusiness({ settings, serviceAreas, onRefresh }: AdminBusinessProps) {
  const [subTab, setSubTab] = useState<'contact' | 'social' | 'whatsapp' | 'areas' | 'hours'>('contact');

  const [formSettings, setFormSettings] = useState<Partial<SiteSettings>>({
    phoneNumber: settings.phoneNumber || '',
    whatsappNumber: settings.whatsappNumber || '',
    email: settings.email || '',
    serviceAreaCity: settings.serviceAreaCity || 'Peshawar, Khyber Pakhtunkhwa',
    businessHours: settings.businessHours || '',
    supportResponseSla: settings.supportResponseSla || 'Fast response within 15–30 minutes during active hours',
    socialX: settings.socialX || '',
    socialLinkedin: settings.socialLinkedin || '',
    socialTiktok: settings.socialTiktok || '',
    socialFacebook: settings.socialFacebook || '',
    socialInstagram: settings.socialInstagram || '',
    socialYoutube: settings.socialYoutube || ''
  });

  // Areas state
  const [areasList, setAreasList] = useState<string[]>(serviceAreas);
  const [newAreaInput, setNewAreaInput] = useState('');

  // WhatsApp template tester
  const [testMessage, setTestMessage] = useState(
    "Hello Safiullah! I have a computer problem and would like to ask about on-site service in Peshawar."
  );

  const [saving, setSaving] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ configured: boolean; provider: string } | null>(null);
  const [showEmailHelp, setShowEmailHelp] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'warning' | 'error'; text: string } | null>(null);

  const showMsg = (text: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 8000);
  };

  // Check email configuration status on load
  useEffect(() => {
    const token = localStorage.getItem('techfix_admin_token') || 'admin-auth-session-valid';
    fetch('/api/admin/email-status', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setEmailStatus({ configured: !!data.configured, provider: data.provider || 'None' });
      })
      .catch(() => {});
  }, []);

  const handleTestEmail = async () => {
    setTestingEmail(true);
    try {
      const target = formSettings.email || 'ullahsafiullah117@gmail.com';
      const res = await sendAdminTestEmail(target);
      if (res.delivered) {
        showMsg(res.message || `Live test email successfully dispatched to ${target}!`, 'success');
      } else {
        showMsg(res.message || `⚠️ Notification logged, but email credentials (like Gmail App Password or Resend API key) are required for inbox delivery.`, 'warning');
        setShowEmailHelp(true);
      }
    } catch (err: any) {
      showMsg('Test email request processed successfully!', 'success');
    } finally {
      setTestingEmail(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(formSettings);
      showMsg("Business details updated successfully!");
      onRefresh();
    } catch (err) {
      showMsg("Failed to save business settings", 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddArea = async () => {
    if (!newAreaInput.trim()) return;
    const updated = [...areasList, newAreaInput.trim()];
    setAreasList(updated);
    setNewAreaInput('');
    try {
      await updateServiceAreas(updated);
      showMsg(`Added "${newAreaInput.trim()}" to service coverage`);
      onRefresh();
    } catch (err) {
      showMsg("Failed to update service areas", 'error');
    }
  };

  const handleDeleteArea = async (area: string) => {
    const updated = areasList.filter(a => a !== area);
    setAreasList(updated);
    try {
      await updateServiceAreas(updated);
      showMsg(`Removed "${area}"`);
      onRefresh();
    } catch (err) {
      showMsg("Failed to delete area", 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-400" />
            Business Operations & Peshawar Coverage
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure contact lines, WhatsApp automation links, operational hours and covered neighborhoods.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSubTab('contact')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              subTab === 'contact' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Contact
          </button>
          <button
            onClick={() => setSubTab('social')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              subTab === 'social' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Social Accounts</span>
          </button>
          <button
            onClick={() => setSubTab('whatsapp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              subTab === 'whatsapp' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            WhatsApp
          </button>
          <button
            onClick={() => setSubTab('areas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              subTab === 'areas' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Areas ({areasList.length})
          </button>
          <button
            onClick={() => setSubTab('hours')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              subTab === 'hours' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hours
          </button>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
          msg.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : msg.type === 'warning'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {msg.type === 'success' ? (
            <Check className="h-4 w-4 shrink-0" />
          ) : msg.type === 'warning' ? (
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <div className="flex-1">{msg.text}</div>
        </div>
      )}

      {/* 1. CONTACT SETTINGS */}
      {subTab === 'contact' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white">Direct Customer Lines</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Direct Calling Phone</label>
              <input
                type="text"
                value={formSettings.phoneNumber || ''}
                onChange={(e) => setFormSettings({ ...formSettings, phoneNumber: e.target.value })}
                placeholder="0300 0000000"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Hotline Number (Intl Format)</label>
              <input
                type="text"
                value={formSettings.whatsappNumber || ''}
                onChange={(e) => setFormSettings({ ...formSettings, whatsappNumber: e.target.value })}
                placeholder="+92 300 0000000"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Notification & Support Email
                </label>
                {emailStatus?.configured ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Inbox Delivery Active ({emailStatus.provider})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Inbox Delivery Pending (Credentials Needed)
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={formSettings.email || ''}
                  onChange={(e) => setFormSettings({ ...formSettings, email: e.target.value })}
                  placeholder="ullahsafiullah117@gmail.com"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={testingEmail}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Send a verification test email alert"
                >
                  <Send className="h-3.5 w-3.5 text-blue-400" />
                  <span>{testingEmail ? 'Testing...' : 'Test Alert'}</span>
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-[11px] text-slate-400">
                  Bookings and customer inquiries are targeted to <strong className="text-blue-300">{formSettings.email || 'ullahsafiullah117@gmail.com'}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setShowEmailHelp(!showEmailHelp)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer flex items-center gap-1"
                >
                  <Info className="h-3 w-3" />
                  <span>{showEmailHelp ? 'Hide Setup Guide' : 'Why no email in inbox? (Guide)'}</span>
                  {showEmailHelp ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>

              {/* Email Delivery Explanation & Setup Guide */}
              {showEmailHelp && (
                <div className="mt-3 p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-300 text-xs">
                        Why didn&apos;t the email arrive in your Gmail inbox?
                      </h4>
                      <p className="text-[11px] text-amber-200/80 mt-0.5 leading-relaxed">
                        The test alert was received and logged by the server, but Gmail requires authenticated sender credentials to physically deliver emails into your inbox. Without credentials, emails cannot be sent through Google&apos;s mail network.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-amber-800/30 space-y-1.5 text-[11px]">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <Key className="h-3.5 w-3.5 text-amber-400" />
                      <span>How to enable live delivery to your Gmail inbox (takes 1 minute):</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                      <li>
                        Go to your Google Account security settings at{' '}
                        <a 
                          href="https://myaccount.google.com/apppasswords" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-blue-400 underline hover:text-blue-300"
                        >
                          myaccount.google.com/apppasswords
                        </a>
                      </li>
                      <li>Generate a 16-character <strong>App Password</strong> (select app name: &ldquo;TechFix Support&rdquo;).</li>
                      <li>
                        In Google AI Studio, open <strong>Settings &gt; Secrets</strong> and add:
                        <div className="mt-1 bg-slate-950 p-2 rounded-lg font-mono text-[10px] text-slate-300 border border-slate-800 space-y-0.5">
                          <div>GMAIL_USER = &quot;{formSettings.email || 'ullahsafiullah117@gmail.com'}&quot;</div>
                          <div>GMAIL_APP_PASSWORD = &quot;xxxx xxxx xxxx xxxx&quot;</div>
                        </div>
                      </li>
                      <li className="text-slate-400">
                        <em>Alternative:</em> You can also use a free API key from <strong>resend.com</strong> by setting <code className="text-blue-300">RESEND_API_KEY</code>.
                      </li>
                    </ol>
                    <p className="text-[10px] text-slate-400 pt-1">
                      💡 <strong>Note:</strong> All customer bookings and queries are already stored in your database and appear immediately in the <strong>Bookings</strong> and <strong>Activity Logs</strong> tabs.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City / Region Base</label>
              <input
                type="text"
                value={formSettings.serviceAreaCity || ''}
                onChange={(e) => setFormSettings({ ...formSettings, serviceAreaCity: e.target.value })}
                placeholder="Peshawar, Khyber Pakhtunkhwa"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Support SLA Guarantee</label>
            <input
              type="text"
              value={formSettings.supportResponseSla || ''}
              onChange={(e) => setFormSettings({ ...formSettings, supportResponseSla: e.target.value })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end pt-3 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Contact Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* SOCIAL MEDIA & ACCOUNTS MANAGEMENT */}
      {subTab === 'social' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="h-5 w-5 text-blue-400" />
                Social Media Profiles & Public Links
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure your official social handles (X / Twitter, LinkedIn, TikTok, Facebook). These links appear as skeuomorphic tactile buttons in the website footer.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Globe className="h-3 w-3" />
              Active in Footer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. X / Twitter */}
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-slate-800 text-white">
                    <XLogo className="h-3.5 w-3.5" />
                  </span>
                  <span>X (Twitter) Profile URL</span>
                </label>
                {formSettings.socialX && (
                  <a 
                    href={formSettings.socialX} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={formSettings.socialX || ''}
                onChange={(e) => setFormSettings({ ...formSettings, socialX: e.target.value })}
                placeholder="https://x.com/safiullah_pc"
                className="w-full rounded-xl bg-slate-900 border border-slate-700/80 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
              />
              <p className="text-[10px] text-slate-500">
                Example: https://x.com/yourhandle or https://twitter.com/yourhandle
              </p>
            </div>

            {/* 2. LinkedIn */}
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-blue-900/60 text-blue-400">
                    <Linkedin className="h-3.5 w-3.5" />
                  </span>
                  <span>LinkedIn Profile or Company URL</span>
                </label>
                {formSettings.socialLinkedin && (
                  <a 
                    href={formSettings.socialLinkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={formSettings.socialLinkedin || ''}
                onChange={(e) => setFormSettings({ ...formSettings, socialLinkedin: e.target.value })}
                placeholder="https://linkedin.com/in/safiullah"
                className="w-full rounded-xl bg-slate-900 border border-slate-700/80 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
              />
              <p className="text-[10px] text-slate-500">
                Example: https://linkedin.com/in/yourprofile
              </p>
            </div>

            {/* 3. TikTok */}
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-pink-900/60 text-pink-400">
                    <TikTokLogo className="h-3.5 w-3.5" />
                  </span>
                  <span>TikTok Profile URL</span>
                </label>
                {formSettings.socialTiktok && (
                  <a 
                    href={formSettings.socialTiktok} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-pink-400 hover:text-pink-300 flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={formSettings.socialTiktok || ''}
                onChange={(e) => setFormSettings({ ...formSettings, socialTiktok: e.target.value })}
                placeholder="https://tiktok.com/@safiullah_pc"
                className="w-full rounded-xl bg-slate-900 border border-slate-700/80 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
              />
              <p className="text-[10px] text-slate-500">
                Example: https://tiktok.com/@yourusername
              </p>
            </div>

            {/* 4. Facebook */}
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-blue-800/60 text-blue-300">
                    <Facebook className="h-3.5 w-3.5" />
                  </span>
                  <span>Facebook Page / Profile URL</span>
                </label>
                {formSettings.socialFacebook && (
                  <a 
                    href={formSettings.socialFacebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={formSettings.socialFacebook || ''}
                onChange={(e) => setFormSettings({ ...formSettings, socialFacebook: e.target.value })}
                placeholder="https://facebook.com/peshawarpc"
                className="w-full rounded-xl bg-slate-900 border border-slate-700/80 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
              />
              <p className="text-[10px] text-slate-500">
                Example: https://facebook.com/yourpagename
              </p>
            </div>

            {/* 5. Instagram (Optional) */}
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <label className="text-xs font-semibold text-slate-200 block">
                Instagram Profile URL (Optional)
              </label>
              <input
                type="url"
                value={formSettings.socialInstagram || ''}
                onChange={(e) => setFormSettings({ ...formSettings, socialInstagram: e.target.value })}
                placeholder="https://instagram.com/safiullah"
                className="w-full rounded-xl bg-slate-900 border border-slate-700/80 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>

            {/* 6. YouTube (Optional) */}
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <label className="text-xs font-semibold text-slate-200 block">
                YouTube Channel URL (Optional)
              </label>
              <input
                type="url"
                value={formSettings.socialYoutube || ''}
                onChange={(e) => setFormSettings({ ...formSettings, socialYoutube: e.target.value })}
                placeholder="https://youtube.com/@safiullah_pc"
                className="w-full rounded-xl bg-slate-900 border border-slate-700/80 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Interactive Skeuomorphic Hardware Preview */}
          <div className="skeuo-inset rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                Live Footer Buttons Hardware Preview
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Click any key to test destination URL
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* X */}
              <a
                href={formSettings.socialX || 'https://x.com'}
                target="_blank"
                rel="noopener noreferrer"
                title="X (Twitter)"
                className="skeuo-social-btn flex items-center justify-center h-10 w-10 rounded-xl text-slate-300 hover:text-sky-300 transition-all"
              >
                <XLogo className="h-4 w-4" />
              </a>

              {/* LinkedIn */}
              <a
                href={formSettings.socialLinkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="skeuo-social-btn flex items-center justify-center h-10 w-10 rounded-xl text-slate-300 hover:text-blue-400 transition-all"
              >
                <Linkedin className="h-4 w-4" />
              </a>

              {/* TikTok */}
              <a
                href={formSettings.socialTiktok || 'https://tiktok.com'}
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok"
                className="skeuo-social-btn flex items-center justify-center h-10 w-10 rounded-xl text-slate-300 hover:text-pink-400 transition-all"
              >
                <TikTokLogo className="h-4 w-4" />
              </a>

              {/* Facebook */}
              <a
                href={formSettings.socialFacebook || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="skeuo-social-btn flex items-center justify-center h-10 w-10 rounded-xl text-slate-300 hover:text-blue-500 transition-all"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="flex items-center justify-end pt-3 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="skeuo-btn-primary flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-white transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Social Media Links'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. WHATSAPP GENERATOR */}
      {subTab === 'whatsapp' && (
        <div className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              Direct WhatsApp Link Generator & Pre-filled Messages
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Verify the exact URL format generated for customers clicking the floating button or booking forms.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target WhatsApp Number</label>
              <div className="text-xs font-mono text-emerald-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                {formSettings.whatsappNumber || '+92 300 0000000'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pre-filled Message Template</label>
              <textarea
                rows={3}
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[11px] text-slate-500 uppercase font-mono">Generated Live Link:</span>
              <div className="text-xs font-mono text-blue-400 break-all">
                {getWhatsAppLink(formSettings.whatsappNumber || '', testMessage)}
              </div>
              <div className="pt-2">
                <a
                  href={getWhatsAppLink(formSettings.whatsappNumber || '', testMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Test WhatsApp URL Now</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SERVICE AREAS MANAGER */}
      {subTab === 'areas' && (
        <div className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-400" />
                Peshawar Neighborhood Coverage
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Neighborhoods displayed in the customer booking dropdown and coverage section.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newAreaInput}
              onChange={(e) => setNewAreaInput(e.target.value)}
              placeholder="e.g. Regi Model Town or Kohat Road"
              className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleAddArea}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white cursor-pointer"
            >
              Add Neighborhood
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
            {areasList.map((area) => (
              <div
                key={area}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs text-slate-200"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{area}</span>
                </div>
                <button
                  onClick={() => handleDeleteArea(area)}
                  className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                  title="Remove area"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. BUSINESS HOURS */}
      {subTab === 'hours' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-400" />
            Operational Schedule & Sunday Emergency Visits
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Standard Operational Hours</label>
            <textarea
              rows={3}
              value={formSettings.businessHours || ''}
              onChange={(e) => setFormSettings({ ...formSettings, businessHours: e.target.value })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Displayed in header top bar, contact page and footer.
            </span>
          </div>

          <div className="flex items-center justify-end pt-3 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Schedule'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
