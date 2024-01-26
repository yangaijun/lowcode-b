package com.yaj.common.cache;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.yaj.common.cache.CacheConfig.CacheTypeEnum;

import javax.annotation.PostConstruct;

/**
* @Description: 缓存管理
*/
//@Component  
public class CacheManager {
	
	private static CacheManager cacheManager;
	
	@Autowired
	private org.springframework.cache.CacheManager caffeineCacheManager;
	
	@PostConstruct  
    public void  init() {  
		cacheManager = this;
		cacheManager.caffeineCacheManager = this.caffeineCacheManager;
    }  
	
	public static Object get(CacheTypeEnum cacheTypeEnum, Object key) {
		return cacheManager.caffeineCacheManager.getCache(cacheTypeEnum.name()).get(key);
	}

	public static <T> T get(CacheTypeEnum cacheTypeEnum, Object key, Class<T> clazz) {
		return  (T) cacheManager.caffeineCacheManager.getCache(cacheTypeEnum.name()).get(key, clazz);
	}

	public static void put(CacheTypeEnum cacheTypeEnum,Object key,Object value) {
		cacheManager.caffeineCacheManager.getCache(cacheTypeEnum.name()).put(key, value);
	}

	public static void del(CacheTypeEnum cacheTypeEnum,Object key) {
		cacheManager.caffeineCacheManager.getCache(cacheTypeEnum.name()).evict(key);
	}

	public static void clear(CacheTypeEnum cacheTypeEnum) {
		cacheManager.caffeineCacheManager.getCache(cacheTypeEnum.name()).clear();
	}

	public static boolean exist(CacheTypeEnum cacheTypeEnum,Object key) {
		if(cacheManager.caffeineCacheManager.getCache(cacheTypeEnum.name()).get(key) != null) {
			return true;
		} else {
			return false;
		}
	} 
}
