package com.yaj.freedomen.business.initcode.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.initcode.entity.po.InitCodePO;
import com.yaj.freedomen.business.initcode.mapper.InitCodeMapper;

/*
 * @Description: 页面初始化代码
 * @date: 2021-07-06
 */
@Service
public class InitCodeService extends ServiceImpl<InitCodeMapper, InitCodePO> {

    @Resource
    InitCodeMapper initCodeMapper;

}
