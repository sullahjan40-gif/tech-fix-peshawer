import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  AlertCircle, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Monitor, 
  HardDrive, 
  Cpu, 
  Database, 
  Network,
  Activity,
  Layers,
  Save,
  X,
  Eye,
  EyeOff,
  ExternalLink,
  Laptop,
  Server,
  Terminal,
  Disc,
  Wifi,
  Radio,
  Zap,
  Settings,
  ShieldAlert,
  FileCode,
  Smartphone,
  RefreshCw,
  BatteryCharging,
  Power,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { ServiceItem, CategoryItem, PageSectionsData, ContentStatus } from '../../types';
import { 
  createService, 
  updateService, 
  deleteService, 
  toggleServiceStatus, 
  reorderServices,
  updateProblemCategories,
  updatePageStatus,
  updatePageSection,
  uploadCustomServiceIcon
} from '../../utils/api';

interface AdminServicesProps {
  services: ServiceItem[];
  categories?: CategoryItem[];
  pageSections?: PageSectionsData;
  onRefresh: () => void;
  defaultSubTab?: string;
  onNavigateToPage?: (page: string) => void;
}

const AVAILABLE_ICONS = [
  'Monitor', 'Laptop', 'HardDrive', 'Cpu', 'Database', 'Network', 'Server', 'ShieldCheck', 'ShieldAlert',
  'Activity', 'Wrench', 'Terminal', 'Disc', 'Wifi', 'Radio', 'Zap', 'Settings', 'FileCode',
  'Smartphone', 'RefreshCw', 'Layers', 'BatteryCharging', 'Power', 'Clock'
];

export function renderServiceIcon(iconName?: string, customIconUrl?: string, className = "h-5 w-5") {
  if (customIconUrl) {
    return <img src={customIconUrl} alt="" className={`${className} object-contain rounded`} />;
  }
  switch (iconName) {
    case 'Monitor': return <Monitor className={className} />;
    case 'Laptop': return <Laptop className={className} />;
    case 'HardDrive': return <HardDrive className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'Database': return <Database className={className} />;
    case 'Network': return <Network className={className} />;
    case 'Server': return <Server className={className} />;
    case 'Terminal': return <Terminal className={className} />;
    case 'Disc': return <Disc className={className} />;
    case 'Wifi': return <Wifi className={className} />;
    case 'Radio': return <Radio className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Settings': return <Settings className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'FileCode': return <FileCode className={className} />;
    case 'Smartphone': return <Smartphone className={className} />;
    case 'RefreshCw': return <RefreshCw className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'BatteryCharging': return <BatteryCharging className={className} />;
    case 'Power': return <Power className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Clock': return <Clock className={className} />;
    default: return <Wrench className={className} />;
  }
}

