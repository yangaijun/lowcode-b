package com.yaj.core.util;

import com.alibaba.fastjson.JSON;


/**
* @Description: JSON工具
* @author Orange
* @date 2018年1月28日
*
*/
public class JSONUtil {
    
    /**
    * @Title: toJSONString
    * @Description: 转JSON字符串
    * @param @param obj
    * @param @return    参数
    * @return String    返回类型
    * @throws
    * @author Orange
    * @date 2018年1月28日
    */
    public static String toJSONString(Object obj){
        return JSON.toJSONString(obj);
    }
    
    /**
    * @Title: parseObject
    * @Description: JSON字符串转实体
    * @param @param json
    * @param @param t
    * @param @return    参数
    * @return T    返回类型
    * @throws
    * @author Orange
    * @date 2018年1月28日
    */
    public static <T> T parseObject(String json,Class<T> t){
        return JSON.parseObject(json,t);
    }
}
