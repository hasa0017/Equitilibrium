package com.taqi.equityresearch.controller;

import com.taqi.equityresearch.entity.Watchlist;
import com.taqi.equityresearch.entity.WatchlistItem;
import com.taqi.equityresearch.service.WatchlistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private static final String USER_HEADER = "X-User-Id";

    private final WatchlistService service;

    public WatchlistController(WatchlistService service) {
        this.service = service;
    }

    @GetMapping
    public List<WatchlistResponse> list(@RequestHeader(USER_HEADER) UUID userId) {
        return service.listForUser(userId).stream()
                .map(WatchlistResponse::from)
                .toList();
    }

    @PostMapping
    public WatchlistResponse create(@RequestHeader(USER_HEADER) UUID userId,
                                    @RequestBody Map<String, String> body) {
        String name = body.getOrDefault("name", "Untitled");
        return WatchlistResponse.from(service.create(userId, name));
    }

    @PostMapping("/{id}/items")
    public ItemResponse addItem(@RequestHeader(USER_HEADER) UUID userId,
                                @PathVariable Long id,
                                @RequestBody Map<String, String> body) {
        return ItemResponse.from(service.addItem(userId, id, body.get("ticker"), body.get("notes")));
    }

    @DeleteMapping("/{id}/items/{ticker}")
    public void removeItem(@RequestHeader(USER_HEADER) UUID userId,
                           @PathVariable Long id,
                           @PathVariable String ticker) {
        service.removeItem(userId, id, ticker);
    }

    /* ----- response shapes (keep entities out of the wire) ----- */

    public record WatchlistResponse(Long id, String name, String createdAt, List<ItemResponse> items) {
        static WatchlistResponse from(Watchlist w) {
            return new WatchlistResponse(
                    w.getId(), w.getName(), w.getCreatedAt().toString(),
                    w.getItems().stream().map(ItemResponse::from).toList());
        }
    }

    public record ItemResponse(Long id, String ticker, String addedAt, String notes) {
        static ItemResponse from(WatchlistItem i) {
            return new ItemResponse(i.getId(), i.getTicker(), i.getAddedAt().toString(), i.getNotes());
        }
    }
}
