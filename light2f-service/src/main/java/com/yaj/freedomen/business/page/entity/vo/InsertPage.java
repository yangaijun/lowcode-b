package com.yaj.freedomen.business.page.entity.vo;

import java.util.List;

import com.yaj.common.generate.TableInfo;
import com.yaj.freedomen.business.page.entity.po.PagePO;

public class InsertPage extends PagePO { 
	
	private List<TableInfo> tableInfos;

	public List<TableInfo> getTableInfos() {
		return tableInfos;
	}

	public void setTableInfos(List<TableInfo> tableInfos) {
		this.tableInfos = tableInfos;
	}
	

}
