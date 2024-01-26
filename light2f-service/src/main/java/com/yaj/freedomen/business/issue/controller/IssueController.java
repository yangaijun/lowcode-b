package com.yaj.freedomen.business.issue.controller;

import java.util.List;

import com.yaj.common.email.EmailUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.yaj.common.multipleselect.MultipleSelect;
import com.yaj.common.multipleselect.service.MultipleService;
import com.yaj.common.threadlocal.ThreadlocalManager;
import com.yaj.freedomen.business.issue.entity.po.IssuePO;
import com.yaj.freedomen.business.issue.entity.vo.SearchEntity;
import com.yaj.freedomen.business.issue.service.IssueService;
import com.yaj.freedomen.business.user.entity.po.UserPO;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import javax.annotation.Resource;


@Api(value="")
@EnableAutoConfiguration
@RestController
@RequestMapping(value="/Issue")
public class IssueController {
	@Autowired
	private IssueService issueService; 
	@Autowired
	private MultipleService multipleService;
	@Autowired
	private EmailUtil emailUtil;
	/**
	 *添加 
	 **/
	@ApiOperation(value="添加",notes="添加")
	@RequestMapping(value="/insertOrUpdate", method=RequestMethod.POST)
    public Object insertOrUpdate(@RequestBody IssuePO issue) {  
		issue.setUserId(ThreadlocalManager.getThreadContext().getUserId());
		if (issue.getIssueId() == null) {
			emailUtil.sendMessage("19230780383@163.com", "Issues", issue.getIssueTitle());
		}
		return issueService.insertOrUpdate(issue);
    }
	/**
	 *查找 
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/select", method=RequestMethod.POST)
    public Object select(@RequestBody SearchEntity pageEntity) {  
		
		MultipleSelect ms = MultipleSelect.newInstance("${1}.userId,${1}.userName,${1}.userAvatar,${1}.userMajor", new IssuePO(), new UserPO());
		ms.where("${0}")
			.division()
			.like("issueTitle", pageEntity.getKeyword())
			.or()
			.like("issueContent", pageEntity.getKeyword());
		
		ms.setOrderBy("${issue}.createdAt DESC");
		ms.setPage(pageEntity.getPageNo(), pageEntity.getPageSize());

		return multipleService.multipleSelect(ms);
    }  
	/**
	 *查找 
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/selectById/{issueId}", method=RequestMethod.POST)
    public Object selectById(@PathVariable Integer issueId) {  
		IssuePO issue = new IssuePO();
		issue.setIssueId(issueId);
		
		MultipleSelect ms = MultipleSelect.newInstance("${1}.userId,${1}.userName,${1}.userAvatar,${1}.userMajor", issue, new UserPO());
		 
		List<?> result = multipleService.multipleSelect(ms).getData();
		if (result.isEmpty()) return -1;
		
		return result.get(0);
    }  
	/**
	 *删除
	 **/
	@ApiOperation(value="delete",notes="delete")
	@RequestMapping(value="/delete", method=RequestMethod.POST)
    public Object delete(@RequestBody IssuePO issue) {
		return issueService.deleteById(issue.getIssueId()); 
    } 
}
