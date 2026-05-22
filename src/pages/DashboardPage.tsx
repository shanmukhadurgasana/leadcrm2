import { AppLayout } from '@/components/AppLayout';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { useLeads } from '@/hooks/useLeads';
import { motion } from 'framer-motion';
import { Users, UserPlus, Phone, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#EF4444'];

export default function DashboardPage() {
  const { data: leads = [], isLoading } = useLeads();

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    contacted: leads.filter(l => l.status === 'Contacted').length,
    converted: leads.filter(l => l.status === 'Converted').length,
  };

  const barData = [
    { name: 'New', value: stats.new },
    { name: 'Contacted', value: stats.contacted },
    { name: 'Converted', value: stats.converted },
    { name: 'Lost', value: leads.filter(l => l.status === 'Lost').length },
  ];

  const pieData = barData.filter(d => d.value > 0);

  const statCards = [
    { label: 'Total Leads', value: stats.total, icon: Users, gradient: 'gradient-border-card' },
    { label: 'New Leads', value: stats.new, icon: UserPlus, gradient: 'gradient-border-card gradient-border-cyan' },
    { label: 'Contacted', value: stats.contacted, icon: Phone, gradient: 'gradient-border-card gradient-border-warm' },
    { label: 'Converted', value: stats.converted, icon: CheckCircle, gradient: 'gradient-border-card gradient-border-success' },
  ];

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={card.gradient}
          >
            <div className="card-inner flex items-center gap-4">
              <div className="p-3 rounded-lg bg-muted">
                <card.icon className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold text-foreground">
                  <AnimatedCounter target={card.value} />
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Leads by Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 16%)" />
              <XAxis dataKey="name" stroke="hsl(215, 20%, 65%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: 'hsl(240, 10%, 8%)', border: '1px solid hsl(240, 10%, 16%)', borderRadius: '0.75rem', color: '#fff' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData.length > 0 ? pieData : [{ name: 'No Data', value: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {(pieData.length > 0 ? pieData : [{ name: 'No Data', value: 1 }]).map((_, i) => (
                  <Cell key={i} fill={pieData.length > 0 ? COLORS[i % COLORS.length] : 'hsl(240, 10%, 20%)'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'hsl(240, 10%, 8%)', border: '1px solid hsl(240, 10%, 16%)', borderRadius: '0.75rem', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </AppLayout>
  );
}
