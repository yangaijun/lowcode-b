package com.yaj.freedomen.business.page.service;
 
import com.alibaba.fastjson.JSON;
import com.yaj.core.util.DBHelper;
import com.yaj.freedomen.business.masterplatepage.entity.po.MasterplatePagePO;
import com.yaj.freedomen.business.masterplatepage.service.MasterplatePageService;
import com.yaj.freedomen.business.page.entity.vo.TempInfo;
import com.yaj.freedomen.business.project.entity.vo.AiCreateInfoVo;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import javax.annotation.Resource;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.yaj.common.exception.BusinessException;
import com.yaj.common.exception.BusinessExceptionErrorEnum;
import com.yaj.common.generate.TableInfo;
import com.yaj.common.threadlocal.ThreadlocalManager;
import com.yaj.core.util.BeanUtil;
import com.yaj.freedomen.business.initcode.entity.po.InitCodePO; 
import com.yaj.freedomen.business.initcode.service.InitCodeService;
import com.yaj.freedomen.business.page.entity.po.PagePO;
import com.yaj.freedomen.business.page.entity.type.ComponentType;
import com.yaj.freedomen.business.page.entity.vo.InsertPage;
import com.yaj.freedomen.business.page.entity.vo.NestedPage;
import com.yaj.freedomen.business.page.mapper.PageMapper;
import com.yaj.freedomen.business.project.entity.ElementType;
import com.yaj.freedomen.business.service.entity.po.ServicePO;
import com.yaj.freedomen.business.service.service.ServiceService;
import com.yaj.freedomen.business.user.entity.po.UserPO;
import com.yaj.freedomen.business.user.service.UserService;
import com.yaj.freedomen.utils.PinYinUtil;
import org.springframework.web.multipart.MultipartFile;

/*
 * @Description: 页面
 * @date: 2021-04-15
 */
@Service
public class PageService extends ServiceImpl<PageMapper, PagePO> { 
    @Resource
    InitCodeService initCodeService;
    @Resource
    ServiceService serviceService;
	@Resource
	MasterplatePageService masterplatePageService;
    @Resource
    UserService userService;
	private static Integer maxTableNotScrollChildrenLength = 7;

	private static Integer tableColumnDefaultWidth = 150;

	private static String useSafeString(String ...params) {
		String result = "";
		for (String param: params) {
			if (param != null && !param.equals("")) {
				result = param;
				break;
			}
		}

		result = result.replaceAll("[\\r\\n\\s\"'-<>$%^*&#@`]", "");

		if (result.length() > 15) {
			result = result.substring(0, 15);
		}

		return result;
	}

    private ElementType getElementType(TableInfo tableInfo) {
		ElementType elementType = new ElementType();

		switch (tableInfo.getDataType()) {
			case "int":
			case "float":
			case "bigint":
				if (tableInfo.getColumnNameWithCamelCase().endsWith("Id")) {
					elementType.setDataType("select@w200");
					elementType.setOriginType("select");
				} else {
					elementType.setDataType("inputnumber@w200");
					elementType.setOriginType("inputnumber");
				}
				break;
			case "boolean":
				elementType.setDataType("switch");
				elementType.setOriginType("switch");
				break;
			case "date":
			case "datetime":
			case "timestamp":
				elementType.setDataType("date@w200");
				elementType.setOriginType("date");
				break;
			case "text":
				elementType.setDataType("input-area");
				elementType.setOriginType("input");
				break;
			default:
				if (tableInfo.getColumnNameWithCamelCase().indexOf("file") > 0
						|| tableInfo.getColumnNameWithCamelCase().indexOf("img") > 0
						|| tableInfo.getColumnNameWithCamelCase().indexOf("image") > 0
						|| tableInfo.getColumnNameWithCamelCase().indexOf("upload") > 0
				) {
					elementType.setDataType("upload");
					elementType.setOriginType("upload");
				} else {
					elementType.setDataType("input");
					elementType.setOriginType("input");
				}
			break;
		}

    	return elementType;
    }
    
    private void setPlaceholder(Map<String, Object> data, String type, String label) {
    	if (label == null) {
    		label= "";
    	}

		data.put("placeholder", (Arrays.asList("select", "date").contains(type) ? "请选择" : "请输入") + label);
    }
    
