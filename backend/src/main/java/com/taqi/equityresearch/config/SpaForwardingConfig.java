package com.taqi.equityresearch.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Forward all non-API, non-asset paths to the SPA's index.html so React Router
 * can take over client-side. /api/** and /actuator/** are handled by controllers
 * before this runs, and static assets resolve from /static/ directly.
 */
@Configuration
public class SpaForwardingConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/")
                .setViewName("forward:/index.html");
        registry.addViewController("/ticker/{symbol:[A-Za-z0-9.-]+}")
                .setViewName("forward:/index.html");
        registry.addViewController("/watchlist")
                .setViewName("forward:/index.html");
        registry.addViewController("/watchlist/{id:[0-9]+}")
                .setViewName("forward:/index.html");
    }
}
