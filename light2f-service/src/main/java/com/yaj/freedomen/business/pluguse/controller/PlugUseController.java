package com.yaj.freedomen.business.pluguse.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.yaj.common.multipleselect.MultipleSelect;
import com.yaj.common.multipleselect.service.MultipleService;
import com.yaj.common.threadlocal.ThreadlocalManager;
import com.yaj.freedomen.business.plug.entity.po.PlugPO;
import com.yaj.freedomen.business.pluguse.entity.po.PlugUsePO;
import com.yaj.freedomen.business.pluguse.service.PlugUseService;
import com.yaj.freedomen.config.SystemData;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(value="")
@EnableAutoConfiguration
@RestController
@RequestMapping(value="/PlugUse")
public class PlugUseController {
	@Autowired
	private PlugUseService plugUseService; 
	
	@Autowired
	private MultipleService multipleService;
	 
    /**
	 *添加或修改
	 **/
    @ApiOperation(value="添加或修改",notes="添加或修改")
	@RequestMapping(value="/insertOrUpdate", method=RequestMethod.POST)
    public Object insertOrUpdate(
    		@RequestBody PlugUsePO plugUse) {
    	
    	plugUse.setUserId(ThreadlocalManager.getThreadContext().getUserId());
    	
    	return plugUseService.insertOrUpdate(plugUse);
     
    } 
    /**
	 *查找
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/select", method = RequestMethod.POST)
    public Object retrieve(@RequestBody PlugUsePO plugUse) { 
		
		plugUse.setUserId(ThreadlocalManager.getThreadContext().getUserId());
		
		MultipleSelect ms = MultipleSelect.newInstance(SystemData.plugSelect, plugUse, new PlugPO());
		
		return multipleService.multipleSelect(ms).getData();
    }  
	/**
	 *查找
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/selectByProjectId/{projectId}", method = RequestMethod.POST)
    public Object retrieveById(@PathVariable Integer projectId) { 
		PlugUsePO plugUse = new PlugUsePO();
		plugUse.setProjectId(projectId);
		
		MultipleSelect ms = MultipleSelect.newInstance("${plug}", plugUse, new PlugPO());
		
		return multipleService.multipleSelect(ms).getData();
    } 
	
	 /**
	 *查找
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/uniqueType", method = RequestMethod.POST)
    public Object uniqueType(@RequestBody PlugUsePO plugUse) { 
		
		plugUse.setUserId(ThreadlocalManager.getThreadContext().getUserId()); 
		
		List<?> rs = plugUseService.selectList(new EntityWrapper<PlugUsePO>(plugUse)); 
		
		return  rs.size() == 0;
    } 
		 
	 
}
