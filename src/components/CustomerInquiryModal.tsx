import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  X, 
  CheckCircle2, 
  MessageSquare, 
  Phone, 
  MapPin, 
  HelpCircle, 
  ShieldCheck 
} from 'lucide-react';
import { submitCustomerInquiry } from '../utils/api';
import { getWhatsAppLink } from '../utils/whatsapp';

interface CustomerInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string;
  recipientEmail?: string;
}

export function CustomerInquiryModal({
  isOpen,
  onClose,
  whatsappNumber = '923275226107',
  recipientEmail = 'ullahsafiullah117@gmail.com'
}: CustomerInquiryModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [area, setArea] = useState('Peshawar');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !message.trim()) {
      setError('Please provide your name, phone number, and query details.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await submitCustomerInquiry({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        area: area.trim(),
        subject: subject.trim() || 'General Computer Service Query',
        message: message.trim()
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error('Failed to submit inquiry:', err);
      setError(err?.message || 'Failed to submit query. You can reach out directly via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName('');
    setPhone('');
    setEmail('');
    setSubject('');
    setMessage('');
    setError('');
    onClose();
  };

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const waUserNumber = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : cleanPhone;
  const whatsappUrl = getWhatsAppLink(
    whatsappNumber,
    `Hello Safiullah! I sent an inquiry regarding "${subject || 'computer repair'}": ${message.slice(0, 100)}...`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-xl rounded-3xl skeuo-panel p-6 sm:p-8 shadow-2xl my-8 border border-slate-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-modal-title"
      >
        {/* Screws for skeuomorphic hardware aesthetic */}
        <div className="absolute top-3 left-3"><span className="skeuo-screw"></span></div>
        <div className="absolute top-3 right-3"><span className="skeuo-screw"></span></div>
        <div className="absolute bottom-3 left-3"><span className="skeuo-screw"></span></div>
        <div className="absolute bottom-3 right-3"><span className="skeuo-screw"></span></div>

        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors z-10 cursor-pointer"
          aria-label="Close query modal"
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <HelpCircle className="h-5 w-5" />
              </span>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Direct Email Dispatch: {recipientEmail}
              </div>
            </div>

            <h2 id="inquiry-modal-title" className="text-2xl font-extrabold text-white font-mono tracking-tight">
              Submit a Client Query / Question
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 mb-6 leading-relaxed">
              Have a question about computer diagnostics, software repair, SSD upgrades, or pricing? Submit below and an instant email alert is sent to <strong className="text-blue-300">{recipientEmail}</strong>.
            </p>

            {error && (
              <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-950/30 p-3 text-xs text-rose-300 font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                    Your Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full rounded-xl skeuo-input px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                    Phone / Mobile <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full rounded-xl skeuo-input px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                    Your Email (Optional, for email reply)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full rounded-xl skeuo-input px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                    Peshawar Area / Town
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Hayatabad Phase 3, Saddar..."
                    className="w-full rounded-xl skeuo-input px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                  Topic / Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Laptop BSOD Blue Screen / Clean OS Install question..."
                  className="w-full rounded-xl skeuo-input px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                  Your Question / Query Details <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe what's wrong with your computer or what service you are looking for..."
                  className="w-full rounded-xl skeuo-input px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>We protect your contact details. No spam.</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn-primary px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xl cursor-pointer disabled:opacity-50 font-mono tracking-wide"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? 'Sending Query...' : 'SEND QUERY VIA EMAIL'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* SUCCESS STATE */
          <div className="text-center py-6 space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40 mb-3">
                <Mail className="h-3.5 w-3.5" />
                <span>Email Dispatched to {recipientEmail}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white font-mono tracking-tight">
                QUERY RECEIVED & EMAILED!
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{fullName}</strong>! Your inquiry regarding "{subject || 'Computer Problem'}" has been forwarded directly to Safiullah's email inbox (<span className="text-blue-300">{recipientEmail}</span>).
              </p>
              <p className="mt-1 text-xs text-slate-400">
                You will be contacted via telephone, WhatsApp, or email shortly.
              </p>
            </div>

            {/* Confirmation details summary */}
            <div className="rounded-2xl skeuo-card p-4 max-w-md mx-auto text-left text-xs space-y-2 border border-slate-800">
              <div className="flex justify-between text-slate-300 pb-1.5 border-b border-slate-800">
                <span className="text-slate-400 font-mono">Inquiry Status:</span>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded text-[10px] border border-emerald-800/40">
                  SUBMITTED & LOGGED
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Name:</span>
                <span className="font-medium text-white">{fullName}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Contact Phone:</span>
                <span className="font-mono text-white">{phone}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Area:</span>
                <span className="font-medium">{area}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Subject:</span>
                <span className="font-medium text-blue-300 truncate max-w-[200px]">{subject || 'Computer Service Query'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn-emerald px-6 py-2.5 text-xs font-bold text-emerald-200 shadow-lg font-mono"
              >
                <MessageSquare className="h-4 w-4 text-emerald-300" />
                <span>Chat on WhatsApp Now</span>
              </a>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn px-6 py-2.5 text-xs font-bold text-slate-300 hover:text-white font-mono cursor-pointer"
              >
                <span>Close Window</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
