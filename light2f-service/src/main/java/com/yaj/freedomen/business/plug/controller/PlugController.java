package com.yaj.freedomen.business.plug.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.yaj.common.cos.CosUtil;
import com.yaj.common.multipleselect.MultipleResult;
import com.yaj.common.multipleselect.MultipleSelect;
import com.yaj.common.multipleselect.service.MultipleService;
import com.yaj.common.threadlocal.ThreadlocalManager;
import com.yaj.core.util.BeanUtil;
import com.yaj.freedomen.business.componentpropdoc.entity.po.ComponentPropDocPO;
import com.yaj.freedomen.business.componentpropdoc.service.ComponentPropDocService;
import com.yaj.freedomen.business.plug.entity.po.PlugPO;
import com.yaj.freedomen.business.plug.entity.vo.PlugInsertVO;
import com.yaj.freedomen.business.plug.entity.vo.SearchEntity;
import com.yaj.freedomen.business.plug.service.PlugService;
import com.yaj.freedomen.business.plugsame.entity.po.PlugSamePO;
import com.yaj.freedomen.business.plugsame.service.PlugSameService;
import com.yaj.freedomen.business.pluguse.entity.po.PlugUsePO;
import com.yaj.freedomen.business.user.entity.po.UserPO;
import com.yaj.freedomen.config.SystemData;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(value="")
@EnableAutoConfiguration
@RestController
@RequestMapping(value="/Plug")
public class PlugController {
	@Autowired
	private PlugService plugService;
	 
	@Autowired
	private MultipleService multipleService; 
	
	@Autowired
	private PlugSameService plugSameService;
	
