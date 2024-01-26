package com.yaj.freedomen.business.project.controller;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSONArray;
import com.yaj.common.cache.RedisManager;
import com.yaj.common.cache.RedisTimes;
import com.yaj.core.util.DBHelper;
import com.yaj.freedomen.business.log.entity.po.LogPO;
import com.yaj.freedomen.business.log.service.LogService;
import com.yaj.freedomen.business.masterplateproject.entity.po.MasterplateProjectPO;
import com.yaj.freedomen.business.masterplateproject.service.MasterplateProjectService;
import com.yaj.freedomen.business.project.entity.vo.AiCreateInfoVo;
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
import com.yaj.common.generate.TableInfo;
import com.yaj.common.generate.base.DataBaseInfo;
import com.yaj.common.multipleselect.MultipleResult;
import com.yaj.common.multipleselect.MultipleSelect;
import com.yaj.common.multipleselect.service.MultipleService;
import com.yaj.common.threadlocal.ThreadlocalManager;
import com.yaj.core.util.BeanUtil;
import com.yaj.freedomen.business.masterplatepage.entity.po.MasterplatePagePO;
import com.yaj.freedomen.business.page.entity.po.PagePO;
import com.yaj.freedomen.business.page.service.PageService;
import com.yaj.freedomen.business.project.entity.po.ProjectPO;
import com.yaj.freedomen.business.project.entity.vo.DownVo;
import com.yaj.freedomen.business.project.entity.vo.ProjectVo;
import com.yaj.freedomen.business.project.service.ProjectService;
import com.yaj.freedomen.business.user.entity.po.UserPO;
import com.yaj.freedomen.business.user.service.UserService;
import com.yaj.freedomen.config.SystemData;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.multipart.MultipartFile;

@Api(value="")
@EnableAutoConfiguration
@RestController
@RequestMapping(value="/Project")
public class ProjectController {
	@Autowired
	private ProjectService projectService;
	@Autowired
	private MasterplateProjectService masterplateProjectService;
	@Autowired
	private DataBaseService dataBaseService;
	@Autowired
	private PageService pageService; 
	@Autowired
	private UserService userService;
	@Autowired
	private MultipleService multipleService;

	@Autowired
	private RedisManager redisManager;

	@Autowired
	private LogService logService;

	/**
	 *项目是否有权限 
	 **/
	@ApiOperation(value="permission",notes="是否有权限")
	@RequestMapping(value="/permission", method=RequestMethod.POST)
    public Object projectPermission(
    		@RequestBody PagePO page) {
		if (page.getProjectId() == null && page.getPageId() == null) {
			return false;
		}
		
		if (page.getProjectId() != null) {
			ProjectPO project = new ProjectPO();
			project.setProjectId(page.getProjectId());
			project.setUserId(ThreadlocalManager.getThreadContext().getUserId()); 
			
			Wrapper<ProjectPO> en = new EntityWrapper<>(project);
			
			return projectService.selectOne(en) != null;
		} else {
			MultipleSelect ms = MultipleSelect.newInstance("${1}.userId", page, new MasterplatePagePO());
			ms.where("${1}").eq("userId", ThreadlocalManager.getThreadContext().getUserId());
			
			MultipleResult mr = multipleService.multipleSelect(ms);
			return  !mr.getData().isEmpty();
		}
    }

	/**
	 * 是否创建项目超上限
	 * @return
	 */
	private boolean getIsMaxProject() {
		Integer userId = ThreadlocalManager.getThreadContext().getUserId();

		UserPO u = userService.selectById(userId);
		Wrapper<ProjectPO> enp = new EntityWrapper<>();
		enp.eq("user_id", userId);

		return projectService.selectList(enp).size() >= u.getUserMaxProject() ;
	}
    /**
	 *添加或修改
	 **/
    @ApiOperation(value="添加或修改",notes="添加或修改")
	@RequestMapping(value="/insertOrUpdate", method=RequestMethod.POST)
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
    public Object insertOrUpdate(
    		@RequestBody ProjectVo projectVo) {
		if (projectVo.getUserId() != null && !projectVo.getUserId().equals(ThreadlocalManager.getThreadContext().getUserId())){
			throw new BusinessException(BusinessExceptionErrorEnum.NO_ACCESS_AUTH);
		}
    	
    	Integer userId = ThreadlocalManager.getThreadContext().getUserId();
    	ProjectPO project = new ProjectPO();
		BeanUtil.copy(projectVo, project);
		project.setUserId(userId);

    	//2  clone版本
    	if (projectVo.getType() != null && projectVo.getType() == 2 && projectVo.getParentId() != null) {
    		projectService.cloneProject(projectVo.getParentId(), project);
    		
    		return true; 
    	} else {  
	    	if (project.getProjectId() == null) {
	    		if (getIsMaxProject()) {
	    			throw new BusinessException(BusinessExceptionErrorEnum.USER_PROJECT_REACT_MAX);
	    		}

	    		projectService.insert(project);
				projectService.cloneLoginPage(project.getProjectId());
	    	} else {
	    		projectService.updateById(project);
	    	}
	    	
	        return true;
    	}
    }
    /**
	 *修改
	 **/
	@ApiOperation(value="修改",notes="修改")
	@RequestMapping(value="/update", method=RequestMethod.POST)
    public Object updateProject(@RequestBody ProjectPO project) {
		if (project.getUserId() != null && !project.getUserId().equals(ThreadlocalManager.getThreadContext().getUserId())){
			throw new BusinessException(BusinessExceptionErrorEnum.NO_ACCESS_AUTH);
		}
		return projectService.updateById(project);
    }

