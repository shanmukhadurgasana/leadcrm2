import { AppLayout } from '@/components/AppLayout';
import { useLeads } from '@/hooks/useLeads';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from 'recharts';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#EF4444', '#F59E0B', '#06B6D4'];
const tooltipStyle = { background: 'hsl(240, 10%, 8%)', border: '1px solid hsl(240, 10%, 16%)', borderRadius: '0.75rem', color: '#fff' };

export default function AnalyticsPage() {
  const { data: leads = [] } = useLeads();

  const statusData = [
    { name: 'New', value: leads.filter(l => l.status === 'New').length },
    { name: 'Contacted', value: leads.filter(l => l.status === 'Contacted').length },
    { name: 'Converted', value: leads.filter(l => l.status === 'Converted').length },
    { name: 'Lost', value: leads.filter(l => l.status === 'Lost').length },
  ];

  const sources = leads.reduce((acc: Record<string, number>, l) => {
    const src = l.source || 'Unknown';
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {});
  const sourceData = Object.entries(sources).map(([name, value]) => ({ name, value }));

  const conversionRate = leads.length > 0
    ? Math.round((leads.filter(l => l.status === 'Converted').length / leads.length) * 100)
    : 0;

  // Monthly trend (mock based on created_at)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.toLocaleString('default', { month: 'short' });
    const count = leads.filter(l => {
      const ld = new Date(l.created_at);
      return ld.getMonth() === d.getMonth() && ld.getFullYear() === d.getFullYear();
    }).length;
    return { month, leads: count };
  });

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6">Analytics</h1>

      {/* Conversion stat */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-border-card gradient-border-success mb-6 max-w-xs"
      >
        <div className="card-inner text-center">
          <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
          <p className="text-4xl font-bold text-foreground">
            <AnimatedCounter target={conversionRate} suffix="%" />
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Leads by Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 16%)" />
              <XAxis dataKey="name" stroke="hsl(215, 20%, 65%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Source Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Leads by Source</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={sourceData.length > 0 ? sourceData : [{ name: 'No Data', value: 1 }]} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                {(sourceData.length > 0 ? sourceData : [{ name: 'No Data', value: 1 }]).map((_, i) => (
                  <Cell key={i} fill={sourceData.length > 0 ? COLORS[i % COLORS.length] : 'hsl(240, 10%, 20%)'} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [value, name]} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          {sourceData.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 justify-center">
              {sourceData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-muted-foreground">{entry.name}</span>
                  <span className="text-xs font-semibold text-foreground">({entry.value})</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs text-muted-foreground mt-3">No source data available</p>
          )}
        </motion.div>

        {/* Growth Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-foreground mb-4">Growth Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 16%)" />
              <XAxis dataKey="month" stroke="hsl(215, 20%, 65%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="leads" stroke="#8B5CF6" fill="url(#areaGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </AppLayout>
  );
}
