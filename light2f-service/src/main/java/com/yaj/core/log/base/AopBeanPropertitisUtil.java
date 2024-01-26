package com.yaj.core.log.base;
 
import com.alibaba.fastjson.JSON;
import com.yaj.common.inspect.transferobject.TransferObjectInspect;

public class AopBeanPropertitisUtil {
	public static String convertToString(Object[] objects){
		StringBuffer sb = new StringBuffer("");
		for(Object object:objects){
			if(object==null) continue;
			if(TransferObjectInspect.check(object)){
				sb.append(object.getClass().getSimpleName()+":");
				sb.append(JSON.toJSONString(object));
				sb.append(";");
			}
		}
		return sb.toString();
	}
	
	public static String convertToString(Object object){
		StringBuffer sb = new StringBuffer("");
		if(object!=null && TransferObjectInspect.check(object)){
			sb.append(object.getClass().getSimpleName()+":");
			sb.append(JSON.toJSONString(object));
			sb.append(";");
		}
		return sb.toString();
	}
	
//	private static boolean checkBean(Object obj){
////		if(Serializable.class.isInstance(obj)){
////			return true;
////		}
//		if(List.class.isInstance(obj)){
//			return true;
//		}
//		if(Map.class.isInstance(obj)){
//			return true;
//		}
//		if(ResponseData.class.isInstance(obj)){
//			return true;
//		}
//		if(obj.getClass().getPackage().toString().indexOf("entity.vo")>0){
//			return true;
//		}
//		if(obj.getClass().getPackage().toString().indexOf("entity.po")>0){
//			return true;
//		}
//		if(obj.getClass().getPackage().toString().indexOf("entity.dto")>0){
//			return true;
//		}
//		return false;
//	}
}
