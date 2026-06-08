import type { Quote, Profile, Ratios } from '@/api/types';
import { fmtBig, fmtPrice, fmtRatio, fmtPctFromDecimal } from '@/lib/formatters';

interface Props {
  quote: Quote | null;
  profile: Profile | null;
  ratios: Ratios | null;
}

export default function StatsGrid({ quote, profile, ratios }: Props) {
  const stats: { label: string; value: string }[] = [
    { label: 'Market Cap',  value: fmtBig(quote?.marketCap) },
    { label: 'P/E (TTM)',   value: fmtRatio(ratios?.peRatioTTM ?? quote?.pe) },
    { label: 'EPS (TTM)',   value: quote?.eps != null ? fmtPrice(quote.eps) : '—' },
    { label: 'Div Yield',   value: fmtPctFromDecimal(ratios?.dividendYieldTTM) },
    { label: 'Beta',        value: fmtRatio(profile?.beta) },
    { label: '52W High',    value: fmtPrice(quote?.yearHigh) },
    { label: '52W Low',     value: fmtPrice(quote?.yearLow) },
    { label: 'Day Range',   value: quote?.dayLow != null && quote.dayHigh != null
        ? `${fmtPrice(quote.dayLow)} – ${fmtPrice(quote.dayHigh)}` : '—' },
    { label: 'Volume',      value: fmtBig(quote?.volume) },
    { label: 'Avg Volume',  value: fmtBig(quote?.avgVolume) },
    { label: 'Prev Close',  value: fmtPrice(quote?.previousClose) },
    { label: 'Open',        value: fmtPrice(quote?.open) },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-bg-border rounded-xl overflow-hidden border border-bg-border">
      {stats.map((s) => (
        <div key={s.label} className="bg-bg-surface p-4">
          <div className="kpi-label">{s.label}</div>
          <div className="mt-1.5 num text-lg text-ink-primary">{s.value}</div>
        </div>
      ))}
    </div>
  );
}
