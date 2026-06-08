package com.taqi.equityresearch.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.List;

/**
 * Per-cache TTLs sized for FMP's 250 req/day free tier.
 * Quote refreshes often; fundamentals once a day is plenty.
 */
@Configuration
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager mgr = new SimpleCacheManager();
        mgr.setCaches(List.of(
                buildCache("quote",       Duration.ofSeconds(60),  500),
                buildCache("profile",     Duration.ofHours(24),    500),
                buildCache("metrics",     Duration.ofHours(24),    500),
                buildCache("ratios",      Duration.ofHours(24),    500),
                buildCache("dcf",         Duration.ofHours(24),    500),
                buildCache("priceTarget", Duration.ofHours(6),     500),
                buildCache("estimates",   Duration.ofHours(6),     500),
                buildCache("news",        Duration.ofMinutes(15),  500),
                buildCache("peers",       Duration.ofHours(24),    500),
                buildCache("history",     Duration.ofHours(1),     500)
        ));
        return mgr;
    }

    private CaffeineCache buildCache(String name, Duration ttl, long maxSize) {
        return new CaffeineCache(name,
                Caffeine.newBuilder()
                        .expireAfterWrite(ttl)
                        .maximumSize(maxSize)
                        .recordStats()
                        .build());
    }
}
