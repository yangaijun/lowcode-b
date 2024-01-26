package com.yaj.core.properties;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.springframework.beans.BeansException;
import org.springframework.core.io.support.PropertiesLoaderUtils;

public class PropertiesListenerConfig {
	public static Map<String, String> propertiesMap = new HashMap<>();

	private static void processProperties(Properties props) throws BeansException {
		propertiesMap = new HashMap<String, String>();
		for (Object key : props.keySet()) {
			String keyStr = key.toString();
			try {
				// PropertiesLoaderUtils的默认编码是ISO-8859-1,在这里转码一下
				propertiesMap.put(keyStr, new String(props.getProperty(keyStr).getBytes("ISO-8859-1"), "utf-8"));
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			} catch (java.lang.Exception e) {
				e.printStackTrace();
			}
		}
	}

	public static void loadAllProperties(String propertyFileName) {
		try {
			Properties properties = PropertiesLoaderUtils.loadAllProperties(propertyFileName);
			processProperties(properties);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public static String getProperty(String name) {
		if(propertiesMap.get(name)==null) {
			return null;
		}else {
			return propertiesMap.get(name).toString();
		}
	}
	
	public static boolean existProperty(String name) {
		if(propertiesMap.get(name)==null) {
			return false;
		}else {
			return true;
		}
	}

	public static Map<String, String> getAllProperty() {
		return propertiesMap;
	}
}
