package com.yaj.freedomen.business.componentpropdoc.controller;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.yaj.common.threadlocal.ThreadlocalManager;
import com.yaj.freedomen.business.componentpropdoc.entity.po.ComponentPropDocPO;
import com.yaj.freedomen.business.componentpropdoc.entity.vo.ComponentPropDocAddVO;
import com.yaj.freedomen.business.componentpropdoc.service.ComponentPropDocService;
import com.yaj.freedomen.config.Env;
import com.yaj.freedomen.config.SystemData;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation; 
 
@Api(value="")
@EnableAutoConfiguration
@RestController
@RequestMapping(value="/ComponentPropDoc")
public class ComponentPropDocController {
	@Autowired
	private ComponentPropDocService componentPropDocService;
	
	@Value("${base.env}")
	private String env;
	/**
	 *添加 
	 **/
	@ApiOperation(value="添加",notes="添加")
	@RequestMapping(value="/insertOrUpdate", method=RequestMethod.POST)
    public Object insertOrUpdate(
    		@RequestBody ComponentPropDocAddVO cpdVO) { 
		if (cpdVO.getList().isEmpty()) return -1;
		
		for (int i = 0; i < cpdVO.getList().size(); i ++) {
			ComponentPropDocPO cpd = cpdVO.getList().get(i);
			cpd.setComponentPropDocProp(cpdVO.getComponentPropDocProp());
			cpd.setComponentPropDocSort(i);
			cpd.setComponentPropDocName(cpdVO.getComponentPropDocName());
			
		}  
		//说明是更新，前端全量传，如果和库里不一样 要删除库里的
		if (cpdVO.getComponentPropDocId() != null) {
			ComponentPropDocPO cpd = new ComponentPropDocPO();
			cpd.setComponentPropDocName(cpdVO.getComponentPropDocName());
			
			Wrapper<ComponentPropDocPO> cpdWrapper = new EntityWrapper<>(cpd);
			List<ComponentPropDocPO> list = componentPropDocService.selectList(cpdWrapper);
			
			List<Integer> ids = cpdVO.getList().stream().map(el -> el.getComponentPropDocId()).collect(Collectors.toList());
			
			List<Integer> delIds =  list.stream().filter(el -> {
				return !ids.contains(el.getComponentPropDocId());
			}).map(el -> el.getComponentPropDocId()).collect(Collectors.toList());
			
			if (!delIds.isEmpty()) {
				componentPropDocService.deleteBatchIds(delIds);
			} 
		}
		
		return componentPropDocService.insertOrUpdateBatch(cpdVO.getList());
    } 
    /**
	 *查找
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/select", method = RequestMethod.POST)
    public Object retrieve(@RequestBody ComponentPropDocPO cpd) {
		
		if (cpd.getComponentPropDocName() == null && cpd.getPlugId() == null) return new ArrayList<>();
		
		List<ComponentPropDocPO> list = componentPropDocService.selectList(new EntityWrapper<ComponentPropDocPO>(cpd));

		list.sort(new Comparator<ComponentPropDocPO>() {
			@Override
			public int compare(ComponentPropDocPO o1, ComponentPropDocPO o2) { 
				return o1.getComponentPropDocSort() - o2.getComponentPropDocSort();
			}
		});
		
        return list;
    } 
	/**
	 *查找
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/selectAdmin", method = RequestMethod.POST)
    public Object selectAdmin(@RequestBody ComponentPropDocPO cpd) {
		if (env.equals(Env.Prod) && !ThreadlocalManager.getThreadContext().getUserId().equals(SystemData.expUserId)) {
			 return -1;
		}
		
		Wrapper<ComponentPropDocPO> en = new EntityWrapper<>(cpd);
		
		en.isNull("plug_id"); 
		
		return componentPropDocService.selectList(en);
    } 
	/**
	 *删除
	 **/
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
	@ApiOperation(value="删除", notes="删除")
	@RequestMapping(value="/delete", method=RequestMethod.POST)
    public Object deleteProject(@RequestBody ComponentPropDocPO cpd) {
		return componentPropDocService.deleteById(cpd.getComponentPropDocId());
    } 
}
