import React, { useState } from 'react';
import { 
  FileText, 
  UserCheck, 
  HelpCircle, 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Check, 
  AlertCircle,
  ArrowUp,
  ArrowDown,
  X,
  ExternalLink
} from 'lucide-react';
import { SiteSettings, FAQItem, CaseStudyItem } from '../../types';
import { 
  updateSettings, 
  createFaq, 
  updateFaq, 
  deleteFaq, 
  createCaseStudy, 
  updateCaseStudy, 
  deleteCaseStudy 
} from '../../utils/api';
import { TechnicianPhotoUpload } from './TechnicianPhotoUpload';

interface AdminContentProps {
  settings: SiteSettings;
  faqs: FAQItem[];
  caseStudies: CaseStudyItem[];
  onRefresh: () => void;
  onOpenMediaTab?: () => void;
}

export function AdminContent({
  settings,
  faqs,
  caseStudies,
  onRefresh,
  onOpenMediaTab
}: AdminContentProps) {
  const [subTab, setSubTab] = useState<'technician' | 'faq' | 'cases'>('technician');

  // Technician Form State
  const [techForm, setTechForm] = useState<Partial<SiteSettings>>({
    technicianName: settings.technicianName || 'Safiullah',
    technicianTitle: settings.technicianTitle || 'Computer Science & Cybersecurity Practitioner',
    technicianInstitution: settings.technicianInstitution || 'University of Agriculture, Peshawar',
    technicianExperience: settings.technicianExperience || '5+ Years Practical Windows & Hardware Diagnostics',
    technicianBio: settings.technicianBio || '',
    technicianQuote: settings.technicianQuote || '',
    technicianPhoto: settings.technicianPhoto !== undefined ? settings.technicianPhoto : ''
  });

  // FAQ Modal & Form State
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [faqForm, setFaqForm] = useState<Partial<FAQItem>>({
    question: '',
    answer: '',
    category: 'General'
  });

  // Case Study Modal & Form State
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<CaseStudyItem | null>(null);
  const [caseForm, setCaseForm] = useState<Partial<CaseStudyItem>>({
    title: '',
    customerType: 'Accounting Office',
    device: 'Desktop Workstation',
    problem: '',
    diagnosis: '',
    solution: '',
    result: ''
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  };

  // Save Technician Profile
  const handleSaveTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(techForm);
      showMsg("Technician profile updated successfully!");
      onRefresh();
    } catch (err) {
      showMsg("Failed to update technician details", 'error');
    } finally {
      setSaving(false);
    }
  };

  // FAQs Handlers
  const handleOpenAddFaq = () => {
    setEditingFaq(null);
    setFaqForm({ question: '', answer: '', category: 'General' });
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (f: FAQItem) => {
    setEditingFaq(f);
    setFaqForm({ ...f });
    setIsFaqModalOpen(true);
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      await deleteFaq(id);
      showMsg("FAQ removed permanently");
      onRefresh();
    } catch (err: any) {
      showMsg(err.message || "Failed to delete FAQ", 'error');
    }
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) return;
    setSaving(true);
    try {
      if (editingFaq) {
        await updateFaq(editingFaq.id, faqForm);
        showMsg("FAQ updated");
      } else {
        await createFaq(faqForm);
        showMsg("FAQ added");
      }
      setIsFaqModalOpen(false);
      onRefresh();
    } catch (err) {
      showMsg("Failed to save FAQ", 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFaqStatus = async (f: FAQItem) => {
    const isLive = f.status === 'PUBLISHED' || f.status === 'published' || f.status === 'active' || !f.status;
    const newStatus = isLive ? 'UNPUBLISHED' : 'PUBLISHED';
    try {
      await updateFaq(f.id, { status: newStatus as any });
      showMsg(`FAQ marked as ${newStatus}`);
      onRefresh();
    } catch (err) {
      showMsg("Failed to update FAQ status", 'error');
    }
  };

  const handleToggleCaseStatus = async (cs: CaseStudyItem) => {
    const isLive = cs.status === 'PUBLISHED' || cs.status === 'published' || cs.status === 'active' || !cs.status;
    const newStatus = isLive ? 'UNPUBLISHED' : 'PUBLISHED';
    try {
      await updateCaseStudy(cs.id, { status: newStatus as any });
      showMsg(`Case study marked as ${newStatus}`);
      onRefresh();
    } catch (err) {
      showMsg("Failed to update case study status", 'error');
    }
  };

  // Case Studies Handlers
  const handleOpenAddCase = () => {
    setEditingCase(null);
    setCaseForm({
      title: '',
      customerType: 'Accounting Office',
      device: 'Dell OptiPlex Desktop',
      problem: '',
      diagnosis: '',
      solution: '',
      result: ''
    });
    setIsCaseModalOpen(true);
  };

  const handleOpenEditCase = (cs: CaseStudyItem) => {
    setEditingCase(cs);
    setCaseForm({ ...cs });
    setIsCaseModalOpen(true);
  };

  const handleDeleteCase = async (id: string) => {
    try {
      await deleteCaseStudy(id);
      showMsg("Case study deleted permanently");
      onRefresh();
    } catch (err: any) {
      showMsg(err.message || "Failed to delete case study", 'error');
    }
  };

  const handleSaveCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseForm.title || !caseForm.problem) return;
    setSaving(true);
    try {
      if (editingCase) {
        await updateCaseStudy(editingCase.id, caseForm);
        showMsg("Case study updated");
      } else {
        await createCaseStudy(caseForm);
        showMsg("Case study published");
      }
      setIsCaseModalOpen(false);
      onRefresh();
    } catch (err) {
      showMsg("Failed to save case study", 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            Website Content & Real Trust Assets
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage technician credentials, customer FAQ directory, and real on-site diagnostic case studies.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSubTab('technician')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              subTab === 'technician' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            Technician
          </button>
          <button
            onClick={() => setSubTab('faq')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              subTab === 'faq' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            FAQ ({faqs.length})
          </button>
          <button
            onClick={() => setSubTab('cases')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              subTab === 'cases' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            Real Service Cases ({caseStudies.length})
          </button>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
          msg.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {msg.type === 'success' ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* 1. TECHNICIAN PROFILE */}
      {subTab === 'technician' && (
        <form onSubmit={handleSaveTechnician} className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Technician Public Identity & Credentials</h3>
              <p className="text-xs text-slate-400">Published on /technician and the homepage trust badge.</p>
            </div>

            {onOpenMediaTab && (
              <button
                type="button"
                onClick={onOpenMediaTab}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Upload New Photo in Media</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Technician Full Name</label>
              <input
                type="text"
                value={techForm.technicianName || ''}
                onChange={(e) => setTechForm({ ...techForm, technicianName: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Academic / Technical Title</label>
              <input
                type="text"
                value={techForm.technicianTitle || ''}
                onChange={(e) => setTechForm({ ...techForm, technicianTitle: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">University / Educational Institution</label>
              <input
                type="text"
                value={techForm.technicianInstitution || ''}
                onChange={(e) => setTechForm({ ...techForm, technicianInstitution: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Years of Practical Experience</label>
              <input
                type="text"
                value={techForm.technicianExperience || ''}
                onChange={(e) => setTechForm({ ...techForm, technicianExperience: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Dedicated Bulletproof Profile Photo Upload */}
          <TechnicianPhotoUpload
            currentPhoto={techForm.technicianPhoto}
            technicianName={techForm.technicianName}
            onPhotoUpdated={(newPhotoUrl) => {
              setTechForm((prev) => ({ ...prev, technicianPhoto: newPhotoUrl }));
              onRefresh();
            }}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Technician Photo URL or Custom Path</label>
            <input
              type="text"
              value={techForm.technicianPhoto || ''}
              onChange={(e) => setTechForm({ ...techForm, technicianPhoto: e.target.value })}
              placeholder="https://... or uploaded image path"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Public Bio (Detailed Introduction)</label>
            <textarea
              rows={4}
              value={techForm.technicianBio || ''}
              onChange={(e) => setTechForm({ ...techForm, technicianBio: e.target.value })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Service Philosophy Quote</label>
            <textarea
              rows={2}
              value={techForm.technicianQuote || ''}
              onChange={(e) => setTechForm({ ...techForm, technicianQuote: e.target.value })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end pt-3 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Update Technician Profile'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. FAQS MANAGER */}
      {subTab === 'faq' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Published Questions ({faqs.length})
            </span>
            <button
              onClick={handleOpenAddFaq}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => {
              const isLive = f.status === 'PUBLISHED' || f.status === 'published' || f.status === 'active' || !f.status;
              return (
                <div 
                  key={f.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{f.question}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                        isLive 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {isLive ? 'PUBLISHED' : 'UNPUBLISHED'}
                      </span>
                      {f.category && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-blue-400 font-mono">
                          {f.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{f.answer}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleFaqStatus(f)}
                      className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer border ${
                        isLive 
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20' 
                          : 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/30'
                      }`}
                      title={isLive ? 'Unpublish FAQ' : 'Publish FAQ'}
                    >
                      {isLive ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleOpenEditFaq(f)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                      title="Edit FAQ"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(f.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                      title="Delete FAQ"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. REAL SERVICE CASES (CASE STUDIES) */}
      {subTab === 'cases' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Diagnostic Case Studies ({caseStudies.length})
            </span>
            <button
              onClick={handleOpenAddCase}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Case Study</span>
            </button>
          </div>

            {caseStudies.map((cs) => {
              const isLive = cs.status === 'PUBLISHED' || cs.status === 'published' || cs.status === 'active' || !cs.status;
              return (
                <div 
                  key={cs.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white text-sm">{cs.title}</h4>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                          isLive 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {isLive ? 'PUBLISHED' : 'UNPUBLISHED'}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-blue-400 font-mono shrink-0">
                        {cs.customerType}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono">
                      Device: {cs.device}
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div>
                        <strong className="text-red-400">Problem:</strong> {cs.problem}
                      </div>
                      <div>
                        <strong className="text-blue-400">Diagnosis:</strong> {cs.diagnosis}
                      </div>
                      <div>
                        <strong className="text-purple-400">Solution:</strong> {cs.solution}
                      </div>
                      <div>
                        <strong className="text-emerald-400">Result:</strong> {cs.result}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleCaseStatus(cs)}
                      className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer border ${
                        isLive 
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20' 
                          : 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/30'
                      }`}
                      title={isLive ? 'Unpublish case study' : 'Publish case study'}
                    >
                      {isLive ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleOpenEditCase(cs)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCase(cs.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* FAQ MODAL */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSaveFaq} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</h3>
              <button type="button" onClick={() => setIsFaqModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Question *</label>
              <input
                type="text"
                required
                value={faqForm.question}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <input
                type="text"
                value={faqForm.category}
                onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Answer *</label>
              <textarea
                rows={4}
                required
                value={faqForm.answer}
                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" onClick={() => setIsFaqModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white">Save FAQ</button>
            </div>
          </form>
        </div>
      )}

      {/* CASE STUDY MODAL */}
      {isCaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSaveCase} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">{editingCase ? 'Edit Case Study' : 'Add Case Study'}</h3>
              <button type="button" onClick={() => setIsCaseModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
              <input
                type="text"
                required
                value={caseForm.title}
                onChange={(e) => setCaseForm({ ...caseForm, title: e.target.value })}
                placeholder="e.g. Blue Screen Crash Dump & NVMe SSD Migration"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Type</label>
                <input
                  type="text"
                  value={caseForm.customerType}
                  onChange={(e) => setCaseForm({ ...caseForm, customerType: e.target.value })}
                  placeholder="e.g. Accounting Office"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Device Model</label>
                <input
                  type="text"
                  value={caseForm.device}
                  onChange={(e) => setCaseForm({ ...caseForm, device: e.target.value })}
                  placeholder="e.g. Dell OptiPlex 7050"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Problem Reported *</label>
              <textarea
                rows={2}
                required
                value={caseForm.problem}
                onChange={(e) => setCaseForm({ ...caseForm, problem: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Technician Diagnosis</label>
              <textarea
                rows={2}
                value={caseForm.diagnosis}
                onChange={(e) => setCaseForm({ ...caseForm, diagnosis: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Solution Applied</label>
              <textarea
                rows={2}
                value={caseForm.solution}
                onChange={(e) => setCaseForm({ ...caseForm, solution: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Verification & Result</label>
              <input
                type="text"
                value={caseForm.result}
                onChange={(e) => setCaseForm({ ...caseForm, result: e.target.value })}
                placeholder="e.g. Boot time reduced from 2m 40s to 12s. Zero crashes."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" onClick={() => setIsCaseModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white">Save Case Study</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
