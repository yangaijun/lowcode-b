package com.yaj.freedomen.business.plug.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.plug.entity.po.PlugPO;
import com.yaj.freedomen.business.plug.mapper.PlugMapper;

/*
 * @Description: 组件
 * @date: 2022-02-28
 */
@Service
public class PlugService extends ServiceImpl<PlugMapper, PlugPO> {

    @Resource
    PlugMapper plugMapper;

}
