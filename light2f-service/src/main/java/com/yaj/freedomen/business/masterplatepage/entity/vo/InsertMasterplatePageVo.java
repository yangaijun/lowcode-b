package com.yaj.freedomen.business.masterplatepage.entity.vo;

import com.yaj.freedomen.business.masterplatepage.entity.po.MasterplatePagePO;

public class InsertMasterplatePageVo extends MasterplatePagePO {
	//inserType === 'copy' 复制
	private String insertType;

	public String getInsertType() {
		return insertType;
	}

	public void setInsertType(String insertType) {
		this.insertType = insertType;
	}
	
}