    private JSONObject findObj(JSONArray jsonArray, String typeName) {
    	if (jsonArray == null) return null;
    	
    	for (Object o: jsonArray) {
			JSONObject jo = (JSONObject) o;
			if (jo.get("type").equals(typeName)) {
				return jo;
			}
			JSONArray children = jo.getJSONArray(ComponentType.children);
			if (children != null) {
				JSONObject result = findObj(children, typeName);
				if (result != null) {
					return result;
				}
			}
    	}

    	return null;
    }

    private JSONArray getSearchChildren(List<TableInfo> tableInfoList) {
    	List<Map<String, Object>> columns = new ArrayList<>();
    	for (TableInfo tableInfo : tableInfoList) {
    		Map<String, Object> column = new HashMap<>();
    		ElementType type = getElementType(tableInfo);
    		column.put("type", type.getOriginType());
	    		Map<String, Object> data = new HashMap<>();
	    		data.put("prop", tableInfo.getColumnNameWithCamelCase());
	    		data.put("type", type.getDataType());
	    		setPlaceholder(data, type.getOriginType(), useSafeString(tableInfo.getColumnComment(), tableInfo.getColumnNameWithCamelCase()));
	    		data.put("label", useSafeString(tableInfo.getColumnComment(), tableInfo.getColumnNameWithCamelCase()));

    		column.put("data", data);

    		columns.add(column);
    	}

		return JSONArray.parseArray(JSON.toJSONString(columns));
    }
    
    private JSONArray getFormChildren(List<TableInfo> tableInfos, Integer itemSpan) {
    	List<Map<String, Object>> columns = new ArrayList<>();
    	for (TableInfo tableInfo : tableInfos) {
    		Map<String, Object> column = new HashMap<>();
    		ElementType type = getElementType(tableInfo);
    		column.put("type", type.getOriginType());
	    		Map<String, Object> data = new HashMap<>();
	    		data.put("prop", tableInfo.getColumnNameWithCamelCase());
	    		data.put("type", type.getDataType());
	    		setPlaceholder(data, type.getOriginType(), useSafeString(tableInfo.getColumnComment(), tableInfo.getColumnNameWithCamelCase()));
	    		data.put("label", useSafeString(tableInfo.getColumnComment(), tableInfo.getColumnNameWithCamelCase()));

				if (tableInfo.getNullAble() != null && !tableInfo.getNullAble()) {
					data.put("rule", "must");
				}
				if (itemSpan != null) {
					data.put("span", itemSpan);
				}
    		column.put("data", data);

    		columns.add(column);
    	}

		return JSONArray.parseArray(JSON.toJSONString(columns));
    }
    
    private JSONArray getTableChildren(List<TableInfo> tableInfoList, Integer width) {
    	List<Map<String, Object>> columns = new ArrayList<>();
    	for (TableInfo tableInfo : tableInfoList) {
			ElementType type = getElementType(tableInfo);
    		Map<String, Object> column = new HashMap<>();
    		column.put("type", "text");
	    		Map<String, Object> data = new HashMap<>();
	    		data.put("prop", tableInfo.getColumnNameWithCamelCase());
	    		data.put("type", "text");
	    		data.put("label", useSafeString(tableInfo.getColumnComment(), tableInfo.getColumnNameWithCamelCase()));
				if (tableInfoList.size() > maxTableNotScrollChildrenLength && width != null) {
					data.put("width", width);
				}
				if (type.getOriginType().equals("date") || type.getOriginType().equals("time")) {
					data.put("filter", "yyyy-MM-dd hh:mm:ss");
				}
    		column.put("data", data);

    		columns.add(column);
    	}

		return JSONArray.parseArray(JSON.toJSONString(columns));
    }
    
    private void setChildren(JSONObject jo, JSONArray list) {
		if (jo == null) return;

		JSONArray children = getOrPutJsonArray(jo, ComponentType.children);
    	if (children != null) {
    		for (int i = 0; i < list.size(); i ++) {
				children.add(i, list.get(i));
			}
    	}
    }

