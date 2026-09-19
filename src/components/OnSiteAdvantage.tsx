import { 
  XCircle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Eye, 
  Car, 
  PackageOpen, 
  CalendarCheck
} from 'lucide-react';
import { ComparisonStepItem } from '../types';

interface OnSiteAdvantageProps {
  customShopSteps?: ComparisonStepItem[];
  customOurSteps?: ComparisonStepItem[];
  onOpenBooking: () => void;
}

export function OnSiteAdvantage({ customShopSteps, customOurSteps, onOpenBooking }: OnSiteAdvantageProps) {
  const defaultShopSteps = [
    { step: '01', title: 'PACK COMPUTER', desc: 'Unplug cables, pack heavy tower or delicate laptop into bag', status: 'published' },
    { step: '02', title: 'TRAVEL', desc: 'Drive through Peshawar traffic, Saddar or Board Bazar congestion', status: 'published' },
    { step: '03', title: 'WAIT IN SHOP', desc: 'Stand in line waiting for technician to become free', status: 'published' },
    { step: '04', title: 'EXPLAIN PROBLEM', desc: 'Rush to explain issue to counter clerk, not the technician', status: 'published' },
    { step: '05', title: 'LEAVE COMPUTER', desc: 'Leave your personal computer, sensitive files, and logins behind for days', status: 'published' },
    { step: '06', title: 'RETURN LATER', desc: 'Make a second trip back to pick it up, hoping it was actually fixed', status: 'published' },
  ];

  const defaultOurSteps = [
    { step: '01', title: 'CONTACT ONLINE', desc: 'Reach out on WhatsApp or fill our simple 60-second form', status: 'published' },
    { step: '02', title: 'BOOK A TIME', desc: 'Choose a date and time that fits your exact schedule', status: 'published' },
    { step: '03', title: 'WE COME TO YOU', desc: 'Technician arrives at your home, hostel, or office in Peshawar', status: 'published' },
    { step: '04', title: 'DIAGNOSE IN FRONT OF YOU', desc: 'Full diagnostic performed right before your eyes with no mystery', status: 'published' },
    { step: '05', title: 'SOLVE THE PROBLEM', desc: 'Clean installation, SSD upgrade, or driver repair completed on-site', status: 'published' },
    { step: '06', title: 'TEST & VERIFY', desc: 'Verify everything runs smoothly together before you make payment', status: 'published' },
  ];

  const rawShop = (customShopSteps && customShopSteps.length > 0) ? customShopSteps : defaultShopSteps;
  const shopSteps = rawShop.filter((s: any) => s.status !== 'unpublished');

  const rawOur = (customOurSteps && customOurSteps.length > 0) ? customOurSteps : defaultOurSteps;
  const ourSteps = rawOur.filter((s: any) => s.status !== 'unpublished');

  return (
    <section id="why-on-site" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full skeuo-badge px-3.5 py-1 text-xs font-mono font-medium text-blue-300 mb-3">
            <span className="skeuo-led-blue"></span>
            <span>THE ON-SITE ADVANTAGE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
            WHY TAKE YOUR COMPUTER TO A SHOP?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            <strong className="text-white">YOUR TIME MATTERS.</strong> Not every problem requires a workshop visit. For suitable services, on-site support allows the problem to be assessed and solved at your home or office.
          </p>
        </div>

        {/* Comparison Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* TRADITIONAL SHOP WAY (Negative) */}
          <div className="rounded-3xl skeuo-panel p-6 sm:p-8 flex flex-col justify-between relative border border-rose-950/50">
            <div className="absolute top-3 left-3"><span className="skeuo-screw"></span></div>
            <div className="absolute top-3 right-3"><span className="skeuo-screw"></span></div>
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-rose-900/40">
                <div className="flex items-center gap-2.5">
                  <XCircle className="h-5 w-5 text-rose-500" />
                  <h3 className="text-lg font-bold text-slate-200 font-mono">
                    The Traditional Repair Shop
                  </h3>
                </div>
                <span className="skeuo-badge text-rose-400 font-mono text-xs px-2.5 py-1 rounded">
                  WASTED HOURS & HASSLE
                </span>
              </div>

              <div className="space-y-4">
                {shopSteps.map((item) => (
                  <div key={item.step} className="flex items-start gap-3.5 text-slate-400 skeuo-card p-3 rounded-xl">
                    <span className="text-xs font-mono font-bold text-rose-400/80 skeuo-inset px-2 py-0.5 rounded shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-300 font-mono">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-rose-900/30 text-xs text-rose-300/80 flex items-center gap-2 font-mono">
              <Clock className="h-4 w-4 shrink-0 text-rose-400" />
              <span>Result: Multiple trips, lost days without your machine, risk to private data.</span>
            </div>
          </div>

          {/* OUR ON-SITE SERVICE (Positive & Premium) */}
          <div className="rounded-3xl skeuo-panel p-6 sm:p-8 shadow-2xl flex flex-col justify-between relative">
            <div className="absolute top-3 left-3"><span className="skeuo-screw"></span></div>
            <div className="absolute top-3 right-3"><span className="skeuo-screw"></span></div>

            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-blue-800/40">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white font-mono">
                    Our On-Site Solution
                  </h3>
                </div>
                <span className="skeuo-badge text-emerald-400 font-mono text-xs px-2.5 py-1 rounded flex items-center gap-1.5">
                  <span className="skeuo-led-emerald"></span>
                  WE COME TO YOU
                </span>
              </div>

              <div className="space-y-4">
                {ourSteps.map((item) => (
                  <div key={item.step} className="flex items-start gap-3.5 text-slate-300 skeuo-card p-3 rounded-xl">
                    <span className="text-xs font-mono font-bold text-cyan-300 skeuo-badge px-2 py-0.5 rounded shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white font-mono">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-300 mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-blue-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-cyan-300 font-medium">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Zero travel. Watch repair in real time. Data stays safe.</span>
              </div>
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn-primary px-4 py-2.5 text-xs font-bold text-white cursor-pointer font-mono"
              >
                <CalendarCheck className="h-3.5 w-3.5" />
                <span>Book On-Site Visit</span>
              </button>
            </div>
          </div>

        </div>

        {/* 3 Core Trust Pillars */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl skeuo-card p-5 flex items-start gap-3.5">
            <div className="rounded-xl skeuo-btn p-2.5 text-blue-400 shrink-0">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1 font-mono">Complete Transparency</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Work is carried out right in front of you. You see every step, test, and setting applied to your machine.
              </p>
            </div>
          </div>

          <div className="rounded-2xl skeuo-card p-5 flex items-start gap-3.5">
            <div className="rounded-xl skeuo-btn p-2.5 text-emerald-400 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1 font-mono">Data Privacy Intact</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Never hand over personal laptops with sensitive photos, assignments, or accounts to unknown third-party shops.
              </p>
            </div>
          </div>

          <div className="rounded-2xl skeuo-card p-5 flex items-start gap-3.5">
            <div className="rounded-xl skeuo-btn p-2.5 text-cyan-400 shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1 font-mono">Same-Day Completion</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Most services (Windows installation, SSD upgrade, thermal servicing) are completed within 1 to 2 hours of arrival.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
