package com.yaj.freedomen.business.page.entity.vo;

import java.util.List;

public class TablesInfoVo {
	private Integer projectId;
	private List<String> tablesName;
	
	public Integer getProjectId() {
		return projectId;
	}
	public void setProjectId(Integer projectId) {
		this.projectId = projectId;
	}
	public List<String> getTablesName() {
		return tablesName;
	}
	public void setTablesName(List<String> tablesName) {
		this.tablesName = tablesName;
	}
	
}