    public PagePO getPageByMasterplateId(Integer masterplatePageId) {
    	Wrapper<PagePO> en = new EntityWrapper<>();
		en.eq("masterplate_page_id", masterplatePageId); 
		
		List<PagePO> list = this.selectList(en);
		if (!list.isEmpty()) {
			return list.get(0);
		} 
		
		return  null; 
    }

	private static JSONArray getOrPutJsonArray(JSONObject json, String key) {
		if (json.getJSONArray(key) == null) {
			json.put(key, new JSONArray());
		}
		return json.getJSONArray(key);
	}

	private static JSONObject getOrPutJsonObject(JSONObject json, String key) {
		if (json == null) return null;

		if (json.getJSONObject(key) == null) {
			json.put(key, new JSONObject());
		}
		return json.getJSONObject(key);
	}
	//设置JSONObject的值 为 key 以 .分割 如 a.b.c  = 1  {a: {b: { c: 1, ...}}}, 如果有值并不覆盖
	private static void setObjectValue(JSONObject obj, String key, Object value) {
		String[] keys = key.split("\\.");
		String overKey = keys[keys.length - 1];

		if (keys.length > 1) {
			for (int i = 0; i < keys.length - 1; i++) {
				obj = getOrPutJsonObject(obj, keys[i]);
			}
		}
		if (obj.get(overKey) == null) {
			obj.put(overKey, value);
		}
	}
	private static <T>T getObjectValue(JSONObject obj, String key, Class<T> clazz) {
		String[] keys = key.split("\\.");
		String overKey = keys[keys.length - 1];

		if (keys.length > 1) {
			for (int i = 0; i < keys.length - 1; i++) {
				obj = getOrPutJsonObject(obj, keys[i]);
			}
		}

		return obj.getObject(overKey, clazz);
	}

	private void setFormInfo(JSONArray ja, String type, List<TableInfo> formInfo) {
		JSONObject form = findObj(ja, type);

		if (form != null) {
			JSONObject row = findObj(getOrPutJsonArray(form, ComponentType.children), ComponentType.row);
			Integer itemSpan = null;

			if (row != null){
				form = row;
				itemSpan = getObjectValue(row, "data.~itemSpan", Integer.class);
			}

			setChildren(form, getFormChildren(formInfo, itemSpan));
		}
	}
    
    private String makeDataList(List<TableInfo> searchInfo, List<TableInfo> tableInfo, List<TableInfo> formInfo, PagePO masterplatePage) {
    	if (masterplatePage.getPageDataList() == null)
    		return null;
    	
		JSONArray ja = JSONArray.parseArray(masterplatePage.getPageDataList());

		setChildren(findObj(ja, ComponentType.search), getSearchChildren(searchInfo));

		JSONObject table = findObj(ja, ComponentType.table);
		if (table != null) {
			Integer width = getObjectValue(table, "data.~itemWidth", Integer.class);

			if (tableInfo.size() > maxTableNotScrollChildrenLength) {
				setObjectValue(table, "data.config.scroll.x", 680);
				setObjectValue(table, "data.~isVertical", true);
				if (width == null) {
					width = tableColumnDefaultWidth;
				}
				//操作没加 fixed，自动添加
				JSONArray tableChildren = getOrPutJsonArray(table, ComponentType.children);
				JSONObject tableOperation = findObj(tableChildren, ComponentType.space);
				if (tableOperation != null) {
					setObjectValue(tableOperation, "data.width", tableColumnDefaultWidth);
					setObjectValue(tableOperation, "data.config.fixed", "right");
				}
			}

			setChildren(table, getTableChildren(tableInfo, width));
		}
		//弹窗表单
		setFormInfo(ja, ComponentType.fdialog, formInfo);
		//弹窗侧滑
		setFormInfo(ja, ComponentType.fdrawer, formInfo);
		//基本表单
		setFormInfo(ja, ComponentType.form, formInfo);

		return ja.toJSONString();
     
    }
	private JSONObject getMasterplatePageTmp(String value) {
		if (value == null) return null;

		try {
			return JSONObject.parseObject(value);
		} catch (Exception e) {
			e.printStackTrace();

			return null;
		}
	}

