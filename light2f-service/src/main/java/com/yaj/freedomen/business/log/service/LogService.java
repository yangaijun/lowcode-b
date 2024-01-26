package com.yaj.freedomen.business.log.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.log.entity.po.LogPO;
import com.yaj.freedomen.business.log.mapper.LogMapper;

/*
 * @Description: 
 * @date: 2023-10-19
 */
@Service
public class LogService extends ServiceImpl<LogMapper, LogPO> {

    @Resource
    LogMapper logMapper;

}
