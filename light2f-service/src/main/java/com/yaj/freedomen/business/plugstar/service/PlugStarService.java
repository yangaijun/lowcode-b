package com.yaj.freedomen.business.plugstar.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.plugstar.entity.po.PlugStarPO;
import com.yaj.freedomen.business.plugstar.mapper.PlugStarMapper;

/*
 * @Description: 
 * @date: 2022-03-02
 */
@Service
public class PlugStarService extends ServiceImpl<PlugStarMapper, PlugStarPO> {

    @Resource
    PlugStarMapper plugStarMapper;

}
