package com.yaj.freedomen.business.notice.controller;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.yaj.common.threadlocal.ThreadlocalManager;
import com.yaj.freedomen.business.initcode.entity.po.InitCodePO;
import com.yaj.freedomen.business.initcode.service.InitCodeService;
import com.yaj.freedomen.business.notice.entity.po.NoticePO;
import com.yaj.freedomen.business.notice.service.NoticeService;
import com.yaj.freedomen.business.user.entity.po.UserPO;
import com.yaj.freedomen.business.user.service.UserService;
import com.yaj.freedomen.config.Env;
import com.yaj.freedomen.config.SystemData;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@Api(value="")
@EnableAutoConfiguration
@RestController
@RequestMapping(value="/Notice")
public class NoticeController {
	@Value("${base.env}")
	private String env;
	@Autowired
	private NoticeService noticeService;
	@Autowired
	private UserService userService;

	@ApiOperation(value="发送通知",notes="发送通知")
	@RequestMapping(value="/hasPermission", method = RequestMethod.POST)
	public Object hasPermission() {
		Integer currentUserId = ThreadlocalManager.getThreadContext().getUserId();

		if (!env.equals(Env.Prod)) {
			return true;
		}

		return currentUserId.equals(SystemData.expUserId);
	}
	@Data
	static class SendNoticeParam extends NoticePO {
		private String email;
	}
	/**
	 *查找單個
	 **/
	@ApiOperation(value="发送通知",notes="发送通知")
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
	@RequestMapping(value="/sendNotice", method = RequestMethod.POST)
    public Object sendNotice(@RequestBody SendNoticeParam param) {
		Integer currentUserId = ThreadlocalManager.getThreadContext().getUserId();
		if (env.equals(Env.Prod) && !currentUserId.equals(SystemData.expUserId)) {
			return -1;
		}


		Wrapper<UserPO> userWrapper = new EntityWrapper<>();
		userWrapper.setSqlSelect("user_id userId")
				.eq(param.getEmail() != null,"user_email", param.getEmail());

		List<UserPO> users = userService.selectList(userWrapper);
		List<NoticePO> list = new ArrayList<>();

		users.forEach(el -> {
			NoticePO item = new NoticePO();
			item.setUserId(el.getUserId());
			item.setNoticeTitle(param.getNoticeTitle());
			item.setNoticeContent(param.getNoticeContent());
			item.setSendUserId(currentUserId);

			list.add(item);
		});

		if (!list.isEmpty()) {
			noticeService.insertBatch(list, 100);
		}

		return list.size();
    }
	/**
	 *添加 
	 **/
	@ApiOperation(value="全部已读",notes="全部已读")
	@RequestMapping(value="/isAllRead", method=RequestMethod.POST)
    public Object isAllRead(
    		@RequestBody NoticePO noticePO) {

		noticePO.setUserId(ThreadlocalManager.getThreadContext().getUserId());
		Wrapper<NoticePO> en =  new EntityWrapper<>(noticePO);

		NoticePO updateNotice = new NoticePO();
		updateNotice.setNoticeIsRead(1);

        return noticeService.update(updateNotice, en);
    } 
	/**
	 *查找單個
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/select", method = RequestMethod.POST)
    public Object selectList(@RequestBody NoticePO noticePO) {
		noticePO.setUserId(ThreadlocalManager.getThreadContext().getUserId());

		Wrapper<NoticePO> en = new EntityWrapper<>(noticePO);
		en.orderBy("created_at desc");
        return noticeService.selectList(en);
    }

	/**
	 *查找單個
	 **/
	@ApiOperation(value="未读数量",notes="未读数量")
	@RequestMapping(value="/getBadgeCount", method = RequestMethod.POST)
	public Object getBadgeCount(@RequestBody NoticePO noticePO) {
		noticePO.setUserId(ThreadlocalManager.getThreadContext().getUserId());
		noticePO.setNoticeIsRead(0);
		Wrapper<NoticePO> en = new EntityWrapper<>(noticePO);

		return noticeService.selectCount(en);
	}
}
