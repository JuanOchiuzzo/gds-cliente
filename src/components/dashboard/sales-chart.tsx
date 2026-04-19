'use client';

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

interface SalesData {
  month: string;
  vendas: number;
  meta: number;
}

export function SalesChart({ data }: { data: SalesData[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--sf-border)" />
        <XAxis
          dataKey="month"
          tick={{ fill: 'var(--sf-text-tertiary)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
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
        />
        <Area
          type="monotone"
          dataKey="vendas"
          stroke="#2563eb"
          strokeWidth={2}
          fill="url(#colorVendas)"
          animationDuration={1500}
        />
        <Area
          type="monotone"
          dataKey="meta"
          stroke="#7c3aed"
          strokeWidth={2}
          strokeDasharray="5 5"
          fill="url(#colorMeta)"
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
