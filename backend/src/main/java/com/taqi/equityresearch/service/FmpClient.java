package com.taqi.equityresearch.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;

/**
 * Thin wrapper over FMP. Each method is @Cacheable so a hot ticker doesn't
 * burn the daily quota. Returns JsonNode so we can shape DTOs in the service
 * layer without coupling to FMP's response shapes everywhere.
 */
@Component
public class FmpClient {

    private static final Logger log = LoggerFactory.getLogger(FmpClient.class);

    private final WebClient client;
    private final String apiKey;

    public FmpClient(@Qualifier("fmpWebClient") WebClient client,
                     @Value("${fmp.api-key}") String apiKey) {
        this.client = client;
        this.apiKey = apiKey;
    }

    @Cacheable(value = "quote", key = "#symbol")
    public JsonNode quote(String symbol) {
        return get("/quote/" + symbol, Map.of());
    }

    @Cacheable(value = "profile", key = "#symbol")
    public JsonNode profile(String symbol) {
        return get("/profile/" + symbol, Map.of());
    }

    @Cacheable(value = "metrics", key = "#symbol")
    public JsonNode keyMetricsTtm(String symbol) {
        return get("/key-metrics-ttm/" + symbol, Map.of());
    }

    @Cacheable(value = "ratios", key = "#symbol")
    public JsonNode ratiosTtm(String symbol) {
        return get("/ratios-ttm/" + symbol, Map.of());
    }

    @Cacheable(value = "dcf", key = "#symbol")
    public JsonNode dcf(String symbol) {
        return get("/discounted-cash-flow/" + symbol, Map.of());
    }

    @Cacheable(value = "priceTarget", key = "#symbol")
    public JsonNode priceTargetConsensus(String symbol) {
        return get("/price-target-consensus", Map.of("symbol", symbol));
    }

    @Cacheable(value = "estimates", key = "#symbol")
    public JsonNode analystEstimates(String symbol) {
        return get("/analyst-estimates/" + symbol, Map.of("limit", "4"));
    }

    @Cacheable(value = "news", key = "#symbol")
    public JsonNode news(String symbol) {
        return get("/stock_news", Map.of("tickers", symbol, "limit", "8"));
    }

    @Cacheable(value = "peers", key = "#symbol")
    public JsonNode peers(String symbol) {
        return get("/stock_peers", Map.of("symbol", symbol));
    }

    @Cacheable(value = "history", key = "#symbol + ':' + #range")
    public JsonNode historicalPrice(String symbol, String range) {
        // FMP returns ~5 years on this endpoint; we slice by range in the service layer.
        return get("/historical-price-full/" + symbol, Map.of("serietype", "line"));
    }

    /* ----- internal ----- */

    private JsonNode get(String path, Map<String, String> queryParams) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromPath(path);
        queryParams.forEach(builder::queryParam);
        builder.queryParam("apikey", apiKey);
        String uri = builder.build().toUriString();

        return client.get()
                .uri(uri)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .timeout(Duration.ofSeconds(15))
                .onErrorResume(e -> {
                    log.warn("FMP call failed for {}: {}", path, e.getMessage());
                    return Mono.empty();
                })
                .block();
    }
}
