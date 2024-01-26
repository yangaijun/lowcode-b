package com.yaj.freedomen.business.project.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.parser.Feature;
import com.alibaba.fastjson.serializer.SerializerFeature;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader; 
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import org.apache.commons.io.FileUtils;

import com.yaj.common.cos.CosUtil;
import com.yaj.common.multipleselect.MultipleSelect;
import com.yaj.common.multipleselect.service.MultipleService;
import com.yaj.common.threadlocal.ThreadlocalManager;
import com.yaj.core.util.BeanUtil;
import com.yaj.core.util.file.ZipUtils;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.yaj.freedomen.business.component.entity.po.ComponentPO;
import com.yaj.freedomen.business.component.service.ComponentService;
import com.yaj.freedomen.business.initcode.entity.po.InitCodePO;
import com.yaj.freedomen.business.initcode.service.InitCodeService;
import com.yaj.freedomen.business.masterplatepage.service.MasterplatePageService;
import com.yaj.freedomen.business.masterplateproject.entity.po.MasterplateProjectPO;
import com.yaj.freedomen.business.masterplateproject.service.MasterplateProjectService;
import com.yaj.freedomen.business.page.entity.po.PagePO;
import com.yaj.freedomen.business.page.entity.vo.NestedPage;
import com.yaj.freedomen.business.page.service.PageService;
import com.yaj.freedomen.business.plug.entity.po.PlugPO;
import com.yaj.freedomen.business.pluguse.entity.po.PlugUsePO;
import com.yaj.freedomen.business.pluguse.service.PlugUseService;
import com.yaj.freedomen.business.project.entity.dto.ProjectSelectDTO;
import com.yaj.freedomen.business.project.entity.po.ProjectPO;
import com.yaj.freedomen.business.project.entity.vo.DownVo;
import com.yaj.freedomen.business.project.entity.vo.PageCode;
import com.yaj.freedomen.business.project.mapper.ProjectMapper;
import com.yaj.freedomen.business.service.entity.po.ServicePO;
import com.yaj.freedomen.business.service.service.ServiceService;
import com.yaj.freedomen.business.user.entity.po.UserPO;
import com.yaj.freedomen.business.user.service.UserService; 
import com.yaj.freedomen.utils.PinYinUtil;
import com.yaj.freedomen.utils.WriteUtil;
/*
 * @Description: 
 * @date: 2021-04-15
 */
@Service
public class ProjectService extends ServiceImpl<ProjectMapper, ProjectPO> { 
	
	@Resource
	ProjectMapper projectMapper;
	@Resource
	PageService pageService;
	@Resource
	MultipleService multipleService;
	@Resource
	private MasterplateProjectService masterplateProjectService; 
	@Resource
	private MasterplatePageService masterplatePageService;
	@Resource
	private ServiceService serviceService;
	@Resource
	private ComponentService componentService;
	@Resource
	private PlugUseService plugUseService;
	@Resource
	private InitCodeService initCodeService;
	@Resource
	private UserService userService;

	@Value("${template.filePath}")
	private String templatePath;

	@Value("${template.fileName}")
	private String templateFileName;

	private File getCopyFile() {
		File from = new File(templatePath + File.separator + templateFileName);
   		String randFileName = UUID.randomUUID().toString();
   		File to = new File(templatePath + File.separator + randFileName);
   		try {
   			FileUtils.copyDirectory(from, to);
		} catch (IOException e) {
			e.printStackTrace();
		}
   		return to;
	}