    public void insertOrUpdatePage(InsertPage insertPage) {
    	PagePO page = new PagePO();
    	BeanUtil.copy(insertPage, page);
    	 
    	if (page.getPageId() != null) {
    		this.updateById(page);
    	} else { 
    		UserPO user = userService.selectById(ThreadlocalManager.getThreadContext().getUserId());
    		PagePO p = new PagePO();
    			p.setProjectId(insertPage.getProjectId()); 
    			
    		if (user.getUserMaxPage() != null && user.getUserMaxPage() <= this.selectCount(new EntityWrapper<>(p))) {
    			throw new BusinessException(BusinessExceptionErrorEnum.USER_PROJECT_CREATE_PAGE_MAX);
    		}

			PagePO masterplatePage = null;
			JSONObject pageTmp = null;

    		if (insertPage.getMasterplatePageId() != null) {
				masterplatePage = getPageByMasterplateId(insertPage.getMasterplatePageId());

				MasterplatePagePO mp = masterplatePageService.selectById(page.getMasterplatePageId());
				pageTmp = getMasterplatePageTmp(mp.getMasterplatePageTmp());

			}

    		genPage(insertPage.getTableInfos(), page, masterplatePage, pageTmp, null);

            this.insert(page);  
            
            if (masterplatePage != null) {
            	List<PagePO> list = new ArrayList<>();
            		list.add(page);
            	genInitCodes(list, masterplatePage.getPageId(), pageTmp);
            	genServices(list, masterplatePage.getPageId(), pageTmp, false);
            }
    	} 
    }

	private String exchangeTmp(String value, JSONObject temp) {
		if (value == null)
			return null;
		if (temp == null)
			return value;

		for (String key : temp.keySet()) {
			value = value.replaceAll("\\[\\$temp." +key+"\\]", temp.getString(key))
					.replaceAll("\\$temp." +key, temp.getString(key));
		}

		return  value;
	}

