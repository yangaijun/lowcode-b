package com.yaj.common.cache;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import java.util.ArrayList;
import java.util.concurrent.TimeUnit;


/**
* @Description: Caffeine缓存配置类
*/
//@Configuration
//@EnableCaching
public class CacheConfig {
    public static final int DEFAULT_MAXSIZE = 50000;
    public static final int DEFAULT_TTL = 10;
    /**
     * 定义cache名称、超时时长（秒）、最大容量
     * 每个cache缺省：10秒超时、最多缓存50000条数据，需要修改可以在构造方法的参数中指定。
    */
    public enum CacheTypeEnum { 
        sixtyCache(60), //有效期60秒
        defaultCache,//缺省10秒
        fiveMinuteCache(60 * 5, 1000), //5分钟，最大容量1000
        halfHourCache(60 * 30, 5000),//半小时，最大容量1000
        hourCache(60 * 60, 5000),//1小时，最大容量1000 
        twoHourCacheCache(60 * 60*2);//2小时

    	CacheTypeEnum() { }

    	CacheTypeEnum(int ttl) {
            this.ttl = ttl;
        }

    	CacheTypeEnum(int ttl, int maxSize) {
            this.ttl = ttl;
            this.maxSize = maxSize;
        }

        private int maxSize = DEFAULT_MAXSIZE;    //最大数量
        private int ttl = DEFAULT_TTL;        //过期时间（秒）

        public int getMaxSize() {
            return maxSize;
        }

        public int getTtl() {
            return ttl;
        }
    }

    /**
	 * 创建基于Caffeine的Cache Manager
	 */
	@Bean
	@Primary
	public CacheManager caffeineCacheManager() {
		SimpleCacheManager cacheManager = new SimpleCacheManager();
		ArrayList<CaffeineCache> caches = new ArrayList<CaffeineCache>();
		for (CacheTypeEnum cache : CacheTypeEnum.values()) {
			if(cache.getTtl() > 0){
				caches.add(new CaffeineCache(cache.name(), 
						Caffeine.newBuilder()
						.recordStats()
						.expireAfterWrite(cache.getTtl(), TimeUnit.SECONDS)
						.maximumSize(cache.getMaxSize())
						.build()));
			} else if(cache.getTtl() == 0) {
				caches.add(new CaffeineCache(cache.name(), 
						Caffeine.newBuilder()
						.recordStats()
						.maximumSize(cache.getMaxSize())
						.build()));
			} 
		}
		cacheManager.setCaches(caches);
		return cacheManager;
	}
}