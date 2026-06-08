package com.taqi.equityresearch.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quote {
    private String symbol;
    private Double price;
    private Double change;
    private Double changePercent;
    private Long timestamp;
}
