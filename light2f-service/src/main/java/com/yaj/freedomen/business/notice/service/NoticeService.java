package com.yaj.freedomen.business.notice.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.notice.entity.po.NoticePO;
import com.yaj.freedomen.business.notice.mapper.NoticeMapper;

/*
 * @Description: 
 * @date: 2024-01-16
 */
@Service
public class NoticeService extends ServiceImpl<NoticeMapper, NoticePO> {

    @Resource
    NoticeMapper noticeMapper;

}
