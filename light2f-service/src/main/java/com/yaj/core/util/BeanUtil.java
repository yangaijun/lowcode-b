package com.yaj.core.util;

public class BeanUtil {

	public static void copy(Object source,Object target){
		org.springframework.beans.BeanUtils.copyProperties(source, target);
	}
	
	public static Object[] getEntities(Object target, Class<?>[] objs) {
		Object[] entities = new Object[objs.length];
		int count = 0;
		
		for (Class<?> o : objs) {
			Object entity = null;
			try {
				entity = o.newInstance();
			} catch (Exception e) {
				continue;
			}
			if (target != null)
				copy(target, entity);
			entities[count ++] = entity;
		}
		
		return entities;
	}
	 
}
