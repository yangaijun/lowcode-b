package com.yaj.freedomen.business.log.controller;

import com.yaj.common.multipleselect.MultipleResult;
import com.yaj.common.multipleselect.MultipleSelect;
import com.yaj.common.multipleselect.service.MultipleService;
import com.yaj.common.threadlocal.ThreadlocalManager;
import com.yaj.freedomen.business.issue.entity.po.IssuePO;
import com.yaj.freedomen.business.issue.service.IssueService;
import com.yaj.freedomen.business.issuecomment.entity.po.IssueCommentPO;
import com.yaj.freedomen.business.issuecomment.entity.vo.SearchEntity;
import com.yaj.freedomen.business.issuecomment.service.IssueCommentService;
import com.yaj.freedomen.business.issuecommentstar.entity.po.IssueCommentStarPO;
import com.yaj.freedomen.business.log.entity.po.LogPO;
import com.yaj.freedomen.business.log.service.LogService;
import com.yaj.freedomen.business.user.entity.po.UserPO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Api(value="")
@EnableAutoConfiguration
@RestController
@RequestMapping(value="/Log")
public class LogController {
	@Autowired
	private LogService logService;

	/**
	 *添加/修改 
	 **/
	@ApiOperation(value="添加、修改",notes="添加")
	@RequestMapping(value="/insertOrUpdate", method=RequestMethod.POST)
	@Transactional
    public Object insertOrUpdate(@RequestBody LogPO log) {
		log.setUserId(ThreadlocalManager.getThreadContext().getUserId());

		return logService.insertOrUpdate(log);
    }
}
