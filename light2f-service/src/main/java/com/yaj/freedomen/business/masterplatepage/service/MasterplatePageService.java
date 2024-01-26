package com.yaj.freedomen.business.masterplatepage.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.masterplatepage.entity.po.MasterplatePagePO;
import com.yaj.freedomen.business.masterplatepage.mapper.MasterplatePageMapper;

/*
 * @Description: 页面母版
 * @date: 2021-08-09
 */
@Service
public class MasterplatePageService extends ServiceImpl<MasterplatePageMapper, MasterplatePagePO> {

    @Resource
    MasterplatePageMapper masterplatePageMapper;

}
