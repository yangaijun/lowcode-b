package com.yaj.common.threadlocal;

import com.yaj.common.threadlocal.base.BaseThreadlocalContext;

public class ThreadlocalContext extends BaseThreadlocalContext {
	 
	private Integer userId;
   
	public Integer getUserId() {
		return userId;
	}
	
	public void setUserId(Integer userId) {
		this.userId = userId;
	} 
}
