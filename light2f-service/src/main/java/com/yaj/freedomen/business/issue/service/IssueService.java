package com.yaj.freedomen.business.issue.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.issue.entity.po.IssuePO;
import com.yaj.freedomen.business.issue.mapper.IssueMapper;

/*
 * @Description: 问题
 * @date: 2021-11-18
 */
@Service
public class IssueService extends ServiceImpl<IssueMapper, IssuePO> {

    @Resource
    IssueMapper issueMapper;

}
