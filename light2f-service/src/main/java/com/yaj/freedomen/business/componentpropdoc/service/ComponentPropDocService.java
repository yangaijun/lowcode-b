package com.yaj.freedomen.business.componentpropdoc.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.componentpropdoc.entity.po.ComponentPropDocPO;
import com.yaj.freedomen.business.componentpropdoc.mapper.ComponentPropDocMapper;

/*
 * @Description: 组件属性文档
 * @date: 2022-06-10
 */
@Service
public class ComponentPropDocService extends ServiceImpl<ComponentPropDocMapper, ComponentPropDocPO> {

    @Resource
    ComponentPropDocMapper componentPropDocMapper;

}
