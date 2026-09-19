import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Laptop, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { SiteSettings, ServiceRequest } from '../types';
import { checkBookingStatus } from '../utils/api';
import { getWhatsAppLink } from '../utils/whatsapp';
import { Breadcrumb } from '../components/Breadcrumb';

interface TrackRequestPageProps {
  settings: SiteSettings;
  onNavigate: (page: string, params?: any) => void;
}

export function TrackRequestPage({ settings, onNavigate }: TrackRequestPageProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ServiceRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) {
      setError('Please enter your Reference Tracking ID or Phone Number.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);

    try {
      const data = await checkBookingStatus(clean);
      setResult(data);
    } catch (err: any) {
      setError(err?.message || `No service request found matching "${clean}". Please verify your reference ID.`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'NEW':
      case 'PENDING':
        return {
          label: 'Request Received',
          color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          dot: 'bg-blue-400',
          desc: 'Your service request is queued. Safiullah will call or message to verify details.'
        };
      case 'CONTACTED':
        return {
          label: 'Contacted / Scheduling',
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
          desc: 'We have reached out to verify your machine problem and schedule an appointment time.'
        };
      case 'APPOINTMENT REQUESTED':
      case 'CONFIRMED':
        return {
          label: 'Appointment Confirmed',
          color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          dot: 'bg-purple-400',
          desc: 'Appointment is locked in. The technician will visit your location at the agreed time.'
        };
      case 'IN PROGRESS':
        return {
          label: 'Service In Progress',
          color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          dot: 'bg-cyan-400',
          desc: 'Technician is actively diagnosing or repairing your system on-site.'
        };
      case 'WAITING FOR PARTS':
        return {
          label: 'Waiting For Parts / Drive',
          color: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
          dot: 'bg-orange-400',
          desc: 'Diagnostic complete; awaiting SSD, replacement RAM, or customer-approved component.'
        };
      case 'COMPLETED':
        return {
          label: 'Completed & Tested',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
          desc: 'Job completed, hardware bench-tested in your presence, and handover confirmed.'
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          color: 'bg-red-500/10 text-red-400 border-red-500/30',
          dot: 'bg-red-400',
          desc: 'This service request was cancelled.'
        };
      default:
        return {
          label: s || 'Queued',
          color: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
          dot: 'bg-slate-400',
          desc: 'Request status is currently being updated.'
        };
    }
  };

  const statusInfo = result ? getStatusBadge(result.status) : null;

  const whatsappMessage = result
    ? `Hello Safiullah! I am inquiring about my service request (${result.id}) for ${result.serviceRequired}.`
    : `Hello Safiullah! I need assistance tracking my service request in Peshawar.`;

  const whatsappUrl = getWhatsAppLink(settings.whatsappNumber, whatsappMessage);

  return (
    <div className="space-y-12 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Breadcrumb items={[{ label: 'Home', page: 'home' }, { label: 'Track Request' }]} onNavigate={onNavigate} />

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto my-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3.5 py-1 text-xs font-mono font-medium text-blue-300 mb-3">
            <Search className="h-3.5 w-3.5 text-blue-400" />
            <span>REAL-TIME STATUS LOOKUP</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
            TRACK SERVICE REQUEST
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Enter your Reference ID (e.g., <span className="font-mono text-blue-400">REQ-2026-XXXX</span>) or registered phone number to check current dispatch & appointment status.
          </p>
        </div>

        {/* Search Bar Panel */}
        <div className="rounded-3xl skeuo-panel p-6 sm:p-8 shadow-2xl relative">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-2">
                Reference Tracking ID or Phone Number
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="h-5 w-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. REQ-2026-00123 or 0300 1234567"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl skeuo-input text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="skeuo-btn-primary px-7 py-3.5 rounded-xl text-xs font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer font-mono shrink-0"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>Check Status</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Error / Not Found Message */}
          {error && (
            <div className="mt-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold text-rose-200">Request Not Found</div>
                <p className="text-slate-300">{error}</p>
                <p className="text-[11px] text-slate-400 pt-1">
                  Tip: Reference IDs are case-sensitive and formatted like <span className="font-mono text-blue-300">REQ-2026-XXXX</span>. If you need assistance, please contact us on WhatsApp directly with your name.
                </p>
              </div>
            </div>
          )}

          {/* Valid Search Result Card */}
          {result && statusInfo && (
            <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-6">
              {/* Status Banner */}
              <div className="rounded-2xl p-5 skeuo-card border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Current Dispatch Status
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono border ${statusInfo.color}`}>
                      <span className={`w-2 h-2 rounded-full ${statusInfo.dot} animate-pulse`} />
                      {statusInfo.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 max-w-md">
                    {statusInfo.desc}
                  </p>
                </div>

                <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
                  <span className="text-[11px] font-mono text-slate-400 block">Reference ID</span>
                  <span className="font-mono font-bold text-blue-400 text-sm">{result.id}</span>
                  {result.scheduledTime && (
                    <div className="mt-2 text-xs text-emerald-400 font-mono font-semibold flex items-center justify-end gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{result.scheduledTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Detail Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl skeuo-inset space-y-1.5">
                  <span className="text-slate-400 text-[11px]">Requested Service</span>
                  <div className="font-bold text-white text-sm">{result.serviceRequired}</div>
                  <div className="text-slate-400">Device: <span className="text-slate-200">{result.deviceType} {result.computerBrandModel ? `(${result.computerBrandModel})` : ''}</span></div>
                </div>

                <div className="p-4 rounded-xl skeuo-inset space-y-1.5">
                  <span className="text-slate-400 text-[11px]">On-Site Location & Timing</span>
                  <div className="font-bold text-white text-sm flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-rose-400" />
                    <span>{result.area}</span>
                  </div>
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-blue-400" />
                    <span>{result.preferredDate} ({result.preferredTime})</span>
                  </div>
                </div>
              </div>

              {/* Transparent Disclaimer */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3.5 text-[11px] text-amber-200/80 leading-relaxed font-mono">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400 inline mr-1 -mt-0.5" />
                <span className="font-semibold text-amber-300">Appointment Confirmation Policy:</span> Submitting a request places your service into the queue. The technician confirms the final on-site appointment via phone call or WhatsApp before dispatching.
              </div>

              {/* Direct Communication Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto skeuo-btn-emerald px-5 py-2.5 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-center gap-2 font-mono"
                >
                  <MessageSquare className="h-4 w-4 text-emerald-400" />
                  <span>Ask Safiullah on WhatsApp</span>
                </a>

                <a
                  href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`}
                  className="w-full sm:w-auto skeuo-btn px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 font-mono"
                >
                  <Phone className="h-3.5 w-3.5 text-blue-400" />
                  <span>Call {settings.phoneNumber}</span>
                </a>
              </div>
            </div>
          )}

          {/* Initial Helper Empty State */}
          {!result && !error && !hasSearched && (
            <div className="mt-8 pt-6 border-t border-slate-800/80 text-center py-6 text-slate-400 space-y-2">
              <HelpCircle className="h-8 w-8 mx-auto text-slate-600 mb-2" />
              <p className="text-xs">
                Lost your Reference ID? You can also track using the phone number you entered during booking.
              </p>
              <div className="text-[11px] text-slate-500 font-mono">
                Need to book a new appointment?{' '}
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                >
                  Submit a Service Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
