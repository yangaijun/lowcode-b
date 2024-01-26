package com.yaj.freedomen.business.service.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.service.entity.po.ServicePO;
import com.yaj.freedomen.business.service.mapper.ServiceMapper;

/*
 * @Description: 接口
 * @date: 2021-07-13
 */
@Service
public class ServiceService extends ServiceImpl<ServiceMapper, ServicePO> {

    @Resource
    ServiceMapper serviceMapper;

}
