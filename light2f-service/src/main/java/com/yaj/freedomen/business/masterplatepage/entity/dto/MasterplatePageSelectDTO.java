package com.yaj.freedomen.business.masterplatepage.entity.dto;

import com.yaj.freedomen.business.masterplatepage.entity.po.MasterplatePagePO;

public class MasterplatePageSelectDTO extends MasterplatePagePO {
	private Integer pageId;

	public Integer getPageId() {
		return pageId;
	}

	public void setPageId(Integer pageId) {
		this.pageId = pageId;
	}
}
