package com.yaj.freedomen.business.pluguse.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.pluguse.entity.po.PlugUsePO;
import com.yaj.freedomen.business.pluguse.mapper.PlugUseMapper;

/*
 * @Description: 用户使用的组件
 * @date: 2022-03-11
 */
@Service
public class PlugUseService extends ServiceImpl<PlugUseMapper, PlugUsePO> {

    @Resource
    PlugUseMapper plugUseMapper;

}
