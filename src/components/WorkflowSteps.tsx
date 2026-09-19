import { MessageSquare, MessageCircle, CalendarCheck, Home, ArrowRight } from 'lucide-react';
import { SiteSettings, WorkflowStepItem } from '../types';
import { getWhatsAppLink } from '../utils/whatsapp';

interface WorkflowStepsProps {
  settings: SiteSettings;
  customSteps?: WorkflowStepItem[];
  onOpenBooking: () => void;
}

export function WorkflowSteps({ settings, customSteps, onOpenBooking }: WorkflowStepsProps) {
  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    "Hello Safiullah! I'd like to book an on-site computer support visit in Peshawar."
  );

  const defaultSteps = [
    {
      num: 'STEP 01',
      title: 'CONTACT',
      desc: 'Send a quick WhatsApp message or submit our 60-second online service request.',
      icon: MessageCircle,
      accent: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
      status: 'published'
    },
    {
      num: 'STEP 02',
      title: 'EXPLAIN',
      desc: 'Tell me your computer brand/model (Dell, HP, Lenovo, Custom PC) and what issue you are experiencing.',
      icon: MessageSquare,
      accent: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
      status: 'published'
    },
    {
      num: 'STEP 03',
      title: 'BOOK',
      desc: 'Choose a suitable appointment time (Morning, Afternoon, Evening) for your home or office.',
      icon: CalendarCheck,
      accent: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
      status: 'published'
    },
    {
      num: 'STEP 04',
      title: 'VISIT & DIAGNOSE',
      desc: 'I come directly to your location in Peshawar with diagnostic gear, inspect the computer, and resolve the problem.',
      icon: Home,
      accent: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      status: 'published'
    }
  ];

  const stepIcons = [MessageCircle, MessageSquare, CalendarCheck, Home];

  const rawSteps = (customSteps && customSteps.length > 0) 
    ? customSteps.map((s, idx) => ({
        num: s.num || `STEP 0${idx + 1}`,
        title: s.title,
        desc: s.desc,
        icon: stepIcons[idx % stepIcons.length],
        status: s.status || 'published'
      }))
    : defaultSteps;

  const steps = rawSteps.filter((s) => s.status !== 'unpublished');

  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-slate-950/60 border-y border-slate-900 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full skeuo-badge px-3.5 py-1 text-xs font-mono font-medium text-slate-300 mb-3">
            <span className="skeuo-led-blue"></span>
            <span>EFFORTLESS BOOKING</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            HOW TO BOOK IN 4 SIMPLE STEPS
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            No complex signups or payment gates. Simple direct contact with your technician.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-2xl skeuo-card p-6 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400 tracking-wider skeuo-badge px-2 py-0.5 rounded">
                      {step.num}
                    </span>
                    <div className="p-2.5 rounded-xl skeuo-btn text-blue-400">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight font-mono">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Peshawar On-Site</span>
                  {idx < 3 && <span className="hidden lg:block text-slate-500">Next →</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner inside steps */}
        <div className="mt-10 rounded-2xl skeuo-panel p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative">
          <div className="absolute top-2 left-2"><span className="skeuo-screw"></span></div>
          <div className="absolute top-2 right-2"><span className="skeuo-screw"></span></div>
          <div>
            <div className="text-base font-bold text-white font-mono">
              Ready to fix your computer today?
            </div>
            <div className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Appointments confirmed quickly via WhatsApp or phone.
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenBooking}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn-primary px-5 py-2.5 text-xs font-bold text-white transition-all cursor-pointer font-mono"
            >
              <span>Book Appointment</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn-emerald px-4 py-2.5 text-xs font-bold text-emerald-200 transition-all font-mono"
            >
              <MessageCircle className="h-4 w-4 text-emerald-300" />
              <span>WhatsApp Now</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