	@Autowired
	private ComponentPropDocService componentPropDocService;  
    /**
	 *添加或修改
	 **/
    @ApiOperation(value="添加或升级",notes="添加或升级")
	@RequestMapping(value="/insertOrUpdate", method=RequestMethod.POST)
    public Object insert(
    		@RequestBody PlugInsertVO plugVO) {
    	
    	PlugPO plug = new PlugPO();
    	
    	BeanUtil.copy(plugVO, plug);
    	
    	if (plug.getUserId() == null) {
    		plug.setUserId(ThreadlocalManager.getThreadContext().getUserId());
    	}
    	
    	if (plug.getPlugVersion() == null) {
    		plug.setPlugVersion(1);
    	}
    	
    	if (plug.getPlugId() == null) {
    		PlugSamePO ps = new PlugSamePO(); 
    			ps.setCreatedAt(new Date());
    		plugSameService.insert(ps);
    		
    		plug.setPlugSameId(ps.getPlugSameId());
    		plugService.insert(plug); 
    		
    		ps.setLastPlugId(plug.getPlugId());
    		plugSameService.updateById(ps);
    	} else {
    		plug.setPlugId(null);
    		plug.setPlugVersion(plug.getPlugVersion() + 1);
    		
    		plugService.insert(plug);
    		
    		PlugSamePO ps = new PlugSamePO(); 
    			ps.setPlugSameId(plug.getPlugSameId());
    			ps.setLastPlugId(plug.getPlugId());
			plugSameService.updateById(ps);
    	}
    	
    	List<ComponentPropDocPO> list = plugVO.getComponentPropDocs();
    	
    	if (list != null && !list.isEmpty()) { 
    		list.forEach(e -> { 
    			e.setComponentPropDocId(null);
    			e.setPlugId(plug.getPlugId()); 
    		});
    	
    		componentPropDocService.insertBatch(list); 
    	}
    	
    	return 1; 
    } 
    /**
	 *查找
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/select", method = RequestMethod.POST)
    public Object retrieve(@RequestBody SearchEntity search) { 
		PlugSamePO ps = new PlugSamePO();
		UserPO user = new UserPO();
		List<Integer> useIds = new ArrayList<>();
 
		if (search.getType() != null) {
			if (search.getType().equals("self")) { 
				user.setUserId(ThreadlocalManager.getThreadContext().getUserId());
			} else if (search.getType().equals("use")) {
				MultipleSelect ums = MultipleSelect.newInstance(SystemData.plugSelect, new PlugUsePO(), new PlugPO());
					ums.where("plug_use").eq("userId", ThreadlocalManager.getThreadContext().getUserId());
			
				multipleService.multipleSelect(ums).getData().forEach(el -> {
					Integer plugSameId = (Integer)el.get("plugSameId");
					if (!useIds.contains(plugSameId)) {
						useIds.add(plugSameId);
					}
				});
				
				if (useIds.isEmpty()) {
					MultipleResult rs = new MultipleResult();
					rs.setData(new ArrayList<>());
					rs.setPage(0, 0, 0);
					return rs;
				}
			} 
		} 
		
		MultipleSelect ms = MultipleSelect.newInstance(SystemData.plugSelect + ",${user}", ps, new PlugPO(), user);
			ms.getJoin().set(0, "plug as plug on plug.plug_id = plugsame.last_plug_id");
			
			if (!useIds.isEmpty()) {
				ms.where("${plug_same}").in("plugSameId", useIds);
			} 
			
			ms.where("${plug}")
				.eq(search.getPlugType() != null, "plugType", search.getPlugType())
				.division()
				.or()
				.like("plugTags", search.getKeyword())
				.like("plugName", search.getKeyword())
				.like("plugDes", search.getKeyword());
		
			ms.setOrderBy("${plug}.plugStarCount desc"); 
			ms.setPage(search.getPageNo(), search.getPageSize()); 
			
		MultipleResult result = multipleService.multipleSelect(ms); 
		
		List<Integer> plugSameIds = new ArrayList<>();  
		result.getData().forEach(el -> {
			plugSameIds.add((Integer)el.get("plugSameId"));
		}); 
		
		List<PlugPO> plugs = null;
		List<Map<String, Object>> uses = null;
		if (!plugSameIds.isEmpty()) {
			Wrapper<PlugPO> ew = new EntityWrapper<>();
			ew.in("plug_same_id", plugSameIds); 
			//没必要的大流量不查
			ew.setSqlSelect("plug_id,plug_same_id,plug_tname,user_id,plug_version");
			plugs = plugService.selectList(ew); 
			//uses
			MultipleSelect ums = MultipleSelect.newInstance(SystemData.plugSelect, new PlugUsePO(), new PlugPO()); 
				ums.where("plug").in("plugSameId", plugSameIds); 
				ums.where("plug_use").eq("userId", ThreadlocalManager.getThreadContext().getUserId());
			
			uses = multipleService.multipleSelect(ums).getData();
		}
		
		Map<Integer, List<PlugPO>> plugMaps = new HashMap<>();
		if (plugs != null) {
			plugs.forEach(plug -> {
				List<PlugPO> mps = plugMaps.get(plug.getPlugSameId());
				if (mps == null) {
					mps = new ArrayList<>();
				}
				mps.add(plug);
				plugMaps.put(plug.getPlugSameId(), mps);
			});
		}
		
		Map<Integer, List<Map<String, Object>>> useMaps = new HashMap<>();
		if (uses != null) {
			uses.forEach(use -> {
				Integer plugSameId = (Integer)use.get("plugSameId");
				List<Map<String, Object>> us = useMaps.get(plugSameId);
				if (us == null) {
					us = new ArrayList<>();
				}
				us.add(use);
				useMaps.put(plugSameId, us);
			});
		}
		 
		result.getData().forEach(el -> {
			Integer plugSameId = (Integer)el.get("plugSameId");
			List<PlugPO> mps = plugMaps.get(plugSameId);
			if (mps == null) {
				mps = new ArrayList<>();
			}
			el.put("sames", mps);
			
			List<Map<String, Object>> us = useMaps.get(plugSameId);
			if (us == null) {
				us = new ArrayList<>(); 
			}
			el.put("uses", us);
		});  
		
		return result;
    }  
	/**
	 *查找
	 **/
	@ApiOperation(value="plugSameId",notes="plugSameId")
	@RequestMapping(value="/selectBySameId/{plugSameId}", method = RequestMethod.POST)
    public Object selectBySameId(@PathVariable Integer plugSameId) {
		if (plugSameId == null) return new ArrayList<>();
		
		PlugPO plug = new PlugPO();
		plug.setPlugSameId(plugSameId);
		
		return plugService.selectList(new EntityWrapper<PlugPO>(plug));
    }  
	/**
	 *查找
	 **/
	@ApiOperation(value="selectBySameIds",notes="selectBySameIds")
	@RequestMapping(value="/selectBySameIds", method = RequestMethod.POST)
    public Object selectBySameIds(@RequestBody List<Integer> plugSameIds) {
		if (plugSameIds == null || plugSameIds.isEmpty()) return new String[] {};
		
		Wrapper<PlugPO> en = new EntityWrapper<>();
			en.in("plug_same_id", plugSameIds);
		
		return plugService.selectList(en);
		 
    }  
	/**
	 *查找
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/selectById/{plugId}", method = RequestMethod.POST)
    public Object selectById(@PathVariable Integer plugId) { 
		
		PlugPO plug = new PlugPO();
		plug.setPlugId(plugId);
		 
		MultipleSelect ms = MultipleSelect.newInstance("${user}", plug, new UserPO());
		
		List<Map<String, Object>> result = multipleService.multipleSelect(ms).getData();
		
		if (result.isEmpty()) return -1; 
		
		Map<String, Object> rst0 = result.get(0); 
		Integer plugSameId = (Integer)result.get(0).get("plugSameId");
		PlugPO plug2 = new PlugPO();
			plug2.setPlugSameId(plugSameId); 
		Wrapper<PlugPO> ew = new EntityWrapper<>(plug2);  
		
		rst0.put("sames", plugService.selectList(ew));
		
		PlugPO plug3 = new PlugPO(); 
			plug3.setPlugSameId(plugSameId);
		MultipleSelect ums = MultipleSelect.newInstance("${plug}", new PlugUsePO(), plug3);
			ums.where("plug_use").eq("userId", ThreadlocalManager.getThreadContext().getUserId());
		
		rst0.put("uses", multipleService.multipleSelect(ums).getData());
		
		return rst0;
    }  
	/**
	 *查找
	 **/
	@ApiOperation(value="codes",notes="codes")
	@RequestMapping(value="/{plugUid}/codeNames", method = RequestMethod.POST)
    public Object selectCodeNames(@PathVariable String plugUid) { 
		
		 return CosUtil.listFolderFileNames(plugUid, true);
    } 
		 
}
