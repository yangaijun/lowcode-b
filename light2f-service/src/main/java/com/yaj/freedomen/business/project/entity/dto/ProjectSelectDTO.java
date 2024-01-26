package com.yaj.freedomen.business.project.entity.dto;

import com.yaj.freedomen.business.masterplateproject.entity.po.MasterplateProjectPO;
import com.yaj.freedomen.business.project.entity.po.ProjectPO;

public class ProjectSelectDTO extends ProjectPO {
	private String userName;
	private String userAvatar;
	private Long pageCounts;
	
	private MasterplateProjectPO masterplateProject;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getUserAvatar() {
		return userAvatar;
	}

	public void setUserAvatar(String userAvatar) {
		this.userAvatar = userAvatar;
	}

	public MasterplateProjectPO getMasterplateProject() {
		return masterplateProject;
	}

	public void setMasterplateProject(MasterplateProjectPO masterplateProject) {
		this.masterplateProject = masterplateProject;
	}

	public Long getPageCounts() {
		return pageCounts;
	}

	public void setPageCounts(Long pageCounts) {
		this.pageCounts = pageCounts;
	}
	
}
