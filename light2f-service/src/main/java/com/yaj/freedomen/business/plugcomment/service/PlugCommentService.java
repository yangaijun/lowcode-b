package com.yaj.freedomen.business.plugcomment.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.plugcomment.entity.po.PlugCommentPO;
import com.yaj.freedomen.business.plugcomment.mapper.PlugCommentMapper;

/*
 * @Description: 组件评论
 * @date: 2022-03-02
 */
@Service
public class PlugCommentService extends ServiceImpl<PlugCommentMapper, PlugCommentPO> {

    @Resource
    PlugCommentMapper plugCommentMapper;

}
