package com.yaj.freedomen.business.issuecomment.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.yaj.common.email.EmailUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
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
import com.yaj.freedomen.business.user.entity.po.UserPO;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;


@Api(value="")
@EnableAutoConfiguration
@RestController
@RequestMapping(value="/IssueComment")
public class IssueCommentController {
	static ExecutorService pool = Executors.newFixedThreadPool(1);
	@Autowired
	private IssueCommentService issueCommentService; 
	@Autowired
	private MultipleService multipleService;
	@Autowired
	private IssueService issueService;
	@Autowired
	private EmailUtil emailUtil;
	/**
	 *添加/修改 
	 **/
	@ApiOperation(value="添加、修改",notes="添加")
	@RequestMapping(value="/insertOrUpdate", method=RequestMethod.POST)
	@Transactional
    public Object insertOrUpdate(@RequestBody IssueCommentPO issueComment) {
		if (issueComment.getIssueId() == null) {
			return -1;
		} else {
			//评论数加1
			IssuePO issue = issueService.selectById(issueComment.getIssueId());
			issue.setIssueCommentCount(issue.getIssueCommentCount() + 1);
			issueService.updateById(issue);
		}
		issueComment.setUserId(ThreadlocalManager.getThreadContext().getUserId());
		//提示，不影响正常程序与执行时间
		try {
			pool.submit(() -> {
				if (issueComment.getIssueCommentId() == null) {
					MultipleSelect multipleSelect = MultipleSelect.newInstance("${user}.userId,${user}.userEmail", new IssuePO(), new UserPO());
					multipleSelect.where("${issue}")
							.eq("issueId", issueComment.getParentId() != null ? issueComment.getParentId() : issueComment.getIssueId());

					MultipleResult result = multipleService.multipleSelect(multipleSelect);

					String email = result.getData().get(0).get("userEmail").toString();
					Integer userId = (Integer) result.getData().get(0).get("userId");

					if (!userId.equals(issueComment.getUserId())) {
						emailUtil.sendMessage(email, "Issue 回复", "详情请登录网站查看。");
					}
				}
			});
			pool.shutdown();
		} catch (Exception e) { }
		
		return issueCommentService.insertOrUpdate(issueComment);
    }
	/**
	 * digui 找到子children 通过  perantId
	 * @param list
	 * @return
	 */
	private List<Map<String, Object>> getChildrenList(Map<String, Object> item, List<Map<String, Object>> list) {
		Object issueCommentId = item.get("issueCommentId");
		
		List<Map<String, Object>> result = new ArrayList<Map<String,Object>>(); 
		List<Map<String, Object>> nextList = new ArrayList<Map<String,Object>>();
		
		list.stream().forEach(el -> {
			if (el.get("parentId") != null && el.get("parentId").equals(issueCommentId) ) {
				result.add(el);
			} else {
				nextList.add(el);
			}
		});
		
		if (!result.isEmpty()) {
			result.stream().forEach(el -> {
				el.put("children", getChildrenList(el, nextList));
			});
		}
		
		return result;
	}
	/**
	 *添加 
	 **/
	@ApiOperation(value="添加",notes="添加")
	@RequestMapping(value="/select", method=RequestMethod.POST)
    public Object select(@RequestBody SearchEntity pageEntity) {  

		IssueCommentPO issueComment = new IssueCommentPO();
		issueComment.setIssueId(pageEntity.getIssueId());
		
		MultipleSelect ms = MultipleSelect.newInstance("${1}.userId,${1}.userName,${1}.userAvatar,${1}.userMajor,${2}.issueCommentStarId,${2}.issueCommentStarIam", issueComment, new UserPO(), new IssueCommentStarPO());
			ms.where("${0}").isNull("parentId");
			ms.setPage(pageEntity.getPageNo(), pageEntity.getPageSize()); 
			ms.setOrderBy("${0}.issueCommentStar desc", "${0}.createdAt");
		MultipleResult back = multipleService.multipleSelect(ms);
		
		MultipleSelect mselect = MultipleSelect.newInstance("${1}.userId,${1}.userName,${1}.userAvatar,${1}.userMajor,${2}.issueCommentStarId,${2}.issueCommentStarIam", issueComment, new UserPO(), new IssueCommentStarPO());
			mselect.where("${0}").isNotNull("parentId"); 
			ms.setOrderBy("${0}.issueCommentStar desc", "${0}.createdAt");
		MultipleResult back2 = multipleService.multipleSelect(mselect);
		
		if (!back.getData().isEmpty()) {
			back.getData().stream().forEach(el -> {
				el.put("children", getChildrenList(el, back2.getData()));
			});
		}
		
		return back;
    }   
	/**
	 *删除
	 **/
	@ApiOperation(value="delete",notes="delete")
	@RequestMapping(value="/delete", method=RequestMethod.POST)
    public Object delete(@RequestBody IssueCommentPO issueComment) {
		return issueCommentService.deleteById(issueComment.getUserId()); 
    } 
}
