package com.yaj.freedomen.business.issuecommentstar.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yaj.common.threadlocal.ThreadlocalManager;
import com.yaj.freedomen.business.issuecomment.entity.po.IssueCommentPO;
import com.yaj.freedomen.business.issuecomment.service.IssueCommentService;
import com.yaj.freedomen.business.issuecommentstar.entity.po.IssueCommentStarPO;
import com.yaj.freedomen.business.issuecommentstar.service.IssueCommentStarService;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
 

@Api(value="")
@EnableAutoConfiguration
@RestController
@RequestMapping(value="/IssueCommentStar")
public class IssueCommentStarController {
	@Autowired
	private IssueCommentStarService issueCommentStarService;
	@Autowired
	private IssueCommentService issueCommentService;
    /**
	 *修改
	 **/
	@ApiOperation(value="修改",notes="修改")
	@RequestMapping(value="/insertOrUpdate", method=RequestMethod.POST)
    public Object update(@RequestBody IssueCommentStarPO issueCommentStar) {
		issueCommentStar.setUserId(ThreadlocalManager.getThreadContext().getUserId());
		
		Integer issueCommentId = issueCommentStar.getIssueCommentId();
		IssueCommentPO ic = issueCommentService.selectById(issueCommentId);
		
		if (issueCommentStar.getIssueCommentStarIam() == 1) {
			ic.setIssueCommentStar(ic.getIssueCommentStar() + 1);
		} else {
			ic.setIssueCommentStar(ic.getIssueCommentStar() - 1);
		}
		issueCommentService.updateById(ic);
		
		return issueCommentStarService.insertOrUpdate(issueCommentStar);
    } 
}
