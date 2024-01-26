package com.yaj.core.exception;


/**
 * @name:
 * @author:Yang
 */
public class BaseBusinessException extends RuntimeException {

	private static final long serialVersionUID = 3200004685293133433L;
	protected String type;// 异常类型
	protected Integer errorCode;// 异常代码
	protected String errorMessage;// 异常信息
	protected Object extraMessage;// 异常补充信息

	protected BaseBusinessException() {
	}

	public BaseBusinessException(BaseExceptionErrorEnum e) {
		this.errorMessage = e.getMessage();
		this.errorCode = e.getCode();
	}
 
	public BaseBusinessException(BaseExceptionErrorEnum e, String errorMessage) {
		this.errorMessage = e.getMessage();
		this.errorCode = e.getCode();
		this.extraMessage = errorMessage;
	}
 
	public Integer getErrorCode() {
		return this.errorCode;
	}

	public void setErrorCode(Integer errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMessage() {
		return this.errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public String getType() {
		return this.type;
	}

	void setType(String type) {
		this.type = type;
	}

	public String getMessage() {
		return this.errorMessage;
	}

	void setMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public Object getExtraMessage() {
		return extraMessage;
	}

	public void setExtraMessage(Object extraMessage) {
		this.extraMessage = extraMessage;
	}
}
