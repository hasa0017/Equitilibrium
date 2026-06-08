import type { Ratios } from '@/api/types';
import { fmtRatio, fmtPctFromDecimal } from '@/lib/formatters';

interface Props { ratios: Ratios | null; }

type Row = { label: string; value: string };

export default function RatiosTable({ ratios }: Props) {
  if (!ratios) return null;

  const valuation: Row[] = [
    { label: 'P/E',          value: fmtRatio(ratios.peRatioTTM) },
    { label: 'P/B',          value: fmtRatio(ratios.pbRatioTTM) },
    { label: 'P/S',          value: fmtRatio(ratios.priceToSalesRatioTTM) },
    { label: 'PEG',          value: fmtRatio(ratios.pegRatioTTM) },
    { label: 'EV / EBITDA',  value: fmtRatio(ratios.enterpriseValueOverEBITDATTM) },
    { label: 'Dividend Yield', value: fmtPctFromDecimal(ratios.dividendYieldTTM) },
    { label: 'Payout Ratio',   value: fmtPctFromDecimal(ratios.payoutRatioTTM) },
  ];
  const profitability: Row[] = [
    { label: 'Return on Equity',  value: fmtPctFromDecimal(ratios.returnOnEquityTTM) },
    { label: 'Return on Assets',  value: fmtPctFromDecimal(ratios.returnOnAssetsTTM) },
    { label: 'Gross Margin',      value: fmtPctFromDecimal(ratios.grossProfitMarginTTM) },
    { label: 'Operating Margin',  value: fmtPctFromDecimal(ratios.operatingProfitMarginTTM) },
    { label: 'Net Margin',        value: fmtPctFromDecimal(ratios.netProfitMarginTTM) },
  ];
  const leverage: Row[] = [
    { label: 'Debt / Equity',     value: fmtRatio(ratios.debtEquityRatioTTM) },
    { label: 'Current Ratio',     value: fmtRatio(ratios.currentRatioTTM) },
    { label: 'Quick Ratio',       value: fmtRatio(ratios.quickRatioTTM) },
    { label: 'Interest Coverage', value: fmtRatio(ratios.interestCoverageTTM) },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <RatioBlock title="Valuation" rows={valuation} />
      <RatioBlock title="Profitability" rows={profitability} />
      <RatioBlock title="Leverage & Liquidity" rows={leverage} />
    </div>
  );
}

function RatioBlock({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <div>
      <div className="kpi-label mb-3">{title}</div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-bg-border/60 last:border-0">
              <td className="py-2.5 text-ink-secondary">{r.label}</td>
              <td className="py-2.5 num text-right text-ink-primary">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
