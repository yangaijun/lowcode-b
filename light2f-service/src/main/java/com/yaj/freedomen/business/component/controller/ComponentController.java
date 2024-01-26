package com.yaj.freedomen.business.component.controller;

import com.baomidou.mybatisplus.mapper.Wrapper;
import com.yaj.common.threadlocal.ThreadlocalManager;
import com.yaj.freedomen.business.initcode.entity.po.InitCodePO;
import com.yaj.freedomen.business.initcode.service.InitCodeService;
import com.yaj.freedomen.business.service.entity.po.ServicePO;
import com.yaj.freedomen.business.service.service.ServiceService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.baomidou.mybatisplus.mapper.EntityWrapper; 
import com.yaj.freedomen.business.component.entity.po.ComponentPO;
import com.yaj.freedomen.business.component.service.ComponentService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import java.util.*;

@Api(value="")
@EnableAutoConfiguration
@RestController
@RequestMapping(value="/Component")
public class ComponentController {
	@Autowired
	private ComponentService componentService;
	@Autowired
	private ServiceService serviceService;
	@Autowired
	private InitCodeService initCodeService;
	/**
	 *添加 
	 **/
	@ApiOperation(value="添加或修改",notes="添加或修改")
	@RequestMapping(value="/insertOrUpdate", method=RequestMethod.POST)
    public Object create(
    		@RequestBody ComponentPO component) { 
		return componentService.insertOrUpdate(component);
    }

	private List<ComponentPO> getSortComponentList(List<Integer> list) {
		List<ComponentPO> componentPOS = new ArrayList<>();
		int start = 0;
		for (Integer id: list) {
			ComponentPO componentPO = new ComponentPO();
			componentPO.setComponentId(id);
			componentPO.setComponentSort(start ++);

			componentPOS.add(componentPO);
		}
		return componentPOS;
	}

	@ApiOperation(value="updateSorts",notes="updateSorts")
	@RequestMapping(value="/updateSorts", method=RequestMethod.POST)
	public Object updateSorts(
			@RequestBody List<Integer> ids) {
		if (ids != null && !ids.isEmpty()) {
			componentService.updateBatchById(getSortComponentList(ids));
		}

		return true;
	}
	/**
	 *查找
	 **/
	@ApiOperation(value="组名",notes="组名")
	@RequestMapping(value="/groupOptions", method = RequestMethod.POST)
	public Object componentGroups(@RequestBody ComponentPO component) {
		if (component.getProjectId() == null) {
			return  new ArrayList<>();
		}
		Wrapper<ComponentPO> wrapper = new EntityWrapper<>();
			wrapper.setSqlSelect("component_group componentGroup");

			wrapper.eq("project_id", component.getProjectId())
				.like(component.getComponentGroup() != null, "component_group", component.getComponentGroup());

		Set<String> groups = new HashSet<>();
		List<ComponentPO> componentPOS = componentService.selectList(wrapper);
		System.out.println(componentPOS);
		componentPOS.stream().forEach(e -> {
			if (e != null && e.getComponentGroup() != null && !e.getComponentGroup().equals("")) {
				groups.add(e.getComponentGroup());
			}
		});

		return groups;
	}

	@Data
	public static class CreateInfoParams {
		private List<ServicePO> listServices;
		private List<InitCodePO> listInitCodes;
	}
	@ApiOperation(value="创建initCode、services等",notes="创建")
	@RequestMapping(value="/createInfo", method=RequestMethod.POST)
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
	public Object createInfo(
			@RequestBody CreateInfoParams params) {
		if (params.getListServices() != null && !params.getListServices().isEmpty()) {
			serviceService.insertBatch(params.getListServices());
		}
		if (params.getListInitCodes() != null && !params.getListInitCodes().isEmpty()) {
			initCodeService.insertBatch(params.getListInitCodes());
		}

		return true;
	}
 	/**
	 *查找
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/select", method = RequestMethod.POST)
    public Object retrieveProject(@RequestBody ComponentPO component) {
        return componentService.selectList(new EntityWrapper<>(component));
    } 
	/**
	 *删除
	 **/
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
	@ApiOperation(value="删除", notes="删除")
	@RequestMapping(value="/delete", method=RequestMethod.POST)
    public Object deleteProject(@RequestBody ComponentPO component) {
		return componentService.deleteById(component.getComponentId());
    }
}
