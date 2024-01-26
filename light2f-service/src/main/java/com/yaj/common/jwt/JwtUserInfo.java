package com.yaj.common.jwt;
 
import com.yaj.core.util.JSONUtil;


public class JwtUserInfo {
	private String token;  
	/**
	* @Title: toJsonString
	* @Description: 返回json字符串
	* @param @return    参数
	* @return String    返回类型
	* @throws
	* @author Orange
	* @date 2018年1月28日
	*/
	public String toJsonString() {
		return JSONUtil.toJSONString(this);
	} 
	public String getToken() {
		return token;
	} 
	public void setToken(String token) {
		this.token = token;
	} 
}