	@ApiOperation(value="是否已经创建超过上限",notes="是否已经创建超过上限")
	@RequestMapping(value="/isMaxProject", method=RequestMethod.POST)
	public Object isMaxProject() {
		return  getIsMaxProject();
	}
	/**
	 *修改
	 **/
	@ApiOperation(value="Ai 自动创建",notes="Ai 自动创建")
	@RequestMapping(value="/aiGenerate", method=RequestMethod.POST)
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
	public Object aiGenerate(@RequestBody AiCreateInfoVo aiInfo) {
		if (getIsMaxProject()) {
			throw new BusinessException(BusinessExceptionErrorEnum.USER_PROJECT_REACT_MAX);
		}

		Integer userId = ThreadlocalManager.getThreadContext().getUserId();
		//创建项目母版
		EntityWrapper<MasterplateProjectPO> entityWrapper = new EntityWrapper<>();
		entityWrapper.eq("masterplate_project_type", "sys");
		List<MasterplateProjectPO> mps = masterplateProjectService.selectList(entityWrapper);
		if (!mps.isEmpty()) {
			MasterplateProjectPO masterplateProject = mps.get(0);
			masterplateProject.setUserId(userId);
			masterplateProject.setMasterplateProjectId(null);
			masterplateProject.setCreatedAt(null);
			masterplateProject.setMasterplateProjectType("private");

			SimpleDateFormat formatter= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date date = new Date();
			String timeString = formatter.format(date);

			masterplateProject.setMasterplateProjectDes("created by AI at " + timeString);
			masterplateProject.setMasterplateProjectName("AI创建");

			if (aiInfo.getMasterplateProject() != null) {
				masterplateProject.setMasterplateProjectBaseUrl(aiInfo.getMasterplateProject().getMasterplateProjectBaseUrl());
			} else {
				masterplateProject.setMasterplateProjectBaseUrl(null);
			}

			masterplateProjectService.insert(masterplateProject);

			ProjectPO project = new ProjectPO();
			project.setProjectName("AI智能创建");
			project.setUserId(userId);
			project.setMasterplateProjectId(masterplateProject.getMasterplateProjectId());
			project.setProjectDes("created by AI at "+ timeString);
			project.setProjectType("private");

			projectService.insert(project);

			projectService.cloneLoginPage(project.getProjectId());
			pageService.aiGenPages(aiInfo, project.getProjectId());
		}

		return -1;
	}
	/**
	 *修改
	 **/
	@ApiOperation(value="連接測試",notes="連接測試")
	@RequestMapping(value="/testDBConnect", method=RequestMethod.POST)
	public Object testDBConnect(@RequestBody ProjectPO project) {
		DataBaseInfo DBInfo = new DataBaseInfo();
		DBInfo.setUrl(project.getDatabaseUrl());
		DBInfo.setUsername(project.getDatabaseUsername());
		DBInfo.setPassword(project.getDatabasePassword());

		return dataBaseService.testConnection(DBInfo);
	}

