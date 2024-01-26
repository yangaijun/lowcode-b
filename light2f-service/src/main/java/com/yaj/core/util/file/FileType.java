package com.yaj.core.util.file;

public enum FileType {
	JPG("JPG"),
	XLS("XLS"),
	XLSX("XLSX");
	FileType(){
	}
	FileType(String value){
		this.value=value;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	private String value;
}
