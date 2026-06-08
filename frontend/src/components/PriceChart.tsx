import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import type { PricePoint } from '@/api/types';
import { fmtPrice } from '@/lib/formatters';

interface Props {
  data: PricePoint[];
  positive: boolean;
}

export default function PriceChart({ data, positive }: Props) {
  if (!data || data.length === 0) {
    return <div className="h-72 flex items-center justify-center text-ink-muted text-sm">No price history available.</div>;
  }

  const color = positive ? '#3D7BFF' : '#FF4757';
  const first = data[0]?.close ?? 0;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="80%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fill: '#6B7B9E', fontSize: 11, fontFamily: 'Geist Mono' }}
            axisLine={{ stroke: '#1B2942' }}
            tickLine={false}
            minTickGap={48}
          />
          <YAxis
            domain={['dataMin - dataMin * 0.02', 'dataMax + dataMax * 0.02']}
            tick={{ fill: '#6B7B9E', fontSize: 11, fontFamily: 'Geist Mono' }}
            axisLine={{ stroke: '#1B2942' }}
            tickLine={false}
            width={56}
            tickFormatter={(v) => fmtPrice(v as number)}
          />
          <Tooltip
            contentStyle={{
              background: '#0E1729', border: '1px solid #1B2942',
              borderRadius: 8, fontSize: 12, fontFamily: 'Geist Mono',
            }}
            labelStyle={{ color: '#A1B0CC' }}
            formatter={(v: number) => [fmtPrice(v), 'Close']}
          />
          <ReferenceLine y={first} stroke="#1B2942" strokeDasharray="3 4" />
          <Area
            type="monotone"
            dataKey="close"
            stroke={color}
            strokeWidth={2}
            fill="url(#priceFill)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
