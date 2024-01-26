package com.yaj.core.log.base;


import com.yaj.common.threadlocal.ThreadlocalContext;
import com.yaj.common.threadlocal.ThreadlocalManager;

/**
* @Description: 日志切面基类
* @author ...
* @date 2017年8月4日
*
*/
public class BaseLogAspect {
	
	/**
	* @Title: getLogDesc
	* @Description: 输入日志描述
	* @param @return    参数
	* @return String    返回类型
	* @throws
	* @author Orange
	* @date 2017年8月4日
	*/
	protected String getLogDesc() {
		ThreadlocalContext threadlocalContext = ThreadlocalManager.getThreadContext();
		if(threadlocalContext==null){
			return "";
		}
		return "UserID: " + threadlocalContext.getUserId();
	}
}
