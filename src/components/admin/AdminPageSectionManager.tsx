import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  Plus, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Save, 
  X, 
  Sparkles,
  Layers,
  Wrench,
  ShieldCheck,
  Users,
  Building2,
  HelpCircle,
  MapPin,
  Clock,
  AlertCircle
} from 'lucide-react';
import { PageSectionsData, FAQItem, ContentStatus } from '../../types';
import { 
  updatePageStatus, 
  updatePageSection, 
  addSectionItem, 
  updateSectionItem, 
  deleteSectionItem, 
  toggleSectionItemStatus,
  createFAQ,
  updateFAQ,
  deleteFAQ
} from '../../utils/api';

interface AdminPageSectionManagerProps {
  pageKey: 'how-it-works' | 'why-on-site' | 'who-we-serve' | 'bulk-windows' | 'technician' | 'faq' | 'contact';
  pageSections: PageSectionsData;
  faqs?: FAQItem[];
  onRefresh: () => void;
  onNavigateToPage?: (page: string) => void;
}

export function AdminPageSectionManager({
  pageKey,
  pageSections,
  faqs = [],
  onRefresh,
  onNavigateToPage
}: AdminPageSectionManagerProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>('primary');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit Page Header State
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');
  const [headerSubtitle, setHeaderSubtitle] = useState('');
  const [headerBadge, setHeaderBadge] = useState('');

  // Edit / Add Item Modal State
  const [editingItem, setEditingItem] = useState<{
    collectionKey: string;
    item: any;
    isNew: boolean;
  } | null>(null);

  const [itemForm, setItemForm] = useState<any>({
    title: '',
    desc: '',
    num: '',
    step: '',
    badge: '',
    tagline: '',
    headline: '',
    ratePerPc: 500,
    minPCs: 5,
    maxPCs: 10,
    speed: '',
    note: '',
    servicesList: ''
  });

  const sectionData: any = pageSections?.[pageKey] || {};
  const pageStatus: ContentStatus = pageSections?.pageStatuses?.[pageKey] || sectionData?.pageStatus || 'published';
  const isPagePublished = pageStatus === 'published' || pageStatus === 'active';

  const showToast = (type: 'success' | 'error', text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  // Toggle Whole Page Publish / Unpublish
  const handleTogglePagePublish = async () => {
    setLoading(true);
    const newStatus = isPagePublished ? 'unpublished' : 'published';
    try {
      await updatePageStatus(pageKey, newStatus);
      showToast('success', `Page "${pageMeta.title}" is now ${newStatus.toUpperCase()}!`);
      onRefresh();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update page status');
    } finally {
      setLoading(false);
    }
  };

  // Open Edit Page Header Modal
  const openHeaderModal = () => {
    setHeaderTitle(sectionData?.title || pageMeta.defaultTitle);
    setHeaderSubtitle(sectionData?.subtitle || pageMeta.defaultSubtitle);
    setHeaderBadge(sectionData?.badge || pageMeta.defaultBadge);
    setIsEditingHeader(true);
  };

  const handleSaveHeader = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePageSection(pageKey, {
        title: headerTitle,
        subtitle: headerSubtitle,
        badge: headerBadge
      });
      showToast('success', 'Page header updated successfully!');
      setIsEditingHeader(false);
      onRefresh();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update header');
    } finally {
      setLoading(false);
    }
  };

  // Open Add Item Modal
  const openAddItemModal = (collectionKey: string) => {
    setItemForm({
      title: '',
      desc: '',
      num: '',
      step: '',
      badge: '',
      tagline: '',
      headline: '',
      ratePerPc: 600,
      minPCs: 5,
      maxPCs: 20,
      speed: '20 - 40 Mins',
      note: 'Fast Dispatch',
      servicesList: ''
    });
    setEditingItem({
      collectionKey,
      item: null,
      isNew: true
    });
  };

  // Open Edit Item Modal
  const openEditItemModal = (collectionKey: string, item: any) => {
    setItemForm({
      title: item.title || item.name || item.question || '',
      desc: item.desc || item.answer || item.description || '',
      num: item.num || '',
      step: item.step || '',
      badge: item.badge || '',
      tagline: item.tagline || '',
      headline: item.headline || '',
      ratePerPc: item.ratePerPc || 600,
      minPCs: item.minPCs || 5,
      maxPCs: item.maxPCs || 20,
      speed: item.speed || '',
      note: item.note || '',
      servicesList: Array.isArray(item.services) ? item.services.join('\n') : ''
    });
    setEditingItem({
      collectionKey,
      item,
      isNew: false
    });
  };

  // Toggle Content Item Status
  const handleToggleItemStatus = async (collectionKey: string, itemId: string) => {
    setLoading(true);
    try {
      if (pageKey === 'faq' && collectionKey === 'faqs') {
        const targetFaq = faqs.find(f => f.id === itemId);
        if (targetFaq) {
          const newStatus = (targetFaq as any).status === 'unpublished' ? 'published' : 'unpublished';
          await updateFAQ(itemId, { ...targetFaq, status: newStatus } as any);
        }
      } else {
        await toggleSectionItemStatus(pageKey, collectionKey, itemId);
      }
      showToast('success', 'Content status updated!');
      onRefresh();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to toggle status');
    } finally {
      setLoading(false);
    }
  };

  // Delete Content Item
  const handleDeleteItem = async (collectionKey: string, itemId: string, itemTitle: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${itemTitle}"?`)) return;
    setLoading(true);
    try {
      if (pageKey === 'faq' && collectionKey === 'faqs') {
        await deleteFAQ(itemId);
      } else {
        await deleteSectionItem(pageKey, collectionKey, itemId);
      }
      showToast('success', `Deleted "${itemTitle}" successfully.`);
      onRefresh();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  // Save Add or Edit Item
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setLoading(true);

    const payload: any = {
      title: itemForm.title,
      name: itemForm.title,
      question: itemForm.title,
      desc: itemForm.desc,
      answer: itemForm.desc,
      num: itemForm.num,
      step: itemForm.step,
      badge: itemForm.badge,
      tagline: itemForm.tagline,
      headline: itemForm.headline,
      ratePerPc: Number(itemForm.ratePerPc) || 500,
      minPCs: Number(itemForm.minPCs) || 5,
      maxPCs: Number(itemForm.maxPCs) || 20,
      speed: itemForm.speed,
      note: itemForm.note,
      status: editingItem.isNew ? 'published' : (editingItem.item?.status || 'published')
    };

    if (itemForm.servicesList) {
      payload.services = itemForm.servicesList
        .split('\n')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
    }

    try {
      if (pageKey === 'faq' && editingItem.collectionKey === 'faqs') {
        if (editingItem.isNew) {
          await createFAQ({
            question: itemForm.title,
            answer: itemForm.desc,
            category: 'general'
          });
        } else {
          await updateFAQ(editingItem.item.id, {
            ...editingItem.item,
            question: itemForm.title,
            answer: itemForm.desc
          });
        }
      } else {
        if (editingItem.isNew) {
          await addSectionItem(pageKey, editingItem.collectionKey, payload);
        } else {
          await updateSectionItem(pageKey, editingItem.collectionKey, editingItem.item.id, payload);
        }
      }
      showToast('success', editingItem.isNew ? 'New item added successfully!' : 'Item updated successfully!');
      setEditingItem(null);
      onRefresh();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  // Configuration for each Page Key
  const pageConfigs: Record<string, {
    title: string;
    route: string;
    icon: any;
    defaultBadge: string;
    defaultTitle: string;
    defaultSubtitle: string;
    tabs: { id: string; label: string; collectionKey: string; itemType: string }[];
  }> = {
    'how-it-works': {
      title: 'How It Works Page',
      route: 'how-it-works',
      icon: Clock,
      defaultBadge: 'TRANSPARENT ON-SITE PROTOCOL',
      defaultTitle: 'How Our On-Site Service Works',
      defaultSubtitle: 'Simple, honest, and transparent computer assistance delivered right to your home, hostel, or office in Peshawar.',
      tabs: [
        { id: 'primary', label: 'Workflow Steps (4)', collectionKey: 'steps', itemType: 'Workflow Step' },
        { id: 'toolkit', label: 'Diagnostic Toolkit (4)', collectionKey: 'toolkit', itemType: 'Toolkit Item' }
      ]
    },
    'why-on-site': {
      title: 'Why On-Site Page',
      route: 'why-on-site',
      icon: ShieldCheck,
      defaultBadge: 'TRANSPARENCY & PEACE OF MIND',
      defaultTitle: 'Why Choose On-Site Service Over a Repair Shop?',
      defaultSubtitle: 'Taking your computer to a crowded repair shop in Saddar or City Bazaar exposes your private data. On-site computer repair changes that completely.',
      tabs: [
        { id: 'primary', label: 'Privacy & Safety Pillars (4)', collectionKey: 'pillars', itemType: 'Privacy Pillar' },
        { id: 'shop-steps', label: 'Traditional Shop Steps (Compare)', collectionKey: 'shopSteps', itemType: 'Traditional Step' },
        { id: 'our-steps', label: 'Our On-Site Solution Steps', collectionKey: 'ourSteps', itemType: 'On-Site Step' }
      ]
    },
    'who-we-serve': {
      title: 'Who We Serve Page',
      route: 'who-we-serve',
      icon: Users,
      defaultBadge: 'CUSTOMIZED ON-SITE SUPPORT',
      defaultTitle: 'Who We Serve in Peshawar',
      defaultSubtitle: 'Tailored solutions for hostel students, home desktops, clinics, and offices in Peshawar.',
      tabs: [
        { id: 'primary', label: 'Audience Tiers & Profiles (3)', collectionKey: 'audiences', itemType: 'Audience Tier' }
      ]
    },
    'bulk-windows': {
      title: 'Bulk Windows Page',
      route: 'bulk-windows',
      icon: Building2,
      defaultBadge: 'INSTITUTIONAL LAB DEPLOYMENT',
      defaultTitle: 'Bulk Windows Deployment for Institutions & Offices',
      defaultSubtitle: 'Standardized operating system deployment and driver automation for 5 to 50+ PCs in Peshawar.',
      tabs: [
        { id: 'primary', label: 'Volume Pricing Tiers (4)', collectionKey: 'pricingTiers', itemType: 'Volume Tier' },
        { id: 'features', label: 'Institutional Lab Features (4)', collectionKey: 'labFeatures', itemType: 'Lab Feature' }
      ]
    },
    'technician': {
      title: 'Technician Profile Page',
      route: 'technician',
      icon: Wrench,
      defaultBadge: 'PRIMARY TECHNICIAN PROFILE',
      defaultTitle: 'Meet Your Technician: Safiullah',
      defaultSubtitle: 'Independent on-site technical assistance by Safiullah — Computer Science & Cybersecurity practitioner in Peshawar.',
      tabs: [
        { id: 'primary', label: 'Ethical Standards & Code (4)', collectionKey: 'ethicalCodes', itemType: 'Ethical Standard' }
      ]
    },
    'faq': {
      title: 'Frequently Asked Questions (FAQ) Page',
      route: 'faq',
      icon: HelpCircle,
      defaultBadge: 'FREQUENTLY ASKED QUESTIONS',
      defaultTitle: 'Frequently Asked Questions',
      defaultSubtitle: 'Clear, direct answers about our on-site computer support in Peshawar, pricing, privacy, and procedures.',
      tabs: [
        { id: 'primary', label: `All FAQs (${faqs.length})`, collectionKey: 'faqs', itemType: 'FAQ Question' }
      ]
    },
    'contact': {
      title: 'Contact & Dispatch Areas Page',
      route: 'contact',
      icon: MapPin,
      defaultBadge: 'DIRECT ON-SITE DISPATCH',
      defaultTitle: 'Schedule On-Site Support or Consult Directly',
      defaultSubtitle: 'Submit our service booking form or send a WhatsApp message for rapid response in Peshawar.',
      tabs: [
        { id: 'primary', label: 'Peshawar Service Areas Coverage (8)', collectionKey: 'peshawarAreas', itemType: 'Dispatch Area' }
      ]
    }
  };

  const pageMeta = pageConfigs[pageKey] || pageConfigs['how-it-works'];
  const PageIcon = pageMeta.icon;

  // Active tab collection
  const currentTab = pageMeta.tabs.find(t => t.id === activeSubTab) || pageMeta.tabs[0];
  const collectionKey = currentTab.collectionKey;

  // Items for current collection
  let currentItems: any[] = [];
  if (pageKey === 'faq' && collectionKey === 'faqs') {
    currentItems = faqs;
  } else {
    currentItems = Array.isArray(sectionData?.[collectionKey]) ? sectionData[collectionKey] : [];
  }

  return (
    <div className="space-y-6">
      {/* Toast message */}
      {msg && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between border ${
          msg.type === 'success' 
            ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' 
            : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
        }`}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Page Management Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <PageIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-white tracking-tight font-mono">
                {pageMeta.title}
              </h2>
              {/* Status Badge */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-bold border ${
                isPagePublished 
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                  : 'bg-amber-500/10 border-amber-500/40 text-amber-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isPagePublished ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                {isPagePublished ? 'PAGE PUBLISHED (LIVE)' : 'PAGE UNPUBLISHED (HIDDEN)'}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1 max-w-2xl line-clamp-2">
              {sectionData?.subtitle || pageMeta.defaultSubtitle}
            </p>

            <div className="mt-2 flex items-center gap-3 text-xs font-mono text-slate-400">
              <span>Route: <strong className="text-slate-200">/#{pageMeta.route}</strong></span>
              <span>•</span>
              <span>Total Items: <strong className="text-blue-400">{currentItems.length}</strong></span>
            </div>
          </div>
        </div>

        {/* Top Control Actions */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {/* Edit Page Header */}
          <button
            type="button"
            onClick={openHeaderModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5 text-blue-400" />
            <span>Edit Page Header</span>
          </button>

          {/* Toggle Page Publish Status Button */}
          <button
            type="button"
            onClick={handleTogglePagePublish}
            disabled={loading}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
              isPagePublished
                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-950/40'
            }`}
          >
            {isPagePublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{isPagePublished ? 'Unpublish Entire Page' : 'Publish Entire Page'}</span>
          </button>

          {/* Live Preview Button */}
          {onNavigateToPage && (
            <button
              type="button"
              onClick={() => onNavigateToPage(pageMeta.route)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-bold border border-blue-500/40 transition-colors cursor-pointer"
              title="Open and test live page in customer view"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Preview Live</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Collection Tabs (if page has multiple collections) */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {pageMeta.tabs.map(tab => {
            const isActive = tab.id === activeSubTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* + Add New Item Button */}
        <button
          type="button"
          onClick={() => openAddItemModal(collectionKey)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add New {currentTab.itemType}</span>
        </button>
      </div>

      {/* Content Items Grid / List */}
      {currentItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
          <AlertCircle className="h-8 w-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-300 font-semibold">No content items found in this section.</p>
          <p className="text-xs text-slate-500 mt-1">Click the button above to add a new {currentTab.itemType}.</p>
          <button
            type="button"
            onClick={() => openAddItemModal(collectionKey)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add First {currentTab.itemType}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentItems.map((item, index) => {
            const itemTitle = item.title || item.name || item.question || `Item ${index + 1}`;
            const itemDesc = item.desc || item.answer || item.headline || item.description || '';
            const isItemPublished = item.status !== 'unpublished' && item.status !== 'inactive';

            return (
              <div
                key={item.id || index}
                className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                  isItemPublished 
                    ? 'border-slate-800 bg-slate-900/40 hover:border-slate-700' 
                    : 'border-amber-900/40 bg-amber-950/10 opacity-75'
                }`}
              >
                <div>
                  {/* Top Bar with Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.num && (
                        <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 font-mono text-[10px] font-bold border border-blue-800/40">
                          {item.num}
                        </span>
                      )}
                      {item.step && (
                        <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 font-mono text-[10px] font-bold border border-blue-800/40">
                          STEP {item.step}
                        </span>
                      )}
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 font-mono text-[10px] font-bold border border-purple-800/40">
                          {item.badge}
                        </span>
                      )}
                      {item.ratePerPc && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-800/40">
                          Rs. {item.ratePerPc} / PC
                        </span>
                      )}
                      {item.speed && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-800/40">
                          {item.speed}
                        </span>
                      )}
                    </div>

                    {/* Publish status indicator */}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border flex items-center gap-1 ${
                      isItemPublished
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                        : 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isItemPublished ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                      {isItemPublished ? 'PUBLISHED' : 'UNPUBLISHED'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {itemTitle}
                  </h3>

                  {item.tagline && (
                    <p className="text-xs font-mono text-cyan-400 mt-0.5">
                      {item.tagline}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-3">
                    {itemDesc}
                  </p>

                  {/* Services list (if audience) */}
                  {Array.isArray(item.services) && item.services.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80">
                      <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
                        Tailored Services Included ({item.services.length}):
                      </div>
                      <ul className="text-[11px] text-slate-300 space-y-1">
                        {item.services.slice(0, 3).map((srv: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-blue-400">•</span>
                            <span className="truncate">{srv}</span>
                          </li>
                        ))}
                        {item.services.length > 3 && (
                          <li className="text-[10px] text-slate-500 italic">
                            + {item.services.length - 3} more services
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Card Action Controls: Publish/Unpublish, Edit, Delete */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  {/* Publish / Unpublish Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleItemStatus(collectionKey, item.id)}
                    disabled={loading}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                      isItemPublished
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        : 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border-emerald-500/40'
                    }`}
                    title={isItemPublished ? "Hide this item from live visitors" : "Make this item visible on live site"}
                  >
                    {isItemPublished ? <EyeOff className="h-3 w-3 text-amber-400" /> : <Eye className="h-3 w-3 text-emerald-400" />}
                    <span>{isItemPublished ? 'Unpublish' : 'Publish'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => openEditItemModal(collectionKey, item)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 transition-colors cursor-pointer"
                      title="Edit item content"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(collectionKey, item.id, itemTitle)}
                      className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 transition-colors cursor-pointer"
                      title="Permanently delete item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Edit Page Header */}
      {isEditingHeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-mono">
                Edit {pageMeta.title} Header
              </h3>
              <button
                onClick={() => setIsEditingHeader(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHeader} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Header Badge / Tagline</label>
                <input
                  type="text"
                  value={headerBadge}
                  onChange={e => setHeaderBadge(e.target.value)}
                  placeholder="e.g. TRANSPARENT ON-SITE PROTOCOL"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Main Heading (Title)</label>
                <input
                  type="text"
                  value={headerTitle}
                  onChange={e => setHeaderTitle(e.target.value)}
                  placeholder="Page title displayed to visitors"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Subtitle / Descriptive Text</label>
                <textarea
                  rows={3}
                  value={headerSubtitle}
                  onChange={e => setHeaderSubtitle(e.target.value)}
                  placeholder="Clear description explaining what this page offers"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingHeader(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-500 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Header'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Item */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-mono">
                {editingItem.isNew ? `Add New ${currentTab.itemType}` : `Edit ${currentTab.itemType}`}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="mt-4 space-y-4">
              {/* Optional Step / Number */}
              {(currentTab.collectionKey === 'steps' || currentTab.collectionKey === 'shopSteps' || currentTab.collectionKey === 'ourSteps') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Step Number / Tag</label>
                    <input
                      type="text"
                      value={itemForm.num || itemForm.step}
                      onChange={e => setItemForm({ ...itemForm, num: e.target.value, step: e.target.value })}
                      placeholder="e.g. STEP 01 or 01"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Badge (optional)</label>
                    <input
                      type="text"
                      value={itemForm.badge}
                      onChange={e => setItemForm({ ...itemForm, badge: e.target.value })}
                      placeholder="e.g. QUICK START"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Title / Name / Question */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  {pageKey === 'faq' ? 'Question' : 'Title / Heading'}
                </label>
                <input
                  type="text"
                  value={itemForm.title}
                  onChange={e => setItemForm({ ...itemForm, title: e.target.value })}
                  placeholder="Enter title..."
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none font-bold"
                />
              </div>

              {/* Tagline / Subtitle for Audience */}
              {currentTab.collectionKey === 'audiences' && (
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Tagline / Campus / Group</label>
                  <input
                    type="text"
                    value={itemForm.tagline}
                    onChange={e => setItemForm({ ...itemForm, tagline: e.target.value })}
                    placeholder="e.g. Agriculture University, Peshawar Uni, Medical Campuses"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Pricing tier fields */}
              {currentTab.collectionKey === 'pricingTiers' && (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Rate / PC (Rs.)</label>
                    <input
                      type="number"
                      value={itemForm.ratePerPc}
                      onChange={e => setItemForm({ ...itemForm, ratePerPc: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Min PCs</label>
                    <input
                      type="number"
                      value={itemForm.minPCs}
                      onChange={e => setItemForm({ ...itemForm, minPCs: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Max PCs</label>
                    <input
                      type="number"
                      value={itemForm.maxPCs}
                      onChange={e => setItemForm({ ...itemForm, maxPCs: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Area fields */}
              {currentTab.collectionKey === 'peshawarAreas' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Dispatch Speed (e.g. 20 - 40 Mins)</label>
                    <input
                      type="text"
                      value={itemForm.speed}
                      onChange={e => setItemForm({ ...itemForm, speed: e.target.value })}
                      placeholder="e.g. 20 - 40 Mins"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Dispatch Tag</label>
                    <input
                      type="text"
                      value={itemForm.note}
                      onChange={e => setItemForm({ ...itemForm, note: e.target.value })}
                      placeholder="e.g. Fast Dispatch"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Description / Details / Answer */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  {pageKey === 'faq' ? 'Answer' : 'Description / Details'}
                </label>
                <textarea
                  rows={4}
                  value={itemForm.desc}
                  onChange={e => setItemForm({ ...itemForm, desc: e.target.value })}
                  placeholder="Enter detailed description..."
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Services List for Audience */}
              {currentTab.collectionKey === 'audiences' && (
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Specific Services (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={itemForm.servicesList}
                    onChange={e => setItemForm({ ...itemForm, servicesList: e.target.value })}
                    placeholder="Clean Windows 10 & 11 setups&#10;HDD to SSD upgrades&#10;BSOD diagnostics"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white font-mono placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-500 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingItem.isNew ? 'Create Item' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
