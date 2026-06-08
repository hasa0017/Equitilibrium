package com.taqi.equityresearch.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "watchlist_item",
        uniqueConstraints = @UniqueConstraint(columnNames = {"watchlist_id", "ticker"}))
public class WatchlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "watchlist_id", nullable = false)
    private Watchlist watchlist;

    @Column(nullable = false, length = 20)
    private String ticker;

    @Column(name = "added_at", nullable = false)
    private OffsetDateTime addedAt;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public WatchlistItem() {}

    public WatchlistItem(Watchlist watchlist, String ticker, String notes) {
        this.watchlist = watchlist;
        this.ticker = ticker.toUpperCase();
        this.notes = notes;
        this.addedAt = OffsetDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Watchlist getWatchlist() { return watchlist; }
    public void setWatchlist(Watchlist watchlist) { this.watchlist = watchlist; }
    public String getTicker() { return ticker; }
    public void setTicker(String ticker) { this.ticker = ticker; }
    public OffsetDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(OffsetDateTime addedAt) { this.addedAt = addedAt; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
