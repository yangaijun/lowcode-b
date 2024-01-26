package com.yaj.freedomen.business.plugfav.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.plugfav.entity.po.PlugFavPO;
import com.yaj.freedomen.business.plugfav.mapper.PlugFavMapper;

/*
 * @Description: 收藏
 * @date: 2022-03-02
 */
@Service
public class PlugFavService extends ServiceImpl<PlugFavMapper, PlugFavPO> {

    @Resource
    PlugFavMapper plugFavMapper;

}
