'use client';

import { motion } from 'framer-motion';
import { BarChart3, Download, FileText, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { FunnelChart } from '@/components/dashboard/funnel-chart';
import { funnelData, salesChartData, agents, stands } from '@/lib/mock-data';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };

const standChartData = stands
  .filter((s) => s.status === 'ativo')
  .map((s) => ({
    name: s.name.replace('Stand ', '').substring(0, 12),
    vendas: s.monthly_sales,
    meta: s.monthly_target,
  }))
  .sort((a, b) => b.vendas - a.vendas)
  .slice(0, 8);

const sourceData = [
  { name: 'WhatsApp', value: 35, fill: '#22c55e' },
  { name: 'Site', value: 22, fill: '#67e8f9' },
  { name: 'Stand', value: 18, fill: '#a855f7' },
  { name: 'Instagram', value: 15, fill: '#f472b6' },
  { name: 'Indicação', value: 10, fill: '#fbbf24' },
];

export default function ReportsPage() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--sf-text-primary)]">Relatórios & Analytics</h1>
          <p className="text-sm text-[var(--sf-text-tertiary)] mt-1">Análise completa da operação</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4" /> Exportar PDF
          </Button>
          <Button variant="secondary" size="sm">
            <FileText className="w-4 h-4" /> Exportar Excel
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Receita Total', value: formatCurrency(23500000), change: '+15.2%', color: 'text-emerald-400' },
          { label: 'Ticket Médio', value: formatCurrency(500000), change: '+3.8%', color: 'text-emerald-400' },
          { label: 'Ciclo Médio', value: '18 dias', change: '-2 dias', color: 'text-emerald-400' },
          { label: 'Taxa Perda', value: '10.2%', change: '-1.5%', color: 'text-emerald-400' },
        ].map((item) => (
          <GlassCard key={item.label} glow="cyan" className="!p-4">
            <p className="text-xs text-[var(--sf-text-tertiary)]">{item.label}</p>
            <p className="text-xl font-bold text-[var(--sf-text-primary)] mt-1">{item.value}</p>
            <p className={`text-xs font-medium mt-1 ${item.color}`}>{item.change}</p>
          </GlassCard>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={fadeUp}>
          <GlassCard hover={false}>
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)] mb-4">Vendas vs Meta (Mensal)</h3>
            <SalesChart data={salesChartData} />
          </GlassCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <GlassCard hover={false}>
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)] mb-4">Funil de Conversão</h3>
            <FunnelChart data={funnelData} />
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Vendas por Stand */}
        <motion.div variants={fadeUp}>
          <GlassCard hover={false}>
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)] mb-4">Vendas por Stand</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={standChartData} margin={{ left: -20 }}>
                <XAxis dataKey="name" tick={{ fill: 'var(--sf-text-tertiary)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--sf-text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--sf-bg-secondary)', border: '1px solid var(--sf-border)',
                    borderRadius: '16px', color: 'var(--sf-text-primary)', fontSize: '12px',
                  }}
                />
                <Bar dataKey="vendas" fill="#67e8f9" radius={[6, 6, 0, 0]} fillOpacity={0.7} />
                <Bar dataKey="meta" fill="#a855f7" radius={[6, 6, 0, 0]} fillOpacity={0.4} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Origem dos Leads */}
        <motion.div variants={fadeUp}>
          <GlassCard hover={false}>
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)] mb-4">Origem dos Leads</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={1200}
                  >
                    {sourceData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} fillOpacity={0.8} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--sf-bg-secondary)', border: '1px solid var(--sf-border)',
                      borderRadius: '16px', color: 'var(--sf-text-primary)', fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {sourceData.map((s) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.fill }} />
                    <span className="text-xs text-[var(--sf-text-secondary)]">{s.name}</span>
                    <span className="text-xs font-medium text-[var(--sf-text-secondary)] ml-auto">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Top Agents Table */}
      <motion.div variants={fadeUp}>
        <GlassCard hover={false}>
          <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)] mb-4">Top Agentes por Receita</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--sf-border)]">
                  <th className="text-left py-2 px-3 text-xs text-[var(--sf-text-tertiary)] font-medium">#</th>
                  <th className="text-left py-2 px-3 text-xs text-[var(--sf-text-tertiary)] font-medium">Agente</th>
                  <th className="text-left py-2 px-3 text-xs text-[var(--sf-text-tertiary)] font-medium">Stand</th>
                  <th className="text-right py-2 px-3 text-xs text-[var(--sf-text-tertiary)] font-medium">Vendas</th>
                  <th className="text-right py-2 px-3 text-xs text-[var(--sf-text-tertiary)] font-medium">Conversão</th>
                  <th className="text-right py-2 px-3 text-xs text-[var(--sf-text-tertiary)] font-medium">Receita</th>
                </tr>
              </thead>
              <tbody>
                {[...agents].sort((a, b) => b.revenue - a.revenue).slice(0, 10).map((agent, i) => (
                  <tr key={agent.id} className="border-b border-white/[0.03] hover:bg-[var(--sf-surface)]">
                    <td className="py-2.5 px-3 text-[var(--sf-text-muted)]">{i + 1}</td>
                    <td className="py-2.5 px-3 text-[var(--sf-text-primary)] font-medium">{agent.name}</td>
                    <td className="py-2.5 px-3 text-[var(--sf-text-secondary)]">{agent.stand_name.replace('Stand ', '')}</td>
                    <td className="py-2.5 px-3 text-right text-[var(--sf-text-secondary)]">{agent.total_sales}</td>
                    <td className="py-2.5 px-3 text-right text-[var(--sf-text-secondary)]">{formatPercent(agent.conversion_rate)}</td>
                    <td className="py-2.5 px-3 text-right text-blue-600 dark:text-cyan-300 font-medium">{formatCurrency(agent.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
