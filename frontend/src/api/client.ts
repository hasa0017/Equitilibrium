import axios from 'axios';
import { getUserId } from '@/lib/user';
import type { TickerSnapshot, Watchlist } from './types';

const client = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

client.interceptors.request.use((config) => {
  config.headers['X-User-Id'] = getUserId();
  return config;
});

export const api = {
  ticker: {
    full: async (symbol: string, range = '1Y'): Promise<TickerSnapshot> => {
      const { data } = await client.get<TickerSnapshot>(`/ticker/${symbol}/full`, { params: { range } });
      return data;
    },
  },
  watchlist: {
    list: async (): Promise<Watchlist[]> => {
      const { data } = await client.get<Watchlist[]>('/watchlist');
      return data;
    },
    create: async (name: string): Promise<Watchlist> => {
      const { data } = await client.post<Watchlist>('/watchlist', { name });
      return data;
    },
    addItem: async (id: number, ticker: string, notes?: string) => {
      const { data } = await client.post(`/watchlist/${id}/items`, { ticker, notes });
      return data;
    },
    removeItem: async (id: number, ticker: string) => {
      await client.delete(`/watchlist/${id}/items/${ticker}`);
    },
  },
};

export const queryKeys = {
  ticker: (symbol: string, range: string) => ['ticker', symbol, range] as const,
  watchlists: () => ['watchlists'] as const,
};
