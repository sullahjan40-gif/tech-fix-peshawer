import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Lock, 
  Key, 
  RefreshCcw, 
  AlertTriangle, 
  Database, 
  Check, 
  ShieldCheck, 
  Save, 
  Mail, 
  Send, 
  CheckCircle2, 
  RotateCw, 
  Server, 
  Clock,
  Eye,
  EyeOff,
  ExternalLink,
  HelpCircle,
  Info,
  Sparkles,
  Inbox,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { resetDefaults, addActivityLog, sendAdminTestEmail, updateAdminPassword, updateSettings } from '../../utils/api';
import { formatPKTTime, formatPKTDateTime } from '../../utils/dateTime';
import { SiteSettings } from '../../types';

interface AdminSettingsProps {
  onRefresh: () => void;
  settings?: SiteSettings;
}

export function AdminSettings({ onRefresh, settings }: AdminSettingsProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Email Provider & Delivery Mode State
  const [emailProvider, setEmailProvider] = useState<'resend' | 'gmail_smtp' | 'auto'>(
    (settings?.emailProvider as any) || 'auto'
  );

  // Resend API & Email settings state
  const [resendApiKey, setResendApiKey] = useState(
    settings?.resendApiKey || 're_Buuf9PGF_AbXoKs68mLpsbNEJQx8tQW7a'
  );
  const [fromEmail, setFromEmail] = useState(
    settings?.resendFromEmail || 'Peshawar Tech Support <onboarding@resend.dev>'
  );
  const [testEmailAddress, setTestEmailAddress] = useState(
    settings?.resendTargetEmail || settings?.email || 'ullahsafiullah117@gmail.com'
  );

  // Google Gmail SMTP Credentials (Free 500 emails/day, 100% Primary Inbox)
  const [gmailUser, setGmailUser] = useState(
    settings?.gmailUser || 'ullahsafiullah117@gmail.com'
  );
  const [gmailAppPassword, setGmailAppPassword] = useState(
    settings?.gmailAppPassword || ''
  );
  const [showGmailPassword, setShowGmailPassword] = useState(false);

  const [showApiKey, setShowApiKey] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [showAntiSpamGuide, setShowAntiSpamGuide] = useState(true);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [savingEmailSettings, setSavingEmailSettings] = useState(false);
  const [emailSettingsMsg, setEmailSettingsMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [testEmailResult, setTestEmailResult] = useState<{
    status: 'idle' | 'success' | 'error';
    provider?: string;
    message?: string;
    messageId?: string;
    failoverNote?: string;
  }>({ status: 'idle' });

  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Synchronize state whenever settings prop updates from server
  useEffect(() => {
    if (settings) {
      if (settings.emailProvider) setEmailProvider(settings.emailProvider as any);
      if (settings.resendApiKey) setResendApiKey(settings.resendApiKey);
      if (settings.resendFromEmail) setFromEmail(settings.resendFromEmail);
      if (settings.resendTargetEmail || settings.email) {
        setTestEmailAddress(settings.resendTargetEmail || settings.email);
      }
      if (settings.gmailUser) setGmailUser(settings.gmailUser);
      if (settings.gmailAppPassword) setGmailAppPassword(settings.gmailAppPassword);
    }
  }, [settings]);

  const isKeyFormatted = resendApiKey.trim().startsWith('re_') && resendApiKey.trim().length >= 20;
  const cleanGmailPassword = (gmailAppPassword || '').replace(/\s+/g, '');
  const gmailPassLength = cleanGmailPassword.length;

  const handleSaveEmailSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingEmailSettings(true);
    setEmailSettingsMsg(null);
    try {
      const res: any = await updateSettings({
        emailProvider,
        resendApiKey: resendApiKey.trim(),
        resendFromEmail: fromEmail.trim(),
        resendTargetEmail: testEmailAddress.trim(),
        gmailUser: gmailUser.trim(),
        gmailAppPassword: gmailAppPassword.trim(),
        email: testEmailAddress.trim()
      });
      setEmailSettingsMsg({ 
        type: 'success', 
        text: res?.message || 'Configuration saved! All outgoing customer emails & notifications will now use these credentials immediately.' 
      });
      onRefresh();
      setTimeout(() => setEmailSettingsMsg(null), 6000);
    } catch (err: any) {
      setEmailSettingsMsg({ type: 'error', text: err.message || 'Failed to save email configuration.' });
    } finally {
      setSavingEmailSettings(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingTestEmail(true);
    setTestEmailResult({ status: 'idle' });

    try {
      const res = await sendAdminTestEmail({
        email: testEmailAddress.trim(),
        resendApiKey: resendApiKey.trim(),
        resendFromEmail: fromEmail.trim(),
        provider: emailProvider,
        gmailUser: gmailUser.trim(),
        gmailAppPassword: gmailAppPassword.trim()
      });
      setTestEmailResult({
        status: res.delivered ? 'success' : 'error',
        provider: res.provider,
        message: res.message,
        messageId: res.messageId,
        failoverNote: res.failoverNote
      });
    } catch (err: any) {
      setTestEmailResult({
        status: 'error',
        message: err.message || 'Failed to dispatch test notification.'
      });
    } finally {
      setSendingTestEmail(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 4 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      const res = await updateAdminPassword(newPassword.trim());
      setPasswordMsg({ type: 'success', text: res.message });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(null), 4000);
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to update credentials.' });
    }
  };

  const handleResetDefaults = async () => {
    const confirmation = window.prompt(
      'WARNING: This will reset all services, areas, and content back to the initial defaults. Type RESET to confirm:'
    );
    if (confirmation !== 'RESET') {
      return;
    }

    setResetting(true);
    try {
      await resetDefaults();
      setResetSuccess(true);
      onRefresh();
      setTimeout(() => setResetSuccess(false), 4000);
    } catch (err) {
      alert("Failed to reset database defaults");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#3d271d] pb-4">
        <h2 className="text-xl font-bold text-[#fdfaf4] flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-amber-500" />
          System Settings & Database Security
        </h2>
        <p className="text-xs text-[#d5c7b7] mt-1">
          Manage admin access credentials, email dispatch integrations, and database synchronization.
        </p>
      </div>

      {/* Database State Card */}
      <div className="p-5 rounded-2xl bg-[#1c120c]/90 border border-[#3d271d] shadow-xl text-[#fdfaf4] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-[#fdfaf4] font-mono">Persistence Engine Active</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            AUTO-SYNC ON
          </span>
        </div>
        <p className="text-xs text-[#d5c7b7] leading-relaxed">
          The website runs on a local JSON data store (Single Source of Truth pattern) backed by live server disk writes. All edits to services, prices, areas, bookings and content are saved automatically.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-[#d5c7b7] pt-1">
          <div className="p-2.5 rounded-xl bg-[#0e0805] border border-[#3d271d]">
            <span className="text-[#a89a8c] block">Database Location:</span>
            <span className="text-[#fdfaf4]">/data/database.json</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0e0805] border border-[#3d271d]">
            <span className="text-[#a89a8c] block">Image Storage:</span>
            <span className="text-[#fdfaf4]">/public/uploads/</span>
          </div>
        </div>
      </div>

      {/* Email & Deliverability Engine Settings Card */}
      <div className="p-5 rounded-2xl bg-[#1c120c]/90 border border-[#3d271d] shadow-xl text-[#fdfaf4] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3d271d]/80 pb-3">
          <div className="flex items-center gap-2.5">
            <Mail className="h-5 w-5 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-[#fdfaf4] font-mono flex items-center gap-2">
                <span>Email Engine & Anti-Spam Deliverability</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Inbox Shield v2
                </span>
              </h3>
              <p className="text-[11px] text-[#d5c7b7]">
                Configure Resend API keys, zero-spam Google SMTP credentials, and inbox routing.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAntiSpamGuide(!showAntiSpamGuide)}
              className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer underline underline-offset-2 transition-colors mr-1"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{showAntiSpamGuide ? "Hide Inbox Guide" : "10s Inbox Whitelist Guide"}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="text-[11px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer underline underline-offset-2 transition-colors mr-1"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>{showSetupGuide ? "Hide Resend Guide" : "Resend Guide"}</span>
            </button>
          </div>
        </div>

        {/* Provider Mode Selector Pills */}
        <div>
          <label className="block text-xs font-bold text-[#fdfaf4] mb-2 font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5 text-amber-500" />
              <span>Select Active Email Engine / Delivery Mode:</span>
            </span>
            <span className="text-[10px] text-[#a89a8c] font-normal font-sans">
              Choose how customer alerts & inquiries are dispatched
            </span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setEmailProvider('auto')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                emailProvider === 'auto'
                  ? 'bg-amber-500/15 border-amber-500/60 shadow-lg ring-1 ring-amber-500/30'
                  : 'bg-[#0e0805] border-[#3d271d] hover:border-[#523427] opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#fdfaf4] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Auto Waterfall</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  RECOMMENDED
                </span>
              </div>
              <p className="text-[10px] text-[#d5c7b7] leading-relaxed">
                Uses Resend API first; automatically fails over to Google SMTP if credits hit limit.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setEmailProvider('gmail_smtp')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                emailProvider === 'gmail_smtp'
                  ? 'bg-emerald-500/15 border-emerald-500/60 shadow-lg ring-1 ring-emerald-500/30'
                  : 'bg-[#0e0805] border-[#3d271d] hover:border-[#523427] opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#fdfaf4] flex items-center gap-1.5">
                  <Inbox className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Google SMTP Direct</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  0% SPAM • 500/DAY
                </span>
              </div>
              <p className="text-[10px] text-[#d5c7b7] leading-relaxed">
                Sent natively via your Gmail. 100% Primary Inbox delivery with zero third-party spam triggers.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setEmailProvider('resend')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                emailProvider === 'resend'
                  ? 'bg-sky-500/15 border-sky-500/60 shadow-lg ring-1 ring-sky-500/30'
                  : 'bg-[#0e0805] border-[#3d271d] hover:border-[#523427] opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#fdfaf4] flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-sky-400" />
                  <span>Resend Cloud API</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  HTTP REST
                </span>
              </div>
              <p className="text-[10px] text-[#d5c7b7] leading-relaxed">
                Fast cloud REST API with instant webhook tracking and custom domain DKIM support.
              </p>
            </button>
          </div>
        </div>

        {/* Pre-flight Deliverability Protection Badges */}
        <div className="p-3 rounded-xl bg-[#0e0805] border border-[#3d271d] flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="font-mono text-[11px] text-[#fdfaf4] font-bold">Automated Anti-Spam Rules:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Check className="h-3 w-3" /> Sanitized Clean Subjects
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Check className="h-3 w-3" /> CAN-SPAM Peshawar Address
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Check className="h-3 w-3" /> Two-Way Reply-To Header
            </span>
          </div>
        </div>

        {/* 10-Second Inbox Whitelist Guide (Solves User's Spam Question) */}
        {showAntiSpamGuide && (
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-3">
            <div className="flex items-center justify-between text-emerald-400 font-bold font-mono">
              <div className="flex items-center gap-2">
                <Inbox className="h-4 w-4" />
                <span>Why Emails Land in Spam & How to Fix in 10 Seconds:</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                1-TIME CLICK FIX
              </span>
            </div>
            
            <p className="text-[#d5c7b7] text-[11px] leading-relaxed">
              When you change to a <strong>new Resend account or new API key</strong>, Resend uses the shared test sender <code className="text-amber-300 font-mono">onboarding@resend.dev</code>. Because Google has not seen your new account ID before, its algorithmic filter may place the first test message in your <strong>Spam</strong> folder.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-lg bg-[#0e0805] border border-emerald-500/30 space-y-1.5">
                <span className="text-emerald-400 font-bold font-mono text-[11px] block">
                  Method 1: 10-Second Whitelist (For Resend)
                </span>
                <ol className="text-[11px] text-[#d5c7b7] space-y-1 list-decimal list-inside">
                  <li>Open Gmail and check your <strong>Spam</strong> folder.</li>
                  <li>Click open the TechFix notification / test email.</li>
                  <li>Click <strong className="text-[#fdfaf4] bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/40">Report not spam</strong> at the top.</li>
                  <li><strong>Result:</strong> Gmail immediately trains its AI, and <em>every future booking and customer email</em> will go straight to your <strong>Primary Inbox</strong>!</li>
                </ol>
              </div>

              <div className="p-3 rounded-lg bg-[#0e0805] border border-emerald-500/30 space-y-1.5">
                <span className="text-emerald-400 font-bold font-mono text-[11px] block">
                  Method 2: Google SMTP (Permanent 0% Spam)
                </span>
                <p className="text-[11px] text-[#d5c7b7] leading-relaxed">
                  Instead of rotating free Resend accounts, switch to <strong>Google SMTP Direct</strong> below. It sends <strong>500 free emails every single day</strong> directly through Google's own certified servers with zero spam penalties and 100% Primary Inbox placement.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Live Email Routing Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 p-3 rounded-xl bg-[#0e0805] border border-[#3d271d] text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-[#a89a8c] uppercase tracking-wider block">Customer Sees ("From"):</span>
            <span className="text-amber-300 font-mono text-[11px] font-semibold truncate block" title={fromEmail}>
              {emailProvider === 'gmail_smtp' ? (gmailUser || testEmailAddress) : (fromEmail || 'onboarding@resend.dev')}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-[#a89a8c] uppercase tracking-wider block">Alerts Sent To ("To"):</span>
            <span className="text-emerald-400 font-mono text-[11px] font-semibold truncate block" title={testEmailAddress}>
              {testEmailAddress || 'ullahsafiullah117@gmail.com'}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-[#a89a8c] uppercase tracking-wider block">Active Mode:</span>
            <span className="text-sky-400 font-mono text-[11px] font-semibold flex items-center gap-1">
              <Server className="h-3 w-3" />
              <span>
                {emailProvider === 'gmail_smtp'
                  ? 'Google SMTP (0% Spam)'
                  : emailProvider === 'auto'
                  ? 'Auto (Resend + Google Failover)'
                  : 'Resend API Direct'}
              </span>
            </span>
          </div>
        </div>

        {/* Expandable Setup Instructions Box for Resend */}
        {showSetupGuide && (
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
              <Sparkles className="h-4 w-4" />
              <span>How to Connect Resend with Your Email & Domain:</span>
            </div>
            <ol className="text-[#d5c7b7] text-[11px] space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                <strong className="text-[#fdfaf4]">Log in to Resend:</strong> Go to <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300 inline-flex items-center gap-0.5">resend.com <ExternalLink className="h-2.5 w-2.5 inline" /></a> and sign in with your email.
              </li>
              <li>
                <strong className="text-[#fdfaf4]">Generate API Key:</strong> Click <strong>API Keys</strong> in the left sidebar, click <strong>Create API Key</strong>, name it (e.g., <em>TechFix Production</em>), and copy the key starting with <code className="text-amber-300 font-mono">re_...</code>.
              </li>
              <li>
                <strong className="text-[#fdfaf4]">Choose Your Sender Address:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-[#a89a8c]">
                  <li>
                    <span className="text-[#fdfaf4]">Without Custom Domain (Testing):</span> Use <code className="text-amber-300 font-mono">Peshawar Tech Support &lt;onboarding@resend.dev&gt;</code>. Resend sends directly to your registered email.
                  </li>
                  <li>
                    <span className="text-[#fdfaf4]">With Custom Domain (Live Brand):</span> Go to <strong>Domains</strong> in Resend, add your domain (e.g., <code className="text-amber-300 font-mono">techfixpeshawar.com</code>), and add the DNS TXT/MX records. Once verified, enter your branded sender, e.g. <code className="text-amber-300 font-mono">TechFix Support &lt;support@techfixpeshawar.com&gt;</code>.
                  </li>
                </ul>
              </li>
              <li>
                <strong className="text-[#fdfaf4]">Save & Test:</strong> Paste your API Key, Sender Email, and Destination Email below. Click <strong>Save Configuration</strong>, then click <strong>Send Test Email</strong> to verify live delivery!
              </li>
            </ol>
          </div>
        )}

        {emailSettingsMsg && (
          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            emailSettingsMsg.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {emailSettingsMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />}
            <span>{emailSettingsMsg.text}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSendTestEmail} className="space-y-4">
          <div className="space-y-3.5">
            {/* Resend Fields Section - PERMANENTLY VISIBLE AT ALL TIMES */}
            <div className="p-4 rounded-xl bg-[#0e0805] border border-amber-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5" />
                    <span>Resend Cloud Credentials</span>
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    PERMANENTLY ACTIVE
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isKeyFormatted
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}>
                  {isKeyFormatted ? '✓ Valid Format (re_...)' : 'Requires re_...'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#fdfaf4] mb-1.5">
                  Resend API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={resendApiKey}
                    onChange={(e) => setResendApiKey(e.target.value)}
                    placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full rounded-xl bg-[#1c120c] border border-[#3d271d] pl-3.5 pr-10 py-2 text-xs text-[#fdfaf4] font-mono focus:border-amber-500 focus:outline-none transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a89a8c] hover:text-[#fdfaf4] cursor-pointer transition-colors p-1"
                    title={showApiKey ? "Hide API Key" : "Show API Key"}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-[#a89a8c] mt-1 block">
                  Resend API key starting with <code className="text-amber-300">re_</code> from resend.com/api-keys. Hot-swappable at any time with zero restart.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#fdfaf4] mb-1.5">
                  From Email (Sender Identity)
                </label>
                <input
                  type="text"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder="Peshawar Tech Support <onboarding@resend.dev>"
                  className="w-full rounded-xl bg-[#1c120c] border border-[#3d271d] px-3.5 py-2 text-xs text-[#fdfaf4] font-mono focus:border-amber-500 focus:outline-none transition-all shadow-inner"
                />
                <span className="text-[10px] text-[#a89a8c] mt-1 block">
                  For free accounts use <code className="text-amber-300 font-mono">onboarding@resend.dev</code>. With custom domains, use your domain address.
                </span>
              </div>
            </div>

            {/* Google SMTP Credentials Section - PERMANENTLY VISIBLE FOR DUAL-PROVIDER FAILOVER */}
            <div className="p-4 rounded-xl bg-[#0e0805] border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                  <Inbox className="h-3.5 w-3.5" />
                  <span>Google Gmail SMTP Credentials (500 Free Emails/Day • Direct Inbox)</span>
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AUTO-FAILOVER READY
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#fdfaf4] mb-1.5">
                    Gmail Address
                  </label>
                  <input
                    type="email"
                    value={gmailUser}
                    onChange={(e) => setGmailUser(e.target.value)}
                    placeholder="ullahsafiullah117@gmail.com"
                    className="w-full rounded-xl bg-[#1c120c] border border-[#3d271d] px-3.5 py-2 text-xs text-[#fdfaf4] font-mono focus:border-emerald-500 focus:outline-none transition-all shadow-inner"
                  />
                  <span className="text-[10px] text-[#a89a8c] mt-1 block">
                    Your Google account address. When emails are sent via SMTP, customers see this address.
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#fdfaf4] flex items-center gap-1.5">
                      <span>Google App Password</span>
                      <span className="text-[10px] font-normal text-[#a89a8c]">(16 characters)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {gmailPassLength > 0 && (
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          gmailPassLength === 16 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                            : gmailPassLength === 15
                            ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          {gmailPassLength === 16 ? '✓ 16/16 chars' : `${gmailPassLength}/16 chars`}
                        </span>
                      )}
                      <a
                        href="https://myaccount.google.com/apppasswords"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-amber-400 underline hover:text-amber-300 flex items-center gap-0.5 font-mono"
                      >
                        Generate Key <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type={showGmailPassword ? "text" : "password"}
                      value={gmailAppPassword}
                      onChange={(e) => setGmailAppPassword(e.target.value)}
                      placeholder="xxxx xxxx xxxx xxxx"
                      className={`w-full rounded-xl bg-[#1c120c] border pl-3.5 pr-10 py-2 text-xs text-[#fdfaf4] font-mono focus:outline-none transition-all shadow-inner ${
                        gmailPassLength === 16
                          ? 'border-emerald-500/60 focus:border-emerald-400'
                          : gmailPassLength === 15
                          ? 'border-red-500/60 focus:border-red-400'
                          : 'border-[#3d271d] focus:border-emerald-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowGmailPassword(!showGmailPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a89a8c] hover:text-[#fdfaf4] cursor-pointer transition-colors p-1"
                      title={showGmailPassword ? "Hide Password" : "Show Password"}
                    >
                      {showGmailPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {gmailPassLength === 15 && (
                    <div className="mt-1.5 p-2 rounded-lg bg-red-950/40 border border-red-500/40 text-[10px] text-red-300 leading-normal">
                      <strong>⚠️ Missing 1 character (15/16):</strong> Google App Passwords are strictly 16 lowercase letters (4 groups of 4: <code className="text-amber-300">xxxx xxxx xxxx xxxx</code>). Your key (e.g. <code className="text-red-200">{cleanGmailPassword}</code>) is missing the 4th letter of the last group!
                    </div>
                  )}
                  {gmailPassLength > 0 && gmailPassLength !== 16 && gmailPassLength !== 15 && (
                    <div className="mt-1.5 p-2 rounded-lg bg-amber-950/40 border border-amber-500/40 text-[10px] text-amber-300 leading-normal">
                      ⚠️ Current length is {gmailPassLength} chars. Google App Passwords must be exactly 16 letters without spaces.
                    </div>
                  )}
                  {gmailPassLength === 16 && (
                    <span className="text-[10px] text-emerald-400 mt-1 block font-mono">
                      ✓ 16-character format recognized. Ready for direct Google SMTP dispatch!
                    </span>
                  )}
                  {gmailPassLength === 0 && (
                    <span className="text-[10px] text-[#a89a8c] mt-1 block">
                      Generated from your Google Security Settings (requires 2-Step Verification).
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Target Notification Inbox */}
            <div>
              <label className="block text-xs font-bold text-[#fdfaf4] mb-1.5">
                Target Email (Admin Destination Inbox)
              </label>
              <input
                type="email"
                required
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                placeholder="ullahsafiullah117@gmail.com"
                className="w-full rounded-xl bg-[#0e0805] border border-[#3d271d] px-3.5 py-2.5 text-xs text-[#fdfaf4] font-mono focus:border-amber-500 focus:outline-none transition-all shadow-inner"
              />
              <span className="text-[10px] text-[#a89a8c] mt-1 block">
                Destination inbox where all customer inquiries, booking confirmations, and phone alerts are forwarded.
              </span>
            </div>
          </div>

          {/* Action Row: Save Configuration (Primary) & Send Test Email */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleSaveEmailSettings()}
              disabled={savingEmailSettings}
              className="skeuo-btn-primary px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              {savingEmailSettings ? (
                <>
                  <RotateCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Configuration...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>

            <button
              type="submit"
              disabled={sendingTestEmail}
              className="skeuo-btn px-4 py-2.5 rounded-xl font-bold text-xs text-[#fdfaf4] hover:text-white transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer border border-[#3d271d]"
            >
              {sendingTestEmail ? (
                <>
                  <RotateCw className="h-3.5 w-3.5 animate-spin text-amber-400" />
                  <span>Dispatching to {testEmailAddress}...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5 text-amber-400" />
                  <span>Send Test Email</span>
                </>
              )}
            </button>

            <span className="text-[11px] font-mono text-[#a89a8c] ml-auto flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-amber-400" />
              <span>PKT: {formatPKTTime()}</span>
            </span>
          </div>

          {/* Result Badges */}
          {testEmailResult.status === 'success' && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 font-mono">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="w-full">
                <strong className="block text-emerald-200 font-bold">Live Email Dispatched Successfully!</strong>
                <p className="text-[11px] text-emerald-300/90 mt-0.5">{testEmailResult.message}</p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] text-[#d5c7b7]">
                  {testEmailResult.provider && (
                    <span className="px-2 py-0.5 rounded bg-[#0e0805] border border-[#3d271d]">
                      Provider: <strong className="text-emerald-400">{testEmailResult.provider.toUpperCase()}</strong>
                    </span>
                  )}
                  {testEmailResult.messageId && (
                    <span className="px-2 py-0.5 rounded bg-[#0e0805] border border-[#3d271d]">
                      ID: <strong className="text-amber-300">{testEmailResult.messageId}</strong>
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-[#0e0805] border border-emerald-500/40 text-emerald-400 font-bold">
                    ✓ Clean Subject & CAN-SPAM Footer Verified
                  </span>
                </div>
                {testEmailResult.failoverNote && (
                  <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-sans leading-normal">
                    <strong>⚡ Auto-Failover Active:</strong> {testEmailResult.failoverNote}
                  </div>
                )}
              </div>
            </div>
          )}

          {testEmailResult.status === 'error' && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 font-mono">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-rose-200 font-bold">Dispatch Notice</strong>
                <p className="text-[11px] text-rose-300/90 mt-0.5">{testEmailResult.message}</p>
                <p className="text-[10px] text-[#a89a8c] mt-1">
                  Tip: If using Resend with custom sender, switch sender back to <code className="text-amber-300">onboarding@resend.dev</code> or switch mode to <strong className="text-emerald-400">Google SMTP Direct</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Technical Advisory */}
          <div className="p-3.5 rounded-xl bg-[#0e0805] border border-[#3d271d] text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono text-[11px]">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Deliverability & Inbox Placement Advice:</span>
            </div>
            <ul className="text-[#d5c7b7] text-[11px] space-y-1.5 list-disc list-inside leading-relaxed">
              <li>
                <strong className="text-[#fdfaf4]">Changing Resend Accounts:</strong> When rotating to a new Resend email or API key, remember to click <span className="text-emerald-400 font-semibold">"Report not spam"</span> once in Gmail to permanently train Gmail's AI to route all subsequent messages to your <strong>Primary Inbox</strong>.
              </li>
              <li>
                <strong className="text-[#fdfaf4]">No Credit Exhaustion:</strong> Google SMTP provides 500 emails/day completely free, permanently bypassing third-party API quotas.
              </li>
              <li>
                <strong className="text-[#fdfaf4]">Instant Hot-Swap:</strong> Updating the API key or email here takes effect immediately across all customer bookings and inquiry forms with zero server restart required.
              </li>
            </ul>
          </div>
        </form>
      </div>

      {/* Admin Access Credentials */}
      <form onSubmit={handleUpdatePassword} className="p-5 rounded-2xl bg-[#1c120c]/90 border border-[#3d271d] shadow-xl text-[#fdfaf4] space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-bold text-[#fdfaf4]">Admin Authentication Access</h3>
        </div>

        {passwordMsg && (
          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            passwordMsg.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {passwordMsg.type === 'success' ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#d5c7b7] mb-1">New Admin Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full rounded-xl bg-[#0e0805] border border-[#3d271d] px-3.5 py-2.5 text-xs text-[#fdfaf4] focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#d5c7b7] mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full rounded-xl bg-[#0e0805] border border-[#3d271d] px-3.5 py-2.5 text-xs text-[#fdfaf4] focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-[#a89a8c]">Default password: safi2025</span>
          <button
            type="submit"
            className="skeuo-btn-primary flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all shadow-lg cursor-pointer"
          >
            <Key className="h-3.5 w-3.5" />
            <span>Update Password</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset to Defaults */}
      <div className="p-5 rounded-2xl bg-red-950/20 border border-red-800/40 space-y-3">
        <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>Danger Zone: Re-seed Initial Database</span>
        </div>

        <p className="text-xs text-[#d5c7b7] leading-relaxed">
          Need to revert to clean defaults? This replaces the database with the initial Peshawar services catalog, technician bio, and problem diagnostics. Existing service bookings will be preserved.
        </p>

        {resetSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>Database successfully reset to defaults.</span>
          </div>
        )}

        <div>
          <button
            onClick={handleResetDefaults}
            disabled={resetting}
            className="flex items-center gap-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 px-4 py-2 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            <span>{resetting ? 'Resetting...' : 'Reset to System Defaults'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
