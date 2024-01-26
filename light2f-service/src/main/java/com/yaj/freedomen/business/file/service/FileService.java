package com.yaj.freedomen.business.file.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.file.entity.po.FilePO;
import com.yaj.freedomen.business.file.mapper.FileMapper;

/*
 * @Description: 文件
 * @date: 2022-02-23
 */
@Service
public class FileService extends ServiceImpl<FileMapper, FilePO> {

    @Resource
    FileMapper fileMapper;

}
