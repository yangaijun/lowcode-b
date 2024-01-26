package com.yaj.freedomen.business.masterplatepage.controller;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.yaj.common.exception.BusinessException;
import com.yaj.common.exception.BusinessExceptionErrorEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.*;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.yaj.common.threadlocal.ThreadlocalManager;
import com.yaj.core.util.BeanUtil;
import com.yaj.freedomen.business.masterplatepage.entity.dto.MasterplatePageSelectDTO;
import com.yaj.freedomen.business.masterplatepage.entity.po.MasterplatePagePO;
import com.yaj.freedomen.business.masterplatepage.entity.vo.InsertMasterplatePageVo;
import com.yaj.freedomen.business.masterplatepage.service.MasterplatePageService;
import com.yaj.freedomen.business.page.entity.po.PagePO;
import com.yaj.freedomen.business.page.service.PageService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
 

@Api(value="")
@EnableAutoConfiguration
@RestController
@RequestMapping(value="/MasterplatePage")
public class MasterPlatePageController {
	@Autowired
	private MasterplatePageService masterplatePageService;
	@Autowired
	private PageService pageService;

	//返回带pageId 的 MasterplatePage, 如果是copy的话
	private Map<String, Object> myInsertOrUpdate(InsertMasterplatePageVo insertMasterplatePageVo) {
		boolean isCopy = insertMasterplatePageVo.getInsertType() != null && insertMasterplatePageVo.getInsertType().equals("copy");
		if (!isCopy && insertMasterplatePageVo.getUserId() != null && !insertMasterplatePageVo.getUserId().equals(ThreadlocalManager.getThreadContext().getUserId())) {
			throw new BusinessException(BusinessExceptionErrorEnum.NO_ACCESS_AUTH);
		}

		insertMasterplatePageVo.setUserId(ThreadlocalManager.getThreadContext().getUserId());

		MasterplatePagePO masterplate = new MasterplatePagePO();
		BeanUtil.copy(insertMasterplatePageVo, masterplate);
		if (isCopy) {
			masterplate.setMasterplatePageId(null);
			masterplate.setCreatedAt(null);
		}
		masterplatePageService.insertOrUpdate(masterplate);

		PagePO newPage = null;
		Integer originId = null;
		if (isCopy) {
			PagePO page = pageService.getPageByMasterplateId(insertMasterplatePageVo.getMasterplatePageId());
			//copy page
			newPage = new PagePO();
			newPage.setPageDataList(page.getPageDataList());
			newPage.setMasterplatePageId(masterplate.getMasterplatePageId());
			originId = page.getPageId();
		} else if (insertMasterplatePageVo.getMasterplatePageId() == null) {
			newPage = new PagePO();
			newPage.setMasterplatePageId(masterplate.getMasterplatePageId());
		}

		if (newPage != null) {
			pageService.insert(newPage);
			if (originId != null) {
				pageService.genInitCodes(Arrays.asList(newPage), originId, null);
				pageService.genServices(Arrays.asList(newPage), originId, null, true);
			}
		}
		//设置master
		if (insertMasterplatePageVo.getMasterplatePageMaster() != null && insertMasterplatePageVo.getMasterplatePageMaster().equals(1)) {

			Wrapper<MasterplatePagePO> en = new EntityWrapper<>();
			en.eq("user_id", ThreadlocalManager.getThreadContext().getUserId());
			List<MasterplatePagePO> list = masterplatePageService.selectList(en);

			List<MasterplatePagePO> nextLists = list.stream().filter(
					el -> !el.getMasterplatePageId().equals(masterplate.getMasterplatePageId())
			).collect(Collectors.toList());

			nextLists.forEach(el -> el.setMasterplatePageMaster(0));

			if (!nextLists.isEmpty()) {
				masterplatePageService.updateBatchById(nextLists);
			}
		}
		Map<String, Object> resultMap = cn.hutool.core.bean.BeanUtil.beanToMap(masterplate);
		if (newPage != null) {
		 	resultMap.put("pageId", newPage.getPageId());
		}
		return resultMap;
	}
	/**
	 *复制一个项目母版
	 **/

