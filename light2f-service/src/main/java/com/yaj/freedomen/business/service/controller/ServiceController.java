package com.yaj.freedomen.business.service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper; 
import com.yaj.freedomen.business.service.entity.po.ServicePO;
import com.yaj.freedomen.business.service.service.ServiceService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(value="")
@EnableAutoConfiguration
@RestController
@RequestMapping(value="/Service")
public class ServiceController {
	@Autowired
	private ServiceService serviceService; 
	/**
	 *添加 
	 **/
	@ApiOperation(value="添加s",notes="添加s")
	@RequestMapping(value="/inserts", method=RequestMethod.POST)
    public Object inserts(
    		@RequestBody List<ServicePO> services) {
		if (!services.isEmpty()) { 
			return serviceService.insertBatch(services);
		}
        return -1;
    }
	@ApiOperation(value="添加或修改s",notes="添加或修改s")
	@RequestMapping(value="/insertOrUpdates", method=RequestMethod.POST)
	public Object insertOrUpdates(
			@RequestBody List<ServicePO> services) {
		if (!services.isEmpty()) {
			return serviceService.insertOrUpdateBatch(services);
		}
		return -1;
	}
	/**
	 *修改
	 **/
	@ApiOperation(value="修改",notes="修改")
	@RequestMapping(value="/update", method=RequestMethod.POST)
    public Object update(@RequestBody ServicePO servicePO) {
        return serviceService.updateById(servicePO);
    }  
	/**
	 *查找單個
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/selectByPageIds", method = RequestMethod.POST)
    public Object selectByPageIds(@RequestBody List<Integer> pageIds) {
		Wrapper<ServicePO> en = new EntityWrapper<>();  
		en.in("page_id", pageIds);
        return serviceService.selectList(en);
    } 
	/**
	 *查找單個
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/select", method = RequestMethod.POST)
    public Object InitCodePO(@RequestBody ServicePO servicePO) {
		Wrapper<ServicePO> en = new EntityWrapper<>(servicePO);  
        return serviceService.selectList(en);
    } 
	/**
	 *删除
	 **/
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
	@ApiOperation(value="删除", notes="删除")
	@RequestMapping(value="/delete", method=RequestMethod.POST)
    public Object delete(@RequestBody ServicePO servicePO) {
		serviceService.deleteById(servicePO.getServiceId());
        return 1;
    }  
}
