package com.taqi.equityresearch.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taqi.equityresearch.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class TickerService {

    private static final Logger log = LoggerFactory.getLogger(TickerService.class);

    private final FmpClient fmp;
    private final ObjectMapper mapper;

    public TickerService(FmpClient fmp, ObjectMapper mapper) {
        this.fmp = fmp;
        this.mapper = mapper;
    }

    public TickerSnapshot snapshot(String symbol, String range) {
        String s = symbol.toUpperCase();

        // Fan out FMP calls in parallel. Each is independently cached.
        CompletableFuture<JsonNode> qF  = CompletableFuture.supplyAsync(() -> fmp.quote(s));
        CompletableFuture<JsonNode> pF  = CompletableFuture.supplyAsync(() -> fmp.profile(s));
        CompletableFuture<JsonNode> rF  = CompletableFuture.supplyAsync(() -> fmp.ratiosTtm(s));
        CompletableFuture<JsonNode> dF  = CompletableFuture.supplyAsync(() -> fmp.dcf(s));
        CompletableFuture<JsonNode> ptF = CompletableFuture.supplyAsync(() -> fmp.priceTargetConsensus(s));
        CompletableFuture<JsonNode> nF  = CompletableFuture.supplyAsync(() -> fmp.news(s));
        CompletableFuture<JsonNode> peF = CompletableFuture.supplyAsync(() -> fmp.peers(s));
        CompletableFuture<JsonNode> hF  = CompletableFuture.supplyAsync(() -> fmp.historicalPrice(s, range));

        CompletableFuture.allOf(qF, pF, rF, dF, ptF, nF, peF, hF).join();

        return new TickerSnapshot(
                s,
                mapQuote(firstOf(qF.join())),
                mapProfile(firstOf(pF.join())),
                mapRatios(firstOf(rF.join())),
                mapDcf(firstOf(dF.join())),
                mapPriceTarget(firstOf(ptF.join())),
                mapNews(nF.join()),
                mapPeers(peF.join()),
                mapHistory(hF.join(), range)
        );
    }

    /* ----- mappers ----- */

    private QuoteDto mapQuote(JsonNode n) {
        if (n == null || n.isMissingNode()) return null;
        return new QuoteDto(
                text(n, "symbol"), text(n, "name"), text(n, "exchange"),
                dbl(n, "price"), dbl(n, "change"), dbl(n, "changesPercentage"),
                dbl(n, "dayHigh"), dbl(n, "dayLow"),
                dbl(n, "yearHigh"), dbl(n, "yearLow"),
                dbl(n, "marketCap"),
                lng(n, "volume"), lng(n, "avgVolume"),
                dbl(n, "previousClose"), dbl(n, "open"),
                dbl(n, "eps"), dbl(n, "pe")
        );
    }

    private ProfileDto mapProfile(JsonNode n) {
        if (n == null || n.isMissingNode()) return null;
        return new ProfileDto(
                text(n, "symbol"), text(n, "companyName"),
                text(n, "exchange"), text(n, "exchangeShortName"),
                text(n, "industry"), text(n, "sector"),
                text(n, "country"), text(n, "ceo"),
                text(n, "description"), text(n, "website"), text(n, "image"),
                text(n, "ipoDate"),
                lng(n, "fullTimeEmployees"),
                dbl(n, "beta"), dbl(n, "lastDiv"),
                text(n, "currency"),
                bool(n, "isEtf"), bool(n, "isFund")
        );
    }

    private RatiosDto mapRatios(JsonNode n) {
        if (n == null || n.isMissingNode()) return null;
        return new RatiosDto(
                dbl(n, "peRatioTTM"), dbl(n, "priceToSalesRatioTTM"),
                dbl(n, "priceToBookRatioTTM"), dbl(n, "pegRatioTTM"),
                dbl(n, "dividendYielTTM"),       // FMP typo on this field, kept as-is
                dbl(n, "payoutRatioTTM"),
                dbl(n, "enterpriseValueMultipleTTM"),
                dbl(n, "returnOnEquityTTM"), dbl(n, "returnOnAssetsTTM"),
                dbl(n, "grossProfitMarginTTM"), dbl(n, "operatingProfitMarginTTM"),
                dbl(n, "netProfitMarginTTM"),
                dbl(n, "debtEquityRatioTTM"),
                dbl(n, "currentRatioTTM"), dbl(n, "quickRatioTTM"),
                dbl(n, "interestCoverageTTM")
        );
    }

    private TickerSnapshot.DcfDto mapDcf(JsonNode n) {
        if (n == null || n.isMissingNode()) return null;
        return new TickerSnapshot.DcfDto(text(n, "date"), dbl(n, "dcf"), dbl(n, "Stock Price"));
    }

    private TickerSnapshot.PriceTargetDto mapPriceTarget(JsonNode n) {
        if (n == null || n.isMissingNode()) return null;
        return new TickerSnapshot.PriceTargetDto(
                text(n, "symbol"),
                dbl(n, "targetHigh"), dbl(n, "targetLow"),
                dbl(n, "targetConsensus"), dbl(n, "targetMedian"));
    }

    private List<TickerSnapshot.NewsItem> mapNews(JsonNode arr) {
        if (arr == null || !arr.isArray()) return Collections.emptyList();
        List<TickerSnapshot.NewsItem> out = new ArrayList<>();
        arr.forEach(n -> out.add(new TickerSnapshot.NewsItem(
                text(n, "publishedDate"), text(n, "title"), text(n, "site"),
                text(n, "url"), text(n, "image"), text(n, "text"))));
        return out;
    }

    private List<String> mapPeers(JsonNode arr) {
        if (arr == null || !arr.isArray() || arr.isEmpty()) return Collections.emptyList();
        JsonNode first = arr.get(0);
        JsonNode peers = first == null ? null : first.path("peersList");
        if (peers == null || !peers.isArray()) return Collections.emptyList();
        List<String> out = new ArrayList<>();
        peers.forEach(p -> out.add(p.asText()));
        return out;
    }

    private List<TickerSnapshot.PricePoint> mapHistory(JsonNode n, String range) {
        if (n == null || n.isMissingNode()) return Collections.emptyList();
        JsonNode hist = n.path("historical");
        if (!hist.isArray()) return Collections.emptyList();

        int limit = switch (range == null ? "1Y" : range.toUpperCase()) {
            case "1D", "5D" -> 5;
            case "1M" -> 22;
            case "3M" -> 66;
            case "6M" -> 132;
            case "YTD" -> 200;
            case "5Y" -> 1260;
            case "MAX" -> Integer.MAX_VALUE;
            default -> 252; // 1Y
        };

        List<TickerSnapshot.PricePoint> out = new ArrayList<>();
        int count = 0;
        for (JsonNode p : hist) {
            if (count++ >= limit) break;
            out.add(new TickerSnapshot.PricePoint(text(p, "date"), dbl(p, "close")));
        }
        Collections.reverse(out); // FMP returns newest first
        return out;
    }

    /* ----- helpers ----- */

    private JsonNode firstOf(JsonNode n) {
        if (n == null) return null;
        if (n.isArray() && !n.isEmpty()) return n.get(0);
        return n;
    }

    private String text(JsonNode n, String f) {
        JsonNode v = n.path(f);
        return v.isMissingNode() || v.isNull() ? null : v.asText();
    }

    private Double dbl(JsonNode n, String f) {
        JsonNode v = n.path(f);
        return v.isMissingNode() || v.isNull() || !v.isNumber() ? null : v.asDouble();
    }

    private Long lng(JsonNode n, String f) {
        JsonNode v = n.path(f);
        return v.isMissingNode() || v.isNull() || !v.isNumber() ? null : v.asLong();
    }

    private Boolean bool(JsonNode n, String f) {
        JsonNode v = n.path(f);
        return v.isMissingNode() || v.isNull() ? null : v.asBoolean();
    }
}
