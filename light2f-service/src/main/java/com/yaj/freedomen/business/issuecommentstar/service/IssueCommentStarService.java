package com.yaj.freedomen.business.issuecommentstar.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.issuecommentstar.entity.po.IssueCommentStarPO;
import com.yaj.freedomen.business.issuecommentstar.mapper.IssueCommentStarMapper;

/*
 * @Description: 评论评分
 * @date: 2021-11-22
 */
@Service
public class IssueCommentStarService extends ServiceImpl<IssueCommentStarMapper, IssueCommentStarPO> {

    @Resource
    IssueCommentStarMapper issueCommentStarMapper;

}
