'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { FunnelStage } from '@/types';

export function FunnelChart({ data }: { data: FunnelStage[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 24 }}>
        <defs>
          <linearGradient id="funnelGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#EF4444" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={110}
          tick={{ fill: 'var(--text-soft)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--r)',
            color: 'var(--text)',
            fontSize: '12px',
            boxShadow: 'var(--shadow-md)',
          }}
          cursor={{ fill: 'rgba(245, 158, 11, 0.08)' }}
        />
        <Bar dataKey="value" radius={[0, 8, 8, 0]} animationDuration={1200}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill || 'url(#funnelGrad)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
