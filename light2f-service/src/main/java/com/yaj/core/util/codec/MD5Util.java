package com.yaj.core.util.codec;

import java.security.MessageDigest;



/**
 * 标准MD5加密方法，使用java类库的security包的MessageDigest类处理 <BR>
 * 也可变为非标准MD5，请修改下面的移位算法
 * 
 * 
 */
public class MD5Util {
	/**
	 * 获得MD5加密密码的方法
	 */
	public static String getMD5ofStr(String origString) {
		String origMD5 = null;
		try {
			MessageDigest md5 = MessageDigest.getInstance("MD5");
			byte[] result = md5.digest(origString.getBytes());
			origMD5 = byteArray2HexStr(result);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return origMD5;
	}

	/**
	 * 处理字节数组得到MD5密码的方法
	 */
	private static String byteArray2HexStr(byte[] bs) {
		StringBuffer sb = new StringBuffer();
		for (byte b : bs) {
			sb.append(byte2HexStr(b));
		}
		return sb.toString();
	}

	/**
	 * 字节标准移位转十六进制方法
	 */
	private static String byte2HexStr(byte b) {
		String hexStr = null;
		int n = b;
		if (n < 0) {
			// 若需要自定义加密,请修改这个移位算法即可
			n = b & 0x7F + 128;
		}
		hexStr = Integer.toHexString(n / 16) + Integer.toHexString(n % 16);
		return hexStr.toLowerCase();
	}

	/**
	 * 提供一个MD5多次加密方法
	 */
	private static String getMD5ofStr(String origString, int times) {
		String md5 = getMD5ofStr(origString);
		for (int i = 0; i < times - 1; i++) {
			md5 = getMD5ofStr(md5);
		}
		return getMD5ofStr(md5);
	}

	/**
	 * 密码验证方法
	 */
	private static boolean verifyPassword(String inputStr, String MD5Code) {
		return getMD5ofStr(inputStr).equals(MD5Code);
	}

	/**
	 * 多次加密时的密码验证方法
	 */
	private static boolean verifyPassword(String inputStr, String MD5Code,
			int times) {
		return getMD5ofStr(inputStr, times).equals(MD5Code);
	}

	

	/*
	 * 一次加密不加salt
	 */
	public static String encodePassword(String password) {
		return getMD5ofStr(password);
	}

	public static boolean isPasswordValid(String encPass, String rawPass) {
		if (encPass.equals(encodePassword(rawPass))) {
			return true;
		}
		return false;
	}
	
	/*
	 * username作为salt，先反序
	 * username 和  salt 值分别base64编码
	 * emanresu{password]
	 */
	public static String encodePassword(String password,Object salt) {
		Base64 base64 = new Base64();
		String strsalt=salt.toString();
		StringBuffer stringBuffer = new StringBuffer (strsalt);  
		strsalt=stringBuffer.reverse().toString();
		
		strsalt=new String(base64.encode(strsalt.getBytes()));
		password= new String(base64.encode(password.getBytes()));
		
		password=strsalt+"{"+password+"]";
		return getMD5ofStr(password);
	}
	public static boolean isPasswordValid(String encPass, String rawPass,Object salt) {
		if (encPass.equals(encodePassword(rawPass,salt))) {
			return true;
		}
		return false;
	}
	
	
	
	
//	/*
//	 * username作为salt，先反序，然后md5加密
//	 * emanresu{password]
//	 */
//	public static String encodePassword(String password,Object salt) {
//		StringBuffer stringBuffer = new StringBuffer (salt.toString());  
//		salt=stringBuffer.reverse().toString();
//		password=salt+"{"+password+"]";
//		return getMD5ofStr(password);
//	}
//	public static boolean isPasswordValid(String encPass, String rawPass,Object salt) {
//		if (encPass.equals(encodePassword(rawPass,salt))) {
//			return true;
//		}
//		return false;
//	}
	
	
	
	//==================================================================================

//	public static void main(String[] args) {
//		System.out.println(encodePassword("1","1"));
//	}

	
}
