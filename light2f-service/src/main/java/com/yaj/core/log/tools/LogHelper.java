package com.yaj.core.log.tools;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * 日志工具类
 * @author ...
 *
 */
public class LogHelper {
	
	private static Logger logger = null;

	
	/**
	 * @param info
	 */
	public static void log(String info) {
		logger = LoggerFactory.getLogger("");
		logger.info(info + "");
	}
	
	/**
	 * @param clazz
	 * @param info
	 */
	public static void log(Class<?> clazz, String info) {
		logger = LoggerFactory.getLogger(clazz);
		logger.info(info);
	}
	
	/**
	 * @param clazz
	 * @param e
	 */
	public static void log(Class<?> clazz, Throwable e) {
		log(clazz,throwable2String(e));
	}
	
	/**
	 * @param name
	 * @param info
	 */
	public static void log(String name, String info) {
		logger = LoggerFactory.getLogger("");
		logger.info(name+"-"+info);
	}
	
	/**
	 * @param name
	 * @param e
	 */
	public static void log(String name, Throwable e) {
		log(name,throwable2String(e));
	}
	
	
	/**
	 * @param name
	 * @param info
	 * @param e
	 */
	public static void log(String name, String info,Throwable e) {
		log(name,info+"-"+throwable2String(e));
	}
	
	
	/**
	 * @param clazz
	 * @param info
	 * @param e
	 */
	public static void log(Class<?> clazz, String info,Throwable e) {
		log(clazz,info+"-"+throwable2String(e));
	}
	
	/**
	 * 将异常信息转为string
	 * @param e
	 * @return
	 */
	private static String throwable2String(Throwable e){
		PrintWriter pw = null;
		StringWriter sw = null;
		try {
			sw = new StringWriter();
			pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			pw.flush();
			sw.flush();
		} catch (Exception e1) {
			logger.info(e.getMessage());
		} finally {
			if(sw!=null){
				try{
					sw.close();
				}catch (Exception e2) {
					e2.printStackTrace();
					return "";
				}
			}else{
				return "";
			}
			if(pw!=null){
				pw.close();
			}
			return sw.toString();
		}
		
	}

}