	public TempInfo getTempInfo(Integer masterplatePageId, Integer pageId) {
		TempInfo tempInfo = new TempInfo();
		MasterplatePagePO masterplatePage = masterplatePageService.selectById(masterplatePageId);
		tempInfo.setMasterplatePage(masterplatePage);
		PagePO page = this.selectById(pageId);
		tempInfo.setPage(page);

		return  tempInfo;
	}
	//生成頁面
	public PagePO getGenPage(AiCreateInfoVo.GenInfo info, PagePO modelPage, JSONObject pageTmp, Integer projectId) {
		PagePO page = new PagePO();
		page.setProjectId(projectId);
		page.setPageType(0);

		page.setPageName(info.getPageName());
		page.setPageRouter(info.getFileName());

		page.setPageLess(modelPage.getPageLess());
		page.setPageClass(modelPage.getPageClass());
		page.setPageFileName(info.getFileName());
		page.setPageStyle(modelPage.getPageStyle());

		String dataList = makeDataList(info.getSearch(), info.getShow(), info.getInsertOrUpdate(), modelPage);
		page.setPageDataList(exchangeTmp(dataList, pageTmp));

		return  page;
	}
	//通過AI自動生成多張頁面
	public List<PagePO> aiGenPages(AiCreateInfoVo aiCreateInfoVo, Integer projectId) {
		PagePO po = this.selectById(aiCreateInfoVo.getPageId());
		MasterplatePagePO mp = masterplatePageService.selectById(aiCreateInfoVo.getMasterplatePageId());
		JSONObject pageTmp = getMasterplatePageTmp(mp.getMasterplatePageTmp());
		List<PagePO> resultList = new ArrayList<>();

		for (AiCreateInfoVo.GenInfo item: aiCreateInfoVo.getGenInfoList()) {
			resultList.add(getGenPage(item, po, pageTmp, projectId));
		}

		if (!resultList.isEmpty()) {
			this.insertBatch(resultList);

			genInitCodes(resultList, aiCreateInfoVo.getPageId(), pageTmp);
			genServices(resultList, aiCreateInfoVo.getPageId(), pageTmp, false);
		}

		return resultList;
	}
    //根据模版生成页面
    public void genPage(List<TableInfo> tableInfos, PagePO page, PagePO masterplatePage, JSONObject pageTmp, String colFilter) {
    	if (tableInfos == null) tableInfos = new ArrayList<>(); 
    	
    	if (!tableInfos.isEmpty()) {
    		TableInfo tableInfo = tableInfos.get(0);
    		if (page.getPageName() == null) {
    			if (tableInfo.getTableComment() == null || tableInfo.getTableComment().trim().equals("")) {
            		page.setPageName(tableInfo.getTableName());
            	} else {
            		page.setPageName(tableInfo.getTableComment());
            	}
    		} 
    	}
    	if (page.getPageFileName() == null || page.getPageFileName().trim().equals("")) {
    		page.setPageFileName(PinYinUtil.getAllPinyin(page.getPageName()));
    	}
    	if (page.getPageRouter() == null || page.getPageRouter().trim().equals("")) {
			page.setPageRouter(page.getPageFileName());
		} 

    	if (masterplatePage == null)
    		return;
    	
    	if (colFilter != null) {
    		final List<String> colFilters = Arrays.asList(colFilter.split(",")); 
    		tableInfos = tableInfos.stream().filter(ti -> {
        		for (String key : colFilters) {
        			if (ti.getColumnNameWithCamelCase().toLowerCase().indexOf(key) != -1 
        					|| ti.getColumnName().toLowerCase().indexOf(key) != -1) {
        				return false;
        			}
        		}
        		return true;
        	}).collect(Collectors.toList());
    	}

		String dataList = makeDataList(tableInfos, tableInfos, tableInfos, masterplatePage);
			dataList = exchangeTmp(dataList, pageTmp) ;
		page.setPageDataList(dataList);
    	page.setMasterplatePageId(null);
    }
	public void genInitCodes(List<PagePO> list, Integer oldPageId, JSONObject pageTemp) {
		Wrapper<InitCodePO> en = new EntityWrapper<>();
			en.eq("page_id", oldPageId);
		List<InitCodePO> masterplateInitCodes = initCodeService.selectList(en);
		List<InitCodePO> initCodeList = new ArrayList<>();

		for (PagePO page: list) {
			for (InitCodePO icode: masterplateInitCodes) {
				InitCodePO item = new InitCodePO();
				item.setPageId(page.getPageId());

				item.setInitCodeName(icode.getInitCodeName());
				item.setInitCodeType(icode.getInitCodeType());
				item.setInitCodeEffect(exchangeTmp(icode.getInitCodeEffect(), pageTemp));
				item.setInitCodeValue(exchangeTmp(icode.getInitCodeValue(), pageTemp));

				initCodeList.add(item);
			}

		}

		if (!initCodeList.isEmpty()) {
			initCodeService.insertBatch(initCodeList);
		}
	}

	private String toServiceUrl(PagePO page, String url) {
    	int startIndex = url.indexOf("${"), endIndex = url.indexOf("}");
    	
    	if (startIndex < endIndex) {
    		StringBuffer sb = new StringBuffer();
    		if (startIndex != 0) {
    			sb.append(url.substring(0, startIndex));
    		} 
    		String subString = url.substring(startIndex + 2, endIndex);
    		if (subString.equals("fileName")) {
    			sb.append(page.getPageFileName()); 
    		} else if (subString.equals("fileName.toLower")) {
    			sb.append(page.getPageFileName().toLowerCase());
    		} else if (subString.equals("fileName.toUpper")) {
    			sb.append(page.getPageFileName().toUpperCase());
    		} else {
    			sb.append(subString);
    		}
    		sb.append(url.substring(endIndex + 1));
    		
    		return sb.toString();
    	}  
    	return url;
    }
	/**
	 *
	 * @param list 要生成services的页面
	 * @param oldPageId, 模版页面的 id, 将此页面的第个service 复制到 list的每个页面中
	 * @param pageTemp
	 * @param isCopy
	 */
	public void genServices(List<PagePO> list, Integer oldPageId, JSONObject pageTemp, Boolean isCopy) {
		Wrapper<ServicePO> en = new EntityWrapper<>();
		en.eq("page_id", oldPageId);
		List<ServicePO> masterplateServices = serviceService.selectList(en);
		List<ServicePO> serviceList = new ArrayList<>();

		for (PagePO page: list) {
			for (ServicePO service: masterplateServices) {
				ServicePO item = new ServicePO();
				item.setPageId(page.getPageId());

				item.setServiceMethod(service.getServiceMethod());
				item.setServiceName(service.getServiceName());
				item.setServiceComment(service.getServiceComment());
				if (isCopy) {
					item.setServiceUrl(service.getServiceUrl());
				} else {
					item.setServiceUrl(exchangeTmp(toServiceUrl(page, service.getServiceUrl()), pageTemp));
				}

				serviceList.add(item);
			}
		}

		if (!serviceList.isEmpty()) {
			serviceService.insertBatch(serviceList);
		}
	}
    
