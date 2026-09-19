import { useState } from 'react';
import { FAQItem } from '../types';
import { ChevronDown, HelpCircle, Search, MessageSquare } from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';

interface FAQSectionProps {
  faqs: FAQItem[];
  whatsappNumber: string;
}

export function FAQSection({ faqs, whatsappNumber }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || 'faq-1');
  const [searchQuery, setSearchQuery] = useState('');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = faqs
    .filter((f: any) => f.status !== 'unpublished')
    .filter(
      (f) =>
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const whatsappUrl = getWhatsAppLink(
    whatsappNumber,
    "Hello! I have a question about your on-site computer services in Peshawar."
  );

  return (
    <section id="faq" className="py-16 sm:py-24 bg-slate-950/60 border-y border-slate-900 relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full skeuo-badge px-3.5 py-1 text-xs font-mono font-medium text-slate-300 mb-3">
            <span className="skeuo-led-blue"></span>
            <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
            <span>FREQUENT QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Clear, honest answers regarding our on-site procedures, turnaround times, and data safety policies in Peshawar.
          </p>

          {/* Quick Search */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. SSD, data, blue screen, time)..."
              className="w-full rounded-xl skeuo-input pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl skeuo-card p-8 text-center text-slate-400 text-sm font-mono">
              No matching questions found. Ask us directly on WhatsApp!
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl skeuo-card transition-colors overflow-hidden"
                >
                  <button
                    onClick={() => toggle(faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-white hover:text-blue-400 transition-colors cursor-pointer font-mono"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-3 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 skeuo-inset m-3 rounded-xl">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still have questions? */}
        <div className="mt-10 rounded-2xl skeuo-panel p-5 text-center flex flex-col sm:flex-row items-center justify-between gap-4 relative">
          <div className="absolute top-2 left-2"><span className="skeuo-screw"></span></div>
          <div className="absolute top-2 right-2"><span className="skeuo-screw"></span></div>
          <div className="text-left text-xs sm:text-sm text-slate-300 font-mono">
            Have a specific problem not answered here? Ask your technician directly.
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl skeuo-btn-emerald px-4 py-2 text-xs font-bold text-emerald-200 transition-all font-mono"
          >
            <MessageSquare className="h-4 w-4 text-emerald-300" />
            <span>Ask via WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}
