import React from 'react';
import { 
  Inbox, 
  Clock, 
  CalendarCheck, 
  CheckCircle2, 
  PlusCircle, 
  ExternalLink, 
  Activity, 
  ArrowUpRight,
  MapPin,
  Phone,
  MessageSquare,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { ServiceRequest, ActivityLog } from '../../types';
import { getWhatsAppLink } from '../../utils/whatsapp';
import { formatPKTTime } from '../../utils/dateTime';

interface AdminDashboardProps {
  bookings: ServiceRequest[];
  activityLogs?: ActivityLog[];
  onNavigateTab: (tab: string, subTab?: string) => void;
  onOpenNewBookingModal: () => void;
}

export function AdminDashboard({
  bookings,
  activityLogs = [],
  onNavigateTab,
  onOpenNewBookingModal
}: AdminDashboardProps) {
  // Compute metric counts
  const newRequests = bookings.filter(b => b.status === 'NEW' || b.status === 'pending');
  const pendingBookings = bookings.filter(b => b.status === 'CONTACTED' || b.status === 'APPOINTMENT REQUESTED' || b.status === 'contacted');
  const confirmedVisits = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'confirmed');
  const completedJobs = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'completed');
  const urgentCount = bookings.filter(b => b.urgency === 'Urgent' && (b.status === 'NEW' || b.status === 'CONTACTED')).length;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Notification Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">Peshawar Dispatch Active</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Operational Command Dashboard</h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time overview of on-site computer support requests, appointments & technician activity.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewBookingModal}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Manual Appointment</span>
          </button>
        </div>
      </div>

      {/* TODAY'S METRIC CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            TODAY AT A GLANCE
          </span>
          {urgentCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
              <AlertTriangle className="h-3 w-3" />
              {urgentCount} Urgent Request{urgentCount > 1 ? 's' : ''} Need Attention
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. New Requests */}
          <div 
            onClick={() => onNavigateTab('requests')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-500/20 p-4.5 hover:border-blue-500/40 transition-all cursor-pointer shadow-lg shadow-blue-950/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">New Requests</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                <Inbox className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{newRequests.length}</span>
              <span className="text-[11px] text-blue-400">Fresh submissions</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-blue-300">
              <span>Respond to client</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* 2. Pending Bookings */}
          <div 
            onClick={() => onNavigateTab('bookings', 'upcoming')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/20 p-4.5 hover:border-amber-500/40 transition-all cursor-pointer shadow-lg shadow-amber-950/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Pending Bookings</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{pendingBookings.length}</span>
              <span className="text-[11px] text-amber-400">Contacted / Scheduling</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-amber-300">
              <span>Confirm visit slot</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* 3. Confirmed Visits */}
          <div 
            onClick={() => onNavigateTab('bookings', 'upcoming')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/20 p-4.5 hover:border-purple-500/40 transition-all cursor-pointer shadow-lg shadow-purple-950/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Confirmed Visits</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                <CalendarCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{confirmedVisits.length}</span>
              <span className="text-[11px] text-purple-400">Scheduled on-site</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-purple-300">
              <span>View itinerary</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* 4. Completed Jobs */}
          <div 
            onClick={() => onNavigateTab('bookings', 'completed')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/20 p-4.5 hover:border-emerald-500/40 transition-all cursor-pointer shadow-lg shadow-emerald-950/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Completed Jobs</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{completedJobs.length}</span>
              <span className="text-[11px] text-emerald-400">Successful fixes</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-emerald-300">
              <span>View case history</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMNS: Scheduled Visits & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Confirmed Appointments Today / Tomorrow */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                Confirmed On-Site Itinerary
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('bookings', 'upcoming')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              View Calendar →
            </button>
          </div>

          {confirmedVisits.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No confirmed visits scheduled yet today. Check new requests to confirm appointments.
            </div>
          ) : (
            <div className="space-y-3">
              {confirmedVisits.map((item) => {
                const whatsappUrl = getWhatsAppLink(
                  item.whatsapp || item.phone,
                  `Hello ${item.fullName}! This is Safiullah, computer technician in Peshawar. I am messaging regarding our confirmed appointment for your ${item.deviceType}.`
                );

                return (
                  <div 
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">{item.fullName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          {item.scheduledTime || item.preferredTime}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                          {item.computerBrandModel || item.deviceType}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin className="h-3.5 w-3.5 text-blue-400" />
                          {item.area}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-blue-300">{item.serviceRequired}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold border border-emerald-500/30 transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${item.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Live Activity Stream */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
              Recent CMS Activity
            </h3>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
            {activityLogs.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No recent activity recorded yet.</p>
            ) : (
              activityLogs.slice(0, 8).map((log) => (
                <div 
                  key={log.id} 
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{log.action}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatPKTTime(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{log.details}</p>
                  <div className="text-[10px] text-slate-500 font-mono pt-1">By: {log.user}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