	private String getRoutes(List<NestedPage> nestedPages, int step, String prePath) {
		StringBuffer sb = new StringBuffer();
		int i = 0;
		for (NestedPage nestedPage: nestedPages) {
			//跳过登录页面
			if (nestedPage.getPageType().equals(1)) continue;

			if (!nestedPage.getChildren().isEmpty()) {
				sb.append((i == 0 ? WriteUtil.getSpace(step + 1) : " ") + "{")
					.append("\n")
					.append(WriteUtil.getSpace(step + 2) + "label: ")
					.append("'" + nestedPage.getPageName() + "',\n")
					.append(WriteUtil.getSpace(step + 2) + "path: ")
					.append("'" + prePath + nestedPage.getPageRouter() + "',\n")
					.append(WriteUtil.getSpace(step + 2) + "component:")
					.append("() => import('Layouts/Blank'),\n")
					.append(WriteUtil.getSpace(step + 2) + "routes: [\n")
					.append(getRoutes(nestedPage.getChildren(), step + 2, prePath + nestedPage.getPageFileName() + "/"))
					.append(WriteUtil.getSpace(step + 2) + "\n" + WriteUtil.getSpace(step + 2) + "]\n")
					.append(WriteUtil.getSpace(step + 1) + "},");
			} else {
				sb.append((i == 0 ? WriteUtil.getSpace(step + 1) : " ") + "{")
					.append("\n")
					.append(WriteUtil.getSpace(step + 2) + "label: ")
					.append("'" + nestedPage.getPageName() + "',\n");
				if (nestedPage.getPageHidden() == 2) {
					sb.append(WriteUtil.getSpace(step + 2) + "hidden: true,\n");
				}
				sb.append(WriteUtil.getSpace(step + 2) + "path: ")
					.append("'" + prePath + nestedPage.getPageRouter() + "',\n")
					.append(WriteUtil.getSpace(step + 2) + "component:")
					.append("() => import('views" +  prePath + nestedPage.getPageFileName() +"')\n")
					.append(WriteUtil.getSpace(step + 1) + "},");
			}
			i ++;
		}
		return sb.toString();
	}