    private void sortPage(List<NestedPage> pages) {
    	Collections.sort(pages, new Comparator<NestedPage>() { 
			@Override
			public int compare(NestedPage o1, NestedPage o2) {
				Integer s1 = o1.getPageSort();
				Integer s2 = o2.getPageSort();
				if (s1 == null) {
					s1 = 0;
				}
				if (s2 == null) {
					s2 = 0;
				} 
				return s1 - s2;
			}
		});
    }
    //暂不考虑性能
    private void findChildren(List<NestedPage> backPages, List<PagePO> pages) {
    	for (NestedPage nestedPage: backPages) {
    		List<NestedPage> subNestedPage = new ArrayList<>();
    		for (PagePO p: pages) {
    			if (p.getParentId() != null && p.getParentId().equals(nestedPage.getPageId())) {
        			NestedPage backPage = new NestedPage();
        			BeanUtil.copy(p, backPage);
        			subNestedPage.add(backPage);
        		}
        	} 
    		sortPage(subNestedPage); 
    		nestedPage.setChildren(subNestedPage);
    		findChildren(subNestedPage, pages);
    	}
    }
	private String javaTypeToSqlType(String typeName) {
		String name = "varchar";
		switch (typeName) {
			case "Integer":
				name = "int";
				break;
			case "Date":
				name = "datetime";
				break;
		}
		return name;
	}
	private List<TableInfo> parseJava(List<String> lines) {
		List<TableInfo> tableInfos = new ArrayList<>();
		for (int i = 0; i < lines.size(); i ++) {
			String line = lines.get(i).trim();
			String[] lineInfo = line.split(" ");
			if (lineInfo.length == 3 && line.endsWith(";") && line.startsWith("private")) {
				TableInfo tableInfo = new TableInfo();
				String name = lineInfo[2].substring(0, lineInfo[2].length() - 1).trim();
				tableInfo.setColumnNameWithCamelCase(name);
				tableInfo.setColumnName(name);
				tableInfo.setDataType(javaTypeToSqlType(lineInfo[1]));

				if (i - 1 >= 0) {
					String comment = lines.get(i - 1).trim();
					if (comment.startsWith("//")) {
						tableInfo.setColumnComment(comment.substring(2));
					} else {
						tableInfo.setColumnComment(name);
					}
				} else {
					tableInfo.setColumnComment(name);
				}
				tableInfos.add(tableInfo);
			}
		}

		return tableInfos.isEmpty() ? null : tableInfos;
	}

	private String TxtTypeToSqlType(String typeName) {
		String name = "varchar";
		switch (typeName) {
			case "number":
				name = "int";
				break;
			case "date":
				name = "datetime";
				break;
		}
		return name;
	}

	private List<TableInfo> parseTxt(List<String> lines) {
		List<TableInfo> tableInfos = new ArrayList<>();
		for (int i = 0; i < lines.size(); i ++) {
			String line = lines.get(i).trim();
			String[] lineInfo = line.split(" ");
			if (lineInfo.length >= 2) {
				TableInfo tableInfo = new TableInfo();
				tableInfo.setColumnComment(lineInfo[0].trim());
				tableInfo.setColumnNameWithCamelCase(lineInfo[1].trim());
				tableInfo.setColumnName(lineInfo[1].trim());
				if (lineInfo.length >=3) {
					tableInfo.setDataType(TxtTypeToSqlType(lineInfo[2]));
				} else {
					tableInfo.setDataType("varchar");
				}

				tableInfos.add(tableInfo);
			}
		}

		return tableInfos.isEmpty() ? null : tableInfos;
	}

