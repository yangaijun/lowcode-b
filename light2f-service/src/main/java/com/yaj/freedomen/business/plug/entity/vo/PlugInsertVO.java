package com.yaj.freedomen.business.plug.entity.vo;

import java.util.List;

import com.yaj.freedomen.business.componentpropdoc.entity.po.ComponentPropDocPO;
import com.yaj.freedomen.business.plug.entity.po.PlugPO;

public class PlugInsertVO extends PlugPO {
	private List<ComponentPropDocPO> componentPropDocs;

	public List<ComponentPropDocPO> getComponentPropDocs() {
		return componentPropDocs;
	}

	public void setComponentPropDocs(List<ComponentPropDocPO> componentPropDocs) {
		this.componentPropDocs = componentPropDocs;
	}

	 

}
