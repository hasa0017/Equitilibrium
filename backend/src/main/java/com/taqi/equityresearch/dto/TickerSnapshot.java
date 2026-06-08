package com.taqi.equityresearch.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record TickerSnapshot(
        String symbol,
        QuoteDto quote,
        ProfileDto profile,
        RatiosDto ratios,
        DcfDto dcf,
        PriceTargetDto priceTarget,
        List<NewsItem> news,
        List<String> peers,
        List<PricePoint> history
) {
    public record DcfDto(String date, Double dcf, Double stockPrice) {}
    public record PriceTargetDto(String symbol, Double targetHigh, Double targetLow,
                                 Double targetConsensus, Double targetMedian) {}
    public record NewsItem(String publishedDate, String title, String site,
                           String url, String image, String text) {}
    public record PricePoint(String date, Double close) {}
}
