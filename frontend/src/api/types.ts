export interface Quote {
  symbol: string;
  name: string;
  exchange: string;
  price: number | null;
  change: number | null;
  changesPercentage: number | null;
  dayHigh: number | null;
  dayLow: number | null;
  yearHigh: number | null;
  yearLow: number | null;
  marketCap: number | null;
  volume: number | null;
  avgVolume: number | null;
  previousClose: number | null;
  open: number | null;
  eps: number | null;
  pe: number | null;
}

export interface Profile {
  symbol: string;
  companyName: string;
  exchange: string;
  exchangeShortName: string;
  industry: string;
  sector: string;
  country: string;
  ceo: string;
  description: string;
  website: string;
  image: string;
  ipoDate: string;
  fullTimeEmployees: number;
  beta: number;
  lastDiv: number;
  currency: string;
  isEtf: boolean;
  isFund: boolean;
}

export interface Ratios {
  peRatioTTM: number | null;
  priceToSalesRatioTTM: number | null;
  pbRatioTTM: number | null;
  pegRatioTTM: number | null;
  dividendYieldTTM: number | null;
  payoutRatioTTM: number | null;
  enterpriseValueOverEBITDATTM: number | null;
  returnOnEquityTTM: number | null;
  returnOnAssetsTTM: number | null;
  grossProfitMarginTTM: number | null;
  operatingProfitMarginTTM: number | null;
  netProfitMarginTTM: number | null;
  debtEquityRatioTTM: number | null;
  currentRatioTTM: number | null;
  quickRatioTTM: number | null;
  interestCoverageTTM: number | null;
}

export interface PricePoint { date: string; close: number; }
export interface NewsItem {
  publishedDate: string; title: string; site: string;
  url: string; image: string; text: string;
}

export interface TickerSnapshot {
  symbol: string;
  quote: Quote | null;
  profile: Profile | null;
  ratios: Ratios | null;
  dcf: { date: string; dcf: number; stockPrice: number } | null;
  priceTarget: { symbol: string; targetHigh: number; targetLow: number; targetConsensus: number; targetMedian: number } | null;
  news: NewsItem[];
  peers: string[];
  history: PricePoint[];
}

export interface Watchlist {
  id: number;
  name: string;
  createdAt: string;
  items: WatchlistItem[];
}

export interface WatchlistItem {
  id: number;
  ticker: string;
  addedAt: string;
  notes: string | null;
}