	@RequestMapping(value="/copyDefault", method=RequestMethod.POST)
	public Object copyDefault() {
		Wrapper<MasterplatePagePO> en = new EntityWrapper<>();
		en.eq("masterplate_page_type", "sys");

		List<MasterplatePagePO> list = masterplatePageService.selectList(en);

		if (!list.isEmpty()) {
			MasterplatePagePO copy = list.get(0);

			InsertMasterplatePageVo ivo = new InsertMasterplatePageVo();

			ivo.setInsertType("copy");
			ivo.setMasterplatePageType("private");
			ivo.setMasterplatePageId(copy.getMasterplatePageId());
			ivo.setMasterplatePageTmp(copy.getMasterplatePageTmp());

			SimpleDateFormat formatter= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date date = new Date();
			String timeString = formatter.format(date);

			ivo.setMasterplatePageName("AI复制系统母版");
			ivo.setMasterplatePageDes("created by AI at " + timeString);

			return myInsertOrUpdate(ivo);
		}

		return null;
	}
	/**
	 *添加 
	 **/
	@ApiOperation(value="添加",notes="添加")
	@RequestMapping(value="/insertOrUpdate", method=RequestMethod.POST)
    public Object insertOrUpdate(@RequestBody InsertMasterplatePageVo insertMasterplatePageVo) {
		myInsertOrUpdate(insertMasterplatePageVo);

		return true;
    }

	private Object selectByWrapper(Wrapper<MasterplatePagePO> en) {
		List<MasterplatePagePO> list = masterplatePageService.selectList(en);
		//取出id
		List<Integer> ids = list.stream().map(el -> {
			return el.getMasterplatePageId();
		}).collect(Collectors.toList());
		//找出相关页面
		Wrapper<PagePO> pageEn = new EntityWrapper<>();
		pageEn.in("masterplate_page_id", ids);
		List<PagePO> pages = pageService.selectList(pageEn);

		return list.stream().map(el -> {
			MasterplatePageSelectDTO dto = new MasterplatePageSelectDTO();
			BeanUtil.copy(el, dto);
			for (PagePO page: pages) {
				if (page.getMasterplatePageId().equals(el.getMasterplatePageId())) {
					dto.setPageId(page.getPageId());
					break;
				}
			}
			return dto;
		}).filter(el -> el.getPageId() != null).collect(Collectors.toList());
	}
	/**
	 *添加 
	 **/
	@ApiOperation(value="查询",notes="查询")
	@RequestMapping(value="/select", method=RequestMethod.POST)
    public Object select(@RequestBody MasterplatePagePO masterplate) {  
		 Wrapper<MasterplatePagePO> en = new EntityWrapper<>(masterplate);

		 en.orderBy("created_at DESC");
		 return selectByWrapper(en);
    }
	/**
	 *添加
	 **/
	@ApiOperation(value="查询自己的已经系统的",notes="查询自己的已经系统的")
	@RequestMapping(value="/selectSelf", method=RequestMethod.POST)
	public Object selectSelf(@RequestBody MasterplatePagePO masterplate) {
		Wrapper<MasterplatePagePO> en = new EntityWrapper<>(masterplate);

		en.orNew()
			.eq("user_id", ThreadlocalManager.getThreadContext().getUserId())
			.or()
			.eq("masterplate_page_type", "sys");

		en.orderBy("masterplate_page_type DESC, created_at DESC");

		return selectByWrapper(en);
	}
	/**
	 *缺省id 
	 **/
	@ApiOperation(value="缺省id",notes="缺省id")
	@RequestMapping(value="/defaultId", method=RequestMethod.POST)
    public Object defaultId() {  
		 MasterplatePagePO masterplate = new MasterplatePagePO();
		 masterplate.setUserId(ThreadlocalManager.getThreadContext().getUserId());
		 //應該有userId
		 Wrapper<MasterplatePagePO> en = new EntityWrapper<>(masterplate);

		 List<MasterplatePagePO> list = masterplatePageService.selectList(en);
		  
		 List<MasterplatePagePO> nexts = list.stream().filter(el -> el.getMasterplatePageMaster().equals(1)).collect(Collectors.toList());
		 if (!nexts.isEmpty()) {
			 return  nexts.get(0).getMasterplatePageId();
		 } else if (!list.isEmpty()) {
			 return list.get(0).getMasterplatePageId();
		 } else {
			 return -1;
		 }
    }

	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/selectById/{masterplatePageId}", method = RequestMethod.POST)
	public Object selectById(@PathVariable Integer masterplatePageId) {
		if (masterplatePageId != null) {
			return masterplatePageService.selectById(masterplatePageId);
		}

		return -1;
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
    public Object delete(@RequestBody MasterplatePagePO masterplate) {
		if (masterplate.getMasterplatePageId() != null) {
			return masterplatePageService.deleteById(masterplate.getMasterplatePageId());  
		}
		return -1;
    } 
}
