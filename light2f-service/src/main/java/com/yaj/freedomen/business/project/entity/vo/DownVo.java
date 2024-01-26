package com.yaj.freedomen.business.project.entity.vo;

import java.util.List;

public class DownVo {
	private Integer projectId;
	private List<PageCode> pages; 
	
	public Integer getProjectId() {
		return projectId;
	}
	public void setProjectId(Integer projectId) {
		this.projectId = projectId;
	}
	public List<PageCode> getPages() {
		return pages;
	}
	public void setPages(List<PageCode> pages) {
		this.pages = pages;
	}
	
	
}
