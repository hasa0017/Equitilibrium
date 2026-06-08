package com.taqi.equityresearch.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record RatiosDto(
        // Valuation
        Double peRatioTTM,
        Double priceToSalesRatioTTM,
        Double pbRatioTTM,
        Double pegRatioTTM,
        Double dividendYieldTTM,
        Double payoutRatioTTM,
        Double enterpriseValueOverEBITDATTM,
        // Profitability
        Double returnOnEquityTTM,
        Double returnOnAssetsTTM,
        Double grossProfitMarginTTM,
        Double operatingProfitMarginTTM,
        Double netProfitMarginTTM,
        // Leverage / liquidity
        Double debtEquityRatioTTM,
        Double currentRatioTTM,
        Double quickRatioTTM,
        Double interestCoverageTTM
) {}
