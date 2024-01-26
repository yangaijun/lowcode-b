package com.yaj.freedomen.business.page.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.yaj.common.exception.BusinessException;
import com.yaj.common.exception.BusinessExceptionErrorEnum;
import com.yaj.common.generate.DataBaseService;
import com.yaj.common.generate.base.DataBaseInfo;
import com.yaj.common.threadlocal.ThreadlocalManager;
import com.yaj.freedomen.business.page.entity.po.PagePO;
import com.yaj.freedomen.business.page.entity.vo.InsertPage;
import com.yaj.freedomen.business.page.entity.vo.NestedPage;
import com.yaj.freedomen.business.page.entity.vo.TablesInfoVo;
import com.yaj.freedomen.business.page.service.PageService;
import com.yaj.freedomen.business.project.entity.po.ProjectPO;
import com.yaj.freedomen.business.project.service.ProjectService;
import com.yaj.freedomen.config.SystemData;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.multipart.MultipartFile;

@Api(value="")
@EnableAutoConfiguration
@RestController
@RequestMapping(value="/Page")
public class PageController {
	@Autowired
	private PageService pageService;
	@Autowired
	private ProjectService projectService;
	@Autowired
	private DataBaseService dataBaseService;
	
	@ApiOperation(value="数据表info", notes="数据表info")
	@RequestMapping(value="/tableNames", method=RequestMethod.POST)
    public Object tableNames(@RequestBody ProjectPO project) {
		project = projectService.selectOne(new EntityWrapper<>(project));
		if (project.getDatabaseUrl() == null) {
			return null;
		}
		
		DataBaseInfo dbInfo = new DataBaseInfo();
		dbInfo.setUrl(project.getDatabaseUrl());
		dbInfo.setUsername(project.getDatabaseUsername());
		dbInfo.setPassword(project.getDatabasePassword());
        return dataBaseService.getTableNames(dbInfo);
    }
	
	@ApiOperation(value="数据表tablesInfo", notes="数据表tablesInfo")
	@RequestMapping(value="/tablesInfo", method=RequestMethod.POST)
    public Object tablesInfo(@RequestBody TablesInfoVo tablesInfoVo) {
		ProjectPO project = new ProjectPO();
		project.setProjectId(tablesInfoVo.getProjectId());
		project = projectService.selectOne(new EntityWrapper<>(project));
		DataBaseInfo dbInfo = new DataBaseInfo();
		dbInfo.setUrl(project.getDatabaseUrl());
		dbInfo.setUsername(project.getDatabaseUsername());
		dbInfo.setPassword(project.getDatabasePassword());
		return dataBaseService.getTablesInfo(dbInfo, tablesInfoVo.getTablesName());
    }  
    /**
	 *批量添加或修改
	 **/
    @ApiOperation(value="批量添加或修改",notes="批量添加或修改")
	@RequestMapping(value="/insertOrUpdates", method=RequestMethod.POST)
    public Object insertOrUpdates(
    		@RequestBody List<PagePO> pageList) {
        return pageService.insertOrUpdateBatch(pageList);
    }

	@ApiOperation(value="解析文件",notes="解析文件")
	@RequestMapping(value="/parseGenerateFile", method=RequestMethod.POST)
	public Object parseGenerateFile(
			@RequestParam("file") MultipartFile file) throws IOException {
		Integer userId = ThreadlocalManager.getThreadContext().getUserId();
		if (userId == null || userId.equals(SystemData.guestUserId)) {
			throw new BusinessException(BusinessExceptionErrorEnum.UPLOAD_NO_LOGIN_ERROR);
		}

		Object result = pageService.parseGenerateFile(file);
		if (result == null) {
			throw new BusinessException(BusinessExceptionErrorEnum.UPLOAD_FILE_PARSE_ERROR);
		}

		return result;
	}
    /**
	 *添加或修改
	 **/
    @ApiOperation(value="添加或修改",notes="添加或修改")
	@RequestMapping(value="/insertOrUpdate", method=RequestMethod.POST)
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
    public Object insertOrUpdate(
    		@RequestBody InsertPage page) { 
        pageService.insertOrUpdatePage(page);
        return true;
    }
    /**
	 *修改
	 **/
	@ApiOperation(value="修改",notes="修改")
	@RequestMapping(value="/update", method=RequestMethod.POST)
    public Object updatePage(@RequestBody PagePO page) {
        return pageService.updateById(page);
    } 
	/**
	 *修改nested
	 **/
	@ApiOperation(value="修改",notes="修改")
	@RequestMapping(value="/updateNested", method=RequestMethod.POST)
    public Object updateNested(@RequestBody List<NestedPage> nestedPages) {
         pageService.updateByNested(nestedPages);
         return true;
    } 
	
	@ApiOperation(value="查找selectLogin",notes="selectLogin")
	@RequestMapping(value="/selectLogin", method = RequestMethod.POST)
    public Object selectLogin(@RequestBody PagePO page) {
		if (page.getProjectId() == null) {
			return null;
		} 
		Wrapper<PagePO> wrapper = new EntityWrapper<>(page);
		//1 登录页面， -1登录模版页，后面 搞成  interface!, 0 普通页面
		wrapper.in("page_type", Arrays.asList(-1, 1));
		
		List<PagePO> list = pageService.selectList(wrapper);
		if (!list.isEmpty()) {
			return list.get(0);
		} else {
			return null;
		}
    } 
	
	@ApiOperation(value="查找nested",notes="nested")
	@RequestMapping(value="/selectNested", method = RequestMethod.POST)
    public Object retrievePage(@RequestBody PagePO page) {
		if (page.getProjectId() == null) {
			return new ArrayList<>();
		}
		 
		ProjectPO project = projectService.selectById(page.getProjectId());
		
		if (project != null && 
				project.getProjectType().equals("private") && 
				!project.getUserId().equals(SystemData.expUserId) &&
				!ThreadlocalManager.getThreadContext().getUserId().equals(project.getUserId())) {
			throw new BusinessException(BusinessExceptionErrorEnum.USER_PROJECT_NO_ACCESS);
		} 
		//0普通 页面，后面 搞成  interface!, 1 登录页面
		page.setPageType(0);
        return pageService.nestedSelect(page);
    } 
	/**
	 *查找
	 **/
	@ApiOperation(value="selectOne",notes="selectOne")
	@RequestMapping(value="/selectOne", method = RequestMethod.POST)
    public Object selectOne(@RequestBody PagePO page) {
        return pageService.selectById(page.getPageId());
    }
	/**
	 *查找list
	 **/
	@ApiOperation(value="select",notes="select")
	@RequestMapping(value="/select", method = RequestMethod.POST)
    public Object select(@RequestBody PagePO page) {
        return pageService.selectList(new EntityWrapper<>(page));
    }
	/**
	 *删除
	 **/
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
	@ApiOperation(value="删除", notes="删除")
	@RequestMapping(value="/delete", method=RequestMethod.POST)
    public Object deletePage(@RequestBody List<NestedPage> nestedPages) {
		pageService.deleteByNested(nestedPages);
        return true;
    } 
	/**
	 *删除
	 **/
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
	@ApiOperation(value="删除", notes="删除")
	@RequestMapping(value="/deleteOne", method=RequestMethod.POST)
    public Object deleteOne(@RequestBody Integer id) {
		return pageService.deleteById(id); 
    }  
}
