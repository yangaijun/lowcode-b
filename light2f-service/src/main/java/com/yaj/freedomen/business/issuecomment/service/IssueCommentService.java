package com.yaj.freedomen.business.issuecomment.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.issuecomment.entity.po.IssueCommentPO;
import com.yaj.freedomen.business.issuecomment.mapper.IssueCommentMapper;

/*
 * @Description: 问题评论
 * @date: 2021-11-18
 */
@Service
public class IssueCommentService extends ServiceImpl<IssueCommentMapper, IssueCommentPO> {

    @Resource
    IssueCommentMapper issueCommentMapper;

}