	private void createRoutes(File file, List<NestedPage> nestedPages) {
		String routeString = getRoutes(nestedPages, 0, "/");
		routeString = "const routes = [\n" + routeString + "\n]\n";
		System.out.println(routeString);
		try {
			Writer writer = WriteUtil.getWriter(file);
			writer.write(routeString);
			writer.write("export default routes");
			WriteUtil.closeWriter(writer);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	//创建页面
	private void createPages(String filePath, List<NestedPage> nestedPages, Map<Integer, String> pageInfo) {
		for (NestedPage nestedPage: nestedPages) {
			if (!nestedPage.getChildren().isEmpty()) {
				String folderPath = filePath + File.separator + nestedPage.getPageFileName();
				File pageFolder = new File(folderPath);
				pageFolder.mkdir();
				createPages(folderPath, nestedPage.getChildren(), pageInfo);
			} else {
				String folderPath = filePath + File.separator + nestedPage.getPageFileName();
				File pageFolder = new File(folderPath);
				pageFolder.mkdir();
				File file = new File(folderPath + File.separator + "index.jsx");
				Writer writer = WriteUtil.getWriter(file);
				try {
					writer.write(pageInfo.get(nestedPage.getPageId()));
					WriteUtil.closeWriter(writer);
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

	public void clonePageCodeAndService(List<Integer> pageIds, List<Integer> newPageIds) {
		//initcode -------------------------------
		Date currentDate = new Date();
		Wrapper<InitCodePO> icWrapper = new EntityWrapper<>();
		icWrapper.in("page_id", pageIds);
		List<InitCodePO> initCodes = initCodeService.selectList(icWrapper);

		for (int i = 0; i < initCodes.size(); i ++) {
			InitCodePO initCode = initCodes.get(i);

			initCode.setInitCodeId(null);
			initCode.setCreatedAt(currentDate);

			int index = pageIds.indexOf(initCode.getPageId());
			if (index != -1) {
				initCode.setPageId(newPageIds.get(index));
			}
		}
		if (!initCodes.isEmpty()) {
			initCodeService.insertBatch(initCodes);
		}
		//service ---------------------------------
		Wrapper<ServicePO> servcieWrapper = new EntityWrapper<>();
		servcieWrapper.in("page_id", pageIds);

		List<ServicePO> services = serviceService.selectList(servcieWrapper);
		for (int i = 0; i < services.size(); i ++) {
			ServicePO service = services.get(i);

			service.setServiceId(null);
			service.setCreatedAt(currentDate);

			int index = pageIds.indexOf(service.getPageId());
			if (index != -1) {
				service.setPageId(newPageIds.get(index));
			}
		}
		if (!services.isEmpty()) {
			serviceService.insertBatch(services);
		}
	}

	public void cloneProject(Integer parentId, ProjectPO project) {
		if (project.getMasterplatePageId() == null) return;
		//masterplate_project项目母版
		MasterplateProjectPO mpp = masterplateProjectService.selectById(project.getMasterplateProjectId());
		if (mpp == null) return;
		if (!mpp.getUserId().equals(ThreadlocalManager.getThreadContext().getUserId())) {
			mpp.setMasterplateProjectId(null);
			mpp.setUserId(ThreadlocalManager.getThreadContext().getUserId());
			mpp.setMasterplateProjectName("来自项克隆自动生成");
			mpp.setCreatedAt(null);

			masterplateProjectService.insert(mpp);

			project.setMasterplatePageId(mpp.getMasterplateProjectId());
		}

		//project -------------------------------
		projectMapper.insert(project);
		Date currentDate = new Date();

		//component -----------------------------
		ComponentPO component = new ComponentPO();
		component.setProjectId(parentId);
		List<ComponentPO> components = componentService.selectList(new EntityWrapper<>(component));

		for (ComponentPO c: components) {
			c.setComponentId(null);
			c.setCreateAt(currentDate);
			c.setProjectId(project.getProjectId());
		}
		if (!components.isEmpty()) {
			componentService.insertBatch(components);
		}

		//plugUse ----------------------------------
		PlugUsePO plugUse = new PlugUsePO();
		plugUse.setProjectId(parentId);
		List<PlugUsePO> plugUses = plugUseService.selectList(new EntityWrapper<>(plugUse));

		for (PlugUsePO pu: plugUses) {
			pu.setPlugUseId(null);
			pu.setCreatedAt(currentDate);
			pu.setProjectId(project.getProjectId());
			pu.setUserId(ThreadlocalManager.getThreadContext().getUserId());
		}
		if (!plugUses.isEmpty()) {
			plugUseService.insertBatch(plugUses);
		}

		//page ----------------------------------
		PagePO page = new PagePO();
		page.setProjectId(parentId);
		List<PagePO> pages = pageService.selectList(new EntityWrapper<>(page));
		List<Integer> pageIds = new ArrayList<>();

		for (PagePO p: pages) {
			pageIds.add(p.getPageId());

			p.setPageId(null);
			p.setProjectId(project.getProjectId());
			p.setCreatedAt(currentDate);
		}
		if (!pages.isEmpty()) {
			pageService.insertBatch(pages);
		}

		clonePageCodeAndService(pageIds, pages.stream().map(p -> p.getPageId()).collect(Collectors.toList()));
	}

	public void cloneLoginPage(Integer projectId) {
		Wrapper<PagePO> pw = new EntityWrapper<>();
			pw.eq("page_type", -1);
		List<PagePO> pages = pageService.selectList(pw);

		if (!pages.isEmpty()) {
			PagePO page = pages.get(0);
			List<Integer> oldPageIds = Arrays.asList(page.getPageId());

			page.setPageId(null);
    		page.setProjectId(projectId);
    		//登录页面 -1系統登录页面模版
    		page.setPageType(1);
    		page.setCreatedAt(null);
    		pageService.insert(page);

    		clonePageCodeAndService(oldPageIds, Arrays.asList(page.getPageId()));
		}
	}
//	//初始化项目
//	public void initUserProject(Integer userId) {
//		//初始化项目母版
//        Wrapper<MasterplateProjectPO> en = new EntityWrapper<>();
//        	en.eq("masterplate_project_type", "sys");
//
//        List<MasterplateProjectPO> list = masterplateProjectService.selectList(en);
//
//        if (!list.isEmpty()) {
//        	 List<MasterplateProjectPO> copyList = new ArrayList<>();
//	        for (MasterplateProjectPO po: list) {
//	        	MasterplateProjectPO cpo = new MasterplateProjectPO();
//	        	BeanUtil.copy(po, cpo);
//
//	        	cpo.setMasterplateProjectId(null);
//	        	cpo.setCreatedAt(null);
//	        	cpo.setUserId(userId);
//	        	cpo.setMasterplateProjectType("private");
//
//	        	copyList.add(cpo);
//	        }
//
//        	masterplateProjectService.insertBatch(copyList);
//        }
//        //初始化页面母版
//        Wrapper<MasterplatePagePO> pen = new EntityWrapper<>();
//        	pen.eq("masterplate_page_type", "sys");
//
//        List<MasterplatePagePO> plist = masterplatePageService.selectList(pen);
//        List<MasterplatePagePO> pcopyList = new ArrayList<>();
//
//        if (!plist.isEmpty()) {
//        	for (MasterplatePagePO po: plist) {
//            	MasterplatePagePO cpo = new MasterplatePagePO();
//            	BeanUtil.copy(po, cpo);
//
//            	cpo.setCreatedAt(null);
//            	cpo.setMasterplatePageId(null);
//            	cpo.setUserId(userId);
//            	cpo.setMasterplatePageType("private");
//
//            	pcopyList.add(cpo);
//            }
//        	//默认选中第一个
//        	pcopyList.get(0).setMasterplatePageMaster(1);
//        	masterplatePageService.insertBatch(pcopyList);
//
//        	/********分割公用*********/
//            List<Integer> ids = new ArrayList<>();
//            plist.forEach(el -> ids.add(el.getMasterplatePageId()));
//
//            Wrapper<PagePO> pageEn = new EntityWrapper<>();
//            	pageEn.in("masterplate_page_id", ids);
//            //页面与页面母版是一对一的,所以pageList 的长度和pcopyList是一样的
//            List<PagePO> pageList = pageService.selectList(pageEn);
//            if (!pageList.isEmpty()) {
//	            //初始化页面
//	            List<PagePO> newPageList = new ArrayList<>();
//	            List<Integer> oldPageIds = new ArrayList<>();
//
//	            for (int i = 0; i < pageList.size(); i ++) {
//	            	oldPageIds.add(pageList.get(i).getPageId());
//
//	            	PagePO newPage = new PagePO();
//	            	BeanUtil.copy(pageList.get(i), newPage);
//
//	            	newPage.setPageId(null);
//	            	newPage.setMasterplatePageId(pcopyList.get(i).getMasterplatePageId());
//	            	newPage.setCreatedAt(null);
//
//	            	newPageList.add(newPage);
//	            }
//
//            	pageService.insertBatch(newPageList);
//	            //初始化 code， service------
//            	//初始化预定义code
//            	pageService.genInitCodes(newPageList, oldPageIds, null);
//            	//初始化initservice
//            	pageService.genServices(newPageList, oldPageIds, null,true);
//            }
//        }
//	}
	//创建样式文件
	private void createStyles(String filePath, List<NestedPage> nestedPages, Map<Integer, String> styleInfo) {
		for (NestedPage nestedPage: nestedPages) {
			if (!nestedPage.getChildren().isEmpty()) {
				String folderPath = filePath + File.separator + nestedPage.getPageFileName();
				File pageFolder = new File(folderPath);
				pageFolder.mkdir();
				createStyles(folderPath, nestedPage.getChildren(), styleInfo);
			} else {
				String folderPath = filePath + File.separator + nestedPage.getPageFileName();
				File pageFolder = new File(folderPath);
				pageFolder.mkdir();
				File file = new File(folderPath + File.separator + "index.module.less");
				Writer writer = WriteUtil.getWriter(file);
				try {
					writer.write(styleInfo.get(nestedPage.getPageId()));
					WriteUtil.closeWriter(writer);
				} catch (IOException e) { }
			}
		}
	}
	/**
	 * 創建service js
	 * @param filePath
	 * @param nestedPages
	 * @param serviceInfo
	 */
	private void createServices(String filePath, List<NestedPage> nestedPages, Map<Integer, String> serviceInfo) {
		File serviceFolder = new File(filePath);
		if(!serviceFolder.exists()) {
			serviceFolder.mkdir();
		}

		for (NestedPage nestedPage: nestedPages) {
			if (!nestedPage.getChildren().isEmpty()) {
				createServices(filePath, nestedPage.getChildren(), serviceInfo);
			} else {
				String fileName = filePath + File.separator + nestedPage.getPageFileName() + ".js";
				File file = new File(fileName);
				Writer writer = WriteUtil.getWriter(file);
				try {
					writer.write(serviceInfo.get(nestedPage.getPageId()));
					WriteUtil.closeWriter(writer);
				} catch (IOException e) { }
			}
		}
	}
	//獲取文件 modules.js  如果已經村子了  modules1.js modules2.js, ...
	private File getModuleFile(String path, String name) {
		int breakCount = 0;
		File routeModule = null;
		do {
			String _name = name;
			if (breakCount > 0) {
				_name = name + breakCount;
			}
			String namePath = path + File.separator + _name + ".js";
			routeModule = new File(namePath);
			if (!routeModule.exists()) {
				break;
			} else {
				breakCount ++;
			}
			//防止异常死循环
		} while(breakCount >= 100);

		return routeModule;
	}

	private String getValue(String value) {
		if (value == null) {
			return "null";
		}
		return "'" + value + "'";
	}

	private void createSystemConfig(String path, ProjectSelectDTO projectDto) {
		if (projectDto.getMasterplateProject() == null)
			return;

		File file = new File(path + File.separator + "systemConfig.js");
		Writer writer = WriteUtil.getWriter(file);

		try {
			writer.write("export const projectName = '" + projectDto.getProjectName() + "'\n");
			//axios
			String tokenName = getValue(projectDto.getMasterplateProject().getMasterplateProjectTokenName());
			writer.write("export const tokenName = " + tokenName + "\n");
			String baseURL = getValue(projectDto.getMasterplateProject().getMasterplateProjectBaseUrl());
			writer.write("export const baseURL = " + baseURL + "\n");
			String contentType = getValue(projectDto.getMasterplateProject().getMasterplateProjectContentType());
			writer.write("export const contentType = " + contentType + "\n");
			WriteUtil.closeWriter(writer);
		} catch (IOException e) {
			WriteUtil.closeWriter(writer);
		}

		File styleFile = new File(path + File.separator + "styles" + File.separator + "theme.less");
		writer = WriteUtil.getWriter(styleFile);

		if (projectDto.getMasterplateProject().getMasterplateProjectStyle() != null) {
			try {
				writer.write(projectDto.getMasterplateProject().getMasterplateProjectStyle());
				WriteUtil.closeWriter(writer);
			} catch (IOException e) {
				WriteUtil.closeWriter(writer);
			}
		}
	}

	private String resetInstructs(String str) {
		Map<String, String> instructs = new HashMap<>();
		instructs.put("\\$util.", "util.");
		instructs.put("\\$global.", "globalData.");
		instructs.put("\\$current.", "systemConfig.");

		for (String key: instructs.keySet()) {
			str = str.replaceAll(key, instructs.get(key));
		}

		return str;
	}

	private String getImports(String str) {
		Map<String, String> instructs = new HashMap<>();
		instructs.put("$util.", "import * as util from 'libs/util';");
		instructs.put("$global.", "import * as globalData from 'libs/consts';");
		instructs.put("$current.", "import * as systemConfig from './systemConfig';");

		StringBuffer result = new StringBuffer();

		for (String key: instructs.keySet()) {
			if (str.indexOf(key) != -1) {
				result.append(instructs.get(key)).append('\n');
			}
		}

		return result.toString();
	}

	//freedomenConfig.js
	private void createFreedomenConfig(String path, ProjectSelectDTO projectDto, List<PlugPO> plugs) {
		File file = new File(path + File.separator + "freedomenConfig.js");
		String fileContent =  WriteUtil.getFileContent(file);
		Writer writer = WriteUtil.getWriter(file);

		try {
			if (projectDto.getMasterplateProject() != null && projectDto.getMasterplateProject().getMasterplateProjectFreedomenConfig() != null) {
				String config = projectDto.getMasterplateProject().getMasterplateProjectFreedomenConfig();
				config = getImports(config) + fileContent + resetInstructs(config);

				writer.write(config);
			} else {
				writer.write(fileContent);
			}
			//ex-freedomen:
			for (PlugPO plug: plugs) {
				JSONArray plugCustomProps = JSONArray.parseArray(plug.getPlugCustomProps());
				StringBuffer names = new StringBuffer("[");

				if (plugCustomProps != null) {
					plugCustomProps.forEach(plugCustomProp -> {
						JSONObject jo = (JSONObject) plugCustomProp;
						/**
						 * string: 1,
						   number: 2,
						   fn: 3
						 */
						if (jo.get("type").equals(3)) {
							names.append("'" + jo.get("prop").toString() + "', ");
						}
					});

					if (names.length() > 1) {
						names.delete(names.length() - 2, names.length() - 1);
					}
				}

				names.append("]");

				writer.write("Freedomen.registerRender('" + plug.getPlugTname() + "', getCustomComponent(ExFreedomen." + plug.getPlugName() + ", " + names + "))\n");
			}

			WriteUtil.closeWriter(writer);
		} catch(IOException e) {
			WriteUtil.closeWriter(writer);
		}

	}
	//libs/consts.js
	private void createGlobalData(String path, ProjectSelectDTO projectDto) {
		if (projectDto.getMasterplateProject() == null || projectDto.getMasterplateProject().getMasterplateProjectData() == null)
			return;
		File file = new File(path + File.separator + "consts.js");
		Writer writer = WriteUtil.getWriter(file, true);

		try {
			writer.write(projectDto.getMasterplateProject().getMasterplateProjectData().replaceAll("const ", "export const "));
			WriteUtil.closeWriter(writer);
		} catch(IOException e) {
			WriteUtil.closeWriter(writer);
		}
	}

	private void createFreedomenExComponent(String path, List<PlugPO> plugs) {
		File indexFile = new File(path + File.separator + "index.js");
		Writer writer = WriteUtil.getWriter(indexFile);
		//待优化
		plugs.forEach(plug -> {
			File file = new File(path);
			CosUtil.downloadComponent(plug.getPlugUid(), file);

			File plugFile = new File(path + File.separator + plug.getPlugUid());

			if (plugFile.exists()) {
				File distFile = new File(path + File.separator + plug.getPlugUid() + File.separator + "dist");

				try {
					FileUtils.deleteDirectory(distFile);
				} catch (IOException e) {
					e.printStackTrace();
				}

				plugFile.renameTo(new File(path + File.separator + plug.getPlugName()));
			}

			try {
				writer.write("export { default as " + plug.getPlugName() + " } from './" + plug.getPlugName() + "';\n");
			} catch(IOException e) {
				WriteUtil.closeWriter(writer);
			}
		});

		WriteUtil.closeWriter(writer);
	}
	@Data
	private static class PackageLib {
		private String key;
		private String value;
	}

	/**
	 * 将plug 依赖写入package.json
	 * @param pathName
	 * @param plugs
	 */
	private void insertPackageJSON(String pathName, List<PlugPO> plugs) {
		File file = new File(pathName);
		List<PackageLib> inserts = new ArrayList<>();

		plugs.forEach(p -> {
			if (p.getPlugNpmLibs() != null) {
				String[] libs = p.getPlugNpmLibs().split(",");

				for (int i = 0; i < libs.length; i ++) {
					String[] nodeLib = libs[i].replaceAll("\"|'", "").split(":");
					if (nodeLib.length == 2) {
						PackageLib packageLib = new PackageLib();

						packageLib.setKey(nodeLib[0].trim());
						packageLib.setValue(nodeLib[1].trim());

						inserts.add(packageLib);
					}
				}
			}
		});

		if (inserts.isEmpty()) return;

		PrintWriter pw = null;
		StringBuffer sb = new StringBuffer();
		try (BufferedReader br = new BufferedReader(new FileReader(file))) {
			String line;
			for (line = br.readLine(); line != null; line = br.readLine()) {
				sb.append(line);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (pw != null) {
				pw.close();
			}
		}

		JSONObject jsonObject = JSONObject.parseObject(sb.toString(), Feature.OrderedField);
		JSONObject dependencies = jsonObject.getJSONObject("dependencies");

		inserts.forEach(insert -> {
			String mayValue = dependencies.getString(insert.getKey());
			if (mayValue == null || mayValue.compareTo(insert.getValue()) < 0) {
				dependencies.put(insert.getKey(), insert.getValue());
			}
		});

		Writer writer = WriteUtil.getWriter(file);
        try {
			writer.write(JSON.toJSONString(jsonObject, SerializerFeature.PrettyFormat ).replaceAll("\":", "\": "));
			writer.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public List<ProjectSelectDTO> selectProjects(Wrapper<ProjectPO> wrapper, boolean isSelectMasterplateProjectId) {
		List<ProjectPO> list = this.selectList(wrapper);

        Set<Integer> userIds = new HashSet<>();
        Set<Integer> projectIds = new HashSet<>();
        List<Integer> masterplateProjectIds = new ArrayList<>();

        list.forEach(el -> {
        	userIds.add(el.getUserId());
        	projectIds.add(el.getProjectId());
        	masterplateProjectIds.add(el.getMasterplateProjectId());
        });
        //pages count
        Wrapper<PagePO> pen = new EntityWrapper<>();
        pen.in("project_id", projectIds)
        .eq("page_type", 0)
        .groupBy("project_id");
        pen.setSqlSelect("project_id as projectId, count(*) as pageCounts");

    	List<Map<String, Object>> pr = pageService.selectMaps(pen);
    	Map<Integer, Long> pageCount = new HashMap<>();
    	
    	pr.forEach(el -> { 
    		pageCount.put((Integer)el.get("projectId"), (Long)el.get("pageCounts"));
    	}); 
    	
        //users 
        Wrapper<UserPO> uen = new EntityWrapper<>();
        uen.in("user_id", userIds);
        
        List<UserPO> users = userService.selectList(uen);
        //项目模板
        Wrapper<MasterplateProjectPO> en = new EntityWrapper<>();
			en.in("masterplate_project_id", masterplateProjectIds);
			if (isSelectMasterplateProjectId) {
				en.setSqlSelect("masterplate_project_id as masterplateProjectId");
			}

        List<MasterplateProjectPO> masterplateProjects = masterplateProjectService.selectList(en);
        
        return list.stream().map(el -> {
	       	 ProjectSelectDTO dto = new ProjectSelectDTO();
	       	 BeanUtil.copy(el, dto);
	       	 for (MasterplateProjectPO mp: masterplateProjects) {
	       		 if (mp.getMasterplateProjectId().equals(el.getMasterplateProjectId())) {
	       			 dto.setMasterplateProject(mp);
	       			 break;
	       		 }
	       	 } 
	       	 
	       	 if (pageCount.get(el.getProjectId()) != null) {
	       		dto.setPageCounts(pageCount.get(el.getProjectId()));
	       	 }
	       	 
	       	 for (UserPO user: users) {
	       		 if (user.getUserId() == el.getUserId()) {
	       			 dto.setUserName(user.getUserName());
	       			 dto.setUserAvatar(user.getUserAvatar());
	       		 }
	       	 }
	       	 
	       	 return dto;
        }).collect(Collectors.toList()); 
	}
	
	public ProjectSelectDTO getProjectInfo(Integer projectId) {
		ProjectPO project = new ProjectPO();
		project.setProjectId(projectId);
			
		List<ProjectSelectDTO> list = selectProjects(new EntityWrapper<>(project), false);
		if (!list.isEmpty()) {
			return list.get(0);
		}
		return null;
	}
	
	public List<PlugPO> getProjectComponents(Integer projectId) {
		ProjectPO project = this.selectById(projectId);

		PlugUsePO plugUse = new PlugUsePO();
		plugUse.setProjectId(projectId);
		plugUse.setUserId(project.getUserId());
		
		MultipleSelect ms = MultipleSelect.newInstance("${1}.plugUid, ${1}.plugName, ${1}.plugUseType, ${1}.plugCustomProps, ${1}.plugNpmLibs", plugUse, new PlugPO());
		
		List<Map<String, Object>> list = multipleService.multipleSelect(ms).getData();
		
		return list.stream().map(el -> {
			PlugPO plug = new PlugPO();
			
			plug.setPlugName(PinYinUtil.getAllPinyin(el.get("plugName").toString()));
			plug.setPlugUid(el.get("plugUid").toString());
			plug.setPlugTname(el.get("plugUseType").toString());
			if (el.get("plugCustomProps") != null) {
				plug.setPlugCustomProps(el.get("plugCustomProps").toString());
			}
			if (el.get("plugNpmLibs") != null) {
				plug.setPlugNpmLibs(el.get("plugNpmLibs").toString());
			}
			
			return plug;
		}).collect(Collectors.toList());
	}
	/**
	 * 下載項目
	 * @param down
	 * @param os
	 */
	public void downLoad(DownVo down, OutputStream os) {
	   	PagePO page = new PagePO();
	   		page.setProjectId(down.getProjectId());
   		List<NestedPage> nestedPages = pageService.nestedSelect(page);  
   		File to = getCopyFile(); 
		Map<Integer, String> pageInfo = new HashMap<>(); 
		Map<Integer, String> serviceInfo = new HashMap<>();
		Map<Integer, String> styleInfo = new HashMap<>();
	    for (PageCode pageCode: down.getPages()) {
		    pageInfo.put(pageCode.getPageId(), pageCode.getCode());
		    serviceInfo.put(pageCode.getPageId(), pageCode.getService());
		    styleInfo.put(pageCode.getPageId(), pageCode.getStyle());
		}
	    
	    File routeModule = getModuleFile(to.getAbsolutePath() + File.separator + "src" + File.separator + "routes", "modules");
	    
	    String systemConfigPath = to.getAbsolutePath() + File.separator + "src";
	    String pagePath =  to.getAbsolutePath() + File.separator + "src" + File.separator + "views";
	    String servicePath = to.getAbsolutePath() + File.separator + "src" + File.separator + "services";
	    String exFreedomenPath = to.getAbsolutePath() + File.separator + "src" + File.separator + "ex-freedomen";
	    String libPath = to.getAbsolutePath() + File.separator + "src" + File.separator + "libs";
	    List<PlugPO> plugs = getProjectComponents(down.getProjectId());
	    
	    ProjectSelectDTO projectSelect = getProjectInfo(down.getProjectId());
	    createFreedomenExComponent(exFreedomenPath, plugs);
	    insertPackageJSON(to.getAbsolutePath() + File.separator + "package.json", plugs);
	    createSystemConfig(systemConfigPath, projectSelect);
	    createGlobalData(libPath, projectSelect);
	    createFreedomenConfig(systemConfigPath, projectSelect, plugs);
	    createRoutes(routeModule, nestedPages);
	    createPages(pagePath, nestedPages, pageInfo);
	    createStyles(pagePath, nestedPages, styleInfo);
	    createServices(servicePath, nestedPages, serviceInfo);
	    
	    ZipUtils.makeZipFileModel(to, os);
	    
	    try {
			FileUtils.deleteDirectory(to);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
