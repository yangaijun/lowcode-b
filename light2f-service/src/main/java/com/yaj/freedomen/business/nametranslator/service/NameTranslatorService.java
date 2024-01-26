package com.yaj.freedomen.business.nametranslator.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.nametranslator.entity.po.NameTranslatorPO;
import com.yaj.freedomen.business.nametranslator.mapper.NameTranslatorMapper;

/*
 * @Description: 
 * @date: 2022-02-28
 */
@Service
public class NameTranslatorService extends ServiceImpl<NameTranslatorMapper, NameTranslatorPO> {

    @Resource
    NameTranslatorMapper nameTranslatorMapper;

}
