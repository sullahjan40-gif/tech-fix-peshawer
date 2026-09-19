import React, { useState } from 'react';
import { 
  Inbox, 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  Mail,
  MessageSquare, 
  MapPin, 
  Laptop, 
  Trash2, 
  Save, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight,
  ShieldAlert,
  Calendar as CalendarIcon,
  DollarSign,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { ServiceRequest, SiteSettings } from '../../types';
import { 
  updateBooking, 
  deleteBooking, 
  createBooking, 
  confirmBookingAppointment, 
  contactBookingCustomer,
  sendManualBookingConfirmationEmail 
} from '../../utils/api';
import { 
  getWhatsAppLink, 
  generateInquiryWhatsAppMessage, 
  generateConfirmationWhatsAppMessage 
} from '../../utils/whatsapp';
import { formatPKTDateTime, formatPKTTime } from '../../utils/dateTime';

interface AdminRequestsAndBookingsProps {
  bookings: ServiceRequest[];
  settings: SiteSettings;
  mode: 'requests' | 'bookings';
  initialSubTab?: string;
  onRefresh: () => void;
  serviceAreas?: string[];
}

export function AdminRequestsAndBookings({
  bookings,
  settings,
  mode,
  initialSubTab = 'all',
  onRefresh,
  serviceAreas = []
}: AdminRequestsAndBookingsProps) {
  const [filter, setFilter] = useState<string>(initialSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<ServiceRequest | null>(null);

  // Status & Notes Editing State
  const [editingStatus, setEditingStatus] = useState<ServiceRequest['status']>('NEW');
  const [adminNotes, setAdminNotes] = useState('');
  const [scheduledTimeInput, setScheduledTimeInput] = useState('');
  const [savingItem, setSavingItem] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteNotice, setDeleteNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Dedicated Action Center States: Confirm Appointment & Contact
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmSlotInput, setConfirmSlotInput] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [technicianNoteInput, setTechnicianNoteInput] = useState('');
  const [actionProcessing, setActionProcessing] = useState(false);
  const [actionNotice, setActionNotice] = useState<{
    type: 'success' | 'error';
    message: string;
    waLink?: string;
    waLabel?: string;
  } | null>(null);

  // Manual Booking Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState<Partial<ServiceRequest>>({
    fullName: '',
    phone: '',
    whatsapp: '',
    area: serviceAreas[0] || 'University Town',
    fullAddress: '',
    deviceType: 'Laptop',
    computerBrandModel: '',
    serviceRequired: 'General Diagnostics & Repair',
    problemDescription: '',
    urgency: 'Normal',
    hasImportantData: false,
    status: 'CONFIRMED',
    preferredTime: 'Today Afternoon (2:00 PM – 5:00 PM)',
    scheduledTime: 'Today 3:00 PM'
  });

  // When selectedBooking changes, update inputs
  React.useEffect(() => {
    if (selectedBooking) {
      setEditingStatus(selectedBooking.status);
      setAdminNotes(selectedBooking.adminNotes || '');
      const defaultSlot = selectedBooking.scheduledTime || (
        (selectedBooking as any).preferredDate 
          ? `${(selectedBooking as any).preferredDate} (${selectedBooking.preferredTime || 'Morning (10:00 AM – 1:00 PM)'})` 
          : selectedBooking.preferredTime || 'Tomorrow Morning (10:00 AM – 1:00 PM)'
      );
      setScheduledTimeInput(defaultSlot);
      setConfirmSlotInput(defaultSlot);
      setTechnicianNoteInput(`Our technician has received your service request for ${selectedBooking.serviceRequired} (${selectedBooking.deviceType}) and is reaching out to coordinate the visit.`);
      setActionNotice(null);
    }
  }, [selectedBooking]);

  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleSendConfirmationEmailManual = async () => {
    if (!selectedBooking || isSendingEmail) return;
    setIsSendingEmail(true);
    try {
      const res = await sendManualBookingConfirmationEmail(
        selectedBooking.id,
        confirmSlotInput.trim() || scheduledTimeInput.trim() || selectedBooking.scheduledTime
      );
      if (res.success) {
        setActionNotice({
          type: 'success',
          message: res.message || `Confirmation email delivered to ${selectedBooking.email}!`,
          waLink: actionNotice?.waLink,
          waLabel: actionNotice?.waLabel
        });
      } else {
        setActionNotice({
          type: 'error',
          message: res.error || 'Failed to dispatch confirmation email.'
        });
      }
    } catch (err: any) {
      setActionNotice({
        type: 'error',
        message: err?.message || 'Failed to send confirmation email.'
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Handle Action 1: Confirm Appointment
  const handleConfirmAppointment = async () => {
    if (!selectedBooking || actionProcessing) return;
    setActionProcessing(true);
    setActionNotice(null);

    const slotToConfirm = confirmSlotInput.trim() || scheduledTimeInput.trim() || `${(selectedBooking as any).preferredDate || 'Tomorrow'} (${selectedBooking.preferredTime || 'Morning'})`;

    try {
      const res = await confirmBookingAppointment(selectedBooking.id, {
        scheduledTime: slotToConfirm,
        adminNotes: adminNotes.trim() || undefined,
        sendEmail: false
      });

      const updated = {
        ...selectedBooking,
        status: 'CONFIRMED' as const,
        scheduledTime: slotToConfirm,
        adminNotes: adminNotes.trim() || selectedBooking.adminNotes
      };
      setSelectedBooking(updated);
      setEditingStatus('CONFIRMED');
      setScheduledTimeInput(slotToConfirm);

      const waMessage = generateConfirmationWhatsAppMessage(
        updated,
        slotToConfirm,
        adminNotes.trim() || undefined
      );
      const waLink = getWhatsAppLink(selectedBooking.phone || selectedBooking.whatsapp || '', waMessage);

      setActionNotice({
        type: 'success',
        message: res.message || `Appointment confirmed (Schedule: ${slotToConfirm}). Ready to dispatch via WhatsApp or manual email.`,
        waLink,
        waLabel: 'Send Confirmation on WhatsApp'
      });

      setIsConfirmOpen(false);
      onRefresh();
    } catch (err: any) {
      console.error('Failed to confirm appointment:', err);
      setActionNotice({
        type: 'error',
        message: err?.message || 'Failed to confirm appointment. Please try again.'
      });
    } finally {
      setActionProcessing(false);
    }
  };

  // Handle Action 2: Contact / Technician Note
  const handleContactCustomer = async () => {
    if (!selectedBooking || actionProcessing) return;
    setActionProcessing(true);
    setActionNotice(null);

    const note = technicianNoteInput.trim() || 'Our technician is reviewing your service request and will contact you via WhatsApp.';

    try {
      const res = await contactBookingCustomer(selectedBooking.id, {
        technicianNote: note,
        adminNotes: adminNotes.trim() || undefined,
        sendEmail: false
      });

      const updated = {
        ...selectedBooking,
        status: 'CONTACTED' as const,
        adminNotes: adminNotes.trim() || selectedBooking.adminNotes
      };
      setSelectedBooking(updated);
      setEditingStatus('CONTACTED');

      const waMessage = generateInquiryWhatsAppMessage({
        id: selectedBooking.id,
        fullName: selectedBooking.fullName,
        phone: selectedBooking.phone,
        whatsapp: selectedBooking.whatsapp,
        email: selectedBooking.email,
        subject: selectedBooking.serviceRequired,
        service: selectedBooking.serviceRequired,
        area: selectedBooking.area,
        message: `${note}\n\nClient Problem Description:\n${selectedBooking.problemDescription}`,
        createdAt: selectedBooking.createdAt
      });
      const waLink = getWhatsAppLink(selectedBooking.phone || selectedBooking.whatsapp || '', waMessage);

      setActionNotice({
        type: 'success',
        message: res.message || `Marked as contacted. Ready to message on WhatsApp.`,
        waLink,
        waLabel: 'Chat with Customer on WhatsApp'
      });

      setIsContactOpen(false);
      onRefresh();
    } catch (err: any) {
      console.error('Failed to send contact notice:', err);
      setActionNotice({
        type: 'error',
        message: err?.message || 'Failed to send contact notification. Please try again.'
      });
    } finally {
      setActionProcessing(false);
    }
  };

  // Filtering Logic
  const filteredBookings = bookings.filter(b => {
    // Mode condition:
    if (mode === 'requests') {
      if (filter === 'urgent') return b.urgency === 'Urgent';
      if (filter === 'data_flag') return b.hasImportantData === true;
      if (filter === 'new') return b.status === 'NEW' || b.status === 'pending';
      if (filter === 'contacted') return b.status === 'CONTACTED' || b.status === 'contacted';
      if (filter === 'confirmed') return b.status === 'CONFIRMED' || b.status === 'confirmed';
    } else {
      // mode === 'bookings'
      if (filter === 'upcoming') return b.status === 'CONFIRMED' || b.status === 'confirmed';
      if (filter === 'completed') return b.status === 'COMPLETED' || b.status === 'completed';
      if (filter === 'calendar') return b.status !== 'COMPLETED' && b.status !== 'CANCELLED';
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.fullName?.toLowerCase().includes(q);
      const matchPhone = b.phone?.includes(q) || b.whatsapp?.includes(q);
      const matchArea = b.area?.toLowerCase().includes(q);
      const matchIssue = b.problemDescription?.toLowerCase().includes(q);
      return matchName || matchPhone || matchArea || matchIssue;
    }

    return true;
  });

  const handleSaveDetails = async () => {
    if (!selectedBooking) return;
    setSavingItem(true);
    try {
      await updateBooking(selectedBooking.id, {
        status: editingStatus,
        adminNotes,
        scheduledTime: scheduledTimeInput
      });
      setSelectedBooking({
        ...selectedBooking,
        status: editingStatus,
        adminNotes,
        scheduledTime: scheduledTimeInput
      });
      onRefresh();
    } catch (err) {
      alert("Failed to update booking status");
    } finally {
      setSavingItem(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id || isDeleting) return;
    setIsDeleting(true);
    setDeleteNotice(null);
    try {
      await deleteBooking(id);
      if (selectedBooking?.id === id) {
        setSelectedBooking(null);
      }
      setConfirmDeleteId(null);
      setDeleteNotice({ type: 'success', message: 'Record deleted successfully from database & cloud.' });
      setTimeout(() => setDeleteNotice(null), 3500);
      onRefresh();
    } catch (err: any) {
      console.error("Failed to delete booking:", err);
      setDeleteNotice({ type: 'error', message: err?.message || 'Could not delete booking. Please try again.' });
      setTimeout(() => setDeleteNotice(null), 4000);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.fullName || !manualForm.phone) {
      alert("Please enter customer name and phone");
      return;
    }

    try {
      await createBooking(manualForm);
      setIsManualModalOpen(false);
      onRefresh();
      setManualForm({
        fullName: '',
        phone: '',
        whatsapp: '',
        area: serviceAreas[0] || 'University Town',
        fullAddress: '',
        deviceType: 'Laptop',
        computerBrandModel: '',
        serviceRequired: 'General Diagnostics & Repair',
        problemDescription: '',
        urgency: 'Normal',
        hasImportantData: false,
        status: 'CONFIRMED'
      });
    } catch (err) {
      alert("Failed to create manual appointment");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {mode === 'requests' ? (
              <>
                <Inbox className="h-5 w-5 text-blue-400" />
                Customer Service Requests
              </>
            ) : (
              <>
                <CalendarCheck className="h-5 w-5 text-purple-400" />
                Appointments & Bookings Schedule
              </>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'requests' 
              ? 'Triage and respond to incoming customer repair inquiries across Peshawar.' 
              : 'Manage confirmed on-site visits, scheduling slots and completed service logs.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Manual Appointment</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {mode === 'requests' ? (
            <>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Requests ({bookings.length})
              </button>
              <button
                onClick={() => setFilter('urgent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  filter === 'urgent' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                🚨 Urgent ({bookings.filter(b => b.urgency === 'Urgent').length})
              </button>
              <button
                onClick={() => setFilter('data_flag')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  filter === 'data_flag' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                🛡️ Important Data ({bookings.filter(b => b.hasImportantData).length})
              </button>
              <button
                onClick={() => setFilter('new')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  filter === 'new' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                New ({bookings.filter(b => b.status === 'NEW' || b.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('contacted')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  filter === 'contacted' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Contacted ({bookings.filter(b => b.status === 'CONTACTED' || b.status === 'contacted').length})
              </button>
              <button
                onClick={() => setFilter('confirmed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  filter === 'confirmed' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Scheduled & Confirmed ({bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'confirmed').length})
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  filter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  filter === 'upcoming' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Upcoming Confirmed ({bookings.filter(b => b.status === 'CONFIRMED').length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  filter === 'completed' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Completed Jobs ({bookings.filter(b => b.status === 'COMPLETED').length})
              </button>
              <button
                onClick={() => setFilter('calendar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  filter === 'calendar' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Schedule Flow
              </button>
            </>
          )}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client, phone, area..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Main Split View: Left List / Right Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Bookings Feed */}
        <div className="lg:col-span-6 space-y-3 max-h-[700px] overflow-y-auto pr-1">
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
              No matching records found.
            </div>
          ) : (
            filteredBookings.map((item) => {
              const isSelected = selectedBooking?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedBooking(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500/80 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">{item.fullName}</span>
                        {item.urgency === 'Urgent' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                            URGENT
                          </span>
                        )}
                        {item.hasImportantData && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            DATA CRITICAL
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="text-slate-300 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-blue-400" />
                          {item.area}
                        </span>
                        <span>•</span>
                        <span className="text-slate-400">{item.phone}</span>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-1 mt-1 font-medium">
                        {item.serviceRequired} — {item.problemDescription}
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 ${
                      item.status === 'NEW' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      item.status === 'CONFIRMED' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      item.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
                    <span>{formatPKTDateTime(item.createdAt)}</span>
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBooking(item);
                          setIsConfirmOpen(true);
                          setIsContactOpen(false);
                        }}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-950/90 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 transition-all flex items-center gap-1 cursor-pointer"
                        title="Confirm Appointment"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Confirm</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBooking(item);
                          setIsContactOpen(true);
                          setIsConfirmOpen(false);
                        }}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-blue-950/90 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 transition-all flex items-center gap-1 cursor-pointer"
                        title="Contact Customer"
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>Contact</span>
                      </button>
                      <a
                        href={getWhatsAppLink(
                          item.whatsapp || item.phone,
                          item.status === 'CONFIRMED'
                            ? generateConfirmationWhatsAppMessage(item)
                            : generateInquiryWhatsAppMessage({
                                id: item.id,
                                fullName: item.fullName,
                                phone: item.phone,
                                whatsapp: item.whatsapp,
                                email: item.email,
                                subject: item.serviceRequired,
                                service: item.serviceRequired,
                                area: item.area,
                                message: item.problemDescription,
                                createdAt: item.createdAt
                              })
                        )}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-600/10 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer"
                        title="Open formatted WhatsApp template"
                      >
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Booking Detail & Triage Inspector */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sticky top-4 space-y-6">
          {selectedBooking ? (
            <div className="space-y-6">
              {/* Client Title & Actions */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{selectedBooking.fullName}</h3>
                    <span className="text-xs font-mono text-slate-500">#{selectedBooking.id.slice(-6)}</span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-400" />
                    <span>{selectedBooking.area} {selectedBooking.fullAddress ? `— ${selectedBooking.fullAddress}` : ''}</span>
                  </div>
                  {selectedBooking.email && (
                    <div className="text-xs text-blue-400 flex items-center gap-1.5 mt-1 font-mono">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span>{selectedBooking.email}</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">Confirmation Sent</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={getWhatsAppLink(
                      selectedBooking.whatsapp || selectedBooking.phone,
                      selectedBooking.status === 'CONFIRMED'
                        ? generateConfirmationWhatsAppMessage(selectedBooking)
                        : generateInquiryWhatsAppMessage({
                            id: selectedBooking.id,
                            fullName: selectedBooking.fullName,
                            phone: selectedBooking.phone,
                            whatsapp: selectedBooking.whatsapp,
                            email: selectedBooking.email,
                            subject: selectedBooking.serviceRequired,
                            service: selectedBooking.serviceRequired,
                            area: selectedBooking.area,
                            message: selectedBooking.problemDescription,
                            createdAt: selectedBooking.createdAt
                          })
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                    title="WhatsApp Client (Formatted Template)"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </a>
                  <a
                    href={`tel:${selectedBooking.phone}`}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    title="Call Phone"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                  {confirmDeleteId === selectedBooking.id ? (
                    <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-500/50 p-1 rounded-xl">
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDelete(selectedBooking.id)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-red-600 hover:bg-red-500 text-white cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        {isDeleting ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            <span>Deleting...</span>
                          </>
                        ) : (
                          <span>Confirm Delete</span>
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 rounded-lg text-[11px] bg-slate-800 text-slate-300 hover:text-white cursor-pointer disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(selectedBooking.id)}
                      disabled={isDeleting}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete Record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Action Notification (Delete status, etc.) */}
              {deleteNotice && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  deleteNotice.type === 'success' 
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
                    : 'bg-red-500/10 border border-red-500/30 text-red-300'
                }`}>
                  {deleteNotice.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                  )}
                  <span>{deleteNotice.message}</span>
                </div>
              )}

              {/* Action Notice (Confirmation / Contact Email dispatch feedback) */}
              {actionNotice && (
                <div className={`p-4 rounded-xl text-xs space-y-2.5 border shadow-sm ${
                  actionNotice.type === 'success'
                    ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200'
                    : 'bg-red-950/70 border-red-500/40 text-red-200'
                }`}>
                  <div className="flex items-start gap-2.5">
                    {actionNotice.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                    )}
                    <div className="flex-1 leading-relaxed font-medium">
                      {actionNotice.message}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-500/30 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-emerald-300">Customer Communication:</span>
                    <div className="flex items-center gap-2">
                      {selectedBooking.email && (
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
                      {actionNotice.waLink && (
                        <a
                          href={actionNotice.waLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all cursor-pointer"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{actionNotice.waLabel || 'Send on WhatsApp'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── ADMIN ACTION CENTER: CONFIRM APPOINTMENT & CONTACT BUTTONS ── */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3.5 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[11px] font-mono font-bold tracking-wider text-slate-300 uppercase">
                      Admin Quick Actions
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Target: {selectedBooking.email || 'Email required'}
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
                        : selectedBooking.status === 'CONFIRMED'
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
                        : selectedBooking.status === 'CONTACTED'
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
                        Confirm Scheduled Arrival Slot
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Ref #{selectedBooking.id}</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Arrival Time for Technician:
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
                        Target Customer Email: {selectedBooking.email ? <span className="text-emerald-300 underline">{selectedBooking.email}</span> : <span className="text-amber-400">None on record</span>}
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
                        {selectedBooking.email && (
                          <button
                            type="button"
                            onClick={handleSendConfirmationEmailManual}
                            disabled={actionProcessing || isSendingEmail}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow cursor-pointer disabled:opacity-50"
                            title="Manually dispatch confirmation email to customer"
                          >
                            {isSendingEmail ? (
                              <>
                                <RefreshCw className="h-3 w-3 animate-spin" />
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
                          onClick={handleConfirmAppointment}
                          disabled={actionProcessing}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 disabled:opacity-50 cursor-pointer"
                        >
                          {actionProcessing ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
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
                        Technician Contact & Diagnostics Update
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Ref #{selectedBooking.id}</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Technician Note for Customer:
                      </label>
                      <textarea
                        rows={2}
                        value={technicianNoteInput}
                        onChange={(e) => setTechnicianNoteInput(e.target.value)}
                        placeholder="e.g. Our technician has reviewed your issue and will reach out via WhatsApp..."
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/20 text-[11px] text-blue-200/90 leading-relaxed">
                      ✉️ <strong>Automated Email Action:</strong> Sends a technician update email to <span className="underline font-semibold">{selectedBooking.email || 'customer email'}</span> informing them our technician is contacting them, and providing quick links to WhatsApp.
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
                        onClick={handleContactCustomer}
                        disabled={actionProcessing}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 disabled:opacity-50 cursor-pointer"
                      >
                        {actionProcessing ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
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

              {/* Urgency & Critical Data Flags */}
              {(selectedBooking.urgency === 'Urgent' || selectedBooking.hasImportantData) && (
                <div className="space-y-2">
                  {selectedBooking.urgency === 'Urgent' && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                      <div>
                        <span className="font-bold">Urgent Service Requested:</span> Customer needs same-day resolution if available.
                      </div>
                    </div>
                  )}
                  {selectedBooking.hasImportantData && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" />
                      <div>
                        <span className="font-bold">Critical Customer Data Flag:</span> Customer states important personal/work files are on this machine. Handle drives with caution before any OS deployment.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Machine & Problem Diagnostic Details */}
              <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Device Type</span>
                    <span className="text-slate-200 font-semibold">{selectedBooking.deviceType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Brand / Model</span>
                    <span className="text-slate-200 font-semibold">{selectedBooking.computerBrandModel || 'Not Specified'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Requested Service</span>
                  <span className="text-blue-300 font-semibold">{selectedBooking.serviceRequired}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Customer Problem Description</span>
                  <p className="text-slate-300 mt-1 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    "{selectedBooking.problemDescription}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Submitted: {formatPKTDateTime(selectedBooking.createdAt)} (PKT)</span>
                  <span>Slot: {selectedBooking.preferredTime}</span>
                </div>
              </div>

              {/* Status Updater & Dispatch Controls */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Appointment Status</label>
                    <select
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value as any)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="NEW">NEW (Fresh Request)</option>
                      <option value="CONTACTED">CONTACTED (Discussion in progress)</option>
                      <option value="CONFIRMED">CONFIRMED (Appointment Scheduled)</option>
                      <option value="IN_PROGRESS">IN PROGRESS (On-Site Visiting)</option>
                      <option value="COMPLETED">COMPLETED (Fixed & Paid)</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Scheduled Visit Slot</label>
                    <input
                      type="text"
                      value={scheduledTimeInput}
                      onChange={(e) => setScheduledTimeInput(e.target.value)}
                      placeholder="e.g. Tomorrow 4:00 PM"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Internal Technician Notes</label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g. Brought 512GB Kingston NVMe SSD. Customer approved Rs. 6,500 total including installation."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={handleSaveDetails}
                    disabled={savingItem}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    <span>{savingItem ? 'Updating...' : 'Update Status & Notes'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <Inbox className="h-8 w-8 mx-auto text-slate-600" />
              <p className="text-xs">Select any request or booking from the left list to view customer diagnostics, update appointment status, or message via WhatsApp.</p>
            </div>
          )}
        </div>
      </div>

      {/* MANUAL APPOINTMENT CREATION MODAL */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form 
            onSubmit={handleCreateManual}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Manual Appointment</h3>
              <button 
                type="button" 
                onClick={() => setIsManualModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={manualForm.fullName}
                  onChange={(e) => setManualForm({ ...manualForm, fullName: e.target.value })}
                  placeholder="Full Name"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Email (For Auto-Receipt)</label>
                <input
                  type="email"
                  value={manualForm.email || ''}
                  onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                  placeholder="customer@gmail.com"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={manualForm.phone}
                  onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                  placeholder="0300 1234567"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp</label>
                <input
                  type="text"
                  value={manualForm.whatsapp}
                  onChange={(e) => setManualForm({ ...manualForm, whatsapp: e.target.value })}
                  placeholder="0300 1234567"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Peshawar Area</label>
              <select
                value={manualForm.area}
                onChange={(e) => setManualForm({ ...manualForm, area: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
              >
                {(serviceAreas.length ? serviceAreas : ['University Town', 'Hayatabad', 'Cantt', 'Saddar']).map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Service Required</label>
              <input
                type="text"
                value={manualForm.serviceRequired}
                onChange={(e) => setManualForm({ ...manualForm, serviceRequired: e.target.value })}
                placeholder="e.g. Windows 11 Clean Reinstall & SSD Installation"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Description</label>
              <textarea
                rows={2}
                value={manualForm.problemDescription}
                onChange={(e) => setManualForm({ ...manualForm, problemDescription: e.target.value })}
                placeholder="Symptoms described by client..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Urgency</label>
                <select
                  value={manualForm.urgency}
                  onChange={(e) => setManualForm({ ...manualForm, urgency: e.target.value as any })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent (Same-Day)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Scheduled Time</label>
                <input
                  type="text"
                  value={manualForm.scheduledTime}
                  onChange={(e) => setManualForm({ ...manualForm, scheduledTime: e.target.value })}
                  placeholder="e.g. Today 5:00 PM"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-500"
              >
                Create Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
