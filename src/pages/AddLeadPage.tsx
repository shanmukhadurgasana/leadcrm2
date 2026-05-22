import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useAddLead } from '@/hooks/useLeads';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const initialForm = { full_name: '', email: '', phone: '', company: '', source: '', status: 'New', notes: '' };

export default function AddLeadPage() {
  const [form, setForm] = useState(initialForm);
  const addLead = useAddLead();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addLead.mutateAsync(form);
      toast.success('Lead added successfully!');
      navigate('/leads');
    } catch {
      toast.error('Failed to add lead');
    }
  };

  const fields = [
    { name: 'full_name', label: 'Full Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone', type: 'tel' },
  ] as const;

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6">Add New Lead</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((field, i) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <label className="block text-sm text-muted-foreground mb-1.5 font-medium">{field.label}</label>
              <input
                type={field.type}
                required={field.name === 'full_name' || field.name === 'email'}
                value={(form as any)[field.name]}
                onChange={e => setForm(prev => ({ ...prev, [field.name]: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg neon-input text-foreground placeholder:text-muted-foreground text-sm"
                placeholder={field.label}
              />
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.24 }}>
            <label className="block text-sm text-muted-foreground mb-1.5 font-medium">Company</label>
            <select
              value={form.company}
              onChange={e => setForm(prev => ({ ...prev, company: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg neon-input text-foreground text-sm bg-background"
            >
              <option value="">Select company type...</option>
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
              <option value="IT Techs">IT Techs</option>
              <option value="Self">Self</option>
            </select>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.32 }}>
            <label className="block text-sm text-muted-foreground mb-1.5 font-medium">Source</label>
            <select
              value={form.source}
              onChange={e => setForm(prev => ({ ...prev, source: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg neon-input text-foreground text-sm bg-background"
            >
              <option value="">Select lead source...</option>
              <option value="Website">Website</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Instagram">Instagram</option>
              <option value="Other">Other</option>
            </select>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <label className="block text-sm text-muted-foreground mb-1.5 font-medium">Status</label>
            <select
              value={form.status}
              onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg neon-input text-foreground text-sm bg-background"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.48 }}>
            <label className="block text-sm text-muted-foreground mb-1.5 font-medium">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg neon-input text-foreground placeholder:text-muted-foreground text-sm resize-none h-24"
              placeholder="Additional notes..."
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={addLead.isPending}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3 rounded-lg btn-glow text-foreground font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {addLead.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Add Lead
          </motion.button>
        </form>
      </motion.div>
    </AppLayout>
  );
}
