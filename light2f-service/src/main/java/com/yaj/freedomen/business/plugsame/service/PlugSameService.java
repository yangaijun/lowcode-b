package com.yaj.freedomen.business.plugsame.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.plugsame.entity.po.PlugSamePO;
import com.yaj.freedomen.business.plugsame.mapper.PlugSameMapper;

/*
 * @Description: 每个组件，用于区分版本
 * @date: 2022-07-01
 */
@Service
public class PlugSameService extends ServiceImpl<PlugSameMapper, PlugSamePO> {

    @Resource
    PlugSameMapper plugSameMapper;

}
