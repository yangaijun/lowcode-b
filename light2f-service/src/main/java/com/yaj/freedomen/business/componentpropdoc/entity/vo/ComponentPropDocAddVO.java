package com.yaj.freedomen.business.componentpropdoc.entity.vo;

import java.util.List;

import com.yaj.freedomen.business.componentpropdoc.entity.po.ComponentPropDocPO;

public class ComponentPropDocAddVO extends ComponentPropDocPO {
	private List<ComponentPropDocPO> list;

	public List<ComponentPropDocPO> getList() {
		return list;
	}

	public void setList(List<ComponentPropDocPO> list) {
		this.list = list;
	}

}
