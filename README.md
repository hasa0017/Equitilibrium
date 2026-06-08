# Equity Research

A ticker research dashboard. Search any stock, ETF, or mutual fund and get
a consolidated view of quote, fundamentals, valuation ratios, analyst targets,
DCF, peers, and news.

**Stack:** Spring Boot 3.3 (Java 21) · React 18 + TypeScript + Vite · Tailwind ·
Postgres · Flyway · Caffeine cache · Recharts · Financial Modeling Prep API.

```
Browser ──► Spring Boot (Railway) ──► FMP API
              │            │
              │            └──► Postgres
              │
              └── Serves React SPA from /static
              └── Exposes /api/* JSON endpoints
```

Single deployable: the React app is built during Maven's package phase and
embedded in the Spring jar. One Railway service, no CORS.

---

## Prerequisites

- Java 21 (`java -version`)
- Maven 3.9+ (`mvn -v`) — or generate the wrapper with `mvn -N wrapper:wrapper`
- Node 20+ (`node -v`) — only needed if running the frontend dev server directly
- A free FMP API key — [sign up](https://site.financialmodelingprep.com/developer/docs)

## Local development

Two ways:

### A. Run as one Spring Boot process (production-like)

```bash
cp .env.example .env
# Edit .env and set FMP_API_KEY=...

# Build the frontend into Spring's static resources, then run
mvn -pl backend -am clean package -DskipTests
java -jar backend/target/equity-research.jar
# → http://localhost:8080
```

### B. Hot-reload dev mode (recommended while iterating)

Terminal 1 — backend:
```bash
cd backend
FMP_API_KEY=your_key mvn spring-boot:run
# → http://localhost:8080
```

Terminal 2 — frontend (Vite proxies /api to :8080):
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

Profile `dev` uses an embedded H2 database (Postgres-compatible mode) so you
don't need to run Postgres locally.

---

## Deploying to Railway

1. Push this repo to GitHub.
2. In Railway: **New Project → Deploy from GitHub repo** → select this repo.
3. Add the Postgres plugin: **+ New → Database → Add Postgres**.
   Railway auto-injects `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`.
4. Set service environment variables:
   - `FMP_API_KEY` = your FMP key
   - `SPRING_PROFILES_ACTIVE` = `prod`
5. Deploy. Railway uses `railway.json` for build + start commands, and
   `/actuator/health` for health checks.

The build runs the frontend (`npm ci` + `npm run build`) via
`frontend-maven-plugin`, copies `frontend/dist/` into Spring's
`src/main/resources/static/`, then packages the jar.

**Memory tip:** the Hobby plan is tight on RAM. If builds OOM, set
`MAVEN_OPTS=-Xmx512m` in Railway. Runtime is constrained via `-Xmx400m` in
`railway.json`.

---

## API surface

All endpoints return JSON.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/ticker/{symbol}/full?range=1Y` | Aggregated snapshot — quote, profile, ratios, DCF, target, news, peers, history. `range` ∈ {1M,3M,6M,YTD,1Y,5Y,MAX} |
| `GET` | `/api/watchlist` | List watchlists for current user (`X-User-Id` header) |
| `POST` | `/api/watchlist` | Create — `{"name":"My List"}` |
| `POST` | `/api/watchlist/{id}/items` | Add — `{"ticker":"AAPL","notes":"optional"}` |
| `DELETE` | `/api/watchlist/{id}/items/{ticker}` | Remove |
| `GET` | `/actuator/health` | Health check |

User identity is currently a client-generated UUID stored in `localStorage`
and sent via `X-User-Id` header. Swap in real auth (Spring Security + JWT or
session cookies) when ready — schema is already designed for it.

## FMP free tier notes

- **250 requests/day**. Caffeine cache (see `CacheConfig.java`) shields the
  quota — quote TTL is 60s, fundamentals 24h, news 15m.
- FMP has been restructuring its endpoints. If a call returns empty:
  - `priceTargetConsensus`, `analystEstimates`, and `dcf` have moved between
    free and paid tiers across releases — check
    [FMP docs](https://site.financialmodelingprep.com/developer/docs) for the
    current free-tier coverage and adjust `FmpClient.java` paths as needed.
  - The service maps missing data to `null` and the UI degrades gracefully.

## Project structure

```
equity-research/
├── pom.xml                    # parent Maven pom
├── railway.json               # Railway build + deploy
├── backend/
│   ├── pom.xml                # backend pom with frontend-maven-plugin
│   └── src/main/
│       ├── java/com/taqi/equityresearch/
│       │   ├── EquityResearchApplication.java
│       │   ├── config/        # WebClient, Cache, SPA forwarding
│       │   ├── controller/    # TickerController, WatchlistController
│       │   ├── service/       # FmpClient, TickerService, WatchlistService
│       │   ├── repository/    # JPA repos
│       │   ├── entity/        # Watchlist, WatchlistItem, AppUser
│       │   ├── dto/           # Quote, Profile, Ratios, TickerSnapshot
│       │   └── exception/
│       └── resources/
│           ├── application.yml
│           └── db/migration/  # Flyway V1__init.sql
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    └── src/
        ├── main.tsx, App.tsx
        ├── pages/             # Home, Ticker
        ├── components/        # PriceChart, StatsGrid, RatiosTable, RangeSelector
        ├── api/               # axios client + query keys + TS types
        ├── lib/               # formatters, user ID
        └── styles/            # globals.css with Tailwind layers
```

## Roadmap

- **Phase 1** ✅ MVP — search → ticker page with quote, chart, stats, ratios, DCF, target, peers, news
- **Phase 2** — watchlist UI (backend already wired), search history, recently viewed
- **Phase 3** — compare two tickers side-by-side, CSV export, basic technicals (RSI, MACD)
- **Phase 4** — real auth (Spring Security), email alerts, refresh tokens, rate-limit headers
