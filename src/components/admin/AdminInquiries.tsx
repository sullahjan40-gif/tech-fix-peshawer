import React, { useState } from 'react';
import { 
  Inbox, 
  Mail, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RotateCw, 
  Trash2, 
  Search, 
  Filter, 
  Send,
  ExternalLink,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { LeadInquiry } from '../../types';
import { 
  resendInquiryEmail, 
  updateInquiryStatus, 
  deleteInquiry, 
  confirmInquiryAppointment, 
  contactInquiryCustomer,
  sendManualInquiryConfirmationEmail 
} from '../../utils/api';
import { formatPKTDateTime, formatPKTTime } from '../../utils/dateTime';
import { 
  getWhatsAppLink, 
  generateInquiryWhatsAppMessage, 
  generateConfirmationWhatsAppMessage 
} from '../../utils/whatsapp';

interface AdminInquiriesProps {
  inquiries: LeadInquiry[];
  onRefresh: () => void;
}

export function AdminInquiries({ inquiries, onRefresh }: AdminInquiriesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEW' | 'CONTACTED' | 'CONVERTED' | 'ARCHIVED'>('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState<LeadInquiry | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Dedicated Action Center: Confirm Appointment & Contact
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmSlotInput, setConfirmSlotInput] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [technicianNoteInput, setTechnicianNoteInput] = useState('');
  const [actionProcessing, setActionProcessing] = useState(false);
  const [leadActionBanner, setLeadActionBanner] = useState<{
    type: 'success' | 'error';
    message: string;
    waLink?: string;
    waLabel?: string;
  } | null>(null);

  React.useEffect(() => {
    if (selectedInquiry) {
      const defaultSlot = (selectedInquiry as any).preferredDate 
        ? `${(selectedInquiry as any).preferredDate} (${(selectedInquiry as any).preferredTime || 'Morning (10:00 AM – 1:00 PM)'})`
        : 'Tomorrow Morning (10:00 AM – 1:00 PM)';
      setConfirmSlotInput(defaultSlot);
      setTechnicianNoteInput(`Our technician has received your inquiry for ${selectedInquiry.service || selectedInquiry.subject} and is contacting you on WhatsApp to coordinate details.`);
      setIsConfirmOpen(false);
      setIsContactOpen(false);
      setLeadActionBanner(null);
    }
  }, [selectedInquiry]);

  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleSendConfirmationEmailManual = async () => {
    if (!selectedInquiry || isSendingEmail) return;
    setIsSendingEmail(true);
    try {
      const res = await sendManualInquiryConfirmationEmail(
        selectedInquiry.id,
        confirmSlotInput.trim() || undefined
      );
      if (res.success) {
        setLeadActionBanner({
          type: 'success',
          message: res.message || `Confirmation email delivered to ${selectedInquiry.email}!`,
          waLink: leadActionBanner?.waLink,
          waLabel: leadActionBanner?.waLabel
        });
      } else {
        setLeadActionBanner({
          type: 'error',
          message: res.error || 'Failed to dispatch confirmation email.'
        });
      }
    } catch (err: any) {
      setLeadActionBanner({
        type: 'error',
        message: err?.message || 'Failed to send confirmation email.'
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleConfirmLead = async () => {
    if (!selectedInquiry || actionProcessing) return;
    setActionProcessing(true);
    setLeadActionBanner(null);

    const slotToConfirm = confirmSlotInput.trim() || 'Tomorrow Morning (10:00 AM – 1:00 PM)';

    try {
      const res = await confirmInquiryAppointment(selectedInquiry.id, {
        scheduledTime: slotToConfirm,
        sendEmail: false
      });

      setSelectedInquiry({
        ...selectedInquiry,
        status: 'CONVERTED'
      });

      const waMessage = generateConfirmationWhatsAppMessage(
        {
          id: selectedInquiry.bookingId || selectedInquiry.id,
          fullName: selectedInquiry.fullName,
          phone: selectedInquiry.phone,
          whatsapp: selectedInquiry.whatsapp,
          area: selectedInquiry.area,
          serviceRequired: selectedInquiry.service || selectedInquiry.subject,
          deviceType: (selectedInquiry as any).deviceType || 'Computer',
          computerBrandModel: (selectedInquiry as any).computerBrandModel || '',
          scheduledTime: slotToConfirm,
          problemDescription: selectedInquiry.message,
          createdAt: selectedInquiry.createdAt
        },
        slotToConfirm
      );
      const waLink = getWhatsAppLink(selectedInquiry.phone || selectedInquiry.whatsapp || '', waMessage);

      setLeadActionBanner({
        type: 'success',
        message: res.message || `Lead converted to confirmed appointment (Arrival slot: ${slotToConfirm}). Ready to dispatch via WhatsApp or manual email.`,
        waLink,
        waLabel: 'Send Confirmation on WhatsApp'
      });

      setIsConfirmOpen(false);
      onRefresh();
    } catch (err: any) {
      console.error('Failed to confirm lead appointment:', err);
      setLeadActionBanner({
        type: 'error',
        message: err?.message || 'Failed to confirm appointment. Please try again.'
      });
    } finally {
      setActionProcessing(false);
    }
  };

  const handleContactLead = async () => {
    if (!selectedInquiry || actionProcessing) return;
    setActionProcessing(true);
    setLeadActionBanner(null);

    const note = technicianNoteInput.trim() || 'Our technician is reviewing your request and will contact you via WhatsApp.';

    try {
      const res = await contactInquiryCustomer(selectedInquiry.id, {
        technicianNote: note,
        sendEmail: false
      });

      setSelectedInquiry({
        ...selectedInquiry,
        status: 'CONTACTED'
      });

      const waMessage = generateInquiryWhatsAppMessage(selectedInquiry);
      const waLink = getWhatsAppLink(selectedInquiry.phone || selectedInquiry.whatsapp || '', waMessage);

      setLeadActionBanner({
        type: 'success',
        message: res.message || `Marked as contacted. Ready to message on WhatsApp.`,
        waLink,
        waLabel: 'Chat with Customer on WhatsApp'
      });

      setIsContactOpen(false);
      onRefresh();
    } catch (err: any) {
      console.error('Failed to send contact notice:', err);
      setLeadActionBanner({
        type: 'error',
        message: err?.message || 'Failed to send contact notification. Please try again.'
      });
    } finally {
      setActionProcessing(false);
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesStatus;

    const matchesSearch = 
      inq.fullName.toLowerCase().includes(q) ||
      inq.phone.toLowerCase().includes(q) ||
      (inq.email && inq.email.toLowerCase().includes(q)) ||
      (inq.subject && inq.subject.toLowerCase().includes(q)) ||
      (inq.message && inq.message.toLowerCase().includes(q)) ||
      (inq.area && inq.area.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const handleResend = async (inq: LeadInquiry) => {
    setResendingId(inq.id);
    setActionNotice(null);
    try {
      const res = await resendInquiryEmail(inq.id);
      setActionNotice({
        type: 'success',
        text: res.message || `Email sent successfully to ${inq.emailNotificationSentTo || 'administrator'}!`
      });
      onRefresh();
      if (selectedInquiry && selectedInquiry.id === inq.id && res.inquiry) {
        setSelectedInquiry(res.inquiry);
      }
    } catch (err: any) {
      setActionNotice({
        type: 'error',
        text: err.message || 'Failed to resend notification email.'
      });
    } finally {
      setResendingId(null);
    }
  };

  const handleStatusChange = async (inqId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    setActionNotice(null);
    try {
      const res = await updateInquiryStatus(inqId, newStatus);
      if (selectedInquiry && selectedInquiry.id === inqId) {
        setSelectedInquiry(res.inquiry);
      }
      setActionNotice({
        type: 'success',
        text: `Lead status updated to ${newStatus}.`
      });
      onRefresh();
    } catch (err: any) {
      setActionNotice({
        type: 'error',
        text: "Failed to update status: " + (err.message || 'Unknown error')
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async (inqId: string) => {
    setIsDeletingId(inqId);
    setActionNotice(null);
    try {
      await deleteInquiry(inqId);
      if (selectedInquiry?.id === inqId) {
        setSelectedInquiry(null);
      }
      setConfirmDeleteId(null);
      setActionNotice({
        type: 'success',
        text: 'Lead inquiry removed successfully.'
      });
      onRefresh();
    } catch (err: any) {
      console.error("Failed to delete inquiry:", err);
      setActionNotice({
        type: 'error',
        text: "Failed to delete inquiry: " + (err?.message || 'Server error')
      });
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-400" />
            Lead Inquiries & Contact Forms
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Incoming website queries and lead forms with automated multi-provider email delivery tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            Total Leads: <strong className="text-blue-400">{inquiries.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            New: <strong className="text-emerald-400">{inquiries.filter(i => i.status === 'NEW').length}</strong>
          </span>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
          actionNotice.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {actionNotice.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />}
            <span>{actionNotice.text}</span>
          </div>
          <button 
            onClick={() => setActionNotice(null)}
            className="text-slate-400 hover:text-white text-xs underline cursor-pointer ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, phone, area..."
            className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['ALL', 'NEW', 'CONTACTED', 'CONVERTED', 'ARCHIVED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Grid / Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Inquiries List */}
        <div className={`space-y-3 ${selectedInquiry ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
          {filteredInquiries.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <Inbox className="h-10 w-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-300">No Inquiries Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'No lead inquiries match your current filter or search query.'
                  : 'When customers submit questions or request quotes via the website, they will appear here.'}
              </p>
            </div>
          ) : (
            filteredInquiries.map((inq) => {
              const isSelected = selectedInquiry?.id === inq.id;
              const isSent = inq.emailNotificationStatus === 'sent';
              const isPending = inq.emailNotificationStatus === 'credentials_pending';
              const cleanWa = (inq.whatsapp || inq.phone || '').replace(/[^0-9]/g, '');
              const waNumber = cleanWa.startsWith('0') ? '92' + cleanWa.slice(1) : cleanWa;

              return (
                <div
                  key={inq.id}
                  onClick={() => setSelectedInquiry(inq)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-slate-800/90 border-blue-500 ring-1 ring-blue-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{inq.fullName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          inq.status === 'NEW'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : inq.status === 'CONTACTED'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : inq.status === 'CONVERTED'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-xs text-blue-300 font-medium mt-0.5">{inq.subject}</p>
                    </div>

                    {/* Email Delivery Telemetry Badge */}
                    <div className="shrink-0 text-right">
                      {isSent ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          <span>Delivered via {(inq.emailNotificationProvider || 'SMTP').toUpperCase()}</span>
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          <Clock className="h-3 w-3 text-amber-400" />
                          <span>Logged / Fallback</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                          <Send className="h-3 w-3 text-blue-400" />
                          <span>{inq.emailNotificationStatus || 'Dispatched'}</span>
                        </span>
                      )}
                      <span className="block text-[10px] text-slate-500 font-mono mt-1">
                        {formatPKTDateTime(inq.createdAt)} (PKT)
                      </span>
                    </div>
                  </div>

                  {/* Snippet */}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 font-sans">
                    {inq.message}
                  </p>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono pt-1">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Phone className="h-3 w-3 text-blue-400" />
                        {inq.phone}
                      </span>
                      {inq.area && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <MapPin className="h-3 w-3 text-emerald-400" />
                          {inq.area}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInquiry(inq);
                          setIsConfirmOpen(true);
                          setIsContactOpen(false);
                        }}
                        className="px-2 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 transition-all text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer"
                        title="Confirm Appointment & Send Confirmation Email"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Confirm</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInquiry(inq);
                          setIsContactOpen(true);
                          setIsConfirmOpen(false);
                        }}
                        className="px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition-all text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer"
                        title="Contact Customer & Send Update Email"
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>Contact</span>
                      </button>

                      <a
                        href={getWhatsAppLink(
                          inq.phone || inq.whatsapp || '',
                          inq.status === 'CONVERTED'
                            ? generateConfirmationWhatsAppMessage(inq)
                            : generateInquiryWhatsAppMessage(inq)
                        )}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-1 rounded bg-emerald-600/10 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/20 transition-all text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer"
                        title="Send formatted inquiry message on WhatsApp"
                      >
                        WhatsApp
                      </a>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResend(inq);
                        }}
                        disabled={resendingId === inq.id}
                        className="px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition-all text-[10px] font-bold inline-flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                        title="Resend email notification"
                      >
                        <RotateCw className={`h-3 w-3 ${resendingId === inq.id ? 'animate-spin' : ''}`} />
                        {resendingId === inq.id ? 'Sending...' : 'Resend Email'}
                      </button>

                      {confirmDeleteId === inq.id ? (
                        <div 
                          className="flex items-center gap-1 bg-rose-950/90 border border-rose-500/50 px-1.5 py-0.5 rounded-lg"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleDelete(inq.id)}
                            disabled={isDeletingId === inq.id}
                            className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                          >
                            {isDeletingId === inq.id && <RotateCw className="h-2.5 w-2.5 animate-spin" />}
                            {isDeletingId === inq.id ? 'Deleting...' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={isDeletingId === inq.id}
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(inq.id);
                          }}
                          className="p-1 rounded bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition-all text-[10px] font-bold inline-flex items-center cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Detailed Inspection Panel */}
        {selectedInquiry && (
          <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 sticky top-4">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">LEAD DETAILS</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedInquiry.fullName}</h3>
                <p className="text-xs text-blue-400 font-medium">{selectedInquiry.subject}</p>
              </div>

              <div className="flex items-center gap-2">
                {confirmDeleteId === selectedInquiry.id ? (
                  <div className="flex items-center gap-1.5 bg-rose-950/90 border border-rose-500/50 px-2 py-1 rounded-xl">
                    <button
                      onClick={() => handleDelete(selectedInquiry.id)}
                      disabled={isDeletingId === selectedInquiry.id}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      {isDeletingId === selectedInquiry.id && <RotateCw className="h-3 w-3 animate-spin" />}
                      {isDeletingId === selectedInquiry.id ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      disabled={isDeletingId === selectedInquiry.id}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(selectedInquiry.id)}
                    className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer flex items-center gap-1 text-xs font-medium"
                    title="Delete Lead"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedInquiry(null);
                    setConfirmDeleteId(null);
                  }}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-lg bg-slate-800 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Email Notification Telemetry Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Email Notification Telemetry
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedInquiry.emailNotificationStatus === 'sent'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}>
                  Status: {(selectedInquiry.emailNotificationStatus || 'pending').toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 pt-1">
                <div>
                  <span className="text-slate-500 block">Sent To:</span>
                  <span className="text-white truncate block">{selectedInquiry.emailNotificationSentTo || 'ullahsafiullah117@gmail.com'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Provider Used:</span>
                  <span className="text-emerald-400 font-bold uppercase">
                    {selectedInquiry.emailNotificationProvider || 'SMTP'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Dispatched At:</span>
                  <span>{formatPKTDateTime(selectedInquiry.emailNotificationSentAt || selectedInquiry.createdAt)} (PKT)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Lead ID:</span>
                  <span className="text-slate-400 truncate block">{selectedInquiry.id}</span>
                </div>
              </div>

              {selectedInquiry.emailNotificationError && (
                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] font-mono mt-1">
                  Note: {selectedInquiry.emailNotificationError}
                </div>
              )}

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Need to trigger another copy?</span>
                <button
                  onClick={() => handleResend(selectedInquiry)}
                  disabled={resendingId === selectedInquiry.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow"
                >
                  <RotateCw className={`h-3 w-3 ${resendingId === selectedInquiry.id ? 'animate-spin' : ''}`} />
                  <span>{resendingId === selectedInquiry.id ? 'Sending...' : 'Dispatch Email Again'}</span>
                </button>
              </div>
            </div>

            {/* Action Banner (Email dispatch status & WhatsApp quick send) */}
            {leadActionBanner && (
              <div className={`p-4 rounded-xl text-xs space-y-2.5 border shadow-sm ${
                leadActionBanner.type === 'success'
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200'
                  : 'bg-red-950/70 border-red-500/40 text-red-200'
              }`}>
                <div className="flex items-start gap-2.5">
                  {leadActionBanner.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                  )}
                  <div className="flex-1 leading-relaxed font-medium">
                    {leadActionBanner.message}
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-500/30 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-emerald-300">Customer Communication:</span>
                  <div className="flex items-center gap-2">
                    {selectedInquiry.email && (
                      <button
                        type="button"
                        onClick={handleSendConfirmationEmailManual}
                        disabled={isSendingEmail}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-all cursor-pointer disabled:opacity-50"
                        title="Send confirmation email manually to customer"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span>{isSendingEmail ? 'Sending...' : 'Send Confirmation Email'}</span>
                      </button>
                    )}
                    {leadActionBanner.waLink && (
                      <a
                        href={leadActionBanner.waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all cursor-pointer"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{leadActionBanner.waLabel || 'Open WhatsApp'}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── ADMIN ACTION CENTER: CONFIRM APPOINTMENT & CONTACT BUTTONS ── */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] font-mono font-bold tracking-wider text-slate-300 uppercase">
                    Lead Action Center
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Target: {selectedInquiry.email || 'Email required'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Button 1: Confirm Appointment */}
                <button
                  type="button"
                  onClick={() => {
                    setIsContactOpen(false);
                    setIsConfirmOpen(!isConfirmOpen);
                  }}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm ${
                    isConfirmOpen
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400'
                      : selectedInquiry.status === 'CONVERTED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Confirm Appointment</span>
                </button>

                {/* Button 2: Contact / Technician Note */}
                <button
                  type="button"
                  onClick={() => {
                    setIsConfirmOpen(false);
                    setIsContactOpen(!isContactOpen);
                  }}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm ${
                    isContactOpen
                      ? 'bg-blue-600 text-white shadow-blue-600/30 ring-2 ring-blue-400'
                      : selectedInquiry.status === 'CONTACTED'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30'
                      : 'bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-500/40'
                  }`}
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-blue-400" />
                  <span>Contact / Tech Note</span>
                </button>
              </div>

              {/* Sub-Panel 1: Confirm Appointment Details Form */}
              {isConfirmOpen && (
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-3 mt-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      Convert Lead & Confirm Scheduled Slot
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Ref #{selectedInquiry.id}</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Confirmed Arrival Time Slot:
                    </label>
                    <input
                      type="text"
                      value={confirmSlotInput}
                      onChange={(e) => setConfirmSlotInput(e.target.value)}
                      placeholder="e.g. 2026-09-15 (Morning (10:00 AM – 1:00 PM))"
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-200/90 leading-relaxed space-y-1">
                    <div><strong>Channel Control:</strong> Confirm appointment and dispatch via <strong>WhatsApp</strong> or <strong>Manual Email</strong>.</div>
                    <div className="text-[10px] text-slate-400">
                      Target Email: {selectedInquiry.email ? <span className="text-emerald-300 underline">{selectedInquiry.email}</span> : <span className="text-amber-400">None on record</span>}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsConfirmOpen(false)}
                      disabled={actionProcessing || isSendingEmail}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>

                    <div className="flex items-center gap-2">
                      {selectedInquiry.email && (
                        <button
                          type="button"
                          onClick={handleSendConfirmationEmailManual}
                          disabled={actionProcessing || isSendingEmail}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow cursor-pointer disabled:opacity-50"
                          title="Manually dispatch confirmation email to customer"
                        >
                          {isSendingEmail ? (
                            <>
                              <RotateCw className="h-3 w-3 animate-spin" />
                              <span>Sending Email...</span>
                            </>
                          ) : (
                            <>
                              <Mail className="h-3 w-3" />
                              <span>Send Confirmation Email</span>
                            </>
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleConfirmLead}
                        disabled={actionProcessing}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 disabled:opacity-50 cursor-pointer"
                      >
                        {actionProcessing ? (
                          <>
                            <RotateCw className="h-3.5 w-3.5 animate-spin" />
                            <span>Saving Schedule...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Confirm & Ready WhatsApp</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Panel 2: Contact Customer Details Form */}
              {isContactOpen && (
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-blue-500/40 space-y-3 mt-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
                      Technician Contact & Update
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Ref #{selectedInquiry.id}</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Technician Note for Customer:
                    </label>
                    <textarea
                      rows={2}
                      value={technicianNoteInput}
                      onChange={(e) => setTechnicianNoteInput(e.target.value)}
                      placeholder="e.g. Our technician has reviewed your request and is reaching out via WhatsApp..."
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/20 text-[11px] text-blue-200/90 leading-relaxed">
                    ✉️ <strong>Automated Email Action:</strong> Sends an update email to <span className="underline font-semibold">{selectedInquiry.email || 'customer email'}</span> informing them our technician is contacting them.
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsContactOpen(false)}
                      disabled={actionProcessing}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleContactLead}
                      disabled={actionProcessing}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 disabled:opacity-50 cursor-pointer"
                    >
                      {actionProcessing ? (
                        <>
                          <RotateCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Sending Email...</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Send Contact Email</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Client Contact Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-500 text-[10px] font-mono block">PHONE NUMBER</span>
                <a href={`tel:${selectedInquiry.phone}`} className="text-blue-400 font-bold hover:underline mt-0.5 block">
                  {selectedInquiry.phone}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-500 text-[10px] font-mono block">EMAIL ADDRESS</span>
                {selectedInquiry.email ? (
                  <a href={`mailto:${selectedInquiry.email}`} className="text-blue-400 font-medium hover:underline mt-0.5 truncate block">
                    {selectedInquiry.email}
                  </a>
                ) : (
                  <span className="text-slate-400 mt-0.5 block">Not provided</span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-500 text-[10px] font-mono block">LOCATION / AREA</span>
                <span className="text-white font-medium mt-0.5 block">{selectedInquiry.area || 'Peshawar'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-500 text-[10px] font-mono block">INDICATED BUDGET</span>
                <span className="text-emerald-400 font-mono font-medium mt-0.5 block">{selectedInquiry.budget || 'Standard Quote'}</span>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block">CLIENT MESSAGE / PROBLEM DESCRIPTION</label>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Status Selector */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-mono text-slate-400 block">LEAD WORKFLOW STATUS</label>
              <div className="grid grid-cols-4 gap-2">
                {(['NEW', 'CONTACTED', 'CONVERTED', 'ARCHIVED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedInquiry.id, st)}
                    disabled={isUpdatingStatus}
                    className={`py-2 px-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                      selectedInquiry.status === st
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Interaction Buttons */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
              <a
                href={getWhatsAppLink(
                  selectedInquiry.phone || selectedInquiry.whatsapp || '',
                  selectedInquiry.status === 'CONVERTED'
                    ? generateConfirmationWhatsAppMessage(selectedInquiry)
                    : generateInquiryWhatsAppMessage(selectedInquiry)
                )}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
                title="Open WhatsApp with full customer query or confirmation template"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`tel:${selectedInquiry.phone}`}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
              >
                <Phone className="h-4 w-4" />
                <span>Call Phone</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
