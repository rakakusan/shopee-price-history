package com.rakakusan.shopee_price_history.config;

import com.github.benmanes.caffeine.cache.Caffeine;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        Caffeine<Object, Object> productsBuilder = Caffeine.newBuilder()
            .expireAfterWrite(1, TimeUnit.HOURS)
            .maximumSize(1000);

        Caffeine<Object, Object> priceHistoryBuilder = Caffeine.newBuilder()
            .expireAfterWrite(1, TimeUnit.HOURS)
            .maximumSize(5000);

        Caffeine<Object, Object> suggestionsBuilder = Caffeine.newBuilder()
            .expireAfterWrite(1, TimeUnit.HOURS)
            .maximumSize(1000);

        List<Cache> caches = List.of(
            new CaffeineCache("products", productsBuilder.build()),
            new CaffeineCache("price_history", priceHistoryBuilder.build()),
            new CaffeineCache("suggestions", suggestionsBuilder.build())
        );

        SimpleCacheManager manager = new SimpleCacheManager();
        manager.setCaches(caches);
        return manager;
    }
}