	@ApiOperation(value="sql结构解析",notes="sql结构解析")
	@RequestMapping(value="/parserSql", method=RequestMethod.POST)
	public Object parserSql(
			@RequestParam("file") MultipartFile file) throws IOException {
		DBHelper.ImportSqlResult result = DBHelper.getImportSql(file.getInputStream());

		//记录一下日志
		LogPO logPO = new LogPO();
		logPO.setLogType(result.getResultList().isEmpty() ? "sql_error" : "sql");
		logPO.setLogInfo(result.getSqlInfoList().stream().collect(Collectors.joining("\n")));
		logPO.setUserId(ThreadlocalManager.getThreadContext().getUserId());

		try {
			//可能数据比较多，溢出了
			logService.insert(logPO);
		} catch (Exception e) {
			e.printStackTrace();

			logPO.setLogType("sql_error");
			logPO.setLogInfo("long_text");
			logService.insert(logPO);
		}

		if (result.getResultList().isEmpty()) {
			return -1;
		}

		String key = UUID.randomUUID().toString().replaceAll("-", "");

		redisManager.set(key, JSONArray.toJSONString(result.getResultList()), RedisTimes.fifteenMinute);

		return key;
	}
	/**
	 *数据库信息
	 **/
	@ApiOperation(value="获取数据库信息",notes="获取数据库信息")
	@RequestMapping(value="/getDbInfo", method=RequestMethod.POST)
	public Object getDbInfo(@RequestBody ProjectPO project) {
		DataBaseInfo DBInfo = new DataBaseInfo();
		DBInfo.setUrl(project.getDatabaseUrl());
		DBInfo.setUsername(project.getDatabaseUsername());
		DBInfo.setPassword(project.getDatabasePassword());

		List<String> names = dataBaseService.getTableNames(DBInfo);
		List<List<TableInfo>> info = dataBaseService.getTablesInfo(DBInfo, names);
		Map<String, Object> resultMap = new HashMap<>();

		for (String name: names) {
			List<TableInfo> value = null;
			for (List<TableInfo> i: info) {
				if (i.get(0).getTableName().equals(name)) {
					value = i;
					break;
				}
			}
			resultMap.put(name, value);
		}

		return resultMap;
	}
	/**
	 *数据库信息
	 **/
	@ApiOperation(value="获取数据库信息",notes="获取数据库信息")
	@RequestMapping(value="/getDbInfoByUid/{uid}", method=RequestMethod.POST)
	public Object getDbInfoByUid(@PathVariable String uid) {
		String info = redisManager.get(uid);
		Map<String, Object> resultMap = new HashMap<>();

		if (info != null) {
			JSONArray ja  = JSONArray.parseArray(info);

			for (int i = 0; i < ja.size(); i++) {
				List<TableInfo> tableInfo = ja.getJSONArray(i).toJavaList(TableInfo.class);
				if (!tableInfo.isEmpty()) {
					resultMap.put(tableInfo.get(0).getTableName(), tableInfo);
				}
			}
		}

		return resultMap;
	}
	/**
	 *查找
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/select", method = RequestMethod.POST)
    public Object retrieveProject(@RequestBody ProjectPO project) {
		project.setUserId(ThreadlocalManager.getThreadContext().getUserId()); 
			Wrapper<ProjectPO> wrapper = new EntityWrapper<>(project);
			wrapper.orderBy("created_at", false);

		return  projectService.selectProjects(wrapper, true);
    }
	/**
	 *查找
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/selectById/{projectId}", method = RequestMethod.POST)
    public Object selectById(@PathVariable Integer projectId) {
		if (projectId != null) {
			ProjectPO project = new ProjectPO();
			project.setProjectId(projectId);
			
			List<?> list =  projectService.selectProjects(new EntityWrapper<>(project), true);
			
			if (!list.isEmpty()) {
				return list.get(0);
			}
		}
		
		return new HashMap<>();
    }  
	/**
	 *查找
	 **/
	@ApiOperation(value="查找公共的",notes="查找公共的")
	@RequestMapping(value="/selectPublic", method = RequestMethod.POST)
    public Object retrieveProjectPublic() {
		Wrapper<ProjectPO> wrapper = new EntityWrapper<>();
		
		wrapper.and()
			.eq("project_type", "public")
			.or()
			.eq("user_id", ThreadlocalManager.getThreadContext().getUserId());
	
		return  projectService.selectProjects(wrapper, true);
    }
	/**
	 *查找示例列表，adminUser 做的
	 **/
	@ApiOperation(value="查找示例",notes="查找")
	@RequestMapping(value="/selectExp", method = RequestMethod.POST)
    public Object retrieveProjectExp(@RequestBody ProjectPO project) {
		project.setUserId(SystemData.expUserId);
		
		return  projectService.selectProjects(new EntityWrapper<ProjectPO>(project), true);
    }
	/**
	 * 查找單個
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/selectOne", method = RequestMethod.POST)
    public Object selectOne(@RequestBody ProjectPO project) {
        return projectService.selectById(project.getProjectId());
    }
	/**
	 * 删除
	 **/
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
	@ApiOperation(value="删除", notes="删除")
	@RequestMapping(value="/delete", method=RequestMethod.POST)
    public Object deleteProject(@RequestBody ProjectPO project) {
		return projectService.deleteById(project.getProjectId());
    } 
	/**
	 * 下载
	 * @throws IOException
	**/
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
	@ApiOperation(value="下载", notes="下载")
	@RequestMapping(value="/down", method=RequestMethod.POST)
	public Object down(@RequestBody DownVo down, HttpServletResponse response) throws IOException { 
		Integer userId = ThreadlocalManager.getThreadContext().getUserId();
		//未登录和游客不可以下载
		if (userId == null || userId.equals(SystemData.guestUserId)) {
			return null;
		}
		//更新下载次数
		UserPO user = userService.selectById(ThreadlocalManager.getThreadContext().getUserId());
		//流量不要钱啊，暂不开放任意下载
		if (user == null || user.getDownloadCount() > 50) {
			throw new BusinessException(BusinessExceptionErrorEnum.USER_PROJECT_DOWNLOAD_MAX);
		}
		user.setDownloadCount(user.getDownloadCount() + 1);
		userService.updateById(user);
				
		projectService.downLoad(down, response.getOutputStream());
		
		return null;
	} 
}