	private List<TableInfo> parseSql(List<String> lines) {
		for (int i = 0; i < lines.size(); i ++) {
			String line = lines.get(i);

			if (line.toUpperCase().contains("CREATE TABLE")) {
				StringBuffer sb = new StringBuffer();

				while (!line.startsWith(")") && i + 1 < lines.size()) {
					sb.append(line).append('\n');
					line = lines.get(++ i);
				}
				sb.append(line);
				return DBHelper.parserTableInfo(sb.toString());
			}
		}

		return null;
	}
	public List<TableInfo>  parseGenerateFile(MultipartFile file) throws IOException {
		String ext = "";
		int ofindex = file.getOriginalFilename().lastIndexOf(".");

		if (ofindex > 0) {
			ext = file.getOriginalFilename().substring(ofindex).toLowerCase();
		} else {
			throw new BusinessException(BusinessExceptionErrorEnum.UPLOAD_FILE_TYPE_ERROR);
		}

		InputStreamReader isr = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
		BufferedReader reader = new BufferedReader(isr);
		List<String> lines = reader.lines().collect(Collectors.toList());
		reader.close();

		if (ext.equals(".java")) {
			return parseJava(lines);
		}  else if (ext.equals(".sql")) {
			return parseSql(lines);
		} else {
			return parseTxt(lines);
		}
	}
    public List<NestedPage> nestedSelect(PagePO page) { 
    	Wrapper<PagePO> wrapper = new EntityWrapper<>(page);
    	//避免查询出来的数据量过大，因为有无用数据且为longtext
    	wrapper.setSqlSelect("page_id AS pageId,masterplate_page_id AS masterplatePageId,parent_id AS parentId,project_id AS projectId,page_name AS pageName,page_file_name AS pageFileName,page_roles AS pageRoles,page_hidden AS pageHidden,page_router AS pageRouter,page_sort AS pageSort,page_type AS pageType");
    	
    	List<PagePO> pages = this.selectList(wrapper);
    	List<NestedPage> backPages = new ArrayList<>();
    	for (PagePO p: pages) {
    		//更新过，移动过的parentId是 -1 
    		if (p.getParentId() == null || p.getParentId().equals(-1)) {
    			NestedPage backPage = new NestedPage();
    			BeanUtil.copy(p, backPage);
    			backPages.add(backPage);
    		}
    	}
    	findChildren(backPages, pages);
    	sortPage(backPages);
    	return  backPages;
    }
    private List<PagePO> setChildrenParentId(List<NestedPage> nestedPages, Integer parentId) {
    	List<PagePO> pages = new ArrayList<>();
    	int sort = 1;
    	for (NestedPage nestedPage: nestedPages) {
    		PagePO page = new PagePO();

			page.setPageId(nestedPage.getPageId());
			//只更新这两个字段
			page.setParentId(parentId);
			page.setPageSort(sort ++);
			System.out.println("sort:" + sort);

			pages.add(page);

    		if (nestedPage.getChildren() != null) {
    			pages.addAll(setChildrenParentId(nestedPage.getChildren(), nestedPage.getPageId()));
    		}
    	}
    	return pages;
    } 
    
    public void updateByNested(List<NestedPage> nestedPages) {
		//更新过，移动过的parentId是 -1 ,想用空的，但是不好更新，如果有来生再改吧
    	List<PagePO> pages = setChildrenParentId(nestedPages, -1);

    	this.updateBatchById(pages, 200);
    }
    
    private List<Integer> findIds(List<NestedPage> nestedPages) {
    	List<Integer> ids = new ArrayList<>();
    	for (NestedPage nestedPage: nestedPages) {
    		ids.add(nestedPage.getPageId());
    		if (nestedPage.getChildren() != null) {
    			ids.addAll(findIds(nestedPage.getChildren()));
    		}
    	}
    	return  ids;
    } 
    
    public void deleteByNested(List<NestedPage> nestedPages) {
    	List<Integer> ids = new ArrayList<>();
    	for (NestedPage nestedPage: nestedPages) {
    		ids.add(nestedPage.getPageId());
    		if (nestedPage.getChildren() != null) {
    			ids.addAll(findIds(nestedPage.getChildren()));
    		}
    	} 
    	this.deleteBatchIds(ids);
    }
}
