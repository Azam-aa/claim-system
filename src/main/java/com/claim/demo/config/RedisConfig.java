package com.claim.demo.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    @org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "app.redis.enabled", havingValue = "true", matchIfMissing = true)
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory();
    }

    @Bean
    @org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "app.redis.enabled", havingValue = "true", matchIfMissing = true)
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        return RedisCacheManager.builder(factory).build();
    }

    @Bean
    @org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "app.redis.enabled", havingValue = "false")
    public CacheManager inMemoryCacheManager() {
        return new ConcurrentMapCacheManager("claimStatus");
    }
}
