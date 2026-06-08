import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Search, Activity } from 'lucide-react';
import { useState } from 'react';
import Home from './pages/Home';
import Ticker from './pages/Ticker';

function Header() {
  const nav = useNavigate();
  const [query, setQuery] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = query.trim().toUpperCase();
    if (t) {
      nav(`/ticker/${t}`);
      setQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-bg-border bg-bg-base/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bull to-bull-soft flex items-center justify-center shadow-bull">
            <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Equity Research</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">Terminal</div>
          </div>
        </Link>

        <form onSubmit={submit} className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ticker — AAPL, SPY, VFIAX…"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-bg-surface border border-bg-border
                       text-sm placeholder:text-ink-muted focus:outline-none focus:border-bull/60
                       focus:ring-2 focus:ring-bull/15 transition"
            autoComplete="off"
            spellCheck={false}
          />
        </form>

        <nav className="hidden md:flex items-center gap-5 text-sm text-ink-secondary">
          <Link to="/" className="hover:text-ink-primary transition">Home</Link>
          <Link to="/watchlist" className="hover:text-ink-primary transition">Watchlists</Link>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ticker/:symbol" element={<Ticker />} />
          <Route path="/watchlist" element={<WatchlistPlaceholder />} />
          <Route path="*" element={<div className="text-ink-muted">Not found.</div>} />
        </Routes>
      </main>
      <footer className="max-w-7xl mx-auto px-6 py-8 text-xs text-ink-muted border-t border-bg-border mt-12">
        Data via Financial Modeling Prep · For research purposes only — not investment advice.
      </footer>
    </div>
  );
}

function WatchlistPlaceholder() {
  return (
    <div className="card card-roomy">
      <h2 className="font-display text-3xl mb-2">Watchlists</h2>
      <p className="text-ink-secondary text-sm">Coming in Phase 3. The persistence layer is already wired — UI next.</p>
    </div>
  );
}
