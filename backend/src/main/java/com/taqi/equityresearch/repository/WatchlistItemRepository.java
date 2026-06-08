package com.taqi.equityresearch.repository;

import com.taqi.equityresearch.entity.WatchlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WatchlistItemRepository extends JpaRepository<WatchlistItem, Long> {
    void deleteByWatchlistIdAndTicker(Long watchlistId, String ticker);
}
