package com.yaj.common.threadlocal.base;

public abstract class BaseThreadlocalContext { 
	protected String token; 
	
	protected int BusinessExceptionHashCode = 0;

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public int getBusinessExceptionHashCode() {
		return BusinessExceptionHashCode;
	}

	public void setBusinessExceptionHashCode(int businessExceptionHashCode) {
		BusinessExceptionHashCode = businessExceptionHashCode;
	}


			
}
