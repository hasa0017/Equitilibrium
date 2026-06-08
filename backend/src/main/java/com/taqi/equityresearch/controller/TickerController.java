package com.taqi.equityresearch.controller;

import com.taqi.equityresearch.dto.TickerSnapshot;
import com.taqi.equityresearch.service.TickerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ticker")
public class TickerController {

    private final TickerService service;

    public TickerController(TickerService service) {
        this.service = service;
    }

    @GetMapping("/{symbol}/full")
    public TickerSnapshot full(@PathVariable String symbol,
                               @RequestParam(defaultValue = "1Y") String range) {
        return service.snapshot(symbol, range);
    }
}
