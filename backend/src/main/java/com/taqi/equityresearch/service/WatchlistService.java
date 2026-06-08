package com.taqi.equityresearch.service;

import com.taqi.equityresearch.entity.AppUser;
import com.taqi.equityresearch.entity.Watchlist;
import com.taqi.equityresearch.entity.WatchlistItem;
import com.taqi.equityresearch.repository.AppUserRepository;
import com.taqi.equityresearch.repository.WatchlistItemRepository;
import com.taqi.equityresearch.repository.WatchlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class WatchlistService {

    private final WatchlistRepository watchlists;
    private final WatchlistItemRepository items;
    private final AppUserRepository users;

    public WatchlistService(WatchlistRepository watchlists,
                            WatchlistItemRepository items,
                            AppUserRepository users) {
        this.watchlists = watchlists;
        this.items = items;
        this.users = users;
    }

    public List<Watchlist> listForUser(UUID userId) {
        ensureUser(userId);
        return watchlists.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Watchlist create(UUID userId, String name) {
        ensureUser(userId);
        return watchlists.save(new Watchlist(userId, name));
    }

    public WatchlistItem addItem(UUID userId, Long watchlistId, String ticker, String notes) {
        Watchlist wl = watchlists.findById(watchlistId)
                .orElseThrow(() -> new IllegalArgumentException("Watchlist not found: " + watchlistId));
        if (!wl.getUserId().equals(userId)) {
            throw new SecurityException("Watchlist does not belong to this user");
        }
        WatchlistItem item = new WatchlistItem(wl, ticker, notes);
        return items.save(item);
    }

    public void removeItem(UUID userId, Long watchlistId, String ticker) {
        Watchlist wl = watchlists.findById(watchlistId)
                .orElseThrow(() -> new IllegalArgumentException("Watchlist not found: " + watchlistId));
        if (!wl.getUserId().equals(userId)) {
            throw new SecurityException("Watchlist does not belong to this user");
        }
        items.deleteByWatchlistIdAndTicker(watchlistId, ticker.toUpperCase());
    }

    private void ensureUser(UUID userId) {
        if (!users.existsById(userId)) {
            users.save(new AppUser(userId, OffsetDateTime.now(), null));
        }
    }
}
