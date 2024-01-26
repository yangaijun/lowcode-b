package com.yaj.common.cache;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisManager {
	@Autowired
    private StringRedisTemplate redisTemplate;

	public void set(String key, Object value, long seconds) {
		redisTemplate.opsForValue().set(key, value.toString(), seconds, TimeUnit.SECONDS);
	}
	
	public void set(String key, Object value) {
		redisTemplate.opsForValue().set(key, value.toString());
	}
	
	public String get(String key) {
		return redisTemplate.opsForValue().get(key);
	}
}
