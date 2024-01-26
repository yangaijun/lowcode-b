package com.yaj.common.threadlocal;

public class ThreadlocalManager {
	
	private static ThreadLocal<ThreadlocalContext> threadlocalContext = new ThreadLocal<>();

	public static ThreadlocalContext getThreadContext() {
		return threadlocalContext.get();
	} 
	public static void setThreadContext(ThreadlocalContext token) {
		threadlocalContext.set(token);
	}
	public static void removeThreadContext() {
		threadlocalContext.remove();
	}
}
