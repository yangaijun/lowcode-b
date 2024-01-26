package com.yaj.core.util;
 
import com.yaj.core.util.codec.Base64;
import com.yaj.core.util.codec.MD5Util;

public class PasswordUtil {
	/**
	* @Title: encodePassword
	* @Description: 一次加密不加salt
	* @param @param password
	* @param @return    参数
	* @return String    返回类型
	* @throws
	* @author Orange
	* @date 2017年11月28日
	*/
//	public static String encodePassword(String password) {
//		return MD5Util.getMD5ofStr(password);
//	}

	/**
	* @Title: isPasswordValid
	* @Description: 一次加密密码校验
	* @param encPass 加密后密文密码
	* @param rawPass 待验证明文密码
	* @param @return    参数
	* @return boolean    返回类型
	* @throws
	* @author Orange
	* @date 2017年11月28日
	*/
//	public static boolean isPasswordValid(String encPass, String rawPass) {
//		if (encPass.equals(encodePassword(rawPass))) {
//			return true;
//		}
//		return false;
//	}
	
	/**
	* @Title: encodePassword
	* @Description: 盐值加密<br>盐值可为用户名<br> 
	* username作为salt，先反序
	* username 和  salt 值分别base64编码
	* emanresu{password]
	* @param @param password
	* @param @param salt
	* @param @return    参数
	* @return String    返回类型
	* @throws
	* @author Orange
	* @date 2017年11月28日
	*/
	public static String encodePassword(String password,Object salt) {
		Base64 base64 = new Base64();
		String strsalt=salt.toString();
		StringBuffer stringBuffer = new StringBuffer (strsalt);  
		strsalt=stringBuffer.reverse().toString();
		strsalt=new String(base64.encode(strsalt.getBytes()));
		password= new String(base64.encode(password.getBytes()));
		password=strsalt+"{"+password+"]";
		return MD5Util.getMD5ofStr(password);
	}
	
	/**
	* @Title: isPasswordValid
	* @Description: 盐值验密<br>盐值可为用户名	 
	* @param @param encPass
	* @param @param rawPass
	* @param @param salt
	* @param @return    参数
	* @return boolean    返回类型
	* @throws
	* @author Orange
	* @date 2017年11月28日
	*/
	public static boolean isPasswordValid(String encPass, String rawPass,Object salt) {
		if (encPass.equals(encodePassword(rawPass,salt))) {
			return true;
		}
		return false;
	}
	
	public static void main(String[] args) {
		 System.out.println(encodePassword("123456", "admin"));
	}
}