export function AdminServices({ 
  services, 
  categories = [], 
  pageSections, 
  onRefresh, 
  defaultSubTab = 'all',
  onNavigateToPage 
}: AdminServicesProps) {
  const [subTab, setSubTab] = useState<'all' | 'add' | 'categories' | 'pricing'>(defaultSubTab as any);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'UNPUBLISHED' | 'DRAFT' | 'ARCHIVED'>('ALL');

  // Page Status & Header Editing
  const pageStatus: ContentStatus = pageSections?.pageStatuses?.services || 'published';
  const isPageUnpublished = pageStatus === 'unpublished';
  const pageMeta = pageSections?.services;

  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [headerTitle, setHeaderTitle] = useState(pageMeta?.title || 'Computer Diagnostic & On-Site Repair Services');
  const [headerSubtitle, setHeaderSubtitle] = useState(pageMeta?.subtitle || 'Professional computer diagnostics, clean operating system deployments, storage upgrades, and data recovery assistance delivered directly to your home, university hostel, or office in Peshawar.');
  const [headerBadge, setHeaderBadge] = useState(pageMeta?.badge || 'ON-SITE SERVICE DIRECTORY');

  // Edit Service Modal State
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<ServiceItem>>({
    title: '',
    shortDesc: '',
    fullDesc: '',
    priceStarting: 'From Rs. 1,500',
    priceNote: '',
    turnaround: '45 – 60 mins',
    icon: 'Monitor',
    customIcon: '',
    status: 'PUBLISHED',
    workflow: ['1. Initial Diagnosis', '2. Customer Approval', '3. On-Site Solution', '4. Verification & Testing'],
    warningNote: '',
    diagnosticSteps: ['Visual & Hardware Check', 'Error Code Analysis', 'Performance Validation']
  });

  const [uploadingIcon, setUploadingIcon] = useState(false);

  const handleIconFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setUploadingIcon(true);
      try {
        const res = await uploadCustomServiceIcon(file.name, dataUrl);
        setFormData(prev => ({ ...prev, customIcon: res.url }));
        showMsg("Custom icon uploaded successfully!");
      } catch (err: any) {
        showMsg(err.message || "Failed to upload icon", "error");
      } finally {
        setUploadingIcon(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Category State
  const [categoryList, setCategoryList] = useState<CategoryItem[]>(categories);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');

  // Quick Pricing Matrix State
  const [pricingMatrix, setPricingMatrix] = useState<{ [id: string]: { priceStarting: string; turnaround: string } }>(() => {
    const initial: any = {};
    services.forEach(s => {
      initial[s.id] = { priceStarting: s.priceStarting, turnaround: s.turnaround };
    });
    return initial;
  });

  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const handleTogglePageStatus = async () => {
    const newStatus: ContentStatus = isPageUnpublished ? 'published' : 'unpublished';
    try {
      await updatePageStatus('services', newStatus);
      showMsg(`Services page marked as ${newStatus}`);
      onRefresh();
    } catch (err) {
      showMsg("Failed to update page status", "error");
    }
  };

  const handleSaveHeader = async () => {
    try {
      await updatePageSection('services', {
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

  // Toggle Active/Inactive
  const handleToggle = async (id: string) => {
    const targetService = services.find(s => s.id === id);
    if (!targetService) return;

    const isCurrentlyActive = targetService.status === 'active' || targetService.status === 'published' || targetService.status === 'PUBLISHED';
    const newStatus = isCurrentlyActive ? 'UNPUBLISHED' : 'PUBLISHED';

    try {
      await updateService(id, { status: newStatus as any });
      showMsg(`Service marked as ${newStatus}`);
      await onRefresh();
    } catch (err: any) {
      showMsg(err.message || "Failed to update status", 'error');
    }
  };

  const handleSetStatus = async (id: string, newStatus: 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED' | 'DRAFT') => {
    try {
      await updateService(id, { status: newStatus as any });
      showMsg(`Service updated to ${newStatus}`);
      await onRefresh();
    } catch (err: any) {
      showMsg(err.message || "Failed to update status", 'error');
    }
  };

  // Reorder
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= services.length) return;

    const copy = [...services];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;

    try {
      await reorderServices(copy.map(s => s.id));
      showMsg("Service order updated");
      onRefresh();
    } catch (err: any) {
      showMsg("Failed to reorder", 'error');
    }
  };

  // Delete
  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteService(id);
      showMsg(`Service "${title}" deleted permanently from website.`);
      setConfirmDeleteId(null);
      onRefresh();
    } catch (err: any) {
      showMsg("Failed to delete service", 'error');
    }
  };

  // Open Edit Modal
  const handleStartEdit = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({ ...service });
  };

  // Submit Add / Edit Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      showMsg("Service title is required", 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingService) {
        await updateService(editingService.id, formData);
        showMsg(`Service "${formData.title}" updated successfully!`);
        setEditingService(null);
      } else {
        await createService(formData);
        showMsg(`New service "${formData.title}" created successfully!`);
        setSubTab('all');
        setFormData({
          title: '',
          shortDesc: '',
          fullDesc: '',
          priceStarting: 'From Rs. 1,500',
          priceNote: '',
          turnaround: '45 – 60 mins',
          icon: 'Monitor',
          status: 'active',
          workflow: ['1. Initial Diagnosis', '2. Customer Approval', '3. On-Site Solution', '4. Verification & Testing']
        });
      }
      onRefresh();
    } catch (err: any) {
      showMsg(err.message || "Failed to save service", 'error');
    } finally {
      setSaving(false);
    }
  };

  // Save Pricing Matrix
  const handleSavePricingMatrix = async () => {
    setSaving(true);
    try {
      for (const s of services) {
        const current = pricingMatrix[s.id];
        if (current && (current.priceStarting !== s.priceStarting || current.turnaround !== s.turnaround)) {
          await updateService(s.id, {
            priceStarting: current.priceStarting,
            turnaround: current.turnaround
          });
        }
      }
      showMsg("All pricing & turnaround rates saved successfully!");
      onRefresh();
    } catch (err: any) {
      showMsg("Failed to update pricing matrix", 'error');
    } finally {
      setSaving(false);
    }
  };

  // Add Category
  const handleAddCategory = async () => {
    if (!newCategoryTitle.trim()) return;
    const updated = [
      ...categoryList,
      { id: `cat-${Date.now()}`, title: newCategoryTitle.trim(), serviceCount: 0 }
    ];
    setCategoryList(updated);
    setNewCategoryTitle('');
    try {
      await updateProblemCategories(updated);
      showMsg("Problem category added");
      onRefresh();
    } catch (err) {
      showMsg("Failed to add category", 'error');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const updated = categoryList.filter(c => c.id !== id);
    setCategoryList(updated);
    try {
      await updateProblemCategories(updated);
      showMsg("Category removed");
      onRefresh();
    } catch (err) {
      showMsg("Failed to delete category", 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Status Banner (Published / Unpublished) */}
      <div className={`rounded-xl border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isPageUnpublished 
          ? 'border-amber-500/40 bg-amber-950/20' 
          : 'border-emerald-500/40 bg-emerald-950/20'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${isPageUnpublished ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {isPageUnpublished ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Services Page Status:</h3>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                isPageUnpublished ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {pageStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isPageUnpublished 
                ? 'Services page is currently UNPUBLISHED. Public visitors see an offline notice.' 
                : 'Services page is LIVE and visible to all visitors across Peshawar.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onNavigateToPage && (
            <button
              onClick={() => onNavigateToPage('services')}
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
              Edit Services Directory Header
            </h4>
            <button
              onClick={() => setIsEditingHeader(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
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
                placeholder="e.g. ON-SITE SERVICE DIRECTORY"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Page Main Title</label>
              <input
                type="text"
                value={headerTitle}
                onChange={(e) => setHeaderTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                placeholder="Page Title"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Page Subtitle / Description</label>
              <textarea
                value={headerSubtitle}
                onChange={(e) => setHeaderSubtitle(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                placeholder="Page descriptive subtitle"
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

      {/* Sub-Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-400" />
            Computer Services & Pricing Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Create new service offerings, edit turnaround times, toggle visibility and manage pricing.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSubTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              subTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Services ({services.length})
          </button>
          <button
            onClick={() => {
              setEditingService(null);
              setSubTab('add');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              subTab === 'add' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Service
          </button>
          <button
            onClick={() => setSubTab('pricing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              subTab === 'pricing' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pricing Matrix
          </button>
          <button
            onClick={() => setSubTab('categories')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              subTab === 'categories' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Categories
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {statusMsg.type === 'success' ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* 1. ALL SERVICES LIST */}
      {subTab === 'all' && (() => {
        const countAll = services.length;
        const countPublished = services.filter(s => s.status === 'PUBLISHED' || s.status === 'published' || s.status === 'active').length;
        const countUnpublished = services.filter(s => s.status === 'UNPUBLISHED' || s.status === 'unpublished' || s.status === 'inactive').length;
        const countDraft = services.filter(s => s.status === 'DRAFT' || s.status === 'draft').length;
        const countArchived = services.filter(s => s.status === 'ARCHIVED' || s.status === 'archived').length;

        const displayedServices = services.filter(s => {
          if (statusFilter === 'ALL') return true;
          const st = (s.status || '').toUpperCase();
          if (statusFilter === 'PUBLISHED') return st === 'PUBLISHED' || st === 'ACTIVE';
          if (statusFilter === 'UNPUBLISHED') return st === 'UNPUBLISHED' || st === 'INACTIVE';
          return st === statusFilter;
        });

        return (
          <div className="space-y-4">
            {/* Status Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-mono text-slate-400 font-semibold mr-1">Filter:</span>
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All ({countAll})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('PUBLISHED')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  statusFilter === 'PUBLISHED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-emerald-400 hover:bg-emerald-950/40 border border-slate-800'
                }`}
              >
                Published ({countPublished})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('UNPUBLISHED')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  statusFilter === 'UNPUBLISHED'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-900 text-amber-400 hover:bg-amber-950/40 border border-slate-800'
                }`}
              >
                Unpublished ({countUnpublished})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('DRAFT')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  statusFilter === 'DRAFT'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-blue-400 hover:bg-blue-950/40 border border-slate-800'
                }`}
              >
                Draft ({countDraft})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('ARCHIVED')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  statusFilter === 'ARCHIVED'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 text-purple-400 hover:bg-purple-950/40 border border-slate-800'
                }`}
              >
                Archived ({countArchived})
              </button>
            </div>

            {displayedServices.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
                <p className="text-sm font-semibold text-slate-300">No services found in "{statusFilter}" status.</p>
                <p className="text-xs text-slate-500 mt-1">Switch status filter or add a new service.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {displayedServices.map((service, index) => {
                  const isLive = service.status === 'PUBLISHED' || service.status === 'published' || service.status === 'active';
                  const isUnpublished = service.status === 'UNPUBLISHED' || service.status === 'unpublished' || service.status === 'inactive';
                  const isArchived = service.status === 'ARCHIVED' || service.status === 'archived';

                  return (
                    <div 
                      key={service.id}
                      className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {/* Left: Reorder & Info */}
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-1 pt-0.5">
                          <button
                            disabled={index === 0}
                            onClick={() => handleMove(index, 'up')}
                            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            disabled={index === displayedServices.length - 1}
                            onClick={() => handleMove(index, 'down')}
                            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 shrink-0 overflow-hidden">
                          {renderServiceIcon(service.icon, service.customIcon, "h-5 w-5")}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm">{service.title}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                              isLive
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : isArchived
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {isLive ? 'PUBLISHED' : isArchived ? 'ARCHIVED' : isUnpublished ? 'UNPUBLISHED' : String(service.status || 'DRAFT').toUpperCase()}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-blue-400 font-mono">
                              {service.priceStarting}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1">{service.shortDesc}</p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-slate-400" />
                              {service.turnaround}
                            </span>
                            <span>•</span>
                            <span>Workflow: {service.workflow?.length || 0} stages</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
                        {isLive ? (
                          <button
                            onClick={() => handleSetStatus(service.id, 'UNPUBLISHED')}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            title="Unpublish service"
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSetStatus(service.id, 'PUBLISHED')}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30"
                            title="Publish service"
                          >
                            Publish
                          </button>
                        )}

                        {!isArchived && (
                          <button
                            onClick={() => handleSetStatus(service.id, 'ARCHIVED')}
                            className="px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700"
                            title="Archive service"
                          >
                            Archive
                          </button>
                        )}

                        <button
                          onClick={() => handleStartEdit(service)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer transition-colors"
                          title="Edit Service"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        {confirmDeleteId === service.id ? (
                          <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-500/50 p-1 rounded-lg">
                            <button
                              type="button"
                              onClick={() => handleDelete(service.id, service.title)}
                              className="px-2 py-1 rounded text-[11px] font-bold bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 rounded text-[11px] bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(service.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer transition-colors"
                            title="Delete Service Permanently"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* 2. ADD / EDIT SERVICE FORM */}
      {(subTab === 'add' || editingService) && (
        <form onSubmit={handleSubmitForm} className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white">
              {editingService ? `Edit Service: ${editingService.title}` : 'Create New Service Offering'}
            </h3>
            {editingService && (
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Service Title *</label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Blue Screen Crash Dump Diagnosis"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Service Icon & Visual Representation</label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="flex-1">
                  <select
                    value={formData.icon || 'Monitor'}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    {AVAILABLE_ICONS.map(ic => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-700 transition-colors">
                    <Upload className="h-3.5 w-3.5 text-blue-400" />
                    <span>{uploadingIcon ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIconFileUpload}
                      className="hidden"
                      disabled={uploadingIcon}
                    />
                  </label>
                  {formData.customIcon && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, customIcon: '' })}
                      className="px-2 py-1.5 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-800/40 text-xs hover:bg-rose-900/50 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Icon Preview */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 shrink-0 overflow-hidden">
                  {renderServiceIcon(formData.icon, formData.customIcon, "h-4 w-4")}
                </div>
                {formData.customIcon ? (
                  <span className="text-[11px] font-mono text-emerald-400 truncate">Custom: {formData.customIcon}</span>
                ) : (
                  <span className="text-[11px] font-mono text-slate-400">Standard: {formData.icon || 'Monitor'}</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Starting Price *</label>
              <input
                type="text"
                required
                value={formData.priceStarting || ''}
                onChange={(e) => setFormData({ ...formData, priceStarting: e.target.value })}
                placeholder="e.g. From Rs. 1,500"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Turnaround Time</label>
              <input
                type="text"
                value={formData.turnaround || ''}
                onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })}
                placeholder="e.g. 45 – 90 mins"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Price Transparency Note</label>
            <input
              type="text"
              value={formData.priceNote || ''}
              onChange={(e) => setFormData({ ...formData, priceNote: e.target.value })}
              placeholder="e.g. Depends on SSD capacity and required data transfer"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description (Card Summary)</label>
            <input
              type="text"
              value={formData.shortDesc || ''}
              onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
              placeholder="Brief 1-2 sentence overview for the service card"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Technical Description</label>
            <textarea
              rows={3}
              value={formData.fullDesc || ''}
              onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
              placeholder="Comprehensive explanation of what is done on-site"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Workflow Steps Builder */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Step-by-Step Workflow (One per line)</label>
            <textarea
              rows={4}
              value={(formData.workflow || []).join('\n')}
              onChange={(e) => setFormData({ 
                ...formData, 
                workflow: e.target.value.split('\n').filter(s => s.trim().length > 0) 
              })}
              placeholder="1. Hardware diagnosis&#10;2. Partition preparation&#10;3. OS deployment"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            {editingService && (
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : editingService ? 'Update Service' : 'Publish Service'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. PRICING MATRIX */}
      {subTab === 'pricing' && (
        <div className="space-y-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                Quick Pricing & Turnaround Matrix
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Bulk adjust all service prices and turnaround times without opening individual modal editors.
              </p>
            </div>

            <button
              onClick={handleSavePricingMatrix}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save All Prices'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Service Name</th>
                  <th className="px-4 py-3">Starting Rate</th>
                  <th className="px-4 py-3">Turnaround Time</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {services.map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-semibold text-white">{s.title}</td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={pricingMatrix[s.id]?.priceStarting || s.priceStarting}
                        onChange={(e) => setPricingMatrix({
                          ...pricingMatrix,
                          [s.id]: { ...pricingMatrix[s.id], priceStarting: e.target.value }
                        })}
                        className="w-36 rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={pricingMatrix[s.id]?.turnaround || s.turnaround}
                        onChange={(e) => setPricingMatrix({
                          ...pricingMatrix,
                          [s.id]: { ...pricingMatrix[s.id], turnaround: e.target.value }
                        })}
                        className="w-36 rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        (s.status === 'active' || s.status === 'published') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {(s.status === 'active' || s.status === 'published') ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. PROBLEM CATEGORIES */}
      {subTab === 'categories' && (
        <div className="space-y-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-400" />
                Problem Categories & Diagnostic Filters
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage problem classifications shown on the public diagnosis selector.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newCategoryTitle}
              onChange={(e) => setNewCategoryTitle(e.target.value)}
              placeholder="e.g. Laptop Overheating & Thermal Tuning"
              className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white cursor-pointer"
            >
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {categoryList.map(cat => (
              <div 
                key={cat.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
              >
                <span className="text-xs font-semibold text-white">{cat.title}</span>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
