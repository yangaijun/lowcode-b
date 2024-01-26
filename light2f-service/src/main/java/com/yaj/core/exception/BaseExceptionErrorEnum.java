package com.yaj.core.exception;

public enum BaseExceptionErrorEnum {
	SYSTEM_ERROR(10000,"服务器异常！");
	private int code;
	private String message;
	private BaseExceptionErrorEnum(int code, String desc) {
		this.setCode(code);
		this.setMessage(desc);
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public int getCode() {
		return code;
	}
	public void setCode(int code) {
		this.code = code;
	}
}
