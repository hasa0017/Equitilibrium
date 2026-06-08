package com.taqi.equityresearch.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProfileDto(
        String symbol,
        String companyName,
        String exchange,
        String exchangeShortName,
        String industry,
        String sector,
        String country,
        String ceo,
        String description,
        String website,
        String image,
        String ipoDate,
        Long fullTimeEmployees,
        Double beta,
        Double lastDiv,
        String currency,
        Boolean isEtf,
        Boolean isFund
) {}
