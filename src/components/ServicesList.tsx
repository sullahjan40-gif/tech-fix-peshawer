import { ServiceItem } from '../types';
import { 
  Laptop, 
  HardDrive, 
  ShieldAlert, 
  Cpu, 
  Wrench, 
  Gauge, 
  Layers, 
  KeyRound, 
  Building2, 
  Clock, 
  Check, 
  Calendar
} from 'lucide-react';

interface ServicesListProps {
  services: ServiceItem[];
  onBookService: (serviceName: string) => void;
  onViewDeepDive: (serviceKey: string) => void;
}

export function ServicesList({ services, onBookService, onViewDeepDive }: ServicesListProps) {
  // Map icon strings to Lucide components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor':
      case 'Laptop': return Laptop;
      case 'HardDrive': return HardDrive;
      case 'ShieldAlert': return ShieldAlert;
      case 'Cpu': return Cpu;
      case 'Wrench': return Wrench;
      case 'Gauge': return Gauge;
      case 'Layers': return Layers;
      case 'KeyRound': return KeyRound;
      case 'Building2': return Building2;
      default: return Wrench;
    }
  };

  return (
    <section id="services" className="py-14 sm:py-20 relative border-y border-slate-900 bg-slate-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our Core Services
            </h2>
            <p className="mt-2 text-sm sm:text-base text-stone-300">
              Complete computer and IT solutions — simple, fast and reliable.
            </p>
          </div>
          <div>
            <button
              onClick={() => onBookService('')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <span>View All Services</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = getIcon(service.icon);
            return (
              <div
                key={service.id}
                id={`service-card-${service.key}`}
                className="group relative rounded-2xl skeuo-card p-6 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon + Turnaround */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="rounded-xl skeuo-btn p-3 text-blue-400 group-hover:text-cyan-300 transition-all overflow-hidden flex items-center justify-center">
                      {service.customIcon ? (
                        <img src={service.customIcon} alt="" className="h-6 w-6 object-contain" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full skeuo-badge px-3 py-1 text-[11px] font-mono text-slate-300">
                      <span className="skeuo-led-emerald"></span>
                      <Clock className="h-3 w-3 text-cyan-400" />
                      <span>{service.turnaround}</span>
                    </div>
                  </div>

                  {/* Title & Short Desc */}
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors mb-2 font-mono">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Warning / Important callout if any */}
                  {service.warningNote && (
                    <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-950/30 p-2.5 text-[11px] text-amber-300 font-medium skeuo-inset">
                      ⚠️ {service.warningNote}
                    </div>
                  )}

                  {/* Pricing Badge */}
                  <div className="mb-4 p-3 rounded-xl skeuo-inset">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400 font-mono">Starting Price:</span>
                      <span className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
                        {service.priceStarting}
                      </span>
                    </div>
                    {service.priceNote && (
                      <div className="mt-1 text-[10px] text-slate-400 italic">
                        {service.priceNote}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2.5">
                  <button
                    onClick={() => onBookService(service.title)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl skeuo-btn-primary px-3.5 py-2.5 text-xs font-bold text-white transition-all cursor-pointer font-mono"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Book Service</span>
                  </button>

                  {['windows-installation', 'os-migration', 'data-recovery', 'blue-screen', 'bulk-windows'].includes(service.key) && (
                    <button
                      onClick={() => onViewDeepDive(service.key)}
                      className="rounded-xl skeuo-btn px-3 py-2.5 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer font-mono"
                    >
                      Process & Details
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing disclaimer note */}
        <div className="mt-8 rounded-xl skeuo-panel p-4 text-xs text-slate-400 text-center max-w-2xl mx-auto relative">
          <div className="absolute top-2 left-2"><span className="skeuo-screw"></span></div>
          <div className="absolute top-2 right-2"><span className="skeuo-screw"></span></div>
          <span className="font-semibold text-slate-200 font-mono">Transparent Pricing Policy:</span> Final pricing depends on computer specifications, specific problem complexity, travel distance within Peshawar, and required hardware parts (e.g. SSD, RAM). Quoted clearly before work begins.
        </div>

      </div>
    </section>
  );
}
