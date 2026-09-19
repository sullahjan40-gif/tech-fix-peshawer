import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Laptop, 
  MapPin, 
  Phone, 
  Mail,
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  Send,
  Copy,
  ExternalLink,
  Wrench
} from 'lucide-react';
import { ServiceItem, ServiceRequest } from '../types';
import { submitServiceRequest } from '../utils/api';
import { getWhatsAppLink, generateBookingWhatsAppMessage } from '../utils/whatsapp';

interface BookingFormProps {
  services: ServiceItem[];
  serviceAreas: string[];
  whatsappNumber: string;
  initialService?: string;
  initialProblem?: string;
  onSuccessSubmitted?: (booking: ServiceRequest) => void;
}

export function BookingForm({
  services,
  serviceAreas,
  whatsappNumber,
  initialService,
  initialProblem,
  onSuccessSubmitted
}: BookingFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [area, setArea] = useState(serviceAreas[0] || 'University Town');
  const [customArea, setCustomArea] = useState('');
  const [deviceType, setDeviceType] = useState<'Laptop' | 'Desktop' | 'Other'>('Laptop');
  const [computerBrandModel, setComputerBrandModel] = useState('');
  const [serviceRequired, setServiceRequired] = useState(initialService || services[0]?.title || 'Windows Installation & Setup');
  const [problemDescription, setProblemDescription] = useState(initialProblem || '');
  const [preferredDate, setPreferredDate] = useState(new Date().toISOString().split('T')[0]);
  const [preferredTime, setPreferredTime] = useState('Morning (10:00 AM – 1:00 PM)');
  const [urgency, setUrgency] = useState<'Normal' | 'Urgent'>('Normal');
  const [containsImportantData, setContainsImportantData] = useState<'YES' | 'NO'>('NO');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<ServiceRequest | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialService) setServiceRequired(initialService);
  }, [initialService]);

  useEffect(() => {
    if (initialProblem) setProblemDescription(initialProblem);
  }, [initialProblem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Email Address is required to submit a service request. Please provide your email to receive instant booking confirmation.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid email address (e.g. name@gmail.com).');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your primary phone number.');
      return;
    }
    if (!problemDescription.trim()) {
      setError('Please briefly describe what computer problem you are experiencing.');
      return;
    }

    setLoading(true);
    try {
      const selectedArea = area === 'Other Area' ? customArea || 'Peshawar Other' : area;
      const response = await submitServiceRequest({
        fullName,
        email: email.trim(),
        phone,
        whatsapp: whatsapp || phone,
        area: selectedArea,
        deviceType,
        computerBrandModel,
        serviceRequired,
        problemDescription,
        preferredDate,
        preferredTime,
        urgency,
        containsImportantData
      });

      setSubmittedBooking(response.booking);
      if (onSuccessSubmitted) {
        onSuccessSubmitted(response.booking);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting. Please try again or message via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    if (submittedBooking) {
      navigator.clipboard.writeText(submittedBooking.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const resetForm = () => {
    setSubmittedBooking(null);
    setProblemDescription('');
    setComputerBrandModel('');
  };

  return (
    <section id="book-service" className="py-16 sm:py-24 relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Section Header matching mockup */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-3.5 py-1 text-xs font-mono font-medium text-amber-300 mb-3">
            <Calendar className="h-3.5 w-3.5 text-amber-400" />
            <span>DIRECT ON-SITE DISPATCH</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Book On-Site Service Visit
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-300">
            Tell us about your computer issue and choose a convenient on-site time. We will contact you promptly to confirm your appointment.
          </p>
        </div>

        {/* Form or Confirmation Card */}
        <div className="rounded-3xl skeuo-panel p-6 sm:p-10 shadow-2xl relative">
          <div className="absolute top-3 left-3"><span className="skeuo-screw"></span></div>
          <div className="absolute top-3 right-3"><span className="skeuo-screw"></span></div>
          <div className="absolute bottom-3 left-3"><span className="skeuo-screw"></span></div>
          <div className="absolute bottom-3 right-3"><span className="skeuo-screw"></span></div>
          
          {submittedBooking ? (
            /* SUBMITTED CONFIRMATION STATE */
            <div className="text-center py-6 space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Dispatched to Technician (ullahsafiullah117@gmail.com)
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                  REQUEST RECEIVED
                </h3>
                <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-lg mx-auto">
                  Your service request has been received and emailed to the technician. We will contact you at <strong className="text-white font-mono">{submittedBooking.phone}</strong> to discuss the problem and confirm an appointment.
                </p>
              </div>

              {/* Crucial policy note as specified */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/30 p-4 max-w-md mx-auto text-xs text-amber-200/90 leading-relaxed skeuo-inset">
                <AlertTriangle className="h-4 w-4 text-amber-400 inline mr-1.5 -mt-0.5" />
                <span className="font-semibold">Notice:</span> Submitting this form does not automatically mean the appointment is confirmed. We will reach out directly to verify details, exact location, and time before dispatch.
              </div>

              {/* Reference ID and details */}
              <div className="rounded-2xl skeuo-card p-5 max-w-md mx-auto text-left text-xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400 font-mono">Reference Tracking ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-400 skeuo-badge px-2 py-0.5 rounded">{submittedBooking.id}</span>
                    <button
                      onClick={handleCopyId}
                      className="p-1.5 rounded-lg skeuo-btn text-slate-300 hover:text-white cursor-pointer"
                      title="Copy Reference ID"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                {copied && <div className="text-[10px] text-emerald-400 text-right font-mono">Copied to clipboard!</div>}
                
                <div className="flex justify-between items-center py-1 px-2 rounded-lg bg-blue-950/40 border border-blue-800/40 my-1">
                  <span className="text-slate-300 font-medium">Initial Status:</span>
                  <span className="font-mono font-bold text-blue-400 bg-blue-900/60 px-2 py-0.5 rounded text-[11px] uppercase tracking-wide border border-blue-700/50 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    {submittedBooking.status || 'NEW / QUEUED'}
                  </span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Customer:</span>
                  <span className="font-medium">{submittedBooking.fullName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Area:</span>
                  <span className="font-medium">{submittedBooking.area}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Service:</span>
                  <span className="text-right truncate max-w-[200px] font-medium">{submittedBooking.serviceRequired}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Preferred Slot:</span>
                  <span className="font-mono text-slate-200">{submittedBooking.preferredDate} ({submittedBooking.preferredTime})</span>
                </div>
                {submittedBooking.scheduledTime && (
                  <div className="flex justify-between text-emerald-300 pt-1 border-t border-slate-800/80 font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-emerald-400" />
                      Confirmed Schedule:
                    </span>
                    <span className="font-mono text-emerald-400">{submittedBooking.scheduledTime}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Contact Number:</span>
                  <span className="font-mono text-white">{submittedBooking.phone}</span>
                </div>
                {submittedBooking.email && (
                  <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Mail className="h-3 w-3 text-blue-400" />
                      Confirmation Email:
                    </span>
                    <span className="font-mono text-blue-400 truncate max-w-[180px]">{submittedBooking.email}</span>
                  </div>
                )}
              </div>

              {/* Instant WhatsApp bridge button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={getWhatsAppLink(
                    whatsappNumber,
                    generateBookingWhatsAppMessage(submittedBooking)
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto skeuo-btn-emerald inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs sm:text-sm font-bold text-emerald-200 cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4 text-emerald-300" />
                  <span>Speed Up via WhatsApp</span>
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-300" />
                </a>

                <button
                  onClick={resetForm}
                  className="w-full sm:w-auto rounded-xl skeuo-btn px-5 py-3 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE FORM */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3.5 text-xs text-rose-300 flex items-center gap-2 skeuo-inset">
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Row 1: Full Name & Email Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ahmad Khan"
                    className="w-full rounded-xl skeuo-input px-4 py-2.5 text-sm text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300 font-mono flex items-center gap-1">
                      <Mail className="h-3 w-3 text-blue-400" />
                      Email Address <span className="text-rose-400 font-bold">*</span> <span className="text-slate-500 font-normal">(For instant confirmation)</span>
                    </label>
                    <span className="text-[10px] text-blue-400 font-mono">Auto confirmation email</span>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full rounded-xl skeuo-input px-4 py-2.5 text-sm text-white placeholder-slate-500 font-mono"
                  />
                </div>
              </div>

              {/* Row 2: Phone Number & WhatsApp Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                    Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full rounded-xl skeuo-input px-4 py-2.5 text-sm text-white placeholder-slate-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                    WhatsApp Number (If different from phone)
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Same as phone if empty"
                    className="w-full rounded-xl skeuo-input px-4 py-2.5 text-sm text-white placeholder-slate-500 font-mono"
                  />
                </div>
              </div>

              {/* Row 3: Peshawar Area / Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                  Peshawar Area / Location <span className="text-rose-400">*</span>
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full rounded-xl skeuo-input px-4 py-2.5 text-sm text-white"
                >
                  {serviceAreas.map((a) => (
                    <option key={a} value={a} className="bg-slate-900 text-white">
                      {a}
                    </option>
                  ))}
                  <option value="Other Area" className="bg-slate-900 text-white">Other Location in Peshawar...</option>
                </select>
                {area === 'Other Area' && (
                  <input
                    type="text"
                    value={customArea}
                    onChange={(e) => setCustomArea(e.target.value)}
                    placeholder="Enter your exact town/colony in Peshawar"
                    className="mt-2 w-full rounded-xl skeuo-input px-4 py-2 text-xs text-white placeholder-slate-500"
                  />
                )}
              </div>

              {/* Row 3: Device Type & Computer Brand / Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                    Device Type <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Laptop', 'Desktop', 'Other'] as const).map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setDeviceType(type)}
                        className={`rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                          deviceType === type
                            ? 'skeuo-btn-primary text-white font-mono'
                            : 'skeuo-btn text-slate-300 hover:text-white font-mono'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                    Computer Brand / Model
                  </label>
                  <input
                    type="text"
                    value={computerBrandModel}
                    onChange={(e) => setComputerBrandModel(e.target.value)}
                    placeholder="e.g. Dell Latitude 5490, HP Pavilion, Custom Tower"
                    className="w-full rounded-xl skeuo-input px-4 py-2.5 text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Row 4: Service Required */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                  Service Required <span className="text-rose-400">*</span>
                </label>
                <select
                  value={serviceRequired}
                  onChange={(e) => setServiceRequired(e.target.value)}
                  className="w-full rounded-xl skeuo-input px-4 py-2.5 text-sm text-white"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.title} className="bg-slate-900 text-white">
                      {s.title} ({s.priceStarting})
                    </option>
                  ))}
                  <option value="Multiple PCs Bulk Deployment" className="bg-slate-900 text-white">Multiple PCs Bulk Deployment</option>
                  <option value="General Troubleshooting / Not Sure" className="bg-slate-900 text-white">General Troubleshooting / Diagnostic</option>
                </select>
              </div>

              {/* Row 5: Problem Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                  Problem Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Explain what is happening (e.g. Blue screen error MEMORY_MANAGEMENT, Windows 10 is very slow, need SSD fitted, won't turn on past logo...)"
                  className="w-full rounded-xl skeuo-input px-4 py-2.5 text-sm text-white placeholder-slate-500 leading-relaxed"
                />
              </div>

              {/* Row 6: Preferred Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full rounded-xl skeuo-input px-4 py-2.5 text-sm text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                    Preferred Time Window
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full rounded-xl skeuo-input px-4 py-2.5 text-sm text-white"
                  >
                    <option value="Morning (10:00 AM – 1:00 PM)" className="bg-slate-900 text-white">Morning (10:00 AM – 1:00 PM)</option>
                    <option value="Afternoon (1:30 PM – 4:30 PM)" className="bg-slate-900 text-white">Afternoon (1:30 PM – 4:30 PM)</option>
                    <option value="Evening (5:00 PM – 8:00 PM)" className="bg-slate-900 text-white">Evening (5:00 PM – 8:00 PM)</option>
                    <option value="Emergency / As Soon As Possible" className="bg-slate-900 text-white">Emergency / As Soon As Possible</option>
                  </select>
                </div>
              </div>

              {/* Row 7: Urgency & Important Data Safety Guard */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl skeuo-card">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                    Urgency Level
                  </label>
                  <div className="flex gap-2">
                    {(['Normal', 'Urgent'] as const).map((u) => (
                      <button
                        type="button"
                        key={u}
                        onClick={() => setUrgency(u)}
                        className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                          urgency === u
                            ? u === 'Urgent'
                              ? 'skeuo-btn-amber text-white font-mono'
                              : 'skeuo-btn-primary text-white font-mono'
                            : 'skeuo-btn text-slate-300 hover:text-white font-mono'
                        }`}
                      >
                        {u === 'Urgent' ? '⚡ Urgent' : 'Normal'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                    Does the computer contain important data?
                  </label>
                  <div className="flex gap-2">
                    {(['YES', 'NO'] as const).map((choice) => (
                      <button
                        type="button"
                        key={choice}
                        onClick={() => setContainsImportantData(choice)}
                        className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                          containsImportantData === choice
                            ? choice === 'YES'
                              ? 'skeuo-btn-emerald text-white font-mono'
                              : 'skeuo-btn-primary text-white font-mono'
                            : 'skeuo-btn text-slate-300 hover:text-white font-mono'
                        }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {containsImportantData === 'YES' && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-start gap-2 skeuo-inset">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>
                    <strong>Data First Policy:</strong> We note that your machine contains important files. We will explicitly safeguard and verify data preservation before any partition or system modification is performed.
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full skeuo-btn-primary inline-flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 text-sm font-bold text-white cursor-pointer shadow-xl disabled:opacity-50 tracking-wide"
                >
                  {loading ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-stone-400 mt-2">
                  Submitting does not bind you to an immediate charge. Final agreement is confirmed after discussing your machine with the technician.
                </p>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}
