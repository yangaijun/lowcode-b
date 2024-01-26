package com.yaj.common.exception;

public enum BusinessExceptionErrorEnum {
	TOKEN_EXPIRED(1001, "token已过期!"),
	TOKEN_PARSE_ERROR(1002, "登录信息失效, 请重新登录！"),
	CODE_ERROR(1003, "验证码不正确 ！"),
	EMAIL_EXIST(1004, "邮箱已存在！"),
	EMAIL_NOT_EXIST(1005, "邮箱不存在！"),
	UPLOAD_NO_LOGIN_ERROR(1006, "上传失败，请登录后再上传文件！"),
	UPLOAD_FILE_TYPE_ERROR(1007, "上传失败，文件类型不支持！"),
	UPLOAD_FILE_PARSE_ERROR(1008, "文件解析失败，请查看示例！"),
	NO_ACCESS_AUTH(1009, "无操作权限！"),

	USER_LOGIN_ERROR(2001, "帐号或密码错误！"),
	//about project
	USER_PROJECT_NO_ACCESS(2002, "没数据访问权限！"),
	USER_PROJECT_REACT_MAX(2003, "项目创建数量已到最大限制！"),
	USER_PROJECT_DOWNLOAD_MAX(2004, "项目下载数量已经最大限制！"),
	USER_PROJECT_CREATE_PAGE_MAX(2005, "页面创建数量已经最大限制！"),

	PROJECT_MASTERPLATE_DELETE_ERROR(3001, "删除失败，有项目使用此母版!"),
	SYSTEM_ERROR(9900, "服务器处理异常！");
 
	private int code;
	private String message;
	
	private BusinessExceptionErrorEnum(int code, String desc) {
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
