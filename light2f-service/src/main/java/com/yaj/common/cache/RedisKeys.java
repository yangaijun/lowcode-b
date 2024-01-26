package com.yaj.common.cache;

public class RedisKeys {
	private static String getString(Object key) {
		if (key == null) {
			return "null";
		}
		return key.toString();
	}
	public static String getEmailKey(Object key) {
		return "Email_" + getString(key);
	}
	
	public static String getEmailForgetKey(Object key) {
		return "ForgetEmail_" + getString(key);
	}
	
	public static String getUserTokenKey(Object key) {
		return "UserToken_" + getString(key);
	}
	
	public static String getOnlineHalfHourUserKey(Object key) {
		return "Online_HalfHour_" + getString(key);
	}
	
	public static String getOnlineTodayUserKey(Object key) {
		return "Online_Today_" + getString(key);
	}

	public static String getLastLoginDateUserKey(Object key) {
		return "Last_Login_Time_" + getString(key);
	}
}
