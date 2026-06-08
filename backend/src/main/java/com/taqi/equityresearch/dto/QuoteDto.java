package com.taqi.equityresearch.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record QuoteDto(
        String symbol,
        String name,
        String exchange,
        Double price,
        Double change,
        Double changesPercentage,
        Double dayHigh,
        Double dayLow,
        Double yearHigh,
        Double yearLow,
        Double marketCap,
        Long volume,
        Long avgVolume,
        Double previousClose,
        Double open,
        Double eps,
        Double pe
) {}
