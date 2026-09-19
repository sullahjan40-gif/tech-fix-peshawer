import React, { useState } from 'react';
import { 
  Archive, 
  Globe, 
  Trash2, 
  AlertCircle, 
  Check, 
  HelpCircle, 
  Briefcase, 
  Wrench, 
  Eye, 
  Filter,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { ServiceItem, FAQItem, CaseStudyItem, ProblemSolutionItem } from '../../types';
import { 
  publishService, 
  deleteService, 
  updateFaq, 
  deleteFaq, 
  updateCaseStudy, 
  deleteCaseStudy,
  toggleProblemSolutionStatus,
  deleteProblemSolution
} from '../../utils/api';

interface AdminUnpublishedProps {
  services: ServiceItem[];
  faqs?: FAQItem[];
  caseStudies?: CaseStudyItem[];
  problemSolutions?: ProblemSolutionItem[];
  onRefresh: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export function AdminUnpublished({
  services = [],
  faqs = [],
  caseStudies = [],
  problemSolutions = [],
  onRefresh,
  onNavigateToTab
}: AdminUnpublishedProps) {
  const [filter, setFilter] = useState<'all' | 'services' | 'faqs' | 'cases' | 'problems'>('all');
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4500);
  };

  // Find unpublished services
  const unpublishedServices = services.filter(
    s => s.status === 'inactive' || (s as any).status === 'unpublished' || s.status === 'UNPUBLISHED'
  );

  // Find unpublished faqs
  const unpublishedFaqs = faqs.filter(
    f => f.status === 'inactive' || f.status === 'unpublished' || f.status === 'UNPUBLISHED'
  );

  // Find unpublished case studies
  const unpublishedCases = caseStudies.filter(
    c => c.status === 'inactive' || c.status === 'unpublished' || c.status === 'UNPUBLISHED'
  );

  // Find unpublished problem solutions
  const unpublishedProblems = problemSolutions.filter(
    p => p.status === 'inactive' || p.status === 'unpublished' || p.status === 'UNPUBLISHED'
  );

  const totalUnpublished = unpublishedServices.length + unpublishedFaqs.length + unpublishedCases.length + unpublishedProblems.length;

  // Publish Service
  const handlePublishService = async (id: string, title: string) => {
    setActionInProgressId(id);
    try {
      await publishService(id);
      showMsg(`Service "${title}" is now published and live on the website!`);
      onRefresh();
    } catch (err: any) {
      showMsg(err.message || "Failed to publish service", 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  // Delete Service
  const handleDeleteService = async (id: string, title: string) => {
    setActionInProgressId(id);
    try {
      await deleteService(id);
      showMsg(`Service "${title}" deleted permanently from website.`);
      setConfirmDeleteId(null);
      onRefresh();
    } catch (err: any) {
      showMsg(err.message || "Failed to delete service", 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  // Publish FAQ
  const handlePublishFaq = async (id: string) => {
    setActionInProgressId(id);
    try {
      await updateFaq(id, { status: 'PUBLISHED' as any });
      showMsg("FAQ published and live for visitors!");
      onRefresh();
    } catch (err: any) {
      showMsg(err.message || "Failed to publish FAQ", 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (id: string) => {
    setActionInProgressId(id);
    try {
      await deleteFaq(id);
      showMsg("FAQ deleted permanently.");
      setConfirmDeleteId(null);
      onRefresh();
    } catch (err: any) {
      showMsg(err.message || "Failed to delete FAQ", 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  // Publish Case Study
  const handlePublishCase = async (id: string, title: string) => {
    setActionInProgressId(id);
    try {
      await updateCaseStudy(id, { status: 'PUBLISHED' as any });
      showMsg(`Case study "${title}" published and live!`);
      onRefresh();
    } catch (err: any) {
      showMsg(err.message || "Failed to publish case study", 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  // Delete Case Study
  const handleDeleteCase = async (id: string, title: string) => {
    setActionInProgressId(id);
    try {
      await deleteCaseStudy(id);
      showMsg(`Case study "${title}" deleted permanently.`);
      setConfirmDeleteId(null);
      onRefresh();
    } catch (err: any) {
      showMsg(err.message || "Failed to delete case study", 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  // Publish Problem Solution
  const handlePublishProblem = async (id: string, title: string) => {
    setActionInProgressId(id);
    try {
      await toggleProblemSolutionStatus(id, 'PUBLISHED');
      showMsg(`Problem solution "${title}" published and live!`);
      onRefresh();
    } catch (err: any) {
      showMsg(err.message || "Failed to publish problem solution", 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  // Delete Problem Solution
  const handleDeleteProblem = async (id: string, title: string) => {
    setActionInProgressId(id);
    try {
      await deleteProblemSolution(id);
      showMsg(`Problem solution "${title}" deleted permanently.`);
      setConfirmDeleteId(null);
      onRefresh();
    } catch (err: any) {
      showMsg(err.message || "Failed to delete problem solution", 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl skeuo-badge flex items-center justify-center text-amber-400">
              <Archive className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                <span>Unpublished Items Directory</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {totalUnpublished} Hidden
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Items stored here are hidden from the live public website. Click &quot;Publish Live&quot; to restore them instantly.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onRefresh()}
            className="skeuo-btn px-3 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Message Banner */}
      {msg && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 font-mono ${
          msg.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {msg.type === 'success' ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'all'
              ? 'skeuo-btn-primary text-white shadow-lg'
              : 'skeuo-btn text-slate-400 hover:text-white'
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          <span>All Unpublished ({totalUnpublished})</span>
        </button>

        <button
          onClick={() => setFilter('services')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'services'
              ? 'skeuo-btn-primary text-white shadow-lg'
              : 'skeuo-btn text-slate-400 hover:text-white'
          }`}
        >
          <Wrench className="h-3.5 w-3.5 text-blue-400" />
          <span>Services ({unpublishedServices.length})</span>
        </button>

        <button
          onClick={() => setFilter('problems')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'problems'
              ? 'skeuo-btn-primary text-white shadow-lg'
              : 'skeuo-btn text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="h-3.5 w-3.5 text-emerald-400" />
          <span>Problems ({unpublishedProblems.length})</span>
        </button>

        <button
          onClick={() => setFilter('faqs')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'faqs'
              ? 'skeuo-btn-primary text-white shadow-lg'
              : 'skeuo-btn text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
          <span>FAQs ({unpublishedFaqs.length})</span>
        </button>

        <button
          onClick={() => setFilter('cases')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'cases'
              ? 'skeuo-btn-primary text-white shadow-lg'
              : 'skeuo-btn text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="h-3.5 w-3.5 text-purple-400" />
          <span>Case Studies ({unpublishedCases.length})</span>
        </button>
      </div>

      {/* Empty State */}
      {totalUnpublished === 0 ? (
        <div className="rounded-2xl skeuo-panel p-12 text-center border border-slate-800 space-y-4">
          <div className="h-16 w-16 mx-auto rounded-2xl skeuo-badge flex items-center justify-center text-emerald-400">
            <Globe className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">No Unpublished Items</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              All your services, customer FAQs, and on-site case studies are currently published and visible live to visitors in Peshawar.
            </p>
          </div>
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('services')}
              className="skeuo-btn-primary px-4 py-2 rounded-xl text-xs font-mono text-white inline-flex items-center gap-2 cursor-pointer"
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>Browse Active Services</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* SECTION: SERVICES */}
          {(filter === 'all' || filter === 'services') && unpublishedServices.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
                  <Wrench className="h-3.5 w-3.5 text-blue-400" />
                  <span>Unpublished Services ({unpublishedServices.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unpublishedServices.map((service) => (
                  <div 
                    key={service.id} 
                    className="rounded-2xl skeuo-panel border border-amber-500/30 p-5 space-y-4 relative overflow-hidden bg-slate-900/80"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl skeuo-badge flex items-center justify-center text-blue-400 shrink-0">
                          <Wrench className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white font-mono">{service.title}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                              Unpublished
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {service.shortDesc || service.fullDesc || "No description provided."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2 border-t border-slate-800">
                      <span>Starting: <strong className="text-cyan-300">{service.priceStarting}</strong></span>
                      <span>Turnaround: <strong className="text-slate-200">{service.turnaround}</strong></span>
                    </div>

                    {/* Inline Delete Confirmation or Action Buttons */}
                    {confirmDeleteId === service.id ? (
                      <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-xs space-y-2 font-mono">
                        <p className="text-red-300 font-semibold">Permanently delete &quot;{service.title}&quot; from the database?</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteService(service.id, service.title)}
                            disabled={actionInProgressId === service.id}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold cursor-pointer transition-colors"
                          >
                            {actionInProgressId === service.id ? 'Deleting...' : 'Yes, Delete Permanently'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-1.5 rounded-lg skeuo-btn text-slate-300 hover:text-white cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2 pt-2">
                        <button
                          onClick={() => handlePublishService(service.id, service.title)}
                          disabled={actionInProgressId === service.id}
                          className="flex-1 rounded-xl skeuo-btn-primary py-2.5 px-3 text-xs font-bold text-white flex items-center justify-center gap-1.5 font-mono cursor-pointer shadow-md hover:brightness-110"
                        >
                          <Globe className="h-3.5 w-3.5 text-emerald-300" />
                          <span>{actionInProgressId === service.id ? 'Publishing...' : 'Publish Live Now'}</span>
                        </button>

                        <button
                          onClick={() => setConfirmDeleteId(service.id)}
                          className="skeuo-btn p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-colors cursor-pointer"
                          title="Delete permanently"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: PROBLEM SOLUTIONS */}
          {(filter === 'all' || filter === 'problems') && unpublishedProblems.length > 0 && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Unpublished Problem Solutions ({unpublishedProblems.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unpublishedProblems.map((prob) => (
                  <div 
                    key={prob.id} 
                    className="rounded-2xl skeuo-panel border border-amber-500/30 p-5 space-y-4 relative overflow-hidden bg-slate-900/80"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl skeuo-badge flex items-center justify-center text-emerald-400 shrink-0">
                          <Cpu className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white font-mono">{prob.title}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                              Unpublished
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {prob.shortDesc || "No description provided."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2 border-t border-slate-800">
                      <span>Starting: <strong className="text-emerald-400">{prob.priceStarting}</strong></span>
                      <span>Key: <strong className="text-slate-300">{prob.key}</strong></span>
                    </div>

                    {/* Inline Delete Confirmation or Action Buttons */}
                    {confirmDeleteId === prob.id ? (
                      <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-xs space-y-2 font-mono">
                        <p className="text-red-300 font-semibold">Permanently delete &quot;{prob.title}&quot; from problem directory?</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteProblem(prob.id, prob.title)}
                            disabled={actionInProgressId === prob.id}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold cursor-pointer transition-colors"
                          >
                            {actionInProgressId === prob.id ? 'Deleting...' : 'Yes, Delete Permanently'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-1.5 rounded-lg skeuo-btn text-slate-300 hover:text-white cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2 pt-2">
                        <button
                          onClick={() => handlePublishProblem(prob.id, prob.title)}
                          disabled={actionInProgressId === prob.id}
                          className="flex-1 rounded-xl skeuo-btn-primary py-2.5 px-3 text-xs font-bold text-white flex items-center justify-center gap-1.5 font-mono cursor-pointer shadow-md hover:brightness-110"
                        >
                          <Globe className="h-3.5 w-3.5 text-emerald-300" />
                          <span>{actionInProgressId === prob.id ? 'Publishing...' : 'Publish Live Now'}</span>
                        </button>

                        <button
                          onClick={() => setConfirmDeleteId(prob.id)}
                          className="skeuo-btn p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-colors cursor-pointer"
                          title="Delete permanently"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: FAQS */}
          {(filter === 'all' || filter === 'faqs') && unpublishedFaqs.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
                <span>Unpublished FAQs ({unpublishedFaqs.length})</span>
              </h3>

              <div className="space-y-3">
                {unpublishedFaqs.map((faq) => (
                  <div 
                    key={faq.id} 
                    className="rounded-2xl skeuo-panel border border-amber-500/30 p-5 space-y-3 bg-slate-900/80"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                            FAQ • Unpublished
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{faq.category || 'General'}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white font-mono mt-1">{faq.question}</h4>
                        <p className="text-xs text-slate-300 mt-1">{faq.answer}</p>
                      </div>
                    </div>

                    {confirmDeleteId === faq.id ? (
                      <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-xs space-y-2 font-mono">
                        <p className="text-red-300 font-semibold">Permanently delete this FAQ question?</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteFaq(faq.id)}
                            disabled={actionInProgressId === faq.id}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold cursor-pointer"
                          >
                            Yes, Delete FAQ
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-1.5 rounded-lg skeuo-btn text-slate-300 hover:text-white cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => handlePublishFaq(faq.id)}
                          disabled={actionInProgressId === faq.id}
                          className="rounded-xl skeuo-btn-primary py-2 px-4 text-xs font-bold text-white flex items-center gap-1.5 font-mono cursor-pointer"
                        >
                          <Globe className="h-3.5 w-3.5 text-emerald-300" />
                          <span>Publish Question</span>
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(faq.id)}
                          className="skeuo-btn p-2 rounded-xl text-slate-400 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: CASE STUDIES */}
          {(filter === 'all' || filter === 'cases') && unpublishedCases.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-purple-400" />
                <span>Unpublished Case Studies ({unpublishedCases.length})</span>
              </h3>

              <div className="space-y-3">
                {unpublishedCases.map((cs) => (
                  <div 
                    key={cs.id} 
                    className="rounded-2xl skeuo-panel border border-amber-500/30 p-5 space-y-3 bg-slate-900/80"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                          Case Study • Unpublished
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{cs.device || cs.customerType}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-mono mt-1">{cs.title}</h4>
                      <p className="text-xs text-slate-300 mt-1">Problem: {cs.problem}</p>
                      {cs.solution && <p className="text-xs text-emerald-400 mt-0.5">Solution: {cs.solution}</p>}
                    </div>

                    {confirmDeleteId === cs.id ? (
                      <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-xs space-y-2 font-mono">
                        <p className="text-red-300 font-semibold">Permanently delete this case study?</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteCase(cs.id, cs.title)}
                            disabled={actionInProgressId === cs.id}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold cursor-pointer"
                          >
                            Yes, Delete
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-1.5 rounded-lg skeuo-btn text-slate-300 hover:text-white cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => handlePublishCase(cs.id, cs.title)}
                          disabled={actionInProgressId === cs.id}
                          className="rounded-xl skeuo-btn-primary py-2 px-4 text-xs font-bold text-white flex items-center gap-1.5 font-mono cursor-pointer"
                        >
                          <Globe className="h-3.5 w-3.5 text-emerald-300" />
                          <span>Publish Case Study</span>
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(cs.id)}
                          className="skeuo-btn p-2 rounded-xl text-slate-400 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
