'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface SalesData {
  month: string;
  vendas: number;
  meta: number;
}

export function SalesChart({ data }: { data: SalesData[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF2338" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#FF2338" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tick={{ fill: 'var(--text-faint)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--text-faint)', fontSize: 11 }}
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
          cursor={{ stroke: 'var(--solar)', strokeWidth: 1, strokeDasharray: '3 3' }}
        />
        <Area
          type="monotone"
          dataKey="vendas"
          stroke="#FF2338"
          strokeWidth={2}
          fill="url(#colorVendas)"
          animationDuration={1500}
        />
        <Area
          type="monotone"
          dataKey="meta"
          stroke="#FFFFFF"
          strokeWidth={2}
          strokeDasharray="5 5"
          fill="url(#colorMeta)"
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
