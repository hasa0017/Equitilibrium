import { Link } from 'react-router-dom';
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

const FEATURED = [
  { t: 'AAPL', name: 'Apple Inc.' },
  { t: 'MSFT', name: 'Microsoft' },
  { t: 'NVDA', name: 'NVIDIA' },
  { t: 'GOOGL', name: 'Alphabet' },
  { t: 'META', name: 'Meta Platforms' },
  { t: 'TSLA', name: 'Tesla' },
  { t: 'JPM',  name: 'JPMorgan Chase' },
  { t: 'BRK-B', name: 'Berkshire Hathaway' },
  { t: 'SPY',  name: 'SPDR S&P 500 ETF' },
  { t: 'QQQ',  name: 'Invesco QQQ' },
  { t: 'VFIAX', name: 'Vanguard 500 Index' },
  { t: 'FXAIX', name: 'Fidelity 500 Index' },
];

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden card card-roomy py-16 px-10">
        <div className="absolute inset-0 grid-overlay opacity-40" />
        <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-bull/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-bear/15 blur-3xl" />

        <div className="relative">
          <div className="kpi-label mb-4">Ticker Intelligence</div>
          <h1 className="font-display text-display text-ink-primary max-w-2xl">
            Research <span className="italic text-bull">stocks</span>,{' '}
            <span className="italic text-ink-secondary">ETFs</span>, and{' '}
            <span className="italic text-bear">mutual funds</span> — at a glance.
          </h1>
          <p className="mt-5 text-ink-secondary max-w-xl">
            Quote, fundamentals, valuation ratios, analyst targets, DCF, peers, and news —
            consolidated into a single, audit-friendly view.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {FEATURED.map((f) => (
              <Link
                key={f.t}
                to={`/ticker/${f.t}`}
                className="group flex items-center gap-2 px-3 py-2 rounded-lg border border-bg-border
                           bg-bg-raised hover:bg-bg-border hover:border-bull/40 transition"
              >
                <span className="num text-sm font-medium">{f.t}</span>
                <span className="text-xs text-ink-muted">{f.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-bull transition" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="grid md:grid-cols-3 gap-4">
        <FeatureCard
          icon={<TrendingUp className="text-bull" />}
          title="Live quote + chart"
          body="Real-time price, day range, 52-week range, multi-timeframe history with a precision-rendered chart."
        />
        <FeatureCard
          icon={<TrendingDown className="text-bear" />}
          title="Fundamentals & ratios"
          body="P/E, P/B, P/S, PEG, EV/EBITDA, ROE, ROA, margins, leverage, liquidity — all TTM, side by side."
        />
        <FeatureCard
          icon={<ArrowUpRight className="text-accent-gold" />}
          title="Analyst & DCF"
          body="Consensus price targets, upside, and FMP's DCF valuation — with delta vs current price."
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card card-roomy">
      <div className="w-10 h-10 rounded-lg bg-bg-raised border border-bg-border flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-ink-secondary leading-relaxed">{body}</p>
    </div>
  );
}
