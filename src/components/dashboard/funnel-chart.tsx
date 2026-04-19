'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { FunnelStage } from '@/types';

export function FunnelChart({ data }: { data: FunnelStage[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={110}
          tick={{ fill: 'var(--sf-text-tertiary)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--sf-bg-secondary)',
            border: '1px solid var(--sf-border)',
            borderRadius: '16px',
            color: 'var(--sf-text-primary)',
            fontSize: '12px',
            boxShadow: 'var(--sf-shadow-md)',
          }}
          cursor={{ fill: 'var(--sf-accent-light)' }}
        />
        <Bar dataKey="value" radius={[0, 8, 8, 0]} animationDuration={1200}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
