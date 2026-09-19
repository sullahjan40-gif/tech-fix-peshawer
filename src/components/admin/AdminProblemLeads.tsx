import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Laptop, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Save, 
  Trash2, 
  ExternalLink,
  ChevronDown,
  FileText,
  UserCheck,
  Send,
  X
} from 'lucide-react';
import { ProblemLead, SiteSettings } from '../../types';
import { 
  updateProblemLeadStatus, 
  updateProblemLeadNotes, 
  deleteProblemLead 
} from '../../utils/api';
import { getWhatsAppLink } from '../../utils/whatsapp';

interface AdminProblemLeadsProps {
  leads: ProblemLead[];
  settings: SiteSettings;
  onRefresh: () => void;
}

export function AdminProblemLeads({ leads, settings, onRefresh }: AdminProblemLeadsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEW' | 'RESEARCHING' | 'SOLVED' | 'CONTACTED' | 'ARCHIVED'>('ALL');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const handleStatusChange = async (leadId: string, newStatus: ProblemLead['status']) => {
    try {
      await updateProblemLeadStatus(leadId, newStatus);
      showMsg(`Inquiry status updated to ${newStatus}`);
      onRefresh();
    } catch (err) {
      showMsg("Failed to update status", "error");
    }
  };

  const handleSaveNotes = async (leadId: string) => {
    setSavingNote(true);
    try {
      await updateProblemLeadNotes(leadId, noteText);
      showMsg("Technician notes saved successfully");
      setEditingNotesId(null);
      onRefresh();
    } catch (err) {
      showMsg("Failed to save notes", "error");
    } finally {
      setSavingNote(false);
    }
  };

  const handleDelete = async (leadId: string) => {
    try {
      await deleteProblemLead(leadId);
      showMsg("Inquiry removed");
      setConfirmDeleteId(null);
      onRefresh();
    } catch (err) {
      showMsg("Failed to delete inquiry", "error");
    }
  };

  // WhatsApp Pre-filled message generator
  const getLeadWhatsAppUrl = (lead: ProblemLead) => {
    const formattedDate = new Date(lead.createdAt).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const snippet = lead.problemDescription.length > 80 
      ? `${lead.problemDescription.substring(0, 80)}...` 
      : lead.problemDescription;

    const message = `Hello ${lead.fullName}! This is Safiullah from TechFix Peshawar following up on your problem inquiry (Ref: #${lead.id}) submitted on ${formattedDate} regarding: "${snippet}". I have researched your issue and have an on-site diagnostic solution ready.`;

    const targetPhone = lead.whatsapp || lead.phone;
    return getWhatsAppLink(targetPhone, message);
  };

  const filteredLeads = leads.filter(l => {
    if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = l.fullName?.toLowerCase().includes(q);
      const matchPhone = l.phone?.toLowerCase().includes(q);
      const matchTitle = l.problemTitle?.toLowerCase().includes(q);
      const matchDesc = l.problemDescription?.toLowerCase().includes(q);
      const matchArea = l.area?.toLowerCase().includes(q);
      const matchId = l.id?.toLowerCase().includes(q);
      return matchName || matchPhone || matchTitle || matchDesc || matchArea || matchId;
    }
    return true;
  });

  const countNew = leads.filter(l => l.status === 'NEW').length;
  const countResearching = leads.filter(l => l.status === 'RESEARCHING').length;
  const countSolved = leads.filter(l => l.status === 'SOLVED').length;
  const countContacted = leads.filter(l => l.status === 'CONTACTED').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {statusMsg && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' 
            : 'bg-rose-950/80 text-rose-300 border-rose-500/50'
        }`}>
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Inbox className="h-5 w-5 text-emerald-400" />
            Problem Inquiry Leads & Diagnosis CRM
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track inquiries submitted via the "Problem Not Listed?" form. Research symptoms and follow up directly via 1-click WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {countNew > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {countNew} New Pending
            </span>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, phone, area, or symptom..."
            className="pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              statusFilter === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({leads.length})
          </button>
          <button
            onClick={() => setStatusFilter('NEW')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              statusFilter === 'NEW' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            New ({countNew})
          </button>
          <button
            onClick={() => setStatusFilter('RESEARCHING')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              statusFilter === 'RESEARCHING' ? 'bg-indigo-600 text-white' : 'text-indigo-400 hover:text-indigo-300'
            }`}
          >
            Researching ({countResearching})
          </button>
          <button
            onClick={() => setStatusFilter('SOLVED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              statusFilter === 'SOLVED' ? 'bg-teal-600 text-white' : 'text-teal-400 hover:text-teal-300'
            }`}
          >
            Solved ({countSolved})
          </button>
          <button
            onClick={() => setStatusFilter('CONTACTED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              statusFilter === 'CONTACTED' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:text-purple-300'
            }`}
          >
            Contacted ({countContacted})
          </button>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <Inbox className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No problem inquiries found.</p>
            <p className="text-xs text-slate-500 mt-1">Inquiries submitted from the public Problems & Solutions page will appear here instantly.</p>
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const formattedDate = new Date(lead.createdAt).toLocaleDateString('en-PK', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={lead.id}
                className={`rounded-2xl border p-5 transition-all space-y-4 ${
                  lead.status === 'NEW'
                    ? 'bg-emerald-950/20 border-emerald-800/60 shadow-lg shadow-emerald-950/20'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Top Row: Ref, Customer, Status, Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50">
                      {lead.id}
                    </span>
                    <h3 className="text-sm font-bold text-white">{lead.fullName}</h3>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-500" />
                      {formattedDate}
                    </span>
                    {lead.urgency === 'urgent' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        Urgent Need
                      </span>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Status:</span>
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold font-mono border focus:outline-none cursor-pointer ${
                        lead.status === 'NEW'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                          : lead.status === 'RESEARCHING'
                          ? 'bg-indigo-950 text-indigo-300 border-indigo-600'
                          : lead.status === 'SOLVED'
                          ? 'bg-teal-950 text-teal-300 border-teal-600'
                          : lead.status === 'CONTACTED'
                          ? 'bg-purple-950 text-purple-300 border-purple-600'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      <option value="NEW">NEW</option>
                      <option value="RESEARCHING">RESEARCHING</option>
                      <option value="SOLVED">SOLVED</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>

                    {confirmDeleteId === lead.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="px-2 py-1 rounded bg-rose-600 text-white text-xs font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(lead.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Problem Description & Device Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>{lead.problemTitle}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-mono">
                      {lead.problemDescription}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                    <div className="text-[11px] font-mono uppercase text-slate-500 font-bold">Contact & Location</div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="h-3.5 w-3.5 text-blue-400" />
                      <span className="font-mono">{lead.phone}</span>
                    </div>
                    {lead.email && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{lead.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="h-3.5 w-3.5 text-rose-400" />
                      <span>{lead.area}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Laptop className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{lead.deviceType}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons & Technician Notes */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* One-click WhatsApp with pre-filled template */}
                    <a
                      href={getLeadWhatsAppUrl(lead)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="skeuo-btn-emerald px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-1.5 hover:text-white"
                      title="Send pre-filled diagnostic message on WhatsApp"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>1-Click WhatsApp Follow-up</span>
                    </a>

                    {/* Direct Telephone Call */}
                    <a
                      href={`tel:${lead.phone}`}
                      className="skeuo-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-300 flex items-center gap-1.5 hover:text-white"
                    >
                      <Phone className="h-3.5 w-3.5 text-blue-400" />
                      <span>Call {lead.phone}</span>
                    </a>

                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}?subject=${encodeURIComponent(`TechFix Peshawar Diagnostic Follow-up (Ref: #${lead.id})`)}`}
                        className="skeuo-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-300 flex items-center gap-1.5 hover:text-white"
                      >
                        <Mail className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Email</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setEditingNotesId(editingNotesId === lead.id ? null : lead.id);
                      setNoteText(lead.technicianNotes || '');
                    }}
                    className="text-xs font-mono text-slate-400 hover:text-blue-400 flex items-center gap-1 cursor-pointer self-end sm:self-auto"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>{lead.technicianNotes ? 'Edit Diagnostic Notes' : '+ Add Tech Notes'}</span>
                  </button>
                </div>

                {/* Technician Notes Drawer */}
                {editingNotesId === lead.id && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-500/30 space-y-2 mt-2">
                    <label className="block text-xs font-mono font-bold text-blue-400">
                      Internal Diagnostic Research & Parts Notes
                    </label>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      rows={2}
                      placeholder="e.g. Recommended driver hotfix downloaded. Need to verify RAM stick slot 2 on arrival..."
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none font-mono"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="px-3 py-1 rounded-lg border border-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNotes(lead.id)}
                        disabled={savingNote}
                        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Save className="h-3 w-3" />
                        <span>{savingNote ? 'Saving...' : 'Save Notes'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Notes Display if already saved and not in edit mode */}
                {lead.technicianNotes && editingNotesId !== lead.id && (
                  <div className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-900/30 text-xs font-mono text-blue-200/90 flex items-start gap-2">
                    <span className="text-blue-400 font-bold shrink-0">Tech Note:</span>
                    <span>{lead.technicianNotes}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
