import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Laptop, 
  DollarSign, 
  Trash2, 
  Edit3, 
  Calendar,
  Save,
  X,
  Check
} from 'lucide-react';
import { Customer, ServiceRequest } from '../../types';
import { createCustomer, updateCustomer, deleteCustomer } from '../../utils/api';
import { getWhatsAppLink } from '../../utils/whatsapp';

interface AdminCustomersProps {
  customers: Customer[];
  bookings: ServiceRequest[];
  onRefresh: () => void;
  onOpenBookingForCustomer?: (customer: Customer) => void;
  serviceAreas?: string[];
}

export function AdminCustomers({
  customers,
  bookings,
  onRefresh,
  onOpenBookingForCustomer,
  serviceAreas = []
}: AdminCustomersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    whatsapp: '',
    area: serviceAreas[0] || 'University Town',
    address: '',
    devices: ['Windows Laptop'],
    notes: '',
    totalSpent: 'Rs. 0'
  });

  const [saving, setSaving] = useState(false);

  // Filter customers
  const filteredCustomers = customers.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.area.toLowerCase().includes(q) ||
      (c.notes && c.notes.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      phone: '',
      whatsapp: '',
      area: serviceAreas[0] || 'University Town',
      address: '',
      devices: ['Windows Laptop'],
      notes: '',
      totalSpent: 'Rs. 0'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({ ...customer });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteCustomer(id);
      setConfirmDeleteId(null);
      onRefresh();
    } catch (err) {
      console.error("Failed to delete customer:", err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.phone?.trim()) {
      alert("Name and phone number are required");
      return;
    }

    setSaving(true);
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
      } else {
        await createCustomer(formData);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      alert("Failed to save customer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            Customer Relationship Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track client computer history, locations, contact preferences and repeat service appointments in Peshawar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Search & Statistics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, area..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono">
            Total Customers: <strong className="text-white">{customers.length}</strong>
          </span>
        </div>
      </div>

      {/* Customers Cards / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
            No customers found matching "{searchQuery}". Click "Add Customer" to create a new client record.
          </div>
        ) : (
          filteredCustomers.map((c) => {
            const customerBookings = bookings.filter(
              b => b.phone === c.phone || (c.whatsapp && b.whatsapp === c.whatsapp)
            );
            const totalBookingsCount = c.totalBookings || customerBookings.length;

            return (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-sm">{c.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <MapPin className="h-3 w-3 text-blue-400 shrink-0" />
                        <span>{c.area}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {totalBookingsCount} visit{totalBookingsCount === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300 font-mono">
                    <div>📞 {c.phone}</div>
                    {c.whatsapp && c.whatsapp !== c.phone && (
                      <div className="text-emerald-400">💬 {c.whatsapp}</div>
                    )}
                  </div>

                  {c.devices && c.devices.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {c.devices.map((d, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800">
                          {d}
                        </span>
                      ))}
                    </div>
                  )}

                  {c.notes && (
                    <p className="text-[11px] text-slate-400 bg-slate-950/70 p-2 rounded-lg border border-slate-800/80 italic">
                      "{c.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={getWhatsAppLink(
                        c.whatsapp || c.phone,
                        `Hello ${c.name}! This is Safiullah from Peshawar On-Site Computer Support.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                      title="WhatsApp Customer"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={`tel:${c.phone}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                      title="Call Phone"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      title="Edit Customer"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    {confirmDeleteId === c.id ? (
                      <div className="flex items-center gap-1 bg-red-950/80 border border-red-500/50 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id, c.name)}
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(c.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                        title="Delete Customer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD / EDIT CUSTOMER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleSave}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingCustomer ? 'Edit Customer Profile' : 'Add New Customer'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Full Name *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Salman Khan"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0300 1234567"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp</label>
                <input
                  type="text"
                  value={formData.whatsapp || ''}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="0300 1234567"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Peshawar Area</label>
                <select
                  value={formData.area || ''}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  {(serviceAreas.length ? serviceAreas : ['University Town', 'Hayatabad', 'Cantt', 'Saddar']).map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Total Spent</label>
                <input
                  type="text"
                  value={formData.totalSpent || ''}
                  onChange={(e) => setFormData({ ...formData, totalSpent: e.target.value })}
                  placeholder="Rs. 4,500"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Street / House Address</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="House 42, Street 3..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Devices (Comma separated)</label>
              <input
                type="text"
                value={(formData.devices || []).join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  devices: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                })}
                placeholder="Dell Latitude 7490, HP EliteBook"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Technician Private Notes</label>
              <textarea
                rows={2}
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Prefers afternoon appointments, sensitive medical software..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingCustomer ? 'Update Customer' : 'Save Customer'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
