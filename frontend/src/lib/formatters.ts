export const fmtPrice = (n: number | null | undefined, dp = 2) =>
  n == null || isNaN(n) ? '—' : n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });

export const fmtPct = (n: number | null | undefined, dp = 2) => {
  if (n == null || isNaN(n)) return '—';
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(dp)}%`;
};

export const fmtBig = (n: number | null | undefined) => {
  if (n == null || isNaN(n)) return '—';
  const abs = Math.abs(n);
  if (abs >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (abs >= 1e9)  return `${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6)  return `${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3)  return `${(n / 1e3).toFixed(2)}K`;
  return n.toFixed(0);
};

export const fmtRatio = (n: number | null | undefined, dp = 2) =>
  n == null || isNaN(n) ? '—' : n.toFixed(dp);

export const fmtPctFromDecimal = (n: number | null | undefined, dp = 2) =>
  n == null || isNaN(n) ? '—' : `${(n * 100).toFixed(dp)}%`;

export const fmtDate = (iso: string | null | undefined) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return iso; }
};

export const upDownClass = (n: number | null | undefined) =>
  n == null || n === 0 ? 'text-ink-secondary' : n > 0 ? 'text-bull' : 'text-bear';
