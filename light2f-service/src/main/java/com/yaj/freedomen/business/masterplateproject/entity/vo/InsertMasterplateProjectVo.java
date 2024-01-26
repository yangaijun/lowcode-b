package com.yaj.freedomen.business.masterplateproject.entity.vo;

import com.yaj.freedomen.business.masterplateproject.entity.po.MasterplateProjectPO;

public class InsertMasterplateProjectVo extends MasterplateProjectPO {
	//inserType === 'copy' 复制
	private String insertType;

	public String getInsertType() {
		return insertType;
	}

	public void setInsertType(String insertType) {
		this.insertType = insertType;
	}
	
}
