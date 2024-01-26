package com.yaj.freedomen.business.page.entity.vo;

import java.util.List;

import com.yaj.freedomen.business.page.entity.po.PagePO;

public class NestedPage extends  PagePO {
	private List<NestedPage> children;

	public List<NestedPage> getChildren() {
		return children;
	}

	public void setChildren(List<NestedPage> children) {
		this.children = children;
	}

	 
	
}
