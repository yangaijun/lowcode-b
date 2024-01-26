package com.yaj.common.cache;

public interface RedisTimes {
	
	public static long fiveMinute = 5 * 60;

	public static long fifteenMinute = 15 * 60;
	public static long halfHour = 30 * 60;
	
	public static long today = 24 * 60 * 60;

	public static long twoMonth = 2 * 30 * today;

	public static long twoWeek = 2 * 7 * today;

}
