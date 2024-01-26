package com.yaj.freedomen.business.initcode.controller;
 
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
import com.yaj.freedomen.business.initcode.entity.po.InitCodePO;
import com.yaj.freedomen.business.initcode.service.InitCodeService; 
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(value="")
@EnableAutoConfiguration
@RestController
@RequestMapping(value="/InitCode")
public class InitCodeController {
	@Autowired
	private InitCodeService initCodeService; 
	/**
	 *查找單個
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/selectByPageIds", method = RequestMethod.POST)
    public Object selectByPageIds(@RequestBody List<Integer> pageIds) {
		Wrapper<InitCodePO> en = new EntityWrapper<>();
		en.in("page_id", pageIds);
        return initCodeService.selectList(en);
    }
	/**
	 *添加 
	 **/
	@ApiOperation(value="添加",notes="添加")
	@RequestMapping(value="/insertOrUpdate", method=RequestMethod.POST)
    public Object insertOrUpdate(
    		@RequestBody InitCodePO initCode) {
		initCodeService.insertOrUpdate(initCode);
        return initCode;
    } 
	/**
	 *查找單個
	 **/
	@ApiOperation(value="更新",notes="跟新")
	@RequestMapping(value="/updates", method = RequestMethod.POST)
    public Object updates(@RequestBody List<InitCodePO> list) { 
        return initCodeService.updateBatchById(list);
    }
    /**
	 *修改
	 **/
	@ApiOperation(value="修改",notes="修改")
	@RequestMapping(value="/update", method=RequestMethod.POST)
    public Object update(@RequestBody InitCodePO initCode) {
        return initCodeService.updateById(initCode);
    }  
	/**
	 *查找單個
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/select", method = RequestMethod.POST)
    public Object InitCodePO(@RequestBody InitCodePO initCode) {
		Wrapper<InitCodePO> en = new EntityWrapper<>(initCode);
		en.orderBy("init_code_type desc");
        return initCodeService.selectList(en);
    }
	/**
	 *查找單個
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/selectOne", method = RequestMethod.POST)
    public Object selectOne(@RequestBody InitCodePO initCode) {
        return initCodeService.selectById(initCode.getInitCodeId());
    }
	/**
	 *删除
	 **/
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
	@ApiOperation(value="删除", notes="删除")
	@RequestMapping(value="/delete", method=RequestMethod.POST)
    public Object delete(@RequestBody InitCodePO initCode) {
		initCodeService.deleteById(initCode.getInitCodeId());
        return 1;
    } 
	
}
