package com.yaj.common.multipleselect;

import java.util.List;
import java.util.Map;

public class TableEntity {
	 
	private String tableName;
	private String nickName;
	private List<String> allTableColumns;
	private List<String> allEntityColumns;
	private Object entity;
	private String logicDelete;
	private List<String> notExsit;
	private Map<String, String> filter;
	
	public Object getEntity() {
		return entity;
	}
	public void setEntity(Object entity) {
		this.entity = entity;
	}
	public String getTableName() {
		return tableName;
	} 
	public String getNickName() {
		return nickName;
	}
	public void setNickName(String nickName) {
		this.nickName = nickName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
		this.nickName = tableName.replaceAll("_", "");
	}
	public List<String> getAllTableColumns() {
		return allTableColumns;
	}
	public void setAllTableColumns(List<String> allTableColumns) {
		this.allTableColumns = allTableColumns;
	}
	public List<String> getAllEntityColumns() {
		return allEntityColumns;
	}
	public void setAllEntityColumns(List<String> allEntityColumns) {
		
		this.allEntityColumns = allEntityColumns;
	}
	public String getSelectSegment() {
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < allTableColumns.size(); i ++) {
			if (!this.getNotExsit().contains(allEntityColumns.get(i))) { 
				sb.append(this.nickName) 
				  .append('.') 
				  .append(allTableColumns.get(i))
				  .append(' ') 
				  .append("`")
				  .append(allEntityColumns.get(i))
				  .append("`")
				  .append(",");
			} 
		}
		sb.deleteCharAt(sb.length() - 1);
		return sb.toString();
	}
	public String getLogicDelete() {
		return logicDelete;
	}
	public void setLogicDelete(String logicDelete) {
		this.logicDelete = logicDelete;
	}
	public List<String> getNotExsit() {
		return notExsit;
	}
	public void setNotExsit(List<String> notExsit) {
		this.notExsit = notExsit;
	}
	public Map<String, String> getFilter() {
		return filter;
	}
	public void setFilter(Map<String, String> filter) {
		this.filter = filter;
	}
}
