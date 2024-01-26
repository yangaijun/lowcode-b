package com.yaj.freedomen.business.masterplateproject.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.masterplateproject.entity.po.MasterplateProjectPO;
import com.yaj.freedomen.business.masterplateproject.mapper.MasterplateProjectMapper;

/*
 * @Description: 项目模板
 * @date: 2021-08-09
 */
@Service
public class MasterplateProjectService extends ServiceImpl<MasterplateProjectMapper, MasterplateProjectPO> {

    @Resource
    MasterplateProjectMapper masterplateProjectMapper;

}
