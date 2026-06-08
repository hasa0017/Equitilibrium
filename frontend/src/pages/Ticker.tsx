import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { api, queryKeys } from '@/api/client';
import { fmtPrice, fmtPct, fmtDate, upDownClass } from '@/lib/formatters';
import PriceChart from '@/components/PriceChart';
import StatsGrid from '@/components/StatsGrid';
import RatiosTable from '@/components/RatiosTable';
import RangeSelector from '@/components/RangeSelector';

export default function Ticker() {
  const { symbol = '' } = useParams();
  const [range, setRange] = useState('1Y');

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.ticker(symbol, range),
    queryFn: () => api.ticker.full(symbol, range),
    enabled: !!symbol,
  });

  if (isLoading) return <Skeleton />;
  if (error || !data) {
    return (
      <div className="card card-roomy">
        <div className="kpi-label text-bear mb-2">Lookup failed</div>
        <h2 className="font-display text-2xl mb-1">Couldn't load <span className="num">{symbol}</span></h2>
        <p className="text-sm text-ink-secondary">
          Either the ticker doesn't exist or the FMP free-tier quota is exhausted for the day.
          {' '}<Link to="/" className="text-bull hover:underline">Try another</Link>.
        </p>
      </div>
    );
  }

  const { quote, profile, ratios, dcf, priceTarget, news, peers, history } = data;
  const positive = (quote?.change ?? 0) >= 0;
  const TrendIcon = positive ? TrendingUp : TrendingDown;

  return (
    <div className="space-y-8">
      {/* Header card */}
      <section className={`card card-roomy relative overflow-hidden ${positive ? 'shadow-bull' : 'shadow-bear'}`}>
        <div className={`absolute -top-24 -right-20 w-72 h-72 rounded-full blur-3xl ${positive ? 'bg-bull/20' : 'bg-bear/20'}`} />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {profile?.image && (
                <img src={profile.image} alt="" className="w-10 h-10 rounded-lg bg-white p-1 object-contain" />
              )}
              <div>
                <div className="font-display text-3xl leading-tight">{profile?.companyName ?? quote?.name ?? symbol}</div>
                <div className="text-xs text-ink-muted num tracking-wider mt-0.5">
                  {symbol} · {profile?.exchangeShortName ?? quote?.exchange ?? '—'}
                  {profile?.industry ? ` · ${profile.industry}` : ''}
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="num text-5xl font-medium tracking-tight">
              {quote?.price != null ? fmtPrice(quote.price) : '—'}
            </div>
            <div className={`mt-2 inline-flex items-center gap-2 num text-sm ${upDownClass(quote?.change)}`}>
              <TrendIcon className="w-4 h-4" strokeWidth={2.5} />
              <span>{quote?.change != null ? (quote.change > 0 ? '+' : '') + fmtPrice(quote.change) : '—'}</span>
              <span className="text-ink-muted">·</span>
              <span>{fmtPct(quote?.changesPercentage)}</span>
            </div>
          </div>
        </div>

        {/* Chart + range */}
        <div className="relative mt-8">
          <div className="flex justify-between items-center mb-4">
            <div className="kpi-label">Price History</div>
            <RangeSelector value={range} onChange={setRange} />
          </div>
          <PriceChart data={history} positive={positive} />
        </div>
      </section>

      {/* Key stats */}
      <section>
        <h2 className="kpi-label mb-3">Key Statistics</h2>
        <StatsGrid quote={quote} profile={profile} ratios={ratios} />
      </section>

      {/* Profile + Analyst/DCF */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="card card-roomy lg:col-span-2">
          <div className="kpi-label mb-3">About</div>
          <p className="text-sm leading-relaxed text-ink-secondary">
            {profile?.description ?? 'No company description available.'}
          </p>
          {profile && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-bg-border">
              <Meta label="Sector" value={profile.sector} />
              <Meta label="Country" value={profile.country} />
              <Meta label="CEO" value={profile.ceo} />
              <Meta label="Employees" value={profile.fullTimeEmployees ? profile.fullTimeEmployees.toLocaleString() : '—'} />
              <Meta label="IPO" value={fmtDate(profile.ipoDate)} />
              <Meta label="Currency" value={profile.currency} />
              <Meta label="Website" value={
                profile.website
                  ? <a href={profile.website} target="_blank" rel="noreferrer" className="text-bull hover:underline inline-flex items-center gap-1">
                      Link <ExternalLink className="w-3 h-3" />
                    </a>
                  : '—'
              } />
              <Meta label="Type" value={profile.isEtf ? 'ETF' : profile.isFund ? 'Mutual Fund' : 'Common Stock'} />
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Analyst target */}
          {priceTarget && quote?.price != null && (
            <div className="card card-roomy">
              <div className="kpi-label mb-3">Analyst Target</div>
              <div className="num text-3xl">
                {priceTarget.targetConsensus != null ? fmtPrice(priceTarget.targetConsensus) : '—'}
              </div>
              <div className="text-xs text-ink-muted mt-1">Consensus</div>
              {priceTarget.targetConsensus != null && (() => {
                const upside = ((priceTarget.targetConsensus - quote.price!) / quote.price!) * 100;
                const Icon = upside >= 0 ? ArrowUpRight : ArrowDownRight;
                return (
                  <div className={`mt-3 chip ${upside >= 0 ? 'chip-bull' : 'chip-bear'}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {fmtPct(upside)} upside
                  </div>
                );
              })()}
              <div className="mt-4 pt-4 border-t border-bg-border text-xs space-y-1.5">
                <Row label="High"   value={fmtPrice(priceTarget.targetHigh)} />
                <Row label="Median" value={fmtPrice(priceTarget.targetMedian)} />
                <Row label="Low"    value={fmtPrice(priceTarget.targetLow)} />
              </div>
            </div>
          )}

          {/* DCF */}
          {dcf && quote?.price != null && (
            <div className="card card-roomy">
              <div className="kpi-label mb-3">DCF Valuation</div>
              <div className="num text-3xl">{dcf.dcf != null ? fmtPrice(dcf.dcf) : '—'}</div>
              <div className="text-xs text-ink-muted mt-1">FMP model · {fmtDate(dcf.date)}</div>
              {dcf.dcf != null && (() => {
                const delta = ((dcf.dcf - quote.price!) / quote.price!) * 100;
                return (
                  <div className={`mt-3 chip ${delta >= 0 ? 'chip-bull' : 'chip-bear'}`}>
                    {fmtPct(delta)} vs price
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </section>

      {/* Ratios */}
      {ratios && (
        <section className="card card-roomy">
          <h2 className="kpi-label mb-6">Valuation & Financial Ratios (TTM)</h2>
          <RatiosTable ratios={ratios} />
        </section>
      )}

      {/* Peers */}
      {peers && peers.length > 0 && (
        <section>
          <h2 className="kpi-label mb-3">Peers</h2>
          <div className="flex flex-wrap gap-2">
            {peers.slice(0, 12).map((p) => (
              <Link key={p} to={`/ticker/${p}`}
                className="chip hover:border-bull/40 hover:text-bull transition cursor-pointer">
                {p}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* News */}
      {news && news.length > 0 && (
        <section>
          <h2 className="kpi-label mb-3">Latest News</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {news.slice(0, 6).map((n) => (
              <a key={n.url} href={n.url} target="_blank" rel="noreferrer"
                 className="card card-tight hover:border-bull/30 transition group">
                <div className="flex gap-3">
                  {n.image && <img src={n.image} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />}
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-ink-muted num">{n.site} · {fmtDate(n.publishedDate)}</div>
                    <div className="text-sm font-medium mt-1 line-clamp-2 group-hover:text-bull transition">{n.title}</div>
                    {n.text && <div className="text-xs text-ink-muted mt-1.5 line-clamp-2">{n.text}</div>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="kpi-label">{label}</div>
      <div className="mt-1 text-sm">{value ?? '—'}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className="num">{value}</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="card card-roomy animate-pulse h-64" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-xl overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-bg-surface h-20 animate-pulse" />
        ))}
      </div>
      <div className="card card-roomy animate-pulse h-48" />
    </div>
  );
}
