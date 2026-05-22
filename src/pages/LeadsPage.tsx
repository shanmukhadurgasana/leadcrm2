import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useLeads, useUpdateLead, useDeleteLead, Lead } from '@/hooks/useLeads';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_OPTIONS = ['New', 'Contacted', 'Converted', 'Lost'];
const badgeClass: Record<string, string> = {
  New: 'badge-new',
  Contacted: 'badge-contacted',
  Converted: 'badge-converted',
  Lost: 'badge-lost',
};

export default function LeadsPage() {
  const { data: leads = [], isLoading } = useLeads();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});

  const filtered = leads.filter(l => {
    const matchSearch = l.full_name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleEdit = (lead: Lead) => {
    setEditLead(lead);
    setEditForm({ full_name: lead.full_name, email: lead.email, phone: lead.phone, company: lead.company, status: lead.status, notes: lead.notes });
  };

  const handleSaveEdit = async () => {
    if (!editLead) return;
    try {
      await updateLead.mutateAsync({ id: editLead.id, ...editForm });
      toast.success('Lead updated');
      setEditLead(null);
    } catch {
      toast.error('Failed to update lead');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLead.mutateAsync(id);
      toast.success('Lead deleted');
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6">Leads</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg neon-input text-foreground placeholder:text-muted-foreground text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg neon-input text-foreground text-sm bg-background"
        >
          <option value="All">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Name</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">Phone</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Company</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No leads found</td></tr>
              ) : (
                filtered.map((lead, i) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-foreground font-medium">{lead.full_name}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{lead.email}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{lead.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{lead.company}</td>
                    <td className="px-4 py-3"><span className={badgeClass[lead.status] || 'badge-new'}>{lead.status}</span></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(lead)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors mr-1">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(lead.id)} className="p-1.5 rounded-md hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setEditLead(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass-card glow-primary p-6 w-full max-w-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-foreground">Edit Lead</h2>
                <button onClick={() => setEditLead(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {(['full_name', 'email', 'phone', 'company'] as const).map(field => (
                  <input
                    key={field}
                    placeholder={field.replace('_', ' ')}
                    value={(editForm as any)[field] || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, [field]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg neon-input text-foreground placeholder:text-muted-foreground text-sm capitalize"
                  />
                ))}
                <select
                  value={editForm.status || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg neon-input text-foreground text-sm bg-background"
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <textarea
                  placeholder="Notes"
                  value={editForm.notes || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg neon-input text-foreground placeholder:text-muted-foreground text-sm resize-none h-20"
                />
                <button
                  onClick={handleSaveEdit}
                  disabled={updateLead.isPending}
                  className="w-full py-2.5 rounded-lg btn-glow text-foreground font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updateLead.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
