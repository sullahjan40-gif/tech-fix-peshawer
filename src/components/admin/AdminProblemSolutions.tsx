import React, { useState } from 'react';
import { 
  Cpu, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  ExternalLink,
  Search,
  Sparkles,
  Layers,
  Wrench,
  HelpCircle,
  FileText
} from 'lucide-react';
import { ProblemSolutionItem, PageSectionsData, ContentStatus } from '../../types';
import { 
  createProblemSolution, 
  updateProblemSolution, 
  deleteProblemSolution, 
  toggleProblemSolutionStatus,
  updatePageStatus,
  updatePageSection
} from '../../utils/api';

interface AdminProblemSolutionsProps {
  problemSolutions: ProblemSolutionItem[];
  pageSections?: PageSectionsData;
  onRefresh: () => void;
  onNavigateToPage?: (page: string) => void;
}

export function AdminProblemSolutions({
  problemSolutions,
  pageSections,
  onRefresh,
  onNavigateToPage
}: AdminProblemSolutionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'UNPUBLISHED'>('ALL');

  // Page Header and Status Management
  const pageStatus: ContentStatus = pageSections?.pageStatuses?.['problems-solutions'] || 'published';
  const isPageUnpublished = pageStatus === 'unpublished';
  const pageMeta = pageSections?.['problems-solutions'];

  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [headerTitle, setHeaderTitle] = useState(pageMeta?.title || 'Computer Problems & Technical Solutions');
  const [headerSubtitle, setHeaderSubtitle] = useState(pageMeta?.subtitle || 'Honest diagnostics, root-cause resolution, and transparent turnaround standards for laptops and desktops in Peshawar.');
  const [headerBadge, setHeaderBadge] = useState(pageMeta?.badge || 'DIAGNOSTIC MATRIX & PROTOCOLS');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProblemSolutionItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<Partial<ProblemSolutionItem>>({
    badge: 'TECHNICAL DEEP-DIVE',
    title: '',
    subtitle: '',
    shortDesc: '',
    symptomsWhenNeeded: [''],
    honestAssessment: '',
    turnaroundCriteria: '',
    turnaroundFactors: [''],
    protocolBadge: 'VERIFIED REPAIR PROTOCOL',
    protocolTitle: 'Step-by-Step Procedure',
    steps: [
      { num: '01', title: 'Diagnostic Inspection', desc: 'Hardware health check and error identification.' },
      { num: '02', title: 'Targeted Execution', desc: 'Precise on-site resolution with official tools.' },
      { num: '03', title: 'Stability Validation', desc: 'Stress testing and customer demonstration.' }
    ],
    priceStarting: 'From Rs. 1,500',
    ctaText: 'Book On-Site Service',
    serviceKey: 'windows',
    warningRules: [''],
    status: 'PUBLISHED',
    order: problemSolutions.length + 1
  });

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const handleTogglePageStatus = async () => {
    const newStatus: ContentStatus = isPageUnpublished ? 'published' : 'unpublished';
    try {
      await updatePageStatus('problems-solutions', newStatus);
      showMsg(`Problems & Solutions page marked as ${newStatus}`);
      onRefresh();
    } catch (err) {
      showMsg("Failed to update page status", "error");
    }
  };

  const handleSaveHeader = async () => {
    try {
      await updatePageSection('problems-solutions', {
        title: headerTitle.trim(),
        subtitle: headerSubtitle.trim(),
        badge: headerBadge.trim()
      });
      setIsEditingHeader(false);
      showMsg("Page header updated successfully!");
      onRefresh();
    } catch (err) {
      showMsg("Failed to update page header", "error");
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      badge: 'TECHNICAL DEEP-DIVE',
      title: '',
      subtitle: '',
      shortDesc: '',
      symptomsWhenNeeded: [''],
      honestAssessment: '',
      turnaroundCriteria: '',
      turnaroundFactors: [''],
      protocolBadge: 'VERIFIED REPAIR PROTOCOL',
      protocolTitle: 'Step-by-Step Procedure',
      steps: [
        { num: '01', title: 'Diagnostic Inspection', desc: 'Hardware health check and error identification.' },
        { num: '02', title: 'Targeted Execution', desc: 'Precise on-site resolution with official tools.' },
        { num: '03', title: 'Stability Validation', desc: 'Stress testing and customer demonstration.' }
      ],
      priceStarting: 'From Rs. 1,500',
      ctaText: 'Book On-Site Service',
      serviceKey: 'windows',
      warningRules: [''],
      status: 'PUBLISHED',
      order: problemSolutions.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ProblemSolutionItem) => {
    setEditingItem(item);
    setFormData({
      ...item,
      symptomsWhenNeeded: item.symptomsWhenNeeded?.length ? item.symptomsWhenNeeded : [''],
      turnaroundFactors: item.turnaroundFactors?.length ? item.turnaroundFactors : [''],
      warningRules: item.warningRules?.length ? item.warningRules : [''],
      steps: item.steps?.length ? item.steps : [
        { num: '01', title: 'Diagnostic Inspection', desc: 'Hardware health check and error identification.' }
      ]
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (item: ProblemSolutionItem) => {
    const isLive = item.status === 'PUBLISHED' || item.status === 'published' || item.status === 'active';
    const newStatus = isLive ? 'UNPUBLISHED' : 'PUBLISHED';
    try {
      await toggleProblemSolutionStatus(item.id, newStatus);
      showMsg(`"${item.title}" status changed to ${newStatus}`);
      onRefresh();
    } catch (err) {
      showMsg("Failed to update status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProblemSolution(id);
      showMsg("Problem Solution deleted successfully");
      setConfirmDeleteId(null);
      onRefresh();
    } catch (err) {
      showMsg("Failed to delete item", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.shortDesc?.trim()) {
      showMsg("Title and Summary Description are required", "error");
      return;
    }

    setSaving(true);
    try {
      const cleanData: Partial<ProblemSolutionItem> = {
        ...formData,
        title: formData.title.trim(),
        key: formData.key || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        shortDesc: formData.shortDesc.trim(),
        honestAssessment: formData.honestAssessment?.trim() || '',
        turnaroundCriteria: formData.turnaroundCriteria?.trim() || '',
        symptomsWhenNeeded: formData.symptomsWhenNeeded?.filter(s => s.trim().length > 0) || [],
        turnaroundFactors: formData.turnaroundFactors?.filter(f => f.trim().length > 0) || [],
        warningRules: formData.warningRules?.filter(w => w.trim().length > 0) || [],
        steps: formData.steps || []
      };

      if (editingItem) {
        await updateProblemSolution(editingItem.id, cleanData);
        showMsg("Problem solution updated successfully!");
      } else {
        await createProblemSolution(cleanData);
        showMsg("New problem solution created!");
      }

      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      showMsg(err.message || "Failed to save problem solution", "error");
    } finally {
      setSaving(false);
    }
  };

  // Filter items
  const filteredItems = problemSolutions.filter(item => {
    const isLive = item.status === 'PUBLISHED' || item.status === 'published' || item.status === 'active';
    if (statusFilter === 'PUBLISHED' && !isLive) return false;
    if (statusFilter === 'UNPUBLISHED' && isLive) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.shortDesc.toLowerCase().includes(q);
      const matchSymptoms = item.symptomsWhenNeeded?.some(s => s.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchSymptoms;
    }
    return true;
  });

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

      {/* Page-Level Status Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
        isPageUnpublished 
          ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' 
          : 'bg-slate-900/90 border-slate-800 text-slate-300'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${isPageUnpublished ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {isPageUnpublished ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Problems & Solutions Directory Status:</h3>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                isPageUnpublished ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {pageStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isPageUnpublished 
                ? 'Directory page is UNPUBLISHED. Public visitors will see a maintenance notice.' 
                : 'Directory page is LIVE and visible to all visitors.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onNavigateToPage && (
            <button
              onClick={() => onNavigateToPage('problems-solutions')}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              Preview Page
            </button>
          )}
          <button
            onClick={() => setIsEditingHeader(!isEditingHeader)}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Edit3 className="h-3.5 w-3.5 text-blue-400" />
            Edit Page Header
          </button>
          <button
            onClick={handleTogglePageStatus}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              isPageUnpublished
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-amber-600/90 hover:bg-amber-500 text-white'
            }`}
          >
            {isPageUnpublished ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            {isPageUnpublished ? 'Publish Whole Page' : 'Unpublish Whole Page'}
          </button>
        </div>
      </div>

      {/* Header Edit Panel */}
      {isEditingHeader && (
        <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-blue-900/40 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-blue-400" />
              Edit Problems & Solutions Header
            </h4>
            <button onClick={() => setIsEditingHeader(false)} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Badge / Tagline</label>
              <input
                type="text"
                value={headerBadge}
                onChange={(e) => setHeaderBadge(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Page Main Title</label>
              <input
                type="text"
                value={headerTitle}
                onChange={(e) => setHeaderTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Page Subtitle</label>
              <textarea
                value={headerSubtitle}
                onChange={(e) => setHeaderSubtitle(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsEditingHeader(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveHeader}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              Save Header
            </button>
          </div>
        </div>
      )}

      {/* Action Bar & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems or symptoms..."
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none w-64"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({problemSolutions.length})
            </button>
            <button
              onClick={() => setStatusFilter('PUBLISHED')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === 'PUBLISHED' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              Live
            </button>
            <button
              onClick={() => setStatusFilter('UNPUBLISHED')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === 'UNPUBLISHED' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              Drafts
            </button>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="skeuo-btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-900/30"
        >
          <Plus className="h-4 w-4" />
          Add Technical Solution
        </button>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <Cpu className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No problem solutions found.</p>
            <p className="text-xs text-slate-500 mt-1">Adjust your search or add a new solution deep-dive.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isLive = item.status === 'PUBLISHED' || item.status === 'published' || item.status === 'active';

            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 transition-all ${
                  isLive 
                    ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' 
                    : 'bg-amber-950/10 border-amber-900/40 hover:border-amber-800/60'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {item.badge}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        isLive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {isLive ? 'Published' : 'Unpublished'}
                      </span>
                      <span className="text-xs font-mono text-slate-500">Key: {item.key}</span>
                      <span className="text-xs font-mono font-semibold text-emerald-400 ml-auto lg:ml-0">
                        {item.priceStarting}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                    {item.subtitle && <p className="text-xs font-medium text-slate-300">{item.subtitle}</p>}
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{item.shortDesc}</p>

                    {/* Symptoms preview */}
                    {item.symptomsWhenNeeded && item.symptomsWhenNeeded.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[11px] font-mono text-slate-500">Symptoms:</span>
                        {item.symptomsWhenNeeded.slice(0, 3).map((sym, idx) => (
                          <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50">
                            {sym}
                          </span>
                        ))}
                        {item.symptomsWhenNeeded.length > 3 && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            +{item.symptomsWhenNeeded.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                    <button
                      onClick={() => handleToggleStatus(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                        isLive 
                          ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20' 
                          : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20'
                      }`}
                      title={isLive ? 'Unpublish' : 'Publish'}
                    >
                      {isLive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      <span>{isLive ? 'Unpublish' : 'Publish'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-blue-400" />
                      <span>Edit</span>
                    </button>

                    {confirmDeleteId === item.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1.5 rounded-xl text-xs bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="p-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl my-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  {editingItem ? `Edit: ${editingItem.title}` : 'Add New Problem & Solution Deep-Dive'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. TECHNICAL DEEP-DIVE"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Starting Price</label>
                  <input
                    type="text"
                    value={formData.priceStarting}
                    onChange={(e) => setFormData({ ...formData, priceStarting: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. From Rs. 1,500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Solution Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. FAST WINDOWS INSTALLATION & SETUP"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subtitle / Clarification</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. Genuine OS Deployments with Official Drivers & UEFI Setup"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Summary Description</label>
                  <textarea
                    value={formData.shortDesc}
                    onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                    rows={2}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Clear description of the service and approach"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    When Do You Need This? (Symptoms List, one per line)
                  </label>
                  <textarea
                    value={(formData.symptomsWhenNeeded || []).join('\n')}
                    onChange={(e) => setFormData({ ...formData, symptomsWhenNeeded: e.target.value.split('\n') })}
                    rows={3}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                    placeholder="Corrupted or unbootable Windows&#10;Severe malware instability&#10;Frequent crashes"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Honest & Realistic Turnaround Assessment
                  </label>
                  <textarea
                    value={formData.honestAssessment}
                    onChange={(e) => setFormData({ ...formData, honestAssessment: e.target.value })}
                    rows={2}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Explain why proper setup takes realistic time and avoid misleading marketing promises."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Turnaround Influencing Factors (One per line)
                  </label>
                  <textarea
                    value={(formData.turnaroundFactors || []).join('\n')}
                    onChange={(e) => setFormData({ ...formData, turnaroundFactors: e.target.value.split('\n') })}
                    rows={2}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                    placeholder="Storage Type: NVMe SSD is 3-5x faster than mechanical HDD&#10;Hardware Generation: CPU speed and DDR4/DDR5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="skeuo-btn-primary px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Saving...' : editingItem ? 'Update Solution' : 'Create Solution'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
