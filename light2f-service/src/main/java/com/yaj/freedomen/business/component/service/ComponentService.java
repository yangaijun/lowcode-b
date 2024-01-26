package com.yaj.freedomen.business.component.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.component.entity.po.ComponentPO;
import com.yaj.freedomen.business.component.mapper.ComponentMapper;

/*
 * @Description: 项目组件
 * @date: 2021-08-03
 */
@Service
public class ComponentService extends ServiceImpl<ComponentMapper, ComponentPO> {

    @Resource
    ComponentMapper componentMapper;

}
