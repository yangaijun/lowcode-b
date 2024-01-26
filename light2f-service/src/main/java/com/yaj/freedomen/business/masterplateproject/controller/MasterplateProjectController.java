package com.yaj.freedomen.business.masterplateproject.controller;
 
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.yaj.common.exception.BusinessException;
import com.yaj.common.exception.BusinessExceptionErrorEnum;
import com.yaj.common.threadlocal.ThreadlocalManager;
import com.yaj.core.util.BeanUtil;
import com.yaj.freedomen.business.masterplateproject.entity.po.MasterplateProjectPO;
import com.yaj.freedomen.business.masterplateproject.entity.vo.InsertMasterplateProjectVo;
import com.yaj.freedomen.business.masterplateproject.service.MasterplateProjectService;
import com.yaj.freedomen.business.page.entity.po.PagePO;
import com.yaj.freedomen.business.project.entity.po.ProjectPO;
import com.yaj.freedomen.business.project.service.ProjectService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
 
@Api(value="")
@EnableAutoConfiguration
@RestController
@RequestMapping(value="/MasterplateProject")
public class MasterplateProjectController {
	@Autowired
	private MasterplateProjectService masterplateProjectService;  
	@Autowired
	private ProjectService projectService;
	/**
	 *添加 
	 **/
	@ApiOperation(value="添加",notes="添加")
	@RequestMapping(value="/insertOrUpdate", method=RequestMethod.POST)
    public Object insertOrUpdate(@RequestBody InsertMasterplateProjectVo masterplate) {
		boolean isCopy = masterplate.getInsertType() != null && masterplate.getInsertType().equals("copy");
		if(!isCopy && masterplate.getUserId() != null && !masterplate.getUserId().equals(ThreadlocalManager.getThreadContext().getUserId())) {
			throw new BusinessException(BusinessExceptionErrorEnum.NO_ACCESS_AUTH);
		}
		masterplate.setUserId(ThreadlocalManager.getThreadContext().getUserId());

		MasterplateProjectPO po = new MasterplateProjectPO();
		BeanUtil.copy(masterplate, po);
		if (isCopy) {
			po.setCreatedAt(null);
			po.setMasterplateProjectId(null); 
		} 
		
		return masterplateProjectService.insertOrUpdate(po); 
    }
	/**
	 *缺省id 
	 **/
	@ApiOperation(value="缺省id",notes="缺省id")
	@RequestMapping(value="/permission", method=RequestMethod.POST)
    public Object permission(@RequestBody MasterplateProjectPO masterplate) {   
		if (masterplate.getMasterplateProjectId() == null)
			return false;
		
		 masterplate.setUserId(ThreadlocalManager.getThreadContext().getUserId());
		 
		 List<?> result = masterplateProjectService.selectList(new EntityWrapper<MasterplateProjectPO>(masterplate));
		 
		 return !result.isEmpty(); 
    } 
	/**
	 *缺省id 
	 **/
	@ApiOperation(value="缺省id",notes="缺省id")
	@RequestMapping(value="/defaultId", method=RequestMethod.POST)
    public Object defaultId() {  
		 MasterplateProjectPO masterplate = new MasterplateProjectPO();
		//應該有userId
		 masterplate.setUserId(ThreadlocalManager.getThreadContext().getUserId());
		 Wrapper<MasterplateProjectPO> en = new EntityWrapper<>(masterplate);

		 List<MasterplateProjectPO> list = masterplateProjectService.selectList(en);

		 if (!list.isEmpty()) {
			 return list.get(0).getMasterplateProjectId();
		 } else {
			 return -1;
		 }
    } 
	/**
	 *添加 
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/select", method=RequestMethod.POST)
    public Object select(@RequestBody MasterplateProjectPO masterplate) {
		Wrapper<MasterplateProjectPO> en = new EntityWrapper<>(masterplate);
		en.orderBy("created_at DESC");

		return masterplateProjectService.selectList(en);
    }
	@ApiOperation(value="查找自己的",notes="查找自己的")
	@RequestMapping(value="/selectSelf", method=RequestMethod.POST)
	public Object selectSelf(@RequestBody MasterplateProjectPO masterplate) {
		Wrapper<MasterplateProjectPO> en = new EntityWrapper<>(masterplate);

		en.orNew()
			.eq("user_id", ThreadlocalManager.getThreadContext().getUserId())
			.or()
			.eq("masterplate_project_type", "sys");

		en.orderBy("masterplate_project_type DESC, created_at DESC");
		//系統模板
		return masterplateProjectService.selectList(en);
	}
	/**
	 *查找
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/selectById/{masterplateProjectId}", method = RequestMethod.POST)
    public Object selectById(@PathVariable Integer masterplateProjectId) {
		if (masterplateProjectId != null) {
			return masterplateProjectService.selectById(masterplateProjectId);
		}
		
		return new HashMap<>();
    }  
    /**
	 *修改
	 **/
	@ApiOperation(value="修改",notes="修改")
	@RequestMapping(value="/update", method=RequestMethod.POST)
    public Object update(@RequestBody PagePO page) {
        return true;
    } 
	/**
	 *删除
	 **/
	@ApiOperation(value="delete",notes="delete")
	@RequestMapping(value="/delete", method=RequestMethod.POST)
    public Object delete(@RequestBody MasterplateProjectPO masterplate) {
		if (masterplate.getMasterplateProjectId() != null) {
			ProjectPO project = new ProjectPO();
			project.setMasterplateProjectId(masterplate.getMasterplateProjectId());
			project.setUserId(ThreadlocalManager.getThreadContext().getUserId());
			List<?> projects = projectService.selectList(new EntityWrapper<ProjectPO>(project));
			if (!projects.isEmpty()) {
				throw new BusinessException(BusinessExceptionErrorEnum.PROJECT_MASTERPLATE_DELETE_ERROR);
			}
			
			return masterplateProjectService.deleteById(masterplate.getMasterplateProjectId()); 
		}
		return -1;
    }
}
