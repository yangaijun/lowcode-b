package com.yaj.common.inspect.url;

public enum URLInspectTypeEnum {
    SWAGGER(1,"swagger"),
	STATIC_FILE(2,"static_files"),
	DAFAULT_NO_AUTH(3,"static_files");

	private int type;
	private String message;
	private URLInspectTypeEnum(int type, String message) {
		this.setType(type);
		this.setMessage(message);
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
}
