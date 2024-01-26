package com.yaj.freedomen.business.project.entity.vo;

import com.yaj.freedomen.business.project.entity.po.ProjectPO;

public class ProjectVo extends ProjectPO {
	//2 是克隆
	private Integer type;
	private Integer parentId;
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public Integer getParentId() {
		return parentId;
	}
	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	} 
}
