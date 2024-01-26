package com.yaj.common.generate.base;

public class DataBaseInfo {
	//127.0.0.1:3306/table_name
	private String url;
	//登录名
	private String username;
	//密码
	private String password;
	//tableSchema
	private String tableSchema;
	
	private static String PROPTOCOL = "jdbc:mysql://";

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		if (url.startsWith(PROPTOCOL))
			this.url = url;
		else 
			this.url = PROPTOCOL + url;
		
		int _index = url.lastIndexOf("/");
		if (_index != -1 && _index != url.length() - 1) {
			this.setTableSchema(url.substring(_index + 1));
		}
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getTableSchema() {
		return tableSchema;
	}

	public void setTableSchema(String tableSchema) {
		this.tableSchema = tableSchema;
	}

}
